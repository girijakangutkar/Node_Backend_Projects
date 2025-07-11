const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, require: true },
  password: { type: String, require: true },
  profileId: Number,
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
