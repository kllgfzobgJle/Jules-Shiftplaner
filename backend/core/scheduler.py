from datetime import timedelta, date, datetime
from django.db import transaction
from .models import ShiftPlan, ShiftAssignment, Employee, ShiftType, ShiftRule, Absence

class Scheduler:
    """
    Automatic shift assignment algorithm.
    """
    def __init__(self, plan_id):
        self.plan = ShiftPlan.objects.get(id=plan_id)
        self.employees = list(Employee.objects.all())
        self.shift_types = list(ShiftType.objects.all())
        self.rules = list(ShiftRule.objects.all())
        self.absences = list(Absence.objects.filter(
            start_date__lte=self.plan.end_date,
            end_date__gte=self.plan.start_date
        ))

    def run(self):
        """
        Executes the scheduling algorithm.
        This uses a greedy approach enhanced with fairness scoring.
        """
        current_date = self.plan.start_date

        with transaction.atomic():
            # Only delete unlocked assignments
            self.plan.assignments.filter(is_locked=False).delete()

            # Re-fetch assignments that are locked to consider them in workload
            self.locked_assignments = list(self.plan.assignments.filter(is_locked=True))

            while current_date <= self.plan.end_date:
                self.schedule_day(current_date)
                current_date += timedelta(days=1)

    def schedule_day(self, date_obj):
        """Schedules shifts for a specific day."""
        weekday_map = {
            0: 'monday_required',
            1: 'tuesday_required',
            2: 'wednesday_required',
            3: 'thursday_required',
            4: 'friday_required',
            5: 'saturday_required',
            6: 'sunday_required',
        }
        weekday_field = weekday_map[date_obj.weekday()]

        for shift_type in self.shift_types:
            required_count = getattr(shift_type, weekday_field)

            # Check how many are already locked for this day/type
            current_assignments = ShiftAssignment.objects.filter(
                shift_plan=self.plan,
                date=date_obj,
                shift_type=shift_type
            ).count()

            needed = required_count - current_assignments

            if needed <= 0:
                continue

            available_employees = self.get_available_employees(date_obj, shift_type)

            # Sort by fairness score (combination of workload and suitability)
            # Lower score = better candidate to pick (e.g. fewer hours)
            available_employees.sort(key=lambda e: self.calculate_fairness_score(e, shift_type))

            for employee in available_employees:
                if needed <= 0:
                    break

                self.assign_shift(employee, shift_type, date_obj)
                needed -= 1

    def get_available_employees(self, date_obj, shift_type):
        """Returns a list of employees who can work this shift."""
        candidates = []
        for emp in self.employees:
            if self.is_available(emp, date_obj, shift_type):
                candidates.append(emp)
        return candidates

    def is_available(self, employee, date_obj, shift_type):
        """Checks if an employee is available for a shift."""

        # 1. Check absences
        for absence in self.absences:
            if absence.employee_id == employee.id:
                if absence.start_date <= date_obj <= absence.end_date:
                    return False

        # 2. Check if already assigned today (simple logic: 1 shift per day)
        if ShiftAssignment.objects.filter(employee=employee, date=date_obj).exists():
            return False

        # 3. Check allowed shift types
        if not employee.allowed_shift_types.filter(id=shift_type.id).exists():
            if employee.allowed_shift_types.exists():
                return False

        # 4. Check Shift Rules
        yesterday = date_obj - timedelta(days=1)
        prev_assignment = ShiftAssignment.objects.filter(employee=employee, date=yesterday).first()

        if prev_assignment:
            forbidden_rules = [r for r in self.rules if r.rule_type == 'FORBIDDEN_SEQUENCE']
            for rule in forbidden_rules:
                if rule.from_shift_type_id == prev_assignment.shift_type_id and rule.to_shift_type_id == shift_type.id:
                    return False

        return True

    def assign_shift(self, employee, shift_type, date_obj):
        """Creates an assignment."""
        ShiftAssignment.objects.create(
            shift_plan=self.plan,
            employee=employee,
            shift_type=shift_type,
            date=date_obj
        )

    def calculate_fairness_score(self, employee, shift_type):
        """
        Calculates a score for sorting candidates.
        Primary factor: Workload relative to target percentage.
        Secondary factor: Suitability (preference) - Inverted so lower is better for sorting.
        """
        # 1. Calculate workload ratio (Actual Shifts / Target Share of Total)
        # Note: This is simplified.
        current_shifts = ShiftAssignment.objects.filter(
            shift_plan=self.plan,
            employee=employee
        ).count()

        # Avoid division by zero
        target = float(employee.workload_percentage) if employee.workload_percentage > 0 else 1.0
        workload_score = (current_shifts * 100) / target

        # 2. Suitability bonus (0-5, where 5 is best)
        # We want higher suitability to LOWER the score (so they get picked first)
        # Suitability is stored as JSON {"<id>": rating}
        suitability = employee.suitability.get(str(shift_type.id), 0)

        # Heuristic: A suitability point is worth "reducing" the workload score slightly
        # to prefer them even if they have slightly more work.
        suitability_deduction = suitability * 5

        return workload_score - suitability_deduction
