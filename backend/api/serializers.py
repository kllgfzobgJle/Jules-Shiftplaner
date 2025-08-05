from rest_framework import serializers
from core.models import Team, Employee

class TeamSerializer(serializers.ModelSerializer):
    """Serializer for the Team model."""
    class Meta:
        model = Team
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    """Serializer for the Employee model."""
    class Meta:
        model = Employee
        fields = '__all__'
