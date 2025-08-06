from rest_framework import viewsets
from core.models import Team, Employee, ShiftType
from .serializers import TeamSerializer, EmployeeSerializer, ShiftTypeSerializer

class TeamViewSet(viewsets.ModelViewSet):
    """API endpoint that allows teams to be viewed or edited."""
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    """API endpoint that allows employees to be viewed or edited."""
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class ShiftTypeViewSet(viewsets.ModelViewSet):
    """API endpoint that allows shift types to be viewed or edited."""
    queryset = ShiftType.objects.all()
    serializer_class = ShiftTypeSerializer
