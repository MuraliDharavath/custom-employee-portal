const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/permissionMiddleware");
const { getDatabase } = require("../config/database");

const router = express.Router();

// Get all users
router.get(
  "/users",
  authenticateToken,
  requirePermission("MANAGE_USERS"),
  async (req, res) => {
    try {
      const db = getDatabase();

      const users = await db.all(`
        SELECT
          Users.id,
          Users.name,
          Users.email,
          Users.is_active,
          Roles.name AS role
        FROM Users
        LEFT JOIN UserRoles ON Users.id = UserRoles.user_id
        LEFT JOIN Roles ON UserRoles.role_id = Roles.id
        ORDER BY Users.id
      `);

      res.json({ users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  }
);

// Get all roles
router.get(
  "/roles",
  authenticateToken,
  requirePermission("MANAGE_ROLES"),
  async (req, res) => {
    try {
      const db = getDatabase();

      const roles = await db.all(`
        SELECT id, name
        FROM Roles
        ORDER BY id
      `);

      res.json({ roles });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch roles" });
    }
  }
);

// Get audit logs
router.get(
  "/audit-logs",
  authenticateToken,
  requirePermission("VIEW_AUDIT_LOGS"),
  async (req, res) => {
    try {
      const db = getDatabase();

      const logs = await db.all(`
        SELECT
          AuditLogs.id,
          AuditLogs.action,
          AuditLogs.details,
          AuditLogs.created_at,
          Users.name,
          Users.email
        FROM AuditLogs
        LEFT JOIN Users ON AuditLogs.user_id = Users.id
        ORDER BY AuditLogs.id DESC
      `);

      res.json({ logs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  }
);

module.exports = router;