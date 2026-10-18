# AGENTS.md

Guidance for AI coding agents working on this repository.

## 1. Project Overview

**Student–Employer Job Portal**: a simple web application (university course project) that connects students with employers offering internships and jobs.

- Scope: keep it **simple**. This is a course project, not a production system. Prefer clear, readable code over clever abstractions.
- UI language: **Vietnamese**. Code, comments, identifiers, commit messages: **English**.

### Roles

| Role       | Enum value | Description                                      |
|------------|------------|--------------------------------------------------|
| Student    | `STUDENT`  | Builds a profile, searches jobs, applies         |
| Employer   | `EMPLOYER` | Manages company profile, posts jobs, reviews applicants |
| Admin      | `ADMIN`    | Approves employers, hides jobs, locks accounts   |

### Features

**Student**
- Register / login / logout
- Manage profile: full name, phone, university, major, skills, CV link (URL only, no file upload)
- Search and filter jobs (keyword, category, job type, location, salary range)
- View job detail and apply (one application per job per student)
- View own applications and their status

**Employer**
- Register (account stays `PENDING_APPROVAL` until an admin approves it)
- Manage company profile
- CRUD own job postings (only after approval)
- View applicants per job, **accept / reject** applications

**Admin**
- Approve / reject employer accounts
- Hide / unhide job postings
- Lock / unlock user accounts
- (Admin account is seeded on startup; no public admin registration)

### Business Rules

- Employer must be approved by an admin before posting jobs.
- Job postings are published immediately (no pre-approval); admin may hide them afterwards (`HIDDEN`).
- Jobs past their `deadline` are not shown in public search and cannot receive applications.
- Application status flow: `PENDING → ACCEPTED` or `PENDING → REJECTED`. No other transitions.
- A student cannot apply to the same job twice.
- Locked users cannot log in, and the jobs of a locked employer are hidden from public search and cannot receive applications.
- A job's deadline cannot be set in the past when creating it or changing its deadline; an employer can still close or edit an expired job without touching the deadline.

Out of scope: favorites/bookmarks, email verification, forgot password, interview scheduling, notifications, file uploads, statistics dashboard, automated tests.

## 2. Tech Stack

### Backend (`/backend`)
- Java 21, **Spring Boot 4.1.1**, Maven
- Spring Web (MVC), Spring Data JPA (Hibernate), PostgreSQL driver
- Spring Security with JWT (`jjwt`)
- Bean Validation (`spring-boot-starter-validation`)
- Lombok
- springdoc-openapi (Swagger UI)
- No MapStruct: write DTO mappers by hand (static methods or small `*Mapper` classes)

> Spring Boot 4 uses modular starters (e.g. `spring-boot-starter-webmvc`) and Jackson 3. Verify exact artifact names and compatible versions (springdoc, jjwt) against the Spring Boot 4.1 docs before adding dependencies. Do not guess versions.

### Frontend (`/frontend`)
- **Next.js 16**, App Router, **JavaScript only** (no TypeScript)
- shadcn/ui + Tailwind CSS
- Zustand (auth state), TanStack Query (server state), axios (HTTP)
- react-hook-form + zod (forms; use shadcn/ui `Form` components)

### Database / Infra
- PostgreSQL (run via `docker-compose.yml` at repo root)
- Backend: `http://localhost:8080`, Frontend: `http://localhost:3000`

**Do not add libraries outside this list without asking the user.**

## 3. Repository Structure

```
/
├── AGENTS.md
├── docker-compose.yml          # PostgreSQL
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/example/jobportal/
│       ├── JobPortalApplication.java
│       ├── config/             # SecurityConfig, CorsConfig, OpenApiConfig, DataSeeder
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── entity/
│       ├── dto/
│       │   ├── request/
│       │   └── response/
│       ├── security/           # JwtService, JwtAuthFilter, UserDetails impl
│       ├── exception/          # custom exceptions + GlobalExceptionHandler
│       └── enums/
└── frontend/
    ├── package.json
    ├── components.json         # shadcn/ui config
    └── src/
        ├── app/                # App Router pages and layouts
        │   ├── (public)/       # home, jobs list, job detail, login, register
        │   ├── student/        # profile, my applications
        │   ├── employer/       # company, my jobs, applicants
        │   └── admin/          # employers, jobs, users
        ├── components/
        │   ├── ui/             # shadcn/ui generated components (do not hand-edit casually)
        │   └── ...             # app-specific components
        ├── lib/                # axios instance, utils, zod schemas
        ├── hooks/              # TanStack Query hooks (useJobs, useApply, ...)
        └── store/              # Zustand stores (auth)
```

