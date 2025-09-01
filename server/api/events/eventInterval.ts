import {google} from 'googleapis'
import { toZonedTime, format } from 'date-fns-tz';
import { gimmeSunday } from '../../utils/gimmeSunday';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const req = await readBody(event)
  const day = req.day ? new Date(req.day) : new Date()
  const userSettings = req.userSettings
  const sunday = gimmeSunday(day)
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
  const response: any = await new Promise((resolve, reject) => {
      calendar.events.list({
        calendarId:'primary',
        maxResults:100,
        singleEvents:true,
        timeZone: userTZ,
        orderBy:'startTime',
        timeMin: new Date(sunday.setHours(0,0,0,0)).toISOString(),
        timeMax: new Date(sunday.setHours(23,59,59,999) + 6*24*60*60*1000).toISOString(), //+6 days to get full week
      }, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
    //console.log('recieved date ', response.data.items)
    console.log(userTZ, ' TIMEZONE')
  const events = response.data.items || [];
    return {
      events: events,
      status: 200
    };
} catch (error) {
  console.log('WHATWENTWRONG', error)
  if(error){
    $fetch(`/api/accessUser/logout`)
  }
    return {
      events: null,
      status: 400
    }
}
})
