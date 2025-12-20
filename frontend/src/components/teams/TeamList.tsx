import React, { useState } from 'react';
import { useStore } from '../../store';
import type { Team } from '../../types';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';

const TeamList: React.FC = () => {
  const { teams, addTeam, updateTeam, deleteTeam, employees } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const initialTeam: Omit<Team, 'id'> = {
    name: '',
    targetShiftShare: 0,
    ruleIds: [],
  };

  const [formData, setFormData] = useState<Omit<Team, 'id'>>(initialTeam);

  const handleEdit = (team: Team) => {
    setEditingId(team.id);
    setFormData(team);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData(initialTeam);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData(initialTeam);
  };

  const handleSave = () => {
    if (editingId) {
      updateTeam(editingId, formData);
    } else {
      addTeam({ ...formData, id: crypto.randomUUID() });
    }
    handleCancel();
  };

  const handleChange = (field: keyof Team, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Teams</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={16} /> Add Team
        </button>
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white p-6 rounded shadow mb-6 border">
          <h3 className="text-xl font-semibold mb-4">{isCreating ? 'New Team' : 'Edit Team'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Target Shift Share (%)</label>
              <input
                type="number"
                value={formData.targetShiftShare}
                onChange={(e) => handleChange('targetShiftShare', Number(e.target.value))}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Team Lead</label>
              <select
                value={formData.teamLeadId || ''}
                onChange={(e) => handleChange('teamLeadId', e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">None</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.firstName} {e.lastName}
                  </option>
                ))}
              </select>
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
              <th className="p-3 text-left">Target Share</th>
              <th className="p-3 text-left">Team Lead</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No teams found.
                </td>
              </tr>
            )}
            {teams.map((team) => (
              <tr key={team.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{team.name}</td>
                <td className="p-3">{team.targetShiftShare}%</td>
                <td className="p-3">
                  {employees.find((e) => e.id === team.teamLeadId)
                    ? `${employees.find((e) => e.id === team.teamLeadId)?.firstName} ${
                        employees.find((e) => e.id === team.teamLeadId)?.lastName
                      }`
                    : '-'}
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => handleEdit(team)} className="text-blue-600 hover:text-blue-800 mr-2">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => deleteTeam(team.id)} className="text-red-600 hover:text-red-800">
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

export default TeamList;
