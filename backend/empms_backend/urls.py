from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/employees/', include('employees.urls')),
    path('api/projects/', include('projects_app.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/leave/', include('leave_app.urls')),
    path('api/payroll/', include('payroll.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/reports/', include('reports_app.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
