import {
  Employee,
  ShiftType,
  ShiftAssignment,
  SchedulerInput,
  SchedulerResult,
  WEEKDAYS,
} from './types';

/**
 * The main class for generating a shift schedule.
 */
export class ShiftScheduler {
  private readonly input: SchedulerInput;
  private assignments: ShiftAssignment[];
  private conflicts: string[] = [];
  private dateMap: Map<string, Date> = new Map();
  private employeeWorkloads: Map<string, number> = new Map();
  private shiftTypeMap: Map<string, ShiftType> = new Map();

  constructor(input: SchedulerInput) {
    this.input = input;
    this.assignments = [...(input.existingAssignments || [])];
    this.input.shiftTypes.forEach(st => this.shiftTypeMap.set(st.id, st));

    this.prepareDateMap();
    this.initializeWorkloads();
  }

  private calculateShiftDuration(shiftTypeId: string): number {
    const shiftType = this.shiftTypeMap.get(shiftTypeId);
    if (!shiftType) return 0;

    const [startH, startM] = shiftType.startTime.split(':').map(Number);
    const [endH, endM] = shiftType.endTime.split(':').map(Number);

    let startMinutes = startH * 60 + startM;
    let endMinutes = endH * 60 + endM;

    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60; // Handles overnight shifts
    }

    return (endMinutes - startMinutes) / 60;
  }

  private initializeWorkloads() {
    this.input.employees.forEach(emp => this.employeeWorkloads.set(emp.id, 0));

    this.assignments.forEach(assignment => {
      const duration = this.calculateShiftDuration(assignment.shiftTypeId);
      const currentHours = this.employeeWorkloads.get(assignment.employeeId) || 0;
      this.employeeWorkloads.set(assignment.employeeId, currentHours + duration);
    });
  }

  private prepareDateMap() {
    const current = new Date(this.input.startDate + 'T00:00:00.000Z');
    const end = new Date(this.input.endDate + 'T00:00:00.000Z');

    while (current <= end) {
      const dateString = current.toISOString().split('T')[0];
      this.dateMap.set(dateString, new Date(current));
      current.setDate(current.getDate() + 1);
    }
  }

  public generatePlan(): SchedulerResult {
    this.dateMap.forEach((date, dateString) => {
      const dayOfWeek = WEEKDAYS[date.getUTCDay() === 0 ? 6 : date.getUTCDay() - 1];

      this.input.shiftTypes.forEach(shiftType => {
        const requiredCount = shiftType.requiredPersonnel[dayOfWeek] ?? 0;
        const existingAssignments = this.assignments.filter(a => a.date === dateString && a.shiftTypeId === shiftType.id).length;

        for (let i = existingAssignments; i < requiredCount; i++) {
          const candidate = this.findBestCandidate(shiftType, dateString);
          if (candidate) {
            const newAssignment = {
              employeeId: candidate.id,
              shiftTypeId: shiftType.id,
              date: dateString,
            };
            this.assignments.push(newAssignment);
            // Update workload
            const duration = this.calculateShiftDuration(shiftType.id);
            const currentHours = this.employeeWorkloads.get(candidate.id) || 0;
            this.employeeWorkloads.set(candidate.id, currentHours + duration);
          } else {
            this.conflicts.push(`Unfilled shift: ${shiftType.name} on ${dateString}`);
          }
        }
      });
    });

    return {
      assignments: this.assignments,
      conflicts: this.conflicts,
    };
  }

  private findBestCandidate(shiftType: ShiftType, dateString: string): Employee | null {
    const availableEmployees = this.input.employees.filter(emp => {
      const isAlreadyAssigned = this.assignments.some(a => a.employeeId === emp.id && a.date === dateString);
      if (isAlreadyAssigned) return false;
      if (!this.isEmployeeAvailable(emp, dateString, shiftType)) return false;
      if (!emp.qualifications[shiftType.id]) return false;
      return true;
    });

    // Sort by workload (ascending) to pick the one with the fewest hours
    availableEmployees.sort((a, b) => {
      const hoursA = this.employeeWorkloads.get(a.id) || 0;
      const hoursB = this.employeeWorkloads.get(b.id) || 0;
      return hoursA - hoursB;
    });

    return availableEmployees.length > 0 ? availableEmployees[0] : null;
  }

  private isEmployeeAvailable(employee: Employee, dateString: string, shiftType: ShiftType): boolean {
    const isAbsent = this.input.absences.some(a =>
      a.employeeId === employee.id && dateString >= a.startDate && dateString <= a.endDate
    );
    if (isAbsent) return false;

    const date = this.dateMap.get(dateString);
    if (!date) return false;

    const dayOfWeek = WEEKDAYS[date.getUTCDay() === 0 ? 6 : date.getUTCDay() - 1];
    const startHour = parseInt(shiftType.startTime.split(':')[0], 10);

    const morningKey = `${dayOfWeek}_am`;
    const afternoonKey = `${dayOfWeek}_pm`;

    if (startHour < 12) {
      if (employee.availability[morningKey] === false) return false;
    } else {
      if (employee.availability[afternoonKey] === false) return false;
    }

    return true;
  }
}
