# StudentJob

Student–Employer job portal (university course project). Spring Boot 4 + PostgreSQL backend, Next.js 16 frontend.
See `AGENTS.md` for the full specification and conventions.

## Quick start

```bash
# 1. Database (copy .env.example to .env and set POSTGRES_PASSWORD first)
docker compose up -d

# 2. Backend on :8080 (from /backend)
#    Copy src/main/resources/application-example.yml to application-local.yml and fill in the values
#    (DB password, JWT secret of at least 32 characters, admin password), or set the same env variables.
./mvnw spring-boot:run

# 3. Frontend on :3000 (from /frontend)
#    Copy .env.example to .env.local
npm install
npm run dev
```

Swagger UI: http://localhost:8080/swagger-ui.html

## Accounts

- **Admin**: seeded on first start from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (default email `admin@studentjob.local`).
- **Student**: register at `/register`; active immediately.
- **Employer**: register at `/register?type=employer`; can log in but cannot post jobs until an admin approves
  the account at `/admin/employers`.

## Notes

- Access token lives in memory only; the refresh token is an HttpOnly cookie, so the frontend and the API must be
  reachable under the same host name (e.g. both `localhost`) for the session to survive a reload.
- `CORS_ALLOWED_ORIGIN` must match the URL you open the frontend with.
- Refresh tokens are stateless: changing a password does not revoke tokens that were already issued.
