from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Department, Designation, Employee

User = get_user_model()


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'description']


class DesignationSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Designation
        fields = ['id', 'title', 'department', 'department_name']


class EmployeeSerializer(serializers.ModelSerializer):
    """Used for listing/detail. Includes readable names for FKs."""
    full_name = serializers.SerializerMethodField()
    email = serializers.EmailField(source='user.email', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    designation_title = serializers.CharField(source='designation.title', read_only=True)

    class Meta:
        model = Employee
        fields = [
            'id', 'employee_code', 'full_name', 'email', 'phone', 'address',
            'department', 'department_name', 'designation', 'designation_title',
            'date_of_joining', 'is_active',
        ]

    def get_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class EmployeeCreateSerializer(serializers.ModelSerializer):
    """Used to create an Employee together with its User account."""
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = Employee
        fields = [
            'id', 'employee_code', 'department', 'designation', 'phone', 'address',
            'date_of_joining', 'is_active', 'username', 'email', 'first_name',
            'last_name', 'password',
        ]

    def create(self, validated_data):
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name', '')
        password = validated_data.pop('password')

        user = User.objects.create(
            username=username, email=email, first_name=first_name,
            last_name=last_name, role='EMPLOYEE',
        )
        user.set_password(password)
        user.save()

        employee = Employee.objects.create(user=user, **validated_data)
        return employee

    def update(self, instance, validated_data):
        # user related fields are optional on update
        user = instance.user
        user.email = validated_data.pop('email', user.email)
        user.first_name = validated_data.pop('first_name', user.first_name)
        user.last_name = validated_data.pop('last_name', user.last_name)
        password = validated_data.pop('password', None)
        if password:
            user.set_password(password)
        validated_data.pop('username', None)
        user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
