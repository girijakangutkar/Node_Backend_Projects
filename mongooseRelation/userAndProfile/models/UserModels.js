const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, minLength: 3 },
  email: { type: String, unique: true },
  profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
});

const ProfileSchema = new mongoose.Schema({
  bio: { type: String },
  socialMediaLinks: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
});

const UserModel = mongoose.model("User", UserSchema);
const ProfileModel = mongoose.model("Profile", ProfileSchema);

module.exports = { UserModel, ProfileModel };
