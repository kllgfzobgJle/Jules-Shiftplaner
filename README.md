# Jules-Shiftplaner

Jules-Shiftplaner is a web application that helps schedule and manage shifts for teams. It supports team assignments, employee data, shift types, rules, and future integration with Google services.

## 🧩 Features (Planned & Implemented)

| Feature                     | Status       | Description |
|-----------------------------|--------------|-------------|
| Employee Management         | ✅ Done       | Add/edit/delete employees and assign them to teams |
| Team Management             | ✅ Done       | Create and organize teams |
| Shift Types                 | ✅ Done       | Define shift types (e.g. early, late, night) |
| Apprenticeship Year Support| 🚧 Planned    | Restrict shift types based on training year |
| Shift Rules                 | 🚧 Planned    | Define rules like allowed shift sequences, durations, rest time |
| Absences                   | ✅ Done       | Register employee absences with reasons and timeframes |
| Absence Types              | 🚧 Planned    | Define if absence is paid/unpaid and group types |
| Shift Planning Engine       | 🚧 Planned    | Automatically assign shifts based on rules and quotas |
| Public/Private Planning     | 🚧 Planned    | Public plans (visible to team) vs personal drafts |
| Reporting & Stats           | 🚧 Planned    | Overview of planned shifts, totals per employee/team |
| Import/Export               | 🚧 Planned    | Data import/export functions |
| Google Suite Integration    | 🚧 Planned    | Google SSO & calendar sync |

## 📦 Technologies

- Backend: Django + Django REST Framework
- Frontend: Planned (likely React or similar)
- Database: SQLite for development
- API: REST
- Auth: Currently disabled (to simplify early development)

## 🔧 Project Structure

```
backend/
  └── core/        # Data models
  └── api/         # Serializers, views, routers
  └── manage.py    # Django entrypoint
```

## 📄 Documentation

- Main system behavior and requirements: [`AGENTS.md`](./AGENTS.md)
- Prompt structure for Jules: [`docs/template-prompt.md`](./docs/template-prompt.md)
