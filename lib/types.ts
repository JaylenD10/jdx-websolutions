import {
  ConsultationType as PrismaConsultationType,
  Consultation as PrismaConsultation,
} from '@prisma/client';

// Re-export Prisma types for convenience
export type ConsultationType = PrismaConsultationType;
export type Consultation = PrismaConsultation;

// Custom types for your application
export interface EmailData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  preferredDate?: string;
  preferredTime?: string;
  consultationType?: string;
  projectDetails?: string;
  budget?: string;
  timeline?: string;
  bookingId?: string;
  meetingLink?: string;
  meetingPassword?: string;
  hostUrl?: string;
  businessType?: string;
  services?: string[];
  message?: string;
  type?: 'company' | 'client';
  cancellationReason?: string;
}

export interface ZoomMeetingResult {
  meetingUrl: string;
  meetingId: number;
  password: string;
  startUrl: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
