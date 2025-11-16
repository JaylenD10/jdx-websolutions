import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmail, emailTemplates } from '@/lib/email';
import {
  createConsultationBooking,
  checkTimeSlotAvailability,
  getAvailableTimeSlots,
} from '@/lib/db-helpers';
import {
  createConsultationMeeting,
  cancelConsultationMeeting,
} from '@/lib/zoom';
import { format, parseISO } from 'date-fns';
import prisma from '@/lib/db';

const consultationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  phone: z.string().min(10, 'Please provide a valid phone number'),
  preferredDate: z.string(),
  preferredTime: z.string(),
  consultationType: z.enum(['video', 'phone', 'in-person']),
  projectDetails: z
    .string()
    .min(20, 'Please provide more details about your project'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();

    //Validate the data
    const validatedData = consultationSchema.parse(body);

    // Validate required fields
    if (
      !body.name ||
      !body.email ||
      !body.preferredDate ||
      !body.preferredTime
    ) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check availability (implement your logic here)
    const isAvailable = await checkTimeSlotAvailability(
      validatedData.preferredDate,
      validatedData.preferredTime
    );

    if (!isAvailable) {
      return NextResponse.json(
        {
          success: false,
          message:
            'This time slot is no longer available. Please choose another time.',
          availableSlots: await getAvailableTimeSlots(
            validatedData.preferredDate
          ),
        },
        { status: 400 }
      );
    }

    // Generate booking ID
    const booking = await createConsultationBooking(validatedData);

    // Format date for display
    const formattedDate = format(
      parseISO(validatedData.preferredDate),
      'MMMM d, yyyy'
    );
    const dataWithFormattedDate = {
      ...validatedData,
      preferredDate: formattedDate,
      bookingId: booking.bookingId,
    };

    // Combine date and time for Zoom
    const meetingDateTime = combineDateAndTime(
      validatedData.preferredDate,
      validatedData.preferredTime
    );

    // Generate meeting link for video consultations
    let meetingDetails: {
      meetingUrl?: string;
      meetingId?: number;
      password?: string;
      startUrl?: string;
    } = {};

    if (validatedData.consultationType === 'video') {
      try {
        const zoomMeeting = await createConsultationMeeting(
          validatedData.name,
          validatedData.email,
          meetingDateTime,
          validatedData.consultationType,
          validatedData.projectDetails
        );

        meetingDetails = {
          meetingUrl: zoomMeeting.meetingUrl,
          meetingId: zoomMeeting.meetingId,
          password: zoomMeeting.password,
          startUrl: zoomMeeting.startUrl,
        };

        // Update booking with meeting details
        await prisma.consultation.update({
          where: { id: booking.id },
          data: {
            meetingLink: zoomMeeting.meetingUrl,
            notes: `Zoom Meeting ID: ${zoomMeeting.meetingId}, Password: ${zoomMeeting.password}`,
          },
        });
      } catch (zoomError) {
        console.error('Failed to create Zoom meeting:', zoomError);
        // Continue without Zoom meeting - can be added manually later
        meetingDetails.meetingUrl = 'Will be sent separately';
      }
    }

    // Prepare data for emails
    const emailData = {
      ...validatedData,
      preferredDate: formattedDate,
      bookingId: booking.bookingId,
      meetingLink: meetingDetails.meetingUrl,
      meetingPassword: meetingDetails.password,
      hostUrl: meetingDetails.startUrl, // For internal notification
    };

    // Send notification emails
    const emailPromises = [];

    // Send notification email to company
    emailPromises.push(
      sendEmail({
        to:
          process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'jdxwebsolutions@gmail.com',
        subject: `New Consultation Booking - ${validatedData.name} - ${formattedDate}`,
        html: emailTemplates.consultationNotification(emailData),
        replyTo: validatedData.email,
      })
    );

    // Send confirmation email to client
    emailPromises.push(
      sendEmail({
        to: validatedData.email,
        subject: `Consultation Confirmed - ${formattedDate} at ${validatedData.preferredTime}`,
        html: emailTemplates.consultationConfirmation(emailData),
      })
    );

    // Send emails (don't wait for them to complete)
    Promise.all(emailPromises).catch((error) => {
      console.error('Email sending error:', error);
    });

    // Optional: Create calendar event
    if (process.env.GOOGLE_CALENDAR_ID) {
      await createCalendarEvent(dataWithFormattedDate);
    }

    // Here you would typically:
    // 1. Check calendar availability
    // 2. Create calendar event
    // 3. Send confirmation emails
    // 4. Store in database

    console.log('Consultation booking:', body);

    // Example integration with calendar service
    // await createCalendarEvent({
    //   title: `Consultation with ${body.name}`,
    //   date: body.preferredDate,
    //   time: body.preferredTime,
    //   type: body.consultationType
    // })

    return NextResponse.json(
      {
        success: true,
        message: 'Your consultation has been booked successfully!',
        booking: {
          id: booking.bookingId,
          date: formattedDate,
          time: validatedData.preferredTime,
          type: validatedData.consultationType,
          meetingDetails:
            validatedData.consultationType === 'video'
              ? {
                  url: meetingDetails.meetingUrl,
                  password: meetingDetails.password,
                }
              : undefined,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Consultation booking error:', error);

    return NextResponse.json(
      { success: false, message: 'Failed to book consultation' },
      { status: 500 }
    );
  }
}

// GET endpoint to check available slots
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        {
          error: 'Date parameter is required',
        },
        { status: 400 }
      );
    }

    // Validate date format
    try {
      parseISO(date);
    } catch {
      return NextResponse.json(
        {
          error: 'Invalid date format. Use YYYY-MM-DD',
        },
        { status: 400 }
      );
    }

    // Get available slots from database
    const availableSlots = await getAvailableTimeSlots(date);

    return NextResponse.json({
      success: true,
      date,
      slots: availableSlots,
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch available slots',
      },
      { status: 500 }
    );
  }
}

