const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));

// ✅ Connect to MongoDB Atlas (your DB: pothole, collection: data)
mongoose.connect(
  "mongodb+srv://vimal:vimalmongodb@cluster0.towcoag.mongodb.net/pothole?retryWrites=true&w=majority&appName=Cluster0",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Schema matches your DB documents
const hazardSchema = new mongoose.Schema({
  lat: Number,
  lon: Number,
  count: { type: Number, default: 0 }
});

// Explicitly point to "data" collection in "pothole" DB
const Hazard = mongoose.model("Hazard", hazardSchema, "data");

// ✅ API: Get ALL potholes (no filtering)
app.get("/api/potholes", async (req, res) => {
  try {
    const hazards = await Hazard.find();
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
