import { useState, useEffect } from 'react';
import type { CompanyProfile } from '../api/profile-types';
import type { ToSForm, ToSGenerateResponse } from '../api/tos-types';
import type { PrivacyForm, PrivacyGenerateResponse } from '../api/privacy-types';
import { saveToSForm, generateTermsOfService, savePrivacyForm, generatePrivacyPolicy, updateProfile } from '../api/client';

interface UnifiedDocumentFormProps {
  profile: CompanyProfile;
  onGenerate: (documentType: 'tos' | 'privacy', form: any) => void;
  onSave: (documentType: 'tos' | 'privacy', form: any) => void;
}

const PLATFORMS = ['Web', 'iOS', 'Android', 'Desktop', 'API'];
const SERVICE_TYPES = ['SaaS', 'Marketplace', 'API Service', 'Mobile App', 'Web App', 'Other'];
const DATA_CATEGORIES = [
  'Account identifiers', 'Contact information', 'Payment information', 
  'Usage data', 'Device information', 'Location data', 'User-generated content'
];
const PROHIBITED_ACTS = [
  'Unlawful or illegal activities',
  'Infringement of intellectual property rights',
  'Harassment, abuse, or threatening conduct',
  'Spam or unsolicited communications',
  'Malware, viruses, or harmful software',
  'Unauthorized access or security breaches',
  'Scraping or automated data collection',
  'Service overload or denial of service attacks'
];

