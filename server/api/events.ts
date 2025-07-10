import {google} from 'googleapis'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cookie = getCookie(event, 'google_tokens');
  if (!cookie){
    console.error('no cookie data')
    return {
      calendars: null,
      status: 400
      } 
  }
  const oauthClient = new google.auth.OAuth2(config.OAUTHID, config.OAUTHSECRET, config.REDIRECT)
  const tokens = JSON.parse(cookie);
  oauthClient.setCredentials(tokens);
  const calendar = google.calendar({version:'v3', auth:oauthClient})
  try{
  const response = await new Promise((resolve, reject) => {
      calendar.events.list({
        calendarId:'primary',
        timeMin:(new Date()).toISOString(),
        maxResults:15,
        singleEvents:true,
        orderBy:'startTime'
      }, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  const events = response?.data.items || [];
    console.log(events);
    return {
      events: events,
      status: 200
    };
} catch (error) {
    return {
      events: null,
      status: 400
    }
}
})
