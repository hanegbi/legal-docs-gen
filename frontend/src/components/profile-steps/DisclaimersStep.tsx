import type { Disclaimers } from '../../api/profile-types';

interface DisclaimersStepProps {
  data: Disclaimers;
  onChange: (data: Partial<Disclaimers>) => void;
}

const DEFAULT_CARVE_OUTS = [
  'fraud or fraudulent misrepresentation',
  'death or personal injury caused by negligence',
  'gross negligence or willful misconduct',
  'non-excludable statutory rights under EU, UK, Israeli, or other consumer protection laws',
];

export default function DisclaimersStep({ data, onChange }: DisclaimersStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Disclaimers & Liability</h3>
        <p className="text-sm text-gray-600">
          Define warranty disclaimers and liability limitations
        </p>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={data.as_is_disclaimer}
            onChange={(e) => onChange({ as_is_disclaimer: e.target.checked })}
            className="mr-2"
          />
          "As Is" / "As Available" Disclaimer
        </label>
        <p className="text-sm text-gray-500 mt-1 ml-6">
          Service provided without warranties (standard for most SaaS)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Liability Cap Description <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., fees paid in last 12 months"
          value={data.liability_cap_description}
          onChange={(e) => onChange({ liability_cap_description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Maximum liability amount in case of claims
        </p>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={data.exclude_indirect_consequential}
            onChange={(e) => onChange({ exclude_indirect_consequential: e.target.checked })}
            className="mr-2"
          />
          Exclude indirect, incidental, special, consequential damages
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Liability Carve-Outs (What CANNOT be limited) <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500 mb-2">
          These are legally required exceptions - do not remove
        </p>
        <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
          {DEFAULT_CARVE_OUTS.map((carveOut) => (
            <div key={carveOut} className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span className="text-sm">{carveOut}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={data.user_indemnity_enabled}
            onChange={(e) => onChange({ user_indemnity_enabled: e.target.checked })}
            className="mr-2"
          />
          User Indemnification
        </label>
        <p className="text-sm text-gray-500 mt-1 ml-6">
          Users indemnify company for claims arising from their violations
        </p>
      </div>
    </div>
  );
}

