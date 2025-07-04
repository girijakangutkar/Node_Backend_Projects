const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true },
  type: { type: String, enum: ["car", "truck", "bike"], required: true },
  model: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  trips: [
    {
      startLocation: { type: String, required: true },
      endLocation: { type: String, required: true },
      distance: { type: Number, required: true, min: 1 },
      startTime: { type: Date, required: true },
      endTime: { type: Date, required: true },
    },
  ],
});

const VehicleModel = mongoose.model("vehicles", VehicleSchema);

module.exports = VehicleModel;
