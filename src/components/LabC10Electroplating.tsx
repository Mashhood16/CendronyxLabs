import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Save, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

const METALS = {
 Zn: { name: 'Zinc', mass: 65.38, z: 2, color: '#e2e8f0', electrolyte: '#bfdbfe' },
 Sn: { name: 'Tin', mass: 118.71, z: 2, color: '#d6d3d1', electrolyte: '#f1f5f9' },
 Cr: { name: 'Chromium', mass: 51.99, z: 3, color: '#94a3b8', electrolyte: '#fed7aa' }
};

export default function LabC10Electroplating({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [isPlaying, setIsPlaying] = useState(false);
 const [time, setTime] = useState(0);
 const [current, setCurrent] = useState(2);
 const [metal, setMetal] = useState<keyof typeof METALS>('Zn');
 const [data, setData] = useState<Array<{t: number, mass: number, current: number}>>([]);

 const mData = METALS[metal];
 const F = 96485;
 const massDeposited = (current * (time * 100) * mData.mass) / (mData.z * F);

 useEffect(() => {
 let timer: number;
 if (isPlaying) {
  timer = window.setInterval(() => setTime(t => t + 1), 100);
 }
 return () => window.clearInterval(timer);
 }, [isPlaying]);

 const handleReset = () => {
 setIsPlaying(false);
 setTime(0);
 setData([]);
 };

 const recordData = () => {
 setData(prev => [...prev, { t: time, mass: parseFloat(massDeposited.toFixed(4)), current }]);
 };

 const [assQ] = useState({ i: Math.floor(Math.random() * 3) + 2, t: Math.floor(Math.random() * 30) + 10 });
 const [answer, setAnswer] = useState('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 const checkAnswer = () => {
 const expected = (assQ.i * assQ.t * mData.mass) / (mData.z * F);
 if (Math.abs(parseFloat(answer) - expected) < 0.005) setIsCorrect(true);
 else setIsCorrect(false);
 };

 const renderGraph = () => {
 if (data.length === 0) return <div className="h-48 flex items-center justify-center text-slate-400">{t('lab.c10electroplating_no_data_recorded')}</div>;
 const maxT = Math.max(10, ...data.map(d => d.t));
 const maxM = Math.max(0.001, ...data.map(d => d.mass));
 const pts = data.map(d => `${(d.t / maxT) * 100},${100 - (d.mass / maxM) * 100}`).join(' ');

 return (
  <svg viewBox="-15 -10 130 130" className="w-full h-48 bg-slate-50 dark:bg-[#121212] border rounded-lg p-2 overflow-visible">
  <line x1="0" y1="100" x2="100" y2="100" stroke="#94a3b8" strokeWidth="1" />
  <line x1="0" y1="0" x2="0" y2="100" stroke="#94a3b8" strokeWidth="1" />
  <polyline points={pts} fill="none" stroke="#2563eb" strokeWidth="2" />
  {data.map((d, i) => (
   <circle key={i} cx={(d.t / maxT) * 100} cy={100 - (d.mass / maxM) * 100} r="2" fill="#ef4444" />
  ))}
  <text x="50" y="115" fontSize="6" textAnchor="middle" fill="#64748b">{t('lab.c10electroplating_time_s')}</text>
  <text x="-10" y="50" fontSize="6" textAnchor="middle" fill="#64748b" transform="rotate(-90 -10 50)">{t('lab.c10electroplating_mass_g')}</text>
  </svg>
 );
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none p-4 min-h-screen lg:h-screen overflow-x-hidden w-full">
<LabHeader onExit={onExit} title={t('lab.c10electroplating_electroplating_virtual_lab')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.c10electroplating_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.c10electroplating_lab')}</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:flex-1 lg:overflow-visible">
  {/* Column 1: Theory & Setup */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex mb-4' : 'hidden'} lg:flex lg:order-none`}>
   <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-4">{t('lab.c10electroplating_theory_setup')}</h2>
   <p className="text-slate-600 dark:text-[#a1a1aa] text-sm mb-4">
   
                        {t('lab.c10electroplating_electroplating_uses_an_electri')}
                        </p>
   <div className={`bg-slate-100 dark:bg-[#121212] p-4 rounded-lg mb-6 text-sm font-mono flex-col  ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
   
                        {t('lab.c10electroplating_m_i_t_m_z_f')}
                        </div>
   
   <div className="space-y-6">
   <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.c10electroplating_plating_metal_anode')}</label>
    <select 
    value={metal} 
    onChange={(e) => setMetal(e.target.value as keyof typeof METALS)}
    className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md"
    >
    <option value="Zn">{t('lab.c10electroplating_zinc_zn')}</option>
    <option value="Sn">{t('lab.c10electroplating_tin_sn')}</option>
    <option value="Cr">{t('lab.c10electroplating_chromium_cr')}</option>
    </select>
   </div>
   <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.c10electroplating_current')} {current} A</label>
    <input 
    type="range" min="1" max="5" step="0.5" 
    value={current} onChange={(e) => setCurrent(parseFloat(e.target.value))}
    className="w-full"
    />
   </div>
   </div>
  </div>

  {/* Column 2: Simulation */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col items-center '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff] mb-4 self-start">{t('lab.c10electroplating_simulation_viewer')}</h2>
   
   <div className="w-full flex justify-center space-x-4 mb-6">
   <button onClick={() => setIsPlaying(!isPlaying)} className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40 flex-col `}>
    {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
    {isPlaying ? 'Pause' : 'Start'}
   </button>
   <button onClick={handleReset} className={`flex items-center px-4 py-2 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg hover:bg-slate-300 dark:bg-[#121212] flex-col `}>
    <RotateCcw className="w-4 h-4 mr-2" />  {t('lab.c10electroplating_reset')}
                            </button>
   </div>

   <div className="relative w-full max-w-sm aspect-square bg-slate-50 dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-[#1c1b1b] overflow-hidden">
   <svg viewBox="0 0 200 200" className="w-full h-full">
    {/* Beaker */}
    <path d="M 40 40 L 40 180 Q 40 190 50 190 L 150 190 Q 160 190 160 180 L 160 40" fill="none" stroke="#94a3b8" strokeWidth="4" />
    {/* Liquid */}
    <path d="M 42 80 L 158 80 L 158 188 L 42 188 Z" fill={mData.electrolyte} opacity="0.6" />
    
    {/* Cathode (Steel with plating) */}
    <rect x={60 - Math.min(10, massDeposited * 100)} y={60} width={20 + Math.min(20, massDeposited * 200)} height={110} fill="#64748b" rx="2" />
    <rect x={60 - Math.min(10, massDeposited * 100)} y={80} width={20 + Math.min(20, massDeposited * 200)} height={110} fill={mData.color} opacity={Math.min(1, massDeposited * 100)} />

    {/* Anode */}
    <rect x="120" y="60" width={20 - Math.min(15, massDeposited * 50)} height={110} fill={mData.color} rx="2" />

    {/* Circuit */}
    <polyline points="70,60 70,20 130,20 130,60" fill="none" stroke="#1e293b" strokeWidth="2" />
    <rect x="85" y="10" width="30" height="20" fill="#334155" rx="2" />
    <text x="100" y="24" fill="white" fontSize="10" textAnchor="middle">{current}A</text>

    {/* Ions moving */}
    {isPlaying && (
    <>
     <circle cx={110 - (time % 10) * 4} cy="120" r="3" fill={mData.color} />
     <circle cx={115 - ((time + 5) % 10) * 4} cy="150" r="3" fill={mData.color} />
    </>
    )}
   </svg>
   </div>
   
   <div className="mt-6 w-full grid grid-cols-2 gap-4 text-center ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <div className="bg-slate-100 dark:bg-[#121212] p-3 rounded-lg">
    <div className="text-xs text-slate-500 dark:text-[#71717a] uppercase font-bold">{t('lab.c10electroplating_simulated_time')}</div>
    <div className="text-xl font-mono text-slate-800 dark:text-[#ffffff]">{time * 100} s</div>
   </div>
   <div className="bg-slate-100 dark:bg-[#121212] p-3 rounded-lg">
    <div className="text-xs text-slate-500 dark:text-[#71717a] uppercase font-bold">{t('lab.c10electroplating_mass_deposited')}</div>
    <div className="text-xl font-mono text-slate-800 dark:text-[#ffffff]">{massDeposited.toFixed(4)} g</div>
   </div>
   </div>
  </div>

  {/* Column 3: Data & Analysis */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex justify-between items-center mb-4">
   <h2 className="text-lg font-semibold text-slate-800 dark:text-[#ffffff]">{t('lab.c10electroplating_data_analysis')}</h2>
   <button onClick={recordData} className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">
    <Save className="w-4 h-4 mr-1" />  {t('lab.c10electroplating_record')}
                            </button>
   </div>

   {renderGraph()}

   <div className="mt-4 flex-1 lg:overflow-y-auto min-h-[100px] border border-slate-200 dark:border-[#1c1b1b] rounded-lg">
   <table className="w-full text-sm text-left">
    <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0">
    <tr>
     <th className="px-3 py-2 border-b">{t('lab.c10electroplating_sim_time_s')}</th>
     <th className="px-3 py-2 border-b">{t('lab.c10electroplating_current_a')}</th>
     <th className="px-3 py-2 border-b">{t('lab.c10electroplating_mass_g')}</th>
    </tr>
    </thead>
    <tbody>
    {data.map((d, i) => (
     <tr key={i} className="border-b last:border-0 hover:bg-slate-50 dark:bg-[#121212]">
     <td className="px-3 py-2">{d.t * 100}</td>
     <td className="px-3 py-2">{d.current}</td>
     <td className="px-3 py-2 font-mono">{d.mass}</td>
     </tr>
    ))}
    </tbody>
   </table>
   </div>

   <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900">
   <h3 className="text-sm font-bold text-blue-900 mb-2 dark:text-[#ffffff]">{t('lab.c10electroplating_assessment')}</h3>
   <p className="text-sm text-blue-800 mb-3 dark:text-[#ffffff]">
    
                             {t('lab.c10electroplating_calculate_the_theoretical_mass')} {mData.name}  {t('lab.c10electroplating_deposited_after')} {assQ.t}  {t('lab.c10electroplating_seconds_at')} {assQ.i}  {t('lab.c10electroplating_amps_provide_answer_to_4_decim')}
                            </p>
   <div className="flex items-center space-x-2">
    <input 
    type="number" 
    value={answer}
    onChange={e => setAnswer(e.target.value)}
    placeholder={t('lab.c10electroplating_mass_g')} 
    className="flex-1 p-2 border border-blue-300 rounded-md text-sm"
    />
    <button onClick={checkAnswer} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
    
                                 {t('lab.c10electroplating_check')}
                                 </button>
   </div>
   {isCorrect === true && <div className="mt-2 text-green-600 text-sm font-bold flex items-center"><CheckCircle className="w-4 h-4 mr-1" />  {t('lab.c10electroplating_correct')}</div>}
   {isCorrect === false && <div className="mt-2 text-red-600 text-sm font-bold flex items-center"><XCircle className="w-4 h-4 mr-1" />  {t('lab.c10electroplating_incorrect_try_again')}</div>}
   </div>
  </div>
  </div>
 </div>
 );
}
