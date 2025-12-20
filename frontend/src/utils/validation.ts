import type { Employee, Rule, ShiftAssignment, ShiftType } from '../types';
import { parseISO, subDays, isSameDay } from 'date-fns';

export interface ValidationResult {
  valid: boolean;
  message?: string;
  type: 'error' | 'warning' | 'info';
}

export const validateAssignment = (
  employee: Employee,
  shiftType: ShiftType,
  date: Date,
  assignments: ShiftAssignment[],
  rules: Rule[],
  _shiftTypes: ShiftType[]
): ValidationResult => {
  // 1. Check Allowed Shift Types for Employee
  if (!employee.allowedShiftTypes.includes(shiftType.id)) {
    // If empty, assume all allowed unless strict?
    // Requirement says "Allowed Shift Types: Explicit list of shift types the employee is permitted to work."
    // So if it's not in the list, it's not allowed.
    // However, if the list is empty, maybe they haven't been configured yet.
    // Let's assume strict if list is not empty.
    if (employee.allowedShiftTypes.length > 0) {
       return { valid: false, message: `Shift ${shiftType.name} is not allowed for ${employee.firstName}.`, type: 'error' };
    }
  }

  // 2. Check Absences (To be implemented when passing absences)

  // 3. Check Rules
  // Filter rules applicable to this employee (GLOBAL or EMPLOYEE specific, or TEAM specific)
  const applicableRules = rules.filter(r => {
    if (r.scope === 'GLOBAL') return true;
    if (r.scope === 'EMPLOYEE' && r.targetId === employee.id) return true;
    if (r.scope === 'TEAM' && r.targetId === employee.teamId) return true;
    return false;
  });

  for (const rule of applicableRules) {
    // 3.1 Forbidden Sequence: Previous shift X cannot be followed by current shift Y
    if (rule.type === 'FORBIDDEN_SEQUENCE') {
       const prevDate = subDays(date, 1);
       const prevAssignment = assignments.find(a =>
         a.employeeId === employee.id && isSameDay(parseISO(a.date), prevDate)
       );

       if (prevAssignment) {
         if (rule.params.fromShiftTypeId === prevAssignment.shiftTypeId &&
             rule.params.toShiftTypeId === shiftType.id) {
           return { valid: false, message: `Rule Violation: ${rule.name}`, type: 'error' };
         }
       }
    }

    // 3.2 Required Sequence: If previous shift is X, current MUST be Y
    if (rule.type === 'REQUIRED_SEQUENCE') {
        const prevDate = subDays(date, 1);
        const prevAssignment = assignments.find(a =>
          a.employeeId === employee.id && isSameDay(parseISO(a.date), prevDate)
        );

        if (prevAssignment && rule.params.fromShiftTypeId === prevAssignment.shiftTypeId) {
            // Previous was the "From" shift, so current MUST be "To" shift
            if (rule.params.toShiftTypeId !== shiftType.id) {
                 return { valid: false, message: `Rule Violation: ${rule.name} (Must follow ${rule.params.fromShiftTypeId})`, type: 'error' };
            }
        }
    }

    // 3.3 Mandatory Follow-up: If previous shift is X, then current shift MUST exist (and optionally be specific type)
    // This is similar to Required Sequence but often implies "must work next day".
    // For this context, we can treat it as: If yesterday was X, today cannot be EMPTY (but we are currently assigning a shift, so it's not empty).
    // The violation would be if we try to REMOVE a shift, or if the user leaves it empty.
    // However, validation runs on *assigning* a shift.
    // So if the rule says "If Late, next day MUST be Early", that is a Required Sequence.
    // If the rule says "If Late, next day MUST be worked (any shift)", we check if we are assigning *something*. We are.
    // So this rule is mostly relevant for "Completeness" checks or if we were validating an empty slot.
    // But let's assume it might restrict *which* shift if params.toShiftTypeId is set.
    if (rule.type === 'MANDATORY_FOLLOW_UP') {
        const prevDate = subDays(date, 1);
        const prevAssignment = assignments.find(a =>
            a.employeeId === employee.id && isSameDay(parseISO(a.date), prevDate)
        );

        if (prevAssignment && rule.params.fromShiftTypeId === prevAssignment.shiftTypeId) {
             if (rule.params.toShiftTypeId && rule.params.toShiftTypeId !== shiftType.id) {
                 return { valid: false, message: `Rule Violation: ${rule.name}`, type: 'error' };
             }
        }
    }

    // 3.4 Max Hours
    // Limit working hours within a timeframe (e.g. 40 hours in 7 days).
    if (rule.type === 'MAX_HOURS' && rule.params.maxHours && rule.params.timeframe) {
        // Calculate total hours in the timeframe ending today (inclusive)
        // We need to look back (timeframe - 1) days
        const daysToLookBack = rule.params.timeframe - 1;
        const startDate = subDays(date, daysToLookBack);

        let totalHours = 0;

        // Add hours from existing assignments in the window
        // We need to query assignments for this employee in range [startDate, date]
        // Excluding the current date if there's already an assignment we are replacing (but the UI handles replacement by remove then add usually, or just overwrite).
        // The `assignments` array passed in includes *existing* assignments.
        // If we are *adding* a new assignment, we should count it.

        // Sum existing assignments
        assignments.forEach(a => {
            if (a.employeeId === employee.id) {
                const aDate = parseISO(a.date);
                if (aDate >= startDate && aDate <= date && !isSameDay(aDate, date)) { // Exclude current day to avoid double count if we are replacing
                     const sType = _shiftTypes.find(s => s.id === a.shiftTypeId);
                     if (sType) {
                         // Calculate duration. Simplification: use weight * 8 or parsed time difference
                         // Requirement says: "Weighting: Workload weight (default 1.0) for hour calculations."
                         // Let's assume standard day is 8h * weight. Or calculate from start/end time.
                         // Let's calculate from start/end time.
                         const start = parseInt(sType.startTime.split(':')[0]) + parseInt(sType.startTime.split(':')[1])/60;
                         const end = parseInt(sType.endTime.split(':')[0]) + parseInt(sType.endTime.split(':')[1])/60;
                         let duration = end - start;
                         if (duration < 0) duration += 24; // Overnight

                         totalHours += duration * sType.weight;
                     }
                }
            }
        });

        // Add the current shift being assigned
        const currentStart = parseInt(shiftType.startTime.split(':')[0]) + parseInt(shiftType.startTime.split(':')[1])/60;
        const currentEnd = parseInt(shiftType.endTime.split(':')[0]) + parseInt(shiftType.endTime.split(':')[1])/60;
        let currentDuration = currentEnd - currentStart;
        if (currentDuration < 0) currentDuration += 24;

        totalHours += currentDuration * shiftType.weight;

        if (totalHours > rule.params.maxHours) {
            return { valid: false, message: `Rule Violation: Max Hours Exceeded (${totalHours.toFixed(1)} > ${rule.params.maxHours})`, type: 'error' };
        }
    }
  }

  return { valid: true, type: 'info' };
};
