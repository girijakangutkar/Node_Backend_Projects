const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: String, // e.g., "U1"
  name: String,
  email: { type: String, unique: true },
  joinedAt: { type: Date, default: new Date() },
});

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
