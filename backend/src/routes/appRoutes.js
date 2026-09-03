const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");
const {
  getAuthorizedApps,
  getZohoAccessToken,
} = require("../services/zohoService");

const router = express.Router();

// Get applications allowed for the logged-in user's role
router.get("/", authenticateToken, (req, res) => {
  try {
    const permissions = req.user.permissions || [];

    const applications = getAuthorizedApps(permissions);

    res.json({
      role: req.user.role,
      applications,
    });
  } catch (error) {
    console.error("Application access error:", error);

    res.status(500).json({
      message: "Failed to retrieve applications",
    });
  }
});

// Check Zoho OAuth connection
router.get("/zoho-status", authenticateToken, async (req, res) => {
  try {
    await getZohoAccessToken();

    res.json({
      connected: true,
      message: "Zoho OAuth connection is working",
    });
  } catch (error) {
    console.error("Zoho connection error:", error.message);

    res.status(500).json({
      connected: false,
      message: "Zoho OAuth is not configured or connection failed",
    });
  }
});

module.exports = router;