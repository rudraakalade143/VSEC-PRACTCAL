const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/dailynotes")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB error:", error.message));

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model("User", userSchema);

// Note Schema
const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

// Home route
app.get("/", (req, res) => {
  res.send("DailyNotes API is running");
});

// Register
app.post("/register", async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        message: "Password must contain at least 4 characters."
      });
    }

    const user = await User.create({ email, password });

    res.status(201).json({
      id: user._id.toString(),
      email: user.email
    });
  } catch (error) {
    res.status(400).json({
      message:
        error.code === 11000
          ? "Email is already registered."
          : "Could not register."
    });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const password = String(req.body.password || "");

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    res.json({
      id: user._id.toString(),
      email: user.email
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed."
    });
  }
});

// READ: Get notes for one user
app.get("/notes/:userId", async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.params.userId
    }).sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: "Could not load notes."
    });
  }
});

// CREATE: Add note
app.post("/notes", async (req, res) => {
  try {
    const { userId, title, content } = req.body;

    if (
      !userId ||
      !String(title || "").trim() ||
      !String(content || "").trim()
    ) {
      return res.status(400).json({
        message: "Please enter title and content."
      });
    }

    const note = await Note.create({
      userId,
      title: String(title).trim(),
      content: String(content).trim()
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({
      message: "Could not add note."
    });
  }
});

// UPDATE: Edit note
app.put("/notes/:id", async (req, res) => {
  try {
    const { userId, title, content } = req.body;

    if (
      !userId ||
      !String(title || "").trim() ||
      !String(content || "").trim()
    ) {
      return res.status(400).json({
        message: "Title and content are required."
      });
    }

    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        userId
      },
      {
        title: String(title).trim(),
        content: String(content).trim()
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not found."
      });
    }

    res.json(note);
  } catch (error) {
    res.status(400).json({
      message: "Could not update note."
    });
  }
});

// DELETE: Delete note
app.delete("/notes/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found."
      });
    }

    res.json({
      message: "Note deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not delete note."
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});