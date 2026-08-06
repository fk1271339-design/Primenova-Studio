# PrimeNova Studio

A full-stack agency platform with an AI assistant, authentication (JWT + OAuth2), contact forms, and an admin dashboard — designed to run in **single-server mode**: one Spring Boot process serves both the React frontend and the REST API on `http://localhost:8080`. No nginx/Vite server needed.

## Architecture

```
Browser ──> Spring Boot (:8080)  ──> MongoDB (localhost:27017)
                │
                ├─ GET /login, /profile, ...   → SPA fallback → index.html (React Router)
                ├─ GET /assets/*               → static files (built React bundle)
                └─ /api/**                     → REST controllers (JSON)
```

- **Frontend** (React + Vite) is built with `npm run build` and copied into `backend/src/main/resources/static/`, so Spring Boot serves it from the classpath.
- **SPA fallback** (`WebConfig.java`): known static assets are served as-is; any other non-API route falls back to `index.html`, so deep links like `/login` work in the browser.
- **Same-origin** (`src/config.ts`): the frontend calls a relative `/api` and treats the current host as the backend origin — OAuth redirects, email links, and CORS all stay on `:8080`.
- **Dev proxy** (`vite.config.ts`): in development, Vite forwards `/api` and `/oauth2` to `http://localhost:8080` so dev and production behave identically.

## Tech Stack

| Layer | Tech |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS 4, React Router 7, Framer Motion, Lucide |
| Backend | Java 17+, Spring Boot 3.2, Spring Security (JWT + OAuth2 client), Spring Data MongoDB, Spring Mail |
| Database | MongoDB 6 (local `mongod` or `docker-compose`) |
| Auth | Email/password (BCrypt + JWT HS512) + Google/GitHub OAuth2 |
| Email | SMTP (Gmail app password) for verification / password reset / notifications |

## Prerequisites

- Node.js 18+ and npm
- JDK 17+ (tested with 21) and Maven 3.9+
- MongoDB running on `localhost:27017` (or set `SPRING_DATA_MONGODB_URI`)

## Quick Start (single server)

1. **Environment** — copy the template and fill in values:

   ```bat
   copy .env.example .env
   ```

   The template ships with single-server defaults (`FRONTEND_URL=http://localhost:8080`, empty `VITE_BACKEND_ORIGIN`). At minimum set a real `JWT_SECRET`, your Google/GitHub OAuth credentials, and SMTP app password.

2. **Install frontend deps:**

   ```bat
   npm install
   ```

3. **Build the frontend and copy it into the backend:**

   ```bat
   build-frontend.bat
   ```

   (Runs `npm run build`, then replaces `backend/src/main/resources/static/` with `dist/`.)

4. **Start the backend (frontend + API together):**

   ```bat
   backend\run-backend.bat
   ```

5. Open **http://localhost:8080** — the app and the API are served from the same origin.

   Debugging tip: live application logs are written in real time to `backend/logs/application.log` (the console output is chunk-buffered when redirected to a file, so rely on this file for up-to-date errors).

### Without the .bat scripts

```bash
npm install
npm run build
rm -rf backend/src/main/resources/static && cp -r dist backend/src/main/resources/static
cd backend && mvn spring-boot:run
```

Or build a fat jar and run it:

```bash
cd backend && mvn package -DskipTests
java -jar target/studio-0.0.1-SNAPSHOT.jar   # run from the backend dir so ../.env is loaded
```

## How Configuration Works

- `backend/src/main/resources/application.yml` defines single-server defaults (port `8080`, `FRONTEND_URL=http://localhost:8080`, CORS origins including `:8080`) and reads everything else from environment variables via `${VAR:default}` placeholders.
- The project-root `.env` is loaded automatically: Spring imports it (`optional:file:./.env[.properties]`), and `run-backend.bat` also exports it into the process environment so `java`/`mvn` see it too.
- The frontend reads `VITE_API_URL` (default `/api`) and `VITE_BACKEND_ORIGIN` (default empty = same origin) at **build time** — set them before `npm run build` only if you switch to a split frontend/backend setup.

## Verifying the Deployment

```bash
# SPA deep links return the React app (200 HTML), not 404
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/login      # 200
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/profile    # 200

# API routes return JSON, never the SPA fallback
curl -s -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com","password":"..."}'

# Authenticated chat flow (needs a verified user + Bearer token)
curl -s -X POST http://localhost:8080/api/chat/sessions -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"title":"Hi"}'
curl -s -X POST http://localhost:8080/api/chat/sessions/<id>/messages -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"sender":"user","text":"Hello"}'
```

## Environment Variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `SPRING_DATA_MONGODB_URI` | `mongodb://localhost:27017/primenova_db` | MongoDB connection string |
| `JWT_SECRET` | dev-only placeholder | Signing secret (use a long random value in production) |
| `JWT_ACCESS_EXPIRATION_MS` / `JWT_REFRESH_EXPIRATION_MS` | `900000` / `86400000` | Token lifetimes |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | placeholder | Google OAuth2 (redirect URI: `{base}/login/oauth2/code/google`) |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | placeholder | GitHub OAuth2 (callback: `{base}/login/oauth2/code/github`) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USERNAME` / `SMTP_PASSWORD` / `SMTP_FROM` | Gmail placeholders | Outbound mail (verification, reset, notifications) |
| `FRONTEND_URL` | `http://localhost:8080` | Base URL used in OAuth callbacks and email links |
| `CORS_ORIGINS` | `http://localhost:8080,...` | Allowed origins (comma separated) |
| `ADMIN_EMAIL` | `hello@primenova.studio` | Where admin notifications are sent |
| `GEO_API_URL` / `GEO_LOOKUP_ENABLED` | `https://ipwho.is/` / `true` | Free IP → country lookup for login audit |
| `VITE_API_URL` | `/api` | Frontend API base (build-time) |
| `VITE_BACKEND_ORIGIN` | `` (empty = same origin) | Backend origin for OAuth redirects (build-time) |

## Docker (alternative: nginx + separate containers)

`docker-compose.yml` runs MongoDB, mongo-express, the Spring Boot backend, and an nginx frontend container — useful for a multi-container deployment:

```bash
docker-compose up --build
```

This mode requires the multi-server values in `.env` (`FRONTEND_URL`, `CORS_ORIGINS`, `VITE_BACKEND_ORIGIN`). For a single VM or local machine, the single-server mode above is simpler and has no proxy to configure.

## API Overview

- `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`
- `GET /api/auth/verify?token=…`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`
- `GET|POST /api/chat/sessions`, `POST /api/chat/sessions/{id}/messages`, `POST /api/chat/feedback`
- `GET|PUT /api/user/**` (profile), `GET|POST|DELETE /api/admin/**` (admin), `POST /api/contact` (public)
- `GET /oauth2/authorization/{google|github}` (OAuth2 entry points, e.g. `http://localhost:8080/oauth2/authorization/google`)

## Project Structure

```
src/                    # React frontend (Vite)
backend/src/main/       # Spring Boot backend
  java/.../config/      #   WebConfig (SPA fallback), SecurityConfig (JWT + OAuth2 + CORS)
  java/.../controller/  #   REST endpoints
  java/.../service/     #   Auth, Chat, Contact, Email, GeoLocation services
  java/.../model/       #   MongoDB documents (User, ChatSession, …)
  resources/            #   application.yml + built frontend (static/)
build-frontend.bat      # Builds React and copies dist → backend static
backend/run-backend.bat # Loads .env and starts Spring Boot on :8080
```
