# Project Management Utility (MERN Stack)

A simple, functional web application for maintaining a high-level project management view. It shows SDLC phases (Kanban-style: **To Do → In Progress → Review → Done**) and how tasks move between phases, with full task history visible on demand.

## Tech Stack

- **Frontend:** React (Vite), React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Security:** CORS + simple API key (`X-API-Key` header)

## Features

- **Homepage:** Clean landing with links to Users, Tasks Dashboard, and My Tasks
- **User management:** Form to add/edit/delete users; list of all users
- **Tasks dashboard:** Kanban board with four phases; add tasks, move between phases, view history, delete tasks
- **My Tasks:** Select a user to see their assigned tasks; view task history on demand
- **Task history:** Each task stores phase changes; “History” opens a modal with full audit trail
- **API:** CRUD for users and tasks; tasks by user; API secured with CORS and API key

## Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** (local or Atlas)

## How to Set Up and Run Locally

### 1. Clone and install

```bash
git clone <your-repo-url>
cd project
```

### 2. Backend (server)

```bash
cd server
npm install
```

Create a `.env` file (copy from `.env.example`):


Start the server:

```bash
npm run dev
```

Server runs at `http://localhost:5000`. Health check: `GET http://localhost:5000/api/health` (no API key needed).

### 3. Frontend (client)

In a new terminal:

```bash
cd client
npm install
npm run dev
```

Client runs at `http://localhost:3000`. Vite proxies `/api` to `http://localhost:5000`, so the app uses the same origin for API calls.

### 4. API key (client)

The client sends `X-API-Key` with every request. Default key is `dev-api-key` (matches server `.env`). To override, create `client/.env`:

```env
VITE_API_KEY=dev-api-key
```

Use the same value as `API_KEY` in `server/.env`.

## Design Choices

- **Folder structure**
  - `server/`: Express app; `models/` (User, Task), `routes/` (users, tasks), `middleware/` (API key).
  - `client/`: Vite + React; `pages/` (Home, Users, Tasks, My Tasks), `components/` (e.g. TaskHistoryModal), `services/api.js` for all API calls.
- **SDLC representation:** Kanban with four phases (To Do, In Progress, Review, Done). Tasks can be moved between phases via buttons; each move is recorded in `task.history`.
- **Task history:** Stored in the Task document (`history[]` with `phase`, `timestamp`, `note`). Schema middleware appends an entry on create and on phase change. “History” in the UI fetches the task and shows history in a modal.
- **API security:** CORS restricted to the client origin; all `/api/users` and `/api/tasks` routes protected by middleware that checks `X-API-Key`.
- **UI:** Single-page app with shared nav; dark theme; responsive grid for Kanban and cards.

## API Endpoints

All `/api/*` routes require header: `X-API-Key: <your-api-key>`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get one user |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| GET | `/api/tasks` | List all tasks (optional query: `phase`, `assignedTo`) |
| GET | `/api/tasks/user/:userId` | Tasks assigned to user |
| GET | `/api/tasks/:id` | Get one task (with history) |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task (e.g. phase, assignee) |
| DELETE | `/api/tasks/:id` | Delete task |

## Deploy Full Stack on Vercel (one-go)

This repo is set up for **one-go deployment** on Vercel: **frontend + backend** together using Vercel Serverless Functions (no separate Express server).

- **Root Directory:** **`.`** (repo root) — **not** `client`, so both `api/` and the client build are used.
- **Build:** Root `vercel.json` runs `npm install` (root + client), then `cd client && npm run build`. Output: `client/dist`.
- **API:** The `api/` folder at repo root is used as Vercel serverless routes: `/api/users`, `/api/tasks`, etc.

### Vercel settings

1. **Vercel Dashboard** → Import your GitHub repo → **Configure Project**.
2. **Root Directory:** Leave as **`.`** (or leave empty). Do **not** set to `client`.
3. **Environment variables** (Settings → Environment Variables) — **required** or API returns 500:
   - **`MONGO_URI`** (or `MONGODB_URI`) = your MongoDB Atlas connection string, e.g. `mongodb+srv://user:pass@cluster.mongodb.net/dbname`. No quotes, no extra spaces.
   - **`API_KEY`** = same key the client sends (e.g. `dev-api-key`). If the client uses `VITE_API_KEY`, set that to the same value so requests are not rejected with 401.
   - Add to **Production** (and Preview if you want). **Redeploy** after changing env vars — they do not apply to existing deployments.
4. **MongoDB Atlas:** Network Access → Add IP Address → `0.0.0.0/0` so Vercel can connect.
5. **Save** → **Redeploy**.

The root `vercel.json` defines install/build/output and SPA rewrites. No need to change Build Command or Output Directory in the UI if you use this file.

## What I Would Improve With More Time

- **Authentication:** Real login (JWT/sessions), user-specific “My Tasks” instead of selecting user by dropdown.
- **Authorization:** Role-based access (e.g. only managers delete tasks).
- **UX:** Drag-and-drop for moving tasks on the Kanban board; filters and search on tasks/users.
- **Validation:** Stricter validation (e.g. express-validator) and clearer error messages.
- **Tests:** Unit tests for API routes and integration tests for critical flows.
- **Deployment:** Docker Compose for app + MongoDB; env-based config for production.

## License

MIT (or as required by your assignment).
