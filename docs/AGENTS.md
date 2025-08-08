# Shift Planner Web App – Agent Configuration

This file serves as a **guide for Jules**, Google’s AI‑based coding assistant. It describes the project goal, scope, data models, technologies, and ways of working for the “Shift Planner” project. The information is taken from the previous Next.js implementation and adapted to the current strategic planning.

## 🎯 Project Goal

The primary goal is to develop a user‑friendly web application for **creating, managing, and optimizing shift schedules** for a department. In the long term, the app should be multi‑user capable, store planning‑relevant data centrally, and enable integration with Google services (single sign‑on and calendar integration). In the first phase, development focuses on the core scheduling features **without authentication**, based on the requirements of the existing prototype.

## 🧩 Core Features (derived from the old project)

The following features must be covered by the new software. They reflect the capabilities of the old Next.js prototype and serve as the **minimum requirements** for the first iteration:

1. **Employee Management**
2. **Fields**: First name, last name, initials, type (fully trained or apprentice), training year, work percentage, assigned team, optional personal shift quota override, allowed shift types, suitability rating per shift type (0–5), availability per weekday (AM/PM), assigned shift rules.
3. **Actions**: Create, edit, delete, duplicate, and CSV import/export. When duplicating, availability and shift assignments should be carried over.
4. **Team Management**
5. **Fields**: Name, overall shift share (0–100%), optional team lead (employee ID), associated shift rules.
6. **Actions**: Create, edit, and delete.
7. **Shift Types**
8. **Fields**: Name (e.g., “1. VM”), start and end time (“HH:MM”), weekly demand per weekday (e.g., Monday → 2).
9. **Actions**: Create, edit, and delete.
10. **Training‑Year Qualifications**
11. For each training level (1–4), define allowed shift types and default availability.
12. **Actions**: Edit and retrieve (automatically provide four training years).
13. **Shift Rules**
14. **Types**: “forbidden_sequence”, “required_sequence”, “mandatory_follow_up”, and others.
15. **Fields**: From‑shift type, to‑shift type or list of to‑shift types, optional same‑day flag, name and description.
16. **Actions**: Create, edit, and delete.
17. **Shift Planning & Algorithm**
18. Implement a **planning algorithm** that fills the available shifts with employees for a selected period (default: 4 weeks). It must take into account:
    - **Team shares**: each team has a target share of the total number of shift assignments. Employees may optionally have a personal shift quota override.
    - **Employee availability** (AM/PM per day) and **absences**.
    - **Training‑year qualification** of apprentices (only permitted shift types).
    - **Shift rules** (forbidden or required sequences, follow‑up shifts).
    - **Suitability rating** per shift type (0–5) to prioritize better matches.
    - **Even distribution** of working hours according to work percentage and fair utilization of all employees.
19. The algorithm should output a **list of shift assignments** (employee ID, shift type ID, date, follow‑up flag, lock status) and **statistics** (work hours, shifts, utilization per employee/team). **Conflicts** (e.g., rule violations or unfilled shifts) must be logged.
20. **Shift Plan Management**
21. **Create plan**: choose start and end date; automatically calculate a 4‑week end date; generate assignments via the algorithm.
22. **Save/Load plan**: shift plans should be saved under a name and retrievable later. A plan contains the period, assignments, and an optional label. Multiple plans should be able to exist in parallel.
23. **Share plan**: shift plans can be saved as public or private. **Public** plans are visible and readable to everyone; they can only be deleted by the creator or an admin. **Private** plans are visible only to the creator.
24. **Delete/Update plan**: plans can be deleted or overwritten (creator/admin only).
25. **Absences**
26. **Fields**: employee, start date, end date, reason (optional).
27. **Actions**: create, edit, and delete.
28. **Analytics & Reports**
29. Compute utilization and work hours per employee/team and provide an overview of number of assignments, conflicts, etc.
30. Generate **PDF reports** with tables and key figures (similar to the old ReportGenerator).
31. **Import/Export**
32. **CSV import/export** for employee data.
33. **JSON export/import** of **all** project data (employees, teams, shift types, qualifications, rules, plans, absences).
34. **Google Integration (future phase)**
35. **Google Calendar**: choose a main calendar and create shift assignments as events; send invitations to assigned employees (email guests); support 4‑week recurrences.
36. **Google SSO**: sign‑in via Google account for role‑based access control (admin, department head, team lead, employee). Until authentication is implemented, all features remain available without login.

