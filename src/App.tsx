import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ErrorBoundary from './components/layout/ErrorBoundary';
import ClassSelection from './pages/ClassSelection';

// Lazy-load all non-landing pages to keep initial bundle lean
const Login = lazy(() => import('./components/layout/Login'));
const SubjectSelection = lazy(() => import('./pages/SubjectSelection'));
const ModuleSelection = lazy(() => import('./pages/ModuleSelection'));
const LabRunner = lazy(() => import('./pages/LabRunner'));
const HistoryDashboard = lazy(() => import('./pages/HistoryDashboard'));
const SettingsPanel = lazy(() => import('./pages/SettingsPanel'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<ClassSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/history" element={<ProtectedRoute><HistoryDashboard /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPanel /></ProtectedRoute>} />
          <Route path="/class/:classId" element={<SubjectSelection />} />
          <Route path="/class/:classId/:subjectId" element={<ModuleSelection />} />
          <Route path="/class/:classId/:subjectId/lab/:moduleId" element={<LabRunner />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
