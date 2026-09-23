from django.db import models
from employees.models import Employee


class SalaryStructure(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name='salary_structure')
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    hra = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    other_allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Salary structure - {self.employee}"

    @property
    def gross_salary(self):
        return self.basic_salary + self.hra + self.other_allowances

    @property
    def net_salary(self):
        return self.gross_salary - self.deductions


class Payslip(models.Model):
    MONTH_CHOICES = [(i, i) for i in [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ]]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='payslips')
    month = models.CharField(max_length=20, choices=MONTH_CHOICES)
    year = models.PositiveIntegerField()
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2)
    generated_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('employee', 'month', 'year')
        ordering = ['-year', '-generated_on']

    def __str__(self):
        return f"Payslip {self.employee} - {self.month} {self.year}"
