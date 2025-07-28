import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },

  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],

  permittedRoles: [{ type: String, required: false }],

  groupLead: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],

  BobID: { type: mongoose.Schema.Types.ObjectId, ref: 'Bob', required: true },

  GroupStatus: { type: Number, required: true },

  surveyAdditions: {
    type: Map,
    of: {
      type: String,
      enum: ['choice', 'multiplechoice', 'slider']
    },
    required: true
  }
});

export default mongoose.model('Group', GroupSchema);