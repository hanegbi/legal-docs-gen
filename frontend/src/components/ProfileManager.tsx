import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BackgroundBeams } from '@/components/magic/background-beams';
import { GradientText } from '@/components/magic/gradient-text';
import { listProfiles, deleteProfile } from '../api/client';
import type { ProfileListItem } from '../api/profile-types';

export default function ProfileManager() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ProfileListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const data = await listProfiles();
      setProfiles(data);
      setError(null);
    } catch (err) {
      setError('Failed to load profiles');
      console.error('Error loading profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleDelete = async (profileId: string) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        await deleteProfile(profileId);
        await loadProfiles();
      } catch (err) {
        console.error('Error deleting profile:', err);
        setError('Failed to delete profile');
      }
    }
  };

  const handleEdit = (profileId: string) => {
    navigate(`/profiles/${profileId}/edit`);
  };

  const handleGenerate = (profileId: string) => {
    navigate(`/profiles/${profileId}/generate`);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <GradientText className="text-4xl mb-2">Company Profiles</GradientText>
        <p className="text-muted-foreground text-lg">
          Manage your company profiles for document generation
        </p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">All Profiles</h2>
        <Button onClick={() => navigate('/profiles/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Profile
        </Button>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10 mb-6">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {profiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <Card key={profile.profile_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{profile.profile_name}</CardTitle>
                    <CardDescription>{profile.company_legal_name}</CardDescription>
                  </div>
                  <Badge variant="outline">
                    Profile ID: {profile.profile_id.slice(0, 8)}...
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Profile ID: {profile.profile_id}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(profile.profile_id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerate(profile.profile_id)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Generate
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(profile.profile_id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <BackgroundBeams className="rounded-lg">
          <Card className="bg-transparent border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No profiles yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first company profile to get started with document generation
              </p>
              <Button onClick={() => navigate('/profiles/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Profile
              </Button>
            </CardContent>
          </Card>
        </BackgroundBeams>
      )}
    </div>
  );
}