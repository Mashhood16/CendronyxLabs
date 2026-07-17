import { useState } from 'react';
import { CheckCircle, ShieldAlert, Check, X } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

interface Rule {
 id: string;
 text: string;
 type: 'do' | 'dont';
}

export default function LabC6LabRules({ onExit }: LabProps) {
 const { t } = useTranslate();
 const allRules: Rule[] = [
 { id: '1', text: 'Keep the computer lab clean and tidy.', type: 'do' },
 { id: '2', text: 'Bring food or drinks near the computers.', type: 'dont' },
 { id: '3', text: 'Report any hardware issues to the teacher.', type: 'do' },
 { id: '4', text: 'Run or play around in the laboratory.', type: 'dont' },
 { id: '5', text: 'Save your work frequently.', type: 'do' },
 { id: '6', text: 'Change system settings without permission.', type: 'dont' },
 { id: '7', text: 'Scan external drives for viruses before use.', type: 'do' },
 { id: '8', text: 'Share your passwords with friends.', type: 'dont' },
 ];

 const [unassigned, setUnassigned] = useState<Rule[]>(allRules);
 const [dos, setDos] = useState<Rule[]>([]);
 const [donts, setDonts] = useState<Rule[]>([]);
 const [selectedRule, setSelectedRule] = useState<Rule | null>(null);

 const assignRule = (target: 'do' | 'dont') => {
 if (!selectedRule) return;

 setUnassigned(unassigned.filter(r => r.id !== selectedRule.id));
 
 if (target === 'do') {
 setDos([...dos, selectedRule]);
 } else {
 setDonts([...donts, selectedRule]);
 }
 
 setSelectedRule(null);
 };

 const isComplete = unassigned.length === 0;
 const isCorrect = isComplete && dos.every(r => r.type === 'do') && donts.every(r => r.type === 'dont');

 return (
 <div className="flex flex-col font-sans bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.c6labrules_ict_lab_rules_chart')} />
 <div className="flex-1 px-8 pb-8 flex flex-col lg:overflow-y-auto">
 

 <p className="text-slate-600 dark:text-[#a1a1aa] mb-8">{t('lab.c6labrules_click_a_rule_from_the_list_the')}</p>

 <div className="flex gap-8 flex-1 ">
 {/* Rules Pool */}
 <div className="w-1/3 flex flex-col gap-4">
 <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-1 flex flex-col">
 <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mb-4 uppercase text-sm tracking-wider">{t('lab.c6labrules_unsorted_rules')}{unassigned.length})</h3>
 <div className="flex flex-col gap-3 flex-1 lg:overflow-y-auto pr-2">
 {unassigned.map(rule => (
 <button
 key={rule.id}
 onClick={() => setSelectedRule(rule)}
 className={`p-4 rounded-lg border-2 text-left transition-colors font-medium text-sm leading-snug ${ selectedRule?.id === rule.id ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-slate-200 dark:border-[#1c1b1b] hover:border-slate-300 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] hover:bg-slate-50 dark:bg-[#121212]' }`}
 >
 {rule.text}
 </button>
 ))}
 {unassigned.length === 0 && (
 <div className="flex-1 flex items-center justify-center text-slate-400 font-medium">
 
 {t('lab.c6labrules_all_rules_sorted')}
 </div>
 )}
 </div>

 <div className="mt-6 flex gap-3">
 <button 
 onClick={() => assignRule('do')}
 disabled={!selectedRule}
 className="flex-1 py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-center items-center gap-2"
 >
 <Check className="w-5 h-5" />
 DO
 </button>
 <button 
 onClick={() => assignRule('dont')}
 disabled={!selectedRule}
 className="flex-1 py-3 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-center items-center gap-2"
 >
 <X className="w-5 h-5" />
 
 {t('lab.c6labrules_don_t')}
 </button>
 </div>
 </div>
 </div>

 {/* Chart Columns */}
 <div className="flex-1 flex gap-6">
 <div className="flex-1 bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col lg:overflow-hidden">
 <div className="bg-emerald-500 text-white p-4 text-center">
 <h2 className="text-2xl font-bold uppercase tracking-wider flex items-center justify-center gap-2">
 <CheckCircle className="w-6 h-6" /> {t('lab.c6labrules_do_s')}
 </h2>
 </div>
 <div className="p-6 flex-1 flex flex-col gap-3 lg:overflow-y-auto bg-emerald-50/30">
 {dos.map(rule => (
 <div key={rule.id} className="p-4 bg-slate-50 dark:!bg-[#121212] border border-emerald-100 rounded-lg shadow-sm font-medium text-emerald-900 flex items-start gap-3">
 <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
 {rule.text}
 </div>
 ))}
 </div>
 </div>

 <div className="flex-1 bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col lg:overflow-hidden">
 <div className="bg-rose-500 text-white p-4 text-center dark:bg-[#121212] dark:border-[#1c1b1b]">
 <h2 className="text-2xl font-bold uppercase tracking-wider flex items-center justify-center gap-2">
 <ShieldAlert className="w-6 h-6" /> {t('lab.c6labrules_don_ts')}
 </h2>
 </div>
 <div className="p-6 flex-1 flex flex-col gap-3 lg:overflow-y-auto bg-rose-50/30 dark:bg-[#121212] dark:border-[#1c1b1b]">
 {donts.map(rule => (
 <div key={rule.id} className="p-4 bg-slate-50 dark:!bg-[#121212] border border-rose-100 rounded-lg shadow-sm font-medium text-rose-900 flex items-start gap-3">
 <X className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
 {rule.text}
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>

 {isComplete && (
 <div className={`mt-6 p-6 rounded-xl flex items-center justify-center gap-4 font-bold text-xl ${isCorrect ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
 {isCorrect ? (
 <>
 <CheckCircle className="w-8 h-8" />
 
 {t('lab.c6labrules_perfect_the_ict_lab_rules_char')}
 </>
 ) : (
 <>
 <ShieldAlert className="w-8 h-8" />
 
 {t('lab.c6labrules_some_rules_are_in_the_wrong_co')}
 </>
 )}
 </div>
 )}
 </div>
 </div>
 );
}
