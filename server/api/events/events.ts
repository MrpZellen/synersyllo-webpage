import {google} from 'googleapis'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const req = await readBody(event)
  const userSettings = req.userSettings
  const cookie = getCookie(event, 'google_tokens');
  if (!cookie){
    console.error('no cookie data')
    return {
      calendars: null,
      status: 400
      } 
  }
  var userTZ = userSettings.timezonePref
  const oauthClient = new google.auth.OAuth2(config.OAUTHID, config.OAUTHSECRET, config.REDIRECT)
  const tokens = JSON.parse(cookie);
  oauthClient.setCredentials(tokens);
  const calendar = google.calendar({version:'v3', auth:oauthClient})
  const startDate = new Date().toDateString()
  try{
  const response = await new Promise((resolve, reject) => {
      calendar.events.list({
        calendarId:'primary',
        maxResults:100,
        singleEvents:true,
        timeZone: userTZ!,
        orderBy:'startTime',
      }, (err: any, res: unknown) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
    console.log(userTZ, ' TIMEZONE')
  const events = response.data.items || [];
    return {
      events: events,
      status: 200
    };
} catch (error) {
  console.log('WHATWENTWRONG', error)
    return {
      events: null,
      status: 400
    }
}
})
