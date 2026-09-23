from django.db import models
from employees.models import Employee


class Project(models.Model):
    STATUS_CHOICES = (
        ('PLANNING', 'Planning'),
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
    )
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PLANNING')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    manager = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_projects')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class ProjectAssignment(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='assignments')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='project_assignments')
    role_in_project = models.CharField(max_length=100, blank=True, default='Team Member')
    assigned_date = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('project', 'employee')

    def __str__(self):
        return f"{self.employee} -> {self.project}"
