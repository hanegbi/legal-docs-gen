import type { AudienceEligibility } from '../../api/profile-types';

interface AudienceStepProps {
  data: AudienceEligibility;
  onChange: (data: Partial<AudienceEligibility>) => void;
}

export default function AudienceStep({ data, onChange }: AudienceStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Age <span className="text-red-500">*</span>
        </label>
        <select
          value={data.minimum_age}
          onChange={(e) => onChange({ minimum_age: Number(e.target.value) as 13 | 16 | 18 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={13}>13 years old</option>
          <option value={16}>16 years old</option>
          <option value={18}>18 years old</option>
        </select>
        <p className="text-sm text-gray-500 mt-1">
          General minimum age requirement for users
        </p>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={data.eea_uk_override_16}
            onChange={(e) => onChange({ eea_uk_override_16: e.target.checked })}
            className="mr-2"
          />
          Override to 16+ for EEA/UK (GDPR requirement)
        </label>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={data.allow_under_13_with_parental_consent}
            onChange={(e) => onChange({ allow_under_13_with_parental_consent: e.target.checked })}
            className="mr-2"
          />
          Allow under-13 with parental consent (requires COPPA compliance)
        </label>
      </div>

      {data.allow_under_13_with_parental_consent && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parental Consent Flow Description
          </label>
          <textarea
            placeholder="Describe how you obtain and verify parental consent..."
            value={data.parental_consent_flow_description || ''}
            onChange={(e) => onChange({ parental_consent_flow_description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <p className="text-sm text-yellow-600 mt-1">
            ⚠️ Warning: COPPA compliance requires specific parental consent mechanisms
          </p>
        </div>
      )}

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={data.allow_organizational_use}
            onChange={(e) => onChange({ allow_organizational_use: e.target.checked })}
            className="mr-2"
          />
          Allow users to act on behalf of an organization
        </label>
      </div>
    </div>
  );
}

