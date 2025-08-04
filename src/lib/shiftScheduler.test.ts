// src/lib/shiftScheduler.test.ts

import { describe, it, expect } from 'bun:test';
import { ShiftScheduler } from './shiftScheduler';
import type { Employee, Team, ShiftType, SchedulerInput } from './types';

// --- Test-Setup ---
const mockTeam: Team = {
  id: 'team-1',
  name: 'Test Team',
  targetLoadPercentage: 100,
};

const mockShift: ShiftType = {
  id: 'shift-1', name: 'Test Shift', startTime: '08:00', endTime: '16:00',
  requiredPersonnel: { monday: 1, tuesday: 1, wednesday: 1, thursday: 1, friday: 1 },
};

const mockEmployee: Employee = {
  id: 'emp-1', firstName: 'Max', lastName: 'Mustermann', employeeType: 'regular',
  employmentPercentage: 100, teamId: 'team-1',
  qualifications: { 'shift-1': true },
  availability: {
    monday_am: true, monday_pm: true, tuesday_am: true, tuesday_pm: true,
    wednesday_am: true, wednesday_pm: true, thursday_am: true, thursday_pm: true,
    friday_am: true, friday_pm: true,
  },
};

// --- Test-Suite für den ShiftScheduler ---
describe('ShiftScheduler Logic', () => {

  it('sollte einen verfügbaren Mitarbeiter einer benötigten Schicht zuweisen', () => {
    const startDate = '2025-08-04'; // Ein Montag
    const endDate = '2025-08-04';   // Nur dieser eine Tag

    const options: SchedulerInput = {
      startDate,
      endDate,
      employees: [mockEmployee],
      teams: [mockTeam],
      shiftTypes: [mockShift],
      rules: [],
      absences: [],
    };

    const scheduler = new ShiftScheduler(options);
    const result = scheduler.generatePlan();

    // Erwartung: Es sollte genau eine Zuweisung geben.
    expect(result.assignments.length).toBe(1);

    const assignment = result.assignments[0];
    // Erwartung: Der richtige Mitarbeiter wurde der richtigen Schicht zugewiesen.
    expect(assignment.employeeId).toBe(mockEmployee.id);
    expect(assignment.shiftTypeId).toBe(mockShift.id);
    expect(assignment.date).toBe('2025-08-04');

    // Erwartung: Es sollten keine Konflikte aufgetreten sein.
    expect(result.conflicts.length).toBe(0);
  });

  it('sollte einen Mitarbeiter nicht zuweisen, wenn er abwesend ist', () => {
    const startDate = '2025-08-04';
    const endDate = '2025-08-04';

    const absence: Absence = {
      id: 'abs-1',
      employeeId: 'emp-1',
      startDate: '2025-08-04',
      endDate: '2025-08-04',
      reason: 'Vacation',
    };

    const options: SchedulerInput = {
      startDate,
      endDate,
      employees: [mockEmployee],
      teams: [mockTeam],
      shiftTypes: [mockShift],
      rules: [],
      absences: [absence],
    };

    const scheduler = new ShiftScheduler(options);
    const result = scheduler.generatePlan();

    // Erwartung: Es sollte keine Zuweisung geben.
    expect(result.assignments.length).toBe(0);

    // Erwartung: Es sollte ein Konflikt wegen einer unbesetzten Schicht gemeldet werden.
    expect(result.conflicts.length).toBe(1);
    expect(result.conflicts[0]).toContain('Unfilled shift');
  });

  it('sollte einen Mitarbeiter nicht zuweisen, wenn er nicht qualifiziert ist', () => {
    const unqualifiedEmployee: Employee = {
      ...mockEmployee,
      id: 'emp-unqualified',
      qualifications: { 'shift-1': false }, // Explicitly not qualified
    };

    const options: SchedulerInput = {
      startDate: '2025-08-04',
      endDate: '2025-08-04',
      employees: [unqualifiedEmployee],
      teams: [mockTeam],
      shiftTypes: [mockShift],
      rules: [],
      absences: [],
    };

    const scheduler = new ShiftScheduler(options);
    const result = scheduler.generatePlan();

    // Erwartung: Es sollte keine Zuweisung geben.
    expect(result.assignments.length).toBe(0);

    // Erwartung: Es sollte ein Konflikt wegen einer unbesetzten Schicht gemeldet werden.
    expect(result.conflicts.length).toBe(1);
    expect(result.conflicts[0]).toContain('Unfilled shift');
  });

  it('sollte den Mitarbeiter mit weniger Arbeitsstunden bevorzugen', () => {
    const empA = { ...mockEmployee, id: 'emp-a' };
    const empB = { ...mockEmployee, id: 'emp-b' };

    const options: SchedulerInput = {
      startDate: '2025-08-05', // Tuesday
      endDate: '2025-08-05',
      employees: [empA, empB],
      teams: [mockTeam],
      shiftTypes: [mockShift],
      rules: [],
      absences: [],
      existingAssignments: [
        // empA has already worked one shift this period
        { employeeId: 'emp-a', shiftTypeId: 'shift-1', date: '2025-08-04' }
      ],
    };

    const scheduler = new ShiftScheduler(options);
    const result = scheduler.generatePlan();

    // Erwartung: Es sollte genau eine neue Zuweisung für den Dienstag geben.
    expect(result.assignments.length).toBe(2); // 1 existing + 1 new
    const newAssignment = result.assignments.find(a => a.date === '2025-08-05');

    // Erwartung: Die neue Schicht wurde an empB vergeben, da dieser weniger gearbeitet hat.
    expect(newAssignment).toBeDefined();
    expect(newAssignment?.employeeId).toBe(empB.id);

    // Erwartung: Es sollten keine Konflikte aufgetreten sein.
    expect(result.conflicts.length).toBe(0);
  });

});
