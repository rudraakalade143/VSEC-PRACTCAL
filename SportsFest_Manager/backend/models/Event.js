const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true, trim: true },
    sport: { type: String, required: true, trim: true },
    teamName: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    eventDate: { type: String, required: true },
    venue: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);