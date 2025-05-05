const mongoose = require("mongoose");

const ipdPatientSchema = new mongoose.Schema({
  userType: {
    type: String,
    default: "patient",
    enum: ["patient"],
  },

  patientID: {
    type: Number,
    required: true,
    unique: true,
  },

  patientName: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },

  mobile: {
    type: String,
    minlength: 10,
  },

  emergencyNo: {
    type: String,
    minlength: 10,
  },

  guardianName: {
    type: String,
    required: true,
  },

  guardianContact: {
    type: String,
    minlength: 10,
    required: true,
  },

  email: {
    type: String,
    lowercase: true,
  },

  password: {
    type: String,
    default: "password", // Ideally, should be hashed
  },

  bloodGroup: {
    type: String,
  },

  DOB: {
    type: Date,
  },

  address: {
    type: String,
  },

  image: {
    type: String, // Store path or image URL
  },

  disease: {
    type: String,
  },

  reasonForAdmission: {
    type: String,
    required: true,
  },

  test: {
    type: String,
  },

  admitted: {
    type: Boolean,
    default: true,
  },

  admissionDate: {
    type: Date,
    default: Date.now,
  },

  dischargeDate: {
    type: Date,
  },

  department: {
    type: String,
  },

  ward: {
    type: String,
    required: true,
  },

  bedNumber: {
    type: String,
    required: true,
  },

  roomNo: {
    type: String, // Optional
  },

  doctorAssigned: {
    type: String, // This could be doctor name or you can also use docID ref
  },

  docID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
  },

  nurseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "nurse",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const IPDPatientModel = mongoose.model("ipdPatient", ipdPatientSchema);
module.exports = { IPDPatientModel };
