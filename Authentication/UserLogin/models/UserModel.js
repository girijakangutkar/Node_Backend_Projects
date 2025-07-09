const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: String,
  email: { type: String, unique: true },
  password: String,
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
