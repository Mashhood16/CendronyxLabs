import { useState, useRef } from 'react';
import { Info, Plus, Minus, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import LabHeader from './LabHeader';
import { DIFFICULTY_CONFIGS, type DifficultyLevel } from '../utils/labScaffolding';
import { useTranslate } from '../i18n';

export default function LabP9Springs({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [difficulty, setDifficulty] = useState<DifficultyLevel>('understand');
 const config = DIFFICULTY_CONFIGS[difficulty];
 const [numSprings, setNumSprings] = useState<number>(1);
 const [mass, setMass] = useState<number>(100);
 const [noise] = useState([Math.random()*0.04-0.02, Math.random()*0.04-0.02, Math.random()*0.04-0.02]);
 const svgRef = useRef<SVGSVGElement>(null);
 const [rulerY, setRulerY] = useState<number>(120);
 const [isDragging, setIsDragging] = useState<boolean>(false);

 const [inputSprings, setInputSprings] = useState('');
 const [inputMass, setInputMass] = useState('');
 const [inputTopReading, setInputTopReading] = useState('');
 const [inputTotalExt, setInputTotalExt] = useState('');
 const [logs, setLogs] = useState<{ springs: number, mass: number, topReading: number, totalExt: number }[]>([]);

 const [userForce, setUserForce] = useState('');
 const [userK, setUserK] = useState('');
 const [assessmentResult1, setAssessmentResult1] = useState<'none' | 'correct' | 'incorrect'>('none');
 const [assessmentResult2, setAssessmentResult2] = useState<'none' | 'correct' | 'incorrect'>('none');

 // k = 100 N/m. 1 cm = 10 px. Stretch in px:
 const stretch = (mass / 1000) * 9.8 * 10;

 const handlePointerDown = () => setIsDragging(true);
 const handlePointerMove = (e: React.PointerEvent) => {
 if (isDragging && svgRef.current) {
 const pt = svgRef.current.createSVGPoint();
 pt.x = e.clientX;
 pt.y = e.clientY;
 const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
 setRulerY(Math.max(20, Math.min(480, svgP.y)));
 }
 };
 const handlePointerUp = () => setIsDragging(false);

 const handleAddLog = () => {
 if (inputSprings && inputMass && inputTopReading && inputTotalExt) {
 setLogs([...logs, {
 springs: parseInt(inputSprings),
 mass: parseFloat(inputMass),
 topReading: parseFloat(inputTopReading),
 totalExt: parseFloat(inputTotalExt)
 }]);
 setInputSprings('');
 setInputMass('');
 setInputTopReading('');
 setInputTotalExt('');
 }
 };

 const checkAnswers = () => {
 const f = parseFloat(userForce);
 const k = parseFloat(userK);
 // Tolerance varies by difficulty level
 const forceTolerance = difficulty === 'understand' ? 0.2 : difficulty === 'apply' ? 0.3 : 0.5;
 const kTolerance = difficulty === 'understand' ? 1 : difficulty === 'apply' ? 2 : 5;
 setAssessmentResult1(Math.abs(f - 1.96) < forceTolerance ? 'correct' : 'incorrect');
 setAssessmentResult2(Math.abs(k - 50) < kTolerance ? 'correct' : 'incorrect');
 };

 const renderBalances = () => {
 const balances = [];
 let currentY = 20;
 for (let i = 0; i < numSprings; i++) {
 balances.push(
 <g key={`bal-${i}`} transform={`translate(200, ${currentY})`}>
 {/* Top Hook */}
 <path d="M 0 0 L 0 10" stroke="#475569" strokeWidth="2" />
 {/* Main Body */}
 <rect x="-15" y="10" width="30" height="60" fill="#f8fafc" stroke="#64748b" strokeWidth="2" rx="4" />
 {/* Scale markings */}
 <line x1="-15" y1="20" x2="-10" y2="20" stroke="#94a3b8" />
 <line x1="-15" y1="30" x2="-5" y2="30" stroke="#94a3b8" />
 <line x1="-15" y1="40" x2="-10" y2="40" stroke="#94a3b8" />
 <line x1="-15" y1="50" x2="-5" y2="50" stroke="#94a3b8" />
 <line x1="-15" y1="60" x2="-10" y2="60" stroke="#94a3b8" />
 {/* Reading */}
 <text x="0" y="45" fontSize="10" textAnchor="middle" fill="#0f172a" fontWeight="bold">
 {((mass / 1000 * 9.8) * (1 + noise[i])).toFixed(1)} N
 </text>
 {/* Inner Pull-out slider */}
 <rect x="-5" y="70" width="10" height={20 + stretch} fill="#cbd5e1" stroke="#64748b" />
 {/* Bottom hook */}
 <path d={`M 0 ${90 + stretch} L 0 ${100 + stretch}`} stroke="#475569" strokeWidth="2" />
 </g>
 );
 currentY += 100 + stretch;
 }

 // Mass block
 balances.push(
 <g key="mass" transform={`translate(200, ${currentY})`}>
 <path d="M 0 0 C 10 10, -10 10, 0 20" stroke="#475569" strokeWidth="2" fill="none" />
 <rect x="-25" y="20" width="50" height="40" fill="#ef4444" rx="4" />
 <text x="0" y="45" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{mass}g</text>
 </g>
 );

 return balances;
 };

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.p9springs_springs_in_series_lab')} subtitle={t('lab.subtitle_observe_forces_extensions')} />

 <div className="px-4 pt-2 lg:pt-0">
 
 </div>

 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.tab.theory')}</button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.tab.lab')}</button>
 </div>
 <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg:min-h-0 lg:overflow-visible">
 {/* Column 1: Setup */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-5 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex mb-4' : 'hidden'} lg:flex lg:order-none`}>
 <div className={`flex items-center gap-2 mb-4 mt-2 ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
 <Info className="w-5 h-5 text-emerald-600" />
 <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff]">{t('lab.p9springs_1_setup_theory')}</h2>
 </div>
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
 
 {t('lab.p9springs_when_ideal_massless_spring_bal')} <strong>{t('lab.p9springs_in_series')}</strong>{t('lab.p9springs_the_tension_is_the_same_throug')}
 <br/><br/>
 
 {t('lab.p9springs_however_the_total_extension_of')} <strong>{t('lab.p9springs_sum')}</strong> {t('lab.p9springs_of_the_extensions_of_each_indi')}
 </p>

 <div className="space-y-6">
 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.p9springs_number_of_springs')} {numSprings}</label>
 <div className="flex gap-2">
 <button 
 onClick={() => setNumSprings(Math.max(1, numSprings - 1))}
 className={`p-2 bg-slate-100 dark:bg-[#121212] rounded hover:bg-slate-200 dark:bg-[#121212] flex-col `}
 ><Minus className="w-4 h-4" /></button>
 <button 
 onClick={() => setNumSprings(Math.min(3, numSprings + 1))}
 className={`p-2 bg-slate-100 dark:bg-[#121212] rounded hover:bg-slate-200 dark:bg-[#121212] flex-col `}
 ><Plus className="w-4 h-4" /></button>
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.p9springs_hanging_mass')} {mass} g</label>
 <input
 type="range"
 min="100" max="500" step="100"
 value={mass}
 onChange={(e) => setMass(parseFloat(e.target.value))}
 className="w-full"
 />
 </div>
 </div>
 </div>

 {/* Column 2: Simulation */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-5 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col items-center '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 {config.showHints && (
 <div className="w-full mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex gap-2 text-sm text-blue-700 dark:text-blue-300">
 <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" />
 <span><strong>{t('lab.p9springs_hint')}</strong> {t('lab.p9springs_springs_in_series_have_the_sam')}</span>
 </div>
 )}
 <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-4 w-full">{t('lab.p9springs_2_interactive_simulation')}</h2>
 <svg 
 ref={svgRef} 
 viewBox="0 0 400 500" 
 className="w-full max-w-sm h-auto bg-[#f8fafc] rounded border border-slate-200 dark:border-[#1c1b1b]"
 onPointerMove={handlePointerMove} 
 onPointerUp={handlePointerUp} 
 onPointerLeave={handlePointerUp}
 >
 {/* Top Support */}
 <line x1="100" y1="20" x2="300" y2="20" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
 <rect x="170" y="0" width="60" height="20" fill="#94a3b8" />

 {/* Ruler Base */}
 <line x1="120" y1="20" x2="120" y2="480" stroke="#94a3b8" strokeWidth="2" />
 {[0, 10, 20, 30, 40].map(cm => (
 <g key={cm} transform={`translate(120, ${20 + cm * 10})`}>
 <line x1="0" y1="0" x2="-10" y2="0" stroke="#94a3b8" strokeWidth="2" />
 <text x="-15" y="4" fontSize="10" fill="#64748b" textAnchor="end">{cm} cm</text>
 </g>
 ))}

 {/* Balances & Mass */}
 {renderBalances()}

 {/* Draggable Measuring Marker */}
 <g transform={`translate(120, ${rulerY})`} onPointerDown={handlePointerDown} className="cursor-ns-resize">
 <line x1="0" y1="0" x2="100" y2="0" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
 <polygon points="0,-6 0,6 10,0" fill="#ef4444" />
 <rect x="-65" y="-12" width="50" height="24" fill="white" stroke="#ef4444" rx="4" />
 <text x="-40" y="4" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#ef4444">
 {((rulerY - 20) / 10).toFixed(1)}
 </text>
 </g>
 </svg>
 </div>

 {/* Column 3: Analysis */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-5 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-4">{t('lab.p9springs_3_data_logging_assessment')}</h2>
 
 <div className="mb-6">
 <div className="grid grid-cols-2 gap-2 mb-3">
 <input type="number" placeholder={t('lab.p9springs_springs')} value={inputSprings} onChange={(e) => setInputSprings(e.target.value)} className="p-2 border rounded text-sm"/>
 <input type="number" placeholder={t('lab.p9springs_mass_g_1')} value={inputMass} onChange={(e) => setInputMass(e.target.value)} className="p-2 border rounded text-sm"/>
 <input type="number" placeholder={t('lab.p9springs_top_reading_n')} value={inputTopReading} onChange={(e) => setInputTopReading(e.target.value)} className="p-2 border rounded text-sm"/>
 <input type="number" placeholder={t('lab.p9springs_total_ext_cm')} value={inputTotalExt} onChange={(e) => setInputTotalExt(e.target.value)} className="p-2 border rounded text-sm"/>
 </div>
 <button onClick={handleAddLog} className="w-full bg-emerald-600 text-white px-3 py-2 rounded text-sm hover:bg-emerald-700 mb-3 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">{t('lab.p9springs_record_trial')}</button>
 
 <div className="overflow-x-auto">
 <table className="w-full text-sm text-left border-collapse">
 <thead className="bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff]">
 <tr>
 <th className="p-2 border">{t('lab.p9springs_springs')}</th>
 <th className="p-2 border">{t('lab.p9springs_mass_g')}</th>
 <th className="p-2 border">{t('lab.p9springs_top_n')}</th>
 <th className="p-2 border">{t('lab.p9springs_ext_cm')}</th>
 </tr>
 </thead>
 <tbody>
 {logs.length === 0 ? (
 <tr><td colSpan={4} className="p-4 text-center text-slate-500 dark:text-[#71717a]">{t('lab.p9springs_no_data_recorded')}</td></tr>
 ) : (
 logs.map((log, i) => (
 <tr key={i}>
 <td className="p-2 border">{log.springs}</td>
 <td className="p-2 border">{log.mass}</td>
 <td className="p-2 border">{log.topReading}</td>
 <td className="p-2 border">{log.totalExt}</td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>

 <div className={`bg-amber-50 p-4 rounded-lg border border-amber-100 mt-auto dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
 <h3 className="font-semibold text-amber-900 mb-2 dark:text-[#ffffff]">{t('lab.p9springs_knowledge_check')}</h3>
 
 <div className="mb-4">
 <label className="block text-sm text-amber-800 mb-1 dark:text-[#ffffff]">{t('lab.p9springs_1_if_4_identical_ideal_springs')}</label>
 <input type="number" value={userForce} onChange={(e) => setUserForce(e.target.value)} className="w-full p-2 border rounded-md" />
 {assessmentResult1 === 'correct' && <span className="text-emerald-600 text-xs flex items-center mt-1"><CheckCircle className="w-3 h-3 mr-1"/> {t('lab.p9springs_correct')}</span>}
 {assessmentResult1 === 'incorrect' && <span className="text-red-600 text-xs flex items-center mt-1"><XCircle className="w-3 h-3 mr-1"/> {t('lab.p9springs_incorrect')}</span>}
 </div>

 <div className="mb-4">
 <label className="block text-sm text-amber-800 mb-1 dark:text-[#ffffff]">{t('lab.p9springs_2_what_is_the_equivalent_sprin')}</label>
 <input type="number" value={userK} onChange={(e) => setUserK(e.target.value)} className="w-full p-2 border rounded-md" />
 {assessmentResult2 === 'correct' && <span className="text-emerald-600 text-xs flex items-center mt-1"><CheckCircle className="w-3 h-3 mr-1"/> {t('lab.p9springs_correct')}</span>}
 {assessmentResult2 === 'incorrect' && <span className="text-red-600 text-xs flex items-center mt-1"><XCircle className="w-3 h-3 mr-1"/> {t('lab.p9springs_incorrect')}</span>}
 </div>

 <button onClick={checkAnswers} className="w-full bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors dark:text-white dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-amber-500/40">
 
 {t('lab.p9springs_submit_answers')}
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}
