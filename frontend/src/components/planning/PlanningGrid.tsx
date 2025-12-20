import React, { useState, useMemo } from 'react';
import { useStore } from '../../store';
import { format, startOfWeek, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { validateAssignment } from '../../utils/validation';
import { clsx } from 'clsx';

const PlanningGrid: React.FC = () => {
  const { employees, shiftTypes, assignments, rules, addAssignment, removeAssignment, absences } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedShiftTypeId, setSelectedShiftTypeId] = useState<string | null>(null);

  // Show 14 days starting from start of week
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
  const dates = useMemo(() => Array.from({ length: 14 }, (_, i) => addDays(startDate, i)), [startDate]);

  const handlePrev = () => setCurrentDate((d) => addDays(d, -7));
  const handleNext = () => setCurrentDate((d) => addDays(d, 7));

  const handleCellClick = (employeeId: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingAssignment = assignments.find(
      (a) => a.employeeId === employeeId && a.date === dateStr
    );

    if (existingAssignment) {
      removeAssignment(existingAssignment.id);
      return;
    }

    if (!selectedShiftTypeId) return;

    const shiftType = shiftTypes.find((s) => s.id === selectedShiftTypeId);
    if (!shiftType) return;

    const employee = employees.find((e) => e.id === employeeId);
    if (!employee) return;

    // Check absence
    const isAbsent = absences.some(
      (a) =>
        a.employeeId === employeeId &&
        dateStr >= a.startDate &&
        dateStr <= a.endDate
    );

    if (isAbsent) {
      alert('Employee is absent on this date.');
      return;
    }

    const validation = validateAssignment(employee, shiftType, date, assignments, rules, shiftTypes);
    if (!validation.valid) {
      if (validation.type === 'error') {
        alert(validation.message);
        return; // Block assignment
      }
       // If warning, maybe confirm? For now, we block on error.
    }

    addAssignment({
      id: crypto.randomUUID(),
      employeeId,
      shiftTypeId: selectedShiftTypeId,
      date: dateStr,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Planning</h2>
          <div className="flex items-center gap-2">
            <button onClick={handlePrev} className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft size={20} />
            </button>
            <span className="font-medium">
              {format(dates[0], 'MMM d')} - {format(dates[dates.length - 1], 'MMM d, yyyy')}
            </span>
            <button onClick={handleNext} className="p-1 hover:bg-gray-100 rounded">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="flex gap-2 items-center overflow-x-auto max-w-2xl">
          <span className="text-sm font-medium text-gray-500">Tools:</span>
          {shiftTypes.map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedShiftTypeId(selectedShiftTypeId === st.id ? null : st.id)}
              className={clsx(
                'px-3 py-1 rounded text-sm font-medium border transition-all flex items-center gap-2 whitespace-nowrap',
                selectedShiftTypeId === st.id ? 'ring-2 ring-offset-1 ring-blue-500' : 'hover:bg-gray-50'
              )}
              style={{
                backgroundColor: st.color,
                color: parseInt(st.color.replace('#', ''), 16) > 0xffffff / 2 ? '#000' : '#fff', // Simple contrast
                borderColor: st.color,
              }}
            >
              {st.name}
            </button>
          ))}
          <button
            onClick={() => setSelectedShiftTypeId(null)}
            className={clsx(
              'px-3 py-1 rounded text-sm font-medium border hover:bg-gray-50',
               selectedShiftTypeId === null && 'bg-gray-200'
            )}
          >
            Cursor (Clear)
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="border-collapse w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="p-2 border sticky left-0 bg-gray-50 z-20 w-48 text-left">Employee</th>
              {dates.map((date) => (
                <th key={date.toISOString()} className="p-2 border min-w-[60px] text-center text-sm">
                  <div>{format(date, 'EEE')}</div>
                  <div>{format(date, 'd')}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="p-2 border sticky left-0 bg-white z-10 font-medium">
                  {employee.firstName} {employee.lastName}
                </td>
                {dates.map((date) => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const assignment = assignments.find(
                    (a) => a.employeeId === employee.id && a.date === dateStr
                  );
                  const shiftType = assignment ? shiftTypes.find((s) => s.id === assignment.shiftTypeId) : null;
                  const isAbsent = absences.some(
                    (a) =>
                      a.employeeId === employee.id &&
                      dateStr >= a.startDate &&
                      dateStr <= a.endDate
                  );

                  return (
                    <td
                      key={date.toISOString()}
                      onClick={() => handleCellClick(employee.id, date)}
                      className={clsx(
                        'p-1 border cursor-pointer h-12 relative text-center text-xs',
                        isAbsent && 'bg-red-100 repeating-linear-gradient(45deg,transparent,transparent 5px,#fff 5px,#fff 10px)'
                      )}
                    >
                      {isAbsent && <span className="text-red-500 font-bold">ABS</span>}

                      {!isAbsent && shiftType && (
                        <div
                          className="w-full h-full rounded flex items-center justify-center text-white font-medium"
                          style={{
                            backgroundColor: shiftType.color,
                            color: parseInt(shiftType.color.replace('#', ''), 16) > 0xffffff / 2 ? '#000' : '#fff',
                          }}
                        >
                          {shiftType.name}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlanningGrid;
