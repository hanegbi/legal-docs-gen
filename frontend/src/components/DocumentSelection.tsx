import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Shield, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GradientText } from '@/components/magic/gradient-text';
import { BackgroundBeams } from '@/components/magic/background-beams';
import type { CompanyProfile } from '../api/profile-types';
import { getProfile } from '../api/client';
import { useState, useEffect } from 'react';

export default function DocumentSelection() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProfile(id);
    }
  }, [id]);

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

  const handleDocumentSelect = (documentType: 'tos' | 'privacy') => {
    navigate(`/profiles/${id}/generate?type=${documentType}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Profile not found</p>
        <Button onClick={() => navigate('/profiles')} className="mt-4">
          Back to Profiles
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
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
          <GradientText className="text-3xl">Generate Legal Documents</GradientText>
        </div>
        
        <p className="text-muted-foreground text-lg">
          Choose which document you'd like to generate for <strong>{profile.profile_name}</strong>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Terms of Service */}
        <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
              onClick={() => handleDocumentSelect('tos')}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Terms of Service</CardTitle>
                <CardDescription>User agreement and service terms</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Define the rules and guidelines for using your service, including user responsibilities, 
              prohibited activities, and service limitations.
            </p>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">What you'll configure:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Product details and features</li>
                <li>• User responsibilities and restrictions</li>
                <li>• Intellectual property rights</li>
                <li>• Liability limitations and disclaimers</li>
                <li>• Dispute resolution process</li>
              </ul>
            </div>
            
            <Button className="w-full" size="lg">
              Generate Terms of Service
            </Button>
          </CardContent>
        </Card>

        {/* Privacy Policy */}
        <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
              onClick={() => handleDocumentSelect('privacy')}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <CardTitle className="text-xl">Privacy Policy</CardTitle>
                <CardDescription>Data collection and privacy practices</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Explain how you collect, use, and protect user data, including compliance with 
              GDPR, CCPA, and other privacy regulations.
            </p>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">What you'll configure:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Data collection categories and sources</li>
                <li>• Data usage purposes and legal bases</li>
                <li>• Data sharing and third-party services</li>
                <li>• User rights and request processes</li>
                <li>• Regional compliance (GDPR, CCPA, etc.)</li>
              </ul>
            </div>
            
            <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
              Generate Privacy Policy
            </Button>
          </CardContent>
        </Card>
      </div>

      <BackgroundBeams className="rounded-lg">
        <Card className="bg-transparent border-dashed">
          <CardHeader>
            <CardTitle>Company Profile Information</CardTitle>
            <CardDescription>This information will be used in your generated documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Company:</strong> {profile.organization.company_legal_name}</p>
                <p><strong>Address:</strong> {profile.organization.registered_address}</p>
                <p><strong>Jurisdictions:</strong> {profile.organization.jurisdictions_served.join(', ')}</p>
              </div>
              <div>
                <p><strong>Privacy Email:</strong> {profile.organization.privacy_email}</p>
                <p><strong>Legal Email:</strong> {profile.organization.legal_notices_email}</p>
                <p><strong>Effective Date:</strong> {profile.organization.effective_date}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </BackgroundBeams>
    </div>
  );
}