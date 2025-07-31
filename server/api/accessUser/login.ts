import connectDB from "~/server/utils/db";
import User from "~/models/User";
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
  let req = await readBody(event)
  console.log(req.authState)
  //GET USER and PASS from authstate
  const username = await getUser(req.authState)
  var password = await getPass(req.authState)
  const email = await req.email
  if(!password){
    password = await getPass(req.authState)
  }
  console.log('Auth user and pass? ', username, password)
  if(!(username && password)) {
    return {
        info: null,
        status: 400,
        code: 'wrongUserPass',
        adminStatus: false
    }
  }
  try {
    await connectDB();
    console.log('made it past connection')
    const result = await User.findOne({'userInfo.email': email})
    console.log('user found: ', result)
    const adminStatus = result?.employeeData?.isAdmin
    if(!result){
      console.log('our user doesnt exist')
      return {
        info: null,
        status: 400,
        code: 'wrongUserPass',
        adminStatus: false
      }
    }
    if(await bcrypt.compare(String(password), result?.userInfo!.password?.toString()!)){
      //if true, return successful login
      setCookie(event, 'userloggedin', JSON.stringify(result!), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 3, //3 days
      })
      //now we are authed up, set cookie for signin
      //WAIT, THATS ALREADY DONE BY REDIRECTAUTH :) oh joyous occasion
      //KILL AUTHSTATE: 
      await killUser(req.authState)
      await killPass(req.authState)
      console.log(result.userInfo!.username)
      return {
        info: result.userInfo?.username,
        status: 200,
        code: 'success',
        adminStatus: adminStatus
      }
    } else {
      //false, return problem
      console.log('bad hash')
      return {
        info: null,
        status: 400,
        code: 'wrongUserPass',
        adminStatus: false
      }
    }
  } catch (error) {
    console.log('WHATWENTWRONG', error)
      return {
        info: null,
        status: 400,
        code: 'failed',
        adminStatus: false
      }
  }
})