export default function UnifiedDocumentForm({ profile, onGenerate, onSave }: UnifiedDocumentFormProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<('tos' | 'privacy')[]>([]);
  const [activeTab, setActiveTab] = useState<'basic' | 'tos' | 'privacy'>('basic');
  
  // Unified form data
  const [form, setForm] = useState({
    // Basic info (shared between both documents)
    product_name: profile.product?.product_name || '',
    product_description: '',
    service_type: '',
    platforms: [] as string[],
    has_beta_features: profile.product?.has_beta_features || false,
    beta_note: profile.product?.beta_note || '',
    minimum_age: profile.audience?.minimum_age || 13,
    allow_under_13_with_parental_consent: profile.audience?.allow_under_13_with_parental_consent || false,
    allow_organizational_use: profile.audience?.allow_organizational_use || true,
    
    // ToS specific
    data_categories: profile.data_categories || [],
    prohibited_acts: profile.acceptable_use?.prohibited_acts || [],
    ugc_enabled: profile.acceptable_use?.ugc_enabled || false,
    ugc_license_to_service: profile.acceptable_use?.ugc_license_to_service || '',
    moderation_appeals: profile.acceptable_use?.moderation_appeals || '',
    dmca_contact: profile.acceptable_use?.dmca_contact || '',
    service_ip_retained_by_company: profile.intellectual_property?.service_ip_retained_by_company || true,
    change_notice_methods: profile.changes_policy?.change_notice_method || ['email'],
    lead_time_days: profile.changes_policy?.lead_time_days || undefined,
    as_is_disclaimer: profile.disclaimers?.as_is_disclaimer || true,
    liability_cap_description: profile.disclaimers?.liability_cap_description || 'fees paid in last 12 months',
    exclude_indirect_consequential: profile.disclaimers?.exclude_indirect_consequential || true,
    carve_outs: profile.disclaimers?.carve_outs || ['fraud', 'willful misconduct', 'non-excludable statutory rights'],
    user_indemnity_enabled: profile.disclaimers?.user_indemnity_enabled || true,
    dispute_path: profile.dispute_resolution?.dispute_path || 'courts',
    venue: profile.dispute_resolution?.venue || '',
    has_class_action_waiver: profile.dispute_resolution?.has_class_action_waiver || false,
    has_small_claims_carveout: profile.dispute_resolution?.has_small_claims_carveout || false,
    
    // Privacy specific
    data_inventory: [] as Array<{
      category: string;
      sources: string[];
      purposes: string[];
      shared_with: string[];
      retention?: string;
    }>,
    vendors: [] as Array<{
      name: string;
      role: string;
      data_categories: string[];
      region: string;
      policy_url?: string;
    }>,
    tracking: {
      tech: [] as string[],
      tools: [] as string[],
      consent_model: {} as Record<string, string>
    },
    security: [] as string[],
    change_notice: {
      methods: ['email'] as string[],
      lead_time_days: undefined as number | undefined
    },
    gdpr: {
      role: 'controller' as 'controller' | 'processor',
      legal_bases: {} as Record<string, string>,
      legitimate_interests_text: ''
    },
    us_state_privacy: {
      sell_or_share: false,
      sensitive_pi: [] as string[],
      request_channels: [] as string[]
    },
    transfers: {
      mechanisms: [] as string[]
    },
    under13_parental_consent: false,
    parent_contact_method: ''
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMarkdown, setPreviewMarkdown] = useState<string>('');
  const [gaps, setGaps] = useState<Array<{severity: 'info' | 'warn' | 'error', message: string}>>([]);

  const validateForm = (): string[] => {
    const errors: string[] = [];

    // Basic mandatory fields
    if (!form.product_name.trim()) errors.push('Product name is required');
    if (!form.product_description.trim()) errors.push('Product description is required');
    if (!form.service_type.trim()) errors.push('Service type is required');
    if (form.platforms.length === 0) errors.push('At least one platform is required');

    // ToS specific validation (only if ToS is selected)
    if (selectedDocuments.includes('tos')) {
      if (form.data_categories.length === 0) errors.push('At least one data category is required for ToS');
      if (form.prohibited_acts.length === 0) errors.push('At least one prohibited act is required for ToS');
      if (form.change_notice_methods.length === 0) errors.push('At least one change notice method is required for ToS');
      if (!form.venue.trim()) errors.push('Dispute resolution venue is required for ToS');
      
      if (form.has_beta_features && !form.beta_note?.trim()) {
        errors.push('Beta features note is required when beta features are enabled');
      }
      if (form.ugc_enabled && !form.ugc_license_to_service?.trim()) {
        errors.push('UGC license description is required when user-generated content is enabled');
      }
    }

    // Privacy specific validation (only if Privacy is selected)
    if (selectedDocuments.includes('privacy')) {
      if (form.data_inventory.length === 0) errors.push('At least one data inventory item is required for Privacy Policy');
      if (form.change_notice.methods.length === 0) errors.push('At least one change notice method is required for Privacy Policy');
      
      // EU/UK specific validation
      if (profile.organization.jurisdictions_served.some(j => ['EU', 'UK'].includes(j))) {
        if (!form.gdpr.role) errors.push('GDPR role is required for EU/UK jurisdictions');
        if (Object.keys(form.gdpr.legal_bases).length === 0) errors.push('Legal bases are required for EU/UK jurisdictions');
      }
      
      // US/CA specific validation
      if (profile.organization.jurisdictions_served.some(j => ['US', 'CA'].includes(j))) {
        if (form.us_state_privacy.request_channels.length === 0) {
          errors.push('Request channels are required for US/CA jurisdictions');
        }
      }
    }

    return errors;
  };

  useEffect(() => {
    setValidationErrors(validateForm());
  }, [form, selectedDocuments]);

  const handleGenerate = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      alert('❌ Missing Required Fields:\n\n' + errors.join('\n') + '\n\nPlease fill in all mandatory fields before generating.');
      return;
    }

    if (selectedDocuments.length === 0) {
      alert('Please select at least one document type to generate.');
      return;
    }

    setIsGenerating(true);
    try {
      // First, save all form data back to the profile
      const updatedProfile: CompanyProfile = {
        ...profile,
        // Update basic product info
        product: {
          ...profile.product,
          product_name: form.product_name,
          has_beta_features: form.has_beta_features,
          beta_note: form.beta_note
        },
        // Update audience info
        audience: {
          ...profile.audience,
          minimum_age: form.minimum_age,
          allow_under_13_with_parental_consent: form.allow_under_13_with_parental_consent,
          allow_organizational_use: form.allow_organizational_use
        },
        // Update data categories (convert from simple objects to DataCategory format)
        data_categories: form.data_categories.map(cat => ({
          category: cat,
          source: 'user' as const,
          purposes: ['account', 'security'],
          retention: '2 years',
          shared_with: ['processors']
        })),
        // Update acceptable use
        acceptable_use: {
          ...profile.acceptable_use,
          prohibited_acts: form.prohibited_acts,
          ugc_enabled: form.ugc_enabled,
          ugc_license_to_service: form.ugc_license_to_service,
          moderation_appeals: form.moderation_appeals,
          dmca_contact: form.dmca_contact
        },
        // Update intellectual property
        intellectual_property: {
          ...profile.intellectual_property,
          service_ip_retained_by_company: form.service_ip_retained_by_company
        },
        // Update changes policy
        changes_policy: {
          ...profile.changes_policy,
          change_notice_method: form.change_notice_methods,
          lead_time_days: form.lead_time_days
        },
        // Update disclaimers
        disclaimers: {
          ...profile.disclaimers,
          as_is_disclaimer: form.as_is_disclaimer,
          liability_cap_description: form.liability_cap_description,
          exclude_indirect_consequential: form.exclude_indirect_consequential,
          carve_outs: form.carve_outs,
          user_indemnity_enabled: form.user_indemnity_enabled
        },
        // Update dispute resolution
        dispute_resolution: {
          ...profile.dispute_resolution,
          dispute_path: form.dispute_path,
          venue: form.venue,
          has_class_action_waiver: form.has_class_action_waiver,
          has_small_claims_carveout: form.has_small_claims_carveout
        }
      };

      // Save the updated profile
      await updateProfile(profile.profile_id, updatedProfile);
      
      // Show success message
      alert('✅ Profile updated with all form data! Now generating documents...');

      // Generate each selected document
      for (const docType of selectedDocuments) {
        if (docType === 'tos') {
          const tosForm: ToSForm = {
            product_name: form.product_name,
            product_description: form.product_description,
            service_type: form.service_type,
            platforms: form.platforms,
            has_beta_features: form.has_beta_features,
            beta_note: form.beta_note,
            minimum_age: form.minimum_age,
            allow_under_13_with_parental_consent: form.allow_under_13_with_parental_consent,
            allow_organizational_use: form.allow_organizational_use,
            data_categories: form.data_categories,
            prohibited_acts: form.prohibited_acts,
            ugc_enabled: form.ugc_enabled,
            ugc_license_to_service: form.ugc_license_to_service,
            moderation_appeals: form.moderation_appeals,
            dmca_contact: form.dmca_contact,
            service_ip_retained_by_company: form.service_ip_retained_by_company,
            change_notice_methods: form.change_notice_methods,
            lead_time_days: form.lead_time_days,
            as_is_disclaimer: form.as_is_disclaimer,
            liability_cap_description: form.liability_cap_description,
            exclude_indirect_consequential: form.exclude_indirect_consequential,
            carve_outs: form.carve_outs,
            user_indemnity_enabled: form.user_indemnity_enabled,
            dispute_path: form.dispute_path,
            venue: form.venue,
            has_class_action_waiver: form.has_class_action_waiver,
            has_small_claims_carveout: form.has_small_claims_carveout
          };

          await saveToSForm(profile.profile_id, tosForm);
          const result = await generateTermsOfService(profile.profile_id, tosForm);
          setPreviewMarkdown(result.markdown);
          setGaps(result.gaps);
          await onGenerate('tos', tosForm);
        } else if (docType === 'privacy') {
          const privacyForm: PrivacyForm = {
            product_name: form.product_name,
            min_age: form.minimum_age,
            data_inventory: form.data_inventory,
            platforms: form.platforms,
            vendors: form.vendors,
            tracking: form.tracking,
            security: form.security,
            change_notice: form.change_notice,
            gdpr: form.gdpr,
            us_state_privacy: form.us_state_privacy,
            transfers: form.transfers,
            under13_parental_consent: form.under13_parental_consent,
            parent_contact_method: form.parent_contact_method
          };

          await savePrivacyForm(profile.profile_id, privacyForm);
          const result = await generatePrivacyPolicy(profile.profile_id, privacyForm);
          setPreviewMarkdown(result.markdown);
          setGaps(result.gaps);
          await onGenerate('privacy', privacyForm);
        }
      }
    } catch (error) {
      console.error('Failed to generate documents:', error);
      alert('Failed to generate documents. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const FieldBadge = ({ type }: { type: 'M' | 'CM' | 'O' }) => {
    const colors = {
      M: 'bg-red-100 text-red-800',
      CM: 'bg-yellow-100 text-yellow-800',
      O: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${colors[type]}`}>
        {type}
      </span>
    );
  };

  const addDataInventoryItem = () => {
    setForm(prev => ({
      ...prev,
      data_inventory: [...prev.data_inventory, {
        category: '',
        sources: [],
        purposes: [],
        shared_with: [],
        retention: ''
      }]
    }));
  };

  const removeDataInventoryItem = (index: number) => {
    setForm(prev => ({
      ...prev,
      data_inventory: prev.data_inventory.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Document Configuration</h2>
            <p className="text-gray-600">Configure details for your legal documents</p>
          </div>

          {/* Document Type Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Select Documents to Generate</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedDocuments.includes('tos')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedDocuments(prev => [...prev, 'tos']);
                    } else {
                      setSelectedDocuments(prev => prev.filter(d => d !== 'tos'));
                    }
                  }}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Terms of Service</div>
                  <div className="text-sm text-gray-600">User agreement and service terms</div>
                </div>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedDocuments.includes('privacy')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedDocuments(prev => [...prev, 'privacy']);
                    } else {
                      setSelectedDocuments(prev => prev.filter(d => d !== 'privacy'));
                    }
                  }}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Privacy Policy</div>
                  <div className="text-sm text-gray-600">Data collection and privacy practices</div>
                </div>
              </label>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'basic'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Basic Information
                </button>
                {selectedDocuments.includes('tos') && (
                  <button
                    onClick={() => setActiveTab('tos')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'tos'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Terms of Service
                  </button>
                )}
                {selectedDocuments.includes('privacy') && (
                  <button
                    onClick={() => setActiveTab('privacy')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'privacy'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Privacy Policy
                  </button>
                )}
              </nav>
            </div>

            <div className="p-6">
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name <FieldBadge type="M" />
                    </label>
                    <input
                      type="text"
                      value={form.product_name}
                      onChange={(e) => setForm(prev => ({ ...prev, product_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., My Awesome App"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Description <FieldBadge type="M" />
                    </label>
                    <textarea
                      value={form.product_description}
                      onChange={(e) => setForm(prev => ({ ...prev, product_description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Describe what your product does..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type <FieldBadge type="M" />
                    </label>
                    <select
                      value={form.service_type}
                      onChange={(e) => setForm(prev => ({ ...prev, service_type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select service type...</option>
                      {SERVICE_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platforms <FieldBadge type="M" />
                    </label>
                    <div className="space-y-2">
                      {PLATFORMS.map(platform => (
                        <label key={platform} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={form.platforms.includes(platform)}
                            onChange={(e) => {
                              const platforms = e.target.checked
                                ? [...form.platforms, platform]
                                : form.platforms.filter(p => p !== platform);
                              setForm(prev => ({ ...prev, platforms }));
                            }}
                            className="mr-2"
                          />
                          {platform}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Age <FieldBadge type="M" />
                    </label>
                    <select
                      value={form.minimum_age}
                      onChange={(e) => setForm(prev => ({ ...prev, minimum_age: parseInt(e.target.value) as 13 | 16 | 18 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value={13}>13+ (US standard)</option>
                      <option value={16}>16+ (EU/UK standard)</option>
                      <option value={18}>18+ (Adult only)</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.has_beta_features}
                        onChange={(e) => setForm(prev => ({ ...prev, has_beta_features: e.target.checked }))}
                        className="mr-2"
                      />
                      Has Beta/Experimental Features
                    </label>
                    {form.has_beta_features && (
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Beta Features Note <FieldBadge type="CM" />
                        </label>
                        <textarea
                          value={form.beta_note || ''}
                          onChange={(e) => setForm(prev => ({ ...prev, beta_note: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          rows={2}
                          placeholder="Describe beta features and their limitations..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Terms of Service Tab */}
              {activeTab === 'tos' && selectedDocuments.includes('tos') && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Categories <FieldBadge type="M" />
                    </label>
                    <div className="space-y-2">
                      {DATA_CATEGORIES.map(category => (
                        <label key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={form.data_categories.includes(category)}
                            onChange={(e) => {
                              const categories = e.target.checked
                                ? [...form.data_categories, category]
                                : form.data_categories.filter(c => c !== category);
                              setForm(prev => ({ ...prev, data_categories: categories }));
                            }}
                            className="mr-2"
                          />
                          {category}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prohibited Acts <FieldBadge type="M" />
                    </label>
                    <div className="space-y-2">
                      {PROHIBITED_ACTS.map(act => (
                        <label key={act} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={form.prohibited_acts.includes(act)}
                            onChange={(e) => {
                              const acts = e.target.checked
                                ? [...form.prohibited_acts, act]
                                : form.prohibited_acts.filter(a => a !== act);
                              setForm(prev => ({ ...prev, prohibited_acts: acts }));
                            }}
                            className="mr-2"
                          />
                          {act}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.ugc_enabled}
                        onChange={(e) => setForm(prev => ({ ...prev, ugc_enabled: e.target.checked }))}
                        className="mr-2"
                      />
                      Enable User-Generated Content (UGC)
                    </label>
                    {form.ugc_enabled && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            UGC License to Service <FieldBadge type="CM" />
                          </label>
                          <textarea
                            value={form.ugc_license_to_service || ''}
                            onChange={(e) => setForm(prev => ({ ...prev, ugc_license_to_service: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            rows={3}
                            placeholder="Describe the license users grant to your service..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Moderation & Appeals Process <FieldBadge type="CM" />
                          </label>
                          <textarea
                            value={form.moderation_appeals || ''}
                            onChange={(e) => setForm(prev => ({ ...prev, moderation_appeals: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            rows={3}
                            placeholder="Describe how you moderate content and handle appeals..."
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Change Notice Methods <FieldBadge type="M" />
                    </label>
                    <div className="space-y-2">
                      {['email', 'in_app', 'banner'].map(method => (
                        <label key={method} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={form.change_notice_methods.includes(method)}
                            onChange={(e) => {
                              const methods = e.target.checked
                                ? [...form.change_notice_methods, method]
                                : form.change_notice_methods.filter(m => m !== method);
                              setForm(prev => ({ ...prev, change_notice_methods: methods }));
                            }}
                            className="mr-2"
                          />
                          {method}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dispute Resolution Method <FieldBadge type="M" />
                    </label>
                    <select
                      value={form.dispute_path}
                      onChange={(e) => setForm(prev => ({ ...prev, dispute_path: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="courts">Courts (litigation)</option>
                      <option value="arbitration">Arbitration</option>
                      <option value="mediation">Mediation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Venue (Court Location or Arbitration Forum) <FieldBadge type="M" />
                    </label>
                    <input
                      type="text"
                      value={form.venue}
                      onChange={(e) => setForm(prev => ({ ...prev, venue: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Cook County, Illinois"
                    />
                  </div>
                </div>
              )}

              {/* Privacy Policy Tab */}
              {activeTab === 'privacy' && selectedDocuments.includes('privacy') && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Inventory <FieldBadge type="M" />
                    </label>
                    <div className="space-y-4">
                      {form.data_inventory.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium">Data Item {index + 1}</h4>
                            <button
                              onClick={() => removeDataInventoryItem(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category <FieldBadge type="M" />
                              </label>
                              <select
                                value={item.category}
                                onChange={(e) => {
                                  const newInventory = [...form.data_inventory];
                                  newInventory[index].category = e.target.value;
                                  setForm(prev => ({ ...prev, data_inventory: newInventory }));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              >
                                <option value="">Select category...</option>
                                <option value="identifiers">Identifiers</option>
                                <option value="account">Account Information</option>
                                <option value="payment">Payment Information</option>
                                <option value="usage">Usage Data</option>
                                <option value="device_ids">Device IDs</option>
                                <option value="geolocation">Geolocation</option>
                                <option value="ugc">User-Generated Content</option>
                                <option value="support">Support Data</option>
                                <option value="marketing">Marketing Data</option>
                                <option value="sensitive">Sensitive Data</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Retention Period <FieldBadge type="O" />
                              </label>
                              <input
                                type="text"
                                value={item.retention || ''}
                                onChange={(e) => {
                                  const newInventory = [...form.data_inventory];
                                  newInventory[index].retention = e.target.value;
                                  setForm(prev => ({ ...prev, data_inventory: newInventory }));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                placeholder="e.g., 2 years, until account deletion"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={addDataInventoryItem}
                        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400"
                      >
                        + Add Data Item
                      </button>
                    </div>
                  </div>

                  {/* GDPR Section (only show if EU/UK selected) */}
                  {profile.organization.jurisdictions_served.some(j => ['EU', 'UK'].includes(j)) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-3">GDPR Compliance (EU/UK)</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            GDPR Role <FieldBadge type="CM" />
                          </label>
                          <select
                            value={form.gdpr.role}
                            onChange={(e) => setForm(prev => ({
                              ...prev,
                              gdpr: { ...prev.gdpr, role: e.target.value as 'controller' | 'processor' }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="controller">Data Controller</option>
                            <option value="processor">Data Processor</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* US State Privacy Section (only show if US/CA selected) */}
                  {profile.organization.jurisdictions_served.some(j => ['US', 'CA'].includes(j)) && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-3">US State Privacy (US/CA)</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={form.us_state_privacy.sell_or_share}
                              onChange={(e) => setForm(prev => ({
                                ...prev,
                                us_state_privacy: { ...prev.us_state_privacy, sell_or_share: e.target.checked }
                              }))}
                              className="mr-2"
                            />
                            Sell or share personal information
                          </label>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Request Channels <FieldBadge type="CM" />
                          </label>
                          <div className="space-y-2">
                            {['email', 'webform', 'toll_free'].map(channel => (
                              <label key={channel} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={form.us_state_privacy.request_channels.includes(channel)}
                                  onChange={(e) => {
                                    const channels = e.target.checked
                                      ? [...form.us_state_privacy.request_channels, channel]
                                      : form.us_state_privacy.request_channels.filter(c => c !== channel);
                                    setForm(prev => ({
                                      ...prev,
                                      us_state_privacy: { ...prev.us_state_privacy, request_channels: channels }
                                    }));
                                  }}
                                  className="mr-2"
                                />
                                {channel}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">Missing Required Fields:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Generate Button */}
          <div className="flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={validationErrors.length > 0 || isGenerating || selectedDocuments.length === 0}
              className={`px-8 py-3 rounded-lg font-semibold ${
                validationErrors.length > 0 || isGenerating || selectedDocuments.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isGenerating ? 'Generating...' : `Generate ${selectedDocuments.length > 0 ? selectedDocuments.join(' & ') : 'Documents'}`}
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
          
          {gaps.length > 0 && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Gaps & Recommendations:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {gaps.map((gap, index) => (
                  <li key={index} className={`flex items-center ${
                    gap.severity === 'error' ? 'text-red-700' : 
                    gap.severity === 'warn' ? 'text-yellow-700' : 'text-blue-700'
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      gap.severity === 'error' ? 'bg-red-500' : 
                      gap.severity === 'warn' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></span>
                    {gap.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="border border-gray-200 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto">
            {previewMarkdown ? (
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm">{previewMarkdown}</pre>
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                Select document types and fill in the form to see a preview
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
