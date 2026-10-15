require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const eventRoutes = require("./routes/eventRoutes");
const resultRoutes = require("./routes/resultRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "SportsFest Manager API is running" });
});

app.use("/api/events", eventRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Department leaderboard
app.get("/api/leaderboard", async (req, res) => {
  try {
    const Result = require("./models/Result");
    const results = await Result.find();

    const scores = {};

    results.forEach(result => {
      const name = result.winnerDepartment;

      if (!scores[name]) {
        scores[name] = { department: name, points: 0, wins: 0 };
      }

      scores[name].points += result.points;
      scores[name].wins += 1;
    });

    const leaderboard = Object.values(scores).sort(
      (a, b) =>
        b.points - a.points ||
        b.wins - a.wins ||
        a.department.localeCompare(b.department)
    );

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });