from django.db import models

class ShiftType(models.Model):
    """Represents a type of shift, e.g., early, late, night."""
    name = models.CharField(max_length=50)
    start_time = models.TimeField()
    end_time = models.TimeField()
    monday_required = models.PositiveIntegerField(default=0)
    tuesday_required = models.PositiveIntegerField(default=0)
    wednesday_required = models.PositiveIntegerField(default=0)
    thursday_required = models.PositiveIntegerField(default=0)
    friday_required = models.PositiveIntegerField(default=0)
    saturday_required = models.PositiveIntegerField(default=0)
    sunday_required = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

class ShiftRule(models.Model):
    """Represents a rule for shift planning, e.g., forbidden sequences."""
    class RuleType(models.TextChoices):
        FORBIDDEN_SEQUENCE = 'FORBIDDEN_SEQUENCE', 'Forbidden Sequence'
        REQUIRED_SEQUENCE = 'REQUIRED_SEQUENCE', 'Required Sequence'
        MANDATORY_FOLLOW_UP = 'MANDATORY_FOLLOW_UP', 'Mandatory Follow Up'
        # Add more types as needed

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    rule_type = models.CharField(max_length=50, choices=RuleType.choices)

    # For sequence rules: If you have Shift A, you cannot/must have Shift B next.
    from_shift_type = models.ForeignKey(ShiftType, on_delete=models.CASCADE, related_name='rules_from')
    to_shift_type = models.ForeignKey(ShiftType, on_delete=models.CASCADE, related_name='rules_to')

    is_same_day = models.BooleanField(default=False, help_text="Does this rule apply to shifts on the same day?")

    def __str__(self):
        return self.name

class Team(models.Model):
    """Represents a team of employees."""
    name = models.CharField(max_length=100)
    target_share = models.DecimalField(max_digits=5, decimal_places=2)
    shift_rules = models.ManyToManyField(ShiftRule, blank=True, related_name='teams')

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

    # New fields
    allowed_shift_types = models.ManyToManyField(ShiftType, blank=True, related_name='allowed_employees')

    # Store as JSON: {"<shift_type_id>": <rating 0-5>, ...}
    suitability = models.JSONField(default=dict, blank=True)

    # Store as JSON: {"MONDAY": {"am": "AVAILABLE", "pm": "UNAVAILABLE"}, ...}
    availability = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class ShiftPlan(models.Model):
    """Represents a plan for a specific period."""
    name = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.start_date} - {self.end_date})"

class ShiftAssignment(models.Model):
    """Represents a single shift assignment for an employee."""
    shift_plan = models.ForeignKey(ShiftPlan, on_delete=models.CASCADE, related_name='assignments')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='assignments')
    shift_type = models.ForeignKey(ShiftType, on_delete=models.CASCADE, related_name='assignments')
    date = models.DateField()
    is_locked = models.BooleanField(default=False)

    class Meta:
        unique_together = ('employee', 'date') # Assuming one shift per day per employee for now

    def __str__(self):
        return f"{self.employee} - {self.shift_type} on {self.date}"

class Absence(models.Model):
    """Represents an employee's absence."""
    class AbsenceType(models.TextChoices):
        VACATION = 'VACATION', 'Vacation'
        SICK = 'SICK', 'Sick'
        OTHER = 'OTHER', 'Other'

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='absences')
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField(blank=True)
    absence_type = models.CharField(max_length=20, choices=AbsenceType.choices, default=AbsenceType.OTHER)

    def __str__(self):
        return f"{self.employee} ({self.start_date} - {self.end_date})"
