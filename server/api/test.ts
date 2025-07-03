import connectDB from '~/server/utils/db'

//creating a utility should hypothetically fix connection issues
export default defineEventHandler(async (event) => {
  try {
    await connectDB()
    return true
  } catch (err) {
    return false
  }
})