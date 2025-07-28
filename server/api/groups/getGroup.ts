import connectDB from "~/server/utils/db";
import { ObjectId } from "mongodb";
import Group from "~/models/Group";

export default defineEventHandler(async (event) => {
  let req = await readBody(event)
  console.log(req)
  try { 
    await connectDB();
    console.log('getting companyID')
    const result = await Group.find({})
    console.log('groups found', result);
    if(!result){
      console.error('NO groups yet?')
      return {
        status: 400,
        message: 'no groups',
        groups: null
      }
    }
    return {
      status: 201,
      message: 'Groups found successfully', //me when i
      groups: result
    }
  } catch (error) {
    console.log('WHATWENTWRONG', error)
      return {
        status: 400,
        message: 'what?!?! :(',
        groups: null
      }
  }
})
