import mongoose from 'mongoose'

let connect = false

export default async function connectDB() {
  if (connect) return
  try {
    await mongoose.createConnection('mongodb://localhost:8081', {
      dbName: 'company_storage',
    })
    connect = true
    console.log('success')
  } catch (err) {
    console.error('connection was wrong: ', err)
    throw err
  }
}