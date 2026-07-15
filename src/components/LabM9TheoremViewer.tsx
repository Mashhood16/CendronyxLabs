import { useParams } from 'react-router-dom';
import LabHeader from './LabHeader';
import { GenericTheoremLab } from '../components/GenericTheoremLab';
import { CLASS9_THEOREMS } from '../data/class9Theorems';
import { useTranslate } from "../i18n";

export default function LabM9TheoremViewer({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
  const { moduleId } = useParams<{ moduleId: string }>();

  const moduleToTheorem: Record<string, string> = {
    'm9_theorem_product_log': 'product_log',
    'm9_theorem_quotient_log': 'quotient_log',
    'm9_theorem_power_log': 'power_log',
    'm9_theorem_change_base': 'change_base',
    'm9_theorem_union_assoc': 'union_associative',
    'm9_theorem_intersection_assoc': 'intersection_associative',
    'm9_theorem_distributive_union': 'distributive_union_inter',
    'm9_theorem_distributive_intersection': 'distributive_inter_union',
    'm9_theorem_quotient_identity': 'quotient_identities',
    'm9_theorem_pythagorean_identity': 'pythagorean_identities',
    'm9_theorem_distance_formula': 'distance_formula',
    'm9_theorem_slope_intercept': 'slope_intercept',
    'm9_theorem_point_slope': 'point_slope',
    'm9_theorem_two_point': 'two_point_form',
    'm9_theorem_two_intercept': 'two_intercept_form',
    'm9_theorem_normal_form': 'normal_form',
    'm9_theorem_angle_between_lines': 'angle_between_lines',
  };

  const theoremKey = moduleId ? moduleToTheorem[moduleId] : undefined;
  const config = theoremKey ? CLASS9_THEOREMS[theoremKey] : undefined;

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#000000]">
        <LabHeader onExit={onExit} title={t('lab.m9theoremviewer_theorem_not_found')} />
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
