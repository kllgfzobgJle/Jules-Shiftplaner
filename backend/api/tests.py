from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User
from core.models import Employee, Team, ShiftType, ShiftRule

class APITestCase(APITestCase):
    def setUp(self):
        # Create a user for authentication
        self.user = User.objects.create_user(username='testuser', password='password')
        # Authenticate all requests for this test case
        self.client.force_authenticate(user=self.user)

        self.team = Team.objects.create(name="Alpha", target_share=100)
        self.shift_type = ShiftType.objects.create(
            name="Early",
            start_time="06:00",
            end_time="14:00"
        )
        self.employee = Employee.objects.create(
            first_name="John",
            last_name="Doe",
            abbreviation="JD",
            employee_type="FULL",
            workload_percentage=100,
            team=self.team
        )

    def test_get_employees(self):
        """Test retrieving list of employees."""
        url = reverse('employee-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['first_name'], 'John')

    def test_create_employee(self):
        """Test creating a new employee."""
        url = reverse('employee-list')
        data = {
            "first_name": "Jane",
            "last_name": "Smith",
            "abbreviation": "JS",
            "employee_type": "FULL",
            "workload_percentage": 100,
            "team": self.team.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Employee.objects.count(), 2)

    def test_create_shift_rule(self):
        """Test creating a shift rule."""
        url = reverse('shiftrule-list')
        data = {
            "name": "No Early-Late",
            "rule_type": "FORBIDDEN_SEQUENCE",
            "from_shift_type": self.shift_type.id,
            "to_shift_type": self.shift_type.id, # Assigning same type just for test simplicity
            "is_same_day": False
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ShiftRule.objects.count(), 1)
