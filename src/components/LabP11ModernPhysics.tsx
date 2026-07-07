import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Activity, Zap, CheckCircle2, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';

const SvgGrid = () => (
 <g opacity="0.1">
  {Array.from({length: 11}).map((_, i) => (
   <line key={`v${i}`} x1={i*30} y1="0" x2={i*30} y2="300" stroke="white" strokeWidth="1" />
  ))}
  {Array.from({length: 11}).map((_, i) => (
   <line key={`h${i}`} x1="0" y1={i*30} x2="300" y2={i*30} stroke="white" strokeWidth="1" />
  ))}
 </g>
);

export default function LabP11ModernPhysics({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeTab, setActiveTab] = useState<'mass-energy' | 'pet-scan' | 'synchrotron'>('mass-energy');

 // Fission State
 const [fissionState, setFissionState] = useState<'idle' | 'fissioning' | 'done'>('idle');
 const [fissionProgress, setFissionProgress] = useState(0);
 const [fissionDeltaM, setFissionDeltaM] = useState<string>('');
 const [fissionEnergy, setFissionEnergy] = useState<string>('');
 const [fissionCorrect, setFissionCorrect] = useState<boolean | null>(null);

 // PET Scan State
 const [petState, setPetState] = useState<'idle' | 'annihilating' | 'done'>('idle');
 const [petProgress, setPetProgress] = useState(0);
 const [petGammaEnergy, setPetGammaEnergy] = useState<string>('');
 const [petCorrect, setPetCorrect] = useState<boolean | null>(null);

 // Synchrotron State
 const [syncRunning, setSyncRunning] = useState(false);
 const [syncAngle, setSyncAngle] = useState(0);
 const [syncBField, setSyncBField] = useState<number>(2.0); // T
 const [syncRadius, setSyncRadius] = useState<number>(30); // m
 const [syncMomentum, setSyncMomentum] = useState<string>('');
 const [syncCorrect, setSyncCorrect] = useState<boolean | null>(null);

 // Tab change handler
 const handleTabChange = (tab: 'mass-energy' | 'pet-scan' | 'synchrotron') => {
  setActiveTab(tab);
  setFissionState('idle');
  setFissionProgress(0);
  setPetState('idle');
  setPetProgress(0);
  setSyncRunning(false);
 };

 // Animation Effects
 useEffect(() => {
  let animationFrameId: number;
  let lastTime = performance.now();
  const render = (time: number) => {
   const deltaTime = time - lastTime;
   lastTime = time;
   if (fissionState === 'fissioning') {
    setFissionProgress(prev => {
     const next = prev + deltaTime / 2000;
     if (next >= 1) {
      setFissionState('done');
      return 1;
     }
     return next;
    });
   }
   animationFrameId = requestAnimationFrame(render);
  };
  if (fissionState === 'fissioning') {
   animationFrameId = requestAnimationFrame(render);
  }
  return () => cancelAnimationFrame(animationFrameId);
 }, [fissionState]);

 useEffect(() => {
  let animationFrameId: number;
  let lastTime = performance.now();
  const render = (time: number) => {
   const deltaTime = time - lastTime;
   lastTime = time;
   if (petState === 'annihilating') {
    setPetProgress(prev => {
     const next = prev + deltaTime / 2000;
     if (next >= 1) {
      setPetState('done');
      return 1;
     }
     return next;
    });
   }
   animationFrameId = requestAnimationFrame(render);
  };
  if (petState === 'annihilating') {
   animationFrameId = requestAnimationFrame(render);
  }
  return () => cancelAnimationFrame(animationFrameId);
 }, [petState]);

 useEffect(() => {
  let animationFrameId: number;
  let lastTime = performance.now();
  const render = (time: number) => {
   const deltaTime = time - lastTime;
   lastTime = time;
   if (syncRunning) {
    setSyncAngle(prev => (prev + syncBField * 40 * (deltaTime / 1000)) % 360);
   }
   animationFrameId = requestAnimationFrame(render);
  };
  if (syncRunning) {
   animationFrameId = requestAnimationFrame(render);
  }
  return () => cancelAnimationFrame(animationFrameId);
 }, [syncRunning, syncBField]);

 // Validation Checkers
 const checkFission = () => {
  const dM = parseFloat(fissionDeltaM);
  const E = parseFloat(fissionEnergy);
  const expectedDM = 0.2148;
  const expectedE = 200.1;
  if (Math.abs(dM - expectedDM) < 0.005 && Math.abs(E - expectedE) < 1.0) {
   setFissionCorrect(true);
  } else {
   setFissionCorrect(false);
  }
 };

 const checkPet = () => {
  const E = parseFloat(petGammaEnergy);
  if (Math.abs(E - 511) < 2) {
   setPetCorrect(true);
  } else {
   setPetCorrect(false);
  }
 };

 const checkSync = () => {
  const p = parseFloat(syncMomentum);
  // p = q * B * r => (1.6e-19) * B * r. Input is expecting magnitude of 10^-18.
  // So expected value = 0.16 * B * r.
  const expectedP = 0.16 * syncBField * syncRadius; 
  if (Math.abs(p - expectedP) < 0.2) {
   setSyncCorrect(true);
  } else {
   setSyncCorrect(false);
  }
 };

 return (
  <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
   {/* Header */}
   <LabHeader onExit={onExit} title={t('lab.p11modernphysics_virtual_lab_modern_physics')} />

   {/* Main Content */}
   
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.p11modernphysics_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.p11_modern_lab')}</button>
  </div>
  <main className="lg:flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:overflow-visible">
    
    {/* Left Column: Theory */}
    <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col lg:h-full lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
      <Activity className="text-indigo-600" />
      
                           {t('lab.p11modernphysics_theory_context')}
                          </h2>
     
     {activeTab === 'mass-energy' && (
      <div className="space-y-4 text-slate-600 dark:text-[#a1a1aa] leading-relaxed">
       <p><strong>{t('lab.p11_modern_massenergyequivalence')}</strong>  {t('lab.p11modernphysics_is_the_principle_that_mass_and')}</p>
       <span className="text-xl font-semibold text-center block text-slate-800 dark:text-[#ffffff]">{t('lab.p11_modern_emc')}</span>
       <p>{t('lab.p11modernphysics_in_nuclear_fission_a_heavy_nuc')}</p>
       <p>{t('lab.p11_modern_thetotalmassoftheproductsisstrictly')}<em>{t('lab.p11_modern_less')}</em>  {t('lab.p11modernphysics_than_the_reactants_this_missin')}</p>
       <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-lg text-sm font-mono border border-slate-200 dark:border-[#1c1b1b] space-y-1 mt-4 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
        <p className="text-indigo-700 font-bold mb-2">{t('lab.p11_modern_ref_data')}</p>
        <p>{t('lab.p11modernphysics_1_amu_931_5_mev')}</p>
        <p>{t('lab.p11_modern_massu2352350439amu')}</p>
        <p>{t('lab.p11_modern_massneutron10087amu')}</p>
        <p>{t('lab.p11_modern_massba1411409144amu')}</p>
        <p>{t('lab.p11_modern_masskr92918973amu')}</p>
       </div>
      </div>
     )}

     {activeTab === 'pet-scan' && (
      <div className="space-y-4 text-slate-600 dark:text-[#a1a1aa] leading-relaxed">
       <p><strong>{t('lab.p11modernphysics_positron_emission_tomography_p')}</strong>{t('lab.p11_modern_isamedicalimagingtechniquethatutili')}</p>
       <p>{t('lab.p11_modern_aradioactivetraceremitsa')}<strong>{t('lab.p11_modern_positron')}</strong>  {t('lab.p11modernphysics_e_the_antimatter_counterpart_o')} <strong>{t('lab.p11_modern_annihilate')}</strong>{t('lab.p11_modern_eachother')}</p>
       <p>{t('lab.p11modernphysics_their_entire_mass_is_converted')} <strong>{t('lab.p11_modern_gammaray')}</strong>  {t('lab.p11modernphysics_photons_emitted_in_exactly_opp')}</p>
       <span className="text-xl font-semibold text-center block text-slate-800 dark:text-[#ffffff] mt-2 mb-2">{t('lab.p11_modern_e2m')}<sub>e</sub>{t('lab.p11_modern_c')}</span>
       <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-lg text-sm font-mono border border-slate-200 dark:border-[#1c1b1b] space-y-1 mt-4 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
        <p className="text-indigo-700 font-bold mb-2">{t('lab.p11_modern_ref_data')}</p>
        <p>{t('lab.p11_modern_massofe0511mevc')}</p>
        <p>{t('lab.p11_modern_massofe0511mevc')}</p>
       </div>
      </div>
     )}

     {activeTab === 'synchrotron' && (
      <div className="space-y-4 text-slate-600 dark:text-[#a1a1aa] leading-relaxed">
       <p>A <strong>{t('lab.p11_modern_synchrotron')}</strong>  {t('lab.p11modernphysics_is_a_cyclic_particle_accelerat')}</p>
       <p>{t('lab.p11modernphysics_this_is_achieved_by_synchroniz')}</p>
       <span className="text-xl font-semibold text-center block text-slate-800 dark:text-[#ffffff]">{t('lab.p11_modern_pqbr')}</span>
       <ul className="list-disc pl-5 mt-2 space-y-1">
        <li><strong>p</strong>  {t('lab.p11modernphysics_momentum_kg_m_s')}</li>
        <li><strong>q</strong>  {t('lab.p11modernphysics_particle_charge_c')}</li>
        <li><strong>B</strong>  {t('lab.p11modernphysics_magnetic_field_t')}</li>
        <li><strong>r</strong>  {t('lab.p11modernphysics_radius_of_the_ring_m')}</li>
       </ul>
       <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-lg text-sm font-mono border border-slate-200 dark:border-[#1c1b1b] mt-4 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
        <p className="text-indigo-700 font-bold mb-2">{t('lab.p11_modern_ref_data')}</p>
        <p>{t('lab.p11modernphysics_charge_of_proton_q_1_6_10')}<sup>-19</sup> C</p>
       </div>
      </div>
     )}
    </div>

    {/* Middle Column: Visualizer */}
    <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex-col lg:h-full '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
     <div className="flex gap-2 mb-6 p-1 bg-slate-100 dark:bg-[#121212] rounded-lg">
      <button onClick={() => handleTabChange('mass-energy')} className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'mass-energy' ? 'bg-slate-50 dark:bg-[#121212] shadow-sm text-indigo-700' : 'text-slate-500 dark:text-[#a1a1aa] hover:text-slate-700 dark:text-[#ffffff]'}`}>{t('lab.p11_modern_fission')}</button>
      <button onClick={() => handleTabChange('pet-scan')} className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'pet-scan' ? 'bg-slate-50 dark:bg-[#121212] shadow-sm text-indigo-700' : 'text-slate-500 dark:text-[#a1a1aa] hover:text-slate-700 dark:text-[#ffffff]'}`}>{t('lab.p11_modern_petscan')}</button>
      <button onClick={() => handleTabChange('synchrotron')} className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'synchrotron' ? 'bg-slate-50 dark:bg-[#121212] shadow-sm text-indigo-700' : 'text-slate-500 dark:text-[#a1a1aa] hover:text-slate-700 dark:text-[#ffffff]'}`}>{t('lab.p11_modern_synchrotron')}</button>
     </div>
     
     <div className="flex-1 flex flex-col justify-center items-center">
      <svg width="100%" height="300" viewBox="0 0 300 300" className="bg-[#000000] dark:bg-[#121212] rounded-xl overflow-hidden shadow-inner">
       <SvgGrid />
       
       {activeTab === 'mass-energy' && (
        <>
         {fissionProgress < 0.5 ? (
          <>
           <circle cx={150 + Math.sin(fissionProgress * 100) * (fissionProgress * 10)} cy={150 + Math.cos(fissionProgress * 120) * (fissionProgress * 10)} r="30" fill="#3b82f6" />
           <text x={150 + Math.sin(fissionProgress * 100) * (fissionProgress * 10)} y={150 + Math.cos(fissionProgress * 120) * (fissionProgress * 10) + 4} fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">{t('lab.p11modernphysics_u_235')}</text>
           
           <circle cx={50 + fissionProgress * 2 * 100} cy="150" r="6" fill="#ef4444" />
           <text x={50 + fissionProgress * 2 * 100} y="135" fill="#ef4444" fontSize="12" textAnchor="middle" fontWeight="bold">n</text>
          </>
         ) : (
          <>
           <circle cx={150 - (fissionProgress - 0.5) * 2 * 100} cy={150 - (fissionProgress - 0.5) * 2 * 60} r="18" fill="#5560F1" />
           <text x={150 - (fissionProgress - 0.5) * 2 * 100} y={150 - (fissionProgress - 0.5) * 2 * 60 + 4} fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">{t('lab.p11modernphysics_kr_92')}</text>
           
           <circle cx={150 + (fissionProgress - 0.5) * 2 * 80} cy={150 + (fissionProgress - 0.5) * 2 * 90} r="24" fill="#10b981" />
           <text x={150 + (fissionProgress - 0.5) * 2 * 80} y={150 + (fissionProgress - 0.5) * 2 * 90 + 4} fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">{t('lab.p11modernphysics_ba_141')}</text>
           
           <circle cx={150 - (fissionProgress - 0.5) * 2 * 60} cy={150 + (fissionProgress - 0.5) * 2 * 100} r="5" fill="#ef4444" />
           <circle cx={150 + (fissionProgress - 0.5) * 2 * 110} cy={150 - (fissionProgress - 0.5) * 2 * 40} r="5" fill="#ef4444" />
           <circle cx={150 + (fissionProgress - 0.5) * 2 * 40} cy={150 + (fissionProgress - 0.5) * 2 * 120} r="5" fill="#ef4444" />
           
           <circle cx="150" cy="150" r={(fissionProgress - 0.5) * 2 * 150} fill="#f59e0b" opacity={1 - (fissionProgress - 0.5) * 2} />
          </>
         )}
        </>
       )}

       {activeTab === 'pet-scan' && (
        <>
         {petProgress < 0.5 ? (
          <>
           <circle cx={50 + petProgress * 2 * 100} cy="150" r="8" fill="#3b82f6" />
           <text x={50 + petProgress * 2 * 100} y="130" fill="#3b82f6" fontSize="14" textAnchor="middle" fontWeight="bold">e⁻</text>
           
           <circle cx={250 - petProgress * 2 * 100} cy="150" r="8" fill="#ef4444" />
           <text x={250 - petProgress * 2 * 100} y="130" fill="#ef4444" fontSize="14" textAnchor="middle" fontWeight="bold">e⁺</text>
          </>
         ) : (
          <>
           <line x1="150" y1="150" x2={150 - (petProgress - 0.5) * 2 * 150} y2="150" stroke="#f59e0b" strokeWidth="4" strokeDasharray="10 5" />
           <circle cx={150 - (petProgress - 0.5) * 2 * 150} cy="150" r="4" fill="#f59e0b" />
           <text x={150 - (petProgress - 0.5) * 2 * 100} y="135" fill="#f59e0b" fontSize="16" textAnchor="middle" fontWeight="bold">γ</text>

           <line x1="150" y1="150" x2={150 + (petProgress - 0.5) * 2 * 150} y2="150" stroke="#f59e0b" strokeWidth="4" strokeDasharray="10 5" />
           <circle cx={150 + (petProgress - 0.5) * 2 * 150} cy="150" r="4" fill="#f59e0b" />
           <text x={150 + (petProgress - 0.5) * 2 * 100} y="175" fill="#f59e0b" fontSize="16" textAnchor="middle" fontWeight="bold">γ</text>
           
           <circle cx="150" cy="150" r={(petProgress - 0.5) * 2 * 60} fill="#f59e0b" opacity={1 - (petProgress - 0.5) * 2} />
          </>
         )}
        </>
       )}

       {activeTab === 'synchrotron' && (
        <>
         <g opacity="0.4">
          {Array.from({length: 6}).map((_, i) => 
           Array.from({length: 6}).map((_, j) => (
            <g key={`b${i}-${j}`} transform={`translate(${i*60 + 30}, ${j*60 + 30})`}>
             <line x1="-4" y1="-4" x2="4" y2="4" stroke="#94a3b8" strokeWidth="2" />
             <line x1="-4" y1="4" x2="4" y2="-4" stroke="#94a3b8" strokeWidth="2" />
            </g>
           ))
          )}
         </g>
         
         <circle cx="150" cy="150" r={syncRadius * 2} stroke="#334155" strokeWidth="24" fill="none" />
         <circle cx="150" cy="150" r={syncRadius * 2} stroke="#475569" strokeWidth="20" fill="none" strokeDasharray="10 10" />
         
         <circle cx={150 + Math.cos(syncAngle * Math.PI / 180) * (syncRadius * 2)} cy={150 + Math.sin(syncAngle * Math.PI / 180) * (syncRadius * 2)} r="8" fill="#ef4444" />
        </>
       )}
      </svg>

      {/* Interactive Controls */}
      <div className="w-full mt-6">
       {activeTab === 'mass-energy' && (
        <div className="flex justify-center gap-4">
         <button 
          onClick={() => { setFissionState('fissioning'); setFissionProgress(0); setFissionCorrect(null); }}
          disabled={fissionState === 'fissioning'}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-2 rounded-full font-medium transition-colors dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-red-500/40"
         >
          <Zap className="w-4 h-4" />  {t('lab.p11modernphysics_trigger_fission')}
                                              </button>
         <button 
          onClick={() => { setFissionState('idle'); setFissionProgress(0); }}
          className="flex items-center gap-2 bg-slate-200 dark:bg-[#121212] hover:bg-slate-300 dark:bg-[#121212] text-slate-800 dark:text-[#ffffff] px-6 py-2 rounded-full font-medium transition-colors"
         >
          <RotateCcw className="w-4 h-4" />  {t('lab.p11modernphysics_reset')}
                                              </button>
        </div>
       )}

       {activeTab === 'pet-scan' && (
        <div className="flex justify-center gap-4">
         <button 
          onClick={() => { setPetState('annihilating'); setPetProgress(0); setPetCorrect(null); }}
          disabled={petState === 'annihilating'}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-full font-medium transition-colors dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
         >
          <Zap className="w-4 h-4" />  {t('lab.p11modernphysics_launch_particles')}
                                              </button>
         <button 
          onClick={() => { setPetState('idle'); setPetProgress(0); }}
          className="flex items-center gap-2 bg-slate-200 dark:bg-[#121212] hover:bg-slate-300 dark:bg-[#121212] text-slate-800 dark:text-[#ffffff] px-6 py-2 rounded-full font-medium transition-colors"
         >
          <RotateCcw className="w-4 h-4" />  {t('lab.p11modernphysics_reset')}
                                              </button>
        </div>
       )}

       {activeTab === 'synchrotron' && (
        <div className="space-y-4 px-4">
         <div className="flex justify-center gap-4 mb-2">
          <button 
           onClick={() => setSyncRunning(!syncRunning)}
           className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-colors ${syncRunning ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
          >
           {syncRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} 
           {syncRunning ? 'Pause Ring' : 'Start Ring'}
          </button>
         </div>
         
         <div className="space-y-1">
          <div className="flex justify-between text-sm text-slate-600 dark:text-[#a1a1aa] font-medium">
           <label>{t('lab.p11modernphysics_magnetic_field_b')}</label>
           <span>{syncBField.toFixed(1)} T</span>
          </div>
          <input 
           type="range" 
           min="1" max="5" step="0.1"
           value={syncBField}
           onChange={e => { setSyncBField(parseFloat(e.target.value)); setSyncCorrect(null); }}
           className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer"
          />
         </div>

         <div className="space-y-1">
          <div className="flex justify-between text-sm text-slate-600 dark:text-[#a1a1aa] font-medium">
           <label>{t('lab.p11modernphysics_ring_radius_r')}</label>
           <span>{syncRadius} m</span>
          </div>
          <input 
           type="range" 
           min="10" max="50" step="1"
           value={syncRadius}
           onChange={e => { setSyncRadius(parseInt(e.target.value)); setSyncCorrect(null); }}
           className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer"
          />
         </div>
        </div>
       )}
      </div>
     </div>
    </div>

    {/* Right Column: Assessment */}
    <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex-col lg:h-full '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
      <Activity className="text-indigo-600" />
      
                           {t('lab.p11modernphysics_data_logging_analysis')}
                          </h2>

     {activeTab === 'mass-energy' && (
      <div className="space-y-5">
       <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">{t('lab.p11modernphysics_simulate_a_u_235_fission_event')}</p>
       
       <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.p11modernphysics_calculate_mass_defect_m')}</label>
        <div className="flex gap-2 items-center">
         <input 
          type="number"
          value={fissionDeltaM}
          onChange={e => { setFissionDeltaM(e.target.value); setFissionCorrect(null); }}
          className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder={t('lab.p11modernphysics_t_lab_p11_modern_eg02148')}
         />
         <span className="text-slate-600 dark:text-[#a1a1aa] font-medium">{t('lab.p11_modern_amu')}</span>
        </div>
       </div>
       
       <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.p11modernphysics_calculate_energy_released_e')}</label>
        <div className="flex gap-2 items-center">
         <input 
          type="number"
          value={fissionEnergy}
          onChange={e => { setFissionEnergy(e.target.value); setFissionCorrect(null); }}
          className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder={t('lab.p11modernphysics_t_lab_p11_modern_eg2001')}
         />
         <span className="text-slate-600 dark:text-[#a1a1aa] font-medium">{t('lab.p11_modern_mev')}</span>
        </div>
       </div>

       <button 
        onClick={checkFission}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors shadow-sm dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
       >
        
                                     {t('lab.p11modernphysics_check_answers')}
                                    </button>
       
       {fissionCorrect !== null && (
        <div className={`p-4 rounded-md flex items-start gap-3 border ${fissionCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
         {fissionCorrect ? <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" /> : <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
         <span className="text-sm leading-relaxed">{fissionCorrect ? 'Correct! The mass defect is ~0.2148 amu, yielding ~200.1 MeV of pure energy.' : 'Incorrect. Check your sums! Mass Defect = (Reactants Mass) - (Products Mass).'}</span>
        </div>
       )}
      </div>
     )}

     {activeTab === 'pet-scan' && (
      <div className="space-y-5">
       <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">{t('lab.p11modernphysics_a_positron_and_electron_annihi')}</p>
       
       <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.p11modernphysics_gamma_photon_energy_e')}<sub>γ</sub>)</label>
        <div className="flex gap-2 items-center">
         <input 
          type="number"
          value={petGammaEnergy}
          onChange={e => { setPetGammaEnergy(e.target.value); setPetCorrect(null); }}
          className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder={t('lab.p11modernphysics_t_lab_p11_modern_eg511')}
         />
         <span className="text-slate-600 dark:text-[#a1a1aa] font-medium">{t('lab.p11modernphysics_kev')}</span>
        </div>
       </div>

       <button 
        onClick={checkPet}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors shadow-sm dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
       >
        
                                     {t('lab.p11modernphysics_check_answers')}
                                    </button>

       {petCorrect !== null && (
        <div className={`p-4 rounded-md flex items-start gap-3 border ${petCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
         {petCorrect ? <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" /> : <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
         <span className="text-sm leading-relaxed">{petCorrect ? 'Correct! Since 2 photons are emitted, each carries half the total energy (0.511 MeV = 511 keV).' : 'Incorrect. The total mass is 2 * 0.511 MeV/c², which converts to energy that is shared equally by two photons.'}</span>
        </div>
       )}
      </div>
     )}

     {activeTab === 'synchrotron' && (
      <div className="space-y-5">
       <div className={`p-4 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-md text-sm space-y-2 font-mono flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
        <p className="text-indigo-700 font-bold border-b border-slate-200 dark:border-[#1c1b1b] pb-1">{t('lab.p11_modern_sensorreadout')}</p>
        <p>{t('lab.p11modernphysics_b_field')} {syncBField.toFixed(1)} T</p>
        <p>{t('lab.p11modernphysics_radius')} {syncRadius} m</p>
       </div>

       <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.p11modernphysics_calculate_proton_momentum_p')}</label>
        <div className="flex gap-2 items-center">
         <input 
          type="number"
          value={syncMomentum}
          onChange={e => { setSyncMomentum(e.target.value); setSyncCorrect(null); }}
          className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-0"
          placeholder={t('lab.p11modernphysics_t_lab_p11_modern_eg96')}
         />
         <span className="text-slate-600 dark:text-[#a1a1aa] font-medium whitespace-nowrap text-sm">{t('lab.p11_modern_10')}<sup>-18</sup>{t('lab.p11_modern_kgms')}</span>
        </div>
       </div>

       <button 
        onClick={checkSync}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors shadow-sm dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
       >
        
                                     {t('lab.p11modernphysics_check_answers')}
                                    </button>

       {syncCorrect !== null && (
        <div className={`p-4 rounded-md flex items-start gap-3 border ${syncCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
         {syncCorrect ? <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" /> : <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
         <span className="text-sm leading-relaxed">{syncCorrect ? 'Correct! You successfully computed the proton momentum for the current track configuration.' : 'Incorrect. Use p = q * B * r, where q = 1.6 × 10^-19 C. Watch your powers of 10!'}</span>
        </div>
       )}
      </div>
     )}
    </div>
   </main>
  </div>
 );
}
