import prisma from './db';
import {
  BusinessType,
  ConsultationType,
  BookingStatus,
  ContactStatus,
} from '@prisma/client';
import {
  startOfDay,
  endOfDay,
  addDays,
  format,
  parse,
  parseISO,
} from 'date-fns';

// Contact Form Helpers
export async function saveContactSubmission(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  businessType: string;
  services?: string[];
  message: string;
}) {
  return await prisma.contact.create({
    data: {
      ...data,
      businessType: data.businessType as BusinessType,
      services: data.services || [],
    },
  });
}

export async function getContactSubmissions(
  page: number = 1,
  limit: number = 10,
  status?: ContactStatus
) {
  const skip = (page - 1) * limit;

  const where = status ? { status } : {};

  const [submissions, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.contact.count({ where }),
  ]);

  return {
    submissions,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
}

// Consultation Booking Helpers
export async function createConsultationBooking(data: {
  name: string;
  email: string;
  phone: string;
  company?: string;
  preferredDate: string;
  preferredTime: string;
  consultationType: string;
  projectDetails: string;
  budget?: string;
  timeline?: string;
}) {
  const bookingId = generateBookingId();
  const dateTime = combineDateAndTime(data.preferredDate, data.preferredTime);

  return await prisma.consultation.create({
    data: {
      ...data,
      bookingId,
      preferredDate: dateTime,
      consultationType: data.consultationType as ConsultationType,
    },
  });
}

export async function checkTimeSlotAvailability(
  date: string,
  time: string
): Promise<boolean> {
  const dateObj = parseISO(date);
  const startOfDayDate = startOfDay(dateObj);
  const endOfDayDate = endOfDay(dateObj);

  // Check if date is blocked
  const blockedDate = await prisma.blockedDate.findFirst({
    where: {
      date: {
        gte: startOfDayDate,
        lte: endOfDayDate,
      },
      OR: [
        { allDay: true },
        {
          AND: [{ startTime: { lte: time } }, { endTime: { gte: time } }],
        },
      ],
    },
  });

  if (blockedDate) return false;

  // Check if slot is already booked
  const existingBooking = await prisma.consultation.findFirst({
    where: {
      preferredDate: {
        gte: startOfDayDate,
        lte: endOfDayDate,
      },
      preferredTime: time,
      status: {
        notIn: [BookingStatus.CANCELLED],
      },
    },
  });

  return !existingBooking;
}

export async function getAvailableTimeSlots(date: string) {
  const dateObj = parseISO(date);
  const dayOfWeek = dateObj.getDay();

  // Get configured time slots for this day
  const timeSlots = await prisma.timeSlot.findMany({
    where: {
      dayOfWeek,
      isActive: true,
    },
    orderBy: {
      startTime: 'asc',
    },
  });

  // Check availability for each slot
  const availabilityPromises = timeSlots.map(async (slot) => {
    const isAvailable = await checkTimeSlotAvailability(date, slot.startTime);
    return {
      time: formatTime(slot.startTime),
      available: isAvailable,
    };
  });

  return await Promise.all(availabilityPromises);
}

export async function getUpcomingConsultations(days: number = 7) {
  const endDate = addDays(new Date(), days);

  return await prisma.consultation.findMany({
    where: {
      preferredDate: {
        gte: new Date(),
        lte: endDate,
      },
      status: BookingStatus.CONFIRMED,
    },
    orderBy: {
      preferredDate: 'asc',
    },
  });
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  notes?: string
) {
  return await prisma.consultation.update({
    where: { bookingId },
    data: {
      status,
      notes: notes || undefined,
    },
  });
}

// Time Slot Management
export async function initializeDefaultTimeSlots() {
  const defaultSlots = [
    // Monday to Friday
    ...[1, 2, 3, 4, 5].flatMap((day) => [
      { dayOfWeek: day, startTime: '09:00', endTime: '10:00' },
      { dayOfWeek: day, startTime: '10:00', endTime: '11:00' },
      { dayOfWeek: day, startTime: '11:00', endTime: '12:00' },
      { dayOfWeek: day, startTime: '14:00', endTime: '15:00' },
      { dayOfWeek: day, startTime: '15:00', endTime: '16:00' },
      { dayOfWeek: day, startTime: '16:00', endTime: '17:00' },
    ]),
  ];

  for (const slot of defaultSlots) {
    await prisma.timeSlot.upsert({
      where: {
        dayOfWeek_startTime: {
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
        },
      },
      update: {},
      create: slot,
    });
  }
}

export async function blockDate(
  date: string,
  reason?: string,
  allDay: boolean = true,
  startTime?: string,
  endTime?: string
) {
  return await prisma.blockedDate.create({
    data: {
      date: parseISO(date),
      reason,
      allDay,
      startTime,
      endTime,
    },
  });
}

// Utility functions
function generateBookingId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `BOOK-${timestamp}-${randomStr}`.toUpperCase();
}

function combineDateAndTime(date: string, time: string): Date {
  const dateObj = parseISO(date);
  const [hours, minutes] = time.split(':').map(Number);
  dateObj.setHours(hours || 0, minutes || 0, 0, 0);
  return dateObj;
}

function formatTime(time: string): string {
  try {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  } catch {
    return time;
  }
}

// Dashboard Statistics
export async function getDashboardStats() {
  const [
    totalContacts,
    newContacts,
    totalBookings,
    upcomingBookings,
    completedBookings,
  ] = await Promise.all([
    prisma.contact.count(),
    prisma.contact.count({
      where: {
        status: ContactStatus.NEW,
      },
    }),
    prisma.consultation.count(),
    prisma.consultation.count({
      where: {
        status: BookingStatus.CONFIRMED,
        preferredDate: {
          gte: new Date(),
        },
      },
    }),
    prisma.consultation.count({
      where: {
        status: BookingStatus.COMPLETED,
      },
    }),
  ]);

  return {
    totalContacts,
    newContacts,
    totalBookings,
    upcomingBookings,
    completedBookings,
  };
}
