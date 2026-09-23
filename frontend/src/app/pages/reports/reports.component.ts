import { Component } from '@angular/core';
import { ReportService } from '../../core/services/report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent {
  reportList = [
    { key: 'employees', label: 'Employee Report', icon: 'bi-person-badge' },
    { key: 'projects', label: 'Project Report', icon: 'bi-kanban' },
    { key: 'project-team', label: 'Project Team Report', icon: 'bi-people' },
    { key: 'attendance', label: 'Attendance Report', icon: 'bi-calendar-check' },
    { key: 'leave', label: 'Leave Report', icon: 'bi-calendar-x' },
    { key: 'payroll', label: 'Payroll Report', icon: 'bi-cash-coin' },
  ];

  constructor(private reportService: ReportService) {}

  download(reportKey: string, format: 'pdf' | 'excel'): void {
    this.reportService.downloadReport(reportKey, format);
  }
}
