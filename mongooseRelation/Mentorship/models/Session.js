const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
  learners: [
    {
      learnerId: { type: mongoose.Schema.Types.ObjectId, ref: "Learner" },
      attendance: {
        type: String,
        enum: ["attended", "cancelled", "pending"],
        default: "pending",
      },
      feedback: String,
    },
  ],
  topic: String,
  scheduledAt: Date,
  notes: String,
  isActive: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false },
});

module.exports = mongoose.model("Session", SessionSchema);
