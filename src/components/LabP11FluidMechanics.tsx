import { useState, useEffect, useRef } from 'react';
import { Activity, Target, Save, Info, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';
import { useLab } from '../store';

export default function LabP11FluidMechanics({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [ballast, setBallast] = useState(100000);
 const [isRunning, setIsRunning] = useState(false);
 const [simState, setSimState] = useState({ depth: 100, v: 0 });
 const [dataPoints, setDataPoints] = useState<{ ballast: number, vTerm: number }[]>([]);
 const [assessmentAnswer, setAssessmentAnswer] = useState('');
 const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

 const physicsRef = useRef({ depth: 100, v: 0 });
 const requestRef = useRef<number>(0);
 const prevTimeRef = useRef<number>(0);

 useEffect(() => {
 const updatePhysics = (time: number) => {
  if (prevTimeRef.current !== 0 && isRunning) {
  const dt = Math.min((time - prevTimeRef.current) / 1000, 0.05);
  const g = 9.81;
  const rho = 1000;
  const V = 500;
  const baseMass = 400000;
  const totalMass = baseMass + ballast;
  
  let { depth, v } = physicsRef.current;
  const Fb = rho * V * g;
  const Fg = totalMass * g;
  const Fd = 0.5 * rho * 20 * v * Math.abs(v);
  const Fnet = Fg - Fb - Fd; 
  const a = Fnet / totalMass;
  
  v += a * dt;
  depth += v * dt;
  
  if (depth <= 10) { depth = 10; if (v < 0) v = 0; }
  if (depth >= 190) { depth = 190; if (v > 0) v = 0; }
  
  physicsRef.current = { depth, v };
  setSimState({ depth, v });
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
 }, [isRunning, ballast]);

 const handleRecord = () => {
 setDataPoints(prev => [...prev, { ballast, vTerm: simState.v }]);
 };

 const handleReset = () => {
 setIsRunning(false);
 physicsRef.current = { depth: 100, v: 0 };
 setSimState({ depth: 100, v: 0 });
 };

 const checkAssessment = () => {
 const val = parseFloat(assessmentAnswer);
 if (!isNaN(val) && Math.abs(val - 500) < 5) {
  setAssessmentStatus('correct');
 } else {
  setAssessmentStatus('incorrect');
 }
 };

 const subY = (simState.depth / 200) * 300 + 50;

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.p11_fluid_title')} />

  
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
   <h2 className="text-lg font-semibold">{t('lab.p11_fluid_theory_title')}</h2>
   </div>
   <div className="text-sm text-slate-600 dark:text-[#a1a1aa] space-y-2" dangerouslySetInnerHTML={{ __html: t('lab.p11_fluid_theory_p1') }} />
   <div className="text-sm text-slate-600 dark:text-[#a1a1aa] space-y-2" dangerouslySetInnerHTML={{ __html: t('lab.p11_fluid_theory_p2') }} />
   
   <div className="space-y-4 mt-4">
   <div>
    <label className="flex justify-between text-sm font-medium text-slate-700 dark:text-[#ffffff]">
    <span>{t('lab.p11_fluid_slider_ballast')}</span>
    <span>{ballast.toLocaleString()} kg</span>
    </label>
    <input type="range" min="50000" max="150000" step="5000" value={ballast} onChange={(e) => setBallast(Number(e.target.value))} className="w-full mt-1" disabled={isRunning} />
   </div>
   
   <div className="flex gap-2">
    <button onClick={() => setIsRunning(!isRunning)} className={`flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40 flex-col `}>
    {isRunning ? t('lab.p11_fluid_pause_btn') : t('lab.p11_fluid_release_btn')}
    </button>
    <button onClick={handleReset} className={`py-2 px-4 bg-slate-200 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg font-medium hover:bg-slate-300 dark:bg-[#121212] transition-colors flex-col `}>
    {t('lab.p11_fluid_reset_btn')}
    </button>
   </div>
   </div>
  </div>

  {/* Simulator */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col gap-4 '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-2 border-b pb-2">
   <Activity className="text-green-500" />
   <h2 className="text-lg font-semibold">{t('lab.p11_fluid_sim_title')}</h2>
   </div>
   <div className={`relative flex-1 bg-blue-900 rounded-lg overflow- border border-slate-200 dark:border-[#1c1b1b] min-h-[300px] flex-col `}>
   <svg viewBox="0 0 400 400" className="w-full h-full absolute inset-0">
    <rect x="0" y="0" width="400" height="50" fill="#38bdf8" /> {/* Sky */}
    <rect x="0" y="350" width="400" height="50" fill="#78350f" /> {/* Sea floor */}
    
    <g transform={`translate(150, ${subY - 15})`}>
    <rect x="0" y="0" width="100" height="30" rx="15" fill="#facc15" />
    <rect x="40" y="-10" width="20" height="10" fill="#facc15" />
    <circle cx="20" cy="15" r="5" fill="#1e3a8a" />
    <circle cx="50" cy="15" r="5" fill="#1e3a8a" />
    <circle cx="80" cy="15" r="5" fill="#1e3a8a" />
    </g>
    
    <rect x="10" y="10" width="140" height="60" fill="rgba(255,255,255,0.8)" rx="4" />
    <text x="20" y="30" className="text-sm font-bold fill-slate-800">{t('lab.p11_fluid_label_depth', { depth: simState.depth.toFixed(1) })}</text>
    <text x="20" y="55" className="text-sm font-bold fill-slate-800">{t('lab.p11_fluid_label_vel', { vel: simState.v.toFixed(2) })}</text>
   </svg>
   </div>
  </div>

  {/* Data & Assessment */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col gap-4 '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div className="flex items-center gap-2 border-b pb-2">
   <Target className="text-indigo-500" />
   <h2 className="text-lg font-semibold">{t('lab.p11_fluid_data_title')}</h2>
   </div>
   
   <button onClick={handleRecord} className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">
   <Save size={18} /> {t('lab.p11_fluid_record_btn')}
   </button>
   
   {dataPoints.length > 0 && (
   <div className="mt-2 text-sm max-h-40 lg:overflow-y-auto">
    <table className="w-full border-collapse">
    <thead>
     <tr className="bg-slate-100 dark:bg-[#121212]">
     <th className="border p-1">{t('lab.p11_fluid_table_ballast')}</th>
     <th className="border p-1">{t('lab.p11_fluid_table_vterm')}</th>
     </tr>
    </thead>
    <tbody>
     {dataPoints.map((d, i) => (
     <tr key={i} className="text-center">
      <td className="border p-1">{d.ballast.toLocaleString()}</td>
      <td className="border p-1">{d.vTerm.toFixed(2)}</td>
     </tr>
     ))}
    </tbody>
    </table>
   </div>
   )}

   <div className="mt-4 bg-indigo-50 p-4 rounded-lg border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b]">
   <h3 className="font-semibold text-indigo-900 mb-2 dark:text-[#ffffff]">{t('lab.p11_fluid_data_title')}</h3>
   <p className="text-sm text-indigo-800 mb-3 dark:text-[#ffffff]">
    {t('lab.p11_fluid_analysis_q')}
   </p>
   <div className="flex gap-2 items-center">
    <input 
    type="number" 
    value={assessmentAnswer} 
    onChange={(e) => { setAssessmentAnswer(e.target.value); setAssessmentStatus('idle'); }} 
    className="flex-1 p-2 border border-indigo-200 rounded outline-none focus:border-indigo-500"
    placeholder={t('lab.p11_fluid_analysis_placeholder')}
    />
    <button onClick={checkAssessment} className="py-2 px-4 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
    {t('lab.p11_fluid_check_btn')}
    </button>
   </div>
   {assessmentStatus === 'correct' && <div className="mt-2 text-sm text-green-600 flex items-center gap-1"><CheckCircle size={16}/> {t('lab.p11_fluid_correct_fb')}</div>}
   {assessmentStatus === 'incorrect' && <div className="mt-2 text-sm text-red-600 flex items-center gap-1"><XCircle size={16}/> {t('lab.p11_fluid_incorrect_fb')}</div>}
   </div>
  </div>
  </div>
 </div>
 );
}
