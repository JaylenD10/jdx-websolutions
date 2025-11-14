import { Resend } from 'resend';

// Initialize Resend (recommended email service)
const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to,
      subject,
      html,
      replyTo,
    });

    if (error) {
      console.error('Email send error:', error);
      throw new Error('Failed to send email');
    }

    return data;
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
}

// Email templates
export const emailTemplates = {
  contactFormNotification: (data: any) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #3B82F6; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { margin-top: 5px; padding: 10px; background-color: white; border-radius: 3px; }
          .footer { margin-top: 20px; padding: 20px; text-align: center; color: #777; font-size: 12px; }
          .services { display: inline-block; background-color: #E0E7FF; padding: 5px 10px; margin: 2px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${data.email}</div>
            </div>
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${data.phone || 'Not provided'}</div>
            </div>
            <div class="field">
              <div class="label">Company:</div>
              <div class="value">${data.company || 'Not provided'}</div>
            </div>
            <div class="field">
              <div class="label">Business Type:</div>
              <div class="value">${data.businessType}</div>
            </div>
            <div class="field">
              <div class="label">Services Interested In:</div>
              <div class="value">
                ${
                  data.services
                    ?.map((s: string) => `<span class="services">${s}</span>`)
                    .join('') || 'None specified'
                }
              </div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${data.message}</div>
            </div>
          </div>
          <div class="footer">
            <p>This message was sent from your website contact form.</p>
          </div>
        </div>
      </body>
    </html>
  `,

  contactFormConfirmation: (name: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #3B82F6; color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
          .button { display: inline-block; padding: 12px 30px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { margin-top: 30px; padding: 20px; text-align: center; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Contacting Us!</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>Thank you for reaching out to us. We've received your message and appreciate your interest in our services.</p>
            <p>Our team will review your inquiry and get back to you within 24 business hours.</p>
            <p>In the meantime, feel free to:</p>
            <ul>
              <li>Browse our <a href="${
                process.env.NEXT_PUBLIC_SITE_URL
              }/services">services</a></li>
              <li>Check out our <a href="${
                process.env.NEXT_PUBLIC_SITE_URL
              }/results">recent work</a></li>
              <li>View our <a href="${
                process.env.NEXT_PUBLIC_SITE_URL
              }/pricing">pricing plans</a></li>
            </ul>
            <center>
              <a href="${
                process.env.NEXT_PUBLIC_SITE_URL
              }" class="button">Visit Our Website</a>
            </center>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${
    process.env.NEXT_PUBLIC_COMPANY_NAME
  }. All rights reserved.</p>
            <p>${process.env.NEXT_PUBLIC_COMPANY_EMAIL} | ${
    process.env.NEXT_PUBLIC_COMPANY_PHONE
  }</p>
          </div>
        </div>
      </body>
    </html>
  `,

  consultationNotification: (data: any) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #8B5CF6; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { margin-top: 5px; padding: 10px; background-color: white; border-radius: 3px; }
          .highlight { background-color: #FEF3C7; padding: 15px; border-left: 4px solid #F59E0B; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Consultation Booking</h2>
          </div>
          <div class="content">
            <div class="highlight">
              <strong>Consultation Date:</strong> ${data.preferredDate}<br>
              <strong>Time:</strong> ${data.preferredTime}<br>
              <strong>Type:</strong> ${data.consultationType}
            </div>
            <div class="field">
              <div class="label">Client Name:</div>
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${data.email}</div>
            </div>
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${data.phone}</div>
            </div>
            <div class="field">
              <div class="label">Company:</div>
              <div class="value">${data.company || 'Not provided'}</div>
            </div>
            <div class="field">
              <div class="label">Budget:</div>
              <div class="value">${data.budget || 'Not specified'}</div>
            </div>
            <div class="field">
              <div class="label">Timeline:</div>
              <div class="value">${data.timeline || 'Not specified'}</div>
            </div>
            <div class="field">
              <div class="label">Project Details:</div>
              <div class="value">${data.projectDetails}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `,

  consultationConfirmation: (data: any) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #8B5CF6; color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
          .appointment-box { background-color: white; border: 2px solid #8B5CF6; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background-color: #8B5CF6; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Consultation Confirmed!</h1>
          </div>
          <div class="content">
            <p>Dear ${data.name},</p>
            <p>Your consultation has been successfully booked. We look forward to discussing your project!</p>
            
            <div class="appointment-box">
              <h3>Appointment Details</h3>
              <p><strong>Date:</strong> ${data.preferredDate}</p>
              <p><strong>Time:</strong> ${data.preferredTime}</p>
              <p><strong>Type:</strong> ${data.consultationType}</p>
              ${
                data.consultationType === 'video'
                  ? '<p><strong>Meeting Link:</strong> Will be sent 30 minutes before the meeting</p>'
                  : ''
              }
              ${
                data.consultationType === 'phone'
                  ? '<p><strong>Phone:</strong> We will call you at the provided number</p>'
                  : ''
              }
              ${
                data.consultationType === 'in-person'
                  ? '<p><strong>Location:</strong> 123 Business St, City, State 12345</p>'
                  : ''
              }
            </div>
            
            <h3>What to Prepare</h3>
            <ul>
              <li>Any specific requirements or features you'd like to discuss</li>
              <li>Examples of designs or websites you like</li>
              <li>Your target audience and business goals</li>
              <li>Questions about our development process</li>
            </ul>
            
            <p>If you need to reschedule, please reply to this email at least 24 hours in advance.</p>
            
            <center>
              <a href="${
                process.env.NEXT_PUBLIC_SITE_URL
              }" class="button">Visit Our Website</a>
            </center>
          </div>
        </div>
      </body>
    </html>
  `,
};
