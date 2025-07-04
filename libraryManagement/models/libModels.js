const mongoose = require("mongoose");

const LibSchema = new mongoose.Schema({
  title: String,
  author: String,
  status: { type: String, default: "available" },
  borrowerName: { type: String, default: null },
  borrowDate: { type: Date, default: null },
  dueDate: { type: Date, default: null },
  returnDate: { type: Date, default: null },
  overdueFees: { type: Number, default: null },
});

const LibModel = mongoose.model("books", LibSchema);

module.exports = LibModel;
