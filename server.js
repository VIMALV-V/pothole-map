const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));

// MongoDB connection (use environment variable in production)
const mongoURI = process.env.MONGO_URI || "mongodb+srv://vimal:vimalmongodb@cluster0.towcoag.mongodb.net/pothole?retryWrites=true&w=majority";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Schema
const hazardSchema = new mongoose.Schema({
  lat: Number,
  lon: Number
});

const Hazard = mongoose.model("Hazard", hazardSchema, "data");

// API: Get all potholes
app.get("/api/potholes", async (req, res) => {
  try {
    const hazards = await Hazard.find();
    res.json(hazards);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// API: Add new confirmed pothole
app.post("/api/potholes", async (req, res) => {
  try {
    const { lat, lon } = req.body;
    if (lat == null || lon == null) return res.status(400).json({ error: "lat and lon required" });

    const newHazard = new Hazard({ lat, lon });
    await newHazard.save();
    res.json({ message: "Pothole added successfully", pothole: newHazard });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// API: Update pothole by ID
app.put("/api/potholes/:id", async (req, res) => {
  try {
    const { lat, lon } = req.body;
    const updated = await Hazard.findByIdAndUpdate(req.params.id, { lat, lon }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// API: Delete pothole by ID
app.delete("/api/potholes/:id", async (req, res) => {
  try {
    await Hazard.findByIdAndDelete(req.params.id);
    res.json({ message: "Pothole deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Serve map page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "map.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
