const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  goldMember: {
    type: String,
    enum: ["Premium", "Pro", "Free"],
    default: "Free",
  },
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
