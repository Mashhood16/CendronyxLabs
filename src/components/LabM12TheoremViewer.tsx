import { useParams } from 'react-router-dom';
import LabHeader from './LabHeader';
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
 <LabHeader onExit={onExit} title={t('lab.m12theoremviewer_theorem_not_found')} />
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
