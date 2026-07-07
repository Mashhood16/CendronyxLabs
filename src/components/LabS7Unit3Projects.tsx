import { BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS7Unit3Projects({ onExit }: LabProps) {
    const { t } = useTranslate();
 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.s7unit3projects_unit_3_immunity_and_diseases_p')} />

  <div className="flex-1 p-8 flex flex-col items-center">
  <div className="bg-slate-50 dark:!bg-[#121212] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] max-w-4xl w-full">
   <div className="flex items-center mb-8">
   <div className="bg-indigo-100 p-3 rounded-xl mr-4"><BookOpen className="w-8 h-8 text-indigo-600" /></div>
   <div>
    <h2 className="text-3xl font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.s7unit3projects_health_campaigns_infographics')}</h2>
    <p className="text-slate-500 dark:text-[#71717a]">{t('lab.s7unit3projects_project_work_submission_guide')}</p>
   </div>
   </div>

   <div className="prose prose-slate dark:prose-invert max-w-none">
   <h3>{t('lab.s7unit3projects_project_a_disease_infographic_')}</h3>
   <p>{t('lab.s7unit3projects_create_an_infographic_poster_a')}</p>
   <ul>
    <li><strong>{t('lab.s7unit3projects_cause')}</strong>  {t('lab.s7unit3projects_what_pathogen_causes_it_virus_')}</li>
    <li><strong>{t('lab.s7unit3projects_symptoms')}</strong>  {t('lab.s7unit3projects_how_does_it_make_you_feel')}</li>
    <li><strong>{t('lab.s7unit3projects_transmission')}</strong>  {t('lab.s7unit3projects_how_does_it_spread_from_person')}</li>
    <li><strong>{t('lab.s7unit3projects_prevention')}</strong>  {t('lab.s7unit3projects_how_can_someone_avoid_catching')}</li>
   </ul>

   <hr className="my-8" />

   <h3>{t('lab.s7unit3projects_project_b_immunity_booster_cam')}</h3>
   <p>{t('lab.s7unit3projects_create_an_awareness_campaign_t')} <em>{t('lab.s7unit3projects_how_to_boost_your_immune_syste')}</em>.</p>
   
   <h4>{t('lab.s7unit3projects_key_points_to_include')}</h4>
   <ul>
    <li>{t('lab.s7unit3projects_eating_a_balanced_diet_rich_in')}</li>
    <li>{t('lab.s7unit3projects_getting_adequate_high_quality_')}</li>
    <li>{t('lab.s7unit3projects_regular_physical_exercise')}</li>
    <li>{t('lab.s7unit3projects_proper_hygiene_practices_like_')}</li>
   </ul>

   <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200 mt-8">
    <h4 className="text-emerald-800 font-bold mt-0">{t('lab.s7unit3projects_display')}</h4>
    <p className="text-emerald-700 mb-0">{t('lab.s7unit3projects_the_best_posters_will_be_displ')}</p>
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
