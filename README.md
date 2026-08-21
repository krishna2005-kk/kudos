# Kudos Frontend + Backend Setup

This project now contains both parts of the Kudos application.

- Frontend: React + Vite at the project root
- Backend: Node.js + Express + MongoDB inside `backend/`

## Frontend Setup

Install frontend packages:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

Frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_oauth_web_client_id.apps.googleusercontent.com
```

## Backend Setup

Install backend packages:

```bash
npm run install:backend
```

Run backend:

```bash
npm run dev:backend
```

Backend runs at:

```text
http://localhost:5000
```

Backend `.env` is inside:

```text
backend/.env
```

Use `backend/.env.example` as the template.

## MongoDB

The backend needs MongoDB running locally:

```text
mongodb://127.0.0.1:27017/kudos
```

For backend tests, MongoDB must also be available for:

```text
mongodb://127.0.0.1:27017/kudos_test
```

## Useful Commands

Frontend build:

```bash
npm run build
```

Frontend lint:

```bash
npm run lint
```

Backend tests:

```bash
npm --prefix backend test
```

Seed backend data:

```bash
npm run seed:backend
```

## Important

Do not commit `.env` files.

The frontend sends API requests to the backend using:

```text
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

The backend uses httpOnly cookies for auth when connected.
