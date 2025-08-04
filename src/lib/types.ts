/**
 * Represents an employee in the system.
 */
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  shortName?: string;
  employeeType: "regular" | "apprentice";
  apprenticeshipYear?: number; // e.g., 1, 2, 3
  employmentPercentage: number; // e.g., 80 for 80%
  teamId: string;
  /**
   * A record of which shift types this employee is qualified to work.
   * Key: ShiftType ID, Value: boolean
   */
  qualifications: Record<string, boolean>;
  /**
   * Defines the employee's general availability for parts of the day.
   * Key: e.g., "monday_am", "tuesday_pm", Value: boolean
   */
  availability: Record<string, boolean>;
}

/**
 * Represents a team of employees.
 */
export interface Team {
  id: string;
  name: string;
  /**
   * The target percentage of the total shift load this team should cover.
   */
  targetLoadPercentage: number;
}

/**
 * Represents a type of shift, e.g., "Early Shift", "Late Shift".
 */
export interface ShiftType {
  id: string;
  name: string;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  /**
   * The number of employees required for this shift on each day of the week.
   * Key: e.g., "monday", "tuesday", Value: number of employees
   */
  requiredPersonnel: Record<string, number>;
}

/**
 * Represents a single assigned shift in a plan.
 */
export interface ShiftAssignment {
  employeeId: string;
  shiftTypeId: string;
  date: string; // "YYYY-MM-DD"
}

/**
 * Represents a complete shift plan for a given period.
 */
export interface ShiftPlan {
  id: string;
  name: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
  assignments: ShiftAssignment[];
}

/**
 * Represents a period of absence for an employee (e.g., vacation, sick leave).
 */
export interface Absence {
  id: string;
  employeeId: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
  reason?: string;
}

/**
 * Represents a scheduling rule, e.g., forbidden shift sequences.
 */
export interface ShiftRule {
  id: string;
  name: string;
  /**
   * Type of the rule, e.g., "forbidden_sequence".
   * This allows for future expansion with different kinds of rules.
   */
  type: string;
  // Rule-specific parameters would be added here.
  // For example, for a forbidden sequence:
  fromShiftTypeId?: string;
  toShiftTypeId?: string;
  daysApart?: number; // e.g., 1 for consecutive days
}

/**
 * Defines the default qualifications for apprentices based on their year.
 */
export interface ApprenticeQualification {
  apprenticeshipYear: number;
  /**
   * A record of which shift types apprentices in this year are qualified for.
   * Key: ShiftType ID, Value: boolean
   */
  qualifications: Record<string, boolean>;
}

/**
 * Defines the days of the week for scheduling purposes.
 */
export const WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

/**
 * Defines the parts of a day for availability.
 */
export const DAY_PARTS = ["am", "pm"] as const;
export type DayPart = (typeof DAY_PARTS)[number];

/**
 * Defines the input data required by the scheduler.
 */
export interface SchedulerInput {
  employees: Employee[];
  teams: Team[];
  shiftTypes: ShiftType[];
  rules: ShiftRule[];
  absences: Absence[];
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
  existingAssignments?: ShiftAssignment[];
}

/**
 * Defines the output of the scheduling process.
 */
export interface SchedulerResult {
  assignments: ShiftAssignment[];
  conflicts: string[]; // A list of issues encountered during scheduling.
}
