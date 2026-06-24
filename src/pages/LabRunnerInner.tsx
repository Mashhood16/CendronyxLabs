import { getLabComponent } from '../routes/labRoutes';
import Layout from '../components/Layout';

interface LabRunnerInnerProps {
  moduleId: string | undefined;
  onExit: () => void;
}

export default function LabRunnerInner({ moduleId, onExit }: LabRunnerInnerProps) {
  const LabComponent = moduleId ? getLabComponent(moduleId) : null;

  if (!LabComponent || !moduleId) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-50 rounded-2xl border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Module Not Found</h2>
          <p className="text-slate-500 mb-6">The module "{moduleId}" does not exist or is still under construction.</p>
          <button onClick={onExit} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
            Return to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  return <LabComponent onExit={onExit} />;
}
