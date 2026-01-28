import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { DocumentsList } from './pages/DocumentsList';
import ProfileManager from './components/ProfileManager';
import ProfileFormWizard from './components/ProfileFormWizard';
import DocumentSelection from './components/DocumentSelection';
import UnifiedDocumentForm from './components/UnifiedDocumentForm';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profiles" element={<ProfileManager />} />
        <Route path="profiles/new" element={<ProfileFormWizard />} />
        <Route path="profiles/:id/edit" element={<ProfileFormWizard />} />
        <Route path="profiles/:id/generate" element={<UnifiedDocumentForm />} />
        <Route path="documents" element={<DocumentsList />} />
      </Route>
    </Routes>
  );
}

export default App;

