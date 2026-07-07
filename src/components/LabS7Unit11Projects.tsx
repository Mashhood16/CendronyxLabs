import { BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS7Unit11Projects({ onExit }: LabProps) {
    const { t } = useTranslate();
 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.s7unit11projects_unit_11_technology_in_everyday')} />

  <div className="flex-1 p-8 flex flex-col items-center">
  <div className="bg-slate-50 dark:!bg-[#121212] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] max-w-4xl w-full">
   <div className="flex items-center mb-8">
   <div className="bg-sky-100 p-3 rounded-xl mr-4"><BookOpen className="w-8 h-8 text-sky-600" /></div>
   <div>
    <h2 className="text-3xl font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.s7unit11projects_water_footprint_tracker')}</h2>
    <p className="text-slate-500 dark:text-[#71717a]">{t('lab.s7unit11projects_project_work_submission_guide')}</p>
   </div>
   </div>

   <div className="prose prose-slate dark:prose-invert max-w-none">
   <h3>{t('lab.s7unit11projects_objective')}</h3>
   <p>{t('lab.s7unit11projects_calculate_your_direct_water_us')}</p>
   
   <h3>{t('lab.s7unit11projects_part_1_the_5_day_audit')}</h3>
   <p>{t('lab.s7unit11projects_keep_a_notebook_and_estimate_h')}</p>
   <div className="overflow-x-auto">
    <table className="min-w-full border-collapse border border-slate-300 dark:border-[#1c1b1b] mb-4">
    <thead className="bg-slate-100 dark:bg-[#121212]">
     <tr>
     <th className="border border-slate-300 dark:border-[#1c1b1b] p-2 text-left">{t('lab.s7unit11projects_activity')}</th>
     <th className="border border-slate-300 dark:border-[#1c1b1b] p-2 text-left">{t('lab.s7unit11projects_estimated_liters_per_use')}</th>
     </tr>
    </thead>
    <tbody>
     <tr><td className="border border-slate-300 dark:border-[#1c1b1b] p-2">{t('lab.s7unit11projects_flushing_toilet')}</td><td className="border border-slate-300 dark:border-[#1c1b1b] p-2">{t('lab.s7unit11projects_6_to_9_liters')}</td></tr>
     <tr><td className="border border-slate-300 dark:border-[#1c1b1b] p-2">{t('lab.s7unit11projects_brushing_teeth_tap_running')}</td><td className="border border-slate-300 dark:border-[#1c1b1b] p-2">{t('lab.s7unit11projects_5_liters_per_min')}</td></tr>
     <tr><td className="border border-slate-300 dark:border-[#1c1b1b] p-2">{t('lab.s7unit11projects_shower')}</td><td className="border border-slate-300 dark:border-[#1c1b1b] p-2">{t('lab.s7unit11projects_10_liters_per_min')}</td></tr>
     <tr><td className="border border-slate-300 dark:border-[#1c1b1b] p-2">{t('lab.s7unit11projects_drinking')}</td><td className="border border-slate-300 dark:border-[#1c1b1b] p-2">{t('lab.s7unit11projects_0_25_liters_per_glass')}</td></tr>
    </tbody>
    </table>
   </div>

   <h3>{t('lab.s7unit11projects_part_2_the_conservation_drive')}</h3>
   <p>{t('lab.s7unit11projects_compare_your_total_5_day_usage')}</p>

   </div>
  </div>
  </div>
 </div>
 );
}
