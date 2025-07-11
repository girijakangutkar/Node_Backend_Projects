const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  serviceName: { type: String, require: true },
  requestedDate: { type: Date, default: new Date(), require: true },
  bookingStatus: {
    type: String,
    enum: ["pending", "approved", "rejected", "cancelled"],
    default: "pending",
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const ServiceModel = mongoose.model("services", ServiceSchema);

module.exports = ServiceModel;
