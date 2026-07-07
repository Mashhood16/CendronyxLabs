import { BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS7Unit2Projects({ onExit }: LabProps) {
    const { t } = useTranslate();
 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.s7unit2projects_unit_2_human_body_systems_proj')} />

  <div className="flex-1 p-8 flex flex-col items-center">
  <div className="bg-slate-50 dark:!bg-[#121212] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] max-w-4xl w-full">
   <div className="flex items-center mb-8">
   <div className="bg-red-100 p-3 rounded-xl mr-4"><BookOpen className="w-8 h-8 text-red-600" /></div>
   <div>
    <h2 className="text-3xl font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.s7unit2projects_working_model_observations')}</h2>
    <p className="text-slate-500 dark:text-[#71717a]">{t('lab.s7unit2projects_project_work_submission_guide')}</p>
   </div>
   </div>

   <div className="prose prose-slate dark:prose-invert max-w-none">
   <h3>{t('lab.s7unit2projects_activity_a_observing_blood_ves')}</h3>
   <p>{t('lab.s7unit2projects_stand_in_front_of_a_mirror_and')}</p>

   <hr className="my-8" />

   <h3>{t('lab.s7unit2projects_project_b_eco_friendly_system_')}</h3>
   <p>{t('lab.s7unit2projects_use_recycled_materials_to_buil')}</p>
   
   <h4>{t('lab.s7unit2projects_materials_ideas')}</h4>
   <ul>
    <li><strong>{t('lab.s7unit2projects_heart_lungs')}</strong>  {t('lab.s7unit2projects_old_plastic_bottles_balloons_o')}</li>
    <li><strong>{t('lab.s7unit2projects_veins_arteries_trachea')}</strong>  {t('lab.s7unit2projects_used_straws_old_string_or_rubb')}</li>
    <li><strong>{t('lab.s7unit2projects_base')}</strong>  {t('lab.s7unit2projects_a_discarded_cardboard_box_or_p')}</li>
   </ul>

   <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mt-8 dark:bg-teal-950/20 dark:border-teal-900">
    <h4 className="text-blue-800 font-bold mt-0 dark:text-[#ffffff]">{t('lab.s7unit2projects_submission_requirements')}</h4>
    <p className="text-blue-700 mb-0">{t('lab.s7unit2projects_bring_your_physical_model_to_c')}</p>
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
