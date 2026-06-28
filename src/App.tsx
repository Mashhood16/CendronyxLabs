// Force HMR reload 4
import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ClassSelection from './pages/ClassSelection';
import SubjectSelection from './pages/SubjectSelection';
import ModuleSelection from './pages/ModuleSelection';
import LabRunner from './pages/LabRunner';
import HistoryDashboard from './pages/HistoryDashboard';
import SettingsPanel from './pages/SettingsPanel';

const Login = lazy(() => import('./components/Login'));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ClassSelection />} />
      <Route path="/login" element={<Login />} />
      <Route path="/progress" element={<ProtectedRoute><HistoryDashboard /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><HistoryDashboard /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPanel /></ProtectedRoute>} />
      <Route path="/class/:classId" element={<SubjectSelection />} />
      <Route path="/class/:classId/:subjectId" element={<ModuleSelection />} />
      <Route path="/class/:classId/:subjectId/lab/:moduleId" element={<LabRunner />} />
    </Routes>
  );
}
