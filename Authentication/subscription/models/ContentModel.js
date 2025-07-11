const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  name: String,
  description: { type: String },
  image: { type: String },
  content: { type: String },
  //   userId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "users",
  //     required: true,
  //   },
  contentType: {
    type: String,
    enum: ["Premium", "Pro", "Free"],
    default: "Free",
  },
});

const ContentModel = mongoose.model("content", ContentSchema);

module.exports = ContentModel;
