import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../core/services/employee.service';
import { Department, Designation } from '../../core/models/models';

@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.scss'],
})
export class DesignationsComponent implements OnInit {
  designations: Designation[] = [];
  departments: Department[] = [];
  form: FormGroup;
  editingId: number | null = null;
  loading = true;

  constructor(private employeeService: EmployeeService, private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      department: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.employeeService.getDepartments().subscribe((res) => (this.departments = res.results));
    this.loadDesignations();
  }

  loadDesignations(): void {
    this.loading = true;
    this.employeeService.getDesignations().subscribe({
      next: (res) => {
        this.designations = res.results;
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
      this.employeeService.updateDesignation(this.editingId, this.form.value).subscribe(() => {
        this.resetForm();
        this.loadDesignations();
      });
    } else {
      this.employeeService.createDesignation(this.form.value).subscribe(() => {
        this.resetForm();
        this.loadDesignations();
      });
    }
  }

  editDesignation(designation: Designation): void {
    this.editingId = designation.id;
    this.form.patchValue({ title: designation.title, department: designation.department });
  }

  deleteDesignation(id: number): void {
    if (confirm('Delete this designation?')) {
      this.employeeService.deleteDesignation(id).subscribe(() => this.loadDesignations());
    }
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset();
  }
}
