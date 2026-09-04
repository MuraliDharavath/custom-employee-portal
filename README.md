# Custom Employee Portal

A secure Employee Portal built with React.js, Node.js, Express.js, SQLite, JWT Authentication, RBAC, and Zoho One OAuth integration.

## Features

- Custom employee login
- JWT authentication
- Role-Based Access Control (RBAC)
- Permission-based authorization
- Zoho One OAuth integration
- Role-based Zoho application access
- Admin dashboard
- User management
- Role management
- Audit logs
- Responsive UI

## Role-Based Access

| Role | Application Access |
|---|---|
| Admin | All Zoho Applications |
| HR | Zoho People |
| Sales | Zoho CRM |
| Support | Zoho Desk |
| Finance | Zoho Books |

## Technology Stack

**Frontend**
- React.js
- Vite
- React Router
- CSS

**Backend**
- Node.js
- Express.js
- JWT
- bcryptjs
- Axios

**Database**
- SQLite

**Integration**
- Zoho OAuth 2.0

**Deployment**
- Frontend: Vercel
- Backend: Render
- Repository: GitHub

## Project Structure

```text
custom-employee-portal/
├── frontend/
├── backend/
├── .gitignore
└── README.md



Authentication

The application uses JWT-based authentication.

POST /api/auth/login

Passwords are securely hashed using bcrypt.

API Endpoints
POST /api/auth/login

GET /api/apps
GET /api/apps/zoho-status

GET /api/protected/people
GET /api/protected/crm
GET /api/protected/desk
GET /api/protected/books

GET /api/admin/users
GET /api/admin/roles
GET /api/admin/audit-logs
Zoho Integration

Zoho OAuth credentials are securely stored as backend environment variables.

The backend manages the Zoho OAuth refresh token and obtains access tokens without exposing Zoho credentials to employees.

Database

The application uses SQLite with the following tables:

Users
Roles
Permissions
UserRoles
RolePermissions
AuditLogs
Demo Accounts
Admin    : admin@brainwave.com
HR       : hr@brainwave.com
Sales    : sales@brainwave.com
Support  : support@brainwave.com
Finance  : finance@brainwave.com

Demo passwords are configured in the backend seed file.

Local Setup
Backend
cd backend
npm install
npm run dev
Frontend
cd frontend
npm install
npm run dev

Create a .env file in the backend with:

PORT=5000
JWT_SECRET=your_jwt_secret
ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
ZOHO_REFRESH_TOKEN=your_zoho_refresh_token

Never commit .env or secret credentials to GitHub.

Security
JWT authentication
bcrypt password hashing
Permission-based API protection
Role-based access control
Backend-only Zoho credentials
Audit logging
Environment variables for secrets

Author:
Murali Dharavath
B.Tech – Artificial Intelligence & Data Science
