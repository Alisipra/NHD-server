const mongoose = require("mongoose");

const bedSchema = mongoose.Schema({
  bedNumber: {
    type: Number,
    required: true,
  },

  roomNumber: {
    type: Number,
    required: true,
  },

  occupied: {
    type: String,
  },
  ward: {
    type: String,
    // required: true,  // e.g., "Cardiology", "Neurology", "ICU"
  },
  patientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ipdPatient",
  },
});
bedSchema.index({ bedNumber: 1, roomNumber: 1 }, { unique: true });

const BedModel = mongoose.model("bed", bedSchema);

module.exports = { BedModel };
