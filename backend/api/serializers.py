from rest_framework import serializers
from core.models import Team, Employee, ShiftType, ShiftRule, ShiftPlan, ShiftAssignment, Absence

class ShiftRuleSerializer(serializers.ModelSerializer):
    """Serializer for the ShiftRule model."""
    class Meta:
        model = ShiftRule
        fields = '__all__'

class ShiftTypeSerializer(serializers.ModelSerializer):
    """Serializer for the ShiftType model."""
    class Meta:
        model = ShiftType
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
    """Serializer for the Team model."""
    # We can nest ShiftRuleSerializer or just use IDs. Using default ID behavior for now for simplicity in writing,
    # but we might want to expand it if the frontend needs full objects.
    class Meta:
        model = Team
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    """Serializer for the Employee model."""
    class Meta:
        model = Employee
        fields = '__all__'
        # The JSON fields and ManyToMany will be handled automatically by DRF (as dicts and lists of IDs)

class ShiftPlanSerializer(serializers.ModelSerializer):
    """Serializer for the ShiftPlan model."""
    class Meta:
        model = ShiftPlan
        fields = '__all__'

class ShiftAssignmentSerializer(serializers.ModelSerializer):
    """Serializer for the ShiftAssignment model."""
    class Meta:
        model = ShiftAssignment
        fields = '__all__'

class AbsenceSerializer(serializers.ModelSerializer):
    """Serializer for the Absence model."""
    class Meta:
        model = Absence
        fields = '__all__'
