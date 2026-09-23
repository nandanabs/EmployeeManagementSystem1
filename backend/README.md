# Employee Management System — Backend

Django REST Framework API with JWT authentication and a SQLite database.

## Tech Stack
- Python 3.10+
- Django + Django REST Framework
- Simple JWT (access/refresh tokens)
- SQLite
- django-cors-headers, django-filter
- reportlab (PDF export), openpyxl (Excel export)

## Setup

```bash
# 1. Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run migrations
python manage.py migrate

# 4. Seed demo data (creates an admin user + sample employee/project/leave data)
python manage.py seed_demo_data

# 5. Run the server
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/api/`.
The Django admin panel is available at `http://127.0.0.1:8000/admin/`.

## Demo Logins (created by seed_demo_data)

| Role     | Username | Password      |
|----------|----------|---------------|
| Admin    | admin    | admin12345    |
| Employee | jdoe     | employee123   |

## Project Structure

```
empms_backend/
├── accounts/         # Custom user model + JWT login/register
├── employees/        # Department, Designation, Employee
├── projects_app/      # Project, ProjectAssignment (team assignment)
├── attendance/       # Attendance (check-in/check-out)
├── leave_app/        # LeaveType, LeaveRequest
├── payroll/          # SalaryStructure, Payslip
├── dashboard/        # Admin & employee dashboard aggregation APIs
├── reports_app/      # PDF/Excel report export
└── empms_backend/    # Project settings & root urls
```

## Main API Endpoints

- `POST /api/auth/login/` — obtain JWT access/refresh tokens
- `POST /api/auth/refresh/` — refresh access token
- `POST /api/auth/register/` — register a new user
- `GET  /api/auth/me/` — current logged-in user

- `GET/POST /api/employees/` — list/create employees
- `GET/POST /api/employees/departments/`
- `GET/POST /api/employees/designations/`
- `GET /api/employees/me/` — employee record for the logged-in user

- `GET/POST /api/projects/` — list/create projects
- `GET /api/projects/{id}/team/` — list team members
- `POST /api/projects/{id}/assign/` — assign employees `{employee_ids: [...], role_in_project: ""}`
- `POST /api/projects/{id}/remove-member/` — remove employee `{employee_id: 1}`

- `GET/POST /api/attendance/` — attendance records
- `POST /api/attendance/check-in/` `{employee: 1}`
- `POST /api/attendance/check-out/` `{employee: 1}`

- `GET/POST /api/leave/types/`
- `GET/POST /api/leave/requests/`
- `POST /api/leave/requests/{id}/approve/`
- `POST /api/leave/requests/{id}/reject/`
- `GET /api/leave/requests/balance/{employee_id}/`

- `GET/POST /api/payroll/salary-structures/`
- `GET/POST /api/payroll/payslips/`

- `GET /api/dashboard/admin/` — admin dashboard stats
- `GET /api/dashboard/employee/{id}/` — employee dashboard data

- `GET /api/reports/{report}/{format}/` — where report is one of
  `employees`, `projects`, `project-team`, `attendance`, `leave`, `payroll`
  and format is `pdf` or `excel`.

All endpoints (except login/register) require the header:
`Authorization: Bearer <access_token>`
