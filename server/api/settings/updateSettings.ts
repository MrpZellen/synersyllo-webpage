import {google} from 'googleapis'

export default defineEventHandler(async (event) => {
  console.log('hit api/settings')
  const config = useRuntimeConfig();
  const req = await readBody(event)
  if(!req.settings){
    return {
      calendars: null,
      status: 400,
      error: null
    }
  }
  var cookie = getCookie(event, 'google_tokens');
  while(!cookie){
    cookie = getCookie(event, 'google_tokens')
  }
  if (!cookie){
    console.error('no cookie data')
    return {
      calendars: null,
      status: 400,
      error: null
      } 
  }
  console.log('cookie checked')
  const oauthClient = new google.auth.OAuth2(config.OAUTHID, config.OAUTHSECRET, config.REDIRECT)
  const tokens = JSON.parse(cookie);
  oauthClient.setCredentials(tokens);
  console.log('credentials set')
  const calendar = google.calendar({version:'v3', auth:oauthClient})
  try{
  const response = await calendar.calendars.update({
    calendarId: req.settings.calendarID,
    requestBody: {
      timeZone: req.settings.timezone,
      summary: req.settings.calendarName
    }
  })
  console.log(response)
  const calendars = response?.body || [];
    return {
      calendars: calendars,
      status: 200,
      error: null
    };
} catch (error) {
    return {
      calendars: null,
      status: 400,
      error: error
    }
}
})
