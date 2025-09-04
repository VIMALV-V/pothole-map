const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Connect to MongoDB Atlas
mongoose.connect(
  
  "mongodb+srv://vimal:vimalmongodb@cluster0.towcoag.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Hazard schema & model
// Hazard schema & model (point to pothole.data collection)
const hazardSchema = new mongoose.Schema({
  lat: Number,
  lon: Number,
  count: { type: Number, default: 0 }
}, { collection: "data" });  // 👈 force mongoose to use "data" collection



const Hazard = mongoose.model("Hazard", hazardSchema);

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