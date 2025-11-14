import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmail, emailTemplates } from '@/lib/email';
import { saveContactSubmission } from '@/lib/db-helpers';

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  businessType: z.enum([
    'individual',
    'startup',
    'small-business',
    'enterprise',
  ]),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  services: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    // Validate the data
    const validatedData = contactSchema.parse(body);
    // Save to database
    const submission = await saveContactSubmission(validatedData);

    // Send notification email to company
    try {
      await sendEmail({
        to:
          process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'jdxwebsolutions@gmail.com',
        subject: `New Contact Form Submission from ${validatedData.name}`,
        html: emailTemplates.contactFormNotification(validatedData),
        replyTo: validatedData.email,
      });
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Continue even if notification fails
    }

    // Send confirmation email to user
    try {
      await sendEmail({
        to: validatedData.email,
        subject: `Thank you for contacting ${process.env.NEXT_PUBLIC_COMPANY_NAME}`,
        html: emailTemplates.contactFormConfirmation(validatedData.name),
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Continue even if confirmation fails
    }

    // Here you would typically:
    // 1. Validate the data
    // 2. Send email notification
    // 3. Store in database
    // 4. Integrate with CRM

    // For demo purposes, we'll just log and return success
    console.log('Contact form submission:', body);

    // Example email sending (you'd need to set up a service like SendGrid, Resend, etc.)
    // await sendEmail({
    //   to: 'your-email@example.com',
    //   subject: `New Contact from ${body.name}`,
    //   body: formatEmailBody(body)
    // })

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully!',
        submissionId: submission.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { message: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Mock available time slots
    // In production, check against your calendar/database
    const availableSlots = [
      { time: '09:00 AM', available: true },
      { time: '10:00 AM', available: true },
      { time: '11:00 AM', available: false },
      { time: '02:00 PM', available: true },
      { time: '03:00 PM', available: true },
      { time: '04:00 PM', available: false },
      { time: '05:00 PM', available: true },
    ];

    return NextResponse.json({
      date,
      slots: availableSlots,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch available slots' },
      { status: 500 }
    );
  }
}
