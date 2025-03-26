const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema({
  userType: {
    type: String,
    default: "patient",
  },

  patientID: {
    type: Number,
    required: true,
  },

  patientName: {
    type: String,
    required: true,
  },

  mobile: {
    type: Number,
    required: true,
  },

  email: {
    type: String,
    // required: true,
  },

  address: {
    type: String,
  },

  disease: {
    type: String,
    required: true,
  },

  doctorID: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor", 
    required: true,
  },



  time: {
    type: String,
  },

  date: {
    type: String,
  },

  age: {
    type: Number,
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },
});

const AppointmentModel = mongoose.model("appointment", appointmentSchema);

module.exports = { AppointmentModel };
