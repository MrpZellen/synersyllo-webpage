import {google} from 'googleapis'

export default defineEventHandler(async (event) => {
  console.log('hit api/calendars')
  const config = useRuntimeConfig();
  const cookie = getCookie(event, 'google_tokens');
  if (!cookie){
    console.error('no cookie data')
    return {
      calendars: null,
      status: 400
      } 
  }
  console.log('cookie checked')
  const oauthClient = new google.auth.OAuth2('431685922807-87m61aqc8qliu36erdppeuat8ir0unqc.apps.googleusercontent.com', config.OAUTHSECRET, config.REDIRECT)
  const tokens = JSON.parse(cookie);
  oauthClient.setCredentials(tokens);
  console.log('credentials set')
  const calendar = google.calendar({version:'v3', auth:oauthClient})
  try{
  const response = await new Promise((resolve, reject) => {
      calendar.calendarList.list({}, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  const calendars = response?.data.items || [];
    console.log(calendars);
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
