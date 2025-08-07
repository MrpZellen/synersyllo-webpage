import connectDB from "~/server/utils/db";
import User from "~/models/User";
import mongoose from "mongoose";

export default defineEventHandler(async (event) => {
  let req = await readBody(event)
  console.log('survey completed for: ', req.username)
  try {
    console.log('made it past connection')
    const foundUser = await User.updateOne({ 'userInfo.username': req.username }, {
      $set: {'employeeData.availableSurvey': false }
    })
    console.log('set survey completed ')
    if (!foundUser) {
      console.log('failed To Update User!')
      return {
        info: null,
        status: 400,
        code: 'failed ot update'
      }
    }else {
      return {
        info: JSON.parse(JSON.stringify(foundUser)),
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
