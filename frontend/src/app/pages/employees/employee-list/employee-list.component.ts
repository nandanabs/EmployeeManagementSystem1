import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee.service';
import { Department, Employee } from '../../../core/models/models';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  departments: Department[] = [];
  searchTerm = '';
  selectedDepartment: number | null = null;
  loading = true;

  constructor(private employeeService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.employeeService.getDepartments().subscribe((res) => (this.departments = res.results));
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getEmployees(this.searchTerm, this.selectedDepartment).subscribe({
      next: (res) => {
        this.employees = res.results;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onSearchChange(): void {
    this.loadEmployees();
  }

  addEmployee(): void {
    this.router.navigate(['/employees/new']);
  }

  editEmployee(id: number): void {
    this.router.navigate(['/employees', id, 'edit']);
  }

  deactivateEmployee(id: number): void {
    if (confirm('Deactivate this employee?')) {
      this.employeeService.deactivateEmployee(id).subscribe(() => this.loadEmployees());
    }
  }

  deleteEmployee(id: number): void {
    if (confirm('Permanently delete this employee? This cannot be undone.')) {
      this.employeeService.deleteEmployee(id).subscribe(() => this.loadEmployees());
    }
  }
}
