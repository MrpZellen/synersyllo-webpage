import connectDB from "~/server/utils/db";
import { ObjectId } from "mongodb";
import Group from "~/models/Group";

export default defineEventHandler(async (event) => {
  let req = await readBody(event)
  console.log('straight up req-in it:', req)
  try {
    await connectDB()
    console.log(req.admin)
    if(!req.admin){
      return {
        status: 400,
        message: 'not an admin account!',
        group: null
      }
    }
    console.log('getting companyID')
    const result = await Group.findOne({ GID: req.GID })
    console.log('groups found', result);
    if(result === null){
      console.error('NO groups yet?')
      return {
        status: 400,
        message: 'no group',
        group: null
      }
    }
    return {
      status: 201,
      message: 'Groups found successfully', //me when i
      group: result
    }
  } catch (error) {
    console.log('WHATWENTWRONG', error)
      return {
        status: 400,
        message: 'what?!?! :(',
        group: null
      }
  }
})
