import { useState } from 'react';
import { UserPlus, Apple, MessageCircle, Utensils } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS6BalancedDiet({ onExit }: LabProps) {
 const { t } = useTranslate();
 const [tab, setTab] = useState<'roleplay' | 'diary'>('roleplay');

 // Diary State
 const [diary, setDiary] = useState({
 breakfast: { fruit: '', grain: '', dairy: '', protein: '', veg: '' },
 lunch: { fruit: '', grain: '', dairy: '', protein: '', veg: '' },
 dinner: { fruit: '', grain: '', dairy: '', protein: '', veg: '' },
 });

 return (
 <div className="flex flex-col min- bg-rose-50 font-sans dark:!bg-[#000000] dark:border-[#1c1b1b] min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.s6balanceddiet_unit_3_balanced_diet_activitie')} />

 <div className="flex-1 flex flex-col p-8 items-center lg:overflow-y-auto">
 
 <div className="flex gap-4 mb-8">
 <button 
 onClick={() => setTab('roleplay')}
 className={`px-6 py-3 rounded-xl border-2 font-bold ${tab === 'roleplay' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:border-rose-300'}`}
 >
 
 {t('lab.s6balanceddiet_activity_3_2_royal_chef_role_p')}
 </button>
 <button 
 onClick={() => setTab('diary')}
 className={`px-6 py-3 rounded-xl border-2 font-bold ${tab === 'diary' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#ffffff] hover:border-orange-300'}`}
 >
 
 {t('lab.s6balanceddiet_activity_3_4_daily_food_diary')}
 </button>
 </div>

 {tab === 'roleplay' && (
 <div className="w-full max-w-4xl bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8">
 <h2 className="text-2xl font-bold text-rose-800 mb-6 flex items-center gap-2"><UserPlus /> {t('lab.s6balanceddiet_classroom_role_play_organizer')}</h2>
 
 <div className="grid grid-cols-2 gap-8">
 <div className="space-y-6">
 <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 dark:bg-[#121212] dark:border-[#1c1b1b]">
 <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2 dark:text-[#ffffff]">{t('lab.s6balanceddiet_the_royal_family')}</h3>
 <p className="text-sm text-amber-800 dark:text-[#ffffff]">{t('lab.s6balanceddiet_1_student_acts_as_the_king_or_')}</p>
 </div>
 
 <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 dark:bg-teal-950/20 dark:border-teal-900">
 <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2 dark:text-[#ffffff]">{t('lab.s6balanceddiet_the_royal_advisors')}</h3>
 <p className="text-sm text-blue-800 dark:text-[#ffffff]">{t('lab.s6balanceddiet_5_6_students_act_as_advisors_e')}</p>
 </div>
 </div>

 <div className="bg-rose-50 p-6 rounded-xl border border-rose-200 dark:bg-[#121212] dark:border-[#1c1b1b]">
 <h3 className="font-bold text-rose-900 mb-4 flex items-center gap-2"><Utensils /> {t('lab.s6balanceddiet_chef_candidates')}</h3>
 <p className="text-sm text-rose-800 mb-6">{t('lab.s6balanceddiet_the_rest_of_the_class_acts_as_')}</p>
 
 <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-rose-100">
 <h4 className="font-bold text-sm text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.s6balanceddiet_pitch_guidelines')}</h4>
 <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-[#a1a1aa] space-y-1">
 <li>{t('lab.s6balanceddiet_what_is_the_meal')}</li>
 <li>{t('lab.s6balanceddiet_what_food_groups_does_it_cover')}</li>
 <li>{t('lab.s6balanceddiet_why_is_it_healthy_for_the_king')}</li>
 <li>{t('lab.s6balanceddiet_how_is_it_cooked_e_g_baked_not')}</li>
 </ul>
 </div>
 </div>
 </div>

 <div className="mt-8 p-4 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg flex items-start gap-4">
 <MessageCircle className="w-6 h-6 text-slate-400 shrink-0" />
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa] italic">{t('lab.s6balanceddiet_your_majesty_i_propose_a_grill')}</p>
 </div>
 </div>
 )}

 {tab === 'diary' && (
 <div className="w-full max-w-5xl bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8 flex flex-col items-center">
 <h2 className="text-2xl font-bold text-orange-800 mb-2 flex items-center gap-2"><Apple /> {t('lab.s6balanceddiet_my_healthy_plate_diary')}</h2>
 <p className="text-slate-600 dark:text-[#a1a1aa] mb-8 text-center max-w-2xl">{t('lab.s6balanceddiet_fill_out_this_food_diary_to_pl')}</p>

 <div className="w-full overflow-x-auto">
 <table className="w-full text-left border-collapse border border-slate-200 dark:border-[#1c1b1b] rounded-lg overflow-hidden">
 <thead>
 <tr className="bg-orange-100 text-orange-900">
 <th className="p-4 border border-slate-200 dark:border-[#1c1b1b]">{t('lab.s6balanceddiet_meal')}</th>
 <th className="p-4 border border-slate-200 dark:border-[#1c1b1b]">{t('lab.s6balanceddiet_fruit')}</th>
 <th className="p-4 border border-slate-200 dark:border-[#1c1b1b]">{t('lab.s6balanceddiet_grain')}</th>
 <th className="p-4 border border-slate-200 dark:border-[#1c1b1b]">{t('lab.s6balanceddiet_dairy')}</th>
 <th className="p-4 border border-slate-200 dark:border-[#1c1b1b]">{t('lab.s6balanceddiet_protein')}</th>
 <th className="p-4 border border-slate-200 dark:border-[#1c1b1b]">{t('lab.s6balanceddiet_vegetable')}</th>
 </tr>
 </thead>
 <tbody>
 {['breakfast', 'lunch', 'dinner'].map((meal) => (
 <tr key={meal} className="hover:bg-slate-50 dark:bg-[#121212]">
 <td className="p-4 border border-slate-200 dark:border-[#1c1b1b] font-bold text-slate-700 dark:text-[#ffffff] capitalize">{meal === 'lunch' ? 'Lunchbox' : meal}</td>
 {['fruit', 'grain', 'dairy', 'protein', 'veg'].map((group) => (
 <td key={group} className="p-2 border border-slate-200 dark:border-[#1c1b1b]">
 <input 
 type="text" 
 className="w-full p-2 text-sm border border-slate-200 dark:border-[#1c1b1b] rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
 placeholder="..."
 value={(diary as any)[meal][group]}
 onChange={(e) => setDiary({...diary, [meal]: {...(diary as any)[meal], [group]: e.target.value}})}
 />
 </td>
 ))}
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 <button className="mt-8 px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 dark:text-white dark:text-white dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40">{t('lab.s6balanceddiet_save_food_diary')}</button>
 </div>
 )}

 </div>
 </div>
 );
}
