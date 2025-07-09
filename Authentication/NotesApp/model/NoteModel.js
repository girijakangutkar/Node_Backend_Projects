const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const NoteModel = mongoose.model("notes", NoteSchema);

module.exports = NoteModel;
