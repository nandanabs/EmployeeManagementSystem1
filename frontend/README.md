# Employee Management System — Frontend

Angular 16 + Bootstrap 5 single-page application.

## Tech Stack
- Angular 16
- Bootstrap 5 + Bootstrap Icons
- RxJS
- JWT auth with automatic token refresh (HTTP interceptor)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Make sure the Django backend is running at http://127.0.0.1:8000
#    (see the backend README). Update src/environments/environment.ts
#    if your backend runs on a different host/port.

# 3. Start the dev server
ng serve
```

The app will be available at `http://localhost:4200`.

## Demo Logins

| Role     | Username | Password      |
|----------|----------|---------------|
| Admin    | admin    | admin12345    |
| Employee | jdoe     | employee123   |

(Created by the backend's `python manage.py seed_demo_data` command.)

## Production Build

```bash
ng build --configuration production
```

Output is generated in `dist/ems-frontend/`.

## Project Structure

```
src/app/
├── core/
│   ├── models/          # Shared TypeScript interfaces
│   ├── services/        # HTTP services (auth, employee, project, attendance, leave, payroll, dashboard, report)
│   ├── guards/          # AuthGuard, RoleGuard
│   └── interceptors/    # AuthInterceptor (attaches JWT, auto-refreshes on 401)
├── shared/
│   ├── navbar/
│   ├── sidebar/
│   └── layout/           # Main authenticated layout (sidebar + navbar + router-outlet)
└── pages/
    ├── login/
    ├── admin-dashboard/
    ├── employee-dashboard/
    ├── employees/ (list, form)
    ├── departments/
    ├── designations/
    ├── projects/ (list, form, team)
    ├── attendance/
    ├── leave/
    ├── payroll/
    └── reports/
```

## Features Covered

- Login with JWT, route guards, role-based sidebar & routes, auto logout on token expiry
- Employee CRUD with search/filter by department
- Department & designation management
- Project CRUD, project status (Planning/Active/Completed)
- Team assignment via modal, view/remove team members
- Admin dashboard with live stats (employees, projects, attendance, leave, payroll)
- Employee dashboard (profile, assigned projects, today's attendance, leave balance, recent payslip)
- Attendance check-in/check-out, history, attendance %
- Leave application, approval/rejection, leave balance
- Salary structure & payslip generation
- Reports: PDF & Excel export for employees, projects, project-team, attendance, leave, payroll
