const express = require("express");
const { ReportModel } = require("../models/Report.model");
const { PatientModel } = require("../models/Patient.model");

const router = express.Router();

router.get("/", async (req, res) => {
  let query = req.query;
  try {
    const reports = await ReportModel.find(query);
    res.status(200).send(reports);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong" });
  }
});

// creating report by the doctor
router.post("/create", async (req, res) => {
  try {
    const {
      patientID,
        docName,
        docId,
        docDepartment,
        docMobile,
        medicines,
        extrainfo,
        patientName,
        patientAge,
        email,
        patientGender,
        patientMobile,
        patientBloodGroup,
        patientDisease,
        patientTemperature,
        patientWeight,
        patientBP,
        patientGlucose,
        tests
    }= req.body;

    // Fetch patient details
    const patient = await PatientModel.findOne({ patientID });
    
    if (!patient) {
      return res.status(404).send({ message: "Patient not found." });
    }
    

 // Current timestamp
    const now = new Date();

    // Create new report with patient data
    const newReport = new ReportModel({
      patientID: patient.patientID,
      docName,
      docId,
      docDepartment,
      docMobile,
      patientName: patientName || patient.patientName,
      patientAge: patientAge || patient.age,
      patientGender: patientGender || patient.gender,
      patientMobile: patientMobile || patient.mobile,
      patientBloodGroup: patientBloodGroup || patient.bloodGroup,
      email: email || patient.email,
      medicines,
      extrainfo,
      patientDisease,
      patientTemperature,
      patientWeight,
      patientBP,
      patientGlucose,
      tests,
      date: now.toISOString().split("T")[0], // YYYY-MM-DD
      time: now.toTimeString().split(" ")[0], //
    });
    
    await newReport.save();
    // Update patient record if any default values exist
    const updatedPatientData = {
      patientName: patient.patientName === "Unknown" ? patientName : patient.patientName,
      age: patient.age === 0 ? patientAge : patient.age,
      gender: patient.gender === "Unknown" ? patientGender : patient.gender,
      mobile: patient.mobile === "0300516661761" ? patientMobile : patient.mobile,
      bloodGroup: patient.bloodGroup === "Unknown" ? patientBloodGroup : patient.bloodGroup,
      email: patient.email === "N/A" ? email : patient.email,
    };
    await PatientModel.updateOne({ patientID }, { $set: updatedPatientData });
    
    return res.status(201).json({ message: "Report created successfully", newReport });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).send({ message: "Error creating report.", error });
  }
});

router.patch("/:reportId", async (req, res) => {
  const id = req.params.reportId;
  const payload = req.body;
  try {
    const report = await ReportModel.findByIdAndUpdate({ _id: id }, payload);
    if (!report) {
      res.status(404).send({ msg: `Report with id ${id} not found` });
    }
    res.status(200).send(`Report with id ${id} updated`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Update." });
  }
});

router.delete("/:reportId", async (req, res) => {
  const id = req.params.reportId;
  try {
    const report = await ReportModel.findByIdAndDelete({ _id: id });
    if (!report) {
      res.status(404).send({ msg: `Report with id ${id} not found` });
    }
    res.status(200).send(`Report with id ${id} deleted`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Delete." });
  }
});

module.exports = router;
