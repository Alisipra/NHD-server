const mongoose = require("mongoose");

const patientSchema = mongoose.Schema({
  userType: {
    type: String,
    default: "patient",
  },

  patientID: {
    type: Number,
    required: true,
    unique:true
  },

  patientName: {
    type: String,
  },

  mobile: {
    type: Number,
    minlength: 11,
  },
 emergencyNo :{
    type: Number,
    minlength: 11,
    require:false,
    default:null
  },

  email: {
    type: String,
  },

  password: {
    type: String,
    default: "password",
  },

  age: {
    type: Number,
  },

  department: {
    type: String,
  },
  ward: {
    type: String,
    require:false,
    default:"general"
  },
  gender: {
    type: String,
  },

  bloodGroup: { type: String},
  DOB: {
    type: String,
  },

  address: {
    type: String,
  },

  image: {
    type: String,
  },

  disease: {
    type: String,
  },

  details: {
    type: String,
  },

  admitted: {
    type: Boolean,
    default: true,
  },

  date: {
    type: Date,
  },

  docID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
  },

  nurseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "nurse",
  },
});

const PatientModel = mongoose.model("patient", patientSchema);

module.exports = { PatientModel };
// module.exports = mongoose.model("patient", patientSchema);
