import type { Employee, ShiftRule, ShiftAssignment, ShiftType } from '../types';
import { differenceInDays, isSameDay, parseISO } from 'date-fns';

export interface ValidationResult {
  valid: boolean;
  message?: string;
  type: 'error' | 'warning' | 'info';
}

export function validateAssignment(
  assignment: { date: string; employee: string; shift_type: string },
  employees: Employee[],
  assignments: ShiftAssignment[],
  rules: ShiftRule[],
  shiftTypes: ShiftType[]
): ValidationResult {
  const employee = employees.find(e => String(e.id) === String(assignment.employee));
  const shiftType = shiftTypes.find(s => String(s.id) === String(assignment.shift_type));

  if (!employee || !shiftType) {
    return { valid: false, message: 'Invalid employee or shift type', type: 'error' };
  }

  // 1. Check Allowed Shift Types
  if (employee.allowed_shift_types && employee.allowed_shift_types.length > 0) {
    // Note: ID comparison requires parsing if mixed strings/numbers
    if (!employee.allowed_shift_types.some(id => String(id) === String(assignment.shift_type))) {
      return { valid: false, message: `Employee ${employee.first_name} is not allowed to work this shift type.`, type: 'error' };
    }
  }

  // 2. Check Absences (Not implemented in types here yet, skipping)

  // 3. Check Rules (Simplified for ShiftRule structure)
  // ShiftRule: from_shift_type, to_shift_type, rule_type

  const targetDate = parseISO(assignment.date);
  const prevDateAssignments = assignments.filter(a =>
    String(a.employee) === String(assignment.employee) &&
    differenceInDays(targetDate, parseISO(a.date)) === 1
  );

  for (const rule of rules) {
    if (rule.rule_type === 'FORBIDDEN_SEQUENCE') {
       // Check if yesterday had the 'from' shift
       const hasFromShiftYesterday = prevDateAssignments.some(a => String(a.shift_type) === String(rule.from_shift_type));

       if (hasFromShiftYesterday && String(rule.to_shift_type) === String(assignment.shift_type)) {
         return { valid: false, message: `Rule Violation: ${rule.name}`, type: 'error' };
       }
    }
  }

  // 4. Check Double Booking
  const doubleBooking = assignments.find(a =>
    String(a.employee) === String(assignment.employee) &&
    isSameDay(parseISO(a.date), targetDate)
  );

  if (doubleBooking) {
    return { valid: false, message: 'Employee is already assigned to a shift on this day.', type: 'error' };
  }

  return { valid: true, type: 'info' };
}
