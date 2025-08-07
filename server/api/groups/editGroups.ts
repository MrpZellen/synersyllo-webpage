import connectDB from "~/server/utils/db";
import { ObjectId } from "mongodb";
import Group from "~/models/Group";
import { GroupType } from "~/models/GroupInterface";

export default defineEventHandler(async (event) => {
  let req = await readBody(event)
  let updatedGroup = req.updatedGroup
  console.log('and by it, lets just say: ', req)
  try {
    await connectDB()
    console.log('LETS UPDATE THE GROUP')
    const filterMyReq: any = Object.fromEntries(
      Object.entries(updatedGroup).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    )
    const result = await Group.updateOne({ GID: req.GID }, {$set: filterMyReq}).lean();
    console.log('groups found', result);
    if(result.modifiedCount === 0){
      console.error('NO groups yet?')
      return {
        status: 400,
        message: 'no group',
        group: null
      }
    }
    return {
      status: 201,
      message: 'Group updated successfully', //me when i
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
