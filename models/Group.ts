import mongoose from 'mongoose';

const SurveyAdditionSchema = new mongoose.Schema({
  qType: {
    type: String,
    enum: ['choice', 'multiplechoice', 'slider'],
    required: false
  },
  question: { type: String, required: false },
  responses: {
    type: [String],
    required: (function (this: any) {
      return this.qType.enum !== 'slider';
    }),
    default: undefined
  }
}, { _id: false });

const GroupSchema = new mongoose.Schema({
  CID: { type: String, required: true },
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  permittedRoles: [{ type: String, required: false }],
  groupLead: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  BobID: { type: String, ref: 'Bob', required: true },
  GroupStatus: { type: Number, required: false },
  surveyAdditions: {
    type: [SurveyAdditionSchema],
    required: false
  }
});
export default mongoose.model('Group', GroupSchema);