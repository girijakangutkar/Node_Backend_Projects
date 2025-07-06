const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3 },
  email: { type: String, required: true, unique: true },
  rentedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

module.exports = mongoose.model("User", UserSchema);
