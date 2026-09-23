from datetime import date
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from employees.models import Employee, Department
from projects_app.models import Project, ProjectAssignment
from attendance.models import Attendance
from leave_app.models import LeaveRequest
from payroll.models import Payslip


class AdminDashboardView(APIView):
    """Aggregated statistics for the admin dashboard."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = date.today()

        total_employees = Employee.objects.filter(is_active=True).count()
        total_projects = Project.objects.count()
        active_projects = Project.objects.filter(status='ACTIVE').count()
        completed_projects = Project.objects.filter(status='COMPLETED').count()
        planning_projects = Project.objects.filter(status='PLANNING').count()
        department_count = Department.objects.count()

        today_attendance = Attendance.objects.filter(date=today)
        attendance_summary = {
            'present': today_attendance.filter(status='PRESENT').count(),
            'absent': today_attendance.filter(status='ABSENT').count(),
            'late': today_attendance.filter(status='LATE').count(),
        }

        pending_leaves = LeaveRequest.objects.filter(status='PENDING').count()

        payroll_summary = {
            'total_payslips_this_year': Payslip.objects.filter(year=today.year).count(),
        }

        return Response({
            'total_employees': total_employees,
            'total_projects': total_projects,
            'active_projects': active_projects,
            'completed_projects': completed_projects,
            'planning_projects': planning_projects,
            'department_count': department_count,
            'attendance_summary': attendance_summary,
            'pending_leave_requests': pending_leaves,
            'payroll_summary': payroll_summary,
        })


class EmployeeDashboardView(APIView):
    """Aggregated data for a single employee's dashboard."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, employee_id):
        today = date.today()
        employee = Employee.objects.select_related('user', 'department', 'designation').filter(id=employee_id).first()
        if not employee:
            return Response({'detail': 'Employee not found.'}, status=404)

        assignments = ProjectAssignment.objects.filter(employee=employee).select_related('project')
        assigned_projects = [
            {
                'id': a.project.id,
                'name': a.project.name,
                'status': a.project.status,
                'role_in_project': a.role_in_project,
            }
            for a in assignments
        ]

        today_attendance = Attendance.objects.filter(employee=employee, date=today).first()

        pending_leaves = LeaveRequest.objects.filter(employee=employee, status='PENDING').count()

        recent_payslip = Payslip.objects.filter(employee=employee).order_by('-year', '-generated_on').first()

        return Response({
            'profile': {
                'full_name': employee.user.get_full_name() or employee.user.username,
                'employee_code': employee.employee_code,
                'department': employee.department.name if employee.department else None,
                'designation': employee.designation.title if employee.designation else None,
            },
            'assigned_projects': assigned_projects,
            'today_attendance': {
                'status': today_attendance.status if today_attendance else 'NOT MARKED',
                'check_in': today_attendance.check_in if today_attendance else None,
                'check_out': today_attendance.check_out if today_attendance else None,
            },
            'pending_leave_requests': pending_leaves,
            'recent_payslip': {
                'month': recent_payslip.month,
                'year': recent_payslip.year,
                'net_salary': recent_payslip.net_salary,
            } if recent_payslip else None,
        })
