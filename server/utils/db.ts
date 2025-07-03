import mongoose from 'mongoose'

let connect = false

export default async function connectDB() {
  if (connect) return

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: process.env.DBNAME,
    })
    connect = true
    console.log('success')
  } catch (err) {
    console.error('connection was wrong: ', err)
    throw err
  }
}