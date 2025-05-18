const express = require("express");
const { AmbulanceModel } = require("../models/Ambulance.model");

const router = express.Router();

router.get("/", async (req, res) => {
  let query = req.query;
  try {
    const ambulances = await AmbulanceModel.find(query);
    res.status(200).send(ambulances);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong" });
  }
});

router.post("/add", async (req, res) => {
  const payload = req.body;

  try {
    // Check if ambulance with the same ambulanceID already exists
    const existingAmbulance = await AmbulanceModel.findOne({ ambulanceID: payload.ambulanceID });

    if (existingAmbulance) {
      return res.status(400).send({ message: "Ambulance already present with this ID" });
    }

    const ambulance = new AmbulanceModel(payload);
    await ambulance.save();
    return res.send({ message: "Ambulance Added Successfully" });

  } catch (error) {
    console.error("Error adding ambulance:", error);
    return res.status(500).send({ message: "Something went wrong", error });
  }
});


router.patch("/:ambulanceId", async (req, res) => {
  const id = req.params.ambulanceId;
  const payload = req.body;
  try {
    const ambulance = await AmbulanceModel.findByIdAndUpdate(
      { _id: id },
      payload
    );
    if (!ambulance) {
      return res.status(404).send({ msg: `Ambulance with id ${id} not found` });
    }
    res.status(200).send(`Ambulance with id ${id} updated`);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: "Something went wrong, unable to Update." });
  }
});

router.delete("/:ambulanceId", async (req, res) => {
  const id = req.params.ambulanceId;
  try {
    const ambulance = await AmbulanceModel.findByIdAndDelete({ _id: id });
    if (!ambulance) {
      return res.status(404).send({ msg: `Ambulance with id ${id} not found` });
    }
    res.status(200).send(`Ambulance with id ${id} deleted`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Delete." });
  }
});

module.exports = router;
