import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../core/services/employee.service';
import { Department } from '../../core/models/models';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
})
export class DepartmentsComponent implements OnInit {
  departments: Department[] = [];
  form: FormGroup;
  editingId: number | null = null;
  loading = true;

  constructor(private employeeService: EmployeeService, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading = true;
    this.employeeService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res.results;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.editingId) {
      this.employeeService.updateDepartment(this.editingId, this.form.value).subscribe(() => {
        this.resetForm();
        this.loadDepartments();
      });
    } else {
      this.employeeService.createDepartment(this.form.value).subscribe(() => {
        this.resetForm();
        this.loadDepartments();
      });
    }
  }

  editDepartment(department: Department): void {
    this.editingId = department.id;
    this.form.patchValue({ name: department.name, description: department.description });
  }

  deleteDepartment(id: number): void {
    if (confirm('Delete this department?')) {
      this.employeeService.deleteDepartment(id).subscribe(() => this.loadDepartments());
    }
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset();
  }
}
