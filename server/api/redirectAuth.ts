import {google} from 'googleapis';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  console.log('hit')
  const oauthClient = new google.auth.OAuth2('431685922807-87m61aqc8qliu36erdppeuat8ir0unqc.apps.googleusercontent.com', config.OAUTHSECRET, config.REDIRECT)
  const code = getQuery(event).code
  console.log(code)
  try {
    const { tokens } = await new Promise<{ tokens: any }>((resolve, reject) => {
      oauthClient.getToken(code, (err, tokens) => {
        if (err) reject(err);
        else resolve({ tokens });
      });
    });
    setCookie(event, 'google_tokens', JSON.stringify(tokens), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    oauthClient.setCredentials(tokens); 
    console.log('successful login')
    setResponseStatus(event, 302);
    setHeader(event, 'Location', 'http://localhost:3000/calendar');
    return;

  } catch (error) {
    return error
  }
})
