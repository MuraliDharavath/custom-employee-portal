import { useEffect, useState } from "react";
import "./Dashboard.css";

const API_URL = "https://custom-employee-portal-rrim.onrender.com";

function Dashboard() {
  const [apps, setApps] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [zohoStatus, setZohoStatus] = useState(null);

  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("apps");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
      return;
    }

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to read user data:", error);
        localStorage.removeItem("user");
      }
    }

    // Get authorized Zoho applications
    fetch(`${API_URL}/api/apps`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load applications"
          );
        }

        return data;
      })
      .then((data) => {
        setApps(data.applications || []);
      })
      .catch((error) => {
        console.error("Applications error:", error);
        setError(error.message);
      });

    // Check Zoho OAuth connection
    fetch(`${API_URL}/api/apps/zoho-status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Zoho connection failed"
          );
        }

        return data;
      })
      .then((data) => {
        setZohoStatus(data);
      })
      .catch((error) => {
        console.error("Zoho status error:", error);

        setZohoStatus({
          connected: false,
          message: error.message,
        });
      });
  }, [token]);

  // Load users
  const loadUsers = async () => {
    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load users"
        );
      }

      setUsers(data.users || []);
      setActiveSection("users");
    } catch (error) {
      console.error("Users error:", error);
      setError(error.message);
    }
  };

  // Load roles
  const loadRoles = async () => {
    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/roles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load roles"
        );
      }

      setRoles(data.roles || []);
      setActiveSection("roles");
    } catch (error) {
      console.error("Roles error:", error);
      setError(error.message);
    }
  };

  // Load audit logs
  const loadLogs = async () => {
    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/audit-logs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load audit logs"
        );
      }

      setLogs(data.logs || []);
      setActiveSection("logs");
    } catch (error) {
      console.error("Audit logs error:", error);
      setError(error.message);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (
    <div className="dashboard">
      {/* Navbar */}
      <header className="navbar">
        <h2>Employee Portal</h2>

        <div className="user-section">
          {user && (
            <span>
              {user.name} | {user.role}
            </span>
          )}

          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-content">
        <h1>Welcome, {user?.name}</h1>

        <p>Role: {user?.role}</p>

        {error && <p className="error">{error}</p>}

        {/* Zoho Integration Status */}
        <div className="zoho-status">
          <h3>Zoho Integration</h3>

          {zohoStatus === null ? (
            <p>Checking Zoho connection...</p>
          ) : zohoStatus.connected ? (
            <p className="status-connected">
              🟢 Connected — Zoho OAuth is working
            </p>
          ) : (
            <p className="status-disconnected">
              🔴 Not Connected — {zohoStatus.message}
            </p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="section-buttons">
          <button onClick={() => setActiveSection("apps")}>
            Applications
          </button>

          {user?.role === "Admin" && (
            <>
              <button onClick={loadUsers}>
                Users
              </button>

              <button onClick={loadRoles}>
                Roles
              </button>

              <button onClick={loadLogs}>
                Audit Logs
              </button>
            </>
          )}
        </div>

        {/* Applications */}
        {activeSection === "apps" && (
          <div className="app-grid">
            {apps.map((app) => (
              <div
                className="app-card"
                key={app.permission}
              >
                <div className="app-icon">
                  {app.name.charAt(5)}
                </div>

                <h3>{app.name}</h3>

                <p>
                  Access available for{" "}
                  <strong>{user?.role}</strong>.
                </p>

                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Application
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Users */}
        {activeSection === "users" && (
          <div className="admin-section">
            <h2>User Management</h2>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {users.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.role}</td>
                    <td>
                      {item.is_active
                        ? "Active"
                        : "Inactive"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Roles */}
        {activeSection === "roles" && (
          <div className="admin-section">
            <h2>Roles</h2>

            <div className="role-grid">
              {roles.map((role) => (
                <div
                  className="role-card"
                  key={role.id}
                >
                  {role.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audit Logs */}
        {activeSection === "logs" && (
          <div className="admin-section">
            <h2>Audit Logs</h2>

            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.name}</td>
                    <td>{log.email}</td>
                    <td>{log.action}</td>
                    <td>{log.details}</td>
                    <td>{log.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No applications */}
        {apps.length === 0 &&
          activeSection === "apps" &&
          !error && (
            <p>No applications assigned.</p>
          )}
      </main>
    </div>
  );
}

export default Dashboard;