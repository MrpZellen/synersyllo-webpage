import mongoose from 'mongoose';
//scema from ChatGPT, generated based on my mongo document format.

const LocalizationSchema = new mongoose.Schema({
  city: { type: String, required: false },
  state: { type: String, required: false },
  postzip: { type: String, required: false },
  'timezone-utc': { type: String, required: false },
  timezone: { type: String, required: false }
}, { _id: false });

const CompanyInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: { type: String, required: true },
  size: { type: Number, required: true },
  localization: { type: LocalizationSchema, required: false }
}, { _id: false });

const SpecificationsSchema = new mongoose.Schema({
  tone: { type: String, required: false },
  description: { type: Number, required: false },
  avoid: { type: [String], required: false }
}, { _id: false });

const BobInfoSchema = new mongoose.Schema({
  bobInstanceID: { type: String, required: false },
  specifications: { type: SpecificationsSchema, required: false }
}, { _id: false });

const CompanySchema = new mongoose.Schema({
  companyInfo: { type: CompanyInfoSchema, required: true },
  companyID: { type: String, required: true },
  bobInfo: { type: BobInfoSchema, required: false },
  adminAccounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }],
  website: { type: String, required: false }
}, { timestamps: true });

export default mongoose.model('Company', CompanySchema);
