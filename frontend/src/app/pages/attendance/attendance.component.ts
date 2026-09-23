import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../../core/services/attendance.service';
import { EmployeeService } from '../../core/services/employee.service';
import { AuthService } from '../../core/services/auth.service';
import { Attendance, Employee } from '../../core/models/models';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {
  attendanceRecords: Attendance[] = [];
  employees: Employee[] = [];
  selectedEmployee: number | null = null;
  selectedDate = '';
  loading = true;
  isAdmin = false;
  myEmployeeId: number | null = null;
  myTodayStatus: Attendance | null = null;

  constructor(
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const role = this.authService.getRole();
    this.isAdmin = role === 'ADMIN' || role === 'MANAGER';

    if (this.isAdmin) {
      this.employeeService.getEmployees().subscribe((res) => (this.employees = res.results));
      this.loadAttendance();
    } else {
      this.employeeService.getMyEmployeeRecord().subscribe((emp) => {
        this.myEmployeeId = emp.id;
        this.loadAttendance();
      });
    }
  }

  loadAttendance(): void {
    this.loading = true;
    const employeeFilter = this.isAdmin ? this.selectedEmployee : this.myEmployeeId;
    this.attendanceService.getAttendance(employeeFilter, this.selectedDate).subscribe({
      next: (res) => {
        this.attendanceRecords = res.results;
        this.loading = false;
        const today = new Date().toISOString().slice(0, 10);
        this.myTodayStatus = res.results.find((a) => a.date === today) || null;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  checkIn(): void {
    if (!this.myEmployeeId) {
      return;
    }
    this.attendanceService.checkIn(this.myEmployeeId).subscribe({
      next: () => this.loadAttendance(),
      error: (err) => alert(err?.error?.detail || 'Could not check in.'),
    });
  }

  checkOut(): void {
    if (!this.myEmployeeId) {
      return;
    }
    this.attendanceService.checkOut(this.myEmployeeId).subscribe({
      next: () => this.loadAttendance(),
      error: (err) => alert(err?.error?.detail || 'Could not check out.'),
    });
  }

  presentCount(): number {
    return this.attendanceRecords.filter((a) => a.status === 'PRESENT').length;
  }

  attendancePercentage(): number {
    if (!this.attendanceRecords.length) {
      return 0;
    }
    return Math.round((this.presentCount() / this.attendanceRecords.length) * 100);
  }
}
