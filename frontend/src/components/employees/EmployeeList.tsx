import React, { useState } from 'react';
import { useStore } from '../../store';
import type { Employee, Weekday, Availability, AvailabilityType } from '../../types';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';
import { clsx } from 'clsx';

const WEEKDAYS: Weekday[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const EmployeeList: React.FC = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee, teams, shiftTypes } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Initial state for new employee
  const initialEmployee: Omit<Employee, 'id'> = {
    firstName: '',
    lastName: '',
    initials: '',
    type: 'TRAINED',
    workload: 100,
    allowedShiftTypes: [],
    suitability: {},
    availability: WEEKDAYS.reduce((acc, day) => {
      acc[day] = { am: 'AVAILABLE', pm: 'AVAILABLE' };
      return acc;
    }, {} as Record<Weekday, Availability>),
    preferredShifts: [],
  };

  const [formData, setFormData] = useState<Omit<Employee, 'id'>>(initialEmployee);

  const handleEdit = (employee: Employee) => {
    setEditingId(employee.id);
    setFormData(employee);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData(initialEmployee);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData(initialEmployee);
  };

  const handleSave = () => {
    if (editingId) {
      updateEmployee(editingId, formData);
    } else {
      addEmployee({ ...formData, id: crypto.randomUUID() });
    }
    handleCancel();
  };

  const handleChange = (field: keyof Employee, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAvailability = (day: Weekday, period: 'am' | 'pm') => {
    setFormData((prev) => {
      const current = prev.availability[day][period];
      let next: AvailabilityType = 'AVAILABLE';
      if (current === 'AVAILABLE') next = 'UNAVAILABLE';
      else if (current === 'UNAVAILABLE') next = 'PREFERRED';
      else next = 'AVAILABLE';

      return {
        ...prev,
        availability: {
          ...prev.availability,
          [day]: {
            ...prev.availability[day],
            [period]: next,
          },
        },
      };
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Employees</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white p-6 rounded shadow mb-6 border">
          <h3 className="text-xl font-semibold mb-4">{isCreating ? 'New Employee' : 'Edit Employee'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Initials</label>
              <input
                type="text"
                value={formData.initials}
                onChange={(e) => handleChange('initials', e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="TRAINED">Fully Trained</option>
                <option value="APPRENTICE_1">Apprentice Year 1</option>
                <option value="APPRENTICE_2">Apprentice Year 2</option>
                <option value="APPRENTICE_3">Apprentice Year 3</option>
                <option value="APPRENTICE_4">Apprentice Year 4</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Workload (%)</label>
              <input
                type="number"
                value={formData.workload}
                onChange={(e) => handleChange('workload', Number(e.target.value))}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Team</label>
              <select
                value={formData.teamId || ''}
                onChange={(e) => handleChange('teamId', e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">No Team</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Redundancy Group</label>
              <input
                type="text"
                value={formData.redundancyGroup || ''}
                onChange={(e) => handleChange('redundancyGroup', e.target.value)}
                className="w-full border rounded p-2"
                placeholder="e.g., LJ_Alpha"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Allowed Shift Types</label>
              <div className="max-h-40 overflow-y-auto border rounded p-2">
                {shiftTypes.map((st) => (
                  <label key={st.id} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={formData.allowedShiftTypes.includes(st.id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev) => {
                          const newAllowed = checked
                            ? [...prev.allowedShiftTypes, st.id]
                            : prev.allowedShiftTypes.filter((id) => id !== st.id);
                          return { ...prev, allowedShiftTypes: newAllowed };
                        });
                      }}
                    />
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: st.color }}
                    ></span>
                    {st.name}
                  </label>
                ))}
                {shiftTypes.length === 0 && <span className="text-gray-500 text-sm">No shift types defined.</span>}
              </div>
            </div>

            <div>
               <label className="block text-sm font-medium mb-2">Preferred Shifts</label>
               <div className="max-h-40 overflow-y-auto border rounded p-2">
                {shiftTypes.map((st) => (
                  <label key={st.id} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={formData.preferredShifts.includes(st.id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev) => {
                          const newPreferred = checked
                            ? [...prev.preferredShifts, st.id]
                            : prev.preferredShifts.filter((id) => id !== st.id);
                          return { ...prev, preferredShifts: newPreferred };
                        });
                      }}
                    />
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: st.color }}
                    ></span>
                    {st.name}
                  </label>
                ))}
                {shiftTypes.length === 0 && <span className="text-gray-500 text-sm">No shift types defined.</span>}
               </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Suitability (0-5)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {shiftTypes.map((st) => (
                <div key={st.id} className="flex flex-col">
                   <label className="text-xs font-medium truncate mb-1" title={st.name}>{st.name}</label>
                   <input
                     type="number"
                     min="0"
                     max="5"
                     value={formData.suitability[st.id] ?? 0}
                     onChange={(e) => {
                       const val = Number(e.target.value);
                       setFormData(prev => ({
                         ...prev,
                         suitability: { ...prev.suitability, [st.id]: val }
                       }));
                     }}
                     className="border rounded p-1 text-sm"
                   />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Availability (AM/PM)</h4>
            <div className="grid grid-cols-7 gap-2">
              {WEEKDAYS.map((day) => (
                <div key={day} className="text-center">
                  <div className="font-bold text-xs mb-1">{day.slice(0, 3)}</div>
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => toggleAvailability(day, 'am')}
                      className={clsx(
                        'text-xs py-1 rounded w-full',
                        formData.availability[day].am === 'AVAILABLE' && 'bg-green-100 text-green-800',
                        formData.availability[day].am === 'UNAVAILABLE' && 'bg-red-100 text-red-800',
                        formData.availability[day].am === 'PREFERRED' && 'bg-blue-100 text-blue-800'
                      )}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleAvailability(day, 'pm')}
                      className={clsx(
                        'text-xs py-1 rounded w-full',
                        formData.availability[day].pm === 'AVAILABLE' && 'bg-green-100 text-green-800',
                        formData.availability[day].pm === 'UNAVAILABLE' && 'bg-red-100 text-red-800',
                        formData.availability[day].pm === 'PREFERRED' && 'bg-blue-100 text-blue-800'
                      )}
                    >
                      PM
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button onClick={handleCancel} className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2">
              <X size={16} /> Cancel
            </button>
            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
              <Save size={16} /> Save
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Initials</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Workload</th>
              <th className="p-3 text-left">Team</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
            {employees.map((employee) => (
              <tr key={employee.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  {employee.firstName} {employee.lastName}
                </td>
                <td className="p-3">{employee.initials}</td>
                <td className="p-3">{employee.type.replace('_', ' ')}</td>
                <td className="p-3">{employee.workload}%</td>
                <td className="p-3">{teams.find((t) => t.id === employee.teamId)?.name || '-'}</td>
                <td className="p-3 text-right">
                  <button onClick={() => handleEdit(employee)} className="text-blue-600 hover:text-blue-800 mr-2">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => deleteEmployee(employee.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
