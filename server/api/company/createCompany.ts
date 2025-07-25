import connectDB from "~/server/utils/db";
import Company from "~/models/Company";

export default defineEventHandler(async (event) => {
  let req = await readBody(event)
  console.log(req)
  try { 
    await connectDB();
    console.log('making company')

    const insertedCompany = new Company(req)
    console.log('company added')
    const result = await insertedCompany.save();
    console.log('company inserted', result);   

    let x = await Company.find({});
    console.log("huzzah", x)

    return {
      status: 201,
      message: 'Company created successfully', //me when i lie
      companyId: insertedCompany.companyID
    }
  } catch (error) {
    console.log('WHATWENTWRONG', error)
      return {
        status: 400,
        message: 'company EXPLODED.',
        companyId: null
      }
  }
})
