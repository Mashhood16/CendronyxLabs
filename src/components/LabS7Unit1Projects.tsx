import { BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS7Unit1Projects({ onExit }: LabProps) {
    const { t } = useTranslate();
 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.s7unit1projects_unit_1_plant_systems_projects')} />

  <div className="flex-1 p-8 flex flex-col items-center">
  <div className="bg-slate-50 dark:!bg-[#121212] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] max-w-4xl w-full">
   <div className="flex items-center mb-8">
   <div className="bg-green-100 p-3 rounded-xl mr-4"><BookOpen className="w-8 h-8 text-green-600" /></div>
   <div>
    <h2 className="text-3xl font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.s7unit1projects_photosynthesis_respiration_pos')}</h2>
    <p className="text-slate-500 dark:text-[#71717a]">{t('lab.s7unit1projects_project_work_submission_guide')}</p>
   </div>
   </div>

   <div className="prose prose-slate dark:prose-invert max-w-none">
   <h3>{t('lab.s7unit1projects_objective')}</h3>
   <p>{t('lab.s7unit1projects_create_a_comprehensive_poster_')}</p>
   
   <h3>{t('lab.s7unit1projects_requirements')}</h3>
   <ul>
    <li><strong>{t('lab.s7unit1projects_visual_elements')}</strong>  {t('lab.s7unit1projects_draw_a_plant_showing_the_intak')}</li>
    <li><strong>{t('lab.s7unit1projects_the_sun')}</strong>  {t('lab.s7unit1projects_clearly_show_sunlight_as_the_e')}</li>
    <li><strong>{t('lab.s7unit1projects_respiration')}</strong>  {t('lab.s7unit1projects_draw_arrows_showing_the_plant_')}</li>
    <li><strong>{t('lab.s7unit1projects_equations')}</strong>  {t('lab.s7unit1projects_include_the_simple_word_equati')}</li>
   </ul>

   <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 mt-8 dark:bg-[#121212] dark:border-[#1c1b1b]">
    <h4 className="text-amber-800 font-bold mt-0 dark:text-[#ffffff]">{t('lab.s7unit1projects_instructor_notes')}</h4>
    <p className="text-amber-700 mb-0">{t('lab.s7unit1projects_ensure_students_understand_tha')}</p>
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
