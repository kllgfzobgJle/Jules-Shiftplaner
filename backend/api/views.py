from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from core.models import Team, Employee, ShiftType, ShiftRule, ShiftPlan, ShiftAssignment, Absence
from core.scheduler import Scheduler
from .serializers import (
    TeamSerializer, EmployeeSerializer, ShiftTypeSerializer,
    ShiftRuleSerializer, ShiftPlanSerializer, ShiftAssignmentSerializer, AbsenceSerializer
)

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

class ShiftRuleViewSet(viewsets.ModelViewSet):
    """API endpoint that allows shift rules to be viewed or edited."""
    queryset = ShiftRule.objects.all()
    serializer_class = ShiftRuleSerializer

class ShiftPlanViewSet(viewsets.ModelViewSet):
    """API endpoint that allows shift plans to be viewed or edited."""
    queryset = ShiftPlan.objects.all()
    serializer_class = ShiftPlanSerializer

    @action(detail=True, methods=['post'])
    def auto_schedule(self, request, pk=None):
        """Runs the automatic scheduler for the given plan."""
        plan = self.get_object()
        try:
            scheduler = Scheduler(plan.id)
            scheduler.run()
            return Response({'status': 'success', 'message': 'Auto-schedule completed.'})
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ShiftAssignmentViewSet(viewsets.ModelViewSet):
    """API endpoint that allows shift assignments to be viewed or edited."""
    queryset = ShiftAssignment.objects.all()
    serializer_class = ShiftAssignmentSerializer

class AbsenceViewSet(viewsets.ModelViewSet):
    """API endpoint that allows absences to be viewed or edited."""
    queryset = Absence.objects.all()
    serializer_class = AbsenceSerializer
