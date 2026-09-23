from rest_framework import serializers
from .models import SalaryStructure, Payslip


class SalaryStructureSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    gross_salary = serializers.ReadOnlyField()
    net_salary = serializers.ReadOnlyField()

    class Meta:
        model = SalaryStructure
        fields = [
            'id', 'employee', 'employee_name', 'basic_salary', 'hra',
            'other_allowances', 'deductions', 'gross_salary', 'net_salary',
        ]

    def get_employee_name(self, obj):
        return obj.employee.user.get_full_name() or obj.employee.user.username


class PayslipSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()

    class Meta:
        model = Payslip
        fields = [
            'id', 'employee', 'employee_name', 'month', 'year', 'basic_salary',
            'allowances', 'deductions', 'net_salary', 'generated_on',
        ]
        read_only_fields = ['net_salary', 'generated_on']

    def get_employee_name(self, obj):
        return obj.employee.user.get_full_name() or obj.employee.user.username

    def create(self, validated_data):
        validated_data['net_salary'] = (
            validated_data['basic_salary'] + validated_data.get('allowances', 0)
            - validated_data.get('deductions', 0)
        )
        return super().create(validated_data)
