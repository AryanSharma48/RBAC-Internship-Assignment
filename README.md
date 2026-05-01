# Task Management System — Backend-First, Scalable API

A backend-focused full-stack project built to demonstrate production-level API design, clean architecture, and real-world engineering patterns.

---

## Architecture

```
Client → Route → Middleware (Auth / Validate) → Controller → Service → Database
```

- **Controllers** — Thin HTTP layer. Call a service, send a response. No logic.
- **Services** — Own all business logic and database interaction. Throw `ApiError` on failure.
- **Middlewares** — Authentication, RBAC, input validation, rate limiting, centralized error handling.
- **Models** — Mongoose schemas with timestamps and compound indexes.

---

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Joi, Swagger, Morgan, express-rate-limit

**Frontend:** React (Vite), Tailwind CSS v4, Axios, React Router

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

Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRE=30d
```

Frontend env (optional, create `frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## API Reference

All routes are prefixed with `/api/v1`. Swagger UI is available at `/api-docs` when the server is running.

### Auth

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login and receive JWT |
| GET | `/auth/me` | Private | Get current user |

### Tasks

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/tasks` | Private | Get tasks. Admin sees all, user sees own. Supports `?status=pending&page=1&limit=10` |
| POST | `/tasks` | Private | Create task |
| GET | `/tasks/:id` | Private | Get single task |
| PUT | `/tasks/:id` | Private | Update task |
| DELETE | `/tasks/:id` | Private | Delete task |

### Users

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/users` | Admin | Get all users |

### Response Shape

All responses follow a consistent structure:

```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

Errors:

```json
{
  "success": false,
  "message": "Human-readable error"
}
```

---

## Security

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT authentication via `Authorization: Bearer <token>`
- Rate limiting on `/auth/register` and `/auth/login` (20 req / 15 min)
- Input sanitization and validation via Joi (strips unknown fields, trims strings)
- Protected routes enforced through `protect` + `authorize` middleware chain

**Token Storage:**
- Demo uses `localStorage` for simplicity.
- Production-ready: switch to `HttpOnly` cookies by adding `res.cookie('token', ...)` in `authController.js` — the `protect` middleware already has the cookie extraction commented in.

---

## Logging

Morgan is configured in `dev` mode to log:
```
POST /api/v1/auth/login 200 12ms
```

For production, swap `'dev'` for `'combined'` or pipe to a logging service (Winston, Datadog).

---

## Scalability

| Concern | Current Approach | Scale Path |
|---------|-----------------|------------|
| Auth | Stateless JWT | No change needed — horizontally scalable behind any load balancer |
| Database | MongoDB with compound index on `(user, status)` | Add read replicas, Atlas auto-scaling |
| Caching | None | Insert Redis in `taskService.getTasks()` — cache by `userId:page:status`, invalidate on write |
| Rate Limiting | In-process memory | Replace with `rate-limit-redis` for multi-instance deploys |
| Services → Microservices | Auth and Task services are fully isolated | Extract into separate Node apps with a shared MongoDB URI or messaging layer (RabbitMQ / Kafka) |

---

## Deployment

The backend is stateless and ready to deploy to:

- **Render** — Connect repo, set env vars, done.
- **Railway** — One-click from GitHub.
- **AWS EC2 / ECS** — Standard Node.js deployment. Use a process manager like PM2.

For MongoDB, use **MongoDB Atlas** and replace `MONGO_URI` with the Atlas connection string.

---

## Sample Credentials

Register users via `POST /api/v1/auth/register`:

```json
{ "name": "Admin User", "email": "admin@example.com", "password": "pass123", "role": "admin" }
{ "name": "Regular User", "email": "user@example.com", "password": "pass123", "role": "user" }
```
