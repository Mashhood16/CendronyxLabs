import { useState, useEffect, useRef } from 'react';
import {Bone, Waves } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';

export default function LabP12MedicalImaging({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [tissueDepth, setTissueDepth] = useState(5); 
 const [pulseActive, setPulseActive] = useState(false);
 const [echoTime, setEchoTime] = useState(0); 
 
 const [boneThickness, setBoneThickness] = useState(2); 
 const [muscleThickness, setMuscleThickness] = useState(8); 
 
 const muBone = 0.5;
 const muMuscle = 0.1;
 const initialIntensity = 100;
 
 const intensity = initialIntensity * Math.exp(-muBone * boneThickness - muMuscle * muscleThickness);
 
 const [usAns, setUsAns] = useState('');
 const [xrAns, setXrAns] = useState('');
 const [usFeedback, setUsFeedback] = useState('');
 const [xrFeedback, setXrFeedback] = useState('');

 const pulsePosRef = useRef(0);
 const pulseDirRef = useRef(1); 
 const [renderPulsePos, setRenderPulsePos] = useState(0);
 
 useEffect(() => {
 if (!pulseActive) return;
 
 const interval = setInterval(() => {
 const speed = 2;
 pulsePosRef.current += speed * pulseDirRef.current;
 
 const targetDepthPixels = tissueDepth * 20; 
 
 if (pulseDirRef.current === 1 && pulsePosRef.current >= targetDepthPixels) {
 pulseDirRef.current = -1; 
 } else if (pulseDirRef.current === -1 && pulsePosRef.current <= 0) {
 setPulseActive(false);
 pulsePosRef.current = 0;
 pulseDirRef.current = 1;
 
 setEchoTime(Math.round((tissueDepth * 2) / 0.154));
 clearInterval(interval);
 }
 setRenderPulsePos(pulsePosRef.current);
 
 }, 16);
 
 return () => clearInterval(interval);
 }, [pulseActive, tissueDepth]);

 const triggerPulse = () => {
 if (pulseActive) return;
 setPulseActive(true);
 setEchoTime(0);
 pulsePosRef.current = 0;
 pulseDirRef.current = 1;
 };

 const checkUS = () => {
 const v = parseFloat(usAns);
 if (v >= 7.6 && v <= 7.8) setUsFeedback('Correct! ~7.7 cm');
 else setUsFeedback('Incorrect. Use d = v*t / 2');
 };

 const checkXR = () => {
 const v = parseFloat(xrAns);
 if (v >= 21 && v <= 23) setXrFeedback('Correct! ~22.3%');
 else setXrFeedback('Incorrect. Use I = I₀ e^(-μx)');
 };

 return (
 <div className="flex flex-col min- bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.p12medicalimaging_lab_12_3_medical_imaging_physi')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.p12medicalimaging_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.12medicalimaging_lab')}</button>
 </div>
 <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg:min-h-0 lg:overflow-visible">
 <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 lg:overflow-y-auto flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-3 border-b pb-2">{t('lab.12medicalimaging_theory')}</h2>
 
 <div className="space-y-4 text-slate-700 dark:text-[#ffffff] text-sm leading-relaxed">
 <section>
 <h3 className="font-semibold text-slate-900 dark:text-[#ffffff] flex items-center gap-2">
 <Waves size={16} className="text-blue-500"/> {t('lab.p12medicalimaging_piezoelectric_ultrasound')}
 </h3>
 <p className="mt-1">
 
 {t('lab.p12medicalimaging_ultrasound_uses_high_frequency')}
 </p>
 <p className={`mt-2 font-mono text-xs bg-slate-100 dark:bg-[#121212] p-2 rounded flex-col `}>{t('lab.p12medicalimaging_depth_v_t_2')}</p>
 </section>

 <section>
 <h3 className="font-semibold text-slate-900 dark:text-[#ffffff] flex items-center gap-2 mt-4">
 <Bone size={16} className="text-slate-500 dark:text-[#71717a]"/> {t('lab.p12medicalimaging_x_ray_attenuation')}
 </h3>
 <p className="mt-1">
 
 {t('lab.p12medicalimaging_x_rays_are_electromagnetic_wav')}
 </p>
 <p className={`mt-2 font-mono text-xs bg-slate-100 dark:bg-[#121212] p-2 rounded flex-col `}>{t('lab.p12medicalimaging_i_i_e_x')}</p>
 </section>
 </div>
 </div>

 <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-6 lg:overflow-y-auto ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className={`bg-slate-100 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex justify-between items-center mb-2">
 <h3 className="font-bold text-slate-800 dark:text-[#ffffff]">{t('lab.12medicalimaging_ultrasoundsonography')}</h3>
 <button 
 onClick={triggerPulse} disabled={pulseActive}
 className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-1 rounded text-sm font-medium transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
 >
 
 {t('lab.p12medicalimaging_send_pulse')}
 </button>
 </div>
 <label className="text-xs font-semibold text-slate-600 dark:text-[#a1a1aa] block mb-1">
 
 {t('lab.p12medicalimaging_organ_boundary_depth')} {tissueDepth} cm
 </label>
 <input 
 type="range" min="2" max="12" value={tissueDepth} 
 onChange={(e) => setTissueDepth(Number(e.target.value))}
 disabled={pulseActive}
 className="w-full mb-4 accent-cyan-600"
 />
 
 <div className="h-48 bg-[#000000] dark:bg-[#121212] rounded-lg relative overflow-hidden flex flex-col">
 <div className="h-4 w-full bg-slate-400 dark:bg-[#121212] absolute top-0 z-10 flex items-center justify-center text-[10px] text-slate-900 dark:text-[#ffffff] font-bold">{t('lab.12medicalimaging_transducer')}</div>
 
 <div className="flex-1 w-full flex flex-col relative pt-4">
 <div className="absolute w-full bg-pink-900/30" style={{ height: `${tissueDepth * 20}px` }}></div>
 <div className="absolute w-full bg-red-900/40 border-t-2 border-slate-400 dark:border-[#1c1b1b]" style={{ top: `${(tissueDepth * 20) + 16}px`, height: '100%' }}></div>
 
 {pulseActive && (
 <div 
 className="absolute w-full h-2 bg-cyan-400 shadow-[0_0_10px_cyan]"
 style={{ top: `${renderPulsePos + 16}px` }}
 ></div>
 )}
 </div>
 </div>
 
 <div className="mt-3 bg-[#121212] dark:bg-[#121212] text-cyan-400 font-mono text-sm p-2 rounded text-center">
 
 {t('lab.p12medicalimaging_echo_return_time')} {echoTime > 0 ? `${echoTime} µs` : '---'}
 </div>
 </div>

 <div className={`w-full bg-slate-100 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h3 className="font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.12medicalimaging_xraytransmission')}</h3>
 
 <div className="flex gap-4 mb-4">
 <div className="flex-1">
 <label className="text-xs text-slate-600 dark:text-[#a1a1aa] block">{t('lab.p12medicalimaging_muscle_thickness_cm')} {muscleThickness}</label>
 <input type="range" min="1" max="20" value={muscleThickness} onChange={e=>setMuscleThickness(Number(e.target.value))} className="w-full accent-red-400" />
 </div>
 <div className="flex-1">
 <label className="text-xs text-slate-600 dark:text-[#a1a1aa] block">{t('lab.p12medicalimaging_bone_thickness_cm')} {boneThickness}</label>
 <input type="range" min="0" max="10" value={boneThickness} onChange={e=>setBoneThickness(Number(e.target.value))} className="w-full accent-slate-400" />
 </div>
 </div>
 
 <div className="flex items-center gap-4">
 <div className="w-16 h-16 bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] flex items-center justify-center font-bold">
 I₀
 <br/>100%
 </div>
 <div className="flex-1 h-12 relative flex">
 <div className="h-full bg-red-200" style={{ flex: muscleThickness }} title={t('lab.p12medicalimaging_muscle_0_1')}></div>
 <div className="h-full bg-slate-300 dark:bg-[#121212]" style={{ flex: boneThickness }} title={t('lab.p12medicalimaging_bone_0_5')}></div>
 </div>
 <div 
 className="w-16 h-16 border border-slate-300 dark:border-[#1c1b1b] flex items-center justify-center font-bold text-white transition-colors duration-300"
 style={{ backgroundColor: `rgba(0,0,0,${1 - (intensity/100)})`, color: intensity > 50 ? 'black' : 'white' }}
 >
 I
 <br/>{intensity.toFixed(1)}%
 </div>
 </div>
 </div>
 </div>

 <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 lg:overflow-y-auto flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-3 border-b pb-2">{t('lab.12medicalimaging_assessments')}</h2>
 
 <div className="space-y-6">
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] '' : ''} flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.12medicalimaging_q1ultrasounddepth')}</h3>
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">
 
 {t('lab.p12medicalimaging_an_ultrasound_pulse_returns_af')} <strong>{t('lab.p12medicalimaging_100_s')}</strong> {t('lab.p12medicalimaging_10_s_if_the_speed_of_sound_in_')}
 </p>
 <div className="flex gap-2 items-center">
 <input 
 type="number" value={usAns} onChange={e => setUsAns(e.target.value)}
 placeholder={t('lab.p12medicalimaging_t_lab_12medicalimaging_eg55')} 
 className="flex-1 border rounded px-3 py-1.5 text-sm"
 />
 <span className="text-sm text-slate-600 dark:text-[#a1a1aa]">cm</span>
 <button onClick={checkUS} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
 
 {t('lab.p12medicalimaging_check')}
 </button>
 </div>
 {usFeedback && <p className={`mt-2 text-sm font-medium ${usFeedback.includes('Correct') ? 'text-emerald-600' : 'text-red-600'}`}>{usFeedback}</p>}
 </div>

 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.12medicalimaging_q2xrayattenuation')}</h3>
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">
 
 {t('lab.p12medicalimaging_an_x_ray_beam_passes_through_3')}
 </p>
 <div className="flex gap-2 items-center">
 <input 
 type="number" value={xrAns} onChange={e => setXrAns(e.target.value)}
 placeholder={t('lab.p12medicalimaging_t_lab_12medicalimaging_eg50')} 
 className="flex-1 border rounded px-3 py-1.5 text-sm"
 />
 <span className="text-sm text-slate-600 dark:text-[#a1a1aa]">%</span>
 <button onClick={checkXR} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
 
 {t('lab.p12medicalimaging_check')}
 </button>
 </div>
 {xrFeedback && <p className={`mt-2 text-sm font-medium ${xrFeedback.includes('Correct') ? 'text-emerald-600' : 'text-red-600'}`}>{xrFeedback}</p>}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
