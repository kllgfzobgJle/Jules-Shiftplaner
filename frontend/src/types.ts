export type EmployeeType = 'FULL' | 'APPRENTICE'; // Updated to match backend

export type Weekday = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export type AvailabilityType = 'AVAILABLE' | 'UNAVAILABLE' | 'PREFERRED';

export interface Availability {
  am: AvailabilityType;
  pm: AvailabilityType;
}

export interface Employee {
  id: string; // Django ID is usually number, but generic ID is fine if we cast
  first_name: string; // Backend uses snake_case
  last_name: string;
  abbreviation: string;
  employee_type: EmployeeType;
  apprenticeship_year?: number;
  workload_percentage: number;
  team: number; // ID
  personal_shift_quota?: number;

  allowed_shift_types: number[]; // IDs
  suitability: Record<string, number>;
  availability: Record<Weekday, Availability>;
}

export interface Team {
  id: string;
  name: string;
  target_share: number;
  shift_rules: number[]; // IDs
}

export interface ShiftType {
  id: string;
  name: string;
  start_time: string; // HH:mm:ss
  end_time: string; // HH:mm:ss
  monday_required: number;
  tuesday_required: number;
  wednesday_required: number;
  thursday_required: number;
  friday_required: number;
  saturday_required: number;
  sunday_required: number;
}

export type RuleType = 'FORBIDDEN_SEQUENCE' | 'REQUIRED_SEQUENCE' | 'MANDATORY_FOLLOW_UP';

export interface ShiftRule {
  id: string;
  name: string;
  description?: string;
  rule_type: RuleType;
  from_shift_type: number; // ID
  to_shift_type: number; // ID
  is_same_day: boolean;
}

export interface ShiftPlan {
  id: string;
  name: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;
  is_public: boolean;
}

export interface ShiftAssignment {
  id: string;
  shift_plan: number; // ID
  employee: number; // ID
  shift_type: number; // ID
  date: string; // YYYY-MM-DD
  is_locked: boolean;
}

export interface Absence {
  id: string;
  employee: number; // ID
  start_date: string;
  end_date: string;
  reason: string;
  absence_type: 'VACATION' | 'SICK' | 'OTHER';
}

export interface Settings {
  theme: 'light' | 'dark';
}
