// models/MedicalHistory.js
const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  patientID: { type: Number, required: true },
  doctorID: { type: mongoose.Schema.Types.ObjectId, ref: "doctor" },
  visitDate: { type: Date, default: Date.now },
  diagnosis: String,
  prescription: String,
  tests: [String],
  notes: String,
  testReport: {
    type: String,
    default: "", // optional fallback
  },
});

module.exports = mongoose.model("MedicalHistory", historySchema);