from datetime import date
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from employees.models import Department, Designation, Employee
from projects_app.models import Project, ProjectAssignment
from leave_app.models import LeaveType
from payroll.models import SalaryStructure

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds the database with a demo admin user and sample HR data.'

    def handle(self, *args, **options):
        # 1. Admin user
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin12345', role='ADMIN')
            self.stdout.write(self.style.SUCCESS('Created admin user (admin / admin12345)'))

        # 2. Departments & designations
        engineering, _ = Department.objects.get_or_create(name='Engineering', defaults={'description': 'Product engineering team'})
        hr, _ = Department.objects.get_or_create(name='Human Resources', defaults={'description': 'People operations'})

        swe, _ = Designation.objects.get_or_create(title='Software Engineer', department=engineering)
        hr_exec, _ = Designation.objects.get_or_create(title='HR Executive', department=hr)

        # 3. Leave types
        LeaveType.objects.get_or_create(name='Casual Leave', defaults={'max_days_per_year': 12})
        LeaveType.objects.get_or_create(name='Sick Leave', defaults={'max_days_per_year': 10})
        LeaveType.objects.get_or_create(name='Earned Leave', defaults={'max_days_per_year': 15})

        # 4. Sample employee (with login user)
        if not User.objects.filter(username='jdoe').exists():
            emp_user = User.objects.create(
                username='jdoe', email='jdoe@example.com',
                first_name='John', last_name='Doe', role='EMPLOYEE',
            )
            emp_user.set_password('employee123')
            emp_user.save()

            employee = Employee.objects.create(
                user=emp_user, employee_code='EMP001', department=engineering,
                designation=swe, phone='9876543210', date_of_joining=date(2024, 1, 15),
            )
            SalaryStructure.objects.get_or_create(
                employee=employee,
                defaults={'basic_salary': 40000, 'hra': 8000, 'other_allowances': 3000, 'deductions': 2000},
            )
            self.stdout.write(self.style.SUCCESS('Created demo employee (jdoe / employee123)'))

            # 5. Sample project + assignment
            project, _ = Project.objects.get_or_create(
                name='EMS Rebuild',
                defaults={
                    'description': 'Rebuild the internal employee management system.',
                    'status': 'ACTIVE',
                    'start_date': date(2026, 1, 1),
                    'manager': employee,
                },
            )
            ProjectAssignment.objects.get_or_create(project=project, employee=employee, defaults={'role_in_project': 'Lead Developer'})

        self.stdout.write(self.style.SUCCESS('Demo data seeding complete.'))
