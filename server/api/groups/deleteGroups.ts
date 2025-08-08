import connectDB from "~/server/utils/db";
import { ObjectId } from "mongodb";
import Group from "~/models/Group";
import User from "~/models/User";

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
        groups: null
      }
    }
    console.log('getting companyID')
    const groupToDie = await Group.findOne({ GID: req.GID})
    if(!groupToDie){
      return {
        status: 400,
        message: 'group isnt real',
        groups: null
      }
    }
    await User.findByIdAndUpdate(groupToDie.groupLead, {
      'employeeData.groups': {$pop: req.GID }
    })
    groupToDie.members.forEach(member => {
          const removed = User.findByIdAndUpdate(member, {
            'employeeData.groups': { $pop: req.GID }
          })
          console.log(removed)
        });
    const result = await Group.deleteOne({ GID: req.gid})
    console.log('groups deleted', result);
    return {
      status: 201,
      message: 'Groups found successfully', //me when i
      groups: result
    }
  } catch (error) {
    console.log('WHATWENTWRONG', error)
      return {
        status: 400,
        message: 'group sticking around :(',
        groups: null
      }
  }
})
