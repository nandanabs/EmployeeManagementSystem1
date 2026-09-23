import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { EmployeeDashboardComponent } from './pages/employee-dashboard/employee-dashboard.component';
import { EmployeeListComponent } from './pages/employees/employee-list/employee-list.component';
import { EmployeeFormComponent } from './pages/employees/employee-form/employee-form.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { DesignationsComponent } from './pages/designations/designations.component';
import { ProjectListComponent } from './pages/projects/project-list/project-list.component';
import { ProjectFormComponent } from './pages/projects/project-form/project-form.component';
import { ProjectTeamComponent } from './pages/projects/project-team/project-team.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { LeaveComponent } from './pages/leave/leave.component';
import { PayrollComponent } from './pages/payroll/payroll.component';
import { ReportsComponent } from './pages/reports/reports.component';

import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'admin-dashboard', pathMatch: 'full' },
      {
        path: 'admin-dashboard',
        component: AdminDashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'employee-dashboard',
        component: EmployeeDashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: ['EMPLOYEE', 'MANAGER'] },
      },
      { path: 'employees', component: EmployeeListComponent },
      { path: 'employees/new', component: EmployeeFormComponent },
      { path: 'employees/:id/edit', component: EmployeeFormComponent },
      { path: 'departments', component: DepartmentsComponent },
      { path: 'designations', component: DesignationsComponent },
      { path: 'projects', component: ProjectListComponent },
      { path: 'projects/new', component: ProjectFormComponent },
      { path: 'projects/:id/edit', component: ProjectFormComponent },
      { path: 'projects/:id/team', component: ProjectTeamComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'leave', component: LeaveComponent },
      { path: 'payroll', component: PayrollComponent },
      { path: 'reports', component: ReportsComponent },
    ],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
