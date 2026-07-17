import { useParams } from 'react-router-dom';
import LabHeader from './LabHeader';
import { GenericTheoremLab } from '../components/GenericTheoremLab';
import { CLASS10_THEOREMS } from '../data/class10Theorems';
import { useTranslate } from "../i18n";

export default function LabM10TheoremViewer({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const { moduleId } = useParams<{ moduleId: string }>();

 const moduleToTheorem: Record<string, string> = {
 'm10_theorem_quadratic_formula': 'quadratic_formula',
 'm10_theorem_vector_diff': 'vector_diff',
 'm10_theorem_law_cosines': 'law_cosines',
 'm10_theorem_law_sines': 'law_sines',
 'm10_theorem_law_tangents': 'law_tangents',
 'm10_theorem_half_angle_cos': 'half_angle_cos',
 'm10_theorem_half_angle_sin': 'half_angle_sin',
 'm10_theorem_area_sas': 'area_sas',
 'm10_theorem_area_aas': 'area_aas',
 'm10_theorem_heros': 'heros_formula',
 'm10_theorem_circum_radius': 'circum_radius',
 'm10_theorem_in_radius': 'in_radius',
 'm10_theorem_ex_radius': 'ex_radius',
 'm10_theorem_three_point_circle': 'three_point_circle',
 'm10_theorem_centre_bisects': 'centre_bisects',
 'm10_theorem_perp_bisects': 'perp_bisects',
 'm10_theorem_equal_chords_equal_dist': 'equal_chords_equal_dist',
 'm10_theorem_equidistant_chords': 'equidistant_chords',
 'm10_theorem_congruent_arcs': 'congruent_arcs',
 'm10_theorem_equal_chords_arcs': 'equal_chords_arcs',
 'm10_theorem_equal_chords_angles': 'equal_chords_angles',
 'm10_theorem_equal_angles_chords': 'equal_angles_chords',
 'm10_theorem_perp_radius_tangent': 'perp_radius_tangent',
 'm10_theorem_tangent_perp_radius': 'tangent_perp_radius',
 'm10_theorem_equal_tangents': 'equal_tangents',
 'm10_theorem_external_touching': 'external_touching',
 'm10_theorem_internal_touching': 'internal_touching',
 'm10_theorem_alternate_segment': 'alternate_segment',
 'm10_theorem_central_angle': 'central_angle',
 'm10_theorem_same_segment': 'same_segment',
 'm10_theorem_semicircle': 'semicircle',
 'm10_theorem_major_segment': 'major_segment',
 'm10_theorem_minor_segment': 'minor_segment',
 'm10_theorem_cyclic_quad': 'cyclic_quad',
 };

 const theoremKey = moduleId ? moduleToTheorem[moduleId] : undefined;
 const config = theoremKey ? CLASS10_THEOREMS[theoremKey] : undefined;

 if (!config) {
 return (
 <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#000000]">
 <LabHeader onExit={onExit} title={t('lab.m10theoremviewer_theorem_not_found')} />
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
