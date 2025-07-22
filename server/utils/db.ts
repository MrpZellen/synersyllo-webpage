import mongoose from 'mongoose'


export default async function connectDB() {
  if (mongoose.connection.readyState === 1) return
  try {
    await mongoose.connect('mongodb://mongo:27017/company_storage')
    mongoose.set('debug', true)
    console.log('success')  
  } catch (err) {
    console.error('connection was wrong: ', err)
    throw err
  }
}