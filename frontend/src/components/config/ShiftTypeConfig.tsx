import React, { useState } from 'react';
import { useStore } from '../../store';
import type { ShiftType, Weekday } from '../../types';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';

const WEEKDAYS: Weekday[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const ShiftTypeConfig: React.FC = () => {
  const { shiftTypes, addShiftType, updateShiftType, deleteShiftType } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const initialShiftType: Omit<ShiftType, 'id'> = {
    name: '',
    startTime: '08:00',
    endTime: '16:00',
    requiredStaff: WEEKDAYS.reduce((acc, day) => {
      acc[day] = 0;
      return acc;
    }, {} as Record<Weekday, number>),
    color: '#3b82f6',
    weight: 1.0,
  };

  const [formData, setFormData] = useState<Omit<ShiftType, 'id'>>(initialShiftType);

  const handleEdit = (shiftType: ShiftType) => {
    setEditingId(shiftType.id);
    setFormData(shiftType);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData(initialShiftType);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData(initialShiftType);
  };

  const handleSave = () => {
    if (editingId) {
      updateShiftType(editingId, formData);
    } else {
      addShiftType({ ...formData, id: crypto.randomUUID() });
    }
    handleCancel();
  };

  const handleChange = (field: keyof ShiftType, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStaffChange = (day: Weekday, value: number) => {
    setFormData((prev) => ({
      ...prev,
      requiredStaff: {
        ...prev.requiredStaff,
        [day]: value,
      },
    }));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Shift Types</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={16} /> Add Shift Type
        </button>
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white p-6 rounded shadow mb-6 border">
          <h3 className="text-xl font-semibold mb-4">{isCreating ? 'New Shift Type' : 'Edit Shift Type'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              <label className="block text-sm font-medium mb-1">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="h-10 w-20 border rounded p-1"
                />
                <span className="text-sm text-gray-500">{formData.color}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Weight</label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => handleChange('weight', Number(e.target.value))}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">Required Staffing</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {WEEKDAYS.map((day) => (
                <div key={day}>
                  <label className="block text-xs font-bold mb-1">{day.slice(0, 3)}</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.requiredStaff[day]}
                    onChange={(e) => handleStaffChange(day, Number(e.target.value))}
                    className="w-full border rounded p-1 text-sm"
                  />
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
              <th className="p-3 text-left">Color</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Weight</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shiftTypes.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No shift types defined.
                </td>
              </tr>
            )}
            {shiftTypes.map((shift) => (
              <tr key={shift.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: shift.color }}
                  ></div>
                </td>
                <td className="p-3">{shift.name}</td>
                <td className="p-3">
                  {shift.startTime} - {shift.endTime}
                </td>
                <td className="p-3">{shift.weight}</td>
                <td className="p-3 text-right">
                  <button onClick={() => handleEdit(shift)} className="text-blue-600 hover:text-blue-800 mr-2">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => deleteShiftType(shift.id)} className="text-red-600 hover:text-red-800">
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

export default ShiftTypeConfig;
