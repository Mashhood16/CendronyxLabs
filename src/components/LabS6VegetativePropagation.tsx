import { useState } from 'react';
import { Edit2, CheckCircle, Leaf } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabS6VegetativePropagation({ onExit }: LabProps) {
 const { t } = useTranslate();
 const [data, setData] = useState({
 seeds: { plants: '', leaves: '', flowers: '', color: '', smell: '', total: '' },
 cuttings: { plants: '', leaves: '', flowers: '', color: '', smell: '', total: '' }
 });

 const [submitted, setSubmitted] = useState(false);

 const isComplete = () => {
 return Object.values(data.seeds).every(v => v !== '') && Object.values(data.cuttings).every(v => v !== '');
 };

 return (
 <div className="flex flex-col min- bg-emerald-50 font-sans min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.s6vegetativepropagation_unit_2_vegetative_propagation_')} />

 <div className="flex-1 flex flex-col p-8 items-center lg:overflow-y-auto">
 <div className="w-full max-w-5xl bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8">
 
 <div className="flex items-start gap-4 mb-8 bg-emerald-50 border border-emerald-200 p-6 rounded-xl">
 <Leaf className="w-8 h-8 text-emerald-600 shrink-0 mt-1" />
 <div>
 <h2 className="text-xl font-bold text-emerald-800 mb-2">{t('lab.s6vegetativepropagation_long_term_observation_project')}</h2>
 <p className="text-slate-600 dark:text-[#a1a1aa] text-sm leading-relaxed">
 
 {t('lab.s6vegetativepropagation_in_winter_take_seeds_and_stem_')}
 </p>
 </div>
 </div>

 <h3 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2"><Edit2 className="w-5 h-5" /> {t('lab.s6vegetativepropagation_data_collection_table')}</h3>
 
 <div className="overflow-x-auto border border-slate-200 dark:border-[#1c1b1b] rounded-xl mb-8">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff]">
 <th className="p-4 border-b border-slate-200 dark:border-[#1c1b1b] font-bold w-1/3">{t('lab.s6vegetativepropagation_observation_parameter')}</th>
 <th className="p-4 border-b border-slate-200 dark:border-[#1c1b1b] border-l font-bold w-1/3">{t('lab.s6vegetativepropagation_group_1_grown_from_seeds')}</th>
 <th className="p-4 border-b border-slate-200 dark:border-[#1c1b1b] border-l font-bold w-1/3">{t('lab.s6vegetativepropagation_group_2_grown_from_cuttings')}</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200">
 {[
 { key: 'plants', label: 'Number of small plants grown' },
 { key: 'leaves', label: 'Number of leaves on a plant' },
 { key: 'flowers', label: 'Number of flowers on a plant' },
 { key: 'color', label: 'Color of flowers' },
 { key: 'smell', label: 'Smell of flowers' },
 { key: 'total', label: 'Total production of flowers' },
 ].map((row) => (
 <tr key={row.key} className="hover:bg-slate-50 dark:bg-[#121212] transition-colors">
 <td className="p-4 text-sm font-medium text-slate-700 dark:text-[#ffffff]">{row.label}</td>
 <td className="p-2 border-l border-slate-200 dark:border-[#1c1b1b]">
 <input 
 type="text" 
 value={data.seeds[row.key as keyof typeof data.seeds]}
 onChange={(e) => setData({ ...data, seeds: { ...data.seeds, [row.key]: e.target.value } })}
 placeholder={t('lab.s6vegetativepropagation_enter_observation')}
 disabled={submitted}
 className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none disabled:bg-slate-50 dark:bg-[#121212] disabled:text-slate-500 dark:text-[#71717a]"
 />
 </td>
 <td className="p-2 border-l border-slate-200 dark:border-[#1c1b1b]">
 <input 
 type="text" 
 value={data.cuttings[row.key as keyof typeof data.cuttings]}
 onChange={(e) => setData({ ...data, cuttings: { ...data.cuttings, [row.key]: e.target.value } })}
 placeholder={t('lab.s6vegetativepropagation_enter_observation')}
 disabled={submitted}
 className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none disabled:bg-slate-50 dark:bg-[#121212] disabled:text-slate-500 dark:text-[#71717a]"
 />
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {!submitted ? (
 <button 
 onClick={() => setSubmitted(true)}
 disabled={!isComplete()}
 className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
 >
 
 {t('lab.s6vegetativepropagation_submit_observation_report')}
 </button>
 ) : (
 <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-start gap-4">
 <CheckCircle className="w-8 h-8 shrink-0 text-emerald-600" />
 <div>
 <h4 className="font-bold text-lg mb-2">{t('lab.s6vegetativepropagation_report_submitted_successfully')}</h4>
 <p className="text-sm">{t('lab.s6vegetativepropagation_based_on_typical_scientific_re')}</p>
 <button onClick={() => setSubmitted(false)} className="mt-4 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">{t('lab.s6vegetativepropagation_edit_data')}</button>
 </div>
 </div>
 )}

 </div>
 </div>
 </div>
 );
}
