import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard.service';
import { EmployeeService } from '../../core/services/employee.service';
import { EmployeeDashboardData } from '../../core/models/models';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss'],
})
export class EmployeeDashboardComponent implements OnInit {
  data: EmployeeDashboardData | null = null;
  loading = true;
  errorMessage = '';

  constructor(
    private dashboardService: DashboardService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.employeeService.getMyEmployeeRecord().subscribe({
      next: (employee) => {
        this.dashboardService.getEmployeeDashboard(employee.id).subscribe({
          next: (dashboardData) => {
            this.data = dashboardData;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.errorMessage = 'Could not load dashboard data.';
          },
        });
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No employee profile is linked to your account yet.';
      },
    });
  }
}
