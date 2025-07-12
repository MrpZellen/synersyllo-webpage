import {google} from 'googleapis'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cookie = getCookie(event, 'google_tokens');
  if (!cookie){
    console.error('no cookie data')
    return {
      status: 400,
      error: 'not signed in!'
      } 
  }
  const oauthClient = new google.auth.OAuth2(config.OAUTHID, config.OAUTHSECRET, config.REDIRECT)
  const tokens = JSON.parse(cookie);
  oauthClient.setCredentials(tokens);
  const calendar = google.calendar({version:'v3', auth:oauthClient})
  let req = await readBody(event)
  if(!(req.startHour && req.endHour) || !req.eventTitle) {
    return {
      status: 400,
      error: 'you must submit a start time, end time, and title!'
    }
  }
  try{
  const response = await new Promise((resolve, reject) => {
      calendar.events.insert({
        calendarId: 'primary', //hardcoded single calendar, TODO: change later as stretch goal.
        maxAttendees: 100, //capped to prevent overuse
        sendUpdates: 'all',
        requestBody: { //all additions sent in.
          description: req?.eventDesc,
          summary: req.eventTitle,
          start: {
            dateTime: req.startHour,
            timeZone: 'America/Denver'
          },
          end: {
            dateTime: req.endHour,
            timeZone: 'America/Denver'
          },
          transparency: req?.transparency ?? 'opaque',
          status: req.status ?? 'tentative',
          location: req.location ?? '',
          attendees: req.attendees ?? 1,
        }
      })
    });
    console.log(response)
    //TODO: then we save the event to the database!!!
    const calendars = response?.data.items || [];
    console.log(calendars);
    return {
      calendars: calendars,
      status: 200
    };
} catch (error) {
    return {
      calendars: null,
      status: 400
    }
}
})
