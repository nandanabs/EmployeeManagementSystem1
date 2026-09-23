import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveService } from '../../core/services/leave.service';
import { EmployeeService } from '../../core/services/employee.service';
import { AuthService } from '../../core/services/auth.service';
import { LeaveRequest, LeaveType } from '../../core/models/models';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss'],
})
export class LeaveComponent implements OnInit {
  leaveRequests: LeaveRequest[] = [];
  leaveTypes: LeaveType[] = [];
  leaveBalance: any[] = [];
  form: FormGroup;
  isAdmin = false;
  myEmployeeId: number | null = null;
  loading = true;
  showApplyForm = false;

  constructor(
    private leaveService: LeaveService,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      leave_type: [null, Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      reason: [''],
    });
  }

  ngOnInit(): void {
    const role = this.authService.getRole();
    this.isAdmin = role === 'ADMIN' || role === 'MANAGER';

    this.leaveService.getLeaveTypes().subscribe((res) => (this.leaveTypes = res.results));

    if (this.isAdmin) {
      this.loadRequests();
    } else {
      this.employeeService.getMyEmployeeRecord().subscribe((emp) => {
        this.myEmployeeId = emp.id;
        this.loadRequests();
        this.loadBalance();
      });
    }
  }

  loadRequests(): void {
    this.loading = true;
    const employeeFilter = this.isAdmin ? null : this.myEmployeeId;
    this.leaveService.getLeaveRequests(employeeFilter).subscribe({
      next: (res) => {
        this.leaveRequests = res.results;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  loadBalance(): void {
    if (!this.myEmployeeId) {
      return;
    }
    this.leaveService.getLeaveBalance(this.myEmployeeId).subscribe((res) => (this.leaveBalance = res));
  }

  onSubmit(): void {
    if (this.form.invalid || !this.myEmployeeId) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = { ...this.form.value, employee: this.myEmployeeId };
    this.leaveService.applyLeave(payload).subscribe(() => {
      this.form.reset();
      this.showApplyForm = false;
      this.loadRequests();
      this.loadBalance();
    });
  }

  approve(id: number): void {
    this.leaveService.approveLeave(id).subscribe(() => this.loadRequests());
  }

  reject(id: number): void {
    this.leaveService.rejectLeave(id).subscribe(() => this.loadRequests());
  }
}
