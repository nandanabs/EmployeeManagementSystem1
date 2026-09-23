from datetime import date
from django.db.models import Count
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Attendance
from .serializers import AttendanceSerializer
from employees.models import Employee


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.select_related('employee__user').all()
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee', 'date', 'status']

    @action(detail=False, methods=['post'], url_path='check-in')
    def check_in(self, request):
        employee_id = request.data.get('employee')
        employee = Employee.objects.filter(id=employee_id).first()
        if not employee:
            return Response({'detail': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)

        today = date.today()
        attendance, created = Attendance.objects.get_or_create(
            employee=employee, date=today,
            defaults={'check_in': date.today() and __import__('datetime').datetime.now().time(), 'status': 'PRESENT'},
        )
        if not created:
            return Response({'detail': 'Already checked in today.'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = AttendanceSerializer(attendance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='check-out')
    def check_out(self, request):
        employee_id = request.data.get('employee')
        today = date.today()
        attendance = Attendance.objects.filter(employee_id=employee_id, date=today).first()
        if not attendance:
            return Response({'detail': 'No check-in record found for today.'}, status=status.HTTP_404_NOT_FOUND)
        attendance.check_out = __import__('datetime').datetime.now().time()
        attendance.save()
        serializer = AttendanceSerializer(attendance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='summary')
    def summary(self, request):
        """Overall attendance counts by status, optionally filtered by employee."""
        qs = self.filter_queryset(self.get_queryset())
        counts = qs.values('status').annotate(total=Count('id'))
        return Response(list(counts))
