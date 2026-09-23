import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PayrollService } from '../../core/services/payroll.service';
import { EmployeeService } from '../../core/services/employee.service';
import { AuthService } from '../../core/services/auth.service';
import { Employee, Payslip, SalaryStructure } from '../../core/models/models';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss'],
})
export class PayrollComponent implements OnInit {
  isAdmin = false;
  myEmployeeId: number | null = null;

  employees: Employee[] = [];
  salaryStructures: SalaryStructure[] = [];
  payslips: Payslip[] = [];

  salaryForm: FormGroup;
  payslipForm: FormGroup;

  loading = true;
  showSalaryForm = false;
  showPayslipForm = false;

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  constructor(
    private payrollService: PayrollService,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.salaryForm = this.fb.group({
      employee: [null, Validators.required],
      basic_salary: [0, [Validators.required, Validators.min(0)]],
      hra: [0, Validators.min(0)],
      other_allowances: [0, Validators.min(0)],
      deductions: [0, Validators.min(0)],
    });

    this.payslipForm = this.fb.group({
      employee: [null, Validators.required],
      month: ['January', Validators.required],
      year: [new Date().getFullYear(), Validators.required],
      basic_salary: [0, [Validators.required, Validators.min(0)]],
      allowances: [0, Validators.min(0)],
      deductions: [0, Validators.min(0)],
    });
  }

  ngOnInit(): void {
    const role = this.authService.getRole();
    this.isAdmin = role === 'ADMIN' || role === 'MANAGER';

    if (this.isAdmin) {
      this.employeeService.getEmployees().subscribe((res) => (this.employees = res.results));
      this.loadSalaryStructures();
      this.loadPayslips();
    } else {
      this.employeeService.getMyEmployeeRecord().subscribe((emp) => {
        this.myEmployeeId = emp.id;
        this.loadPayslips();
        this.loading = false;
      });
    }
  }

  loadSalaryStructures(): void {
    this.payrollService.getSalaryStructures().subscribe({
      next: (res) => (this.salaryStructures = res.results),
    });
  }

  loadPayslips(): void {
    this.loading = true;
    const employeeFilter = this.isAdmin ? null : this.myEmployeeId;
    this.payrollService.getPayslips(employeeFilter).subscribe({
      next: (res) => {
        this.payslips = res.results;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  submitSalaryStructure(): void {
    if (this.salaryForm.invalid) {
      this.salaryForm.markAllAsTouched();
      return;
    }
    this.payrollService.createSalaryStructure(this.salaryForm.value).subscribe(() => {
      this.salaryForm.reset({ basic_salary: 0, hra: 0, other_allowances: 0, deductions: 0 });
      this.showSalaryForm = false;
      this.loadSalaryStructures();
    });
  }

  submitPayslip(): void {
    if (this.payslipForm.invalid) {
      this.payslipForm.markAllAsTouched();
      return;
    }
    this.payrollService.generatePayslip(this.payslipForm.value).subscribe(() => {
      this.payslipForm.reset({
        month: 'January',
        year: new Date().getFullYear(),
        basic_salary: 0,
        allowances: 0,
        deductions: 0,
      });
      this.showPayslipForm = false;
      this.loadPayslips();
    });
  }
}
