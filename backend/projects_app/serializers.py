from rest_framework import serializers
from .models import Project, ProjectAssignment


class ProjectSerializer(serializers.ModelSerializer):
    manager_name = serializers.SerializerMethodField()
    team_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'status', 'start_date', 'end_date',
            'manager', 'manager_name', 'is_active', 'created_at', 'team_count',
        ]

    def get_manager_name(self, obj):
        if obj.manager:
            return obj.manager.user.get_full_name() or obj.manager.user.username
        return None

    def get_team_count(self, obj):
        return obj.assignments.count()


class ProjectAssignmentSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    employee_code = serializers.CharField(source='employee.employee_code', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)

    class Meta:
        model = ProjectAssignment
        fields = [
            'id', 'project', 'project_name', 'employee', 'employee_name',
            'employee_code', 'role_in_project', 'assigned_date',
        ]

    def get_employee_name(self, obj):
        return obj.employee.user.get_full_name() or obj.employee.user.username
