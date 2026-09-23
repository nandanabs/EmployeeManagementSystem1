import openpyxl
from io import BytesIO
from django.http import HttpResponse
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from rest_framework.views import APIView
from rest_framework import permissions

from employees.models import Employee
from projects_app.models import Project
from attendance.models import Attendance
from leave_app.models import LeaveRequest
from payroll.models import Payslip


def build_pdf(title, headers, rows):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = [Paragraph(title, styles['Title'])]

    data = [headers] + rows
    table = Table(data, repeatRows=1)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f4f6f7')]),
    ]))
    elements.append(table)
    doc.build(elements)
    buffer.seek(0)
    return buffer


def build_excel(title, headers, rows):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = title[:30]
    ws.append(headers)
    for row in rows:
        ws.append(row)
    buffer = BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    return buffer


class BaseReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    report_title = 'Report'
    report_headers = []

    def get_rows(self):
        raise NotImplementedError

    def get(self, request, report_format):
        rows = self.get_rows()
        filename_base = self.report_title.lower().replace(' ', '_')

        if report_format == 'pdf':
            buffer = build_pdf(self.report_title, self.report_headers, rows)
            response = HttpResponse(buffer, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{filename_base}.pdf"'
            return response
        elif report_format == 'excel':
            buffer = build_excel(self.report_title, self.report_headers, rows)
            response = HttpResponse(
                buffer,
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            )
            response['Content-Disposition'] = f'attachment; filename="{filename_base}.xlsx"'
            return response
        return HttpResponse('Invalid format. Use pdf or excel.', status=400)


class EmployeeReportView(BaseReportView):
    report_title = 'Employee Report'
    report_headers = ['Code', 'Name', 'Email', 'Department', 'Designation', 'Active']

    def get_rows(self):
        rows = []
        for e in Employee.objects.select_related('user', 'department', 'designation').all():
            rows.append([
                e.employee_code,
                e.user.get_full_name() or e.user.username,
                e.user.email,
                e.department.name if e.department else '-',
                e.designation.title if e.designation else '-',
                'Yes' if e.is_active else 'No',
            ])
        return rows


class ProjectReportView(BaseReportView):
    report_title = 'Project Report'
    report_headers = ['Name', 'Status', 'Start Date', 'End Date', 'Manager', 'Team Size']

    def get_rows(self):
        rows = []
        for p in Project.objects.select_related('manager__user').all():
            rows.append([
                p.name,
                p.get_status_display(),
                str(p.start_date) if p.start_date else '-',
                str(p.end_date) if p.end_date else '-',
                (p.manager.user.get_full_name() or p.manager.user.username) if p.manager else '-',
                p.assignments.count(),
            ])
        return rows


class ProjectTeamReportView(BaseReportView):
    report_title = 'Project Team Report'
    report_headers = ['Project', 'Employee', 'Employee Code', 'Role']

    def get_rows(self):
        rows = []
        for p in Project.objects.prefetch_related('assignments__employee__user').all():
            for a in p.assignments.all():
                rows.append([
                    p.name,
                    a.employee.user.get_full_name() or a.employee.user.username,
                    a.employee.employee_code,
                    a.role_in_project,
                ])
        return rows


class AttendanceReportView(BaseReportView):
    report_title = 'Attendance Report'
    report_headers = ['Employee', 'Date', 'Check In', 'Check Out', 'Status']

    def get_rows(self):
        rows = []
        for a in Attendance.objects.select_related('employee__user').all():
            rows.append([
                a.employee.user.get_full_name() or a.employee.user.username,
                str(a.date),
                str(a.check_in) if a.check_in else '-',
                str(a.check_out) if a.check_out else '-',
                a.get_status_display(),
            ])
        return rows


class LeaveReportView(BaseReportView):
    report_title = 'Leave Report'
    report_headers = ['Employee', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status']

    def get_rows(self):
        rows = []
        for lr in LeaveRequest.objects.select_related('employee__user', 'leave_type').all():
            rows.append([
                lr.employee.user.get_full_name() or lr.employee.user.username,
                lr.leave_type.name,
                str(lr.start_date),
                str(lr.end_date),
                lr.number_of_days,
                lr.get_status_display(),
            ])
        return rows


class PayrollReportView(BaseReportView):
    report_title = 'Payroll Report'
    report_headers = ['Employee', 'Month', 'Year', 'Basic', 'Allowances', 'Deductions', 'Net Salary']

    def get_rows(self):
        rows = []
        for p in Payslip.objects.select_related('employee__user').all():
            rows.append([
                p.employee.user.get_full_name() or p.employee.user.username,
                p.month,
                p.year,
                str(p.basic_salary),
                str(p.allowances),
                str(p.deductions),
                str(p.net_salary),
            ])
        return rows
