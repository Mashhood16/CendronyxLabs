import { BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS7Unit10Projects({ onExit }: LabProps) {
    const { t } = useTranslate();
 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.s7unit10projects_unit_10_heat_and_temperature_p')} />

  <div className="flex-1 p-8 flex flex-col items-center">
  <div className="bg-slate-50 dark:!bg-[#121212] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] max-w-4xl w-full">
   <div className="flex items-center mb-8">
   <div className="bg-blue-100 p-3 rounded-xl mr-4"><BookOpen className="w-8 h-8 text-blue-600" /></div>
   <div>
    <h2 className="text-3xl font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.s7unit10projects_homemade_insulated_cooler')}</h2>
    <p className="text-slate-500 dark:text-[#71717a]">{t('lab.s7unit10projects_project_work_submission_guide')}</p>
   </div>
   </div>

   <div className="prose prose-slate dark:prose-invert max-w-none">
   <h3>{t('lab.s7unit10projects_objective')}</h3>
   <p>{t('lab.s7unit10projects_engineer_and_construct_a_homem')}</p>
   
   <h3>{t('lab.s7unit10projects_testing_criteria')}</h3>
   <ul>
    <li>{t('lab.s7unit10projects_your_cooler_must_be_able_to_ho')}</li>
    <li>{t('lab.s7unit10projects_you_must_test_your_cooler_by_p')}</li>
    <li>{t('lab.s7unit10projects_after_4_hours_open_the_cooler_')} <strong>{t('lab.s7unit10projects_least')}</strong>  {t('lab.s7unit10projects_amount_of_liquid_water_has_the')}</li>
   </ul>

   <div className="grid grid-cols-2 gap-4 mt-6">
    <div className="bg-emerald-50 p-4 rounded border border-emerald-200">
     <h4 className="text-emerald-800 mt-0">{t('lab.s7unit10projects_good_insulators')}</h4>
     <ul className="text-sm">
     <li>{t('lab.s7unit10projects_styrofoam')}</li>
     <li>{t('lab.s7unit10projects_cotton_or_wool_fabric')}</li>
     <li>{t('lab.s7unit10projects_trapped_air_pockets_bubble_wra')}</li>
     <li>{t('lab.s7unit10projects_aluminum_foil_reflects_radiant')}</li>
     </ul>
    </div>
    <div className="bg-red-50 p-4 rounded border border-red-200">
     <h4 className="text-red-800 mt-0">{t('lab.s7unit10projects_poor_insulators')}</h4>
     <ul className="text-sm">
     <li>{t('lab.s7unit10projects_metals_tin_foil_alone_conducts')}</li>
     <li>{t('lab.s7unit10projects_thin_plastic')}</li>
     <li>{t('lab.s7unit10projects_glass')}</li>
     </ul>
    </div>
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
