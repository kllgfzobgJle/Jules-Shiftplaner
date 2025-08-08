# Shift Planner – Web Application for Shift Scheduling

Welcome to **Shift Planner**! This repository contains the source code for a web‑based application to plan and manage shift assignments within a department. The goal is to provide a user‑friendly, flexible, and later multi‑tenant service that simplifies and digitizes daily shift scheduling.

The application replaces an older Next.js‑based prototype and now uses a modern architecture with **Django** (backend) and **React** (frontend).

## Feature Overview

The core features are planned as follows (see also `docs/AGENTS.md` for a detailed breakdown):

| Area                              | Key features & requirements                                                                                                                                                 |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Employees**                     | Create, edit, delete, duplicate; store name, initials, work percentage, team assignment, allowed shift types, suitability, availability, and shift rules; CSV import/export |
| **Teams**                         | Manage teams with name, target shift share, and associated shift rules                                                                                                      |
| **Shift Types**                   | Define shift categories with start/end time and weekly demand per weekday                                                                                                   |
| **Learning Year**                 | Default availability and qualified shift types per training year (1–4)                                                                                                      |
| **Shift Rules**                   | Rules for forbidden/required sequences and follow‑up shifts                                                                                                                 |
| **Shift Scheduling**              | Algorithm to automatically assign employees to shifts based on team share, availability, qualification, rules, and workload; create, save, and load plans (4‑week grid)     |
| **Absences**                      | Manage vacation/absence periods per employee                                                                                                                                |
| **Reports**                       | Generate PDF reports and analytics (work hours, utilization, conflicts)                                                                                                     |
| **Import/Export**                 | CSV import/export for employees and full JSON export/import of all data                                                                                                     |
| **Google Integration** (optional) | Sign‑in via Google SSO, event creation in Google Calendar, roles and permissions                                                                                            |

> **Note:** The initial version focuses on core features without authentication. Google integration and the role model will be added in later steps.

## Technical Overview

This project uses a **modern full‑stack approach** and relies on technologies that—according to current sources (as of 2025)—are among the most popular and maintainable:

- **Backend – Python 3.11 & Django 4.x**
  - Django provides a robust base with built‑in ORM, admin interface, and a clear architectural approach.
  - REST API via Django REST Framework (DRF).
  - Data stored locally in SQLite, upgradeable to PostgreSQL later.
- **Frontend – React with TypeScript**
  - Interactive UI using React (e.g., with Vite or Next.js). This enables a clean component structure and easy integration of libraries such as FullCalendar for the calendar view.
  - TypeScript adds type safety and improves maintainability.
- **APIs & Third‑Party**
  - **Google services:** A later integration includes Google OAuth for single sign‑on and the Google Calendar API to create shift events. Separate API keys will be required (not stored in the repository).

## Project Structure

```
Jules-Shiftplaner/
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
    ├── AGENTS.md             # Project requirements and agent configuration
```

## Local Setup (Skeleton)

Because the code is created step‑by‑step with Jules, many files do not exist at the beginning. The following steps provide a rough outline for local setup:

1. **Clone the repository**
   
   ```bash
   git clone <REPOSITORY-URL>
   cd Jules-Shiftplanner
   ```

2. **Set up the backend**
   
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   # Prepare sample database if needed
   python manage.py migrate
   python manage.py runserver
   ```
   
   Here, Django configuration files and apps may still be generated by Jules.

3. **Set up the frontend**
   
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   
   The React components are also created incrementally. `npm run dev` starts a local dev server.

## File Descriptions

- **docs/AGENTS.md** – Contains a detailed description of requirements, technology decisions, data models, and the development process. This file is the central reference for Jules.

## Contributing & Pull Requests

Collaboration with the AI assistant follows structured prompts. When reviewing pull requests (PRs) created by Jules, consider the following points:

1. **Clarity:** Do the PR title and description clearly state the task that was implemented?
2. **Requirements:** Does the code meet the task and the specifications from `AGENTS.md`?
3. **Testability:** Are there unit tests for complex logic? Does the code run locally without errors?
4. **Code Quality:** Is the code well structured, sufficiently commented, and convention‑compliant? Are sensitive data externalized?
5. **Project History:** Do the changes fit logically into the project history without unintentionally overriding existing functionality?



## Roadmap & Outlook

Development is iterative. The current focus is on building data models, API endpoints, and simple user interfaces. Later milestones include:

1. **Calendar View & Drag‑and‑Drop:** Develop an interactive shift planning view for 4‑week grids (e.g., using FullCalendar).
2. **Roles & Permissions:** Implement a user and permission model (admin, department head, team lead, employee) and connect to Google SSO.
3. **Google Calendar Sync:** Automatically create appointments and invitations for shifts in Google Calendar.
4. **Algorithm Optimization:** Fine‑tune the planning algorithm and expand conflict detection (e.g., breaks, legal requirements).
5. **Accessibility & Localization:** Responsive design, mobile support, and optional translations.
