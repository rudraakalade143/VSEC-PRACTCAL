const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },
    winnerDepartment: { type: String, required: true, trim: true },
    points: { type: Number, required: true, min: 0, max: 100 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);