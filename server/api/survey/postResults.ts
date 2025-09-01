import mongoose, { mongo, Schema } from "mongoose";

export default defineEventHandler(async (event) => {
  let req = await readBody(event)
  console.log('got information: ', req)
  try {
    console.log('made it past connection')
    const surveyDB = mongoose.connection.useDb('survey_data');
    //how that we are using survey data, add the object
    const collections = (await mongoose.connection.db?.listCollections().toArray())!.map(item => item.name)
    console.log('collections and used one', mongoose.connection.db?.databaseName, collections)
    const collName = 'survRes' + req.CID
    if(!collections?.includes(collName)){ // create collection if it doesnt exist yet
      mongoose.connection.db?.createCollection(collName)
    }
    //in line schema define to set collection
    const surveyResult = {
    schedulingMeetups: req.survRes.schedulingMeetups,
    workLifeBalance: req.survRes.workLifeBalance,
    companySpecific: req.survRes.companySpecific,
  }
  //hand off to my BOB
  const result = await $fetch('/api/sendToBob', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        data: surveyResult,
        calendarDetails: req.calDetails,
        user: req.user,
        coll: collName
      }
    })
  return {
    info: result,
    status: 200,
    code: 'sent back data'
  }
  } catch (error) {
    mongoose.connection.useDb('company_storage')
    console.log('WHATWENTWRONG', error)
      return {
        info: null,
        status: 400,
        code: 'failed',
      }
  }
})
