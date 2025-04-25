const dotenv = require("dotenv")
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
dotenv.config()

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Serve frontend index.html for all unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/index.html"));
});
app.get("/pages/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/login.html"));
});

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