## 🛠️ Technology Decisions

After researching up‑to‑date web frameworks and best practices (e.g., common usage, community support, learning curve, and extensibility), the following technology is proposed:

- **Backend: Python 3.11 with Django 4.x**  
  Django is an established high‑level framework (“batteries‑included”) with a built‑in admin UI, ORM, and mature documentation. It’s well‑suited for data models with relational relationships (employees, teams, shifts, etc.) and offers a low barrier to entry for beginners.
  
  - **Django REST Framework (DRF)** is used for API endpoints to keep backend and frontend cleanly separated and to facilitate later integration with a React or mobile app.
  - **SQLite** is the default database for local development; it can be replaced by **PostgreSQL** later.
  - **Google OAuth and Calendar API** can be integrated via existing Python libraries (e.g., `google-auth`, `google-api-python-client`).

- **Frontend: React (18+) with TypeScript**  
  For interactive shift planning, a React application (e.g., with **Vite** or **Next.js**) is proposed, as drag‑and‑drop functionality and dynamic data updates are easier to implement than with classic server‑rendered templates.
  
  - React has a large community, many UI libraries (e.g., **Material UI**, **FullCalendar**), and integrates well with a DRF backend.
  - For the first iteration, the UI can remain minimal (forms and tables). More complex components like calendar grids or charts can be added step by step.

This choice is based on current rankings and practice reports: as of 2025, **Django** and **React** are among the most popular and sustainably supported frameworks for web applications. They combine high productivity, good documentation, and a large developer community, which is particularly advantageous for beginners and AI‑assisted development.

## 📁 Project Structure (Proposal)

```
ules-Shiftplanner/
├── backend/                 # Django project (manage.py, settings, apps)
│   ├── core/                # Data models & business logic
│   ├── api/                 # DRF REST endpoints
│   ├── requirements.txt     # Python dependencies
│   └── ...
├── frontend/                # React application (Vite/Next.js)
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Pages (if Next.js)
│   │   └── ...
│   ├── package.json         # NPM dependencies
│   └── ...
└── docs/
    ├── AGENTS.md            # Project requirements and agent configuration
```

## 🔍 Development Workflow with Jules

To build the project step by step, Jules should always work on **small, clearly bounded tasks**. A typical workflow looks like this:

1. **Planning**: Define the data models (Django models) with Jules (e.g., `Employee`, `Team`, `ShiftType`, `ShiftRule`, `ShiftPlan`, `Absence`). Then generate the corresponding migrations.
2. **REST API**: Create DRF serializers and viewsets for CRUD operations of the models. Define sensible endpoints (e.g., `/api/employees/`, `/api/teams/`, `/api/shift-plans/`).
3. **Business Logic**: Implement the planning algorithm in Python. Use the old `shiftScheduler.ts` as guidance and follow the requirements above. Write unit tests to validate the logic.
4. **Frontend**: Build a React UI that uses the API. Start with simple forms/tables for employees, teams, and shift types. In later steps, Jules can integrate a calendar grid (e.g., **FullCalendar**).
5. **Reports & Exports**: Implement a PDF report function (e.g., with **jspdf** in the frontend or Python libraries in the backend) and CSV import/export in the backend.
6. **Google Integration** *(optional)*: Add OAuth authentication and Google Calendar sync following the provided requirements. Use environment variables for secrets.
7. **Roles & Permissions**: Implement a role model (admin, department head, team lead, employee) using Django permissions. Enable only after core features are complete.

## ✅ Best Practices

- **Small steps**: Split complex tasks into small stories. For example, first create only the `Employee` model; then the API; then the UI.
- **Documentation**: Each newly generated file should include a brief comment explaining its purpose and functionality. Use Python docstrings.
- **Tests**: Use Django and DRF test cases to verify business rules (e.g., availability, team shares, shift rules). Automated tests simplify later refactoring.
- **Readability**: Follow **PEP 8** (Python) and common React conventions. Use clear names for functions and variables.
- **Environment variables**: API keys and sensitive data must not be committed to source control. Use `.env` files for development.
- **Controlled merging**: Review Jules’ pull requests carefully (see `README.md`). Ensure each change maps to a specific task from the template.
