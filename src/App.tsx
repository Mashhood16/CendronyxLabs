// Force HMR reload 4
import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import ClassSelection from './pages/ClassSelection';
import SubjectSelection from './pages/SubjectSelection';
import ModuleSelection from './pages/ModuleSelection';
import LabRunner from './pages/LabRunner';
import HistoryDashboard from './pages/HistoryDashboard';
import SettingsPanel from './pages/SettingsPanel';
import LabBuilder from './pages/LabBuilder';
import AdminReview from './pages/AdminReview';
import SimulationStudio from './pages/SimulationStudio';

const Login = lazy(() => import('./components/Login'));

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<ClassSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/progress" element={<ProtectedRoute><HistoryDashboard /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryDashboard /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPanel /></ProtectedRoute>} />
        <Route path="/create-lab" element={<ProtectedRoute><LabBuilder /></ProtectedRoute>} />
        <Route path="/edit-lab/:labId" element={<ProtectedRoute><LabBuilder /></ProtectedRoute>} />
        <Route path="/admin/review" element={<ProtectedRoute><AdminReview /></ProtectedRoute>} />
        <Route path="/simulation-studio" element={<ProtectedRoute><SimulationStudio /></ProtectedRoute>} />
        <Route path="/edit-simulation/:simId" element={<ProtectedRoute><SimulationStudio /></ProtectedRoute>} />
        <Route path="/class/:classId" element={<SubjectSelection />} />
        <Route path="/class/:classId/:subjectId" element={<ModuleSelection />} />
        <Route path="/class/:classId/:subjectId/lab/:moduleId" element={<LabRunner />} />
      </Routes>
    </ErrorBoundary>
  );
}
