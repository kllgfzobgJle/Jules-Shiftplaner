# Roadmap for Codex Shift Planner

This document outlines the development roadmap for the new shift planner application.

## Phase 1: Core Scheduler Logic (Test-Driven Development)

This phase focuses on building the brain of the application, the automatic scheduling algorithm. Each feature will be validated with unit tests.

-   [x] **Basic Assignment:** Assign available and qualified employees to required shifts.
-   [x] **Core Constraints:**
    -   [x] Respect employee absences.
    -   [x] Respect employee qualifications.
-   [x] **Simple Workload Balancing:** Prioritize employees with fewer assigned hours.
-   [ ] **Advanced Rule Engine:**
    -   [ ] Implement handling for forbidden shift sequences (e.g., no late shift followed by an early shift).
    -   [ ] Implement handling for mandatory follow-up shifts.
-   [ ] **Team-based Balancing:**
    -   [ ] Implement logic to consider the `targetLoadPercentage` of teams.
    -   [ ] Ensure fair shift distribution among teams according to their target load.
-   [ ] **Apprentice-specific Logic:**
    -   [ ] Handle specific qualifications and availability for apprentices based on their year.
    -   [ ] Implement rotation or fair distribution among apprentices.

## Phase 2: User Interface Implementation

This phase is currently **blocked** due to issues with the development server environment. Once the environment is stable, the following components will be built.

-   [ ] **Setup & Navigation:**
    -   [x] Basic page layout with header, content area, and footer.
    -   [x] Navigation links for main application areas.
-   [ ] **State Management:**
    -   [x] `DataProvider` using React Context to manage application state.
    -   [ ] Extend `DataProvider` to manage all data types (shifts, rules, absences, etc.).
-   [ ] **Core Feature Pages:**
    -   [ ] **Employee Management:** A page with a form to create/edit employees and a table to display them.
    -   [ ] **Team Management:** A page to create/edit teams.
    -   [ ] **Shift & Rule Management:** A page to define shift types and scheduling rules.
-   [ ] **Main Planner View:**
    -   [ ] A primary calendar component to display the generated shift plan.
    -   [ ] Functionality for manual drag-and-drop adjustments of assignments.
    -   [ ] Ability to save and load different plan versions.

## Phase 3: Advanced Features & Reporting

This phase builds on the core logic and UI to provide advanced functionality and insights.

-   [ ] **Data Import/Export:**
    -   [ ] Implement UI for the global JSON import/export to allow backups and data transfer.
    -   [ ] Implement CSV import/export for employee and team data.
-   [ ] **Analysis & Reporting:**
    -   [ ] A dashboard page to display key statistics (e.g., shift coverage, employee/team workload).
    -   [ ] A view to list all conflicts detected by the scheduler.
    -   [ ] PDF export functionality for the final shift plan.

## Phase 4: Polish & Deployment

-   [ ] **UI/UX Refinements:** Improve user experience based on feedback.
-   [ ] **Final Testing:** End-to-end testing of all features.
-   [ ] **Deployment:** Prepare the application for production deployment.
