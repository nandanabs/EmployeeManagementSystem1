from django.urls import path
from .views import (
    EmployeeReportView, ProjectReportView, ProjectTeamReportView,
    AttendanceReportView, LeaveReportView, PayrollReportView,
)

urlpatterns = [
    path('employees/<str:report_format>/', EmployeeReportView.as_view(), name='employee-report'),
    path('projects/<str:report_format>/', ProjectReportView.as_view(), name='project-report'),
    path('project-team/<str:report_format>/', ProjectTeamReportView.as_view(), name='project-team-report'),
    path('attendance/<str:report_format>/', AttendanceReportView.as_view(), name='attendance-report'),
    path('leave/<str:report_format>/', LeaveReportView.as_view(), name='leave-report'),
    path('payroll/<str:report_format>/', PayrollReportView.as_view(), name='payroll-report'),
]
