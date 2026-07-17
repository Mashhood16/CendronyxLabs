import { useState } from 'react';
import { Activity, Target, Save, Info, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';
import { useLab } from '../store';

export default function LabP11Solids({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [material, setMaterial] = useState('Steel');
 const [mass, setMass] = useState(10);
 const [dataPoints, setDataPoints] = useState<{ material: string, force: number, extension: number }[]>([]);
 const [assessmentAnswer, setAssessmentAnswer] = useState('');
 const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

 const materials: Record<string, number> = {
 Steel: 200e9,
 Copper: 117e9,
 Aluminum: 69e9
 };

 const E = materials[material];
 const force = mass * 9.81;
 const area = 0.785e-6; // 1mm diameter
 const length = 2.0;
 
 // Deterministic noise based on mass and material
 const noiseSeed = ((mass * 100) + E) % 100 / 100;
 const noise = 1 + (noiseSeed * 0.02 - 0.01); 
 const extensionM = (force * length) / (area * E) * noise;
 const extensionMm = extensionM * 1000;

 const handleRecord = () => {
 setDataPoints(prev => [...prev, { material, force, extension: extensionMm }]);
 };

 const checkAssessment = () => {
 const val = parseFloat(assessmentAnswer);
 if (!isNaN(val) && Math.abs(val - 98) < 2) {
 setAssessmentStatus('correct');
 } else {
 setAssessmentStatus('incorrect');
 }
 };

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.p11_solids_title')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 {t('lab.tab.theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.tab.lab')}</button>
 </div>
 <div className="lg:flex-1 p-4 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:overflow-visible">
 {/* Theory & Setup */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 ${activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex mb-4' : 'hidden'} lg:flex lg:order-none`}>
 <div className={`flex items-center gap-2 border-b pb-2 ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
 <Info className="text-blue-500" />
 <h2 className="text-lg font-semibold">{t('lab.p11_solids_theory_title')}</h2>
 </div>
 <div className="text-sm text-slate-600 dark:text-[#a1a1aa] space-y-2" dangerouslySetInnerHTML={{ __html: t('lab.p11_solids_theory_p1') }} />
 <div className="text-sm text-slate-600 dark:text-[#a1a1aa] space-y-2" dangerouslySetInnerHTML={{ __html: t('lab.p11_solids_theory_p2') }} />
 
 <div className="space-y-4 mt-4">
 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.p11_solids_wire_label')}</label>
 <select value={material} onChange={(e) => setMaterial(e.target.value)} className={`w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg bg-slate-50 dark:bg-[#121212] flex-col `}>
 <option value="Steel">{t('lab.p11_solids_steel')}</option>
 <option value="Copper">{t('lab.p11_solids_copper')}</option>
 <option value="Aluminum">{t('lab.p11_solids_aluminum')}</option>
 </select>
 </div>
 <div>
 <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
 <span>{t('lab.p11_solids_slider_mass')}</span>
 <span>{mass} kg</span>
 </label>
 <input type="range" min="0" max="50" step="1" value={mass} onChange={(e) => setMass(Number(e.target.value))} className="w-full mt-1" />
 </div>
 </div>
 </div>

 {/* Simulator */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col gap-4 '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center gap-2 border-b pb-2">
 <Activity className="text-green-500" />
 <h2 className="text-lg font-semibold">{t('lab.p11_solids_sim_title')}</h2>
 </div>
 <div className={`relative flex-1 bg-gray-100 rounded-lg border border-slate-200 dark:border-[#1c1b1b] min-h-[300px] flex-col `}>
 <svg viewBox="0 0 400 400" className="w-full h-full absolute inset-0">
 {/* Clamp */}
 <rect x="180" y="0" width="40" height="20" fill="#475569" />
 {/* Wire */}
 <line x1="200" y1="20" x2="200" y2="150" stroke="#854d0e" strokeWidth={material === 'Steel' ? 2 : material === 'Copper' ? 3 : 4} />
 {/* Weight */}
 <rect x="175" y="150" width="50" height={20 + mass * 0.5} fill="#1e293b" />
 <text x="230" y="170" className="text-xs font-bold fill-slate-700">{mass} kg</text>
 
 {/* Magnifier */}
 <circle cx="300" cy="200" r="80" fill="white" stroke="#94a3b8" strokeWidth="4" />
 <text x="260" y="140" className="text-xs font-bold fill-slate-500">{t('lab.11solids_micrometer')}</text>
 <line x1="260" y1="200" x2="340" y2="200" stroke="#ef4444" strokeWidth="1" strokeDasharray="4" />
 <rect x="290" y={200 + extensionMm * 10} width="20" height="80" fill="#64748b" />
 <text x="250" y="280" className="text-sm font-bold fill-slate-800">{extensionMm.toFixed(3)} mm</text>
 </svg>
 </div>
 </div>

 {/* Data & Assessment */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col gap-4 '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex items-center gap-2 border-b pb-2">
 <Target className="text-indigo-500" />
 <h2 className="text-lg font-semibold">{t('lab.p11_solids_data_title')}</h2>
 </div>
 
 <button onClick={handleRecord} className={`flex items-center justify-center gap-2 w-full py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40 flex-col `}>
 <Save size={18} /> {t('lab.p11_solids_record_btn')}
 </button>
 
 {dataPoints.length > 0 && (
 <div className="mt-2 text-sm max-h-40 lg:overflow-y-auto">
 <table className="w-full border-collapse">
 <thead>
 <tr className="bg-slate-100 dark:bg-[#121212]">
 <th className="border p-1">{t('lab.p11_solids_table_mat')}</th>
 <th className="border p-1">{t('lab.p11_solids_table_force')}</th>
 <th className="border p-1">{t('lab.p11_solids_table_ext')}</th>
 </tr>
 </thead>
 <tbody>
 {dataPoints.map((d, i) => (
 <tr key={i} className="text-center">
 <td className="border p-1">{d.material}</td>
 <td className="border p-1">{d.force.toFixed(1)}</td>
 <td className="border p-1">{d.extension.toFixed(3)}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}

 <div className="mt-4 bg-indigo-50 p-4 rounded-lg border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b]">
 <h3 className="font-semibold text-indigo-900 mb-2 dark:text-[#ffffff]">{t('lab.p11_solids_data_title')}</h3>
 <p className="text-sm text-indigo-800 mb-3 dark:text-[#ffffff]">
 {t('lab.p11_solids_analysis_q')}
 </p>
 <div className="flex gap-2 items-center">
 <input 
 type="number" 
 value={assessmentAnswer} 
 onChange={(e) => { setAssessmentAnswer(e.target.value); setAssessmentStatus('idle'); }} 
 className="flex-1 p-2 border border-indigo-200 rounded outline-none focus:border-indigo-500"
 placeholder={t('lab.p11_solids_analysis_placeholder')}
 />
 <button onClick={checkAssessment} className="py-2 px-4 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
 {t('lab.p11_solids_check_btn')}
 </button>
 </div>
 {assessmentStatus === 'correct' && <div className="mt-2 text-sm text-green-600 flex items-center gap-1"><CheckCircle size={16}/> {t('lab.p11_solids_correct_fb')}</div>}
 {assessmentStatus === 'incorrect' && <div className="mt-2 text-sm text-red-600 flex items-center gap-1"><XCircle size={16}/> {t('lab.p11_solids_incorrect_fb')}</div>}
 </div>
 </div>
 </div>
 </div>
 );
}
