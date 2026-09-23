from rest_framework import serializers
from .models import LeaveType, LeaveRequest


class LeaveTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveType
        fields = ['id', 'name', 'max_days_per_year']


class LeaveRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    leave_type_name = serializers.CharField(source='leave_type.name', read_only=True)
    number_of_days = serializers.ReadOnlyField()

    class Meta:
        model = LeaveRequest
        fields = [
            'id', 'employee', 'employee_name', 'leave_type', 'leave_type_name',
            'start_date', 'end_date', 'reason', 'status', 'applied_on', 'number_of_days',
        ]
        read_only_fields = ['status', 'applied_on']

    def get_employee_name(self, obj):
        return obj.employee.user.get_full_name() or obj.employee.user.username
