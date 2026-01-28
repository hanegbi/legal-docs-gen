import type { OrganizationInfo } from '../../api/profile-types';

interface OrganizationStepProps {
  data: OrganizationInfo;
  profileName: string;
  onChange: (data: Partial<OrganizationInfo>) => void;
  onProfileNameChange: (name: string) => void;
}

const JURISDICTION_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'EU', label: 'European Union' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'IL', label: 'Israel' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
];

export default function OrganizationStep({ data, profileName, onChange, onProfileNameChange }: OrganizationStepProps) {
  const handleJurisdictionToggle = (value: string) => {
    const current = data.jurisdictions_served || [];
    const updated = current.includes(value)
      ? current.filter(j => j !== value)
      : [...current, value];
    onChange({ jurisdictions_served: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., My Company Profile"
          value={profileName}
          onChange={(e) => onProfileNameChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Give this profile a memorable name (e.g., "Acme Inc Production")
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Legal Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Acme Inc."
          value={data.company_legal_name}
          onChange={(e) => onChange({ company_legal_name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Registered/Postal Address <span className="text-red-500">*</span>
        </label>
        <textarea
          placeholder="Full business address"
          value={data.registered_address}
          onChange={(e) => onChange({ registered_address: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Privacy Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="privacy@company.com"
            value={data.privacy_email}
            onChange={(e) => onChange({ privacy_email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Legal Notices Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="legal@company.com"
            value={data.legal_notices_email}
            onChange={(e) => onChange({ legal_notices_email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jurisdictions Served <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {JURISDICTION_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="checkbox"
                checked={data.jurisdictions_served?.includes(option.value)}
                onChange={() => handleJurisdictionToggle(option.value)}
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Effective Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={data.effective_date}
          onChange={(e) => onChange({ effective_date: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
    </div>
  );
}

