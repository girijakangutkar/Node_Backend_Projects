const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const BlogModel = mongoose.model("blogs", BlogSchema);

module.exports = BlogModel;
