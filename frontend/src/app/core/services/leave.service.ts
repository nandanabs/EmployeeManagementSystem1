import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LeaveRequest, LeaveType, PaginatedResponse } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private apiUrl = environment.apiUrl + '/leave';

  constructor(private http: HttpClient) {}

  getLeaveTypes(): Observable<PaginatedResponse<LeaveType>> {
    return this.http.get<PaginatedResponse<LeaveType>>(`${this.apiUrl}/types/`);
  }

  createLeaveType(data: Partial<LeaveType>): Observable<LeaveType> {
    return this.http.post<LeaveType>(`${this.apiUrl}/types/`, data);
  }

  getLeaveRequests(employeeId: number | null = null, status: string = ''): Observable<PaginatedResponse<LeaveRequest>> {
    let url = `${this.apiUrl}/requests/?`;
    if (employeeId) {
      url += `employee=${employeeId}&`;
    }
    if (status) {
      url += `status=${status}&`;
    }
    return this.http.get<PaginatedResponse<LeaveRequest>>(url);
  }

  applyLeave(data: Partial<LeaveRequest>): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.apiUrl}/requests/`, data);
  }

  approveLeave(id: number): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.apiUrl}/requests/${id}/approve/`, {});
  }

  rejectLeave(id: number): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.apiUrl}/requests/${id}/reject/`, {});
  }

  getLeaveBalance(employeeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/requests/balance/${employeeId}/`);
  }
}
