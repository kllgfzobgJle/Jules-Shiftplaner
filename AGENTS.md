# AGENTS.md – Agent Instructions

This file defines the structure, goals, and rules of the "Jules-Shiftplaner" project to guide AI assistants (like Google Jules) during development.

---

## 🧭 Project Purpose

Jules-Shiftplaner is a tool for managing employee shifts. It includes team structure, shift definitions, absences, and eventually automatic planning.

---

## 📦 Implemented Models

| Model         | Purpose |
|---------------|---------|
| Team          | A group or unit to which employees belong |
| Employee      | A person working within a team |
| ShiftType     | A type of shift (e.g. morning, night) |
| Absence       | A timeframe where an employee is unavailable |

---

## 🚧 Planned Models

- `AbsenceType`: Define categories like vacation, sick leave, etc., and if paid
- `PlanningRule`: Business logic for allowed shift patterns and constraints

---

## 🔐 Role Logic (Planned)

| Role             | Rights |
|------------------|--------|
| Admin            | Full control |
| Department Lead  | Manage plans and teams |
| Team Lead        | Edit shifts and absences of team |
| Employee         | View plans, edit drafts |

---

## 📋 Requirements

### AbsenceType

| Field      | Type     | Description |
|------------|----------|-------------|
| name       | string   | Display name (e.g. vacation) |
| is_paid    | boolean  | Whether this type is paid |

Used as a foreign key in the `Absence` model.

---

## 🔁 Conventions

- Every feature goes into a separate branch (`feat/<name>`)
- Document models and API endpoints in this file after each merge
- Jules should receive structured prompts (see `template-prompt.md`)
- Use English in technical prompts, comments, commits
