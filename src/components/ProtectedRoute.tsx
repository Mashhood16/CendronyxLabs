import { useTranslate } from '../i18n';
import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store';
import Layout from './Layout';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { t } = useTranslate();
  const { user, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, isLoaded, navigate]);

  if (!isLoaded) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-500 font-medium">{t("Loading...")}</p>
        </div>
      </Layout>
    );
  }

  if (!user) return null;
  return <>{children}</>;
}
