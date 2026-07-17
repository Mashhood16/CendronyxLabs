import { useState } from 'react';
import { Database, CheckCircle, XCircle, Bug, StepForward, RotateCcw, Save } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

export default function LabCS12Programming({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [activeTab, setActiveTab] = useState<'Debugger' | 'Database'>('Debugger');

 // Debugger State
 const [activeLine, setActiveLine] = useState(5);
 const [watchAcc, setWatchAcc] = useState<string | number>('undefined');

 const stepDebugger = () => {
 if (activeLine === 5) {
 setWatchAcc(100);
 setActiveLine(6);
 } else if (activeLine === 6) {
 setWatchAcc(150);
 setActiveLine(7);
 } else if (activeLine === 7) {
 setActiveLine(8); // End
 }
 };

 const resetDebugger = () => {
 setActiveLine(5);
 setWatchAcc('undefined');
 };

 // Database State
 const [nfLevel, setNfLevel] = useState<1 | 2 | 3>(1);

 // Assessment State
 const [q1, setQ1] = useState('');
 const [q2, setQ2] = useState('');
 const [q1Status, setQ1Status] = useState<boolean | null>(null);
 const [q2Status, setQ2Status] = useState<boolean | null>(null);

 return (
 <div className="flex flex-col bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.cs12programming_interactive_core_dev')} subtitle={t('lab.subtitle_debugging_database_normalization')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.cs12programming_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.cs12programming_lab')}</button>
 </div>
 <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 min-h-0 lg:overflow-hidden">
 {/* Theory Column */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold mb-4 text-indigo-800 border-b pb-2 dark:text-[#ffffff]">{t('lab.cs12programming_theory_context')}</h2>
 <div className={`space-y-4 text-slate-700 dark:text-[#ffffff] lg:overflow-y-auto pr-2 flex-1 text-sm ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block`}>
 <p>
 <strong>{t('lab.cs12programming_object_oriented_programming_oo')}</strong> {t('lab.cs12programming_involves_encapsulating_data_an')}
 </p>
 <h3 className="font-semibold text-indigo-700 mt-2">{t('lab.cs12programming_debugging_breakpoints')}</h3>
 <p>
 
 {t('lab.cs12programming_a_visual_debugger_allows_devel')}
 </p>
 <h3 className="font-semibold text-indigo-700 mt-2">{t('lab.cs12programming_database_normalization')}</h3>
 <p>
 
 {t('lab.cs12programming_normalization_organizes_databa')}
 <br/>- <strong>{t('lab.cs12programming_1nf')}</strong> {t('lab.cs12programming_eliminate_repeating_groups')}
 <br/>- <strong>{t('lab.cs12programming_2nf')}</strong> {t('lab.cs12programming_remove_partial_dependencies')}
 <br/>- <strong>{t('lab.cs12programming_3nf')}</strong> {t('lab.cs12programming_remove_transitive_dependencies')}
 </p>
 </div>
 </div>

 {/* Simulation Column */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold mb-4 text-indigo-800 border-b pb-2 dark:text-[#ffffff]">{t('lab.cs12programming_simulator')}</h2>
 
 <div className="flex gap-2 mb-4">
 <button onClick={() => setActiveTab('Debugger')} className={`px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${activeTab === 'Debugger' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff]'} `}><Bug size={16}/> {t('lab.cs12programming_debugger')}</button>
 <button onClick={() => setActiveTab('Database')} className={`px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${activeTab === 'Database' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-[#121212] text-slate-600 dark:text-[#ffffff]'}`}><Database size={16}/> {t('lab.cs12programming_normalization')}</button>
 </div>

 <div className={`flex-1 flex flex-col bg-[#000000] dark:bg-[#121212] rounded-lg p-4 font-mono text-sm text-slate-300 relative shadow-inner `}>
 {activeTab === 'Debugger' && (
 <>
 <div className="flex-1">
 <div className={`px-2 py-1 ${activeLine === 1 ? 'bg-indigo-900 text-white border-l-4 border-indigo-500' : 'pl-3'}`}>{t('lab.cs12programming_1_class_account')} {'{'}</div>
 <div className={`px-2 py-1 ${activeLine === 2 ? 'bg-indigo-900 text-white border-l-4 border-indigo-500' : 'pl-3'}`}>{t('lab.cs12programming_2_constructor_balance')} {'{'} {t('lab.cs12programming_this_balance_balance')} {'}'}</div>
 <div className={`px-2 py-1 ${activeLine === 3 ? 'bg-indigo-900 text-white border-l-4 border-indigo-500' : 'pl-3'}`}>{t('lab.cs12programming_3_deposit_amt')} {'{'} {t('lab.cs12programming_this_balance_amt')} {'}'}</div>
 <div className={`px-2 py-1 ${activeLine === 4 ? 'bg-indigo-900 text-white border-l-4 border-indigo-500' : 'pl-3'}`}>4: {'}'}</div>
 <div className={`px-2 py-1 ${activeLine === 5 ? 'bg-indigo-900 text-white border-l-4 border-indigo-500' : 'pl-3'}`}>{t('lab.cs12programming_5_let_acc_new_account_100')}</div>
 <div className={`px-2 py-1 ${activeLine === 6 ? 'bg-indigo-900 text-white border-l-4 border-indigo-500' : 'pl-3'}`}>{t('lab.cs12programming_6_acc_deposit_50')}</div>
 <div className={`px-2 py-1 ${activeLine === 7 ? 'bg-indigo-900 text-white border-l-4 border-indigo-500' : 'pl-3'}`}>{t('lab.cs12programming_7_console_log_acc_balance')}</div>
 </div>
 
 <div className="border-t border-[#1c1b1b] dark:border-[#1c1b1b] pt-3 mt-3">
 <div className="flex justify-between items-center mb-2">
 <span className="font-bold text-indigo-400">{t('lab.cs12programming_watch_variables')}</span>
 <div className="flex gap-2">
 <button onClick={resetDebugger} className={`p-1 bg-slate-700 dark:bg-[#121212] hover:bg-slate-600 dark:bg-[#121212] rounded text-white dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent flex-col `}><RotateCcw size={16}/></button>
 <button onClick={stepDebugger} disabled={activeLine > 7} className={`p-1 bg-indigo-600 hover:bg-indigo-500 rounded text-white disabled:opacity-50 flex items-center gap-1 text-xs px-2 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40 flex-col `}><StepForward size={14}/> {t('lab.cs12programming_step')}</button>
 </div>
 </div>
 <div className="bg-[#121212] dark:bg-[#121212] p-2 rounded">
 
 {t('lab.cs12programming_acc')} {watchAcc === 'undefined' ? 'undefined' : `{ balance: ${watchAcc} }`}
 </div>
 </div>
 </>
 )}

 {activeTab === 'Database' && (
 <div className="flex-1 flex flex-col font-sans">
 <div className="flex gap-2 mb-4 justify-center">
 <button onClick={() => setNfLevel(1)} className={`px-3 py-1 rounded text-xs font-bold ${nfLevel === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-700 dark:bg-[#121212] text-slate-300'}`}>{t('lab.cs12programming_1nf_1')}</button>
 <button onClick={() => setNfLevel(2)} className={`px-3 py-1 rounded text-xs font-bold ${nfLevel === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-700 dark:bg-[#121212] text-slate-300'}`}>{t('lab.cs12programming_2nf_1')}</button>
 <button onClick={() => setNfLevel(3)} className={`px-3 py-1 rounded text-xs font-bold ${nfLevel === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-700 dark:bg-[#121212] text-slate-300'}`}>{t('lab.cs12programming_3nf_1')}</button>
 </div>

 <div className="flex-1 lg:overflow-y-auto space-y-4 pb-4">
 {nfLevel === 1 && (
 <div className="bg-slate-50 dark:bg-[#121212] text-slate-800 dark:text-[#ffffff] text-xs rounded border border-slate-300 dark:border-[#1c1b1b] overflow-hidden">
 <div className="bg-slate-200 dark:bg-[#121212] font-bold p-1 border-b border-slate-300 dark:border-[#1c1b1b] text-center">{t('lab.cs12programming_unnormalized_1nf_single_table')}</div>
 <table className="w-full text-left">
 <thead className="bg-slate-100 dark:bg-[#121212]"><tr><th className="p-1 border-r">{t('lab.cs12programming_ordid')}</th><th className="p-1 border-r">{t('lab.cs12programming_custname')}</th><th className="p-1 border-r">{t('lab.cs12programming_prodid')}</th><th className="p-1">{t('lab.cs12programming_prodname')}</th></tr></thead>
 <tbody>
 <tr className="border-t">
 <td className="p-1 border-r font-bold text-indigo-700">101</td><td className="p-1 border-r">{t('lab.cs12programming_alice')}</td><td className="p-1 border-r font-bold text-indigo-700">P1</td><td className="p-1">{t('lab.cs12programming_laptop')}</td>
 </tr>
 </tbody>
 </table>
 <div className="p-2 text-red-600 font-semibold text-[10px]">{t('lab.cs12programming_issue_partial_transitive_depen')}</div>
 </div>
 )}

 {nfLevel >= 2 && (
 <div className="grid grid-cols-2 gap-2">
 <div className="bg-slate-50 dark:bg-[#121212] text-slate-800 dark:text-[#ffffff] text-xs rounded border border-slate-300 dark:border-[#1c1b1b] overflow-hidden">
 <div className="bg-slate-200 dark:bg-[#121212] font-bold p-1 border-b border-slate-300 dark:border-[#1c1b1b] text-center">{t('lab.cs12programming_orders_table')}</div>
 <table className="w-full text-left">
 <thead className="bg-slate-100 dark:bg-[#121212]"><tr><th className="p-1 border-r text-indigo-700">{t('lab.cs12programming_ordid_pk')}</th><th className="p-1">{t('lab.cs12programming_custname')}</th></tr></thead>
 <tbody><tr className="border-t"><td className="p-1 border-r">101</td><td className="p-1">{t('lab.cs12programming_alice')}</td></tr></tbody>
 </table>
 </div>
 <div className="bg-slate-50 dark:bg-[#121212] text-slate-800 dark:text-[#ffffff] text-xs rounded border border-slate-300 dark:border-[#1c1b1b] overflow-hidden">
 <div className="bg-slate-200 dark:bg-[#121212] font-bold p-1 border-b border-slate-300 dark:border-[#1c1b1b] text-center">{t('lab.cs12programming_orderdetails')}</div>
 <table className="w-full text-left">
 <thead className="bg-slate-100 dark:bg-[#121212]"><tr><th className="p-1 border-r text-indigo-700">{t('lab.cs12programming_ordid_fk')}</th><th className="p-1 border-r text-indigo-700">{t('lab.cs12programming_prodid_fk')}</th>{nfLevel === 2 && <th className="p-1">{t('lab.cs12programming_prodname')}</th>}</tr></thead>
 <tbody><tr className="border-t"><td className="p-1 border-r">101</td><td className="p-1 border-r">P1</td>{nfLevel === 2 && <td className="p-1">{t('lab.cs12programming_laptop')}</td>}</tr></tbody>
 </table>
 </div>
 </div>
 )}

 {nfLevel === 3 && (
 <div className="bg-slate-50 dark:bg-[#121212] text-slate-800 dark:text-[#ffffff] text-xs rounded border border-slate-300 dark:border-[#1c1b1b] overflow-hidden w-1/2 mx-auto">
 <div className="bg-slate-200 dark:bg-[#121212] font-bold p-1 border-b border-slate-300 dark:border-[#1c1b1b] text-center">{t('lab.cs12programming_products_table')}</div>
 <table className="w-full text-left">
 <thead className="bg-slate-100 dark:bg-[#121212]"><tr><th className="p-1 border-r text-indigo-700">{t('lab.cs12programming_prodid_pk')}</th><th className="p-1">{t('lab.cs12programming_prodname')}</th></tr></thead>
 <tbody><tr className="border-t"><td className="p-1 border-r">P1</td><td className="p-1">{t('lab.cs12programming_laptop')}</td></tr></tbody>
 </table>
 </div>
 )}
 {nfLevel === 3 && <div className="text-green-400 font-semibold text-center mt-2 text-xs">{t('lab.cs12programming_fully_normalized_to_3nf')}</div>}
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Assessment Column */}
 <div className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold mb-4 text-indigo-800 border-b pb-2 dark:text-[#ffffff]">{t('lab.cs12programming_analysis_assessment')}</h2>
 
 <div className="space-y-4 lg:overflow-y-auto pr-2">
 <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
 <label className="block text-sm font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.cs12programming_q1_using_the_debugger_what_is_')}</label>
 <div className="flex gap-2">
 <input type="text" value={q1} onChange={e => setQ1(e.target.value)} className="flex-1 border rounded px-2 py-1" placeholder={t('lab.cs12programming_enter_value')} />
 <button onClick={() => setQ1Status(q1.trim() === '150')} className="bg-indigo-600 text-white px-3 py-1 rounded font-bold text-sm dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">{t('lab.cs12programming_check')}</button>
 </div>
 {q1Status === true && <p className="text-green-600 text-xs font-bold mt-1 flex items-center"><CheckCircle size={12} className="mr-1"/> {t('lab.cs12programming_correct')}</p>}
 {q1Status === false && <p className="text-red-500 text-xs font-bold mt-1 flex items-center"><XCircle size={12} className="mr-1"/> {t('lab.cs12programming_incorrect')}</p>}
 </div>

 <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
 <label className="block text-sm font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.cs12programming_q2_in_3nf_database_normalizati')}</label>
 <div className="flex gap-2">
 <select value={q2} onChange={e => setQ2(e.target.value)} className="flex-1 border rounded px-2 py-1 bg-slate-50 dark:bg-[#121212]">
 <option value="">{t('lab.cs12programming_select_table')}</option>
 <option value="Orders">{t('lab.cs12programming_orders_table')}</option>
 <option value="OrderDetails">{t('lab.cs12programming_orderdetails_table')}</option>
 <option value="Products">{t('lab.cs12programming_products_table')}</option>
 </select>
 <button onClick={() => setQ2Status(q2 === 'Products')} className="bg-indigo-600 text-white px-3 py-1 rounded font-bold text-sm dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">{t('lab.cs12programming_check')}</button>
 </div>
 {q2Status === true && <p className="text-green-600 text-xs font-bold mt-1 flex items-center"><CheckCircle size={12} className="mr-1"/> {t('lab.cs12programming_correct')}</p>}
 {q2Status === false && <p className="text-red-500 text-xs font-bold mt-1 flex items-center"><XCircle size={12} className="mr-1"/> {t('lab.cs12programming_incorrect')}</p>}
 </div>
 
 <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 text-sm text-indigo-800 mt-4 dark:bg-[#121212] dark:border-[#1c1b1b] dark:text-[#ffffff]">
 <p className="font-bold mb-1">{t('lab.cs12programming_developer_note')}</p>
 <p>{t('lab.cs12programming_state_mutations_like')} <code>{t('lab.cs12programming_balance_amt')}</code>{t('lab.cs12programming_are_common_sources_of_bugs_deb')}</p>
 </div>

 <div className="pt-4 border-t border-slate-200 dark:border-[#1c1b1b] mt-6">
 <button 
 onClick={() => {
 if (onExit) onExit();
 }}
 className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
 >
 <Save size={20} />
 
 {t('lab.cs12programming_submit_results_exit')}
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
