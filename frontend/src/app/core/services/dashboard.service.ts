import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminDashboardStats, EmployeeDashboardData } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = environment.apiUrl + '/dashboard';

  constructor(private http: HttpClient) {}

  getAdminStats(): Observable<AdminDashboardStats> {
    return this.http.get<AdminDashboardStats>(`${this.apiUrl}/admin/`);
  }

  getEmployeeDashboard(employeeId: number): Observable<EmployeeDashboardData> {
    return this.http.get<EmployeeDashboardData>(`${this.apiUrl}/employee/${employeeId}/`);
  }
}
