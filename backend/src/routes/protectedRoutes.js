const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/permissionMiddleware");

const router = express.Router();

router.get(
  "/people",
  authenticateToken,
  requirePermission("VIEW_ZOHO_PEOPLE"),
  (req, res) => {
    res.json({
      message: "Zoho People access granted",
      user: req.user
    });
  }
);

router.get(
  "/crm",
  authenticateToken,
  requirePermission("VIEW_ZOHO_CRM"),
  (req, res) => {
    res.json({
      message: "Zoho CRM access granted",
      user: req.user
    });
  }
);

router.get(
  "/desk",
  authenticateToken,
  requirePermission("VIEW_ZOHO_DESK"),
  (req, res) => {
    res.json({
      message: "Zoho Desk access granted",
      user: req.user
    });
  }
);

router.get(
  "/books",
  authenticateToken,
  requirePermission("VIEW_ZOHO_BOOKS"),
  (req, res) => {
    res.json({
      message: "Zoho Books access granted",
      user: req.user
    });
  }
);

module.exports = router;