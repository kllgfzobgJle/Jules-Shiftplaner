import React, { useState } from 'react';
import { useStore } from '../../store';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';
import type { ShiftType, Weekday } from '../../types';

const WEEKDAYS: Weekday[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const ShiftTypeConfig: React.FC = () => {
  const { shiftTypes, addShiftType, updateShiftType, deleteShiftType } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const initialShiftType: Partial<ShiftType> = {
    name: '',
    start_time: '09:00:00',
    end_time: '17:00:00',
    monday_required: 0,
    tuesday_required: 0,
    wednesday_required: 0,
    thursday_required: 0,
    friday_required: 0,
    saturday_required: 0,
    sunday_required: 0
  };

  const [formData, setFormData] = useState<Partial<ShiftType>>(initialShiftType);

  const handleEdit = (shiftType: ShiftType) => {
    setFormData(shiftType);
    setEditingId(shiftType.id);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setFormData(initialShiftType);
    setEditingId(null);
    setIsEditing(false);
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (isCreating) {
      await addShiftType(formData);
    } else if (isEditing && editingId) {
      await updateShiftType(editingId, formData);
    }
    setIsEditing(false);
    setIsCreating(false);
    setFormData(initialShiftType);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setFormData(initialShiftType);
  };

  const handleChange = (field: keyof ShiftType, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Shift Types</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} /> Add Shift Type
        </button>
      </div>

      {(isEditing || isCreating) && (
        <div className="mb-8 p-4 bg-white rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">{isCreating ? 'New Shift Type' : 'Edit Shift Type'}</h3>
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
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={formData.start_time?.slice(0, 5) || ''}
                  onChange={(e) => handleChange('start_time', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  value={formData.end_time?.slice(0, 5) || ''}
                  onChange={(e) => handleChange('end_time', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Staff Requirements</label>
            <div className="grid grid-cols-7 gap-2">
              {WEEKDAYS.map(day => (
                <div key={day} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">{day.slice(0, 3)}</div>
                  <input
                    type="number"
                    min="0"
                    value={formData[`${day.toLowerCase()}_required` as keyof ShiftType] as number || 0}
                    onChange={(e) => handleChange(`${day.toLowerCase()}_required` as keyof ShiftType, Number(e.target.value))}
                    className="w-full px-2 py-1 text-sm border rounded-md text-center"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={handleCancel} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shiftTypes.map((shift) => (
          <div key={shift.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gray-500" />
                <h3 className="font-semibold text-lg">{shift.name}</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(shift)} className="text-blue-600 hover:text-blue-800">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => deleteShiftType(shift.id)} className="text-red-600 hover:text-red-800">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-3">
              {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
            </div>
            <div className="text-xs text-gray-500">
              <div className="font-medium mb-1">Requirements:</div>
              <div className="flex justify-between">
                {WEEKDAYS.map(day => (
                  <span key={day} className={
                    (shift[`${day.toLowerCase()}_required` as keyof ShiftType] as number) > 0
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-300'
                  }>
                    {day.slice(0, 1)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShiftTypeConfig;
