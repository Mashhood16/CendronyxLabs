import { useState } from 'react';
import { Activity, CheckCircle2, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface Props {
 onExit?: () => void;
}

export default function LabM10ComplexApplications({ onExit }: Props) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 // Simulator State
 const [resistance, setResistance] = useState<number>(10); // Real part
 const [reactance, setReactance] = useState<number>(5); // Imaginary part
 const [currentReal, setCurrentReal] = useState<number>(2);
 const [currentImag, setCurrentImag] = useState<number>(1);
 
 // Assessment State
 const [ansReal, setAnsReal] = useState<string>('');
 const [ansImag, setAnsImag] = useState<string>('');
 const [feedback, setFeedback] = useState<string | null>(null);
 
 // Derived values for E = I * Z
 // Z = R + jX
 // I = cR + jcI
 // E = (cR + jcI)(R + jX) = (cR*R - cI*X) + j(cR*X + cI*R)
 const vReal = currentReal * resistance - currentImag * reactance;
 const vImag = currentReal * reactance + currentImag * resistance;

 const checkAnswer = () => {
 if (parseFloat(ansReal) === vReal && parseFloat(ansImag) === vImag) {
  setFeedback('Correct! You correctly applied E = IZ.');
 } else {
  setFeedback('Incorrect. Remember: (a + bj)(c + dj) = (ac - bd) + (ad + bc)j');
 }
 };

 const generateWaveform = () => {
 // E = Vm * sin(wt + phi)
 const Vm = Math.sqrt(vReal*vReal + vImag*vImag);
 const phi = Math.atan2(vImag, vReal);
 
 let path = `M 0,100 `;
 for(let x = 0; x <= 400; x+=2) {
  const t = x / 50;
  const y = 100 - Vm * Math.sin(t + phi) * 2; // scale for visibility
  path += `L ${x},${y} `;
 }
 return path;
 };

 const generateCurrentWave = () => {
  const Im = Math.sqrt(currentReal*currentReal + currentImag*currentImag);
  const phiI = Math.atan2(currentImag, currentReal);
  let path = `M 0,100 `;
  for(let x = 0; x <= 400; x+=2) {
  const t = x / 50;
  const y = 100 - Im * Math.sin(t + phiI) * 10; // scale for visibility
  path += `L ${x},${y} `;
  }
  return path;
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.m10complexapplications_complex_numbers_ac_circuit_app')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.m10complexapplications_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.m10complexapplications_lab')}</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 flex-grow lg:overflow-visible">
  {/* LEFT: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2 dark:text-[#ffffff]">
   <Activity />  {t('lab.m10complexapplications_theory_context')}
                        </h2>
   <div className="prose text-slate-700 dark:text-[#ffffff]">
   <p>
    
                             {t('lab.m10complexapplications_in_alternating_current_ac_circ')} <strong>{t('lab.m10complexapplications_complex_numbers')}</strong>  {t('lab.m10complexapplications_to_represent_them')}
                            </p>
   <p>
    <strong>{t('lab.m10complexapplications_ohm_s_law_for_ac')}</strong> <code>{t('lab.m10complexapplications_e_i_z')}</code>
   </p>
   <ul className="list-disc pl-5 space-y-2 mt-2">
    <li><strong>{t('lab.m10complexapplications_e_voltage')}</strong>  {t('lab.m10complexapplications_complex_voltage_phasor')}</li>
    <li><strong>{t('lab.m10complexapplications_i_current')}</strong>  {t('lab.m10complexapplications_complex_current_phasor')}</li>
    <li><strong>{t('lab.m10complexapplications_z_impedance')}</strong>  {t('lab.m10complexapplications_complex_resistance')}</li>
   </ul>
   <div className={`bg-slate-100 dark:bg-[#121212] p-4 rounded-lg mt-4 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff]">{t('lab.m10complexapplications_impedance_z')}</h3>
    <p>{t('lab.m10complexapplications_z_r_jx')}</p>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">{t('lab.m10complexapplications_r_resistance_real_x_reactance_')}</p>
   </div>
   <p className="mt-4 text-sm text-slate-600 dark:text-[#a1a1aa]">
    
                             {t('lab.m10complexapplications_note_electrical_engineers_use')} <code>j</code>  {t('lab.m10complexapplications_instead_of')} <code>i</code>  {t('lab.m10complexapplications_for_the_imaginary_unit_to_avoi')}
                            </p>
   </div>
  </div>

  {/* MIDDLE: Simulation */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col items-center '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-indigo-800 mb-4 dark:text-[#ffffff]">{t('lab.m10complexapplications_oscilloscope_phasor_simulation')}</h2>
   
   <div className={`w-full max-w-md space-y-4 mb-6 bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div>
    <label className="block text-sm font-semibold mb-1">{t('lab.m10complexapplications_resistance_r')} {resistance} Ω</label>
    <input type="range" min="0" max="20" value={resistance} onChange={e => setResistance(Number(e.target.value))} className="w-full accent-indigo-600" />
   </div>
   <div>
    <label className="block text-sm font-semibold mb-1">{t('lab.m10complexapplications_reactance_x')} {reactance}  {t('lab.m10complexapplications_j')}</label>
    <input type="range" min="-20" max="20" value={reactance} onChange={e => setReactance(Number(e.target.value))} className="w-full accent-indigo-600" />
   </div>
   <div className="grid grid-cols-2 gap-4">
    <div>
     <label className="block text-sm font-semibold mb-1">{t('lab.m10complexapplications_current_real')} {currentReal} A</label>
     <input type="range" min="-5" max="5" value={currentReal} onChange={e => setCurrentReal(Number(e.target.value))} className="w-full accent-blue-600" />
    </div>
    <div>
     <label className="block text-sm font-semibold mb-1">{t('lab.m10complexapplications_current_imag')} {currentImag}  {t('lab.m10complexapplications_a_j')}</label>
     <input type="range" min="-5" max="5" value={currentImag} onChange={e => setCurrentImag(Number(e.target.value))} className="w-full accent-blue-600" />
    </div>
   </div>
   </div>

   <div className={`relative w-full h-48 bg-[#000000] dark:bg-[#121212] rounded-lg overflow- border-2 border-[#1c1b1b] dark:border-[#1c1b1b] shadow-inner flex-col `}>
   <svg viewBox="0 0 400 200" className="w-full h-full">
    {/* Grid lines */}
    <line x1="0" y1="100" x2="400" y2="100" stroke="#334155" strokeWidth="2" />
    <line x1="200" y1="0" x2="200" y2="200" stroke="#334155" strokeWidth="2" />
    
    {/* Voltage Waveform (Red) */}
    <path d={generateWaveform()} fill="none" stroke="#ef4444" strokeWidth="2" />
    
    {/* Current Waveform (Blue) */}
    <path d={generateCurrentWave()} fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.8" />
   </svg>
   <div className="absolute top-2 right-2 text-xs flex flex-col gap-1 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div> <span className="text-slate-300">{t('lab.m10complexapplications_voltage_e')}</span></div>
    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full dark:bg-teal-950/20 dark:border-teal-900"></div> <span className="text-slate-300">{t('lab.m10complexapplications_current_i')}</span></div>
   </div>
   </div>
  </div>

  {/* RIGHT: Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-lg p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-indigo-800 mb-4 dark:text-[#ffffff]">{t('lab.m10complexapplications_laboratory_assessment')}</h2>
   
   <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-6 dark:bg-[#121212] dark:border-[#1c1b1b]">
   <h3 className="font-semibold text-indigo-900 mb-2 dark:text-[#ffffff]">{t('lab.m10complexapplications_calculate_complex_voltage')}</h3>
   <p className="text-slate-700 dark:text-[#ffffff] mb-4">
    
                             {t('lab.m10complexapplications_using_the_simulator_values_cal')} <code>{t('lab.m10complexapplications_e_i_z')}</code>  {t('lab.m10complexapplications_in_standard_complex_form')} <code>{t('lab.m10complexapplications_a_bj')}</code>.
   </p>
   <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded border border-slate-200 dark:border-[#1c1b1b] mb-4 font-mono text-sm">
    <p>{t('lab.m10complexapplications_z')} {resistance} {reactance >= 0 ? '+' : '-'} {Math.abs(reactance)}{t('lab.m10complexapplications_j_1')}</p>
    <p>{t('lab.m10complexapplications_i')} {currentReal} {currentImag >= 0 ? '+' : '-'} {Math.abs(currentImag)}{t('lab.m10complexapplications_j_a')}</p>
   </div>
   
   <div className="flex items-center gap-2 mb-4">
    <span className="font-semibold">{t('lab.m10complexapplications_e')}</span>
    <input 
    type="number" 
    value={ansReal} 
    onChange={e => setAnsReal(e.target.value)}
    className="w-20 p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-indigo-500 outline-none"
    placeholder={t('lab.m10complexapplications_real')}
    />
    <span className="font-semibold">+</span>
    <input 
    type="number" 
    value={ansImag} 
    onChange={e => setAnsImag(e.target.value)}
    className="w-20 p-2 border border-slate-300 dark:border-[#1c1b1b] rounded focus:ring-2 focus:ring-indigo-500 outline-none"
    placeholder={t('lab.m10complexapplications_imag')}
    />
    <span className="font-semibold">{t('lab.m10complexapplications_j_v')}</span>
   </div>

   <button 
    onClick={checkAnswer}
    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
   >
    
                             {t('lab.m10complexapplications_check_answer')}
                            </button>

   {feedback && (
    <div className={`mt-4 p-3 rounded flex items-start gap-2 ${feedback.includes('Correct') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
    {feedback.includes('Correct') ? <CheckCircle2 className="shrink-0 mt-0.5" size={18} /> : <XCircle className="shrink-0 mt-0.5" size={18} />}
    <span>{feedback}</span>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
