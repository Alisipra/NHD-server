const express = require("express");
const { connection } = require("./configs/db");
require("dotenv").config();
const cors = require("cors");

const adminRouter = require("./routes/Admins.Route");
const ambulanceRouter = require("./routes/Ambulances.Route");
const appointmentRouter = require("./routes/Appointments.Route");
const bedRouter = require("./routes/Beds.Route");
const doctorRouter = require("./routes/Doctors.Route");
const hospitalRouter = require("./routes/Hospitals.Route");
const nurseRouter = require("./routes/Nurses.Route");
const patientRouter = require("./routes/Patients.Route");
const paymentRouter = require("./routes/Payments.route");
const prescriptionRouter = require("./routes/Prescriptions.Route");
const reportRouter = require("./routes/Reports.Route");
const bodyParser = require("body-parser");
const MedicalHistory=require("./routes/MedicalHistory.Route")


const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json())
app.use(express.json()); // Parses JSON data
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.use("/admin", adminRouter);
app.use("/ambulances", ambulanceRouter);
app.use("/appointments", appointmentRouter);
app.use("/beds", bedRouter);
app.use("/doctors", doctorRouter);
app.use("/hospitals", hospitalRouter);
app.use("/nurses", nurseRouter);
app.use("/patients", patientRouter);
app.use("/payments", paymentRouter);
app.use("/prescriptions", prescriptionRouter);
app.use("/reports", reportRouter);
app.use("/history", MedicalHistory );
const port=1000;
app.listen(port, async() => {
  try {
    

    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log("Unable to connect to DB");
    console.log(error);
  }
  
  console.log(`Listening at port ${port}`);
});
