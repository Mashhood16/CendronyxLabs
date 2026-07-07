import { useState } from 'react';
import { Train, Star, Activity, CheckCircle, XCircle, Thermometer} from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';

export default function LabP12ThermoMechanics({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [scenario, setScenario] = useState<'maglev' | 'whitedwarf'>('maglev');

 // Maglev State
 const [temperature, setTemperature] = useState<number>(293); // K
 const [magneticField, setMagneticField] = useState<number>(1.0); // T
 const Tc = 92; // YBCO Critical Temp
 const [maglevAns, setMaglevAns] = useState('');
 const [maglevStatus, setMaglevStatus] = useState<'idle'|'correct'|'incorrect'>('idle');

 // White Dwarf State
 const [mass, setMass] = useState<number>(1.0); // Solar masses
 const limit = 1.44;
 const [wdAns, setWdAns] = useState('');
 const [wdStatus, setWdStatus] = useState<'idle'|'correct'|'incorrect'>('idle');

 const checkMaglev = () => {
 const v = parseFloat(maglevAns);
 if (!isNaN(v) && v >= 9.7 && v <= 9.9) setMaglevStatus('correct');
 else setMaglevStatus('incorrect');
 };

 const checkWd = () => {
 const v = parseFloat(wdAns);
 if (!isNaN(v) && v >= 1.43 && v <= 1.45) setWdStatus('correct');
 else setWdStatus('incorrect');
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.p12thermomechanics_extreme_states_of_matter')} />
  <div className="bg-[#000000] dark:bg-[#121212] text-white p-2 flex justify-end">
  <select 
   className="bg-[#121212] dark:bg-[#121212] border border-[#1c1b1b] dark:border-[#1c1b1b] text-white px-3 py-1 rounded-md outline-none focus:border-orange-500"
   value={scenario}
   onChange={(e) => setScenario(e.target.value as any)}
  >
   <option value="maglev">{t('lab.12thermomechanics_superconductingmaglev')}</option>
   <option value="whitedwarf">{t('lab.12thermomechanics_whitedwarfdegeneracy')}</option>
  </select>
  </div>

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.p12thermomechanics_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.12thermomechanics_lab')}</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 lg:flex-1 gap-0 lg:gap-6 p-6 lg:overflow-visible">
  
  {/* Left Column: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   {scenario === 'maglev' ? (
   <>
    <h2 className="text-2xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
    <Train className="text-blue-600"/>  {t('lab.p12thermomechanics_superconductivity')}
                                 </h2>
    <div className="text-slate-600 dark:text-[#a1a1aa] space-y-4">
    <p>
     
                                      {t('lab.p12thermomechanics_at_extremely_low_temperatures_')}
                                     </p>
    <p>
     <strong>{t('lab.12thermomechanics_meissnereffect')}</strong>  {t('lab.p12thermomechanics_superconductors_expel_magnetic')}
                                     </p>
    <div className={`bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>
     <h3 className="font-semibold text-blue-900 mb-2 dark:text-[#ffffff]">{t('lab.12thermomechanics_magneticlevitationforce')}</h3>
     <p className="font-mono text-center text-blue-800 dark:text-[#ffffff]">{t('lab.p12thermomechanics_f_m_b_2_a')}</p>
     <p className="text-sm text-blue-700 mt-2">
     
                                          {t('lab.p12thermomechanics_for_levitation_the_magnetic_fo')}
                                          </p>
    </div>
    </div>
   </>
   ) : (
   <>
    <h2 className="text-2xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
    <Star className="text-orange-500"/>  {t('lab.p12thermomechanics_electron_degeneracy')}
                                     </h2>
    <div className="text-slate-600 dark:text-[#a1a1aa] space-y-4">
    <p>
     
                                          {t('lab.p12thermomechanics_when_a_medium_sized_star_exhau')}
                                         </p>
    <p>
     <strong>{t('lab.12thermomechanics_pauliexclusionprinciple')}</strong>  {t('lab.p12thermomechanics_no_two_electrons_can_occupy_th')} <strong>{t('lab.12thermomechanics_electrondegeneracypressure')}</strong>  {t('lab.p12thermomechanics_that_halts_the_collapse')}
                                         </p>
    <div className={`bg-orange-50 p-4 rounded-lg border border-orange-100 flex-col `}>
     <h3 className="font-semibold text-orange-900 mb-2">{t('lab.12thermomechanics_massradiusrelation')}</h3>
     <p className="font-mono text-center text-orange-800">{t('lab.p12thermomechanics_r_m_1_3')}</p>
     <p className="text-sm text-orange-800 mt-2">
     
                                              {t('lab.p12thermomechanics_unlike_normal_objects_adding_m')} <em>{t('lab.12thermomechanics_smaller')}</em>{t('lab.12thermomechanics_ifitexceedsthe')}<strong>{t('lab.p12thermomechanics_chandrasekhar_limit_1_44_m_sun')}</strong>{t('lab.p12thermomechanics_electron_degeneracy_pressure_f')}
                                              </p>
    </div>
    </div>
   </>
   )}
  </div>

  {/* Middle Column: Simulation */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex-col items-center '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2 w-full">
   {scenario === 'maglev' ? <Thermometer className="text-blue-500"/> : <Star className="text-orange-500"/>}
   
                        {t('lab.p12thermomechanics_interactive_visualizer')}
                        </h2>
   
   <div className={`w-full aspect-square max-w-md bg-[#000000] dark:bg-[#121212] rounded-xl relative overflow- flex items-center justify-center border-4 border-[#1c1b1b] dark:border-[#1c1b1b] shadow-inner flex-col `}>
   {scenario === 'maglev' ? (
    <svg viewBox="0 0 200 200" className="w-full h-full">
    {/* Track */}
    <rect x="20" y="160" width="160" height="20" fill="#475569" />
    <rect x="20" y="150" width="160" height="10" fill="#64748b" />
    <text x="100" y="175" fill="white" fontSize="10" textAnchor="middle">{t('lab.12thermomechanics_magnetictrack')}</text>
    
    {/* Field lines */}
    {Array.from({length: 7}).map((_, i) => {
     const x = 40 + i * 20;
     const levitating = temperature <= Tc;
     const curve = levitating ? `Q ${x} 100, ${x < 100 ? x - 40 : x + 40} 60` : `L ${x} 60`;
     return (
     <path 
      key={i} 
      d={`M ${x} 150 ${curve}`} 
      stroke="rgba(56, 189, 248, 0.4)" 
      strokeWidth="2" 
      fill="none" 
      strokeDasharray="4 4"
     />
     );
    })}

    {/* Train Block */}
    <g style={{ transform: `translateY(${temperature <= Tc ? -40 - magneticField * 20 : 0}px)`, transition: 'transform 0.5s ease' }}>
     <rect x="60" y="110" width="80" height="40" fill={temperature <= Tc ? "#10b981" : "#94a3b8"} rx="4" />
     <text x="100" y="135" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">
     {temperature <= Tc ? "SUPERCONDUCTING" : "NORMAL"}
     </text>
    </g>
    
    {/* Frost overlay */}
    {temperature < 200 && (
     <rect x="0" y="0" width="200" height="200" fill="rgba(255,255,255,0.1)" style={{ opacity: (200 - temperature)/200 }} pointerEvents="none" />
    )}
    </svg>
   ) : (
    <svg viewBox="0 0 200 200" className="w-full h-full">
    <circle cx="100" cy="100" r={mass > limit ? 2 : Math.max(10, 80 * Math.pow(mass, -1/3))} fill={mass > limit ? "#000" : "#fff"} />
    {mass <= limit && <circle cx="100" cy="100" r={Math.max(10, 80 * Math.pow(mass, -1/3))} fill="url(#wd-glow)" />}
    <defs>
     <radialGradient id="wd-glow">
     <stop offset="0%" stopColor="rgba(255, 255, 255, 1)" />
     <stop offset="50%" stopColor="rgba(100, 200, 255, 0.5)" />
     <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
     </radialGradient>
    </defs>
    
    {/* Gravity vs Pressure arrows */}
    {mass <= limit && (
     <>
     {/* Gravity (Inward) */}
     <path d="M 50 50 L 80 80" stroke="rgba(239, 68, 68, 0.8)" strokeWidth={2 + mass} markerEnd="url(#arrow-in)" />
     <path d="M 150 150 L 120 120" stroke="rgba(239, 68, 68, 0.8)" strokeWidth={2 + mass} markerEnd="url(#arrow-in)" />
     
     {/* Degeneracy Pressure (Outward) */}
     <path d="M 100 100 L 60 140" stroke="rgba(56, 189, 248, 0.8)" strokeWidth={2 + mass} markerEnd="url(#arrow-out)" />
     <path d="M 100 100 L 140 60" stroke="rgba(56, 189, 248, 0.8)" strokeWidth={2 + mass} markerEnd="url(#arrow-out)" />
     </>
    )}
    
    <defs>
     <marker id="arrow-in" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto-start-reverse">
     <path d="M 0 0 L 6 3 L 0 6 z" fill="rgba(239, 68, 68, 0.8)" />
     </marker>
     <marker id="arrow-out" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto-start-reverse">
     <path d="M 0 0 L 6 3 L 0 6 z" fill="rgba(56, 189, 248, 0.8)" />
     </marker>
    </defs>

    {mass > limit && (
     <text x="100" y="100" fill="red" fontSize="14" textAnchor="middle" fontWeight="bold">{t('lab.p12thermomechanics_collapsed_black_hole')}</text>
    )}
    </svg>
   )}
   </div>

   <div className="w-full mt-6 space-y-4">
   {scenario === 'maglev' ? (
    <>
    <div>
     <div className="flex justify-between mb-1">
     <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.p12thermomechanics_temperature_t')}</label>
     <span className="text-sm font-mono text-blue-600">{temperature} K</span>
     </div>
     <input 
     type="range" 
     min="10" max="300" step="1" 
     value={temperature} 
     onChange={(e) => setTemperature(parseInt(e.target.value))}
     className="w-full h-2 bg-slate-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer accent-blue-600"
     />
     <div className="text-xs text-slate-500 dark:text-[#71717a] mt-1 flex justify-between">
     <span>{t('lab.p12thermomechanics_liquid_helium_4k')}</span>
     <span>{t('lab.p12thermomechanics_liquid_n2_77k')}</span>
     <span>{t('lab.12thermomechanics_roomtemp')}</span>
     </div>
    </div>
    <div>
     <div className="flex justify-between mb-1">
     <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.p12thermomechanics_magnetic_field_b')}</label>
     <span className="text-sm font-mono text-blue-600">{magneticField.toFixed(1)}  {t('lab.p12thermomechanics_tesla')}</span>
     </div>
     <input 
     type="range" 
     min="0" max="5" step="0.1" 
     value={magneticField} 
     onChange={(e) => setMagneticField(parseFloat(e.target.value))}
     className="w-full h-2 bg-slate-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer accent-blue-600"
     />
    </div>
    </>
   ) : (
    <>
    <div>
     <div className="flex justify-between mb-1">
     <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.p12thermomechanics_star_mass_m')}</label>
     <span className="text-sm font-mono text-orange-600">{mass.toFixed(2)}  {t('lab.p12thermomechanics_m_sun')}</span>
     </div>
     <input 
     type="range" 
     min="0.1" max="2.0" step="0.01" 
     value={mass} 
     onChange={(e) => setMass(parseFloat(e.target.value))}
     className="w-full h-2 bg-slate-200 dark:bg-[#121212] rounded-lg appearance-none cursor-pointer accent-orange-600"
     />
    </div>
    </>
   )}
   </div>
  </div>

  {/* Right Column: Assessment */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex-col gap-6 '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
   <Activity className="text-emerald-500" />
   
                        {t('lab.p12thermomechanics_analysis_computation')}
                        </h2>

   <div className="space-y-6">
   {scenario === 'maglev' ? (
    <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.12thermomechanics_magneticpressure')}</h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">
     
                                      {t('lab.p12thermomechanics_to_levitate_a_train_of_mass_50')}
                                     </p>
    <div className="flex gap-2">
     <input 
     type="text" 
     value={maglevAns}
     onChange={(e) => setMaglevAns(e.target.value)}
     placeholder={t('lab.p12thermomechanics_t_lab_12thermomechanics_eg98')}
     className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
     />
     <button 
     onClick={checkMaglev}
     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
     >
     
                                          {t('lab.p12thermomechanics_check')}
                                          </button>
    </div>
    {maglevStatus === 'correct' && <p className="text-emerald-600 text-sm mt-2 flex items-center gap-1"><CheckCircle size={16}/>{t('lab.12thermomechanics_correctb98mt')}</p>}
    {maglevStatus === 'incorrect' && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><XCircle size={16}/>{t('lab.12thermomechanics_tryagainevaluatemgafirstthensolvefo')}</p>}
    </div>
   ) : (
    <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.12thermomechanics_chandrasekharlimit')}</h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">
     
                                          {t('lab.p12thermomechanics_subrahmanyan_chandrasekhar_det')}
                                         </p>
    <div className="flex gap-2">
     <input 
     type="text" 
     value={wdAns}
     onChange={(e) => setWdAns(e.target.value)}
     placeholder={t('lab.p12thermomechanics_t_lab_12thermomechanics_eg144')}
     className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
     />
     <button 
     onClick={checkWd}
     className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors font-medium dark:text-white dark:text-white dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40"
     >
     
                                              {t('lab.p12thermomechanics_check')}
                                              </button>
    </div>
    {wdStatus === 'correct' && <p className="text-emerald-600 text-sm mt-2 flex items-center gap-1"><CheckCircle size={16}/>{t('lab.12thermomechanics_correctlimitis144solarmasses')}</p>}
    {wdStatus === 'incorrect' && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><XCircle size={16}/>{t('lab.12thermomechanics_tryagainobservethesimulatorcarefull')}</p>}
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
