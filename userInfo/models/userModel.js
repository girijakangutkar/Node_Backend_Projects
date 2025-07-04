const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: { type: String, default: "India" },
  pincode: Number,
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: { type: Number, min: 1, max: 150 },
  address: [AddressSchema],
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
