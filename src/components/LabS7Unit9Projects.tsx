import { BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS7Unit9Projects({ onExit }: LabProps) {
 const { t } = useTranslate();
 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.s7unit9projects_unit_9_waves_and_energy_projec')} />

 <div className="flex-1 p-8 flex flex-col items-center">
 <div className="bg-slate-50 dark:!bg-[#121212] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] max-w-4xl w-full">
 <div className="flex items-center mb-8">
 <div className="bg-indigo-100 p-3 rounded-xl mr-4"><BookOpen className="w-8 h-8 text-indigo-600" /></div>
 <div>
 <h2 className="text-3xl font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.s7unit9projects_rubber_band_instrument')}</h2>
 <p className="text-slate-500 dark:text-[#71717a]">{t('lab.s7unit9projects_project_work_submission_guide')}</p>
 </div>
 </div>

 <div className="prose prose-slate dark:prose-invert max-w-none">
 <h3>{t('lab.s7unit9projects_objective')}</h3>
 <p>{t('lab.s7unit9projects_design_and_build_a_simple_stri')}</p>
 
 <h3>{t('lab.s7unit9projects_instructions')}</h3>
 <ol>
 <li>{t('lab.s7unit9projects_take_a_sturdy_piece_of_thick_c')}</li>
 <li>{t('lab.s7unit9projects_place_small_nails_or_push_pins')} <em>{t('lab.s7unit9projects_ask_an_adult_for_help_if_using')}</em></li>
 <li>{t('lab.s7unit9projects_stretch_different_sizes_and_th')}</li>
 <li>{t('lab.s7unit9projects_pluck_each_band_and_adjust_the')}</li>
 </ol>

 <div className="bg-slate-100 dark:bg-[#121212] p-6 rounded-xl border border-slate-300 dark:border-[#1c1b1b] mt-8">
 <h4 className="text-slate-800 dark:text-[#ffffff] font-bold mt-0">{t('lab.s7unit9projects_scientific_principles')}</h4>
 <p className="text-slate-700 dark:text-[#ffffff] mb-0">{t('lab.s7unit9projects_be_prepared_to_explain_to_your')} <strong>{t('lab.s7unit9projects_thickness')}</strong> {t('lab.s7unit9projects_and')} <strong>{t('lab.s7unit9projects_length')}</strong> {t('lab.s7unit9projects_of_the_rubber_bands_affect_the')}</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
