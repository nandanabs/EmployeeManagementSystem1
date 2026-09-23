# Employee & Project Management System

A full-stack HR and project tracking application.

- **Frontend:** Angular 16 + Bootstrap 5 (`/frontend`)
- **Backend:** Python + Django REST Framework + JWT auth (`/backend`)
- **Database:** SQLite

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo_data
python manage.py runserver
```
Backend runs at `http://127.0.0.1:8000`.

### 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
ng serve
```
Frontend runs at `http://localhost:4200`.

### 3. Log in

| Role     | Username | Password      |
|----------|----------|---------------|
| Admin    | admin    | admin12345    |
| Employee | jdoe     | employee123   |

## Modules Included

1. Project setup & environment (Angular 16, Bootstrap, env files, CORS)
2. Authentication (JWT login/refresh, auth guard, role guard, HTTP interceptor, logout)
3. Employee Management (CRUD, search/filter, department & designation)
4. Project Management (CRUD, status, team listing)
5. Team Assignments (assign/remove via modal, project-wise team view)
6. Employee Dashboard (profile, projects, attendance, leave balance, payslip)
7. Admin Dashboard (employee/project/department counts, attendance & leave & payroll summary)
8. Attendance (check-in/check-out, history, attendance %)
9. Leave Management (apply, approve/reject, balance, history)
10. Payroll (salary structure, payslip generation, history)
11. Reports (Employee, Project, Project Team, Attendance, Leave, Payroll — PDF & Excel export)

See `backend/README.md` and `frontend/README.md` for full details on each half.
