import { useState } from 'react';
import { Image, Table, CheckCircle, Save } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabC7CVCreation({ onExit }: LabProps) {
    const { t } = useTranslate();
 const [hasPicture, setHasPicture] = useState(false);
 const [hasTable, setHasTable] = useState(false);
 const [name, setName] = useState('');
 const [interests, setInterests] = useState('');

 const isComplete = hasPicture && hasTable && name.length > 2 && interests.length > 5;

 return (
 <div className="flex flex-col min- lg: font-sans bg-slate-100 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.c7cvcreation_cv_resume_creation')} />
  <div className="flex-1 px-8 pb-8 flex flex-col lg:overflow-y-auto">

  <p className="text-slate-600 dark:text-[#a1a1aa] mb-6">{t('lab.c7cvcreation_build_a_professional_cv_by_ins')}</p>

  {isComplete && (
   <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl mb-6 flex items-center border border-emerald-300 shadow-sm w-fit">
   <CheckCircle className="w-6 h-6 mr-3" />
   <span className="font-bold">{t('lab.c7cvcreation_cv_ready')}</span>  {t('lab.c7cvcreation_your_curriculum_vitae_is_compl')}
                        </div>
  )}

  {/* Toolbar */}
  <div className="bg-slate-50 dark:!bg-[#121212] rounded-t-xl border border-slate-300 dark:border-[#1c1b1b] p-3 flex gap-2 w-full max-w-3xl mx-auto shadow-sm">
   <button 
   onClick={() => setHasPicture(true)}
   className="flex items-center px-4 py-2 bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:bg-[#121212] rounded text-sm font-medium transition-colors border border-slate-200 dark:border-[#1c1b1b]"
   >
   <Image className="w-4 h-4 mr-2 text-blue-600" />
   
                        {t('lab.c7cvcreation_insert_picture')}
                        </button>
   <button 
   onClick={() => setHasTable(true)}
   className="flex items-center px-4 py-2 bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:bg-[#121212] rounded text-sm font-medium transition-colors border border-slate-200 dark:border-[#1c1b1b]"
   >
   <Table className="w-4 h-4 mr-2 text-emerald-600" />
   
                        {t('lab.c7cvcreation_insert_table')}
                        </button>
   <button 
   className="flex items-center px-4 py-2 bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:bg-[#121212] rounded text-sm font-medium transition-colors border border-slate-200 dark:border-[#1c1b1b] ml-auto text-slate-400"
   >
   <Save className="w-4 h-4 mr-2" />
   
                        {t('lab.c7cvcreation_print_document')}
                        </button>
  </div>

  {/* CV Paper */}
  <div className="bg-slate-50 dark:bg-[#121212] w-full max-w-3xl mx-auto flex-1 border-b border-l border-r border-slate-300 dark:border-[#1c1b1b] shadow-xl p-12 lg:overflow-y-auto">
   <div className="flex justify-between items-start mb-8 border-b-2 border-[#1c1b1b] dark:border-[#1c1b1b] pb-8">
   <div className="flex-1 pr-8">
    <input 
    type="text" 
    placeholder={t('lab.c7cvcreation_your_full_name')} 
    className="text-4xl font-black w-full outline-none uppercase tracking-widest text-slate-800 dark:text-[#ffffff] mb-2 placeholder:text-slate-300"
    value={name}
    onChange={(e) => setName(e.target.value)}
    />
    <p className="text-slate-500 dark:text-[#71717a] font-medium tracking-widest text-sm">{t('lab.c7cvcreation_student_future_tech_leader')}</p>
   </div>
   {hasPicture ? (
    <div className="w-32 h-32 rounded bg-slate-200 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] flex items-center justify-center overflow-hidden shrink-0">
    <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200" alt={t("Profile")} className="w-full h-full object-cover" />
    </div>
   ) : (
    <div className="w-32 h-32 rounded border-2 border-dashed border-slate-300 dark:border-[#1c1b1b] flex items-center justify-center text-slate-400 text-sm font-medium text-center p-4 bg-slate-50 dark:bg-[#121212]">
    
                                     {t('lab.c7cvcreation_click_insert_picture')}
                                     </div>
   )}
   </div>

   <div className="mb-10">
   <h2 className="text-xl font-bold tracking-widest uppercase mb-4 text-slate-800 dark:text-[#ffffff] flex items-center">
    <span className="w-6 h-6 bg-[#121212] dark:bg-[#121212] text-white rounded flex items-center justify-center mr-3 text-sm">1</span>
    
                             {t('lab.c7cvcreation_academic_details')}
                            </h2>
   {hasTable ? (
    <table className="w-full border-collapse">
    <thead>
     <tr className="bg-[#121212] dark:bg-[#121212] text-white text-left text-sm uppercase tracking-wider">
     <th className="p-3 border border-[#1c1b1b] dark:border-[#1c1b1b]">{t('lab.c7cvcreation_degree_class')}</th>
     <th className="p-3 border border-[#1c1b1b] dark:border-[#1c1b1b]">{t('lab.c7cvcreation_institution')}</th>
     <th className="p-3 border border-[#1c1b1b] dark:border-[#1c1b1b]">{t('lab.c7cvcreation_year')}</th>
     <th className="p-3 border border-[#1c1b1b] dark:border-[#1c1b1b]">{t('lab.c7cvcreation_grade')}</th>
     </tr>
    </thead>
    <tbody>
     <tr>
     <td className="p-3 border border-slate-300 dark:border-[#1c1b1b] font-medium">{t('lab.c7cvcreation_class_7')}</td>
     <td className="p-3 border border-slate-300 dark:border-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa]">{t('lab.c7cvcreation_model_high_school')}</td>
     <td className="p-3 border border-slate-300 dark:border-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa]">2026</td>
     <td className="p-3 border border-slate-300 dark:border-[#1c1b1b] font-bold text-emerald-600">A+</td>
     </tr>
     <tr className="bg-slate-50 dark:bg-[#121212]">
     <td className="p-3 border border-slate-300 dark:border-[#1c1b1b] font-medium">{t('lab.c7cvcreation_class_6')}</td>
     <td className="p-3 border border-slate-300 dark:border-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa]">{t('lab.c7cvcreation_model_high_school')}</td>
     <td className="p-3 border border-slate-300 dark:border-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa]">2025</td>
     <td className="p-3 border border-slate-300 dark:border-[#1c1b1b] font-bold text-emerald-600">A</td>
     </tr>
    </tbody>
    </table>
   ) : (
    <div className="w-full h-32 border-2 border-dashed border-slate-300 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] flex items-center justify-center text-slate-400 font-medium rounded">
    
                                     {t('lab.c7cvcreation_click_insert_table_in_toolbar')}
                                     </div>
   )}
   </div>

   <div>
   <h2 className="text-xl font-bold tracking-widest uppercase mb-4 text-slate-800 dark:text-[#ffffff] flex items-center">
    <span className="w-6 h-6 bg-[#121212] dark:bg-[#121212] text-white rounded flex items-center justify-center mr-3 text-sm">2</span>
    
                             {t('lab.c7cvcreation_personal_interests')}
                            </h2>
   <textarea 
    className="w-full h-32 border border-slate-200 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] p-4 rounded outline-none focus:ring-2 focus:ring-blue-500 resize-none"
    placeholder={t('lab.c7cvcreation_list_your_hobbies_and_interest')}
    value={interests}
    onChange={(e) => setInterests(e.target.value)}
   />
   </div>

  </div>
  </div>
 </div>
 );
}
