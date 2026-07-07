import { useParams } from 'react-router-dom';
import { GenericTheoremLab } from '../components/GenericTheoremLab';
import { CLASS12_THEOREMS } from '../data/class12Theorems';
import { useTranslate } from "../i18n";

export default function LabM12TheoremViewer({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
  const { moduleId } = useParams<{ moduleId: string }>();

  const moduleToTheorem: Record<string, string> = {
    'm12_theorem_power_rule': 'power_rule',
    'm12_theorem_sin_derivative': 'sin_derivative',
    'm12_theorem_inverse_trig_derivatives': 'inverse_trig_derivatives',
    'm12_theorem_basic_integrals': 'basic_integrals',
    'm12_theorem_substitution_integrals': 'substitution_integrals',
    'm12_theorem_fundamental_theorem_calc': 'fundamental_theorem_calc',
    'm12_theorem_concurrency_altitudes': 'concurrency_altitudes',
    'm12_theorem_concurrency_bisectors': 'concurrency_bisectors',
    'm12_theorem_concurrency_medians': 'concurrency_medians',
    'm12_theorem_homogeneous_second_degree': 'homogeneous_second_degree',
    'm12_theorem_circle_general': 'circle_general',
    'm12_theorem_circle_tangent': 'circle_tangent',
    'm12_theorem_parabola_standard': 'parabola_standard',
    'm12_theorem_parabola_tangent': 'parabola_tangent',
    'm12_theorem_ellipse_standard': 'ellipse_standard',
    'm12_theorem_hyperbola_standard': 'hyperbola_standard',
  };

  const theoremKey = moduleId ? moduleToTheorem[moduleId] : undefined;
  const config = theoremKey ? CLASS12_THEOREMS[theoremKey] : undefined;

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#000000]">
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t('lab.m12theoremviewer_theorem_not_found')}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('lab.m12theoremviewer_the_requested_theorem_could_no')}</p>
          {onExit && (
            <button onClick={onExit} className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg">
              
                                      {t('lab.m12theoremviewer_go_back')}
                                    </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <GenericTheoremLab
      onExit={onExit}
      config={config}
    />
  );
}
