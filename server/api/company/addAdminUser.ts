import connectDB from "~/server/utils/db";
import { ObjectId } from "mongodb";
import Company from "~/models/Company";

export default defineEventHandler(async (event) => {
  let req = await readBody(event)
  console.log(req)
  try { 
    await connectDB();
    console.log('checking companyID')
    const result = await Company.findOneAndUpdate({'companyID': req.CID}, {
      $push: { adminAccounts: req.uid }
    })
    console.log('company found', result);
    if(!result){
      console.error('NOT A VALID COMPANY, or insert failed')
      return {
        status: 400,
        message: 'Invalid ID',
        validID: null
      }
    }
    return {
      status: 201,
      message: 'Insert completed successfully', //me when i
      validID: req.uid
    }
  } catch (error) {
    console.log('WHATWENTWRONG', error)
      return {
        status: 400,
        message: 'company EXPLODED.',
        validID: null
      }
  }
})
