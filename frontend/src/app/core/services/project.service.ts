import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResponse, Project, ProjectAssignment } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = environment.apiUrl + '/projects';

  constructor(private http: HttpClient) {}

  getProjects(status: string = ''): Observable<PaginatedResponse<Project>> {
    let url = `${this.apiUrl}/?`;
    if (status) {
      url += `status=${status}&`;
    }
    return this.http.get<PaginatedResponse<Project>>(url);
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}/`);
  }

  createProject(data: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/`, data);
  }

  updateProject(id: number, data: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}/`, data);
  }

  deactivateProject(id: number): Observable<Project> {
    return this.http.patch<Project>(`${this.apiUrl}/${id}/`, { is_active: false });
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  getTeam(projectId: number): Observable<ProjectAssignment[]> {
    return this.http.get<ProjectAssignment[]>(`${this.apiUrl}/${projectId}/team/`);
  }

  assignEmployees(projectId: number, employeeIds: number[], role: string): Observable<ProjectAssignment[]> {
    return this.http.post<ProjectAssignment[]>(`${this.apiUrl}/${projectId}/assign/`, {
      employee_ids: employeeIds,
      role_in_project: role,
    });
  }

  removeMember(projectId: number, employeeId: number): Observable<{ detail: string }> {
    return this.http.post<{ detail: string }>(`${this.apiUrl}/${projectId}/remove-member/`, {
      employee_id: employeeId,
    });
  }

  getEmployeeProjects(employeeId: number): Observable<PaginatedResponse<ProjectAssignment>> {
    return this.http.get<PaginatedResponse<ProjectAssignment>>(
      `${this.apiUrl}/assignments/?employee=${employeeId}`
    );
  }
}
