import connectDB from "~/server/utils/db";
import { ObjectId } from "mongodb";
import Company from "~/models/Company";

export default defineEventHandler(async (event) => {
  let req = await readBody(event)
  console.log(req)
  try { 
    await connectDB();
    console.log('checking companyID')
    const result = await Company.findOne({'companyID': req.CID})
    console.log('company found', result);
    if(!result){
      console.error('NOT A VALID COMPANY')
      return {
        status: 400,
        message: 'Invalid ID',
        validID: false
      }
    }
    return {
      status: 201,
      message: 'Company found successfully', //me when i
      validID: true
    }
  } catch (error) {
    console.log('WHATWENTWRONG', error)
      return {
        status: 400,
        message: 'company EXPLODED.',
        validID: false
      }
  }
})
