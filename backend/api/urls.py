from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TeamViewSet, EmployeeViewSet, ShiftTypeViewSet,
    ShiftRuleViewSet, ShiftPlanViewSet, ShiftAssignmentViewSet, AbsenceViewSet
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'teams', TeamViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'shift-types', ShiftTypeViewSet)
router.register(r'shift-rules', ShiftRuleViewSet)
router.register(r'shift-plans', ShiftPlanViewSet)
router.register(r'shift-assignments', ShiftAssignmentViewSet)
router.register(r'absences', AbsenceViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]
