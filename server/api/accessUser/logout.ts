import { google } from 'googleapis'

export default defineEventHandler(async (event) => {
  try {
    const oauthClient = new google.auth.OAuth2(process.env.OAUTHID, process.env.OAUTHSECRET, process.env.REDIRECT)
    await oauthClient.revokeCredentials()
    deleteCookie(event, 'google_tokens')
    deleteCookie(event, 'adminacc')
    return {
      info: 'cookie removed!',
      status: 200,
      code: 'success'
    }
  } catch (error) {
    console.log('WHATWENTWRONG', error)
      return {
        info: null,
        status: 400,
        code: 'failed'
      }
  }
})
