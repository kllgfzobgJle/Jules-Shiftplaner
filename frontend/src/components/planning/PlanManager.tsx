import React, { useState } from 'react';
import { useStore } from '../../store';
import { Plus, Trash2, Check, X, Calendar } from 'lucide-react';
import type { ShiftPlan } from '../../types';
import { addWeeks, format } from 'date-fns';

const PlanManager: React.FC = () => {
  const { shiftPlans, activePlanId, setActivePlanId, addShiftPlan, deleteShiftPlan } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleCreate = async () => {
    if (!newPlanName) return;

    // Default 4 weeks
    const end = format(addWeeks(new Date(startDate), 4), 'yyyy-MM-dd');

    const newPlan: Partial<ShiftPlan> = {
        name: newPlanName,
        start_date: startDate,
        end_date: end,
        is_public: false
    };

    await addShiftPlan(newPlan);
    setIsCreating(false);
    setNewPlanName('');
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold flex items-center gap-2"><Calendar size={20}/> Shift Plans</h3>
            <button
                onClick={() => setIsCreating(true)}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
                New Plan
            </button>
        </div>

        {isCreating && (
            <div className="mb-4 p-3 border rounded bg-gray-50">
                <div className="grid gap-2">
                    <input
                        type="text"
                        placeholder="Plan Name"
                        className="border p-2 rounded"
                        value={newPlanName}
                        onChange={(e) => setNewPlanName(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Start Date:</span>
                        <input
                            type="date"
                            className="border p-2 rounded"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 mt-2">
                        <button onClick={handleCreate} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Create</button>
                        <button onClick={() => setIsCreating(false)} className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm">Cancel</button>
                    </div>
                </div>
            </div>
        )}

        <div className="space-y-2 max-h-60 overflow-y-auto">
            {shiftPlans.map(plan => (
                <div
                    key={plan.id}
                    className={`p-3 rounded border cursor-pointer flex justify-between items-center ${activePlanId === plan.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'hover:bg-gray-50'}`}
                    onClick={() => setActivePlanId(plan.id)}
                >
                    <div>
                        <div className="font-medium text-sm">{plan.name}</div>
                        <div className="text-xs text-gray-500">{plan.start_date} - {plan.end_date}</div>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); deleteShiftPlan(plan.id); }}
                        className="text-gray-400 hover:text-red-500"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}
            {shiftPlans.length === 0 && <div className="text-sm text-gray-500 text-center py-4">No plans created yet.</div>}
        </div>
    </div>
  );
};

export default PlanManager;
