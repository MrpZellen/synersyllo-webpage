import connectDB from "~/server/utils/db";
import User from "~/models/User";
import mongoose, { mongo, Schema } from "mongoose";
import SurveyRes from "~/models/SurveyRes";
import { reseller } from "googleapis/build/src/apis/reseller";

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
    const surveyResSchema = new Schema({
    schedulingMeetups: {
    schedulingRating: { type: Schema.Types.Mixed },
    unnecessaryScheduleItems: { type: Schema.Types.Mixed },
    scheduleAdditions: { type: Schema.Types.Mixed },
    workloadFairness: { type: Schema.Types.Mixed },
    assistanceAvailability: { type: Schema.Types.Mixed },
    managerAccessibility: { type: Schema.Types.Mixed },
    checkinComfort: { type: Schema.Types.Mixed },
    schedulingNeedsMet: { type: Schema.Types.Mixed },
    ptoRespected: { type: Schema.Types.Mixed },
    notesOnScheduling: { type: Schema.Types.Mixed },
  },
    workLifeBalance: { type: Schema.Types.Mixed },
    companySpecific: { type: Schema.Types.Mixed },
  }, {
    collection: collName, //sets the company specific collection name
  });
  console.log('SurvRes content:', JSON.stringify(req.survRes))
  const SurveyRes = surveyDB.model('SurveyRes', surveyResSchema);
  const result = new SurveyRes(req.survRes)
  const savedResult = await result.save()
  console.log(savedResult)
  return {
    info: savedResult,
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
