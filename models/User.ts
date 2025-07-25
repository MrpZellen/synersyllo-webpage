import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  userInfo: {
    fName: { type: String },
    lName: { type: String },
    username: { type: String, required: true, unique: true },
    password: { type: String },
    CID: { type: String, ref: 'Company' },
    email: { type: String, required: true },
    profilePhoto: {type: String}
  },
  employeeData: {
    isAdmin: { type: Boolean, default: false },
    role: { type: String, required: true },
    groups: [{
      optedIn: { type: Boolean, default: false },
      GID: { type: Schema.Types.ObjectId, ref: 'Group' }
    }],
    groupPerms: { type: Schema.Types.Mixed, default: null } // adjust if structure known
  },
  settings: {
    timezone: { type: String, default: 'EST' },
    accessibility: {
      bigText: { type: Boolean, default: false },
      screenReader: { type: Boolean, default: false },
      tts: { type: Boolean, default: false }
    },
    TWOFA: { type: Boolean, default: false },
    colormode: { type: String, enum: ['dark', 'light'], default: 'dark' },
    weekStart: { type: String, enum: ['SUN', 'MON'], default: 'MON' },
    standardHour: { type: Boolean, default: true },
    workWeek: {
      startTime: { type: String, default: '9:00AM' },
      endTime: { type: String, default: '5:00PM' }
    }
  }
});

const User = mongoose.model('User', userSchema);
export default User;