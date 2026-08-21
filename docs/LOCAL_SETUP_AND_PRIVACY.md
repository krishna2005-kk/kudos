# Local setup, API testing, and privacy checklist

## Run the backend

1. Copy `.env.example` to `.env`.
2. Replace `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` with different long random secrets.
3. Start MongoDB as a replica set. Kudos transfers use MongoDB transactions and will return `503` on a standalone server.
4. Run `npm.cmd run dev`.
5. Visit `http://localhost:5000/api/v1/docs` for Swagger UI.

To load demo data, run `npm.cmd run seed` with `NODE_ENV=development`. It is deliberately blocked in production and clears only the configured development database.

## Test in Postman

Import `Peer Kudos API.postman_collection.json` from this folder. The collection uses `http://localhost:5000/api/v1` by default.

Run `Health`, then `Sign up sender`, `Sign up receiver`, `Give kudos`, `Get feed`, and `Leaderboard`. Signup/login scripts save the bearer token and receiver ID automatically. Postman stores the refresh cookie returned by signup/login, so `Refresh access token` tests refresh-token rotation. Change the collection's sender/receiver email variables before making a fresh test run.

## What must stay private

Never put these in JavaScript source, frontend code, Git commits, screenshots, Swagger examples, or shared Postman exports:

- `.env` values, especially MongoDB connection credentials and JWT secrets
- access tokens, refresh-token cookies, password-reset tokens, or password hashes
- real employee passwords, personal email addresses, or identifiable production kudos data

The repository ignores `.env`; share `.env.example` instead. Use sample accounts for demonstrations. Password reset tokens are exposed only outside production to support local development and must be delivered through a trusted email service in production.

## Privacy notice content to agree with your company

Before collecting real employee data, get approval from the project owner/privacy contact. Your notice should state the purpose (internal recognition), data collected (profile data and kudos activity), intended viewers, retention/deletion policy, correction/deletion contact, and any administrator access. Collect only the fields required for these features.
