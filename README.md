# Football Administration System

A full-stack web application developed as a **BSc course project** to demonstrate the management of common football-administration workflows. It provides separate interfaces for **team representatives** and **federation staff**, supported by a React frontend, an Express API, and a MySQL database.

> **Project status:** Academic prototype. The application is not production-ready. See [Known limitations](#known-limitations) before deploying or reusing it.

## Features

| Area | Functionality |
| --- | --- |
| Authentication | Username/password login and session-based user identification |
| Teams | Team representatives can update team information; federation staff can review pending submissions and approve or reject them |
| Fixtures | Create, update, and retrieve scheduled matches |
| Lineups | Submit 11 starting players for a fixture |
| Results | Record and retrieve match scores and additional match information |
| Transfers | Submit transfer requests; backend endpoints exist for approval and rejection |
| Fines | Record fines and update their payment status through the API |
| Complaints | Submit and retrieve fixture-related complaints |

Some administrative actions currently have API endpoints but no dedicated frontend screen.

## Technology stack

- **Frontend:** React, React Router, Axios, CSS
- **Backend:** Node.js, Express, Express Session, Multer
- **Database:** MySQL, accessed using `mysql2`
- **Development tools:** npm and `concurrently`

## Architecture

```text
Browser
  |
  | React pages and Axios requests
  v
Express HTTP API (backend/routes)
  |
  | Database access functions (backend/db/dbConn.js)
  v
MySQL database
```

### Repository layout

```text
.
├── backend/
│   ├── db/
│   │   └── dbConn.js            # Database queries
│   ├── routes/                 # API endpoints by feature
│   ├── index.js                # Express server and middleware
│   ├── .env.example            # Backend configuration template
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/         # Screens grouped by workflow
│   │   ├── services/api.js     # Shared Axios client
│   │   └── AppRouter.js        # Client-side routing
│   ├── .env.example            # Frontend configuration template
│   └── package.json
├── package.json                # Starts frontend and backend together
└── README.md
```

## Getting started

### Prerequisites

- Node.js and npm
- MySQL server
- Git (to clone the repository)

### 1. Clone and install dependencies

```bash
git clone https://github.com/YOUR-USERNAME/football-administration-system.git
cd football-administration-system
npm install
npm --prefix backend ci
npm --prefix frontend ci
```

### 2. Prepare MySQL

Create a local database and import the coursework database schema. The current archived version **does not include the database schema or migrations**, so this is a prerequisite that must be supplied before another developer can run the complete application.

The backend code references these tables: `User`, `Team`, `Player`, `Fixture`, `Lineup`, `Result`, `Transfer`, `Fine`, and `Complaint`.

Use **synthetic data** for demonstrations. Do not upload real accounts, credentials, or private user information.

### 3. Configure the backend

Copy `backend/.env.example` to `backend/.env` and provide your own database credentials. The intended environment variables are:

```dotenv
PORT=1234
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASS=your_mysql_password
DB_DATABASE=football_admin
SESSION_SECRET=replace_with_a_long_random_secret
CORS_ORIGIN=http://localhost:3000
```

**Configuration note:** In the original coursework snapshot, `SESSION_SECRET` and `CORS_ORIGIN` are not yet read from environment variables. Update `backend/index.js` as described in the accompanying publishing guide before relying on them. Never commit the real `.env` file.

### 4. Configure the frontend

Copy `frontend/.env.example` to `frontend/.env`, using:

```dotenv
REACT_APP_API_URL=http://localhost:1234
```

**Configuration note:** In the original snapshot, `frontend/src/services/api.js` has a hardcoded remote API URL. Update it to read `process.env.REACT_APP_API_URL`, as described in the publishing guide. Restart the frontend after changing environment variables.

### 5. Start the application

From the repository root:

```bash
npm run dev
```

With the default development configuration, the React app is expected at `http://localhost:3000`, and the Express backend at `http://localhost:1234`.

The project requires an initialized database with matching tables and user data to use the authenticated screens. These startup instructions have not been verified end-to-end against a database dump.

## Example workflows

**Team representative**

1. Log in using a test account with the team-representative role.
2. Update team name or stadium information.
3. Submit a starting lineup, transfer request, or match-related complaint.
4. View available match results for the team.

**Federation staff**

1. Log in using a test account with the federation-staff role.
2. Review pending team submissions and approve or reject them.
3. Create fixtures, enter match results, or issue fines.

> Note: The backend currently uses the database role value `federation_stuff` (with that spelling). Renaming it to `federation_staff` requires corresponding changes to both the source code and database data.

## API overview

| Route | Method | Purpose |
| --- | --- | --- |
| `/auth/login` | POST | Log in |
| `/auth/me` | GET | Get session user |
| `/team` | GET | List teams, optionally filtered by status |
| `/team/:id` | GET, PUT | Read or update a team |
| `/team/:id/approve` | POST | Approve a team submission |
| `/team/:id/reject` | POST | Reject a team submission |
| `/fixture` | GET, POST | List or create fixtures |
| `/lineup` | POST | Submit a lineup |
| `/result` | GET, POST | Retrieve or save results |
| `/transfer` | POST | Submit a transfer request |
| `/transfer/pending` | GET | List pending transfers |
| `/transfer/:id/approve` | POST | Approve a transfer |
| `/fine` | GET, POST | List or issue fines |
| `/complaint` | GET, POST | List or submit complaints |

This table documents the routes in the original academic implementation, not a stable public API. Some routes have known issues, and authorization checks require further work.

## Testing

A complete automated test suite has not yet been implemented. The original frontend includes a Create React App example test that references a missing component and should be replaced with project-specific tests. Recommended test cases include team approval, fixture creation, lineup validation, result retrieval, authentication, and role-based authorization.

## Known limitations

The repository documents an academic prototype, not a production service:

- Database schema/migrations and reproducible demo data need to be added.
- Password handling needs to use a secure password-hashing algorithm.
- Express routes need server-side authentication and role-based authorization.
- Session secrets, CORS settings, and frontend API endpoints must be externalized into environment variables.
- The database methods for listing all results and listing fines contain errors in the original snapshot; one user-transfer lookup is not implemented.
- The transfer-window deadline is hardcoded in the frontend.
- File-upload validation and serving, input validation, database transaction handling, and automated testing need improvement.
- The Express default in-memory session store is suitable only for local development.

**Do not deploy this snapshot to a public server with real user accounts or data.**

## Academic context and credits

This project was created for undergraduate coursework. Add the **course title, academic year, contributors, and a brief description of your own contribution** here before publishing. Obtain agreement from other contributors when applicable.

Do not use federation logos or other third-party assets unless you have permission to publish them.

## License

No license has been assigned in this template. Add one only after confirming that the contributors and any applicable university rules allow you to license the code.
