import connectDB from "~/server/utils/db";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import User from "~/models/User";
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  let req = await readBody(event)
  console.log(req)
  if(!(req.username) || !req.email) {
    return {
      status: 400,
      error: 'you must submit a username!',
      userTaken: false
    }
  }
  try {
    await connectDB();
    await User.deleteOne({ "userInfo.username": "bengerman" });
    console.log('made it past connection')
    const insertedUser = new User({
      userInfo: {
        CID: new ObjectId('686755fecde1ad0903e825a4'),
        username: req.username,
        email: req.email,
        fName: req.userDeets.name,
        lName: req.userDeets.lastName,
        profilePhoto: req.userDeets.photo
      },
      employeeData: {
        role: 'test',
      }
    })
    console.log('user added')
    await insertedUser.save();
    console.log('user inserted')
  } catch (error) {
    console.log('WHATWENTWRONG', error)
      return {
        status: 400,
        error: 'user taken.',
        userTaken: true
      }
  }
})
