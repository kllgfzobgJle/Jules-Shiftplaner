import React, { useState } from 'react';
import { useStore } from '../../store';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { validateAssignment } from '../../utils/validation';
import PlanManager from './PlanManager';

const PlanningGrid: React.FC = () => {
  const {
    employees,
    shiftTypes,
    assignments,
    addAssignment,
    removeAssignment,
    updateAssignment,
    rules,
    teams,
    activePlanId,
    runAutoSchedule
  } = useStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggedShift, setDraggedShift] = useState<{ typeId: string } | null>(null);

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const handleDragStart = (e: React.DragEvent, typeId: string) => {
    setDraggedShift({ typeId });
    e.dataTransfer.setData('text/plain', typeId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = async (e: React.DragEvent, employeeId: string, date: Date) => {
    e.preventDefault();
    const shiftTypeId = draggedShift?.typeId;
    if (!shiftTypeId || !activePlanId) return;

    const dateStr = format(date, 'yyyy-MM-dd');

    // Basic validation check before adding
    const validation = validateAssignment(
      { employee: employeeId, shift_type: shiftTypeId, date: dateStr },
      employees,
      assignments,
      rules,
      shiftTypes
    );

    if (!validation.valid && validation.type === 'error') {
      alert(validation.message);
      return;
    }

    // Check if assignment exists
    const existing = assignments.find(a =>
      String(a.employee) === String(employeeId) &&
      isSameDay(parseISO(a.date), date)
    );

    if (existing) {
        if (existing.is_locked) {
            alert("This shift is locked.");
            return;
        }
        // Update existing
        await updateAssignment(existing.id, { shift_type: Number(shiftTypeId) as any });
    } else {
        // Create new
        await addAssignment({
            employee: Number(employeeId) as any,
            shift_type: Number(shiftTypeId) as any,
            date: dateStr,
            shift_plan: Number(activePlanId) as any
        });
    }

    setDraggedShift(null);
  };

  const handleRemove = async (assignmentId: string) => {
      if (confirm("Remove shift?")) {
          await removeAssignment(assignmentId);
      }
  };

  const getAssignment = (employeeId: string, date: Date) => {
    // Only show assignments for this plan logic could be added if needed,
    // but assignments are usually date-bound anyway.
    return assignments.find(a =>
      String(a.employee) === String(employeeId) &&
      isSameDay(parseISO(a.date), date)
    );
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <PlanManager />

      <div className="flex flex-col flex-1 bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">Planning: {format(startDate, 'MMMM yyyy')}</h2>
            <div className="flex gap-2">
              <button onClick={() => setCurrentDate(addDays(currentDate, -7))} className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft />
              </button>
              <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="p-1 hover:bg-gray-100 rounded">
                <ChevronRight />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
              {activePlanId && (
                  <button
                    onClick={() => runAutoSchedule(activePlanId)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700"
                  >
                      <Play size={16} /> Auto Schedule
                  </button>
              )}

            {/* Shift Palette */}
            <div className="flex gap-2">
                {shiftTypes.map(st => (
                <div
                    key={st.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, st.id)}
                    className="px-3 py-1 rounded cursor-move text-sm font-medium border border-gray-200 bg-gray-50 hover:bg-gray-100"
                    title={st.name}
                >
                    {st.name}
                </div>
                ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-auto flex-1">
          {!activePlanId ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                  Please create or select a Shift Plan to start planning.
              </div>
          ) : (
            <table className="w-full border-collapse">
                <thead>
                <tr>
                    <th className="p-2 border-b border-r bg-gray-50 min-w-[200px] text-left sticky left-0 z-10">Employee</th>
                    {weekDays.map(day => (
                    <th key={day.toString()} className="p-2 border-b bg-gray-50 min-w-[100px] text-center">
                        <div className="text-sm font-medium">{format(day, 'EEE')}</div>
                        <div className="text-xs text-gray-500">{format(day, 'd')}</div>
                    </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="p-2 border-b border-r sticky left-0 bg-white z-10">
                        <div className="font-medium">{emp.first_name} {emp.last_name}</div>
                        <div className="text-xs text-gray-500">{teams.find(t => String(t.id) === String(emp.team))?.name}</div>
                    </td>
                    {weekDays.map(day => {
                        const assignment = getAssignment(emp.id, day);
                        const shiftType = assignment ? shiftTypes.find(s => String(s.id) === String(assignment.shift_type)) : null;

                        return (
                        <td
                            key={day.toString()}
                            className="p-1 border-b text-center relative"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, emp.id, day)}
                        >
                            {assignment && shiftType ? (
                            <div
                                className="p-2 rounded text-sm font-medium shadow-sm cursor-pointer border bg-blue-100 border-blue-200 text-blue-800"
                                onClick={() => handleRemove(assignment.id)}
                            >
                                {shiftType.name}
                            </div>
                            ) : (
                            <div className="h-10 w-full rounded border-2 border-dashed border-transparent hover:border-gray-200"></div>
                            )}
                        </td>
                        );
                    })}
                    </tr>
                ))}
                </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanningGrid;
