import { useState } from 'react';
import type { DataCategory } from '../../api/profile-types';

interface DataStepProps {
  data: DataCategory[];
  onChange: (data: DataCategory[]) => void;
}

const PRESET_CATEGORIES = [
  { category: 'Account identifiers', source: 'user' as const, purposes: ['Service delivery', 'Account management'], shared_with: ['Processors'] },
  { category: 'Contact information', source: 'user' as const, purposes: ['Communications', 'Support'], shared_with: ['Processors'] },
  { category: 'Payment information', source: 'user' as const, purposes: ['Payments', 'Billing'], shared_with: ['Payment processors'] },
  { category: 'Usage data', source: 'automated' as const, purposes: ['Analytics', 'Service improvement'], shared_with: ['Analytics providers'] },
  { category: 'Device information', source: 'automated' as const, purposes: ['Security', 'Service optimization'], shared_with: ['Processors'] },
];

export default function DataStep({ data, onChange }: DataStepProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState<DataCategory>({
    category: '',
    source: 'user',
    purposes: [],
    shared_with: [],
  });

  const addPresetCategory = (preset: DataCategory) => {
    if (!data.some(cat => cat.category === preset.category)) {
      onChange([...data, { ...preset }]);
    }
  };

  const addCustomCategory = () => {
    if (newCategory.category && newCategory.purposes.length > 0) {
      onChange([...data, { ...newCategory }]);
      setNewCategory({ category: '', source: 'user', purposes: [], shared_with: [] });
      setShowAddForm(false);
    }
  };

  const removeCategory = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Data Collection Categories <span className="text-red-500">*</span></h3>
        <p className="text-sm text-gray-600 mb-4">
          Define what data you collect, why, and who you share it with
        </p>
      </div>

      {data.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            You must add at least one data category. Use preset categories or add custom ones.
          </p>
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium mb-2">Quick Add: Common Categories</h4>
        <div className="flex flex-wrap gap-2">
          {PRESET_CATEGORIES.map((preset) => (
            <button
              key={preset.category}
              onClick={() => addPresetCategory(preset)}
              disabled={data.some(cat => cat.category === preset.category)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + {preset.category}
            </button>
          ))}
        </div>
      </div>

      {data.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Current Categories</h4>
          <div className="space-y-2">
            {data.map((category, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-3 bg-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{category.category}</p>
                    <p className="text-sm text-gray-600">Source: {category.source}</p>
                    <p className="text-sm text-gray-600">Purposes: {category.purposes.join(', ')}</p>
                    <p className="text-sm text-gray-600">Shared with: {category.shared_with.join(', ')}</p>
                  </div>
                  <button
                    onClick={() => removeCategory(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            + Add Custom Category
          </button>
        ) : (
          <div className="border border-gray-300 rounded-lg p-4 space-y-3">
            <input
              type="text"
              placeholder="Category name (e.g., Location data)"
              value={newCategory.category}
              onChange={(e) => setNewCategory({ ...newCategory, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <select
              value={newCategory.source}
              onChange={(e) => setNewCategory({ ...newCategory, source: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="user">User-provided</option>
              <option value="automated">Automatically collected</option>
              <option value="third-party">Third-party sources</option>
            </select>
            <input
              type="text"
              placeholder="Purposes (comma-separated)"
              value={newCategory.purposes.join(', ')}
              onChange={(e) => setNewCategory({ ...newCategory, purposes: e.target.value.split(',').map(p => p.trim()) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Shared with (comma-separated)"
              value={newCategory.shared_with.join(', ')}
              onChange={(e) => setNewCategory({ ...newCategory, shared_with: e.target.value.split(',').map(p => p.trim()) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <div className="flex gap-2">
              <button onClick={addCustomCategory} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Add
              </button>
              <button onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

