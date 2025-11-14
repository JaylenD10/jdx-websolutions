import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmail, emailTemplates } from '@/lib/email';
import { format, parseISO } from 'date-fns';

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

    // Format date for display
    const formattedDate = format(
      parseISO(validatedData.preferredDate),
      'MMMM d, yyyy'
    );
    const dataWithFormattedDate = {
      ...validatedData,
      preferredDate: formattedDate,
    };

    // Check availability (implement your logic here)
    const isAvailable = await checkAvailability(
      validatedData.preferredDate,
      validatedData.preferredTime
    );

    if (!isAvailable) {
      return NextResponse.json(
        {
          success: false,
          message:
            'This time slot is no longer available. Please choose another time.',
        },
        { status: 400 }
      );
    }

    // Generate booking ID
    const bookingId = generateBookingId();

    // Send notification email to company
    try {
      await sendEmail({
        to: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@yourcompany.com',
        subject: `New Consultation Booking - ${validatedData.name} - ${formattedDate}`,
        html: emailTemplates.consultationNotification(dataWithFormattedDate),
        replyTo: validatedData.email,
      });
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
    }

    // Send confirmation email to client
    try {
      await sendEmail({
        to: validatedData.email,
        subject: `Consultation Confirmed - ${formattedDate} at ${validatedData.preferredTime}`,
        html: emailTemplates.consultationConfirmation(dataWithFormattedDate),
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    // Optional: Create calendar event
    if (process.env.GOOGLE_CALENDAR_ID) {
      await createCalendarEvent(dataWithFormattedDate);
    }

    // Check availability function
    async function checkAvailability(
      date: string,
      time: string
    ): Promise<boolean> {
      // Implement your availability logic here
      // For now, return true (always available)
      // In production, check against calendar API or database

      // Example implementation:
      // const bookedSlots = await getBookedSlots(date)
      // return !bookedSlots.includes(time)

      return true;
    }

    // Generate unique booking ID
    function generateBookingId(): string {
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substring(2, 7);
      return `BOOK-${timestamp}-${randomStr}`.toUpperCase();
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
        message: 'Consultation booked successfully!',
        booking: {
          id: Math.random().toString(36).substr(2, 9),
          ...body,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Consultation booking error:', error);
    return NextResponse.json(
      { message: 'Failed to book consultation' },
      { status: 500 }
    );
  }
}
