from datetime import timedelta, date
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
        This is a basic greedy implementation for the initial version.
        """
        current_date = self.plan.start_date

        with transaction.atomic():
            # Clear existing assignments for this plan to allow re-runs
            self.plan.assignments.all().delete()

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
            assigned_count = 0

            # Simple greedy: try to find an available employee for each required slot
            # In a real algo, we would sort employees by "fairness" or utilization
            available_employees = self.get_available_employees(date_obj, shift_type)

            # Sort by workload (lowest first) to distribute evenly
            available_employees.sort(key=lambda e: self.calculate_current_workload(e))

            for employee in available_employees:
                if assigned_count >= required_count:
                    break

                self.assign_shift(employee, shift_type, date_obj)
                assigned_count += 1

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
        # Note: In a real run, we might need to check the in-memory assignments created during this run.
        # Since we commit at the end, we can query the DB if we save as we go, or keep a local set.
        # For this implementation, we will save assignments to DB immediately inside the transaction,
        # so we can query them.
        if ShiftAssignment.objects.filter(employee=employee, date=date_obj).exists():
            return False

        # 3. Check allowed shift types
        # This requires fetching ManyToMany. Optimally we prefetch.
        if not employee.allowed_shift_types.filter(id=shift_type.id).exists():
            # If no allowed types are set, assume all are allowed? Or none?
            # Usually strict: if list is not empty, must be in it.
            # If empty, maybe allowed? Let's assume strict if populated.
            if employee.allowed_shift_types.exists():
                return False

        # 4. Check Shift Rules (simplified)
        # e.g., Forbidden Sequence: specific previous shift yesterday -> cannot do this one today.
        yesterday = date_obj - timedelta(days=1)
        prev_assignment = ShiftAssignment.objects.filter(employee=employee, date=yesterday).first()

        if prev_assignment:
            # Check forbidden sequences
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

    def calculate_current_workload(self, employee):
        """Calculates current workload for fair distribution logic."""
        # In a real app, this would sum hours. Here we just count shifts in this plan so far.
        return ShiftAssignment.objects.filter(
            shift_plan=self.plan,
            employee=employee
        ).count()
