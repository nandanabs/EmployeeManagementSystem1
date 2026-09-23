import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
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

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    LayoutComponent,
    LoginComponent,
    AdminDashboardComponent,
    EmployeeDashboardComponent,
    EmployeeListComponent,
    EmployeeFormComponent,
    DepartmentsComponent,
    DesignationsComponent,
    ProjectListComponent,
    ProjectFormComponent,
    ProjectTeamComponent,
    AttendanceComponent,
    LeaveComponent,
    PayrollComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
