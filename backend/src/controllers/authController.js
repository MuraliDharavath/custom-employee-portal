const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDatabase } = require("../config/database");

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const db = getDatabase();

    // Find user
    const user = await db.get(
      `SELECT * FROM Users
       WHERE email = ? AND is_active = 1`,
      [email]
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Get user role
    const role = await db.get(
      `SELECT Roles.id, Roles.name
       FROM Roles
       JOIN UserRoles
       ON Roles.id = UserRoles.role_id
       WHERE UserRoles.user_id = ?`,
      [user.id]
    );

    // Get permissions
    const permissions = await db.all(
      `SELECT Permissions.name
       FROM Permissions
       JOIN RolePermissions
       ON Permissions.id = RolePermissions.permission_id
       WHERE RolePermissions.role_id = ?`,
      [role.id]
    );

    const permissionNames = permissions.map(
      permission => permission.name
    );

    // Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: role.name,
        permissions: permissionNames
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h"
      }
    );

    // Audit log
    await db.run(
      `INSERT INTO AuditLogs
       (user_id, action, details)
       VALUES (?, ?, ?)`,
      [
        user.id,
        "LOGIN",
        `User logged in as ${role.name}`
      ]
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: role.name,
        permissions: permissionNames
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
}

module.exports = {
  login
};