const express = require("express");
const Event = require("../models/Event");
const Result = require("../models/Result");

const router = express.Router();

// Dashboard statistics
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    const results = await Result.find();

    const teams = new Set(events.map(event => event.teamName));

    const today = new Date().toISOString().slice(0, 10);

    const upcomingEvents = events.filter(
      event => event.eventDate >= today
    );

    const departmentScores = {};

    results.forEach(result => {
      const department = result.winnerDepartment;

      if (!departmentScores[department]) {
        departmentScores[department] = {
          department,
          points: 0,
          wins: 0
        };
      }

      departmentScores[department].points += result.points;
      departmentScores[department].wins += 1;
    });

    const leaderboard = Object.values(departmentScores)
      .sort(
        (a, b) =>
          b.points - a.points ||
          b.wins - a.wins ||
          a.department.localeCompare(b.department)
      )
      .slice(0, 5);

    res.json({
      eventsCount: events.length,
      teamsCount: teams.size,
      resultsCount: results.length,
      upcomingEvents: upcomingEvents.length,
      leaderboard
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;