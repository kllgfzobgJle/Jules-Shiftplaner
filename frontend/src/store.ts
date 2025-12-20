import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Employee, Team, ShiftType, Rule, ShiftAssignment, Absence, Settings } from './types';

interface AppState {
  employees: Employee[];
  teams: Team[];
  shiftTypes: ShiftType[];
  rules: Rule[];
  assignments: ShiftAssignment[];
  absences: Absence[];
  settings: Settings;

  // Actions
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  addTeam: (team: Team) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  deleteTeam: (id: string) => void;

  addShiftType: (shiftType: ShiftType) => void;
  updateShiftType: (id: string, shiftType: Partial<ShiftType>) => void;
  deleteShiftType: (id: string) => void;

  addRule: (rule: Rule) => void;
  updateRule: (id: string, rule: Partial<Rule>) => void;
  deleteRule: (id: string) => void;

  addAssignment: (assignment: ShiftAssignment) => void;
  removeAssignment: (id: string) => void;
  updateAssignment: (id: string, assignment: Partial<ShiftAssignment>) => void;

  addAbsence: (absence: Absence) => void;
  updateAbsence: (id: string, absence: Partial<Absence>) => void;
  deleteAbsence: (id: string) => void;

  updateSettings: (settings: Partial<Settings>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      employees: [],
      teams: [],
      shiftTypes: [],
      rules: [],
      assignments: [],
      absences: [],
      settings: { theme: 'light' },

      addEmployee: (employee) => set((state) => ({ employees: [...state.employees, employee] })),
      updateEmployee: (id, employee) => set((state) => ({
        employees: state.employees.map((e) => (e.id === id ? { ...e, ...employee } : e)),
      })),
      deleteEmployee: (id) => set((state) => ({ employees: state.employees.filter((e) => e.id !== id) })),

      addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
      updateTeam: (id, team) => set((state) => ({
        teams: state.teams.map((t) => (t.id === id ? { ...t, ...team } : t)),
      })),
      deleteTeam: (id) => set((state) => ({ teams: state.teams.filter((t) => t.id !== id) })),

      addShiftType: (shiftType) => set((state) => ({ shiftTypes: [...state.shiftTypes, shiftType] })),
      updateShiftType: (id, shiftType) => set((state) => ({
        shiftTypes: state.shiftTypes.map((s) => (s.id === id ? { ...s, ...shiftType } : s)),
      })),
      deleteShiftType: (id) => set((state) => ({ shiftTypes: state.shiftTypes.filter((s) => s.id !== id) })),

      addRule: (rule) => set((state) => ({ rules: [...state.rules, rule] })),
      updateRule: (id, rule) => set((state) => ({
        rules: state.rules.map((r) => (r.id === id ? { ...r, ...rule } : r)),
      })),
      deleteRule: (id) => set((state) => ({ rules: state.rules.filter((r) => r.id !== id) })),

      addAssignment: (assignment) => set((state) => ({ assignments: [...state.assignments, assignment] })),
      removeAssignment: (id) => set((state) => ({ assignments: state.assignments.filter((a) => a.id !== id) })),
      updateAssignment: (id, assignment) => set((state) => ({
        assignments: state.assignments.map((a) => (a.id === id ? { ...a, ...assignment } : a)),
      })),

      addAbsence: (absence) => set((state) => ({ absences: [...state.absences, absence] })),
      updateAbsence: (id, absence) => set((state) => ({
        absences: state.absences.map((a) => (a.id === id ? { ...a, ...absence } : a)),
      })),
      deleteAbsence: (id) => set((state) => ({ absences: state.absences.filter((a) => a.id !== id) })),

      updateSettings: (settings) => set((state) => ({ settings: { ...state.settings, ...settings } })),
    }),
    {
      name: 'shift-planner-storage',
    }
  )
);
