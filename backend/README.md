# School Management API (Spring Boot + PostgreSQL)

This is the first real-backend integration for the supplied React + Vite `student-mgmt` frontend.

## Requirements
- Java 21
- Maven 3.9+
- PostgreSQL 14+

## 1. Create the database

Open `psql` or pgAdmin and run:

```sql
CREATE DATABASE student_management;
```

## 2. Configure the database connection

Edit `src/main/resources/application.yml` or export environment variables. Defaults are:

```text
DB_URL=jdbc:postgresql://localhost:5432/student_management
DB_USERNAME=postgres
DB_PASSWORD=change-me
ADMIN_EMAIL=admin@school.edu
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:5173
```

Set `DB_USERNAME` and `DB_PASSWORD` to your actual local PostgreSQL credentials. Do not commit real secrets. Before deployment, set `JWT_SECRET` to a secure Base64-encoded random secret (at least 32 bytes).

## 3. Start the backend

From this folder:

```bash
mvn spring-boot:run
```

The first run creates the JPA tables and a development administrator. It also seeds six example classes and six example students if the tables are empty. These are sample records and can be deleted after you confirm the system works.

Development login:

```text
Email: admin@school.edu
Password: admin123
```

Change the development password before any real deployment.

## 4. Start the frontend

From the `frontend` folder:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The frontend API service calls `http://localhost:8080` by default. You may copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_BASE_URL` if needed.

## API routes included

- `POST /api/auth/login` — BCrypt password verification and JWT issue
- `GET /api/auth/me` — current authenticated user
- `GET /api/students`, `POST /api/students`, `GET /api/students/{studentCode}`, `PUT /api/students/{studentCode}`, `DELETE /api/students/{studentCode}`
- `GET /api/classes`, plus create/update/delete endpoints
- `GET /api/attendance?date=YYYY-MM-DD&class=M1`, `PATCH /api/attendance/{id}`
- `GET /api/activities`
- `GET /api/dashboard/summary`
- `GET /api/users`, `POST /api/users`, `PATCH /api/users/{id}/role` — ADMIN only

All API routes except login and health require `Authorization: Bearer <token>`. User creation requires a password of at least eight characters. Roles currently supported for staff accounts: ADMIN, REGISTRAR, TEACHER, ACCOUNTANT.

## Important limitations before real school use

This is an initial working foundation, not yet a production-ready school information system. Password-reset email is deliberately not enabled; `/api/auth/forgot-password` returns a clear not-configured response rather than pretending to change a password. Fine-grained per-role permissions for each student/class/attendance operation, refresh-token rotation, formal database migration scripts, academic-year enrollment history, guardian/grade/finance modules, backups, HTTPS deployment, and audit/compliance review should be completed before importing real student records. The sample seed data is for development only.
