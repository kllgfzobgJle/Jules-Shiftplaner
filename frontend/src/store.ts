import { create } from 'zustand';
import {
  EmployeeService, TeamService, ShiftTypeService, ShiftRuleService, ShiftAssignmentService, AbsenceService, ShiftPlanService
} from './services/api';
import type { Employee, Team, ShiftType, ShiftRule, ShiftAssignment, Absence, Settings, ShiftPlan } from './types';
import axios from 'axios';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

interface AppState extends AuthState {
  employees: Employee[];
  teams: Team[];
  shiftTypes: ShiftType[];
  rules: ShiftRule[];
  shiftPlans: ShiftPlan[];
  activePlanId: string | null;
  assignments: ShiftAssignment[];
  absences: Absence[];
  settings: Settings;

  // Actions - Fetch
  fetchAll: () => Promise<void>;

  // Actions - ShiftPlan
  addShiftPlan: (plan: Partial<ShiftPlan>) => Promise<void>;
  deleteShiftPlan: (id: string) => Promise<void>;
  setActivePlanId: (id: string | null) => void;
  runAutoSchedule: (planId: string) => Promise<void>;

  // Actions - Employee
  addEmployee: (employee: Partial<Employee>) => Promise<void>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;

  // Actions - Team
  addTeam: (team: Partial<Team>) => Promise<void>;
  updateTeam: (id: string, team: Partial<Team>) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;

  // Actions - ShiftType
  addShiftType: (shiftType: Partial<ShiftType>) => Promise<void>;
  updateShiftType: (id: string, shiftType: Partial<ShiftType>) => Promise<void>;
  deleteShiftType: (id: string) => Promise<void>;

  // Actions - Rule
  addRule: (rule: Partial<ShiftRule>) => Promise<void>;
  updateRule: (id: string, rule: Partial<ShiftRule>) => Promise<void>;
  deleteRule: (id: string) => Promise<void>;

  // Actions - Assignment
  addAssignment: (assignment: Partial<ShiftAssignment>) => Promise<void>;
  removeAssignment: (id: string) => Promise<void>;
  updateAssignment: (id: string, assignment: Partial<ShiftAssignment>) => Promise<void>;

  // Actions - Absence
  addAbsence: (absence: Partial<Absence>) => Promise<void>;
  updateAbsence: (id: string, absence: Partial<Absence>) => Promise<void>;
  deleteAbsence: (id: string) => Promise<void>;

  updateSettings: (settings: Partial<Settings>) => void;
}

