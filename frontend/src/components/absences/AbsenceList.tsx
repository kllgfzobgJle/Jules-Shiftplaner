import React, { useState } from 'react';
import { useStore } from '../../store';
import type { Absence } from '../../types';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';
import { format } from 'date-fns';

const AbsenceList: React.FC = () => {
  const { absences, addAbsence, updateAbsence, deleteAbsence, employees } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const initialAbsence: Omit<Absence, 'id'> = {
    employeeId: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    type: 'VACATION',
    reason: '',
  };

  const [formData, setFormData] = useState<Omit<Absence, 'id'>>(initialAbsence);

  const handleEdit = (absence: Absence) => {
    setEditingId(absence.id);
    setFormData(absence);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData(initialAbsence);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData(initialAbsence);
  };

  const handleSave = () => {
    if (editingId) {
      updateAbsence(editingId, formData);
    } else {
      addAbsence({ ...formData, id: crypto.randomUUID() });
    }
    handleCancel();
  };

  const handleChange = (field: keyof Absence, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Absences</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={16} /> Record Absence
        </button>
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white p-6 rounded shadow mb-6 border">
          <h3 className="text-xl font-semibold mb-4">{isCreating ? 'New Absence' : 'Edit Absence'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Employee</label>
              <select
                value={formData.employeeId}
                onChange={(e) => handleChange('employeeId', e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">Select Employee</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.firstName} {e.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="VACATION">Vacation</option>
                <option value="SICK">Sick Leave</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Reason (Optional)</label>
              <input
                type="text"
                value={formData.reason || ''}
                onChange={(e) => handleChange('reason', e.target.value)}
                className="w-full border rounded p-2"
              />
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
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Period</th>
              <th className="p-3 text-left">Reason</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {absences.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No absences recorded.
                </td>
              </tr>
            )}
            {absences.map((absence) => {
              const emp = employees.find((e) => e.id === absence.employeeId);
              return (
                <tr key={absence.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    {emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown'}
                  </td>
                  <td className="p-3">{absence.type}</td>
                  <td className="p-3">
                    {absence.startDate} to {absence.endDate}
                  </td>
                  <td className="p-3">{absence.reason || '-'}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleEdit(absence)} className="text-blue-600 hover:text-blue-800 mr-2">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => deleteAbsence(absence.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AbsenceList;
