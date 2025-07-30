import connectDB from "~/server/utils/db";
import { ObjectId } from "mongodb";
import Group from "~/models/Group";

export default defineEventHandler(async (event) => {
  let req = await readBody(event)
  console.log(req)
  try { 
    await connectDB();
    console.log(req.admin)
    if(!req.admin){
      return {
        status: 400,
        message: 'not an admin account!',
        groups: null
      }
    }
    console.log('getting companyID')
    const lookForGroup = await Group.findOne({'name': req.newGroup.name})
    if(lookForGroup){
      console.error('group already made!')
      return {
        status: 401,
        message: 'group exists!',
        groups: null
      }
    }
    const result = await Group.insertOne(req.newGroup)
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
