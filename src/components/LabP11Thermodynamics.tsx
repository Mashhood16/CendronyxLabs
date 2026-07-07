import { useState, useEffect, useRef } from 'react';
import { Activity, Target, Save, Info, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';

export default function LabP11Thermodynamics({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [heat, setHeat] = useState(0);
 const [moles, setMoles] = useState(1);
 const [dataPoints, setDataPoints] = useState<{ heat: number, T: number, P: number }[]>([]);
 const [assessmentAnswer, setAssessmentAnswer] = useState('');
 const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

 const Cv = 20.8;
 const R = 8.314;
 const V = 0.01; // 10L
 
 const T = 300 + heat / (moles * Cv);
 const P = (moles * R * T) / V / 1000; // kPa

 const [particles, setParticles] = useState([...Array(40)].map(() => ({
 x: Math.random() * 180 + 110,
 y: Math.random() * 130 + 110,
 vx: (Math.random() - 0.5) * 2,
 vy: (Math.random() - 0.5) * 2
 })));
 
 const simRef = useRef(particles);
 const requestRef = useRef<number>(0);

 useEffect(() => {
 const updateParticles = () => {
  const speedMultiplier = Math.sqrt(T / 300);
  const newParticles = simRef.current.map(p => {
  let { x, y, vx, vy } = p;
  x += vx * speedMultiplier * 2;
  y += vy * speedMultiplier * 2;
  
  if (x < 105) { x = 105; vx *= -1; }
  if (x > 295) { x = 295; vx *= -1; }
  if (y < 105) { y = 105; vy *= -1; }
  if (y > 245) { y = 245; vy *= -1; }
  
  return { x, y, vx, vy };
  });
  simRef.current = newParticles;
  setParticles(newParticles);
  requestRef.current = requestAnimationFrame(updateParticles);
 };
 
 requestRef.current = requestAnimationFrame(updateParticles);
 return () => cancelAnimationFrame(requestRef.current);
 }, [T]);

 const handleRecord = () => {
 setDataPoints(prev => [...prev, { heat, T, P }]);
 };

 const checkAssessment = () => {
 const val = parseFloat(assessmentAnswer);
 if (!isNaN(val) && Math.abs(val - 200) < 2) {
  setAssessmentStatus('correct');
 } else {
  setAssessmentStatus('incorrect');
 }
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.p11_thermo_title')} />

  
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
   <h2 className="text-lg font-semibold">{t('lab.p11_thermo_theory_title')}</h2>
   </div>
   <div className="text-sm text-slate-600 dark:text-[#a1a1aa] space-y-2" dangerouslySetInnerHTML={{ __html: t('lab.p11_thermo_theory_p1') }} />
   <div className="text-sm text-slate-600 dark:text-[#a1a1aa] space-y-2" dangerouslySetInnerHTML={{ __html: t('lab.p11_thermo_theory_p2') }} />
   <div className="text-sm text-slate-600 dark:text-[#a1a1aa] space-y-2" dangerouslySetInnerHTML={{ __html: t('lab.p11_thermo_theory_p3') }} />
   
   <div className="space-y-4 mt-4">
   <div>
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
    <span>{t('lab.p11_thermo_slider_heat')}</span>
    <span>{heat} J</span>
    </label>
    <input type="range" min="0" max="10000" step="100" value={heat} onChange={(e) => setHeat(Number(e.target.value))} className="w-full mt-1" />
   </div>
   <div>
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
    <span>{t('lab.p11_thermo_slider_moles')}</span>
    <span>{moles}  {t('lab.p11thermodynamics_mol')}</span>
    </label>
    <input type="range" min="1" max="5" step="0.5" value={moles} onChange={(e) => setMoles(Number(e.target.value))} className="w-full mt-1" />
   </div>
   </div>
  </div>

  {/* Simulator */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col gap-4 '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-2 border-b pb-2">
   <Activity className="text-green-500" />
   <h2 className="text-lg font-semibold">{t('lab.p11_thermo_sim_title')}</h2>
   </div>
   <div className={`relative flex-1 bg-slate-200 dark:bg-[#121212] rounded-lg overflow- border border-slate-200 dark:border-[#1c1b1b] min-h-[300px] flex-col `}>
   <svg viewBox="0 0 400 400" className="w-full h-full absolute inset-0">
    <rect x="100" y="100" width="200" height="150" fill="rgba(255,255,255,0.8)" stroke="#475569" strokeWidth="8" rx="10" />
    
    {particles.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#3b82f6" />)}
    
    <rect x="150" y="270" width="100" height="20" fill="#1e293b" rx="4" />
    <path d="M 170 270 Q 200 220 230 270 Z" fill="#f97316" opacity={0.2 + (heat / 10000) * 0.8} />
    
    <rect x="10" y="10" width="120" height="70" fill="rgba(255,255,255,0.9)" rx="4" stroke="#e2e8f0" />
    <text x="20" y="35" className="font-bold fill-red-600">{t('lab.p11_thermo_label_temp', { T: T.toFixed(1) })}</text>
    <text x="20" y="65" className="font-bold fill-blue-600">{t('lab.p11_thermo_label_press', { P: P.toFixed(1) })}</text>
   </svg>
   </div>
  </div>

  {/* Data & Assessment */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col gap-4 '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-2 border-b pb-2">
   <Target className="text-indigo-500" />
   <h2 className="text-lg font-semibold">{t('lab.p11_thermo_data_title')}</h2>
   </div>
   
   <button onClick={handleRecord} className={`flex items-center justify-center gap-2 w-full py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40 flex-col `}>
   <Save size={18} /> {t('lab.p11_thermo_record_btn')}
   </button>
   
   {dataPoints.length > 0 && (
   <div className="mt-2 text-sm max-h-40 lg:overflow-y-auto">
    <table className="w-full border-collapse">
    <thead>
     <tr className="bg-slate-100 dark:bg-[#121212]">
     <th className="border p-1">{t('lab.p11_thermo_table_heat')}</th>
     <th className="border p-1">{t('lab.p11_thermo_table_temp')}</th>
     <th className="border p-1">{t('lab.p11_thermo_table_press')}</th>
     </tr>
    </thead>
    <tbody>
     {dataPoints.map((d, i) => (
     <tr key={i} className="text-center">
      <td className="border p-1">{d.heat}</td>
      <td className="border p-1">{d.T.toFixed(1)}</td>
      <td className="border p-1">{d.P.toFixed(1)}</td>
     </tr>
     ))}
    </tbody>
    </table>
   </div>
   )}

   <div className={`mt-4 bg-indigo-50 p-4 rounded-lg border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
   <h3 className="font-semibold text-indigo-900 mb-2 dark:text-[#ffffff]">{t('lab.p11_thermo_data_title')}</h3>
   <p className="text-sm text-indigo-800 mb-3 dark:text-[#ffffff]">
    {t('lab.p11_thermo_analysis_q')}
   </p>
   <div className="flex gap-2 items-center">
    <input 
    type="number" 
    value={assessmentAnswer} 
    onChange={(e) => { setAssessmentAnswer(e.target.value); setAssessmentStatus('idle'); }} 
    className="flex-1 p-2 border border-indigo-200 rounded outline-none focus:border-indigo-500"
    placeholder={t('lab.p11_thermo_analysis_placeholder')}
    />
    <button onClick={checkAssessment} className="py-2 px-4 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
    {t('lab.p11_thermo_check_btn')}
    </button>
   </div>
   {assessmentStatus === 'correct' && <div className="mt-2 text-sm text-green-600 flex items-center gap-1"><CheckCircle size={16}/> {t('lab.p11_thermo_correct_fb')}</div>}
   {assessmentStatus === 'incorrect' && <div className="mt-2 text-sm text-red-600 flex items-center gap-1"><XCircle size={16}/> {t('lab.p11_thermo_incorrect_fb')}</div>}
   </div>
  </div>
  </div>
 </div>
 );
}
