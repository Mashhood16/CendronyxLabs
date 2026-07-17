import { useState, useEffect } from 'react';
import { BookOpen, Layout, Activity, CheckCircle2, XCircle, Code2, Play } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

interface LabProps {
 onExit?: () => void;
}

export default function LabCS10HTMLCSS({ onExit }: LabProps) {
 const { setLabScore } = useLab();
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [activeTab, setActiveTab] = useState<'form' | 'table' | 'animation'>('form');

 // Form Builder State
 const [formFields, setFormFields] = useState<string[]>([]);
 
 // Table Builder State
 const [tableRows, setTableRows] = useState<number>(2);
 const [tableCols, setTableCols] = useState<number>(3);

 // Animation State
 const [animDuration, setAnimDuration] = useState<number>(1);
 const [hoverColor, setHoverColor] = useState<string>('#3b82f6');
 const [isHovered, setIsHovered] = useState<boolean>(false);

 // Assessment State
 const [questionVal, setQuestionVal] = useState<{q: string, a: string}>({q: '', a: ''});
 const [answer, setAnswer] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
 const [logs, setLogs] = useState<string[]>([]);

 useEffect(() => {
 generateQuestion();
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [activeTab]);

 const generateQuestion = () => {
 if (activeTab === 'form') {
 setQuestionVal({ q: "Which HTML tag creates a dropdown list in a form?", a: "select" });
 } else if (activeTab === 'table') {
 setQuestionVal({ q: "Which HTML tag is used for a table row?", a: "tr" });
 } else {
 setQuestionVal({ q: "What CSS property specifies how long an animation should take?", a: "transition" }); // simplified or transition-duration
 }
 setAnswer('');
 setIsCorrect(null);
 };

 const addField = (type: string) => {
 setFormFields(prev => [...prev, type]);
 addLog(`Added form field: ${type}`);
 };

 const clearForm = () => {
 setFormFields([]);
 addLog(`Cleared form`);
 };

 const checkAnswer = () => {
 if (answer.trim().toLowerCase().includes(questionVal.a.toLowerCase())) {
 setIsCorrect(true);
 addLog(`Assessment Passed for ${activeTab}`);
 } else {
 setIsCorrect(false);
 setLabScore(isCorrect ? 100 : 0, 100);
 }
 };

 const addLog = (msg: string) => {
 setLogs(prev => [...prev, msg]);
 };

 const renderFormElement = (type: string, index: number) => {
 switch (type) {
 case 'text': return <input key={index} type="text" placeholder={t('lab.cs10htmlcss_text_input_1')} className="border p-2 rounded w-full" disabled />;
 case 'email': return <input key={index} type="email" placeholder={t('lab.cs10htmlcss_email_input')} className="border p-2 rounded w-full" disabled />;
 case 'date': return <input key={index} type="date" className="border p-2 rounded w-full" disabled />;
 case 'select': return (
 <select key={index} className="border p-2 rounded w-full" disabled>
 <option>{t('lab.cs10htmlcss_option_1')}</option>
 <option>{t('lab.cs10htmlcss_option_2')}</option>
 </select>
 );
 case 'submit': return <button key={index} className="bg-blue-600 text-white p-2 rounded w-full font-bold dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">{t('lab.cs10htmlcss_submit')}</button>;
 default: return null;
 }
 };

 return (
 <div className="flex flex-col bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.cs10htmlcss_advanced_html_css_web_builder')} />

 <div className="flex-1 p-6">
 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.cs10htmlcss_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.cs10htmlcss_lab')}</button>
 </div>
 <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:h-full min-h-0 lg:overflow-hidden">
 
 {/* Column 1: Theory */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col lg:h-full lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center gap-2 mb-4 text-pink-600">
 <BookOpen className="w-5 h-5" />
 <h2 className="text-lg font-semibold">{t('lab.cs10htmlcss_theory_forms_tables_css')}</h2>
 </div>
 
 <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] space-y-4">
 <h3 className="text-slate-800 dark:text-[#ffffff] font-semibold">{t('lab.cs10htmlcss_html_forms')}</h3>
 <p>{t('lab.cs10htmlcss_forms_are_used_to_collect_user')} <code>{t('lab.cs10htmlcss_lt_input_gt')}</code>, <code>{t('lab.cs10htmlcss_lt_select_gt')}</code>{t('lab.cs10htmlcss_and')} <code>{t('lab.cs10htmlcss_lt_button_gt')}</code>.</p>
 
 <h3 className="text-slate-800 dark:text-[#ffffff] font-semibold mt-4">{t('lab.cs10htmlcss_html_tables')}</h3>
 <p>{t('lab.cs10htmlcss_tables_organize_data_into_rows')}</p>
 <ul className="list-disc pl-5">
 <li><code>{t('lab.cs10htmlcss_lt_table_gt')}</code>{t('lab.cs10htmlcss_defines_the_table')}</li>
 <li><code>{t('lab.cs10htmlcss_lt_tr_gt')}</code>{t('lab.cs10htmlcss_table_row')}</li>
 <li><code>{t('lab.cs10htmlcss_lt_th_gt')}</code>{t('lab.cs10htmlcss_table_header_cell')}</li>
 <li><code>{t('lab.cs10htmlcss_lt_td_gt')}</code>{t('lab.cs10htmlcss_table_data_cell')}</li>
 </ul>

 <h3 className="text-slate-800 dark:text-[#ffffff] font-semibold mt-4">{t('lab.cs10htmlcss_css_transitions')}</h3>
 <p>{t('lab.cs10htmlcss_transitions_provide_a_way_to_c')}</p>
 </div>
 </div>

 {/* Column 2: Simulation/Builder */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col lg:h-full '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center gap-2 text-indigo-600 mb-4">
 <Layout className="w-5 h-5" />
 <h2 className="text-lg font-semibold">{t('lab.cs10htmlcss_interactive_builder')}</h2>
 </div>

 <div className="flex gap-2 mb-4 border-b pb-2">
 <button 
 onClick={() => setActiveTab('form')}
 className={`px-3 py-1 rounded ${activeTab === 'form' ? 'bg-indigo-100 text-indigo-800 font-medium' : 'text-slate-500 dark:text-[#a1a1aa] hover:bg-slate-100 dark:bg-[#121212]'}`}
 >
 
 {t('lab.cs10htmlcss_travel_form')}
 </button>
 <button 
 onClick={() => setActiveTab('table')}
 className={`px-3 py-1 rounded ${activeTab === 'table' ? 'bg-indigo-100 text-indigo-800 font-medium' : 'text-slate-500 dark:text-[#a1a1aa] hover:bg-slate-100 dark:bg-[#121212]'}`}
 >
 
 {t('lab.cs10htmlcss_timetable')}
 </button>
 <button 
 onClick={() => setActiveTab('animation')}
 className={`px-3 py-1 rounded ${activeTab === 'animation' ? 'bg-indigo-100 text-indigo-800 font-medium' : 'text-slate-500 dark:text-[#a1a1aa] hover:bg-slate-100 dark:bg-[#121212]'}`}
 >
 
 {t('lab.cs10htmlcss_css_animation')}
 </button>
 </div>

 <div className="flex-1 flex flex-col gap-4 lg:overflow-y-auto pr-2">
 {activeTab === 'form' && (
 <div className="flex flex-col gap-4">
 <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded-lg text-sm flex gap-2 flex-wrap `}>
 <button onClick={() => addField('text')} className="bg-slate-50 dark:bg-[#121212] border px-2 py-1 rounded text-xs hover:bg-slate-50 dark:bg-[#121212]">{t('lab.cs10htmlcss_text_input')}</button>
 <button onClick={() => addField('email')} className="bg-slate-50 dark:bg-[#121212] border px-2 py-1 rounded text-xs hover:bg-slate-50 dark:bg-[#121212]">{t('lab.cs10htmlcss_email')}</button>
 <button onClick={() => addField('date')} className="bg-slate-50 dark:bg-[#121212] border px-2 py-1 rounded text-xs hover:bg-slate-50 dark:bg-[#121212]">{t('lab.cs10htmlcss_date')}</button>
 <button onClick={() => addField('select')} className="bg-slate-50 dark:bg-[#121212] border px-2 py-1 rounded text-xs hover:bg-slate-50 dark:bg-[#121212]">{t('lab.cs10htmlcss_select')}</button>
 <button onClick={() => addField('submit')} className="bg-blue-100 border-blue-300 text-blue-800 px-2 py-1 rounded text-xs hover:bg-blue-200 dark:text-[#ffffff]">{t('lab.cs10htmlcss_submit_button')}</button>
 <button onClick={clearForm} className="bg-red-100 text-red-800 border-red-300 px-2 py-1 rounded text-xs hover:bg-red-200">{t('lab.cs10htmlcss_clear')}</button>
 </div>
 <div className={`flex-1 border-2 border-dashed border-slate-300 dark:border-[#1c1b1b] rounded p-4 bg-slate-50 dark:bg-[#121212] min-h-[200px] flex flex-col gap-3 `}>
 {formFields.length === 0 && <span className="text-slate-400 text-center mt-10">{t('lab.cs10htmlcss_add_fields_to_build_your_form')}</span>}
 {formFields.map((field, i) => renderFormElement(field, i))}
 </div>
 </div>
 )}

 {activeTab === 'table' && (
 <div className="flex flex-col gap-4">
 <div className={`flex gap-4 bg-slate-100 dark:bg-[#121212] p-3 rounded-lg flex-col `}>
 <div className="flex-1">
 <label className="text-xs font-bold text-slate-600 dark:text-[#a1a1aa] block mb-1">{t('lab.cs10htmlcss_rows')}</label>
 <input type="range" min="1" max="6" value={tableRows} onChange={e => { setTableRows(Number(e.target.value)); addLog(`Changed table rows to ${e.target.value}`); }} className="w-full" />
 <div className="text-center text-xs">{tableRows}</div>
 </div>
 <div className="flex-1">
 <label className="text-xs font-bold text-slate-600 dark:text-[#a1a1aa] block mb-1">{t('lab.cs10htmlcss_cols')}</label>
 <input type="range" min="1" max="5" value={tableCols} onChange={e => { setTableCols(Number(e.target.value)); addLog(`Changed table cols to ${e.target.value}`); }} className="w-full" />
 <div className="text-center text-xs">{tableCols}</div>
 </div>
 </div>
 <div className={`flex-1 overflow-auto border rounded p-2 bg-slate-50 dark:bg-[#121212] flex-col `}>
 <table className="w-full border-collapse">
 <thead>
 <tr>
 {Array.from({length: tableCols}).map((_, i) => (
 <th key={i} className="border border-slate-300 dark:border-[#1c1b1b] bg-slate-200 dark:bg-[#121212] p-2 text-sm">{t('lab.cs10htmlcss_header')} {i+1}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {Array.from({length: tableRows}).map((_, r) => (
 <tr key={r}>
 {Array.from({length: tableCols}).map((_, c) => (
 <td key={c} className="border border-slate-200 dark:border-[#1c1b1b] p-2 text-sm text-center">{t('lab.cs10htmlcss_cell')} {r+1},{c+1}</td>
 ))}
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {activeTab === 'animation' && (
 <div className="flex flex-col gap-4 h-full">
 <div className="bg-slate-100 dark:bg-[#121212] p-3 rounded-lg grid grid-cols-2 gap-4">
 <div>
 <label className="text-xs font-bold text-slate-600 dark:text-[#a1a1aa] block mb-1">{t('lab.cs10htmlcss_duration')}{animDuration}s)</label>
 <input type="range" min="0.1" max="3" step="0.1" value={animDuration} onChange={e => { setAnimDuration(Number(e.target.value)); addLog(`Changed anim duration to ${e.target.value}s`); }} className="w-full" />
 </div>
 <div>
 <label className="text-xs font-bold text-slate-600 dark:text-[#a1a1aa] block mb-1">{t('lab.cs10htmlcss_hover_color')}</label>
 <input type="color" value={hoverColor} onChange={e => { setHoverColor(e.target.value); addLog(`Changed hover color to ${e.target.value}`); }} className="w-full h-8 cursor-pointer" />
 </div>
 </div>
 
 <div className="flex-1 border-2 border-dashed border-slate-300 dark:border-[#1c1b1b] rounded flex items-center justify-center bg-slate-50 dark:bg-[#121212] p-8">
 <div 
 onMouseEnter={() => setIsHovered(true)}
 onMouseLeave={() => setIsHovered(false)}
 className="w-40 h-40 flex items-center justify-center text-white font-bold text-xl rounded-xl shadow-lg cursor-pointer"
 style={{
 backgroundColor: isHovered ? hoverColor : '#1e293b',
 transition: `background-color ${animDuration}s ease-in-out, transform ${animDuration}s ease-in-out`,
 transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)'
 }}
 >
 
 {t('lab.cs10htmlcss_hover_me')}
 </div>
 </div>
 <div className="bg-[#121212] dark:bg-[#121212] text-green-400 p-3 rounded font-mono text-xs">
 <code>
 
 {t('lab.cs10htmlcss_box')} {'{'}<br/>
 
 {t('lab.cs10htmlcss_nbsp_nbsp_transition_all')} {animDuration}{t('lab.cs10htmlcss_s_ease_in_out')}<br/>
 
 {t('lab.cs10htmlcss_nbsp_nbsp_background_color_1e2')}<br/>
 {'}'}<br/>
 
 {t('lab.cs10htmlcss_box_hover')} {'{'}<br/>
 
 {t('lab.cs10htmlcss_nbsp_nbsp_background_color')} {hoverColor};<br/>
 
 {t('lab.cs10htmlcss_nbsp_nbsp_transform_scale_1_1_')}<br/>
 {'}'}
 </code>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Column 3: Analysis/Assessment */}
 <div className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col lg:h-full rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center gap-2 mb-4 text-emerald-600">
 <Activity className="w-5 h-5" />
 <h2 className="text-lg font-semibold">{t('lab.cs10htmlcss_assessment_logs')}</h2>
 </div>

 <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 mb-6">
 <h3 className="font-medium text-emerald-800 mb-2 flex items-center gap-2">
 <Code2 className="w-4 h-4" />
 
 {t('lab.cs10htmlcss_knowledge_check')}
 </h3>
 <p className="text-sm text-slate-700 dark:text-[#ffffff] mb-3">
 {questionVal.q}
 </p>
 <div className="flex gap-2 flex-col">
 <input
 type="text"
 value={answer}
 onChange={(e) => setAnswer(e.target.value)}
 className="border rounded px-3 py-2 flex-1 outline-none focus:border-emerald-400 text-sm"
 placeholder={t('lab.cs10htmlcss_type_your_answer')}
 />
 <button
 onClick={checkAnswer}
 className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition flex items-center justify-center gap-2 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
 >
 <Play className="w-4 h-4" /> {t('lab.cs10htmlcss_verify')}
 </button>
 </div>
 {isCorrect !== null && (
 <div className={`mt-3 p-2 rounded flex items-center gap-2 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
 {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
 <span className="font-medium text-sm">{isCorrect ? 'Correct! Good job.' : 'Incorrect, try again.'}</span>
 </div>
 )}
 </div>

 <div className="flex-1 flex flex-col">
 <h3 className="font-medium text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.cs10htmlcss_activity_tracker')}</h3>
 <div className="flex-1 bg-slate-50 dark:bg-[#121212] border rounded p-3 lg:overflow-y-auto text-sm font-mono text-slate-600 dark:text-[#a1a1aa]">
 {logs.length === 0 && <span className="text-slate-400">{t('lab.cs10htmlcss_no_actions_recorded')}</span>}
 {logs.map((log, i) => (
 <div key={i} className="mb-1 border-b border-slate-100 pb-1">
 <span className="text-slate-400 mr-2">[{i + 1}]</span>
 {log}
 </div>
 ))}
 </div>
 </div>
 
 </div>
 </div>
 </div>
 </div>
 );
}
