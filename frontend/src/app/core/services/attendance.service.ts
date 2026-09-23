import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Attendance, PaginatedResponse } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private apiUrl = environment.apiUrl + '/attendance';

  constructor(private http: HttpClient) {}

  getAttendance(employeeId: number | null = null, date: string = ''): Observable<PaginatedResponse<Attendance>> {
    let url = `${this.apiUrl}/?`;
    if (employeeId) {
      url += `employee=${employeeId}&`;
    }
    if (date) {
      url += `date=${date}&`;
    }
    return this.http.get<PaginatedResponse<Attendance>>(url);
  }

  markAttendance(data: Partial<Attendance>): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.apiUrl}/`, data);
  }

  checkIn(employeeId: number): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.apiUrl}/check-in/`, { employee: employeeId });
  }

  checkOut(employeeId: number): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.apiUrl}/check-out/`, { employee: employeeId });
  }

  updateAttendance(id: number, data: Partial<Attendance>): Observable<Attendance> {
    return this.http.put<Attendance>(`${this.apiUrl}/${id}/`, data);
  }
}
