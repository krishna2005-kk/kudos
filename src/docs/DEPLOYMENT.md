# Deployment checklist

## Before deploying

- Set `NODE_ENV=production`.
- Use a managed MongoDB replica set (MongoDB Atlas is suitable). Transactions for point transfers do not work on standalone MongoDB.
- Set strong, distinct `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` values. Never commit `.env`.
- Set `MONGODB_URI` to the production database and `CLIENT_URL` to the exact frontend origin.
- Set `TRUST_PROXY=true` when deploying behind a platform proxy/load balancer.
- Set `MONTHLY_RESET_SCHEDULE` and `RESET_TIMEZONE` to the company policy.

## Cookie and CORS settings

Production refresh cookies are `httpOnly`, `secure`, and `sameSite=lax`. The frontend must send `credentials: 'include'` for login, refresh, and logout requests. If frontend and API use different sites, change the cookie policy deliberately and use HTTPS on both sides.

## Platform configuration

1. Install dependencies with `npm ci`.
2. Run with `npm start`.
3. Configure the platform health check to call `GET /api/v1/ready`.
4. Configure a scheduled cloud job as a backup for the monthly reset. The database lock keeps duplicate triggers safe.
5. Use the Swagger UI at `/api/v1/docs` after deployment to verify API connectivity.

## Post-deployment smoke test

1. Call `/api/v1/health` and `/api/v1/ready`.
2. Seed only a non-production environment.
3. Create a test employee, log in, refresh the session, and log out.
4. Give kudos between two test employees and confirm both balances change exactly once.
5. Confirm production cookies have the `Secure` and `HttpOnly` attributes.

## Never do this

- Do not run `npm run seed` in production; the script blocks production environments by design.
- Do not expose JWT secrets, database credentials, or reset tokens in logs.
- Do not use a standalone MongoDB deployment for the live point-transfer flow.
