import { BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS7Unit4Projects({ onExit }: LabProps) {
    const { t } = useTranslate();
 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.s7unit4projects_unit_4_physical_and_chemical_c')} />

  <div className="flex-1 p-8 flex flex-col items-center">
  <div className="bg-slate-50 dark:!bg-[#121212] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] max-w-4xl w-full">
   <div className="flex items-center mb-8">
   <div className="bg-amber-100 p-3 rounded-xl mr-4"><BookOpen className="w-8 h-8 text-amber-600" /></div>
   <div>
    <h2 className="text-3xl font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.s7unit4projects_comparative_poster_assignment')}</h2>
    <p className="text-slate-500 dark:text-[#71717a]">{t('lab.s7unit4projects_project_work_submission_guide')}</p>
   </div>
   </div>

   <div className="prose prose-slate dark:prose-invert max-w-none">
   <h3>{t('lab.s7unit4projects_objective')}</h3>
   <p>{t('lab.s7unit4projects_make_a_poster_to_visually_comp')}</p>
   
   <div className="grid grid-cols-2 gap-8 mt-6">
    <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
    <h4 className="mt-0">{t('lab.s7unit4projects_physical_changes')}</h4>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">{t('lab.s7unit4projects_no_new_substance_is_formed_the')}</p>
    <ul>
     <li>{t('lab.s7unit4projects_melting_ice')}</li>
     <li>{t('lab.s7unit4projects_tearing_paper')}</li>
     <li>{t('lab.s7unit4projects_chopping_wood')}</li>
     <li>{t('lab.s7unit4projects_boiling_water')}</li>
    </ul>
    </div>
    <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
    <h4 className="mt-0">{t('lab.s7unit4projects_chemical_changes')}</h4>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">{t('lab.s7unit4projects_a_new_substance_with_different')}</p>
    <ul>
     <li>{t('lab.s7unit4projects_burning_wood')}</li>
     <li>{t('lab.s7unit4projects_rusting_iron')}</li>
     <li>{t('lab.s7unit4projects_baking_a_cake')}</li>
     <li>{t('lab.s7unit4projects_digesting_food')}</li>
    </ul>
    </div>
   </div>

   <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mt-8 dark:bg-teal-950/20 dark:border-teal-900">
    <h4 className="text-blue-800 font-bold mt-0 dark:text-[#ffffff]">{t('lab.s7unit4projects_design_requirements')}</h4>
    <p className="text-blue-700 mb-0">{t('lab.s7unit4projects_you_must_draw_or_paste_picture')}</p>
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
