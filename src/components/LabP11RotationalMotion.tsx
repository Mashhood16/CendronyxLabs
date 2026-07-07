import { useState, useEffect, useRef } from 'react';
import {Calculator, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';

export default function LabP11RotationalMotion({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [armRadius, setArmRadius] = useState(1.0); // 0.2 to 1.0 m
 const [initialOmega, setInitialOmega] = useState(2.0); // rad/s
 const [angularMomentum, setAngularMomentum] = useState(0);
 const [spinning, setSpinning] = useState(false);
 const [currentAngle, setCurrentAngle] = useState(0);

 const [omegaGuess, setOmegaGuess] = useState('');
 const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);
 const [lastOmega, setLastOmega] = useState(0);

 const I_body = 1.0; // kg*m^2
 const m_arms = 10.0; // kg
 
 const currentI = I_body + m_arms * armRadius * armRadius;
 const currentOmega = spinning ? angularMomentum / currentI : initialOmega;

 useEffect(() => {
 if (!spinning) {
  setAngularMomentum(currentI * initialOmega);
 }
 }, [spinning, initialOmega, currentI]);

 // Animation loop
 const requestRef = useRef<number>(0);
 const previousTimeRef = useRef<number>(0);

 const animate = (time: number) => {
 if (previousTimeRef.current !== 0 && spinning) {
  const deltaTime = (time - previousTimeRef.current) / 1000;
  setCurrentAngle(prev => (prev + currentOmega * deltaTime * (180 / Math.PI)) % 360);
 }
 previousTimeRef.current = time;
 requestRef.current = requestAnimationFrame(animate);
 };

 useEffect(() => {
 requestRef.current = requestAnimationFrame(animate);
 return () => cancelAnimationFrame(requestRef.current);
 });

 const checkAnswer = () => {
 const guess = parseFloat(omegaGuess);
 setLastOmega(currentOmega);
 if (Math.abs(currentOmega - guess) < 0.1) {
  setFeedbackType('correct');
 } else {
  setFeedbackType('incorrect');
 }
 };

 const armPixels = 40 + armRadius * 60; // visual scale

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.p11_rot_title')} />

  
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
  <div className="flex flex-col lg:grid lg:grid-cols-3 lg:flex-1 gap-0 lg:gap-4 p-4 lg:min-h-0 lg:overflow-visible">
  {/* Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 lg:overflow-y-auto flex-col ${activeMobileTab === 'theory' ? 'flex' : activeMobileTab === 'lab' ? 'flex mb-4' : 'hidden'} lg:flex lg:order-none`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4">{t('lab.p11_rot_theory_title')}</h2>
   <div className={`prose prose-sm text-slate-600 dark:text-[#a1a1aa] ${activeMobileTab === 'theory' ? 'block' : 'hidden'} lg:block`}>
   <p>{t('lab.p11_rot_theory_p1')}</p>
   <p className={`text-center font-mono bg-slate-100 dark:bg-[#121212] p-2 rounded text-slate-800 dark:text-[#ffffff] flex-col `}>{t('lab.p11_rot_theory_p2')}</p>
   <p>{t('lab.p11_rot_theory_p3')}</p>
   <ul className="list-disc pl-4 mt-2 space-y-1">
    <li>{t('lab.p11_rot_theory_li1')}</li>
    <li>{t('lab.p11_rot_theory_li2')}</li>
    <li>{t('lab.p11_rot_theory_li3')}</li>
   </ul>
   </div>
   
   <div className="mt-6 space-y-4">
   <div>
    <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] flex justify-between">
    <span>{t('lab.p11_rot_slider_arm')}</span> <span>{armRadius.toFixed(2)} m</span>
    </label>
    <input type="range" min="0.2" max="1.0" step="0.05" value={armRadius} onChange={e => setArmRadius(Number(e.target.value))} className="w-full accent-indigo-500" />
   </div>
   {!spinning && (
    <div>
    <label className="text-sm font-medium text-slate-700 dark:text-[#ffffff] flex justify-between">
     <span>{t('lab.p11_rot_slider_omega')}</span> <span>{initialOmega.toFixed(1)}</span>
    </label>
    <input type="range" min="1" max="5" step="0.1" value={initialOmega} onChange={e => setInitialOmega(Number(e.target.value))} className="w-full accent-indigo-500" />
    </div>
   )}
   
   <button 
    onClick={() => setSpinning(!spinning)}
    className={`w-full py-2 rounded-lg font-bold text-white transition-colors ${spinning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
   >
    {spinning ? t('lab.p11_rot_stop_btn') : t('lab.p11_rot_start_btn')}
   </button>
   </div>
  </div>

  {/* Simulator */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col items-center justify-center '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4">{t('lab.p11_rot_sim_title')}</h2>
   
   <div className={`relative w-64 h-64 bg-slate-100 dark:bg-[#121212] rounded-full border-4 border-slate-200 dark:border-[#1c1b1b] shadow-inner flex items-center justify-center overflow- flex-col `}>
   {/* Spinning Container */}
   <div 
    className="absolute"
    style={{ transform: `rotate(${currentAngle}deg)` }}
   >
    <svg width="200" height="200" className="overflow-visible">
    {/* Arms */}
    <line x1={100 - armPixels} y1="100" x2={100 + armPixels} y2="100" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
    {/* Weights on hands */}
    <circle cx={100 - armPixels} cy="100" r="12" fill="#64748b" />
    <circle cx={100 + armPixels} cy="100" r="12" fill="#64748b" />
    
    {/* Body/Head */}
    <circle cx="100" cy="100" r="25" fill="#5560F1" />
    {/* Orientation marker */}
    <circle cx="100" cy="85" r="4" fill="#ffffff" />
    </svg>
   </div>
   </div>
   
   <div className={`w-full mt-6 flex gap-6 text-sm font-mono bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] p-3 rounded-lg border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col  'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
   <div className="flex flex-col items-center">
    <span className="text-slate-500 dark:text-[#71717a]">{t('lab.p11_rot_label_inertia')}</span>
    <span className="font-bold text-indigo-700">{currentI.toFixed(2)}</span>
   </div>
   <div className="flex flex-col items-center">
    <span className="text-slate-500 dark:text-[#71717a]">{t('lab.p11_rot_label_velocity')}</span>
    <span className="font-bold text-blue-700">{currentOmega.toFixed(2)}</span>
   </div>
   <div className="flex flex-col items-center">
    <span className="text-slate-500 dark:text-[#71717a]">{t('lab.p11_rot_label_momentum')}</span>
    <span className="font-bold text-emerald-700">{angularMomentum.toFixed(2)}</span>
   </div>
   </div>
  </div>

  {/* Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 lg:overflow-y-auto flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
   <Calculator className="w-5 h-5 text-emerald-500" />
   {t('lab.p11_rot_assess_title')}
   </h2>
   
   <div className={`mb-6 p-4 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg space-y-2 text-sm text-slate-700 dark:text-[#ffffff] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <p>{t('lab.p11_rot_data_body', { I_body })}</p>
   <p>{t('lab.p11_rot_data_arms', { m_arms })}</p>
   <p>{t('lab.p11_rot_data_r', { r: armRadius.toFixed(2) })}</p>
   <p className="mt-2 pt-2 border-t border-slate-200 dark:border-[#1c1b1b]">
    {t('lab.p11_rot_data_L', { L: angularMomentum.toFixed(2) })}
   </p>
   </div>

   <div className="space-y-4">
   <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
    {t('lab.p11_rot_omega_label')}
    </label>
    <input
    type="number"
    value={omegaGuess}
    onChange={(e) => setOmegaGuess(e.target.value)}
    placeholder={t('lab.p11_rot_placeholder')}
    className="w-full px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
   </div>
   
   <button 
    onClick={checkAnswer}
    disabled={!spinning}
    className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
   >
    <CheckCircle className="w-4 h-4" /> {t('lab.p11_rot_check_btn')}
   </button>
   {!spinning && <p className="text-xs text-center text-slate-500 dark:text-[#71717a]">{t('lab.p11_rot_start_hint')}</p>}

   {feedbackType === 'correct' && (
    <div className="p-3 rounded-lg text-sm flex items-start gap-2 bg-green-50 text-green-800 border border-green-200">
    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
    <span>{t('lab.p11_rot_correct_fb')}</span>
    </div>
   )}
   {feedbackType === 'incorrect' && (
    <div className="p-3 rounded-lg text-sm flex items-start gap-2 bg-red-50 text-red-800 border border-red-200">
    <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
    <span>{t('lab.p11_rot_incorrect_fb', { omega: lastOmega.toFixed(2) })}</span>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
