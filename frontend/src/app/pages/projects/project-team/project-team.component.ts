import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee, Project, ProjectAssignment } from '../../../core/models/models';

@Component({
  selector: 'app-project-team',
  templateUrl: './project-team.component.html',
  styleUrls: ['./project-team.component.scss'],
})
export class ProjectTeamComponent implements OnInit {
  project: Project | null = null;
  teamMembers: ProjectAssignment[] = [];
  allEmployees: Employee[] = [];
  selectedEmployeeIds: number[] = [];
  roleInProject = 'Team Member';
  showAssignModal = false;
  loading = true;

  constructor(
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.projectService.getProject(projectId).subscribe((p) => (this.project = p));
    this.employeeService.getEmployees().subscribe((res) => (this.allEmployees = res.results));
    this.loadTeam(projectId);
  }

  loadTeam(projectId: number): void {
    this.loading = true;
    this.projectService.getTeam(projectId).subscribe({
      next: (res) => {
        this.teamMembers = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  openAssignModal(): void {
    this.selectedEmployeeIds = [];
    this.roleInProject = 'Team Member';
    this.showAssignModal = true;
  }

  closeAssignModal(): void {
    this.showAssignModal = false;
  }

  toggleEmployeeSelection(employeeId: number, checked: boolean): void {
    if (checked) {
      this.selectedEmployeeIds.push(employeeId);
    } else {
      this.selectedEmployeeIds = this.selectedEmployeeIds.filter((id) => id !== employeeId);
    }
  }

  isAlreadyAssigned(employeeId: number): boolean {
    return this.teamMembers.some((m) => m.employee === employeeId);
  }

  assignSelected(): void {
    if (!this.project || !this.selectedEmployeeIds.length) {
      return;
    }
    this.projectService.assignEmployees(this.project.id, this.selectedEmployeeIds, this.roleInProject).subscribe(() => {
      this.showAssignModal = false;
      this.loadTeam(this.project!.id);
    });
  }

  removeMember(employeeId: number): void {
    if (!this.project) {
      return;
    }
    if (confirm('Remove this employee from the project?')) {
      this.projectService.removeMember(this.project.id, employeeId).subscribe(() => {
        this.loadTeam(this.project!.id);
      });
    }
  }

  back(): void {
    this.router.navigate(['/projects']);
  }
}
