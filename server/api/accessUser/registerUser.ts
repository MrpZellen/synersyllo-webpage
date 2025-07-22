import connectDB from "~/server/utils/db";
import { ObjectId } from "mongodb";
import User from "~/models/User";
import { getUser, killUser } from '~/server/utils/sessionStorage'

export default defineEventHandler(async (event) => {
  let req = await readBody(event)
  console.log(req)
  var user = req.userStuff
  try { 
    await connectDB();
    console.log('whatthejohn: ', req.authState, " ", typeof req.authState)
    var finalUsername = await getUser(req.authState)
    console.log('fuser: ', finalUsername)
    await User.deleteOne({ "userInfo.username": "bengerman" });
    console.log('made it past connection')
    const insertedUser = new User({
      userInfo: {
        CID: new ObjectId('686755fecde1ad0903e825a4'),
        username: finalUsername,
        email: user.email,
        fName: user.userDeets.name,
        lName: user.userDeets.lastName,
        profilePhoto: user.userDeets.photo
      },
      employeeData: {
        role: 'test',
      }
    })
    console.log('user added')
    await insertedUser.save();
    console.log('user inserted')
    //now we clear state variable
    killUser(req.authState)
  } catch (error) {
    console.log('WHATWENTWRONG', error)
      return {
        status: 400,
        error: 'user taken.',
        userTaken: true
      }
  }
})
