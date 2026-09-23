import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee.service';
import { Department, Designation } from '../../../core/models/models';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
})
export class EmployeeFormComponent implements OnInit {
  form: FormGroup;
  departments: Department[] = [];
  designations: Designation[] = [];
  employeeId: number | null = null;
  isEditMode = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      employee_code: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: [''],
      password: [''],
      department: [null],
      designation: [null],
      phone: [''],
      address: [''],
      date_of_joining: [''],
      is_active: [true],
    });
  }

  ngOnInit(): void {
    this.employeeService.getDepartments().subscribe((res) => (this.departments = res.results));
    this.employeeService.getDesignations().subscribe((res) => (this.designations = res.results));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.employeeId = Number(idParam);
      this.form.get('password')?.clearValidators();
      this.loadEmployee(this.employeeId);
    } else {
      this.form.get('password')?.setValidators(Validators.required);
    }
  }

  loadEmployee(id: number): void {
    this.employeeService.getEmployee(id).subscribe((emp) => {
      const [firstName, ...rest] = (emp.full_name || '').split(' ');
      this.form.patchValue({
        employee_code: emp.employee_code,
        username: emp.email?.split('@')[0] || '',
        email: emp.email,
        first_name: firstName,
        last_name: rest.join(' '),
        department: emp.department,
        designation: emp.designation,
        phone: emp.phone,
        address: emp.address,
        date_of_joining: emp.date_of_joining,
        is_active: emp.is_active,
      });
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = { ...this.form.value };
    if (!payload.password) {
      delete payload.password;
    }

    const request = this.isEditMode
      ? this.employeeService.updateEmployee(this.employeeId as number, payload)
      : this.employeeService.createEmployee(payload);

    request.subscribe({
      next: () => this.router.navigate(['/employees']),
      error: (err) => {
        this.errorMessage = err?.error?.username?.[0] || err?.error?.email?.[0] || 'Could not save employee.';
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }
}
