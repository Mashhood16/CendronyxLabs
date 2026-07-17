import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Info, CheckCircle, Database } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

interface LabProps {
 onExit?: () => void;
}

export default function LabC10AdditionPolymerisation({ onExit }: LabProps) {

const { recordLabData, setLabScore } = useLab();
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [monomers, setMonomers] = useState<number>(5);
 const [temp, setTemp] = useState<number>(150); // Celsius
 const [pressure, setPressure] = useState<number>(1000); // atm
 const [catalyst, setCatalyst] = useState<boolean>(true);
 
 const [isReacting, setIsReacting] = useState<boolean>(false);
 const [progress, setProgress] = useState<number>(0);
 
 interface DataPoint {
 monomers: number;
 temp: number;
 pressure: number;
 catalyst: boolean;
 yieldPercent: number;
 }
 const [data, setData] = useState<DataPoint[]>([]);
 
 const [unknownMonomers] = useState<number>(Math.floor(Math.random() * 500) + 100);
 const [assessmentAns, setAssessmentAns] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const animationRef = useRef<number>(0);

 useEffect(() => {
 if (isReacting) {
 const reactionSpeed = catalyst ? (temp * pressure) / 10000 : (temp * pressure) / 50000;
 const animate = () => {
 setProgress(p => {
 if (p >= 100) {
 setIsReacting(false);
 return 100;
 }
 return p + reactionSpeed;
 });
 animationRef.current = requestAnimationFrame(animate);
 };
 animationRef.current = requestAnimationFrame(animate);
 }
 return () => {
 if (animationRef.current) cancelAnimationFrame(animationRef.current);
 };
 }, [isReacting, temp, pressure, catalyst]);

 const handleReact = () => {
 setProgress(0);
 setIsReacting(true);
 };

 const handleReset = () => {
 setProgress(0);
 setIsReacting(false);
 };

 const recordData = () => {
 const yieldP = Math.min(100, (progress / 100) * 100);
 setData([...data, {
 monomers,
 temp,
 pressure,
 catalyst,
 yieldPercent: yieldP
 }]);
 
 recordLabData({ timestamp: Date.now() });
};

 const checkAnswer = () => {
 const molarMassEthene = 28.05;
 const expected = unknownMonomers * molarMassEthene;
 if (Math.abs(parseFloat(assessmentAns) - expected) < 1) {
 setIsCorrect(true);
 } else {
 setIsCorrect(false);
 setLabScore(isCorrect ? 100 : 0, 100);
 }
 };

 return (
 <div className="flex flex-col bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.c10additionpolymerisation_addition_polymerisation_polyet')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.c10additionpolymerisation_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.c10additionpolymerisation_lab')}</button>
 </div>
 <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 flex-grow min-h-0 lg:overflow-hidden">
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-lg p-4 flex-col space-y-4 border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex mb-4' : 'hidden'} lg:flex lg:order-none`}>
 <h2 className="text-xl font-semibold flex items-center"><Info className="mr-2 text-blue-600"/> {t('lab.c10additionpolymerisation_setup_theory')}</h2>
 <p className="text-sm text-slate-700 dark:text-[#ffffff]">
 
 {t('lab.c10additionpolymerisation_addition_polymerisation_involv')}
 </p>
 
 <div className={`space-y-4 mt-4 ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
 <div>
 <label className="block text-sm font-medium">{t('lab.c10additionpolymerisation_monomers_n')} {monomers}</label>
 <input type="range" min="3" max="15" value={monomers} onChange={(e) => setMonomers(parseInt(e.target.value))} className="w-full" disabled={isReacting || progress > 0} />
 </div>
 <div>
 <label className="block text-sm font-medium">{t('lab.c10additionpolymerisation_temperature_c')} {temp}</label>
 <input type="range" min="20" max="300" value={temp} onChange={(e) => setTemp(parseInt(e.target.value))} className="w-full" disabled={isReacting || progress > 0} />
 </div>
 <div>
 <label className="block text-sm font-medium">{t('lab.c10additionpolymerisation_pressure_atm')} {pressure}</label>
 <input type="range" min="1" max="2000" value={pressure} onChange={(e) => setPressure(parseInt(e.target.value))} className="w-full" disabled={isReacting || progress > 0} />
 </div>
 <div className="flex items-center">
 <input type="checkbox" checked={catalyst} onChange={(e) => setCatalyst(e.target.checked)} className="mr-2" disabled={isReacting || progress > 0}/>
 <label className="text-sm font-medium">{t('lab.c10additionpolymerisation_use_catalyst')}</label>
 </div>
 
 <div className="flex space-x-2 pt-4">
 <button onClick={handleReact} disabled={isReacting || progress > 0} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 flex justify-center items-center dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">
 <Play className="w-4 h-4 mr-1"/> {t('lab.c10additionpolymerisation_react')}
 </button>
 <button onClick={handleReset} className="flex-1 bg-slate-600 dark:bg-[#121212] text-white py-2 rounded hover:bg-slate-700 dark:bg-[#121212] flex justify-center items-center dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent">
 <RotateCcw className="w-4 h-4 mr-1"/> {t('lab.c10additionpolymerisation_reset')}
 </button>
 </div>
 </div>
 </div>

 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-lg p-4 flex-col items-center justify-center border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-semibold absolute top-4 left-4">{t('lab.c10additionpolymerisation_reaction_chamber')}</h2>
 <div className="w-full h-64 mt-12 bg-slate-100 dark:bg-[#121212] rounded border border-slate-300 dark:border-[#1c1b1b] relative flex items-center justify-center overflow-x-auto">
 <svg width={Math.max(500, monomers * 30 + 100)} height="200" viewBox={`0 0 ${Math.max(500, monomers * 30 + 100)} 200`}>
 {Array.from({ length: monomers }).map((_, i) => {
 const startX = 50 + i * 35;
 const targetX = 50 + i * 25;
 const currentX = startX + (targetX - startX) * (progress / 100);
 const isLinked = progress > 50;

 return (
 <g key={i} transform={`translate(${currentX}, 100)`}>
 <circle cx="-5" cy="0" r="4" fill="#333" />
 <circle cx="5" cy="0" r="4" fill="#333" />
 <circle cx="-10" cy="-10" r="2" fill="#999" />
 <circle cx="-10" cy="10" r="2" fill="#999" />
 <circle cx="10" cy="-10" r="2" fill="#999" />
 <circle cx="10" cy="10" r="2" fill="#999" />
 <line x1="-5" y1="0" x2="-10" y2="-10" stroke="#333" strokeWidth="1" />
 <line x1="-5" y1="0" x2="-10" y2="10" stroke="#333" strokeWidth="1" />
 <line x1="5" y1="0" x2="10" y2="-10" stroke="#333" strokeWidth="1" />
 <line x1="5" y1="0" x2="10" y2="10" stroke="#333" strokeWidth="1" />
 {isLinked ? (
 <line x1="-5" y1="0" x2="5" y2="0" stroke="#333" strokeWidth="2" />
 ) : (
 <>
 <line x1="-5" y1="-2" x2="5" y2="-2" stroke="#333" strokeWidth="1.5" />
 <line x1="-5" y1="2" x2="5" y2="2" stroke="#333" strokeWidth="1.5" />
 </>
 )}
 {isLinked && i < monomers - 1 && (
 <line x1="5" y1="0" x2="20" y2="0" stroke="#333" strokeWidth="2" strokeDasharray={progress < 100 ? "2,2" : "none"} />
 )}
 </g>
 );
 })}
 </svg>
 {progress > 0 && <div className="absolute bottom-2 text-sm font-semibold">{t('lab.c10additionpolymerisation_conversion')} {Math.round(progress)}%</div>}
 </div>
 <div className="mt-4 text-center">
 <p className="text-lg font-mono">
 
 {t('lab.c10additionpolymerisation_n_ch_ch_rarr_ch_ch')}<sub className="text-xs">n</sub>
 </p>
 </div>
 </div>

 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-lg shadow-lg p-4 flex-col space-y-4 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-semibold flex items-center"><Database className="mr-2 text-blue-600"/> {t('lab.c10additionpolymerisation_data_analysis')}</h2>
 
 <button onClick={recordData} disabled={progress < 100} className="w-full bg-blue-100 text-blue-700 py-2 rounded font-medium hover:bg-blue-200 disabled:opacity-50">
 
 {t('lab.c10additionpolymerisation_record_data_point')}
 </button>

 <div className="flex-1 lg:overflow-y-auto">
 <table className="w-full text-sm text-left border-collapse">
 <thead className="bg-slate-100 dark:bg-[#121212]">
 <tr>
 <th className="p-2 border">n</th>
 <th className="p-2 border">{t('lab.c10additionpolymerisation_t_c')}</th>
 <th className="p-2 border">{t('lab.c10additionpolymerisation_cat')}</th>
 <th className="p-2 border">{t('lab.c10additionpolymerisation_yield')}</th>
 </tr>
 </thead>
 <tbody>
 {data.map((d, i) => (
 <tr key={i} className="border-b">
 <td className="p-2 border">{d.monomers}</td>
 <td className="p-2 border">{d.temp}</td>
 <td className="p-2 border">{d.catalyst ? 'Yes' : 'No'}</td>
 <td className="p-2 border">{Math.round(d.yieldPercent)}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 <div className="bg-slate-100 dark:bg-[#121212] p-3 rounded">
 <h3 className="font-semibold text-sm mb-2 flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-green-600"/> {t('lab.c10additionpolymerisation_assessment')}</h3>
 <p className="text-xs mb-2">{t('lab.c10additionpolymerisation_a_polymer_chain_is_formed_from')} {unknownMonomers} {t('lab.c10additionpolymerisation_ethene_monomers_what_is_the_ex')}</p>
 <div className="flex space-x-2">
 <input type="number" value={assessmentAns} onChange={(e) => setAssessmentAns(e.target.value)} placeholder={t('lab.c10additionpolymerisation_g_mol')} className="flex-1 px-2 py-1 border rounded text-sm"/>
 <button onClick={checkAnswer} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">{t('lab.c10additionpolymerisation_check')}</button>
 </div>
 {isCorrect !== null && (
 <p className={`text-xs mt-2 font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
 {isCorrect ? 'Correct! Mass is conserved.' : 'Incorrect. Multiply n by the molar mass.'}
 </p>
 )}
 </div>
 </div>
 </div>
 </div>
 );
}
