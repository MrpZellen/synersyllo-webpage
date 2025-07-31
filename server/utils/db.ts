import mongoose from 'mongoose'


export default async function connectDB() {
  if (mongoose.connection.readyState === 1){
    console.log('already connected')
    return
  }
  if (mongoose.connection.readyState === 2) {
    console.log('mongoose connecting...')
    return;
  }
  try {
    await mongoose.connect('mongodb://mongo:27017/company_storage?directConnection=true&replicaSet=false')
    mongoose.set('debug', true)
    console.log('success')  
  } catch (err) {
    console.error('connection was wrong: ', err)
    throw err
  }
}