import axios from 'axios';
import jwt from 'jsonwebtoken';

interface ZoomMeetingOptions {
  topic: string;
  start_time: Date;
  duration: number;
  agenda?: string;
  password?: string;
  settings?: {
    host_video?: boolean;
    participant_video?: boolean;
    join_before_host?: boolean;
    mute_upon_entry?: boolean;
    watermark?: boolean;
    audio?: 'telephony' | 'voip' | 'both';
    auto_recording?: 'none' | 'local' | 'cloud';
    waiting_room?: boolean;
  };
}

interface ZoomMeeting {
  id: number;
  topic: string;
  start_time: string;
  duration: number;
  start_url: string;
  join_url: string;
  password: string;
  h323_password: string;
  pstn_password: string;
  encrypted_password: string;
}

class ZoomAPI {
  private baseURL = 'https://api.zoom.us/v2';
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  // Get OAuth access token
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid cached token
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    try {
      const credentials = Buffer.from(
        `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
      ).toString('base64');

      const response = await axios.post('https://zoom.us/oauth/token', null, {
        params: {
          grant_type: 'account_credentials',
          account_id: process.env.ZOOM_ACCOUNT_ID,
        },
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      this.accessToken = response.data.access_token;
      // Set expiration time (usually 1 hour, but we'll refresh 5 minutes early)
      this.tokenExpiresAt =
        Date.now() + (response.data.expires_in - 300) * 1000;

      return this.accessToken!;
    } catch (error: any) {
      console.error(
        'Failed to get Zoom access token:',
        error.response?.data || error.message
      );
      throw new Error('Failed to authenticate with Zoom');
    }
  }

  // Create a Zoom meeting
  async createMeeting(options: ZoomMeetingOptions): Promise<ZoomMeeting> {
    try {
      const accessToken = await this.getAccessToken();

      // Format start time to ISO 8601 format
      const startTime = options.start_time.toISOString().replace('.000Z', 'Z');

      // Generate a random password if not provided
      const password = options.password || this.generatePassword();

      const meetingData = {
        topic: options.topic,
        type: 2, // Scheduled meeting
        start_time: startTime,
        duration: options.duration,
        timezone: 'UTC',
        password: password,
        agenda: options.agenda || options.topic,
        settings: {
          host_video: options.settings?.host_video ?? true,
          participant_video: options.settings?.participant_video ?? true,
          join_before_host: options.settings?.join_before_host ?? false,
          mute_upon_entry: options.settings?.mute_upon_entry ?? true,
          watermark: options.settings?.watermark ?? false,
          use_pmi: false,
          approval_type: 0,
          audio: options.settings?.audio ?? 'both',
          auto_recording: options.settings?.auto_recording ?? 'none',
          waiting_room: options.settings?.waiting_room ?? true,
          meeting_authentication: false,
          email_notification: true,
          host_email: process.env.ZOOM_USER_EMAIL,
        },
      };

      const response = await axios.post(
        `${this.baseURL}/users/me/meetings`,
        meetingData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error(
        'Failed to create Zoom meeting:',
        error.response?.data || error.message
      );
      throw new Error('Failed to create Zoom meeting');
    }
  }

  // Update a Zoom meeting
  async updateMeeting(
    meetingId: number,
    updates: Partial<ZoomMeetingOptions>
  ): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();

      const updateData: any = {};

      if (updates.topic) updateData.topic = updates.topic;
      if (updates.start_time)
        updateData.start_time = updates.start_time.toISOString();
      if (updates.duration) updateData.duration = updates.duration;
      if (updates.agenda) updateData.agenda = updates.agenda;
      if (updates.settings) updateData.settings = updates.settings;

      await axios.patch(`${this.baseURL}/meetings/${meetingId}`, updateData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error: any) {
      console.error(
        'Failed to update Zoom meeting:',
        error.response?.data || error.message
      );
      throw new Error('Failed to update Zoom meeting');
    }
  }

  // Delete a Zoom meeting
  async deleteMeeting(meetingId: number): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();

      await axios.delete(`${this.baseURL}/meetings/${meetingId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error: any) {
      console.error(
        'Failed to delete Zoom meeting:',
        error.response?.data || error.message
      );
      throw new Error('Failed to delete Zoom meeting');
    }
  }

  // Get meeting details
  async getMeeting(meetingId: number): Promise<ZoomMeeting> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.get(
        `${this.baseURL}/meetings/${meetingId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error(
        'Failed to get Zoom meeting:',
        error.response?.data || error.message
      );
      throw new Error('Failed to get Zoom meeting');
    }
  }

  // Generate a random password for meetings
  private generatePassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}

// Export singleton instance
export const zoomAPI = new ZoomAPI();

// Helper function to create a consultation meeting
export async function createConsultationMeeting(
  name: string,
  email: string,
  date: Date,
  consultationType: string,
  projectDetails?: string
): Promise<{
  meetingUrl: string;
  meetingId: number;
  password: string;
  startUrl: string;
}> {
  try {
    const meeting = await zoomAPI.createMeeting({
      topic: `Consultation with ${name}`,
      start_time: date,
      duration: 60, // 1 hour default
      agenda: projectDetails || `Consultation meeting with ${name} (${email})`,
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: false,
        waiting_room: true,
        audio: 'both',
        auto_recording: 'none', // Change to 'cloud' if you want recordings
      },
    });

    return {
      meetingUrl: meeting.join_url,
      meetingId: meeting.id,
      password: meeting.password,
      startUrl: meeting.start_url, // Host URL
    };
  } catch (error) {
    console.error('Error creating Zoom meeting:', error);
    throw error;
  }
}

// Helper function to cancel a consultation meeting
export async function cancelConsultationMeeting(
  meetingId: number
): Promise<void> {
  try {
    await zoomAPI.deleteMeeting(meetingId);
  } catch (error) {
    console.error('Error cancelling Zoom meeting:', error);
    // Don't throw - meeting might already be deleted
  }
}

// Helper function to reschedule a meeting
export async function rescheduleConsultationMeeting(
  meetingId: number,
  newDate: Date,
  newDuration?: number
): Promise<void> {
  try {
    await zoomAPI.updateMeeting(meetingId, {
      start_time: newDate,
      duration: newDuration,
    });
  } catch (error) {
    console.error('Error rescheduling Zoom meeting:', error);
    throw error;
  }
}
