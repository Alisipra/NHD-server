const express = require("express");
const { AppointmentModel } = require("../models/Appointment.model");
const { authenticate } = require("../middlewares/doctorAuth");
const { default: mongoose } = require("mongoose");
const router = express.Router();

// router.get("/", async (req, res) => {
//   let query = req.query;
//   try {
//     const appointments = await AppointmentModel.find(query);
//     res.status(200).send(appointments);
//   } catch (error) {
//     console.log(error);
//     res.status(400).send({ error: "Something went wrong" });
//   }
// });
// get specific doctors appointments
// router.get("/", async (req, res) => {
//   try {
//       const { doctorID } = req.user; // Assuming you get doctorID from JWT
//       if (!doctorID) {
//           return res.status(401).json({ message: "Unauthorized" });
//       }

//       // Fetch only appointments for the logged-in doctor
//       const appointments = await AppointmentModel.find({ doctorID });

//       res.json(appointments);
//   } catch (error) {
//       res.status(500).json({ message: "Server error" });
//   }
// });
router.get("/", authenticate, async (req, res) => {
  try {
    const { doctorID } = req.user; // Extract doctorID from middleware

    if (!doctorID) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const objectIdDoctorID = new mongoose.Types.ObjectId(doctorID);
    // Fetch appointments for the logged-in doctor
    const appointments = await AppointmentModel.find({ doctorID: objectIdDoctorID });
    // const appointments = await AppointmentModel.find({ doctorID });

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error); // Log for debugging
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/create", async (req, res) => {
  const payload = req.body;
  // if (Object.values(payload).some((value) => !value)) {
  //   return res.status(400).json({ message: "Please fill all the required fields." });
  // }
  try {
   
    const appointment = new AppointmentModel(payload);
   
    await appointment.save();
  } catch (error) {
   return res.send(error);
  }
  return res.status(200).json({message:"Appointment successfully booked.",payload});
});

router.patch("/:appointmentId", async (req, res) => {
  const id = req.params.appointmentId;
  const payload = req.body;
  try {
    const appointment = await AppointmentModel.findByIdAndUpdate(
      { _id: id },
      payload
    );
    if (!appointment) {
      return res.status(404).send({ msg: `Appointment with id ${id} not found` });
    }
    res.status(200).send(`Appointment with id ${id} updated`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Update." });
  }
});

router.delete("/:appointmentId", async (req, res) => {
  const id = req.params.appointmentId;
  try {
    const appointment = await AppointmentModel.findByIdAndDelete({ _id: id });
    if (!appointment) {
     return res.status(404).send({ msg: `Appointment with id ${id} not found` });
    }
    res.status(200).send(`Appointment with id ${id} deleted`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Delete." });
  }
});

module.exports = router;
