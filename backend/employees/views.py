from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Department, Designation, Employee
from .serializers import (
    DepartmentSerializer, DesignationSerializer, EmployeeSerializer, EmployeeCreateSerializer,
)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all().order_by('name')
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]


class DesignationViewSet(viewsets.ModelViewSet):
    queryset = Designation.objects.all().order_by('title')
    serializer_class = DesignationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['department']


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.select_related('user', 'department', 'designation').all().order_by('-id')
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['department', 'designation', 'is_active']
    search_fields = ['employee_code', 'user__first_name', 'user__last_name', 'user__email']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return EmployeeCreateSerializer
        return EmployeeSerializer

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Return the Employee record linked to the currently logged-in user."""
        employee = Employee.objects.select_related('user', 'department', 'designation').filter(
            user=request.user
        ).first()
        if not employee:
            return Response({'detail': 'No employee record linked to this user.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)
