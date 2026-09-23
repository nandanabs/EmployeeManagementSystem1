import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/models';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  statusFilter = '';
  loading = true;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  isAdmin(): boolean {
    const role = this.authService.getRole();
    return role === 'ADMIN' || role === 'MANAGER';
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getProjects(this.statusFilter).subscribe({
      next: (res) => {
        this.projects = res.results;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  addProject(): void {
    this.router.navigate(['/projects/new']);
  }

  editProject(id: number): void {
    this.router.navigate(['/projects', id, 'edit']);
  }

  viewTeam(id: number): void {
    this.router.navigate(['/projects', id, 'team']);
  }

  deactivateProject(id: number): void {
    if (confirm('Deactivate this project?')) {
      this.projectService.deactivateProject(id).subscribe(() => this.loadProjects());
    }
  }

  deleteProject(id: number): void {
    if (confirm('Permanently delete this project?')) {
      this.projectService.deleteProject(id).subscribe(() => this.loadProjects());
    }
  }
}
