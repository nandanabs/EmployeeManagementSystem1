from django.db import models
from employees.models import Employee


class LeaveType(models.Model):
    name = models.CharField(max_length=50, unique=True)
    max_days_per_year = models.PositiveIntegerField(default=12)

    def __str__(self):
        return self.name


class LeaveRequest(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leave_requests')
    leave_type = models.ForeignKey(LeaveType, on_delete=models.CASCADE, related_name='requests')
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    applied_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-applied_on']

    def __str__(self):
        return f"{self.employee} - {self.leave_type} ({self.status})"

    @property
    def number_of_days(self):
        return (self.end_date - self.start_date).days + 1
