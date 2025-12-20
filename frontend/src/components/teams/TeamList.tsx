import React, { useState } from 'react';
import { useStore } from '../../store';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import type { Team } from '../../types';

const TeamList: React.FC = () => {
  const { teams, addTeam, updateTeam, deleteTeam, employees } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const initialTeam: Partial<Team> = {
    name: '',
    target_share: 0,
    shift_rules: []
  };

  const [formData, setFormData] = useState<Partial<Team>>(initialTeam);

  const handleEdit = (team: Team) => {
    setFormData(team);
    setEditingId(team.id);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setFormData(initialTeam);
    setEditingId(null);
    setIsEditing(false);
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (isCreating) {
      await addTeam(formData);
    } else if (isEditing && editingId) {
      await updateTeam(editingId, formData);
    }
    setIsEditing(false);
    setIsCreating(false);
    setFormData(initialTeam);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setFormData(initialTeam);
  };

  const handleChange = (field: keyof Team, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Teams</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} /> Add Team
        </button>
      </div>

      {(isEditing || isCreating) && (
        <div className="mb-8 p-4 bg-white rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">{isCreating ? 'New Team' : 'Edit Team'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Share (%)</label>
              <input
                type="number"
                value={formData.target_share || 0}
                onChange={(e) => handleChange('target_share', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Share</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teams.map((team) => {
              // Note: employees.team is an ID now
              const memberCount = employees.filter(e => String(e.team) === String(team.id)).length;
              return (
                <tr key={team.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users size={20} className="text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{team.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.target_share}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{memberCount} Employees</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(team)} className="text-blue-600 hover:text-blue-900 mr-4">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => deleteTeam(team.id)} className="text-red-600 hover:text-red-800">
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

export default TeamList;
