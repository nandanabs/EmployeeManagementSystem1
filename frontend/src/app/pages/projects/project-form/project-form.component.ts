import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../core/models/models';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
})
export class ProjectFormComponent implements OnInit {
  form: FormGroup;
  employees: Employee[] = [];
  projectId: number | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      status: ['PLANNING', Validators.required],
      start_date: [''],
      end_date: [''],
      manager: [null],
    });
  }

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe((res) => (this.employees = res.results));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.projectId = Number(idParam);
      this.projectService.getProject(this.projectId).subscribe((project) => {
        this.form.patchValue(project);
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request = this.isEditMode
      ? this.projectService.updateProject(this.projectId as number, this.form.value)
      : this.projectService.createProject(this.form.value);

    request.subscribe(() => this.router.navigate(['/projects']));
  }

  cancel(): void {
    this.router.navigate(['/projects']);
  }
}