Backend uses **package-by-layer**. Adjust the base package name if the user specifies one.

## 4. Data Model

All table names are plural `snake_case`; columns are `snake_case`. Use `Long` ids with `GenerationType.IDENTITY`. Add `created_at` / `updated_at` to every table (`@CreationTimestamp` / `@UpdateTimestamp`).

| Table | Key columns |
|-------|-------------|
| `users` | `id`, `email` (unique), `password` (BCrypt), `role` (enum), `status` (`ACTIVE`, `PENDING_APPROVAL`, `LOCKED`) |
| `student_profiles` | `id`, `user_id` (FK, unique), `full_name`, `phone`, `university`, `major`, `skills` (text), `cv_url` |
| `employer_profiles` | `id`, `user_id` (FK, unique), `company_name`, `description`, `website`, `address`, `logo_url` |
| `categories` | `id`, `name` (unique) |
| `jobs` | `id`, `employer_id` (FK → employer_profiles), `category_id` (FK), `title`, `description`, `requirements`, `salary_min`, `salary_max`, `location`, `job_type` (`INTERNSHIP`, `PART_TIME`, `FULL_TIME`), `deadline` (date), `status` (`OPEN`, `CLOSED`, `HIDDEN`) |
| `applications` | `id`, `job_id` (FK), `student_id` (FK → student_profiles), `cover_letter`, `status` (`PENDING`, `ACCEPTED`, `REJECTED`); unique (`job_id`, `student_id`) |

Relationships: `User 1–1 StudentProfile`, `User 1–1 EmployerProfile`, `EmployerProfile 1–N Job`, `Category 1–N Job`, `Job 1–N Application`, `StudentProfile 1–N Application`.

