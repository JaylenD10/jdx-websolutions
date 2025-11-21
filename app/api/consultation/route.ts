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
import { format, isValid, parseISO } from 'date-fns';
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
    let formattedDate = validatedData.preferredDate;
    try {
      // Try to parse and format the date
      const dateObj = parseISO(validatedData.preferredDate);
      if (isValid(dateObj)) {
        formattedDate = format(dateObj, 'MMMM d, yyyy');
      } else {
        // If parsing fails, try with regular Date constructor
        const altDate = new Date(validatedData.preferredDate);
        if (isValid(altDate)) {
          formattedDate = format(altDate, 'MMMM d, yyyy');
        } else {
          // Use the original string if all parsing fails
          console.log(
            'Could not parse date, using original:',
            validatedData.preferredDate
          );
        }
      }
    } catch (dateError) {
      console.log('Date formatting error, using original:', dateError);
      // Keep the original date string
    }
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
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  console.log('=== API CONSULTATION GET ===');
  console.log('Received date:', date);

  try {
    if (!date) {
      return NextResponse.json(
        { success: false, error: 'Date is required', slots: [] },
        { status: 400 }
      );
    }

    // Validate date format
    try {
      parseISO(date);
    } catch {
      return NextResponse.json(
        {
          error: 'Invalid date format. Use MMM d, yyyy',
        },
        { status: 400 }
      );
    }

    // Get available slots from database
    const { getAvailableTimeSlots } = await import('@/lib/db-helpers');
    const availableSlots = await getAvailableTimeSlots(date);
    try {
      console.log('Attempting to fetch from database...');

      // Direct database query for debugging
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      // First, let's check if we can connect to the database
      const timeSlotCount = await prisma.timeSlot.count();
      console.log('Total time slots in database:', timeSlotCount);

      // Get the day of week
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.getDay();
      console.log('Looking for slots for day:', dayOfWeek);

      // Get time slots for this day
      const slots = await prisma.timeSlot.findMany({
        where: {
          dayOfWeek: dayOfWeek,
          isActive: true,
        },
      });
      console.log('Found slots for this day:', slots.length);
      console.log('Slots:', JSON.stringify(slots, null, 2));

      // Format the slots
      const formattedSlots = slots.map((slot) => {
        // Convert 24-hour to 12-hour format
        const [hours, minutes] = slot.startTime.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const formattedTime = `${displayHour
          .toString()
          .padStart(2, '0')}:${minutes} ${ampm}`;

        return {
          time: formattedTime,
          available: true, // For now, all slots are available
        };
      });

      console.log('Formatted slots:', formattedSlots);

      await prisma.$disconnect();

      return NextResponse.json({
        success: true,
        date,
        dayOfWeek,
        totalSlotsInDb: timeSlotCount,
        slotsForDay: slots.length,
        slots: formattedSlots,
      });
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      console.error('Error details:', dbError.message);

      // Return mock data if database fails
      const mockSlots = [
        { time: '09:00 AM', available: true },
        { time: '10:00 AM', available: true },
        { time: '11:00 AM', available: false },
        { time: '02:00 PM', available: true },
        { time: '03:00 PM', available: true },
        { time: '04:00 PM', available: false },
        { time: '05:00 PM', available: true },
      ];

      return NextResponse.json({
        success: true,
        date,
        source: 'mock',
        error: dbError.message,
        slots: mockSlots,
      });
    }
  } catch (error) {
    console.error('Get available slots error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch available slots',
        slots: [],
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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, newDate, newTime } = body;

    if (!bookingId || !newDate || !newTime) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields for rescheduling',
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
          success: false,
          error: 'Booking not found',
        },
        { status: 404 }
      );
    }

    // Check if new slot is available
    const isAvailable = await checkTimeSlotAvailability(newDate, newTime);

    if (!isAvailable) {
      return NextResponse.json(
        {
          success: false,
          message: 'The selected time slot is not available',
          availableSlots: await getAvailableTimeSlots(newDate),
        },
        { status: 400 }
      );
    }

    const newDateTime = combineDateAndTime(newDate, newTime);

    // Reschedule Zoom meeting if it exists
    if (consultation.meetingLink && consultation.notes) {
      const meetingIdMatch = consultation.notes.match(/Zoom Meeting ID: (\d+)/);
      if (meetingIdMatch) {
        const meetingId = parseInt(meetingIdMatch[1]);

        try {
          // Cancel old meeting and create new one
          await cancelConsultationMeeting(meetingId);

          const newZoomMeeting = await createConsultationMeeting(
            consultation.name,
            consultation.email,
            newDateTime,
            consultation.consultationType,
            consultation.projectDetails
          );

          // Update consultation with new meeting details
          await prisma.consultation.update({
            where: { bookingId },
            data: {
              preferredDate: newDateTime,
              preferredTime: newTime,
              meetingLink: newZoomMeeting.meetingUrl,
              notes: `Zoom Meeting ID: ${newZoomMeeting.meetingId}, Password: ${newZoomMeeting.password}\nRescheduled from ${consultation.preferredDate}`,
            },
          });
        } catch (error) {
          console.error('Failed to reschedule Zoom meeting:', error);
        }
      }
    } else {
      // Just update the date and time
      await prisma.consultation.update({
        where: { bookingId },
        data: {
          preferredDate: newDateTime,
          preferredTime: newTime,
          notes:
            (consultation.notes || '') +
            `\nRescheduled from ${consultation.preferredDate}`,
        },
      });
    }

    // Send rescheduling notification emails
    await sendRescheduleEmails(consultation, newDate, newTime);

    return NextResponse.json({
      success: true,
      message: 'Consultation rescheduled successfully',
      newBooking: {
        date: format(parseISO(newDate), 'MMMM d, yyyy'),
        time: newTime,
      },
    });
  } catch (error) {
    console.error('Reschedule consultation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reschedule consultation',
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

async function sendRescheduleEmails(
  consultation: any,
  newDate: string,
  newTime: string
) {
  const emailPromises = [];

  const oldDate = format(consultation.preferredDate, 'MMMM d, yyyy');
  const newFormattedDate = format(parseISO(newDate), 'MMMM d, yyyy');

  // Company notification
  emailPromises.push(
    sendEmail({
      to: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'jdxwebsolutions@gmail.com',
      subject: `Consultation Rescheduled - ${consultation.name}`,
      html: `
      <h2>Consultation Rescheduled</h2>
      <p><strong>Client:</strong> ${consultation.name}</p>
      <p><strong>Old Date:</strong> ${oldDate} at ${consultation.preferredTime}</p>
      <p><strong>New Date:</strong> ${newFormattedDate} at ${newTime}</p>
      <p><strong>Booking ID:</strong> ${consultation.bookingId}</p>
    `,
    })
  );

  // Client confirmation
  emailPromises.push(
    sendEmail({
      to: consultation.email,
      subject: `Consultation Rescheduled - ${newFormattedDate}`,
      html: `
        <h2>Your Consultation Has Been Rescheduled</h2>
        <p>Dear ${consultation.name},</p>
        <p>Your consultation has been successfully rescheduled.</p>
        <p><strong>New Date:</strong> ${newFormattedDate}</p>
        <p><strong>New Time:</strong> ${newTime}</p>
        <p>If you need to make any changes, please contact us.</p>
      `,
    })
  );

  await Promise.all(emailPromises).catch((error) => {
    console.error('Failed to send reschedule emails:', error);
  });
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
