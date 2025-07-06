const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true, minLength: 3 },
  author: { type: String, required: true },
  status: {
    type: String,
    enum: ["available", "borrowed"],
    default: "available",
    required: true,
  },
  borrowers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  createdAt: { type: Date, default: Date.now },
});

// Pre hook: prevent borrowing if not available
BookSchema.pre("save", function (next) {
  if (
    this.isModified("borrowers") &&
    this.status === "available" &&
    this.borrowers.length > 0
  ) {
    this.status = "borrowed";
  }
  next();
});

// Post hook: if no borrowers, mark as available
BookSchema.post("save", function (doc) {
  if (doc.borrowers.length === 0 && doc.status !== "available") {
    doc.status = "available";
    doc.save();
  }
});

module.exports = mongoose.model("Book", BookSchema);
