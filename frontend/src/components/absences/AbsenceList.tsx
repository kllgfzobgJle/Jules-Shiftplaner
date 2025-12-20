import React, { useState } from 'react';
import { useStore } from '../../store';
import { Plus, Trash2, Calendar, User } from 'lucide-react';
import type { Absence } from '../../types';

const AbsenceList: React.FC = () => {
  const { absences, employees, addAbsence, deleteAbsence } = useStore();
  const [isCreating, setIsCreating] = useState(false);

  const initialAbsence: Partial<Absence> = {
    employee: 0,
    start_date: '',
    end_date: '',
    reason: '',
    absence_type: 'VACATION'
  };

  const [formData, setFormData] = useState<Partial<Absence>>(initialAbsence);

  const handleCreate = async () => {
      await addAbsence(formData);
      setIsCreating(false);
      setFormData(initialAbsence);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Absences</h2>
        <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
          <Plus size={16} /> Add Absence
        </button>
      </div>

      {isCreating && (
        <div className="mb-6 p-4 bg-white rounded shadow border">
            <h3 className="font-bold mb-4">New Absence</h3>
            <div className="grid grid-cols-2 gap-4">
                <select
                    className="border p-2 rounded"
                    value={formData.employee}
                    onChange={e => setFormData({...formData, employee: Number(e.target.value)})}
                >
                    <option value={0}>Select Employee...</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
                </select>
                <select
                    className="border p-2 rounded"
                    value={formData.absence_type}
                    onChange={e => setFormData({...formData, absence_type: e.target.value as any})}
                >
                    <option value="VACATION">Vacation</option>
                    <option value="SICK">Sick</option>
                    <option value="OTHER">Other</option>
                </select>
                <input
                    type="date"
                    className="border p-2 rounded"
                    value={formData.start_date}
                    onChange={e => setFormData({...formData, start_date: e.target.value})}
                />
                <input
                    type="date"
                    className="border p-2 rounded"
                    value={formData.end_date}
                    onChange={e => setFormData({...formData, end_date: e.target.value})}
                />
                 <input
                    placeholder="Reason"
                    className="border p-2 rounded col-span-2"
                    value={formData.reason}
                    onChange={e => setFormData({...formData, reason: e.target.value})}
                />
            </div>
            <div className="mt-4 flex gap-2">
                <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                <button onClick={() => setIsCreating(false)} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
            </div>
        </div>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {absences.map(absence => {
                const emp = employees.find(e => String(e.id) === String(absence.employee));
                return (
                    <tr key={absence.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                                <User size={16} className="text-gray-400" />
                                <span className="text-sm font-medium text-gray-900">
                                    {emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown'}
                                </span>
                            </div>
                        </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                absence.absence_type === 'SICK' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                                {absence.absence_type}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {absence.start_date} - {absence.end_date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{absence.reason}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => deleteAbsence(absence.id)} className="text-red-600 hover:text-red-900">
                                <Trash2 size={16} />
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
