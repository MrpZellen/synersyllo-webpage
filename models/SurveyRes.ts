import mongoose from "mongoose";
const { Schema } = mongoose;

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
});

const SurveyRes = mongoose.model('SurveyRes', surveyResSchema);
export default SurveyRes;