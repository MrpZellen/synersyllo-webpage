import {google} from 'googleapis';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  console.log('hit')
  const oauthClient = new google.auth.OAuth2(config.OAUTHID, config.OAUTHSECRET, config.REDIRECT)
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
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    oauthClient.setCredentials(tokens);
    console.log('Received tokens:', tokens);
    const oauth2 = google.oauth2({
      auth: oauthClient,
      version: 'v2'
    });
    const { data: yummyUserInformation } = await oauth2.userinfo.get();
    // const people = google.people({ version: 'v1', auth: oauthClient });
    // const { data: yummyUserInformation } = await people.people.get({
    //   resourceName: 'people/me',
    //   personFields: 'emailAddresses,names,'
    // })
    console.log('oopises I stumbled and dropped all this valuable user data: ', yummyUserInformation)
    var userInOrUp = getCookie(event, 'signupSpecifications');
    if (!userInOrUp){
      console.error('somehow you get here! error redirecting, user is not valid on my site')
      return
    }
    const cookieStuff = JSON.parse(userInOrUp)
    // TODO: authenticate or add user myself
    const userStuff = {
      email: yummyUserInformation.email,
      username: cookieStuff.userInfo.username,
      userDeets: {
        photo: yummyUserInformation.picture,
        name: yummyUserInformation.name,
        lastName: yummyUserInformation.family_name
      }
    }
    var ourRequestResult = null
    if(cookieStuff.signIn){
      ourRequestResult = null //WIP
    }else { //register is only other option
      await $fetch('/api/accessUser/registerUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userStuff)
    }).then((data) => {
      if(data){
        console.log('success')
      } else {
        console.error('failed to fetch result, submit failed!')
      }
    })
    }

    console.log('successful login')
    const tokenInfo = await oauthClient.getTokenInfo(tokens.access_token);
    console.log(tokenInfo.scopes);
    console.log(getCookie(event, 'google_tokens'))
    sendRedirect(event, '/calendar')
    return;

  } catch (error) {
    return error
  }
})