Rules:
- Use `FetchType.LAZY` for associations. Never return entities from controllers; always return DTOs.
- Use Lombok (`@Getter`, `@Setter`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`). Avoid `@Data` on entities.
- Schema management: `spring.jpa.hibernate.ddl-auto=update`. A `DataSeeder` (`CommandLineRunner`) seeds the admin account and default categories if missing.

## 5. Authentication & Authorization

Stateless JWT with two tokens:

| Token | Lifetime | Storage on client | Transport |
|-------|----------|-------------------|-----------|
| Access | 15 min | **Zustand store (memory only)**. Never `localStorage` / `sessionStorage`. | `Authorization: Bearer <token>` |
| Refresh | 7 days | **HttpOnly cookie** set by backend (`Secure` in prod, `SameSite=Lax`, `Path=/api/auth`) | Sent automatically by the browser |

Refresh tokens are **not stored in the database** (stateless). Logout just clears the cookie. Consequently there is no server-side revocation or rotation; keep this limitation in mind and do not add a `refresh_tokens` table.

Include a `type` claim (`access` / `refresh`) in tokens and reject a token used for the wrong purpose. Secrets and expirations come from `application.yml` (env-overridable), never hard-coded.

### Auth endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register/student` | Create student account (status `ACTIVE`) |
| POST | `/api/auth/register/employer` | Create employer account (status `PENDING_APPROVAL`) |
| POST | `/api/auth/login` | Returns access token in body, sets refresh cookie |
| POST | `/api/auth/refresh` | Reads refresh cookie, returns a new access token |
| POST | `/api/auth/logout` | Clears refresh cookie |
| GET | `/api/auth/me` | Current user info |
| POST | `/api/auth/change-password` | Change own password (`currentPassword`, `newPassword`); requires login |

### Rules
- Passwords hashed with BCrypt.
- Authorization via `@PreAuthorize("hasRole('STUDENT')")` etc. (enable `@EnableMethodSecurity`). Roles map to `ROLE_` authorities.
- Ownership checks live in services (e.g. an employer can only edit/view applicants of **their own** jobs; a student can only view **their own** applications).
- Public endpoints: `GET /api/jobs`, `GET /api/jobs/{id}`, `GET /api/categories`, `/api/auth/**` (except `/me` and `/change-password`), Swagger UI.
- CORS: allow origin `http://localhost:3000` with `allowCredentials(true)`. Frontend axios must use `withCredentials: true`.

### Frontend auth flow
1. Login → store access token + user in Zustand.
2. On app start (page reload), call `POST /api/auth/refresh` once to restore the session (the access token is lost on reload).
3. axios response interceptor: on `401`, call `/api/auth/refresh` once (queue concurrent requests), retry the original request; if refresh fails, clear the store and redirect to `/login`.
4. Route guard is **client-side** (a layout/guard component per role area checks Zustand `user.role`). Do not rely on Next.js `middleware.js` for auth because the refresh cookie belongs to the backend origin.

## 6. REST API Conventions

- Base path `/api`, JSON only, plural nouns, standard HTTP verbs and status codes (`201` on create, `204` on delete, `400/401/403/404/409` for errors).
- **Response wrapper** for all responses:

```json
{ "success": true, "data": { }, "message": "..." }
```

Errors:

```json
{ "success": false, "data": null, "message": "Validation failed", "errors": { "email": "must be a valid email" } }
```

- Pagination uses Spring Data `Pageable` (`?page=0&size=10&sort=createdAt,desc`); return a `PageResponse` DTO (`content`, `page`, `size`, `totalElements`, `totalPages`).
- Validate request DTOs with `@Valid` and Jakarta constraints (`@NotBlank`, `@Email`, `@Size`, ...).
- A single `@RestControllerAdvice` (`GlobalExceptionHandler`) handles validation errors, custom exceptions (`ResourceNotFoundException`, `BadRequestException`, `ConflictException`, `ForbiddenException`), `AccessDeniedException`, and a generic fallback. Never leak stack traces.
- Swagger UI is enabled at `/swagger-ui.html`; annotate controllers minimally (`@Tag`, `@Operation`).

### Main endpoints

| Area | Endpoints |
|------|-----------|
| Jobs (public) | `GET /api/jobs` (filters: `keyword`, `categoryId`, `jobType`, `location`, `salaryMin`), `GET /api/jobs/{id}` |
| Categories | `GET /api/categories` |
| Student | `GET/PUT /api/students/me`, `POST /api/jobs/{id}/applications`, `GET /api/jobs/{id}/applications/me` (404 if not applied), `GET /api/students/me/applications` |
| Employer | `GET/PUT /api/employers/me`, `POST /api/employers/me/jobs`, `GET /api/employers/me/jobs`, `PUT/DELETE /api/employers/me/jobs/{id}`, `GET /api/employers/me/jobs/{id}/applications`, `PATCH /api/applications/{id}/status` (`ACCEPTED` / `REJECTED`) |
| Admin | `GET /api/admin/employers?status=`, `PATCH /api/admin/employers/{userId}/approval`, `GET /api/admin/jobs`, `PATCH /api/admin/jobs/{id}/visibility`, `GET /api/admin/users`, `PATCH /api/admin/users/{id}/lock` |

Filtering uses a JPQL `@Query` or Spring Data `Specification`; keep it simple.

## 7. Backend Code Conventions

- Controllers: thin; only HTTP concerns and delegation to services. Constructor injection via Lombok `@RequiredArgsConstructor`.
- Services: concrete classes (no interface-per-service required), annotated `@Service`, `@Transactional` on write methods and `@Transactional(readOnly = true)` on reads.
- Repositories: extend `JpaRepository`; derived queries or `@Query`.
- DTOs: separate request/response classes (Java `record`s are fine). Hand-written mappers.
- Naming: `XxxController`, `XxxService`, `XxxRepository`, `XxxRequest`, `XxxResponse`.
- Config via `application.yml` with env-var overrides (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, ...). Never commit real secrets; commit an `application-example.yml` if needed.
- Log with SLF4J (`@Slf4j`); no `System.out.println`.

## 8. Frontend Code Conventions

- App Router; pages are Server Components by default. Add `'use client'` only where state, effects, or browser APIs are needed (most authenticated pages will be client components).
- JavaScript only: `.js` / `.jsx` files, no TypeScript. Use JSDoc sparingly if helpful.
- UI: use shadcn/ui components (add via `npx shadcn@latest add <component>`). Style with Tailwind utility classes; no extra CSS frameworks or component libraries.
- API layer: a single axios instance in `src/lib/api.js` (`baseURL` from `NEXT_PUBLIC_API_URL`, `withCredentials: true`, request interceptor adds the Bearer token, response interceptor handles refresh). Group calls per resource (`src/lib/api/jobs.js`, ...).
- Server state with TanStack Query hooks in `src/hooks/`; invalidate queries after mutations. Zustand is **only** for auth (`accessToken`, `user`, `setAuth`, `clearAuth`).
- Forms: `react-hook-form` + `zod` resolver + shadcn/ui `Form`. Show backend validation errors from the `errors` map.
- Feedback: loading skeletons, empty states, and toast messages (shadcn `sonner`) for success/error.
- All user-facing text in Vietnamese.
- File naming: `kebab-case` for files/folders, `PascalCase` for components.

### Pages

| Route | Access | Purpose |
|-------|--------|---------|
| `/` | public | Home, featured/latest jobs, search box |
| `/jobs` | public | Job list with filters and pagination |
| `/jobs/[id]` | public | Job detail, apply button (students) |
| `/login`, `/register` | public | Auth (register has student / employer tabs) |
| `/student/profile` | STUDENT | Edit profile and CV link |
| `/student/applications` | STUDENT | Applied jobs and statuses |
| `/account/password` | any logged-in user | Change password |
| `/employer/company` | EMPLOYER | Company profile |
| `/employer/jobs` | EMPLOYER | Manage jobs (list, create, edit, delete) |
| `/employer/jobs/[id]/applicants` | EMPLOYER | Applicants, accept / reject |
| `/admin/employers` | ADMIN | Approve / reject employers |
| `/admin/jobs` | ADMIN | Hide / unhide jobs |
| `/admin/users` | ADMIN | Lock / unlock users |

## 9. Commands

```bash
# Database
docker compose up -d                      # start PostgreSQL

# Backend (from /backend)
./mvnw spring-boot:run                    # run on :8080
./mvnw clean package -DskipTests          # build jar

# Frontend (from /frontend)
npm install
npm run dev                               # run on :3000
npm run build && npm run start            # production build
npm run lint
```

Environment variables:
- Backend: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `JWT_ACCESS_EXPIRATION`, `JWT_REFRESH_EXPIRATION`, `CORS_ALLOWED_ORIGIN`
- Frontend (`.env.local`): `NEXT_PUBLIC_API_URL=http://localhost:8080/api`

## 10. Git Conventions

- Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `style:`.
- Small, focused commits; one logical change each.
- Never commit `.env*`, `application-local.yml`, `node_modules`, `target`, `.next`.

## 11. Rules for Agents (Do / Don't)

**Do**
- Keep implementations simple and consistent with the conventions above.
- Read existing code and match its style before adding new code.
- Implement backend and frontend together for a feature and keep API contracts in sync with Section 6.
- Run the build (`./mvnw clean package -DskipTests`, `npm run build`) after meaningful changes to make sure it compiles.
- Ask the user when requirements are ambiguous or a new dependency seems necessary.

**Don't**
- Don't write automated tests (out of scope for this project).
- Don't introduce TypeScript, MapStruct, Flyway/Liquibase, Redux, or other libraries not listed in Section 2.
- Don't store tokens in `localStorage` / `sessionStorage`, or persist refresh tokens in the database.
- Don't return JPA entities directly from controllers or expose password hashes.
- Don't hard-code secrets, URLs, or credentials.
- Don't add out-of-scope features (favorites, email flows, file upload, notifications, statistics).
- Don't hand-edit generated shadcn/ui components unless necessary; don't rename or reorganize top-level directories without asking.
