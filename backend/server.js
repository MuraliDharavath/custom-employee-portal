const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initializeDatabase } = require("./src/config/database");
const seedDatabase = require("./src/config/seed");
const authRoutes = require("./src/routes/authRoutes");
const appRoutes = require("./src/routes/appRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const protectedRoutes = require("./src/routes/protectedRoutes");
const zohoRoutes = require("./src/routes/zohoRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/apps", appRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/zoho", zohoRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Custom Employee Portal API is running"
  });
});

const PORT = process.env.PORT || 5000;

// Start server
async function startServer() {
  try {
    await initializeDatabase();

    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();