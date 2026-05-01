# TaskManager — RBAC Internship Assignment

A backend-focused full-stack task management system built to demonstrate production-level API design, clean architecture, role-based access control, and real-world engineering thinking.

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | *(Vercel deployment URL)* |
| Backend API | *(Render deployment URL)* |
| API Docs (Swagger) | `<backend-url>/api-docs` |

---

## Architecture

```
Client → Route → Middleware (Auth / Validate / Rate Limit) → Controller → Service → Database
```

- **Controllers** — Thin HTTP layer. Call a service, send a response. No business logic.
- **Services** — Own all business logic and DB interaction. Throw `ApiError` on failure.
- **Middlewares** — JWT auth, RBAC, Joi validation, rate limiting, centralized error handling.
- **Models** — Mongoose schemas with timestamps and compound indexes.

---

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Joi, Swagger, Morgan, express-rate-limit

**Frontend:** React (Vite), Tailwind CSS v4, Axios, React Router, Lucide React

---

## Features

- JWT authentication (register / login / protected routes)
- Role-based access control — Admin vs User
- Full task CRUD with ownership enforcement
- Pagination and status filtering on task list
- Inline task editing, status toggle, and deletion from the UI
- Rate limiting on auth routes (20 req / 15 min)
- Input validation and sanitization via Joi
- Centralized error handling with consistent JSON format
- Swagger UI for API documentation
- Demo credentials pre-filled on the login page

---

## Project Structure

```
/backend
  /src
    /config         → DB connection, Swagger setup
    /controllers    → Route handlers (thin layer)
    /middlewares    → auth, RBAC, validation, error handler
    /models         → Mongoose schemas
    /routes/v1      → Versioned API routes
    /services       → Business logic
    /utils          → ApiError class
    app.js
    server.js

/frontend
  /src
    /components     → TaskList, TaskForm, Navbar
    /context        → AuthContext (JWT session management)
    /pages          → Login, Register, Dashboard
    /services       → Axios API layer
```

---

## Getting Started

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
npm install
# configure .env (see below)
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

**`backend/.env`**

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret
JWT_EXPIRE=30d
```

> If your MongoDB password contains special characters (e.g. `@`), URL-encode them: `@` → `%40`

**`frontend/.env`**

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## API Reference

All routes are prefixed with `/api/v1`. Full interactive docs available at `/api-docs`.

### Auth

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/auth/register` | Public | Register user |
| POST | `/auth/login` | Public | Login, returns JWT |
| GET | `/auth/me` | Private | Get logged-in user |

### Tasks

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/tasks` | Private | Get tasks. Admin: all. User: own. Supports `?status=pending&page=1&limit=10` |
| POST | `/tasks` | Private | Create task |
| GET | `/tasks/:id` | Private | Get single task |
| PUT | `/tasks/:id` | Private | Update task |
| DELETE | `/tasks/:id` | Private | Delete task |

### Users

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/users` | Admin only | Fetch all registered users |

### Response Format

```json
{ "success": true, "data": {}, "total": 10, "page": 1, "pages": 2 }
```

Errors:

```json
{ "success": false, "message": "Human-readable error" }
```

---

## Security

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT via `Authorization: Bearer <token>` header
- Rate limiting on `/auth/register` and `/auth/login` — 20 requests per 15 minutes
- Joi validates and strips all unknown/malformed fields before they reach controllers
- Password field excluded from all DB queries (`select: false`)
- **Token storage:** `localStorage` for demo. Production path: switch to `HttpOnly` cookies — the `protect` middleware already has the cookie read line commented in.

---

## Demo Credentials

Available as one-click fill on the login page:

| Role | Email | Password |
|------|-------|----------|
| Admin | `aryansharma24106@gmail.com` | `aryan@23` |
| User | `demouser@example.com` | `demo123` |

---

## Deployment

### Backend → Render

| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `node src/server.js` |
| Environment Variables | All from `.env` above, set `NODE_ENV=production` |

### Frontend → Vercel

| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Framework Preset | `Vite` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment Variable | `VITE_API_URL=<your-render-url>/api/v1` |

> **MongoDB Atlas:** Go to Network Access → Allow from anywhere (`0.0.0.0/0`) so Render can connect.

---

## Logging

Morgan logs every request in `development` mode:

```
POST /api/v1/auth/login 200 14ms
```

Swap `'dev'` for `'combined'` in `app.js` for production-style logs. Pipe to Winston or Datadog for structured logging at scale.

---

## Scalability

| Concern | Current | Scale Path |
|---------|---------|------------|
| Auth | Stateless JWT | No change — horizontally scalable behind any load balancer |
| DB queries | Compound index on `(user, status)` | Add read replicas, Atlas auto-scaling |
| Caching | None | Insert Redis in `taskService.getTasks()` — cache by `userId:page:status`, invalidate on write |
| Rate Limiting | In-process (express-rate-limit) | Replace with `rate-limit-redis` for multi-instance |
| Microservices | Auth and Task services fully isolated | Extract into separate services, add a message broker (RabbitMQ / Kafka) |

---

## Real-World Considerations

- **Concurrency:** MongoDB handles concurrent writes safely. For optimistic locking, add a `version` field with Mongoose's `versionKey`.
- **Token expiry:** Tokens expire in 30 days. Add a refresh token flow for seamless re-auth.
- **Soft delete:** Add `isDeleted: Boolean` to Task schema and filter it in queries instead of hard-deleting.
- **Request tracing:** Add a `requestId` middleware (`uuid`) to attach a unique ID to every request for debugging across services.
