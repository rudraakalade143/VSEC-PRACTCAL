const express = require("express");
const Result = require("../models/Result");

const router = express.Router();

// Get all results with event details
router.get("/", async (req, res) => {
  try {
    const results = await Result.find()
      .populate("event")
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a result
router.post("/", async (req, res) => {
  try {
    const result = await Result.create(req.body);
    const populatedResult = await result.populate("event");

    res.status(201).json(populatedResult);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a result
router.delete("/:id", async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json({ message: "Result deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;