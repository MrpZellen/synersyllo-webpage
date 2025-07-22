import connectDB from "~/server/utils/db";
import { ObjectId } from "mongodb";
import Company from "~/models/Company";

export default defineEventHandler(async (event) => {
  let req = await readBody(event)
  console.log(req)
  try { 
    await connectDB();
    console.log('making company')
    const insertedCompany = new Company({

    })
    console.log('company added')
    await insertedCompany.save();
    console.log('company inserted')
  } catch (error) {
    console.log('WHATWENTWRONG', error)
      return {
        status: 400,
        error: 'company freaked it.',
        userTaken: true
      }
  }
})
