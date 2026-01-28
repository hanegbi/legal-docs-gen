import type { IntellectualProperty } from '../../api/profile-types';

interface IPStepProps {
  data: IntellectualProperty;
  onChange: (data: Partial<IntellectualProperty>) => void;
}

export default function IPStep({ data, onChange }: IPStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Intellectual Property</h3>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={data.service_ip_retained_by_company}
            onChange={(e) => onChange({ service_ip_retained_by_company: e.target.checked })}
            className="mr-2"
          />
          Service IP retained by company
        </label>
        <p className="text-sm text-gray-500 mt-1 ml-6">
          You retain all rights to your service, platform, and content (excluding user content)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          End-User License Text (Optional)
        </label>
        <textarea
          placeholder="Customize the license granted to users (leave blank for standard license)"
          value={data.end_user_license_text || ''}
          onChange={(e) => onChange({ end_user_license_text: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={3}
        />
        <p className="text-sm text-gray-500 mt-1">
          Default: Limited, non-exclusive, non-transferable, revocable license for personal use
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Feedback License (Optional)
        </label>
        <textarea
          placeholder="Define rights to user feedback, suggestions, and ideas..."
          value={data.feedback_license || ''}
          onChange={(e) => onChange({ feedback_license: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Open-Source Notices URL (Optional)
        </label>
        <input
          type="url"
          placeholder="https://company.com/open-source-notices"
          value={data.open_source_notices_url || ''}
          onChange={(e) => onChange({ open_source_notices_url: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
}

