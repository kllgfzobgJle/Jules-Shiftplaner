from django.db import models

class Team(models.Model):
    """Represents a team of employees."""
    name = models.CharField(max_length=100)
    target_share = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.name

class Employee(models.Model):
    """Represents an employee."""
    class EmployeeType(models.TextChoices):
        FULL = 'FULL', 'Full'
        APPRENTICE = 'APPRENTICE', 'Apprentice'

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    abbreviation = models.CharField(max_length=10)
    employee_type = models.CharField(
        max_length=20,
        choices=EmployeeType.choices,
    )
    apprenticeship_year = models.IntegerField(null=True, blank=True)
    workload_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='employees')
    personal_shift_quota = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
