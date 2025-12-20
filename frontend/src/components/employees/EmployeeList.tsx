import React, { useState } from 'react';
import { useStore } from '../../store';
import { Plus, Edit2, Trash2, User } from 'lucide-react';
import type { Employee, Weekday, Availability } from '../../types';

const WEEKDAYS: Weekday[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const EmployeeList: React.FC = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee, teams } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Helper for safe casting or default values
  const initialEmployee: Partial<Employee> = {
    first_name: '',
    last_name: '',
    abbreviation: '',
    employee_type: 'FULL',
    workload_percentage: 100,
    team: 0,
    allowed_shift_types: [],
    suitability: {},
    availability: WEEKDAYS.reduce((acc, day) => ({
      ...acc,
      [day]: { am: 'AVAILABLE', pm: 'AVAILABLE' }
    }), {} as Record<Weekday, Availability>)
  };

  const [formData, setFormData] = useState<Partial<Employee>>(initialEmployee);

  const handleEdit = (employee: Employee) => {
    setFormData(employee);
    setEditingId(employee.id);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setFormData(initialEmployee);
    setEditingId(null);
    setIsEditing(false);
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (isCreating) {
      await addEmployee(formData);
    } else if (isEditing && editingId) {
      await updateEmployee(editingId, formData);
    }
    setIsEditing(false);
    setIsCreating(false);
    setFormData(initialEmployee);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setFormData(initialEmployee);
  };

  const handleChange = (field: keyof Employee, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Employees</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {(isEditing || isCreating) && (
        <div className="mb-8 p-4 bg-white rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">{isCreating ? 'New Employee' : 'Edit Employee'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={formData.first_name || ''}
                onChange={(e) => handleChange('first_name', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.last_name || ''}
                onChange={(e) => handleChange('last_name', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initials</label>
              <input
                type="text"
                value={formData.abbreviation || ''}
                onChange={(e) => handleChange('abbreviation', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.employee_type || 'FULL'}
                onChange={(e) => handleChange('employee_type', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="FULL">Full Time</option>
                <option value="APPRENTICE">Apprentice</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Workload (%)</label>
              <input
                type="number"
                value={formData.workload_percentage || 100}
                onChange={(e) => handleChange('workload_percentage', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
              <select
                value={formData.team || ''}
                onChange={(e) => handleChange('team', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Team</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={handleCancel} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initials</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workload</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{employee.first_name} {employee.last_name}</div>
                      <div className="text-sm text-gray-500">{teams.find(t => String(t.id) === String(employee.team))?.name || 'No Team'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.abbreviation}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    employee.employee_type === 'FULL' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {employee.employee_type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.workload_percentage}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(employee)} className="text-blue-600 hover:text-blue-900 mr-4">
                    <Edit2 size={18} />
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
