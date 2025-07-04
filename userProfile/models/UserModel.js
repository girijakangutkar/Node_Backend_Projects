const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  profileName: { type: String, enum: ["fb", "twitter", "github", "instagram"] },
  url: {
    type: String,
    match: [
      /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
      "Please enter a valid URL",
    ],
  },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address",
    ],
  },
  password: { type: String, minLength: 6, min: 6 },
  profiles: [ProfileSchema],
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
