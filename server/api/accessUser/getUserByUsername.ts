import connectDB from "~/server/utils/db";
import User from "~/models/User";
import mongoose from "mongoose";

export default defineEventHandler(async (event) => {
  let req = await readBody(event)
  //GET USER and PASS from authstate
  const uid = req.username
  console.log('got id: ', req.username)
  try {
    await connectDB();
    await new Promise(resolve => setTimeout(resolve, 10));
    console.log('made it past connection')
    const result = await User.findOne({ 'userInfo.username': req.username }).lean() //lean guarantees we return a javascript object
    console.log('user found: ', result)
    if(!result){
      console.log('our user doesnt exist')
      return {
        info: null,
        status: 400,
        code: 'no user by that id',
      }
    } else {
      return {
        info: JSON.parse(JSON.stringify(result)),
        status: 200,
        code: 'user found!',
      }
    }
  } catch (error) {
    console.log('WHATWENTWRONG', error)
      return {
        info: null,
        status: 400,
        code: 'failed',
      }
  }
})
