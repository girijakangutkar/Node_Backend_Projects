const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;
