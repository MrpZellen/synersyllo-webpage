import {google} from 'googleapis';
import { useRequestHeaders } from 'nuxt/app';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  console.log('hit')
  const oauthClient = new google.auth.OAuth2(config.OAUTHID, config.OAUTHSECRET, config.REDIRECT)
  const code = getQuery(event).code
  const state = getQuery(event).state?.toString()!
  const isRegistered = await getRegister(state)
  const cid = await getCID(state)
  console.log('test api state', state)
  console.log(code)
  try {
    const { tokens } = await new Promise<{ tokens: any }>((resolve, reject) => {
      oauthClient.getToken(String(code), (err, tokens) => {
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

    var username: string;
    var adminStatus: boolean = false
    if(isRegistered){ //ONLY IF WE ARE REGISTERING
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
      const userStuff = {
        email: yummyUserInformation.email,
        userDeets: {
          photo: yummyUserInformation.picture,
          name: yummyUserInformation.name,
          lastName: yummyUserInformation.family_name
        }
      }
      username = '';
      await $fetch('/api/accessUser/registerUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userStuff: userStuff,
          authState: state
        })
        }).then((data) => {
          if(data){
            console.log('success')
            username = data.userData
            adminStatus= data.adminStatus
          } else {
            console.error('failed to fetch result, submit failed!')
            sendRedirect(event, `/register`)
            return
          }
      })
    } else {
      username = '';
      console.log('login hit')
      const result = await $fetch('/api/accessUser/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          authState: state
        })
      }).then((data) => {
        if(data.status != 400){
          console.log('success auth:login')
          console.log(data)
          username = String(data.info)
          adminStatus = Boolean(data.adminStatus)
        } else {
          console.error('failed to fetch result, submit failed!')
          sendRedirect(event, `/login`)
          return
        }
      })
    }
    if(adminStatus){
      setCookie(event, 'adminacc', JSON.stringify({isAdmin: true, cid: cid}), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    } else {
      setCookie(event, 'adminacc', JSON.stringify({isAdmin: false, cid: cid}), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    }
    console.log('successful login')
    const tokenInfo = await oauthClient.getTokenInfo(tokens.access_token);
    console.log(adminStatus);
    console.log(getCookie(event, 'google_tokens'))
    sendRedirect(event, `/calendar/${String(username)}`)
    return;

  } catch (error) {
    return error
  }
})
