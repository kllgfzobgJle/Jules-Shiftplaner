import React, { useState } from 'react';
import { useStore } from '../../store';
import { Plus, Trash2, ShieldAlert } from 'lucide-react';
import type { ShiftRule } from '../../types';

const RuleConfig: React.FC = () => {
  const { rules, shiftTypes, addRule, deleteRule } = useStore();
  const [isCreating, setIsCreating] = useState(false);

  const initialRule: Partial<ShiftRule> = {
    name: '',
    rule_type: 'FORBIDDEN_SEQUENCE',
    from_shift_type: 0,
    to_shift_type: 0,
    is_same_day: false
  };

  const [formData, setFormData] = useState<Partial<ShiftRule>>(initialRule);

  const handleCreate = async () => {
      await addRule(formData);
      setIsCreating(false);
      setFormData(initialRule);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Shift Rules</h2>
        <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
          <Plus size={16} /> Add Rule
        </button>
      </div>

      {isCreating && (
        <div className="mb-6 p-4 bg-white rounded shadow border">
            <h3 className="font-bold mb-4">New Rule</h3>
            <div className="grid grid-cols-2 gap-4">
                <input
                    placeholder="Name"
                    className="border p-2 rounded"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                />
                 <select
                    className="border p-2 rounded"
                    value={formData.rule_type}
                    onChange={e => setFormData({...formData, rule_type: e.target.value as any})}
                >
                    <option value="FORBIDDEN_SEQUENCE">Forbidden Sequence</option>
                    <option value="REQUIRED_SEQUENCE">Required Sequence</option>
                    <option value="MANDATORY_FOLLOW_UP">Mandatory Follow Up</option>
                </select>
                <select
                    className="border p-2 rounded"
                    value={formData.from_shift_type}
                    onChange={e => setFormData({...formData, from_shift_type: Number(e.target.value)})}
                >
                    <option value={0}>From Shift...</option>
                    {shiftTypes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <select
                    className="border p-2 rounded"
                    value={formData.to_shift_type}
                    onChange={e => setFormData({...formData, to_shift_type: Number(e.target.value)})}
                >
                    <option value={0}>To Shift...</option>
                    {shiftTypes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>
            <div className="mt-4 flex gap-2">
                <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                <button onClick={() => setIsCreating(false)} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
            </div>
        </div>
      )}

      <div className="grid gap-4">
        {rules.map(rule => (
            <div key={rule.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <ShieldAlert className="text-orange-500" />
                    <div>
                        <div className="font-bold">{rule.name}</div>
                        <div className="text-sm text-gray-500">{rule.rule_type}</div>
                    </div>
                </div>
                <button onClick={() => deleteRule(rule.id)} className="text-red-500"><Trash2 size={18} /></button>
            </div>
        ))}
      </div>
    </div>
  );
};

export default RuleConfig;
