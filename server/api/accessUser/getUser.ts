import connectDB from "~/server/utils/db";
import User from "~/models/User";
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  let req = await readBody(event)
  //GET USER and PASS from authstate
  const uid = req._id
  console.log('got id: ', req._id)
  try {
    await connectDB();
    
    console.log('made it past connection')
    if(!ObjectId.isValid(uid)){
      return {
        info: null,
        status: 400,
        code: 'BAD ID'
      }
    }
    const result = await User.findById(uid) //lean guarantees we return a javascript object
    console.log('user: ', result)
    if(!result){
      console.log('our user doesnt exist')
      return {
        info: null,
        status: 404,
        code: 'no user by that id',
      }
    } else {
      return {
        info: result,
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
