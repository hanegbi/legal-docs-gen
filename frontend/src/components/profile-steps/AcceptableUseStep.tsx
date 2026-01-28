import { useState } from 'react';
import type { AcceptableUsePolicy } from '../../api/profile-types';

interface AcceptableUseStepProps {
  data: AcceptableUsePolicy;
  onChange: (data: Partial<AcceptableUsePolicy>) => void;
}

const DEFAULT_PROHIBITED_ACTS = [
  'Unlawful or illegal activities',
  'Infringement of intellectual property rights',
  'Harassment, abuse, or threatening conduct',
  'Spam or unsolicited communications',
  'Malware, viruses, or harmful software',
  'Unauthorized access or security breaches',
  'Scraping or automated data collection',
  'Service overload or denial of service attacks',
];

export default function AcceptableUseStep({ data, onChange }: AcceptableUseStepProps) {
  const [customAct, setCustomAct] = useState('');

  const toggleProhibitedAct = (act: string) => {
    const current = data.prohibited_acts || [];
    const updated = current.includes(act)
      ? current.filter(a => a !== act)
      : [...current, act];
    onChange({ prohibited_acts: updated });
  };

  const addCustomAct = () => {
    if (customAct.trim()) {
      onChange({ prohibited_acts: [...(data.prohibited_acts || []), customAct.trim()] });
      setCustomAct('');
    }
  };

  const removeCustomAct = (act: string) => {
    onChange({ prohibited_acts: (data.prohibited_acts || []).filter(a => a !== act) });
  };

  const customActs = (data.prohibited_acts || []).filter(act => !DEFAULT_PROHIBITED_ACTS.includes(act));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Acceptable Use Policy <span className="text-red-500">*</span></h3>
        <p className="text-sm text-gray-600">
          Define prohibited activities on your platform
        </p>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Common Prohibited Acts</h4>
        <div className="space-y-2">
          {DEFAULT_PROHIBITED_ACTS.map((act) => (
            <label key={act} className="flex items-center">
              <input
                type="checkbox"
                checked={data.prohibited_acts?.includes(act)}
                onChange={() => toggleProhibitedAct(act)}
                className="mr-2"
              />
              {act}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Add Custom Prohibited Act</h4>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g., Impersonation of others"
            value={customAct}
            onChange={(e) => setCustomAct(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            onKeyPress={(e) => e.key === 'Enter' && addCustomAct()}
          />
          <button
            onClick={addCustomAct}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        {customActs.length > 0 && (
          <div className="mt-3 space-y-1">
            {customActs.map((act) => (
              <div key={act} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                <span className="text-sm">{act}</span>
                <button
                  onClick={() => removeCustomAct(act)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={data.ugc_enabled}
            onChange={(e) => onChange({ ugc_enabled: e.target.checked })}
            className="mr-2"
          />
          Enable User-Generated Content (UGC)
        </label>
        <p className="text-sm text-gray-500 mt-1 ml-6">
          Check this if users can post, upload, or share content on your platform
        </p>
      </div>

      {data.ugc_enabled && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UGC License to Service
            </label>
            <textarea
              placeholder="Describe the license users grant to your service for their content..."
              value={data.ugc_license_to_service || ''}
              onChange={(e) => onChange({ ugc_license_to_service: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moderation & Appeals Process
            </label>
            <textarea
              placeholder="Describe how you moderate content and handle appeals..."
              value={data.moderation_appeals || ''}
              onChange={(e) => onChange({ moderation_appeals: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DMCA Contact Email (US)
            </label>
            <input
              type="email"
              placeholder="dmca@company.com"
              value={data.dmca_contact || ''}
              onChange={(e) => onChange({ dmca_contact: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
}

