from rest_framework import serializers
from core.models import Team, Employee, ShiftType

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

class ShiftTypeSerializer(serializers.ModelSerializer):
    """Serializer for the ShiftType model."""
    class Meta:
        model = ShiftType
        fields = '__all__'
