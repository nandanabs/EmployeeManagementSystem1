from django.db.models import Sum
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import LeaveType, LeaveRequest
from .serializers import LeaveTypeSerializer, LeaveRequestSerializer


class LeaveTypeViewSet(viewsets.ModelViewSet):
    queryset = LeaveType.objects.all()
    serializer_class = LeaveTypeSerializer
    permission_classes = [permissions.IsAuthenticated]


class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.select_related('employee__user', 'leave_type').all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee', 'status', 'leave_type']

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        leave = self.get_object()
        leave.status = 'APPROVED'
        leave.save()
        return Response(LeaveRequestSerializer(leave).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        leave = self.get_object()
        leave.status = 'REJECTED'
        leave.save()
        return Response(LeaveRequestSerializer(leave).data)

    @action(detail=False, methods=['get'], url_path='balance/(?P<employee_id>[^/.]+)')
    def balance(self, request, employee_id=None):
        """Return remaining leave balance per leave type for one employee."""
        result = []
        for leave_type in LeaveType.objects.all():
            used = LeaveRequest.objects.filter(
                employee_id=employee_id, leave_type=leave_type, status='APPROVED',
            )
            used_days = sum(lr.number_of_days for lr in used)
            result.append({
                'leave_type': leave_type.name,
                'max_days': leave_type.max_days_per_year,
                'used_days': used_days,
                'remaining_days': max(leave_type.max_days_per_year - used_days, 0),
            })
        return Response(result)