export const useStore = create<AppState>()((set, get) => ({
  // Auth State
  token: localStorage.getItem('auth_token'),
  isAuthenticated: !!localStorage.getItem('auth_token'),

  login: (token: string) => {
    localStorage.setItem('auth_token', token);
    set({ token, isAuthenticated: true });
    // Assuming api client needs updating, typically handled via interceptor or re-creation
    // but here we might just reload or rely on the api service reading from local/state
  },
  logout: () => {
    localStorage.removeItem('auth_token');
    set({ token: null, isAuthenticated: false });
  },

  employees: [],
  teams: [],
  shiftTypes: [],
  rules: [],
  shiftPlans: [],
  activePlanId: null,
  assignments: [],
  absences: [],
  settings: { theme: 'light' },

  fetchAll: async () => {
    try {
      const [employees, teams, shiftTypes, rules, plans, assignments, absences] = await Promise.all([
        EmployeeService.getAll(),
        TeamService.getAll(),
        ShiftTypeService.getAll(),
        ShiftRuleService.getAll(),
        ShiftPlanService.getAll(),
        ShiftAssignmentService.getAll(),
        AbsenceService.getAll(),
      ]);
      set({
          employees, teams, shiftTypes, rules, shiftPlans: plans, assignments, absences,
          activePlanId: plans.length > 0 ? plans[0].id : null
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  },

  addShiftPlan: async (plan) => {
    try {
        const newPlan = await ShiftPlanService.create(plan);
        set((state) => ({
            shiftPlans: [...state.shiftPlans, newPlan],
            activePlanId: newPlan.id
        }));
    } catch (error) {
        console.error("Failed to add shift plan:", error);
    }
  },

  deleteShiftPlan: async (id) => {
    try {
        await ShiftPlanService.delete(id);
        set((state) => ({
            shiftPlans: state.shiftPlans.filter(p => p.id !== id),
            activePlanId: state.activePlanId === id ? (state.shiftPlans.length > 1 ? state.shiftPlans[0].id : null) : state.activePlanId
        }));
    } catch (error) {
        console.error("Failed to delete shift plan:", error);
    }
  },

  setActivePlanId: (id) => set({ activePlanId: id }),

  runAutoSchedule: async (planId) => {
      try {
          // This will be implemented in the next step when we expose the API
          await ShiftPlanService.autoSchedule(planId);
          // Refresh assignments
          const assignments = await ShiftAssignmentService.getAll();
          set({ assignments });
      } catch (error) {
          console.error("Failed to run auto-schedule:", error);
      }
  },

  addEmployee: async (employee) => {
    try {
      const newEmployee = await EmployeeService.create(employee);
      set((state) => ({ employees: [...state.employees, newEmployee] }));
    } catch (error) {
      console.error("Failed to add employee:", error);
    }
  },
  updateEmployee: async (id, employee) => {
    try {
      const updated = await EmployeeService.update(id, employee);
      set((state) => ({
        employees: state.employees.map((e) => (e.id === id ? updated : e)),
      }));
    } catch (error) {
       console.error("Failed to update employee:", error);
    }
  },
  deleteEmployee: async (id) => {
    try {
      await EmployeeService.delete(id);
      set((state) => ({ employees: state.employees.filter((e) => e.id !== id) }));
    } catch (error) {
       console.error("Failed to delete employee:", error);
    }
  },

  addTeam: async (team) => {
    try {
      const newTeam = await TeamService.create(team);
      set((state) => ({ teams: [...state.teams, newTeam] }));
    } catch (error) {
       console.error("Failed to add team:", error);
    }
  },
  updateTeam: async (id, team) => {
    try {
      const updated = await TeamService.update(id, team);
      set((state) => ({
        teams: state.teams.map((t) => (t.id === id ? updated : t)),
      }));
    } catch (error) {
       console.error("Failed to update team:", error);
    }
  },
  deleteTeam: async (id) => {
    try {
      await TeamService.delete(id);
      set((state) => ({ teams: state.teams.filter((t) => t.id !== id) }));
    } catch (error) {
       console.error("Failed to delete team:", error);
    }
  },

  addShiftType: async (shiftType) => {
    try {
      const newST = await ShiftTypeService.create(shiftType);
      set((state) => ({ shiftTypes: [...state.shiftTypes, newST] }));
    } catch (error) {
       console.error("Failed to add shift type:", error);
    }
  },
  updateShiftType: async (id, shiftType) => {
    try {
      const updated = await ShiftTypeService.update(id, shiftType);
      set((state) => ({
        shiftTypes: state.shiftTypes.map((s) => (s.id === id ? updated : s)),
      }));
    } catch (error) {
       console.error("Failed to update shift type:", error);
    }
  },
  deleteShiftType: async (id) => {
    try {
      await ShiftTypeService.delete(id);
      set((state) => ({ shiftTypes: state.shiftTypes.filter((s) => s.id !== id) }));
    } catch (error) {
       console.error("Failed to delete shift type:", error);
    }
  },

  addRule: async (rule) => {
    try {
      const newRule = await ShiftRuleService.create(rule);
      set((state) => ({ rules: [...state.rules, newRule] }));
    } catch (error) {
       console.error("Failed to add rule:", error);
    }
  },
  updateRule: async (id, rule) => {
    try {
      const updated = await ShiftRuleService.update(id, rule);
      set((state) => ({
        rules: state.rules.map((r) => (r.id === id ? updated : r)),
      }));
    } catch (error) {
       console.error("Failed to update rule:", error);
    }
  },
  deleteRule: async (id) => {
    try {
      await ShiftRuleService.delete(id);
      set((state) => ({ rules: state.rules.filter((r) => r.id !== id) }));
    } catch (error) {
       console.error("Failed to delete rule:", error);
    }
  },

  addAssignment: async (assignment) => {
    try {
      const newAss = await ShiftAssignmentService.create(assignment);
      set((state) => ({ assignments: [...state.assignments, newAss] }));
    } catch (error) {
       console.error("Failed to add assignment:", error);
    }
  },
  removeAssignment: async (id) => {
    try {
      await ShiftAssignmentService.delete(id);
      set((state) => ({ assignments: state.assignments.filter((a) => a.id !== id) }));
    } catch (error) {
       console.error("Failed to remove assignment:", error);
    }
  },
  updateAssignment: async (id, assignment) => {
    try {
      const updated = await ShiftAssignmentService.update(id, assignment);
      set((state) => ({
        assignments: state.assignments.map((a) => (a.id === id ? updated : a)),
      }));
    } catch (error) {
       console.error("Failed to update assignment:", error);
    }
  },

  addAbsence: async (absence) => {
    try {
      const newAbs = await AbsenceService.create(absence);
      set((state) => ({ absences: [...state.absences, newAbs] }));
    } catch (error) {
       console.error("Failed to add absence:", error);
    }
  },
  updateAbsence: async (id, absence) => {
    try {
      const updated = await AbsenceService.update(id, absence);
      set((state) => ({
        absences: state.absences.map((a) => (a.id === id ? updated : a)),
      }));
    } catch (error) {
       console.error("Failed to update absence:", error);
    }
  },
  deleteAbsence: async (id) => {
    try {
      await AbsenceService.delete(id);
      set((state) => ({ absences: state.absences.filter((a) => a.id !== id) }));
    } catch (error) {
       console.error("Failed to delete absence:", error);
    }
  },

  updateSettings: (settings) => set((state) => ({ settings: { ...state.settings, ...settings } })),
}));
