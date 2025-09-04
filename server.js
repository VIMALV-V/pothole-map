const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Connect to MongoDB Atlas
mongoose.connect(
  "mongodb+srv://vimal:vimalmongodb@cluster0.towcoag.mongodb.net/pothole?retryWrites=true&w=majority&appName=Cluster0",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Hazard schema & model (force to use pothole.data collection)
const hazardSchema = new mongoose.Schema({
  lat: Number,
  lon: Number,
  count: { type: Number, default: 0 }
});

// 👇 explicitly point to "data" collection inside "pothole" DB
const Hazard = mongoose.model("Hazard", hazardSchema, "data");

// Debug route to check if DB works
app.get("/api/debug", async (req, res) => {
  try {
    const count = await Hazard.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get confirmed potholes (count >= 3)
app.get("/api/potholes", async (req, res) => {
  try {
    const hazards = await Hazard.find({ count: { $gte: 3 } });
    res.json(hazards);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Serve frontend map page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "map.html"));
});

// Start server
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
