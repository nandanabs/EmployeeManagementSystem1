import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResponse, Payslip, SalaryStructure } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class PayrollService {
  private apiUrl = environment.apiUrl + '/payroll';

  constructor(private http: HttpClient) {}

  getSalaryStructures(employeeId: number | null = null): Observable<PaginatedResponse<SalaryStructure>> {
    let url = `${this.apiUrl}/salary-structures/`;
    if (employeeId) {
      url += `?employee=${employeeId}`;
    }
    return this.http.get<PaginatedResponse<SalaryStructure>>(url);
  }

  createSalaryStructure(data: Partial<SalaryStructure>): Observable<SalaryStructure> {
    return this.http.post<SalaryStructure>(`${this.apiUrl}/salary-structures/`, data);
  }

  updateSalaryStructure(id: number, data: Partial<SalaryStructure>): Observable<SalaryStructure> {
    return this.http.put<SalaryStructure>(`${this.apiUrl}/salary-structures/${id}/`, data);
  }

  getPayslips(employeeId: number | null = null): Observable<PaginatedResponse<Payslip>> {
    let url = `${this.apiUrl}/payslips/`;
    if (employeeId) {
      url += `?employee=${employeeId}`;
    }
    return this.http.get<PaginatedResponse<Payslip>>(url);
  }

  generatePayslip(data: Partial<Payslip>): Observable<Payslip> {
    return this.http.post<Payslip>(`${this.apiUrl}/payslips/`, data);
  }
}
