const mongoose = require("mongoose");

const DishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  chef: { type: String, required: true, unique: true },
  status: { type: String, required: true, default: "OrderReceived" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const DishModel = mongoose.model("dishes", DishSchema);

module.exports = DishModel;
