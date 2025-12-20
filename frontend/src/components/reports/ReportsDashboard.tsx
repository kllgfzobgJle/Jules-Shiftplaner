import React, { useMemo } from 'react';
import { useStore } from '../../store';
import { BarChart, PieChart, Activity, Users } from 'lucide-react';
import { differenceInHours, parse } from 'date-fns';

const ReportsDashboard: React.FC = () => {
  const { employees, assignments, shiftTypes, teams } = useStore();

  const metrics = useMemo(() => {
    const employeeStats: Record<string, { name: string; hours: number; shifts: number }> = {};
    const typeStats: Record<string, number> = {};

    // Initialize
    employees.forEach(e => {
      employeeStats[e.id] = {
        name: `${e.first_name} ${e.last_name}`,
        hours: 0,
        shifts: 0
      };
    });

    shiftTypes.forEach(s => {
        typeStats[s.id] = 0;
    });

    // Calculate
    assignments.forEach(assignment => {
      const empId = String(assignment.employee);
      const typeId = String(assignment.shift_type);
      const shift = shiftTypes.find(s => String(s.id) === typeId);

      if (shift && employeeStats[empId]) {
        // Calculate hours
        // Note: this is a simple calc assuming same-day shifts.
        // For overnight, date-fns diff handles it if we parse full datetimes.
        // Here we just use time strings relative to a dummy date.
        const start = parse(shift.start_time, 'HH:mm:ss', new Date());
        let end = parse(shift.end_time, 'HH:mm:ss', new Date());

        let duration = differenceInHours(end, start);
        if (duration < 0) duration += 24; // Handle overnight

        employeeStats[empId].hours += duration;
        employeeStats[empId].shifts += 1;

        if (typeStats[typeId] !== undefined) {
            typeStats[typeId] += 1;
        }
      }
    });

    return { employeeStats, typeStats };
  }, [employees, assignments, shiftTypes]);

  const sortedEmployees = Object.values(metrics.employeeStats).sort((a, b) => b.hours - a.hours);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Activity /> Reports & Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Utilization */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users size={20} /> Employee Workload
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3 text-right">Shifts</th>
                  <th className="px-4 py-3 text-right">Hours</th>
                  <th className="px-4 py-3 w-1/3">Load Distribution</th>
                </tr>
              </thead>
              <tbody>
                {sortedEmployees.map((stat, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-3 font-medium text-gray-900">{stat.name}</td>
                    <td className="px-4 py-3 text-right">{stat.shifts}</td>
                    <td className="px-4 py-3 text-right">{stat.hours.toFixed(1)}</td>
                    <td className="px-4 py-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${Math.min((stat.hours / 160) * 100, 100)}%` }} // Assume 160h base for bar
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shift Type Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChart size={20} /> Shift Distribution
          </h3>
          <div className="space-y-4">
             {Object.entries(metrics.typeStats).map(([typeId, count]) => {
                 const type = shiftTypes.find(s => String(s.id) === typeId);
                 if (!type) return null;
                 const total = assignments.length || 1;
                 const percent = ((count / total) * 100).toFixed(1);

                 return (
                    <div key={typeId}>
                        <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-gray-700">{type.name}</span>
                            <span className="text-sm font-medium text-gray-500">{count} ({percent}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-purple-600 h-2.5 rounded-full"
                                style={{ width: `${percent}%` }}
                            ></div>
                        </div>
                    </div>
                 );
             })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
