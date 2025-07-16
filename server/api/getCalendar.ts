import {google} from 'googleapis'

export default defineEventHandler(async (event) => {
  console.log('hit api/calendars')
  const config = useRuntimeConfig();
  var cookie = getCookie(event, 'google_tokens');
  while(!cookie){
    cookie = getCookie(event, 'google_tokens')
  }
  console.log(cookie)
  if (!cookie){
    console.error('no cookie data')
    return {
      calendars: null,
      status: 400
      } 
  }
  console.log('cookie checked')
  const oauthClient = new google.auth.OAuth2(config.OAUTHID, config.OAUTHSECRET, config.REDIRECT)
  const tokens = JSON.parse(cookie);
  oauthClient.setCredentials(tokens);
  console.log('credentials set')
  const calendar = google.calendar({version:'v3', auth:oauthClient})
  try{
  const response = await calendar.calendarList.list();
  const calendars = response?.data.items || [];
    return {
      result: calendars[0],
      status: 200
    };
} catch (error) {
    return {
      result: null,
      status: 400
    }
}
})
