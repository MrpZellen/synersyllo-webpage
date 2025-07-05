import {google} from 'googleapis';

export default defineEventHandler(async (event) => {
  const oauthClient = new google.auth.OAuth2(process.env.OAUTHID, process.env.OAUTHSECRET, process.env.REDIRECT)
  const url = oauthClient.generateAuthUrl({
    access_type:'offline',
    scope:'https://www.googleapis.com/auth/calendar.readonly'
  })
  sendRedirect(event, url)
})
