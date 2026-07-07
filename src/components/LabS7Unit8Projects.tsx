import { BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS7Unit8Projects({ onExit }: LabProps) {
    const { t } = useTranslate();
 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.s7unit8projects_unit_8_force_and_motion_projec')} />

  <div className="flex-1 p-8 flex flex-col items-center">
  <div className="bg-slate-50 dark:!bg-[#121212] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] max-w-4xl w-full">
   <div className="flex items-center mb-8">
   <div className="bg-cyan-100 p-3 rounded-xl mr-4"><BookOpen className="w-8 h-8 text-cyan-600" /></div>
   <div>
    <h2 className="text-3xl font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.s7unit8projects_water_rocket_assembly')}</h2>
    <p className="text-slate-500 dark:text-[#71717a]">{t('lab.s7unit8projects_project_work_submission_guide')}</p>
   </div>
   </div>

   <div className="prose prose-slate dark:prose-invert max-w-none">
   <h3>{t('lab.s7unit8projects_objective')}</h3>
   <p>{t('lab.s7unit8projects_make_a_working_model_of_a_wate')}</p>
   
   <h3>{t('lab.s7unit8projects_materials_needed')}</h3>
   <ul>
    <li>{t('lab.s7unit8projects_2_liter_plastic_soda_bottle_em')}</li>
    <li>{t('lab.s7unit8projects_cardboard_for_fins_and_a_nose_')}</li>
    <li>{t('lab.s7unit8projects_duct_tape')}</li>
    <li>{t('lab.s7unit8projects_cork_that_tightly_fits_the_bot')}</li>
    <li>{t('lab.s7unit8projects_bicycle_pump_with_a_needle_ada')}</li>
    <li>{t('lab.s7unit8projects_water')}</li>
   </ul>

   <div className="bg-red-50 p-6 rounded-xl border border-red-200 mt-8">
    <h4 className="text-red-800 font-bold mt-0 flex items-center">{t('lab.s7unit8projects_safety_warning')}</h4>
    <p className="text-red-700 mb-0"><strong>{t('lab.s7unit8projects_never')}</strong>  {t('lab.s7unit8projects_launch_a_water_rocket_indoors_')}</p>
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
