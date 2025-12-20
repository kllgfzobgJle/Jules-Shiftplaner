from django.test import TestCase
from datetime import date, timedelta
from core.models import Employee, Team, ShiftType, ShiftPlan, ShiftAssignment, ShiftRule, Absence
from core.scheduler import Scheduler

class SchedulerTestCase(TestCase):
    def setUp(self):
        # Create Basic Data
        self.team = Team.objects.create(name="Alpha", target_share=100)
        self.shift_type = ShiftType.objects.create(
            name="Early",
            start_time="06:00",
            end_time="14:00",
            monday_required=1,
            tuesday_required=1,
            wednesday_required=1,
            thursday_required=1,
            friday_required=1,
            saturday_required=0,
            sunday_required=0
        )
        self.employee1 = Employee.objects.create(
            first_name="John",
            last_name="Doe",
            abbreviation="JD",
            employee_type="FULL",
            workload_percentage=100,
            team=self.team
        )
        self.employee1.allowed_shift_types.add(self.shift_type)

        self.plan = ShiftPlan.objects.create(
            name="Test Plan",
            start_date=date(2025, 1, 1), # Wednesday
            end_date=date(2025, 1, 7)    # Tuesday
        )

    def test_basic_assignment(self):
        """Test that the scheduler assigns a shift when needed and employee is available."""
        scheduler = Scheduler(self.plan.id)
        scheduler.run()

        # Jan 1st is Wednesday, required=1. Employee1 is available.
        assignment = ShiftAssignment.objects.filter(
            shift_plan=self.plan,
            date=date(2025, 1, 1),
            employee=self.employee1
        ).first()

        self.assertIsNotNone(assignment)
        self.assertEqual(assignment.shift_type, self.shift_type)

    def test_absence_exclusion(self):
        """Test that an absent employee is not assigned."""
        Absence.objects.create(
            employee=self.employee1,
            start_date=date(2025, 1, 1),
            end_date=date(2025, 1, 1),
            reason="Sick"
        )

        scheduler = Scheduler(self.plan.id)
        scheduler.run()

        assignment = ShiftAssignment.objects.filter(
            shift_plan=self.plan,
            date=date(2025, 1, 1),
            employee=self.employee1
        ).first()

        self.assertIsNone(assignment)

    def test_forbidden_sequence(self):
        """Test that forbidden sequences are respected."""
        # Create a Late shift
        late_shift = ShiftType.objects.create(
            name="Late",
            start_time="14:00",
            end_time="22:00",
            monday_required=1,
            tuesday_required=1,
            wednesday_required=1,
            thursday_required=1,
            friday_required=1
        )
        self.employee1.allowed_shift_types.add(late_shift)

        # Rule: Early -> Late is forbidden (just as an example, usually Late -> Early is bad)
        # Let's say Jan 1 (Wed) assigned Early. Jan 2 (Thu) cannot be Late.

        ShiftRule.objects.create(
            name="No Early then Late",
            rule_type="FORBIDDEN_SEQUENCE",
            from_shift_type=self.shift_type,
            to_shift_type=late_shift
        )

        # Manually assign Jan 1 to Early to force the condition
        # (Scheduler usually wipes assignments, but let's see if we can trick it or simpler:
        # Just run scheduler and see if it avoids the sequence if it picks Early first)

        # To test deterministically, we can subclass or mock.
        # Or simpler: Create a scenario where only this employee is available,
        # and see if it fails to assign the second day.

        # We need to ensure the scheduler picks Early for Jan 1.
        # Since it's the only shift required on Wed (from setUp), it should.
        # Now for Thu, let's require Late only.
        self.shift_type.thursday_required = 0
        self.shift_type.save()

        late_shift.thursday_required = 1
        late_shift.save()

        scheduler = Scheduler(self.plan.id)
        scheduler.run()

        assignment1 = ShiftAssignment.objects.filter(date=date(2025, 1, 1), employee=self.employee1).first()
        assignment2 = ShiftAssignment.objects.filter(date=date(2025, 1, 2), employee=self.employee1).first()

        self.assertIsNotNone(assignment1)
        self.assertEqual(assignment1.shift_type, self.shift_type) # Early

        # Should be None because Early -> Late is forbidden
        self.assertIsNone(assignment2)

