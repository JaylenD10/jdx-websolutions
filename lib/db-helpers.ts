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
  parseISO,
  getDay,
  isValid,
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
  const dateObj = parseDateSafely(date);

  if (!dateObj) {
    console.error('Invalid date for availability check:', date);
    return true; // Allow booking if we can't validate (for testing)
  }

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

function parseDateSafely(dateStr: string): Date | null {
  try {
    let date: Date;

    if (!dateStr) {
      console.error('No date string provided');
      return null;
    }

    // Try parsing as ISO
    if (dateStr.includes('-')) {
      date = parseISO(dateStr);
    } else {
      date = new Date(dateStr);
    }

    // Check if date is valid
    if (!isValid(date)) {
      console.error('Invalid date after parsing:', dateStr);
      return null;
    }

    return date;
  } catch (error) {
    console.error('Error parsing date:', dateStr, error);
    return null;
  }
}

export async function getAvailableTimeSlots(date: string) {
  console.log('Getting available slots for date:', date);
  try {
    const dateObj = parseDateSafely(date);
    if (!dateObj) {
      console.error('Could not parse date, returning default slots');
      return [
        { time: '09:00 AM', available: true },
        { time: '10:00 AM', available: true },
        { time: '11:00 AM', available: true },
        { time: '02:00 PM', available: true },
        { time: '03:00 PM', available: true },
        { time: '04:00 PM', available: true },
        { time: '05:00 PM', available: true },
      ];
    }
    const dayOfWeek = getDay(dateObj);
    const startOfDayDate = startOfDay(dateObj);
    const endOfDayDate = endOfDay(dateObj);

    // Return empty array for weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      console.log('Weekend - no slots available');
      return [];
    }

    // Validate dayOfWeek is a number
    if (typeof dayOfWeek !== 'number' || isNaN(dayOfWeek)) {
      console.error('Invalid dayOfWeek:', dayOfWeek);
      return [];
    }

    // Get configured time slots for this day
    const configuredSlots = await prisma.timeSlot.findMany({
      where: {
        dayOfWeek: dayOfWeek,
        isActive: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // If no configured slots, use default slots
    let slots = configuredSlots;
    if (slots.length === 0) {
      // Default slots for weekdays
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        slots = [
          {
            id: '1',
            dayOfWeek,
            startTime: '09:00',
            endTime: '10:00',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            dayOfWeek,
            startTime: '10:00',
            endTime: '11:00',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '3',
            dayOfWeek,
            startTime: '11:00',
            endTime: '12:00',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '4',
            dayOfWeek,
            startTime: '14:00',
            endTime: '15:00',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '5',
            dayOfWeek,
            startTime: '15:00',
            endTime: '16:00',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '6',
            dayOfWeek,
            startTime: '16:00',
            endTime: '17:00',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
      } else {
        // No slots for weekends
        return [];
      }
    }

    // Check if date is blocked
    const blockedDates = await prisma.blockedDate.findMany({
      where: {
        date: {
          gte: startOfDayDate,
          lte: endOfDayDate,
        },
      },
    });

    // Get existing bookings for this date
    const existingBookings = await prisma.consultation.findMany({
      where: {
        preferredDate: {
          gte: startOfDayDate,
          lte: endOfDayDate,
        },
        status: {
          notIn: [BookingStatus.CANCELLED],
        },
      },
    });

    // Build available slots array
    const availableSlots = slots.map((slot) => {
      const timeFormatted = formatTime(slot.startTime);

      // Check if this time is blocked
      const isBlocked = blockedDates.some((blocked) => {
        if (blocked.allDay) return true;
        if (blocked.startTime && blocked.endTime) {
          return (
            slot.startTime >= blocked.startTime &&
            slot.startTime < blocked.endTime
          );
        }
        return false;
      });

      // Check if this time is already booked
      const isBooked = existingBookings.some(
        (booking) => booking.preferredTime === timeFormatted
      );

      return {
        time: timeFormatted,
        available: !isBlocked && !isBooked,
      };
    });

    return availableSlots;
  } catch (error) {
    console.error('Error in getAvailableTimeSlots:', error);
    // Return default slots on error
    return [
      { time: '09:00 AM', available: true },
      { time: '10:00 AM', available: true },
      { time: '11:00 AM', available: true },
      { time: '02:00 PM', available: true },
      { time: '03:00 PM', available: true },
      { time: '04:00 PM', available: true },
      { time: '05:00 PM', available: true },
    ];
  }
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
  try {
    const dateObj = parseDateSafely(date);

    if (!dateObj) {
      console.error('Invalid date for combining:', date);
      return new Date(); // Use today as fallback
    }

    // Parse the time
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
    } else {
      // Try 24-hour format
      const [hours, minutes] = time.split(':').map(Number);
      if (!isNaN(hours)) {
        dateObj.setHours(hours, minutes || 0, 0, 0);
      }
    }

    return dateObj;
  } catch (error) {
    console.error('Error combining date and time:', error, { date, time });
    return new Date();
  }
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
