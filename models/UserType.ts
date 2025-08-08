export interface UserType {
  userInfo: {
    fName?: string;
    lName?: string;
    username: string;
    password?: string;
    CID?: string; // referenced to Company
    email: string;
    profilePhoto?: string;
  };
  employeeData: {
    isAdmin?: boolean;
    role: string;
    groups?: [];
    groupPerms?: any; // ideally replace 'any' with actual structure if known
    availableSurvey: boolean;
  };
  settings?: {
    timezone?: string;
    accessibility?: {
      bigText?: boolean;
      screenReader?: boolean;
      tts?: boolean;
    };
    TWOFA?: boolean;
    colormode?: 'dark' | 'light';
    weekStart?: 'SUN' | 'MON';
    standardHour?: boolean;
    workWeek?: {
      startTime?: string;
      endTime?: string;
    };
  };
}