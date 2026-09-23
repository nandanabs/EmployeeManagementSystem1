from django.urls import path
from .views import AdminDashboardView, EmployeeDashboardView

urlpatterns = [
    path('admin/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('employee/<int:employee_id>/', EmployeeDashboardView.as_view(), name='employee-dashboard'),
]
