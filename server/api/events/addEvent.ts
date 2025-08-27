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
  console.log(req)
  if(!(req.startHour && req.endHour) || !req.eventTitle) {
    return {
      status: 400,
      error: 'you must submit a start time, end time, and title!'
    }
  }
  if(req.recurrence){
    console.log('freak string: ', `RRULE:FREQ=${(req.recurrenceItems.interval).toUpperCase()};UNTIL=${formattedGoogleFreakCalendarString(new Date(req.recurrenceItems.endsOn))}`)
    if(req.recurrenceItems){
    if((!req.recurrenceItems.interval && req.recurrenceItems.endsOn)){
      return {
        status: 400,
        error: 'not receiving valid inputs for recurrence!'
      }
    }
  } else {
    return {
        status: 400,
        error: 'not receiving valid inputs for recurrence!'
      }
  }
  }
  console.log('request: ', req)
  try{
    var response = null
  if(!req.recurrence){
    response = await calendar.events.insert({
            calendarId: 'primary', //hardcoded single calendar, TODO: change later as stretch goal.
            maxAttendees: 100, //capped to prevent overuse
            sendUpdates: 'all',
            requestBody: { //all additions sent in.
              description: req?.eventDesc,
              summary: req.eventTitle,
              start: {
                dateTime: new Date(req.startHour).toISOString(),
                timeZone: req.timezone ? req.timezone : 'America/Denver',
              },
              end: {
                dateTime: new Date(req.endHour).toISOString(),
                timeZone: req.timezone ? req.timezone : 'America/Denver',
              },
              transparency: req?.transparency ?? 'opaque',
              status: req.status ?? 'tentative'
            }
          })
  } else if(req.recurrenceItems.endsOn != 'never'){
    response = await calendar.events.insert({
            calendarId: 'primary', //hardcoded single calendar, TODO: change later as stretch goal.
            maxAttendees: 100, //capped to prevent overuse
            sendUpdates: 'all',
            requestBody: { //all additions sent in.
              description: req?.eventDesc,
              summary: req.eventTitle,
              start: {
                dateTime: new Date(req.startHour).toISOString(),
                timeZone: req.timezone,
              },
              end: {
                dateTime: new Date(req.endHour).toISOString(),
                timeZone: req.timezone,
              },
              transparency: req?.transparency ?? 'opaque',
              status: req.status ?? 'tentative',
              recurrence: [`RRULE:FREQ=${(req.recurrenceItems.interval).toUpperCase()};UNTIL=${formattedGoogleFreakCalendarString(new Date(req.recurrenceItems.endsOn))}`]
            }
          })
  } else {
    response = await calendar.events.insert({
            calendarId: 'primary', //hardcoded single calendar, TODO: change later as stretch goal.
            maxAttendees: 100, //capped to prevent overuse
            sendUpdates: 'all',
            requestBody: { //all additions sent in.
              description: req?.eventDesc,
              summary: req.eventTitle,
              start: {
                dateTime: new Date(req.startHour).toISOString(),
                timeZone: req.timezone,
              },
              end: {
                dateTime: new Date(req.endHour).toISOString(),
                timeZone: req.timezone,
              },
              transparency: req?.transparency ?? 'opaque',
              status: req.status ?? 'tentative',
              recurrence: [`RRULE:FREQ=${(req.recurrenceItems.interval).toUpperCase()}`]
            }
          })
  }
    console.log('OUR RESPONSE', response)
    //TODO: then we save the event to the database!!!
    const calendars = response?.data || [];
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

const formattedGoogleFreakCalendarString = (dateToString: Date) => {
  console.log(dateToString)
  var dateString = dateToString.toISOString()
  dateString = dateString.replace('.000', '')
  dateString = dateString.replaceAll('-', '')
  dateString = dateString.replaceAll(':', '')
  return dateString
}