// DELETE endpoint to cancel consultation
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return NextResponse.json(
        {
          error: 'Booking ID is required',
        },
        { status: 400 }
      );
    }

    // Find the consultation
    const consultation = await prisma.consultation.findUnique({
      where: { bookingId },
    });

    if (!consultation) {
      return NextResponse.json(
        {
          error: 'Booking not found',
        },
        { status: 404 }
      );
    }

    // Cancel Zoom meeting if it exists
    if (consultation.meetingLink && consultation.notes) {
      const meetingIdMatch = consultation.notes.match(/Zoom Meeting ID: (\d+)/);
      if (meetingIdMatch) {
        const meetingId = parseInt(meetingIdMatch[1]);
        await cancelConsultationMeeting(meetingId);
      }
    }

    // Update booking status
    await prisma.consultation.update({
      where: { bookingId },
      data: {
        status: 'CANCELLED',
        notes:
          consultation.notes + '\nCancelled at: ' + new Date().toISOString(),
      },
    });

    // Send cancellation emails
    await sendCancellationEmails(consultation);

    return NextResponse.json({
      success: true,
      message: 'Consultation cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel consultation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to cancel consultation',
      },
      { status: 500 }
    );
  }
}

//Helpers

function combineDateAndTime(date: string, time: string): Date {
  const dateObj = parseISO(date);
  const timeParts = time.match(/(\d+):(\d+)\s*(AM|PM)/i);

  if (timeParts) {
    let hours = parseInt(timeParts[1]);
    const minutes = parseInt(timeParts[2]);
    const meridiem = timeParts[3].toUpperCase();

    if (meridiem === 'PM' && hours !== 12) {
      hours += 12;
    } else if (meridiem === 'AM' && hours === 12) {
      hours = 0;
    }

    dateObj.setHours(hours, minutes, 0, 0);
  }

  return dateObj;
}

async function sendCancellationEmails(consultation: any) {
  const emailPromises = [];

  // Send cancellation notification to company
  emailPromises.push(
    sendEmail({
      to: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'jdxwebsolutions@gmail.com',
      subject: `Consultation Cancelled - ${consultation.name}`,
      html: emailTemplates.consultationCancellation({
        ...consultation,
        type: 'company',
      }),
    })
  );

  // Send cancellation confirmation to client
  emailPromises.push(
    sendEmail({
      to: consultation.email,
      subject: 'Your Consultation Has Been Cancelled',
      html: emailTemplates.consultationCancellation({
        ...consultation,
        type: 'client',
      }),
    })
  );

  await Promise.all(emailPromises);
}

// Optional: Create Google Calendar event
async function createCalendarEvent(data: any) {
  try {
    // Implement Google Calendar API integration
    // This is a placeholder for the actual implementation
    console.log('Creating calendar event:', data);

    // Example with Google Calendar API:
    // const calendar = google.calendar({ version: 'v3', auth })
    // const event = {
    //   summary: `Consultation with ${data.name}`,
    //   description: data.projectDetails,
    //   start: { dateTime: combineDateAndTime(data.preferredDate, data.preferredTime) },
    //   end: { dateTime: addHours(combineDateAndTime(data.preferredDate, data.preferredTime), 1) },
    //   attendees: [{ email: data.email }],
    // }
    // await calendar.events.insert({ calendarId: process.env.GOOGLE_CALENDAR_ID, resource: event })
  } catch (error) {
    console.error('Calendar event creation error:', error);
  }
}
