import type { ProductInfo } from '../../api/profile-types';

interface ProductStepProps {
  data: ProductInfo;
  onChange: (data: Partial<ProductInfo>) => void;
}

const PLATFORM_OPTIONS = ['Web', 'iOS', 'Android', 'Desktop', 'API'];
const SERVICE_TYPES = ['SaaS', 'Marketplace', 'API Service', 'Mobile App', 'Web App', 'Other'];

export default function ProductStep({ data, onChange }: ProductStepProps) {
  const handlePlatformToggle = (platform: string) => {
    const current = data.platforms || [];
    const updated = current.includes(platform)
      ? current.filter(p => p !== platform)
      : [...current, platform];
    onChange({ platforms: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product/Service Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., My Awesome App"
          value={data.product_name}
          onChange={(e) => onChange({ product_name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Type
        </label>
        <select
          value={data.service_type || ''}
          onChange={(e) => onChange({ service_type: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select type...</option>
          {SERVICE_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Platforms
        </label>
        <div className="flex flex-wrap gap-3">
          {PLATFORM_OPTIONS.map((platform) => (
            <label key={platform} className="flex items-center">
              <input
                type="checkbox"
                checked={data.platforms?.includes(platform)}
                onChange={() => handlePlatformToggle(platform)}
                className="mr-2"
              />
              {platform}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={data.has_beta_features}
            onChange={(e) => onChange({ has_beta_features: e.target.checked })}
            className="mr-2"
          />
          Has Beta/Experimental Features
        </label>
      </div>

      {data.has_beta_features && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Beta Features Note
          </label>
          <textarea
            placeholder="Describe beta features..."
            value={data.beta_note || ''}
            onChange={(e) => onChange({ beta_note: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
      )}
    </div>
  );
}

