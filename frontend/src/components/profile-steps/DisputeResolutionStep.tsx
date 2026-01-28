import type { DisputeResolution } from '../../api/profile-types';

interface DisputeResolutionStepProps {
  data: DisputeResolution;
  onChange: (data: Partial<DisputeResolution>) => void;
}

export default function DisputeResolutionStep({ data, onChange }: DisputeResolutionStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Dispute Resolution</h3>
        <p className="text-sm text-gray-600">
          Define how legal disputes will be handled
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dispute Resolution Method <span className="text-red-500">*</span>
        </label>
        <select
          value={data.dispute_path}
          onChange={(e) => onChange({ dispute_path: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          <option value="courts">Courts (litigation)</option>
          <option value="arbitration">Arbitration</option>
          <option value="mediation">Mediation</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Venue (Court Location or Arbitration Forum) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Cook County, Illinois or Tel Aviv, Israel"
          value={data.venue}
          onChange={(e) => onChange({ venue: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Should match your jurisdictions served
        </p>
      </div>

      {data.dispute_path === 'arbitration' && (
        <>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={data.has_class_action_waiver}
                onChange={(e) => onChange({ has_class_action_waiver: e.target.checked })}
                className="mr-2"
              />
              Class Action Waiver
            </label>
            <p className="text-sm text-gray-500 mt-1 ml-6">
              Prevent users from bringing class action lawsuits (common in US arbitration)
            </p>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={data.has_small_claims_carveout}
                onChange={(e) => onChange({ has_small_claims_carveout: e.target.checked })}
                className="mr-2"
              />
              Small Claims Court Carve-Out
            </label>
            <p className="text-sm text-gray-500 mt-1 ml-6">
              Allow small claims court option (recommended for fairness)
            </p>
          </div>
        </>
      )}
    </div>
  );
}

