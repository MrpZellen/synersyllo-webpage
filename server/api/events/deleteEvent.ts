import {google} from 'googleapis'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cookie = getCookie(event, 'google_tokens');
  const req = await readBody(event)
  console.log('hit and req')
  if (!cookie){
    console.log('no cookie data')
    return {
      status: 400,
      error: 'not signed in!'
      } 
  }
  if (!req.eventID || !req.calendarID) {
    console.log('no event/calendar ID')
    console.log('EVENT: ', req.eventID)
    console.log('CALENDAR: ', req.calendarID)
    return {
      status: 400,
      error: 'ID not given'
    }
  }
  const oauthClient = new google.auth.OAuth2(config.OAUTHID, config.OAUTHSECRET, config.REDIRECT)
  const tokens = JSON.parse(cookie);
  oauthClient.setCredentials(tokens);
  const calendar = google.calendar({version:'v3', auth:oauthClient})
  try{
  const response = await calendar.events.delete({
    eventId: req.eventID,
    calendarId: req.calendarID,
  })
    console.log('OUR RESPONSE', response)
    //TODO: then we save the event to the database!!!
    const calendars = response?.data;
    console.log(calendars);
    return {
      calendars: calendars,
      status: 200
    };
} catch (error: any) {
  console.error(
  'Google Calendar API error:',
  JSON.stringify(error.response?.data || error.message, null, 2) //gives me the error data as a json if possible, giving more insight into what field is wrong
  );
    return {
      calendars: null,
      status: 400
    }
}
})
