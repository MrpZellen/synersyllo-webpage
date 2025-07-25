import connectDB from "~/server/utils/db";
import User from "~/models/User";
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
  let req = await readBody(event)
  console.log(req.authState)
  //GET USER and PASS from authstate
  const username = req.user
  try {
    await connectDB();
    console.log('made it past connection')
    const result = await User.findOne({'userInfo.username': username})
    console.log('user found: ', result)
    if(!result){
      console.log('our user doesnt exist')
      return {
        info: null,
        status: 400,
        code: 'wrongUserPass',
        cid: null
      }
    }
    var cid = result.userInfo?.CID
    if (cid) {
      return {
        info: username,
        status: 200,
        code: 'success',
        cid: cid
      }
    } else {
      //false, return problem
      console.log('bad hash')
      return {
        info: null,
        status: 400,
        code: 'wrongUserPass',
        cid: null
      }
    }
  } catch (error) {
    console.log('WHATWENTWRONG', error)
      return {
        info: null,
        status: 400,
        code: 'failed',
        cid: null
      }
  }
})
