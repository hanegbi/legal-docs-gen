import axios from 'axios';
import type { GenerateRequest, GenerateResponse, HealthResponse, ConfigResponse } from './types';
import type { CompanyProfile, ProfileListItem, GenerateFromProfileRequest } from './profile-types';
import type { PrivacyForm, PrivacyFormResponse, PrivacyGenerateResponse } from './privacy-types';
import type { ToSForm, ToSFormResponse, ToSGenerateResponse } from './tos-types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateDocuments = async (request: GenerateRequest): Promise<GenerateResponse> => {
  const response = await api.post<GenerateResponse>('/api/generate', request);
  return response.data;
};

export const checkHealth = async (): Promise<HealthResponse> => {
  const response = await api.get<HealthResponse>('/api/health');
  return response.data;
};

export const getConfig = async (): Promise<ConfigResponse> => {
  const response = await api.get<ConfigResponse>('/api/config');
  return response.data;
};

export const listProfiles = async (): Promise<ProfileListItem[]> => {
  const response = await api.get<{ profiles: ProfileListItem[] }>('/api/profiles');
  return response.data.profiles;
};

export const getProfile = async (profileId: string): Promise<CompanyProfile> => {
  const response = await api.get<{ profile: CompanyProfile }>(`/api/profiles/${profileId}`);
  return response.data.profile;
};

export const createProfile = async (profile: CompanyProfile): Promise<CompanyProfile> => {
  const response = await api.post<{ profile: CompanyProfile }>('/api/profiles', profile);
  return response.data.profile;
};

export const updateProfile = async (profileId: string, profile: CompanyProfile): Promise<CompanyProfile> => {
  const response = await api.put<{ profile: CompanyProfile }>(`/api/profiles/${profileId}`, profile);
  return response.data.profile;
};

export const deleteProfile = async (profileId: string): Promise<void> => {
  await api.delete(`/api/profiles/${profileId}`);
};

export const generateFromProfile = async (request: GenerateFromProfileRequest): Promise<GenerateResponse> => {
  const response = await api.post<GenerateResponse>('/api/generate-from-profile', request);
  return response.data;
};

export const savePrivacyForm = async (profileId: string, form: PrivacyForm): Promise<PrivacyFormResponse> => {
  const response = await api.post<PrivacyFormResponse>(`/api/privacy/${profileId}`, { form });
  return response.data;
};

export const getPrivacyForm = async (profileId: string): Promise<PrivacyFormResponse> => {
  const response = await api.get<PrivacyFormResponse>(`/api/privacy/${profileId}`);
  return response.data;
};

export const generatePrivacyPolicy = async (profileId: string, form: PrivacyForm): Promise<PrivacyGenerateResponse> => {
  const response = await api.post<PrivacyGenerateResponse>(`/api/privacy/generate/${profileId}`, {
    profile_id: profileId,
    form
  });
  return response.data;
};

export const saveToSForm = async (profileId: string, form: ToSForm): Promise<ToSFormResponse> => {
  const response = await api.post<ToSFormResponse>(`/api/tos/${profileId}`, { form });
  return response.data;
};

export const getToSForm = async (profileId: string): Promise<ToSFormResponse> => {
  const response = await api.get<ToSFormResponse>(`/api/tos/${profileId}`);
  return response.data;
};

export const generateTermsOfService = async (profileId: string, form: ToSForm): Promise<ToSGenerateResponse> => {
  const response = await api.post<ToSGenerateResponse>(`/api/tos/generate/${profileId}`, {
    profile_id: profileId,
    form
  });
  return response.data;
};

export default api;

