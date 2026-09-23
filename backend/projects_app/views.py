from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Project, ProjectAssignment
from .serializers import ProjectSerializer, ProjectAssignmentSerializer
from employees.models import Employee


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.select_related('manager').all().order_by('-created_at')
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'is_active']

    @action(detail=True, methods=['get'])
    def team(self, request, pk=None):
        """List all employees assigned to this project."""
        project = self.get_object()
        assignments = project.assignments.select_related('employee__user')
        serializer = ProjectAssignmentSerializer(assignments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        """Assign one or more employees to this project. Body: {employee_ids: [1,2,3], role_in_project: ''}"""
        project = self.get_object()
        employee_ids = request.data.get('employee_ids', [])
        role_in_project = request.data.get('role_in_project', 'Team Member')

        created = []
        for emp_id in employee_ids:
            employee = Employee.objects.filter(id=emp_id).first()
            if not employee:
                continue
            assignment, was_created = ProjectAssignment.objects.get_or_create(
                project=project, employee=employee,
                defaults={'role_in_project': role_in_project},
            )
            created.append(assignment)

        serializer = ProjectAssignmentSerializer(created, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='remove-member')
    def remove_member(self, request, pk=None):
        """Remove an employee from this project. Body: {employee_id: 1}"""
        project = self.get_object()
        employee_id = request.data.get('employee_id')
        ProjectAssignment.objects.filter(project=project, employee_id=employee_id).delete()
        return Response({'detail': 'Employee removed from project.'}, status=status.HTTP_200_OK)


class ProjectAssignmentViewSet(viewsets.ModelViewSet):
    queryset = ProjectAssignment.objects.select_related('project', 'employee__user').all()
    serializer_class = ProjectAssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['project', 'employee']
