
export interface Calendar {
  kind: 'calendar#calendarListEntry';
  etag: string;
  id: string;
  summary: string;
  description?: string;
  location?: string;
  timeZone: string;
  summaryOverride?: string;
  colorId?: string;
  backgroundColor: string;
  foregroundColor: string;
  hidden?: boolean;
  selected?: boolean;
  accessRole: 'freeBusyReader' | 'reader' | 'writer' | 'owner';
  defaultReminders?: {
    method: 'email' | 'popup';
    minutes: number;
  }[];
  notificationSettings?: {
    notifications: {
      type:
        | 'eventCreation'
        | 'eventChange'
        | 'eventCancellation'
        | 'eventResponse'
        | 'agenda';
      method: 'email' | 'sms';
    }[];
  };
  primary?: boolean;
  deleted?: boolean;
  conferenceProperties?: {
    allowedConferenceSolutionTypes: string[]; // e.g., ['hangoutsMeet']
  };
}