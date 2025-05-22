const express = require("express");
const  {PatientModel}  = require("../models/Patient.model");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { ReportModel } = require("../models/Report.model");
const MedicalHistory = require("../models/MedicalHistory.model");
const { IPDPatientModel } = require("../models/IPD.model");
const { BedModel } = require("../models/Bed.model");
const router = express.Router();

//  Fetch all patients
router.get("/", async (req, res) => {
  try {
    const patients = await PatientModel.find();
    res.status(200).send({ patients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).send({ error: "Something went wrong." });
  }
});

router.get("/ipdpatients", async (req, res) => {
  try {
    const patients = await IPDPatientModel.find();
    res.status(200).send({ patients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).send({ error: "Something went wrong." });
  }
});


//  Register a patient (Admin or Doctor)
// router.post("/register", async (req, res) => {
//   const { patientID } = req.body;

//   try {
//     const patientExists = await PatientModel.findOne({ patientID });
//     if (patientExists) {
//       return res.status(409).send({
//         message: "Patient already exists",
//         id: patientExists.patientID,
//       });
//     }

//     const newPatient = new PatientModel(req.body);
//     await newPatient.save();
//     res.status(201).send({ id: newPatient.patientID,newPatient });
//   } catch (error) {
//     console.error("Error during patient registration:", error);
//     res.status(500).send({ error: "Failed to register patient." });
//   }
// });
router.post("/register", async (req, res) => {
  ////const { patientID, patientName, age, gender, mobile,emergencyNo, bloodGroup, email,ward,password } = req.body;
  const { patientID, patientName, age, gender, mobile,emergencyNo, bloodGroup, email,ward,password } = req.body;

  try {
    // Check if patient already exists
    const patientExists = await PatientModel.findOne({ patientID });
    if (patientExists) {
      return res.status(409).json({
        message: "Patient already exists",
        id: patientExists.patientID,
      });
    }

    // Ensure all required fields are provided or set default values
    const newPatient = new PatientModel({
      patientID,
      patientName: patientName || "Unknown",
      age: age ? parseInt(age) : 0,

      gender: gender || "Unknown",
      mobile: mobile || "0000000000",

      emergencyNo: emergencyNo,
      bloodGroup: bloodGroup || "Unknown",
      email: email || "N/A",
      ward: ward || "N/A",
      password:password ||"123456789"
    });

    await newPatient.save();
    return res.status(201).json({ id: newPatient.patientID, newPatient });
  } catch (error) {
    console.error("Error during patient registration:", error);
    return res.status(500).json({ error: "Failed to register patient." });
  }
});

router.post("/admitPatient", async (req, res) => {
  const {
    patientID,
    patientName,
    age,
    gender,
    mobile,
    emergencyNo,
    bloodGroup,
    email,
    ward,
    bedNumber,
    reasonForAdmission,
    guardianName,
    guardianContact,
    doctorAssigned,
    docID,
    nurseID,
    DOB,
    address,
    disease,
    test,
    department,
    roomNo
  } = req.body;


  try {
    // Check if patient already exists by patientID
    const patientExists = await IPDPatientModel.findOne({ patientID, admitted: true });

    if (patientExists) {
      return res.status(409).json({
        message: "Patient already admitted",
        id: patientExists.patientID,
      });
    }

    // Create a new IPD patient
    const newPatient = new IPDPatientModel({
      patientID,
      patientName: patientName || "Unknown",
      age: age || 0,
      gender: gender || "Unknown",
      mobile: mobile || "",
      emergencyNo: emergencyNo ,
      bloodGroup: bloodGroup || "Unknown",
      email: email || "N/A",
      ward: ward || "General",
      bedNumber: bedNumber || "N/A",
      reasonForAdmission: reasonForAdmission || "N/A",
      guardianName: guardianName || "N/A",
      guardianContact: guardianContact || "N/A",
      doctorAssigned: doctorAssigned || "N/A",
      docID: docID || null,
      nurseID: nurseID || null,
      DOB: DOB || null,
      address: address || "",
      disease: disease || "",
      test: test || "",
      department: department || "",
      roomNo: roomNo || "",
    });

    await newPatient.save();


     // 2. Update bed status to 'occupied'
    //  await BedModel.findOneAndUpdate(
    //   { bedNumber, roomNumber: roomNo },
    //   { occupied: "occupied" }
    // );
    
    await BedModel.findOneAndUpdate(
  { bedNumber, roomNumber: roomNo },
  {
    occupied: "occupied",
    patientID: newPatient._id,  // <-- Link patient to bed
  }
);

    return res.status(201).json({
      message: "Patient admitted successfully.",
      id: newPatient.patientID,
      newPatient,
    });
  } catch (error) {
    console.error("Error during patient admission:", error);
    return res.status(500).json({ error: "Failed to admit patient." });
  }
});


//  Patient Login
router.post("/login", async (req, res) => {
  const { patientID, password } = req.body;

  try {
    const patient = await PatientModel.findOne({ patientID, password });

    if (!patient) {
      return res.status(404).send({ message: "Patient not found or wrong credentials." });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { patientID: patient.patientID, email: patient.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
  

    // ✅ Fetch Reports Related to Patient
    const report = await ReportModel.find({ patientID });

    res.status(200).send({
      message: "Login Successful",
      user: patient,
      token,
      report,
    });
  } catch (error) {
    console.error("Error occurred, unable to login:", error);
    res.status(500).send({ error: "Internal server error." });
  }
});

//  Update Patient Info (Admin Only)
router.patch("/:patientId", async (req, res) => {
  const id = req.params.patientId;
  const payload = req.body;

  try {
    const patient = await PatientModel.findByIdAndUpdate(id, payload, { new: true });

    if (!patient) {
      return res.status(404).send({ msg: `Patient with id ${id} not found` });
    }

    res.status(200).send({ message: `Patient updated successfully`, patient });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).send({ error: "Something went wrong, unable to update." });
  }
});

//  Delete Patient (Admin Only)
router.delete("/:patientId", async (req, res) => {
  const id = req.params.patientId;

  try {
    const patient = await PatientModel.findByIdAndDelete(id);

    if (!patient) {
      return res.status(404).send({ msg: `Patient with id ${id} not found` });
    }

    res.status(200).send({ message: `Patient deleted successfully.` });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).send({ error: "Something went wrong, unable to delete." });
  }
});

// medical history geting
// Get patient's medical history by CNIC
router.get("/:cnic", async (req, res) => {
  try {
    const { cnic } = req.params;

    // Find patient by CNIC
    const patient = await PatientModel.findOne({ patientID: cnic });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Fetch medical history for this patient
    const history = await MedicalHistory.find({ patientID: patient.patientID });

    res.status(200).json({ patient, history });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});


router.post("/discharge", async (req, res) => {
  const { patientID, bedNumber, roomNo } = req.body;

  try {
    // 1. Update bed to available
    await BedModel.findOneAndUpdate(
      { bedNumber, roomNumber: roomNo },
      {
        occupied: "available",
        patientID: null
      }
    );

    // 2. Remove patient from IPD list
    const removedPatient = await IPDPatientModel.findOneAndDelete({ patientID });

    if (!removedPatient) {
      return res.status(404).json({ message: "Patient not found in IPD" });
    }

    res.status(200).json({ message: "Patient discharged successfully", removedPatient });
  } catch (error) {
    console.error("Error during discharge:", error);
    res.status(500).json({ error: "Failed to discharge patient" });
  }
});
// Example Express backend route
router.delete('/discharge/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await IPDPatientModel.findByIdAndDelete(id); // or use update to mark as discharged
    res.json({ message: 'Patient discharged' });
  } catch (error) {
    res.status(500).json({ error: 'Error discharging patient' });
  }
});


module.exports = router;
