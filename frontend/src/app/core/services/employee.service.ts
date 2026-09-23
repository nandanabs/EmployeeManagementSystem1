import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Department, Designation, Employee, EmployeeCreateRequest, PaginatedResponse } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = environment.apiUrl + '/employees';

  constructor(private http: HttpClient) {}

  getEmployees(search: string = '', department: number | null = null): Observable<PaginatedResponse<Employee>> {
    let url = `${this.apiUrl}/?`;
    if (search) {
      url += `search=${search}&`;
    }
    if (department) {
      url += `department=${department}&`;
    }
    return this.http.get<PaginatedResponse<Employee>>(url);
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}/`);
  }

  getMyEmployeeRecord(): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/me/`);
  }

  createEmployee(data: EmployeeCreateRequest): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/`, data);
  }

  updateEmployee(id: number, data: Partial<EmployeeCreateRequest>): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}/`, data);
  }

  deactivateEmployee(id: number): Observable<Employee> {
    return this.http.patch<Employee>(`${this.apiUrl}/${id}/`, { is_active: false });
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  // Departments
  getDepartments(): Observable<PaginatedResponse<Department>> {
    return this.http.get<PaginatedResponse<Department>>(`${this.apiUrl}/departments/`);
  }

  createDepartment(data: Partial<Department>): Observable<Department> {
    return this.http.post<Department>(`${this.apiUrl}/departments/`, data);
  }

  updateDepartment(id: number, data: Partial<Department>): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/departments/${id}/`, data);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/departments/${id}/`);
  }

  // Designations
  getDesignations(department: number | null = null): Observable<PaginatedResponse<Designation>> {
    let url = `${this.apiUrl}/designations/`;
    if (department) {
      url += `?department=${department}`;
    }
    return this.http.get<PaginatedResponse<Designation>>(url);
  }

  createDesignation(data: Partial<Designation>): Observable<Designation> {
    return this.http.post<Designation>(`${this.apiUrl}/designations/`, data);
  }

  updateDesignation(id: number, data: Partial<Designation>): Observable<Designation> {
    return this.http.put<Designation>(`${this.apiUrl}/designations/${id}/`, data);
  }

  deleteDesignation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/designations/${id}/`);
  }
}
