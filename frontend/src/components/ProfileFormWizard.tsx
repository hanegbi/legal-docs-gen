import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GradientText } from '@/components/magic/gradient-text';
import type { CompanyProfile } from '../api/profile-types';
import { createProfile, getProfile } from '../api/client';

const STEPS = [
  { id: 'organization', label: 'Company Information', mandatory: true },
];

export default function ProfileFormWizard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Partial<CompanyProfile>>({
    profile_name: 'Test Company Profile',
    organization: {
      company_legal_name: 'Test Company Inc.',
      registered_address: '123 Test Street, Test City, TC 12345',
      privacy_email: 'privacy@testcompany.com',
      legal_notices_email: 'legal@testcompany.com',
      jurisdictions_served: ['US', 'EU'],
      effective_date: new Date().toISOString().split('T')[0],
    },
    // Set minimal defaults for other required fields
    product: {
      product_name: 'Test App',
      has_beta_features: false,
    },
    audience: {
      minimum_age: 13,
      eea_uk_override_16: false,
      allow_under_13_with_parental_consent: false,
      allow_organizational_use: true,
    },
    data_categories: [
      {
        category: 'Account identifiers',
        source: 'user',
        purposes: ['account', 'security'],
        retention: '2 years',
        shared_with: ['processors']
      },
      {
        category: 'Contact information',
        source: 'user',
        purposes: ['account', 'communications'],
        retention: '2 years',
        shared_with: ['processors']
      }
    ],
    acceptable_use: {
      prohibited_acts: ['Unlawful or illegal activities', 'Harassment, abuse, or threatening conduct'],
      ugc_enabled: false,
    },
    intellectual_property: {
      service_ip_retained_by_company: true,
    },
    changes_policy: {
      change_notice_method: ['email'],
    },
    disclaimers: {
      as_is_disclaimer: true,
      liability_cap_description: 'fees paid in last 12 months',
      exclude_indirect_consequential: true,
      carve_outs: ['fraud', 'willful misconduct', 'non-excludable statutory rights'],
      user_indemnity_enabled: true,
    },
    dispute_resolution: {
      dispute_path: 'courts',
      venue: 'Cook County, Illinois',
      has_class_action_waiver: false,
      has_small_claims_carveout: false,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadProfile(id);
    }
  }, [isEditing, id]);

  const loadProfile = async (profileId: string) => {
    try {
      setLoading(true);
      const profileData = await getProfile(profileId);
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to load profile:', error);
      navigate('/profiles');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (section: string, data: any) => {
    setProfile(prev => {
      const currentSection = prev[section as keyof CompanyProfile];
      return {
        ...prev,
        [section]: typeof currentSection === 'object' && currentSection !== null
          ? { ...currentSection, ...data }
          : data,
      };
    });
  };

  const validateMandatoryFields = (): string[] => {
    const errors: string[] = [];
    
    if (!profile.profile_name?.trim()) {
      errors.push('• Profile name is required');
    }
    if (!profile.organization?.company_legal_name?.trim()) {
      errors.push('• Company legal name is required');
    }
    if (!profile.organization?.registered_address?.trim()) {
      errors.push('• Registered address is required');
    }
    if (!profile.organization?.privacy_email?.trim()) {
      errors.push('• Privacy email is required');
    }
    if (!profile.organization?.legal_notices_email?.trim()) {
      errors.push('• Legal notices email is required');
    }
    if (!profile.organization?.jurisdictions_served?.length) {
      errors.push('• At least one jurisdiction is required');
    }
    
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateMandatoryFields();
    
    if (errors.length > 0) {
      alert('❌ Missing Required Fields:\n\n' + errors.join('\n') + '\n\nPlease fill in all mandatory fields before saving.');
      return;
    }
    
    try {
      setLoading(true);
      
      if (!isEditing) {
        await createProfile(profile as CompanyProfile);
        navigate('/dashboard');
      } else {
        // For editing, we'd need an updateProfile function
        navigate('/profiles');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  if (loading && isEditing) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <GradientText className="text-3xl">
            {isEditing ? 'Edit Company Profile' : 'Create Company Profile'}
          </GradientText>
        </div>
        
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm text-primary-foreground">
            <strong>💡 Workflow:</strong> Create your company profile with basic information, then you can generate specific legal documents (ToS, Privacy Policy) with additional details.
          </p>
        </div>

        <div className="flex items-center mb-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-1 ${index < currentStep ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>
        <Progress value={progress} className="mb-2" />
        <p className="text-muted-foreground">
          Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].label} {STEPS[currentStep].mandatory && <span className="text-destructive">*</span>}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep].label}</CardTitle>
          <CardDescription>
            {STEPS[currentStep].mandatory && 'Required information for document generation'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profile_name">Profile Name</Label>
              <Input
                id="profile_name"
                value={profile.profile_name || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile(prev => ({ ...prev, profile_name: e.target.value }))}
                placeholder="My Company Profile"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_legal_name">Company Legal Name <Badge variant="destructive" className="ml-2">Required</Badge></Label>
              <Input
                id="company_legal_name"
                value={profile.organization?.company_legal_name || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateProfile('organization', { company_legal_name: e.target.value })}
                placeholder="Acme Corporation Inc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="registered_address">Registered Address <Badge variant="destructive" className="ml-2">Required</Badge></Label>
            <Textarea
              id="registered_address"
              value={profile.organization?.registered_address || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateProfile('organization', { registered_address: e.target.value })}
              placeholder="123 Business St, City, State 12345"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="privacy_email">Privacy Email <Badge variant="destructive" className="ml-2">Required</Badge></Label>
              <Input
                id="privacy_email"
                type="email"
                value={profile.organization?.privacy_email || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateProfile('organization', { privacy_email: e.target.value })}
                placeholder="privacy@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legal_notices_email">Legal Notices Email <Badge variant="destructive" className="ml-2">Required</Badge></Label>
              <Input
                id="legal_notices_email"
                type="email"
                value={profile.organization?.legal_notices_email || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateProfile('organization', { legal_notices_email: e.target.value })}
                placeholder="legal@company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Jurisdictions Served <Badge variant="destructive" className="ml-2">Required</Badge></Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['US', 'EU', 'UK', 'IL', 'CA', 'AU'].map((jurisdiction) => (
                <label key={jurisdiction} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={profile.organization?.jurisdictions_served?.includes(jurisdiction) || false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const current = profile.organization?.jurisdictions_served || [];
                      const updated = e.target.checked
                        ? [...current, jurisdiction]
                        : current.filter(j => j !== jurisdiction);
                      updateProfile('organization', { jurisdictions_served: updated });
                    }}
                    className="rounded border-input"
                  />
                  <span className="text-sm">{jurisdiction}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="effective_date">Effective Date <Badge variant="destructive" className="ml-2">Required</Badge></Label>
            <Input
              id="effective_date"
              type="date"
              value={profile.organization?.effective_date || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateProfile('organization', { effective_date: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <div>
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Previous
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Profile' : 'Create Profile')}
          </Button>
        </div>
      </div>
    </div>
  );
}