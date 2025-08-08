import connectDB from "~/server/utils/db";
import { ObjectId } from "mongodb";
import User from "~/models/User";
import { getUser, getPass, killPass, killUser, getCID, killCID, getAdmin } from '~/server/utils/sessionStorage'
import { useHydration } from "nuxt/app";
import bcrypt from "bcryptjs";
import { getActionDropdownButtonTarget } from "survey-core";

export default defineEventHandler(async (event): Promise<any> => {
  let req = await readBody(event)
  console.log(req)
  var user = req.userStuff
  try { 
    await connectDB();
    console.log('whatthejohn: ', req.authState, " ", typeof req.authState)
    var finalUsername = await getUser(req.authState)
    var finalPass = await getPass(req.authState)
    var finalCID = await getCID(req.authState)
    if (!finalPass){
      finalPass = await getPass(req.authState)
    }
    const hashPass = await bcrypt.hash(String(finalPass), 10)
  console.log('Auth user and pass? ', finalUsername, finalPass)
    if(!finalPass){
      return {
        status: 400,
        info:  'passfail',
        userData: null
      }
    }

    //CHECK IF WE HAVE AN ADMIN USER
    var finalAdmin = await getAdmin(req.authState)
    var finalRole = 'user'
    if(!finalAdmin){
      finalAdmin = false
    } else {
      finalRole = 'admin'
    }
    console.log('made it past connection')
    const insertedUser = new User({
      userInfo: {
        CID: finalCID,
        username: finalUsername,
        password: hashPass,
        email: user.email,
        fName: user.userDeets.name.split(' ')[0],
        lName: user.userDeets.lastName,
        profilePhoto: user.userDeets.photo
      },
      employeeData: {
        role: finalRole,
        isAdmin: finalAdmin,
        availableSurvey: false
      }
    })
    console.log('user added')
    const savedUser = await insertedUser.save();
    if(finalAdmin){
      const result = await $fetch(`/api/company/addAdminUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: savedUser._id,
          CID: finalCID
        })
      })
    }
    console.log('user inserted')
    //now we clear state variable
    setCookie(event, 'userloggedin', JSON.stringify(insertedUser!), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 3, //3 days
      })
    killUser(req.authState)
    killPass(req.authState)
    killCID(req.authState)
    return {
      status: 200,
      info: 'we good :)',
      userData: finalUsername
    }
  } catch (error) {
    console.log('WHATWENTWRONG', error)
      return {
        status: 400,
        info: 'user taken.',
        userData: null
      }
  }
})
