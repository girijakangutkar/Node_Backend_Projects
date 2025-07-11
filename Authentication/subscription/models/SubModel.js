const mongoose = require("mongoose");

const subSchema = new mongoose.Schema({
  subscriptionName: String,
  status: {
    type: String,
    enum: ["active", "expired", "cancelled"],
    default: "active",
  },
  expiresOn: {
    type: Date,
    default: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

const SubModel = mongoose.model("Subscriptions", subSchema);

module.exports = SubModel;
