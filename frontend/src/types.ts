export type EmployeeType = 'TRAINED' | 'APPRENTICE_1' | 'APPRENTICE_2' | 'APPRENTICE_3' | 'APPRENTICE_4';

export type Weekday = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export type AvailabilityType = 'AVAILABLE' | 'UNAVAILABLE' | 'PREFERRED';

export interface Availability {
  am: AvailabilityType;
  pm: AvailabilityType;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  type: EmployeeType;
  workload: number; // 0-100
  teamId?: string;
  allowedShiftTypes: string[]; // shiftType IDs
  suitability: Record<string, number>; // shiftType ID -> 0-5
  availability: Record<Weekday, Availability>;
  preferredShifts: string[]; // shiftType IDs
  redundancyGroup?: string;
}

export interface Team {
  id: string;
  name: string;
  targetShiftShare: number;
  teamLeadId?: string;
  ruleIds: string[];
}

export interface ShiftType {
  id: string;
  name: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  requiredStaff: Record<Weekday, number>;
  color: string;
  weight: number;
}

export type RuleType = 'FORBIDDEN_SEQUENCE' | 'REQUIRED_SEQUENCE' | 'MANDATORY_FOLLOW_UP' | 'MAX_HOURS';

export interface Rule {
  id: string;
  type: RuleType;
  name: string;
  params: {
    fromShiftTypeId?: string;
    toShiftTypeId?: string;
    maxHours?: number;
    timeframe?: number; // days
    // Add more as needed
  };
  scope: 'GLOBAL' | 'TEAM' | 'EMPLOYEE';
  targetId?: string;
}

export interface ShiftAssignment {
  id: string;
  employeeId: string;
  shiftTypeId: string;
  date: string; // YYYY-MM-DD
}

export interface Absence {
  id: string;
  employeeId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason?: string;
  type: 'SICK' | 'VACATION' | 'OTHER';
}

export interface Settings {
  theme: 'light' | 'dark';
}
