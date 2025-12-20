# Tasks to Address

Based on a review of the current codebase and `AGENTS.md`, the following 20 tasks have been identified to move the project towards its goals.

## Backend Development

1.  **Implement `ShiftRule` Model**: Create a model in `backend/core/models.py` to store shift rules (e.g., forbidden sequences, mandatory follow-ups) as described in `AGENTS.md`.
2.  **Implement `ShiftPlan` Model**: Create a model to group shift assignments for a specific period (e.g., a 4-week plan).
3.  **Implement `ShiftAssignment` Model**: Create a model to link an employee to a shift type on a specific date.
4.  **Implement `Absence` Model**: Create a model to track employee absences (vacation, sickness).
5.  **Update `Employee` Model (Suitability)**: Add a field (e.g., JSONField or related model) to store suitability ratings (0-5) for each shift type.
6.  **Update `Employee` Model (Availability)**: Add a field to store weekly availability (AM/PM per weekday).
7.  **Update `Employee` Model (Allowed Shifts)**: Add a ManyToMany field to link employees to allowed `ShiftType`s.
8.  **Update `Team` Model**: Add a field to associate `ShiftRule`s with a team.
9.  **Create Serializers**: Implement DRF serializers for `ShiftRule`, `ShiftPlan`, `ShiftAssignment`, and `Absence` in `backend/api/serializers.py`.
10. **Create ViewSets**: Implement DRF ViewSets for the new models in `backend/api/views.py`.
11. **Update `EmployeeSerializer`**: Ensure new fields (suitability, availability, etc.) are included in the API response.
12. **Configure CORS**: Install and configure `django-cors-headers` to allow the React frontend (running on a different port) to communicate with the Django backend.
13. **Implement Scheduler Logic**: create `backend/core/scheduler.py` and implement the automatic shift assignment algorithm.
14. **Scheduler Tests**: Write unit tests to verify the scheduler logic (respecting rules, availability, etc.).
15. **API Tests**: Write tests for the new API endpoints to ensure they handle data correctly.

## Frontend Development

16. **Create API Service**: Implement a service layer (e.g., using `axios` or `fetch`) in `frontend/src/services/api.ts` to replace local storage persistence.
17. **Connect Store to Backend**: Update the Zustand store (`frontend/src/store.ts`) to fetch and save data via the backend API.
18. **Implement Missing UI Components**: Create management pages/components for `ShiftRules`, `Absences`, and `ShiftPlans` if not fully implemented.

## Security & Quality

19. **Externalize Secrets**: Move `SECRET_KEY` and `DEBUG` settings in `backend/schichtplaner/settings.py` to environment variables.
20. **Add Docstrings**: Ensure all new and existing backend models, views, and functions have clear docstrings.
