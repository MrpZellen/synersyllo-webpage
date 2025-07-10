
//I HAD CHATGPT CONVERT THE DATA STRUCTURE OF A GOOGLE CALENDAR API EVENT INTO THIS SO I WOULDNT HAVE TO MANUALLY TYPE IT.
interface CalendarEvent {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string; // ISO date string
  updated: string; // ISO date string
  summary: string;
  description: string;
  creator: {
    email: string;
    self: boolean;
  };
  organizer: {
    email: string;
    self: boolean;
  };
  start: {
    dateTime: string; // ISO date string with timezone
    timeZone: string;
  };
  end: {
    dateTime: string; // ISO date string with timezone
    timeZone: string;
  };
  iCalUID: string;
  sequence: number;
  reminders: {
    useDefault: boolean;
  };
  eventType: string;
}