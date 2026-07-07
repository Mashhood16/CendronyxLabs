import { useState, useEffect, useRef } from 'react';
import { Activity, Target, Save, Info, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';

export default function LabP11WorkEnergy({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [mass, setMass] = useState(80);
 const [area, setArea] = useState(20);
 const [deployed, setDeployed] = useState(false);
 const [isRunning, setIsRunning] = useState(false);
 const [simState, setSimState] = useState({ h: 3000, v: 0 });
 const [dataPoints, setDataPoints] = useState<{ mass: number, area: number, vTerm: number }[]>([]);
 const [assessmentAnswer, setAssessmentAnswer] = useState('');  const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

 const physicsRef = useRef({ h: 3000, v: 0 });
 const requestRef = useRef<number>(0);
 const prevTimeRef = useRef<number>(0);

 useEffect(() => {
 const updatePhysics = (time: number) => {
  if (prevTimeRef.current !== 0 && isRunning) {
  const dt = Math.min((time - prevTimeRef.current) / 1000, 0.05);
  const g = 9.81;
  const rho = 1.225;
  const Cd = deployed ? 1.5 : 0.7;
  const currentArea = deployed ? area : 0.5;

  let { h, v } = physicsRef.current;
  const Fd = 0.5 * rho * Cd * currentArea * v * v;
  const Fnet = mass * g - Fd;
  const a = Fnet / mass;

  v += a * dt;
  h -= v * dt;
  if (h <= 0) {
   h = 0;
   v = 0;
   setIsRunning(false);
  }

  physicsRef.current = { h, v };
  setSimState({ h, v });
  }
  prevTimeRef.current = time;
  if (isRunning) {
  requestRef.current = requestAnimationFrame(updatePhysics);
  }
 };

 if (isRunning) {
  requestRef.current = requestAnimationFrame(updatePhysics);
 } else {
  prevTimeRef.current = 0;
 }
 return () => cancelAnimationFrame(requestRef.current);
 }, [isRunning, mass, area, deployed]);

 const handleRecord = () => {
 setDataPoints(prev => [...prev, { mass, area: deployed ? area : 0.5, vTerm: Math.abs(simState.v) }]);
 };

 const handleReset = () => {
 setIsRunning(false);
 physicsRef.current = { h: 3000, v: 0 };
 setSimState({ h: 3000, v: 0 });
 setDeployed(false);
 };

 const checkAssessment = () => {
 const val = parseFloat(assessmentAnswer);
 if (!isNaN(val) && Math.abs(val - 1.72) < 0.05) {
  setAssessmentStatus('correct');
 } else {
  setAssessmentStatus('incorrect');
 }
 };

 const cloudOffset = (simState.h * 10) % 400;

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.p11_work_title')} />

  
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
   <h2 className="text-lg font-semibold">{t('lab.p11_work_theory_title')}</h2>
   </div>
   <div className="text-sm text-slate-600 dark:text-[#a1a1aa] space-y-2" dangerouslySetInnerHTML={{ __html: t('lab.p11_work_theory_p1') }} />
   <div className="text-sm text-slate-600 dark:text-[#a1a1aa] space-y-2" dangerouslySetInnerHTML={{ __html: t('lab.p11_work_theory_p2') }} />
   
   <div className="space-y-4 mt-4">
   <div>
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
    <span>{t('lab.p11_work_slider_mass')}</span>
    <span>{mass} kg</span>
    </label>
    <input type="range" min="50" max="120" step="1" value={mass} onChange={(e) => setMass(Number(e.target.value))} className="w-full mt-1" disabled={isRunning} />
   </div>
   <div>
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
    <span>{t('lab.p11_work_slider_area')}</span>
    <span>{area} m²</span>
    </label>
    <input type="range" min="10" max="40" step="1" value={area} onChange={(e) => setArea(Number(e.target.value))} className="w-full mt-1" disabled={isRunning} />
   </div>
   <div className="flex gap-2">
    <button onClick={() => setIsRunning(!isRunning)} className={`flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40 flex-col `}>
    {isRunning ? t('lab.p11_work_pause_btn') : t('lab.p11_work_start_btn')}
    </button>
    <button onClick={handleReset} className={`py-2 px-4 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg font-medium hover:bg-slate-300 dark:bg-[#121212] transition-colors flex-col `}>
    {t('lab.p11_work_reset_btn')}
    </button>
   </div>
   <button onClick={() => setDeployed(true)} disabled={deployed || !isRunning} className={`w-full py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 transition-colors dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40 flex-col `}>
    {t('lab.p11_work_deploy_btn')}
   </button>
   </div>
  </div>

  {/* Simulator */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col gap-4 '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-2 border-b pb-2">
   <Activity className="text-green-500" />
   <h2 className="text-lg font-semibold">{t('lab.p11_work_sim_title')}</h2>
   </div>
   <div className="relative flex-1 bg-sky-300 rounded-lg overflow-hidden border border-slate-200 dark:border-[#1c1b1b] min-h-[300px]">
   <svg viewBox="0 0 400 400" className="w-full h-full absolute inset-0">
    <g transform={`translate(0, ${cloudOffset})`}>
     <circle cx="100" cy="50" r="30" fill="white" opacity="0.8" />
     <circle cx="300" cy="200" r="40" fill="white" opacity="0.8" />
     <circle cx="150" cy="350" r="25" fill="white" opacity="0.8" />
    </g>
    <g transform={`translate(0, ${cloudOffset - 400})`}>
     <circle cx="100" cy="50" r="30" fill="white" opacity="0.8" />
     <circle cx="300" cy="200" r="40" fill="white" opacity="0.8" />
     <circle cx="150" cy="350" r="25" fill="white" opacity="0.8" />
    </g>
    
    <g transform="translate(200, 200)">
     <rect x="-5" y="0" width="10" height="30" fill="#1e293b" rx="2" />
     <circle cx="0" cy="-10" r="8" fill="#fcd34d" />
     {deployed && (
     <path d={`M -${area*2} -50 Q 0 -100 ${area*2} -50 L 0 0 Z`} fill="#ef4444" opacity="0.9" />
     )}
    </g>
    
    <rect x="10" y="10" width="140" height="60" fill="rgba(255,255,255,0.8)" rx="4" />
    <text x="20" y="30" className="text-sm font-bold fill-slate-800">{t('lab.p11_work_label_alt', { alt: simState.h.toFixed(0) })}</text>
    <text x="20" y="55" className="text-sm font-bold fill-slate-800">{t('lab.p11_work_label_vel', { vel: Math.abs(simState.v).toFixed(1) })}</text>
   </svg>
   </div>
  </div>

  {/* Data & Assessment */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col gap-4 '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-2 border-b pb-2">
   <Target className="text-indigo-500" />
   <h2 className="text-lg font-semibold">{t('lab.p11_work_data_title')}</h2>
   </div>
   
   <button onClick={handleRecord} className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">
   <Save size={18} /> {t('lab.p11_work_record_btn')}
   </button>
   
   {dataPoints.length > 0 && (
   <div className="mt-2 text-sm max-h-40 lg:overflow-y-auto">
    <table className="w-full border-collapse">
    <thead>
     <tr className="bg-slate-100 dark:bg-[#121212]">
     <th className="border p-1">{t('lab.p11_work_table_mass')}</th>
     <th className="border p-1">{t('lab.p11_work_table_area')}</th>
     <th className="border p-1">{t('lab.p11_work_table_vterm')}</th>
     </tr>
    </thead>
    <tbody>
     {dataPoints.map((d, i) => (
     <tr key={i} className="text-center">
      <td className="border p-1">{d.mass}</td>
      <td className="border p-1">{d.area}</td>
      <td className="border p-1">{d.vTerm.toFixed(1)}</td>
     </tr>
     ))}
    </tbody>
    </table>
   </div>
   )}

   <div className="mt-4 bg-indigo-50 p-4 rounded-lg border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b]">
   <h3 className="font-semibold text-indigo-900 mb-2 dark:text-[#ffffff]">{t('lab.p11_work_data_title')}</h3>
   <p className="text-sm text-indigo-800 mb-3 dark:text-[#ffffff]">
    {t('lab.p11_work_analysis_q')}
   </p>
   <div className="flex gap-2 items-center">
    <input 
    type="number" 
    value={assessmentAnswer} 
    onChange={(e) => { setAssessmentAnswer(e.target.value); setAssessmentStatus('idle'); }} 
    className="flex-1 p-2 border border-indigo-200 rounded outline-none focus:border-indigo-500"
    placeholder={t('lab.p11_work_analysis_placeholder')}
    />
    <button onClick={checkAssessment} className="py-2 px-4 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
    {t('lab.p11_work_check_btn')}
    </button>
   </div>
   {assessmentStatus === 'correct' && <div className="mt-2 text-sm text-green-600 flex items-center gap-1"><CheckCircle size={16}/> {t('lab.p11_work_correct_fb')}</div>}
   {assessmentStatus === 'incorrect' && <div className="mt-2 text-sm text-red-600 flex items-center gap-1"><XCircle size={16}/> {t('lab.p11_work_incorrect_fb')}</div>}
   </div>
  </div>
  </div>
 </div>
 );
}
