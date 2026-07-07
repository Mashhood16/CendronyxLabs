import { useParams } from 'react-router-dom';
import { GenericTheoremLab } from '../components/GenericTheoremLab';
import { CLASS11_THEOREMS } from '../data/class11Theorems';
import { useTranslate } from "../i18n";

export default function LabM11TheoremViewer({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
  const { moduleId } = useParams<{ moduleId: string }>();

  const moduleToTheorem: Record<string, string> = {
    'm11_theorem_complex_magnitude': 'complex_magnitude',
    'm11_theorem_complex_inverse_polar': 'complex_inverse_polar',
    'm11_theorem_complex_division_polar': 'complex_division_polar',
    'm11_theorem_determinant_transpose': 'determinant_transpose',
    'm11_theorem_determinant_interchange': 'determinant_interchange',
    'm11_theorem_determinant_identical': 'determinant_identical',
    'm11_theorem_parallelogram_diagonals': 'parallelogram_diagonals',
    'm11_theorem_triangle_midpoint': 'triangle_midpoint',
    'm11_theorem_trapezium_midpoint': 'trapezium_midpoint',
    'm11_theorem_geometric_sum': 'geometric_sum',
    'm11_theorem_arithmetico_geometric_sum': 'arithmetico_geometric_sum',
    'm11_theorem_remainder': 'remainder_theorem',
    'm11_theorem_factor': 'factor_theorem',
    'm11_theorem_combination': 'combination_formula',
    'm11_theorem_binomial': 'binomial_theorem',
    'm11_theorem_fundamental_trig': 'fundamental_trig',
    'm11_theorem_trig_identities': 'trig_identities',
  };

  const theoremKey = moduleId ? moduleToTheorem[moduleId] : undefined;
  const config = theoremKey ? CLASS11_THEOREMS[theoremKey] : undefined;

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#000000]">
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t('lab.m11theoremviewer_theorem_not_found')}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('lab.m11theoremviewer_the_requested_theorem_could_no')}</p>
          {onExit && (
            <button onClick={onExit} className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg">
              
                                      {t('lab.m11theoremviewer_go_back')}
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
