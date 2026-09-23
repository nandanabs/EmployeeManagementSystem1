from rest_framework import serializers
from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    employee_code = serializers.CharField(source='employee.employee_code', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'employee', 'employee_name', 'employee_code', 'date', 'check_in', 'check_out', 'status']

    def get_employee_name(self, obj):
        return obj.employee.user.get_full_name() or obj.employee.user.username
