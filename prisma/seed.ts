import {
  PrismaClient,
  BusinessType,
  ConsultationType,
  ContactStatus,
  BookingStatus,
} from '@prisma/client';
import { initializeDefaultTimeSlots } from '../lib/db-helpers';
import { addDays, subDays, setHours, setMinutes } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Initialize default time slots
  await initializeDefaultTimeSlots();
  console.log('✅ Time slots created');

  // Create email templates
  const emailTemplates = [
    {
      name: 'contact_notification',
      subject: 'New Contact Form Submission from {{name}}',
      content: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> {{name}}</p>
        <p><strong>Email:</strong> {{email}}</p>
        <p><strong>Phone:</strong> {{phone}}</p>
        <p><strong>Company:</strong> {{company}}</p>
        <p><strong>Business Type:</strong> {{businessType}}</p>
        <p><strong>Services:</strong> {{services}}</p>
        <p><strong>Message:</strong> {{message}}</p>
      `,
      variables: [
        'name',
        'email',
        'phone',
        'company',
        'businessType',
        'services',
        'message',
      ],
      isActive: true,
    },
    {
      name: 'contact_confirmation',
      subject: 'Thank you for contacting {{companyName}}',
      content: `
        <h2>Thank you for your message!</h2>
        <p>Dear {{name}},</p>
        <p>We've received your message and will get back to you within 24 hours.</p>
        <p>Best regards,<br>{{companyName}} Team</p>
      `,
      variables: ['name', 'companyName'],
      isActive: true,
    },
    {
      name: 'consultation_notification',
      subject: 'New Consultation Booking - {{name}} - {{date}}',
      content: `
        <h2>New Consultation Booking</h2>
        <p><strong>Booking ID:</strong> {{bookingId}}</p>
        <p><strong>Name:</strong> {{name}}</p>
        <p><strong>Email:</strong> {{email}}</p>
        <p><strong>Phone:</strong> {{phone}}</p>
        <p><strong>Date:</strong> {{date}}</p>
        <p><strong>Time:</strong> {{time}}</p>
        <p><strong>Type:</strong> {{consultationType}}</p>
        <p><strong>Project Details:</strong> {{projectDetails}}</p>
      `,
      variables: [
        'bookingId',
        'name',
        'email',
        'phone',
        'date',
        'time',
        'consultationType',
        'projectDetails',
      ],
      isActive: true,
    },
    {
      name: 'consultation_confirmation',
      subject: 'Consultation Confirmed - {{date}} at {{time}}',
      content: `
        <h2>Your Consultation is Confirmed!</h2>
        <p>Dear {{name}},</p>
        <p>Your consultation has been scheduled for {{date}} at {{time}}.</p>
        <p><strong>Type:</strong> {{consultationType}}</p>
        {{#if meetingLink}}
        <p><strong>Meeting Link:</strong> <a href="{{meetingLink}}">Join Meeting</a></p>
        {{/if}}
        <p>We look forward to speaking with you!</p>
      `,
      variables: ['name', 'date', 'time', 'consultationType', 'meetingLink'],
      isActive: true,
    },
    {
      name: 'consultation_reminder',
      subject: 'Reminder: Consultation Tomorrow at {{time}}',
      content: `
        <h2>Consultation Reminder</h2>
        <p>Dear {{name}},</p>
        <p>This is a friendly reminder about your consultation tomorrow at {{time}}.</p>
        <p><strong>Date:</strong> {{date}}</p>
        <p><strong>Type:</strong> {{consultationType}}</p>
        {{#if meetingLink}}
        <p><strong>Meeting Link:</strong> <a href="{{meetingLink}}">Join Meeting</a></p>
        {{/if}}
        <p>If you need to reschedule, please let us know as soon as possible.</p>
      `,
      variables: ['name', 'date', 'time', 'consultationType', 'meetingLink'],
      isActive: true,
    },
  ];

  for (const template of emailTemplates) {
    await prisma.emailTemplate.upsert({
      where: { name: template.name },
      update: template,
      create: template,
    });
  }
  console.log('✅ Email templates created');

  // Create sample blocked dates (weekends and holidays)
  const blockedDates = [
    {
      date: new Date('2024-12-25'),
      reason: 'Christmas Day',
      allDay: true,
    },
    {
      date: new Date('2024-12-31'),
      reason: "New Year's Eve",
      allDay: true,
    },
    {
      date: new Date('2025-01-01'),
      reason: "New Year's Day",
      allDay: true,
    },
  ];

  for (const blocked of blockedDates) {
    await prisma.blockedDate.create({
      data: blocked,
    });
  }
  console.log('✅ Blocked dates created');

  // Only create sample data in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📝 Creating sample data for development...');

    // Sample contact submissions
    const sampleContacts = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-0101',
        company: 'Tech Startup Inc.',
        businessType: BusinessType.startup,
        services: ['Web Development', 'Mobile Development'],
        message:
          'We need help building our MVP. Looking for a team that can handle both web and mobile development.',
        status: ContactStatus.NEW,
      },
      {
        name: 'Jane Smith',
        email: 'jane@bigcorp.com',
        phone: '555-0102',
        company: 'BigCorp Enterprises',
        businessType: BusinessType.enterprise,
        services: ['Cloud Services', 'API Development', 'Database Design'],
        message:
          "We're looking to modernize our infrastructure and move to the cloud. Need expertise in AWS and microservices.",
        status: ContactStatus.IN_PROGRESS,
      },
      {
        name: 'Mike Johnson',
        email: 'mike@smallbiz.com',
        phone: '555-0103',
        company: 'Small Business Co.',
        businessType: BusinessType.small_business,
        services: ['E-Commerce'],
        message:
          'Need an online store to sell our products. Must integrate with our existing inventory system.',
        status: ContactStatus.RESPONDED,
      },
      {
        name: 'Sarah Williams',
        email: 'sarah@personal.com',
        businessType: BusinessType.individual,
        services: ['Web Development'],
        message:
          'I need a personal portfolio website to showcase my work as a photographer.',
        status: ContactStatus.CLOSED,
      },
    ];

    for (const contact of sampleContacts) {
      await prisma.contact.create({
        data: contact,
      });
    }
    console.log('✅ Sample contacts created');

    // Sample consultation bookings
    const sampleConsultations = [
      {
        bookingId: 'BOOK-SAMPLE-001',
        name: 'Alice Cooper',
        email: 'alice@startup.com',
        phone: '555-0201',
        company: 'Innovation Labs',
        preferredDate: setMinutes(setHours(addDays(new Date(), 2), 10), 0),
        preferredTime: '10:00 AM',
        consultationType: ConsultationType.video,
        projectDetails:
          "We're building a SaaS platform for project management. Need consultation on architecture and tech stack.",
        budget: '$25,000+',
        timeline: '3-6 months',
        status: BookingStatus.CONFIRMED,
        meetingLink: 'https://meet.google.com/sample-link-001',
      },
      {
        bookingId: 'BOOK-SAMPLE-002',
        name: 'Bob Martinez',
        email: 'bob@ecommerce.com',
        phone: '555-0202',
        company: 'Online Retailers Inc.',
        preferredDate: setMinutes(setHours(addDays(new Date(), 5), 14), 0),
        preferredTime: '02:00 PM',
        consultationType: ConsultationType.phone,
        projectDetails:
          'Looking to upgrade our e-commerce platform. Currently on WooCommerce, considering custom solution.',
        budget: '$10,000 - $25,000',
        timeline: '1-3 months',
        status: BookingStatus.CONFIRMED,
      },
      {
        bookingId: 'BOOK-SAMPLE-003',
        name: 'Carol Davis',
        email: 'carol@agency.com',
        phone: '555-0203',
        company: 'Creative Agency',
        preferredDate: setMinutes(setHours(subDays(new Date(), 3), 11), 0),
        preferredTime: '11:00 AM',
        consultationType: ConsultationType.in_person,
        projectDetails:
          'Need a reliable development partner for multiple client projects. Looking for long-term collaboration.',
        budget: '$5,000 - $10,000',
        timeline: 'ASAP',
        status: BookingStatus.COMPLETED,
        notes: 'Great meeting. Client signed contract for 3 projects.',
      },
      {
        bookingId: 'BOOK-SAMPLE-004',
        name: 'David Wilson',
        email: 'david@tech.com',
        phone: '555-0204',
        preferredDate: setMinutes(setHours(subDays(new Date(), 1), 15), 0),
        preferredTime: '03:00 PM',
        consultationType: ConsultationType.video,
        projectDetails:
          'Mobile app development for iOS and Android. Social networking features required.',
        status: BookingStatus.NO_SHOW,
        notes: 'Client did not show up. Follow-up email sent.',
      },
      {
        bookingId: 'BOOK-SAMPLE-005',
        name: 'Eva Thompson',
        email: 'eva@nonprofit.org',
        phone: '555-0205',
        company: 'Community Foundation',
        preferredDate: setMinutes(setHours(addDays(new Date(), 7), 9), 0),
        preferredTime: '09:00 AM',
        consultationType: ConsultationType.video,
        projectDetails:
          'Need a donation platform with recurring payments and donor management system.',
        budget: 'Under $5,000',
        timeline: '1-3 months',
        status: BookingStatus.PENDING,
      },
    ];

    for (const consultation of sampleConsultations) {
      await prisma.consultation.create({
        data: consultation,
      });
    }
    console.log('✅ Sample consultations created');

    // Create additional time slots for weekends (optional consultations)
    const weekendSlots = [
      { dayOfWeek: 6, startTime: '10:00', endTime: '11:00' }, // Saturday
      { dayOfWeek: 6, startTime: '11:00', endTime: '12:00' },
      { dayOfWeek: 0, startTime: '14:00', endTime: '15:00' }, // Sunday
      { dayOfWeek: 0, startTime: '15:00', endTime: '16:00' },
    ];

    for (const slot of weekendSlots) {
      await prisma.timeSlot.upsert({
        where: {
          dayOfWeek_startTime: {
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
          },
        },
        update: { isActive: false }, // Weekends inactive by default
        create: { ...slot, isActive: false },
      });
    }
    console.log('✅ Weekend time slots created (inactive)');
  }

  // Display summary
  const stats = await prisma.$transaction([
    prisma.contact.count(),
    prisma.consultation.count(),
    prisma.timeSlot.count(),
    prisma.blockedDate.count(),
    prisma.emailTemplate.count(),
  ]);

  console.log('\n📊 Database Summary:');
  console.log(`   Contacts: ${stats[0]}`);
  console.log(`   Consultations: ${stats[1]}`);
  console.log(`   Time Slots: ${stats[2]}`);
  console.log(`   Blocked Dates: ${stats[3]}`);
  console.log(`   Email Templates: ${stats[4]}`);
  console.log('\n✨ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
