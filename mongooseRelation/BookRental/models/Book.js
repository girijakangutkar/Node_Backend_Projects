const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true, minLength: 3 },
  author: { type: String, required: true },
  genre: String,
  rentedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Book", BookSchema);
