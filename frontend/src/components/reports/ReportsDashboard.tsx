import React from 'react';
import { useStore } from '../../store';

const ReportsDashboard: React.FC = () => {
  const { employees, assignments, shiftTypes, teams } = useStore();

  const totalAssignments = assignments.length;
  const uniqueEmployees = new Set(assignments.map(a => a.employeeId)).size;

  // Calculate assignments per shift type
  const assignmentsByShiftType = shiftTypes.map(st => ({
    name: st.name,
    color: st.color,
    count: assignments.filter(a => a.shiftTypeId === st.id).length
  }));

  // Calculate assignments per team
  const assignmentsByTeam = teams.map(t => {
     const teamEmployeeIds = employees.filter(e => e.teamId === t.id).map(e => e.id);
     return {
       name: t.name,
       count: assignments.filter(a => teamEmployeeIds.includes(a.employeeId)).length
     };
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Reports & Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow border">
          <h3 className="text-gray-500 text-sm font-medium">Total Shifts Assigned</h3>
          <p className="text-3xl font-bold mt-2">{totalAssignments}</p>
        </div>
        <div className="bg-white p-4 rounded shadow border">
          <h3 className="text-gray-500 text-sm font-medium">Active Employees (Scheduled)</h3>
          <p className="text-3xl font-bold mt-2">{uniqueEmployees} / {employees.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded shadow border">
          <h3 className="text-lg font-bold mb-4">Distribution by Shift Type</h3>
          <div className="space-y-4">
            {assignmentsByShiftType.map(item => (
              <div key={item.name} className="flex items-center">
                <div className="w-32 text-sm font-medium">{item.name}</div>
                <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
                  <div
                    className="h-full rounded"
                    style={{ width: `${totalAssignments ? (item.count / totalAssignments) * 100 : 0}%`, backgroundColor: item.color }}
                  ></div>
                </div>
                <div className="w-12 text-right text-sm text-gray-600">{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow border">
          <h3 className="text-lg font-bold mb-4">Distribution by Team</h3>
          <div className="space-y-4">
            {assignmentsByTeam.map(item => (
              <div key={item.name} className="flex items-center">
                <div className="w-32 text-sm font-medium">{item.name}</div>
                <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded"
                    style={{ width: `${totalAssignments ? (item.count / totalAssignments) * 100 : 0}%` }}
                  ></div>
                </div>
                <div className="w-12 text-right text-sm text-gray-600">{item.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
