const bcrypt = require("bcryptjs");
const { getDatabase } = require("./database");

async function seedDatabase() {
  const db = getDatabase();

  // -------------------------
  // 1. Create Roles
  // -------------------------

  const roles = [
    "Admin",
    "HR",
    "Sales",
    "Support",
    "Finance"
  ];

  for (const role of roles) {
    await db.run(
      `INSERT OR IGNORE INTO Roles (name) VALUES (?)`,
      [role]
    );
  }

  // -------------------------
  // 2. Create Permissions
  // -------------------------

  const permissions = [
    "VIEW_ZOHO_PEOPLE",
    "VIEW_ZOHO_CRM",
    "VIEW_ZOHO_DESK",
    "VIEW_ZOHO_BOOKS",
    "MANAGE_USERS",
    "MANAGE_ROLES",
    "VIEW_AUDIT_LOGS"
  ];

  for (const permission of permissions) {
    await db.run(
      `INSERT OR IGNORE INTO Permissions (name) VALUES (?)`,
      [permission]
    );
  }

  // -------------------------
  // 3. Map Roles → Permissions
  // -------------------------

  const rolePermissions = {
    Admin: [
      "VIEW_ZOHO_PEOPLE",
      "VIEW_ZOHO_CRM",
      "VIEW_ZOHO_DESK",
      "VIEW_ZOHO_BOOKS",
      "MANAGE_USERS",
      "MANAGE_ROLES",
      "VIEW_AUDIT_LOGS"
    ],

    HR: [
      "VIEW_ZOHO_PEOPLE"
    ],

    Sales: [
      "VIEW_ZOHO_CRM"
    ],

    Support: [
      "VIEW_ZOHO_DESK"
    ],

    Finance: [
      "VIEW_ZOHO_BOOKS"
    ]
  };

  for (const [roleName, permissionsList] of Object.entries(rolePermissions)) {
    const role = await db.get(
      `SELECT id FROM Roles WHERE name = ?`,
      [roleName]
    );

    for (const permissionName of permissionsList) {
      const permission = await db.get(
        `SELECT id FROM Permissions WHERE name = ?`,
        [permissionName]
      );

      await db.run(
        `INSERT OR IGNORE INTO RolePermissions
         (role_id, permission_id)
         VALUES (?, ?)`,
        [role.id, permission.id]
      );
    }
  }

  // -------------------------
  // 4. Create Demo Users
  // -------------------------

  const users = [
    {
      name: "System Admin",
      email: "admin@brainwave.com",
      password: "Admin@123",
      role: "Admin"
    },
    {
      name: "HR Manager",
      email: "hr@brainwave.com",
      password: "Hr@123",
      role: "HR"
    },
    {
      name: "Sales Manager",
      email: "sales@brainwave.com",
      password: "Sales@123",
      role: "Sales"
    },
    {
      name: "Support Manager",
      email: "support@brainwave.com",
      password: "Support@123",
      role: "Support"
    },
    {
      name: "Finance Manager",
      email: "finance@brainwave.com",
      password: "Finance@123",
      role: "Finance"
    }
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await db.run(
      `INSERT OR IGNORE INTO Users
       (name, email, password)
       VALUES (?, ?, ?)`,
      [user.name, user.email, hashedPassword]
    );

    const createdUser = await db.get(
      `SELECT id FROM Users WHERE email = ?`,
      [user.email]
    );

    const role = await db.get(
      `SELECT id FROM Roles WHERE name = ?`,
      [user.role]
    );

    await db.run(
      `INSERT OR IGNORE INTO UserRoles
       (user_id, role_id)
       VALUES (?, ?)`,
      [createdUser.id, role.id]
    );
  }

  console.log("Database seeded successfully");
}

module.exports = seedDatabase;