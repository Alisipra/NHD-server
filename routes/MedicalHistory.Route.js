// routes/history.js
const express = require("express");
const router = express.Router();
const MedicalHistory = require("../models/MedicalHistory.model");
const {PatientModel}=require("../models/Patient.model");

// Create a medical history record
router.post("/add", async (req, res) => {
  try {
    const { patientID, doctorID, diagnosis, prescription, tests, notes } = req.body;

    // Validate input
    if (!patientID || !doctorID || !diagnosis) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if patient exists
    const patient = await PatientModel.findOne({ patientID });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Create new medical history
    const newHistory = new MedicalHistory({
      patientID,
      doctorID,
      diagnosis,
      prescription,
      tests,
      notes,
    });

    await newHistory.save();

    // Update patient's history
    await PatientModel.findOneAndUpdate(
      { patientID },
      { $push: { history: newHistory._id } },
      { new: true }
    );

    res.status(201).json({ message: "History added successfully", newHistory });
  } catch (error) {
    console.error("Error in /add route:", error);
    res.status(500).json({ message: "Error adding history", error: error.message });
  }
});


// Get medical history by patient CNIC
router.get("/:cnic", async (req, res) => {
  try {
    const { cnic } = req.params;
   
    const patientID = parseInt(cnic);
    if (isNaN(patientID)) {
      return res.status(400).json({ message: "Invalid CNIC format" });
    }

    // Find patient by patientID (Ensure patientID exists in your schema)
    const patient = await PatientModel.findOne({ patientID });
    // console.log("🩺 Patient Data:", patient);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Fetch medical history - Use find() to get all records, or findOne() for the latest
    const history = await MedicalHistory.find({ patientID });
    // console.log("📚 Medical History Data:", history);


    // Ensure history is always an array
    const safeHistory = Array.isArray(history) ? history : [];

    res.status(200).json({ patient, history: safeHistory });
  } catch (error) {
    console.error("Error fetching medical history:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
