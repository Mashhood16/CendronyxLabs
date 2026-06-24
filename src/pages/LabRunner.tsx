import { useParams, useNavigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import Layout from '../components/Layout';

const LabRunnerInner = lazy(() => import('./LabRunnerInner'));

export default function LabRunner() {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const handleExit = () => {
    navigate(-1);
  };

  return (
    <Suspense fallback={
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-500 font-medium">Loading lab...</p>
        </div>
      </Layout>
    }>
      <ErrorBoundary labId={moduleId}>
        <LabRunnerInner moduleId={moduleId} onExit={handleExit} />
      </ErrorBoundary>
    </Suspense>
  );
}
