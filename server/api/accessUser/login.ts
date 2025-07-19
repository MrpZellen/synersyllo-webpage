import connectDB from "~/server/utils/db";
import User from "~/models/User";
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
  let req = await readBody(event)
  console.log(req)
  if(!(req.username && req.password)) {
    return {
        user: null,
        status: 400,
        code: 'wrongUserPass'
    }
  }
  try {
    const cookie = await getCookie(event, 'google_tokens')
    await connectDB();
    console.log('made it past connection')
    const result = await User.findOne({'username': req.username})
    console.log('user found: ', result)
    if(!result){
      console.log('our user doesnt exist')
      return {
        user: null,
        status: 400,
        code: 'wrongUserPass'
      }
    }
    if(await bcrypt.compare(req.password, result?.userInfo?.pass!)){
      //if true, return successful login
      setCookie(event, 'userloggedin', JSON.stringify(result!), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 3, //3 days
      })
      //now we are authed up
    } else {
      //false, return problem
      console.log('bad hash')
      return {
        user: null,
        status: 400,
        code: 'wrongUserPass'
      }
    }
  } catch (error) {
    console.log('WHATWENTWRONG', error)
      return {
        user: null,
        status: 400,
        code: 'failed'
      }
  }
})
