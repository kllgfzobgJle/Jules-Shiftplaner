import React, { useState } from 'react';
import { useStore } from '../../store';
import type { Rule } from '../../types';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';

const RuleConfig: React.FC = () => {
  const { rules, addRule, updateRule, deleteRule, shiftTypes, teams, employees } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const initialRule: Omit<Rule, 'id'> = {
    type: 'FORBIDDEN_SEQUENCE',
    name: '',
    params: {},
    scope: 'GLOBAL',
  };

  const [formData, setFormData] = useState<Omit<Rule, 'id'>>(initialRule);

  const handleEdit = (rule: Rule) => {
    setEditingId(rule.id);
    setFormData(rule);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData(initialRule);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData(initialRule);
  };

  const handleSave = () => {
    if (editingId) {
      updateRule(editingId, formData);
    } else {
      addRule({ ...formData, id: crypto.randomUUID() });
    }
    handleCancel();
  };

  const handleChange = (field: keyof Rule, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleParamChange = (param: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      params: {
        ...prev.params,
        [param]: value,
      },
    }));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Rules Configuration</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={16} /> Add Rule
        </button>
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white p-6 rounded shadow mb-6 border">
          <h3 className="text-xl font-semibold mb-4">{isCreating ? 'New Rule' : 'Edit Rule'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full border rounded p-2"
                placeholder="e.g., No late then early"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="FORBIDDEN_SEQUENCE">Forbidden Sequence</option>
                <option value="REQUIRED_SEQUENCE">Required Sequence</option>
                <option value="MANDATORY_FOLLOW_UP">Mandatory Follow-up</option>
                <option value="MAX_HOURS">Max Hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Scope</label>
              <select
                value={formData.scope}
                onChange={(e) => handleChange('scope', e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="GLOBAL">Global</option>
                <option value="TEAM">Team Specific</option>
                <option value="EMPLOYEE">Employee Specific</option>
              </select>
            </div>

            {formData.scope === 'TEAM' && (
              <div>
                <label className="block text-sm font-medium mb-1">Target Team</label>
                <select
                  value={formData.targetId || ''}
                  onChange={(e) => handleChange('targetId', e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select Team</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.scope === 'EMPLOYEE' && (
              <div>
                <label className="block text-sm font-medium mb-1">Target Employee</label>
                <select
                  value={formData.targetId || ''}
                  onChange={(e) => handleChange('targetId', e.target.value)}
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
            )}
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="font-semibold mb-2">Parameters</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(formData.type === 'FORBIDDEN_SEQUENCE' || formData.type === 'REQUIRED_SEQUENCE' || formData.type === 'MANDATORY_FOLLOW_UP') && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">From Shift</label>
                    <select
                      value={formData.params.fromShiftTypeId || ''}
                      onChange={(e) => handleParamChange('fromShiftTypeId', e.target.value)}
                      className="w-full border rounded p-2"
                    >
                      <option value="">Select Shift Type</option>
                      {shiftTypes.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">To Shift</label>
                    <select
                      value={formData.params.toShiftTypeId || ''}
                      onChange={(e) => handleParamChange('toShiftTypeId', e.target.value)}
                      className="w-full border rounded p-2"
                    >
                      <option value="">Select Shift Type</option>
                      {shiftTypes.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {formData.type === 'MAX_HOURS' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Hours</label>
                    <input
                      type="number"
                      value={formData.params.maxHours || ''}
                      onChange={(e) => handleParamChange('maxHours', Number(e.target.value))}
                      className="w-full border rounded p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Timeframe (days)</label>
                    <input
                      type="number"
                      value={formData.params.timeframe || ''}
                      onChange={(e) => handleParamChange('timeframe', Number(e.target.value))}
                      className="w-full border rounded p-2"
                    />
                  </div>
                </>
              )}
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
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Scope</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No rules defined.
                </td>
              </tr>
            )}
            {rules.map((rule) => (
              <tr key={rule.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{rule.name}</td>
                <td className="p-3">{rule.type.replace('_', ' ')}</td>
                <td className="p-3">{rule.scope}</td>
                <td className="p-3 text-right">
                  <button onClick={() => handleEdit(rule)} className="text-blue-600 hover:text-blue-800 mr-2">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => deleteRule(rule.id)} className="text-red-600 hover:text-red-800">
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

export default RuleConfig;
