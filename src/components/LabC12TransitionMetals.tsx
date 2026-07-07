import { useState } from 'react';
import { Flame, Activity, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface MetalComplex {
 metal: string;
 ligand: string;
 name: string;
 color: string;
 lambda: number; // nm
 spin: string;
}

const complexes: MetalComplex[] = [
 { metal: 'Cu²⁺', ligand: 'H₂O', name: '[Cu(H₂O)₆]²⁺', color: '#93c5fd', lambda: 800, spin: 'High Spin' },
 { metal: 'Cu²⁺', ligand: 'NH₃', name: '[Cu(NH₃)₄(H₂O)₂]²⁺', color: '#1e3a8a', lambda: 600, spin: 'High Spin' },
 { metal: 'Co²⁺', ligand: 'H₂O', name: '[Co(H₂O)₆]²⁺', color: '#fca5a5', lambda: 510, spin: 'High Spin' },
 { metal: 'Co²⁺', ligand: 'Cl⁻', name: '[CoCl₄]²⁻', color: '#3b82f6', lambda: 680, spin: 'High Spin (Tetrahedral)' },
 { metal: 'Fe³⁺', ligand: 'H₂O', name: '[Fe(H₂O)₆]³⁺', color: '#fef08a', lambda: 400, spin: 'High Spin' },
 { metal: 'Fe³⁺', ligand: 'CN⁻', name: '[Fe(CN)₆]³⁻', color: '#991b1b', lambda: 350, spin: 'Low Spin' },
];

export default function LabC12TransitionMetals({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [complexIdx, setComplexIdx] = useState<number>(0);
 const [ansEnergy, setAnsEnergy] = useState<string>('');
 const [feedback, setFeedback] = useState<string>('');
 
 const activeComplex = complexes[complexIdx];

 const checkAnswer = () => {
 // E = hc/lambda -> E in Joules
 const E = (6.626e-34 * 3.0e8) / (activeComplex.lambda * 1e-9);
 // multiply by Na / 1000 for kJ/mol
 const kJmol = (E * 6.022e23) / 1000;
 
 const val = parseFloat(ansEnergy);
 if (!isNaN(val) && Math.abs(val - kJmol) < Math.abs(kJmol * 0.05)) {
  setFeedback(`Correct! The crystal field splitting energy (Δ) is ~${kJmol.toFixed(0)} kJ/mol.`);
 } else {
  setFeedback(`Incorrect. Hint: E = (hc/λ)*Na / 1000. Expected around ${kJmol.toFixed(0)} kJ/mol.`);
 }
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.c12transitionmetals_virtual_lab_transition_metals_')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.c12transitionmetals_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#121212] lg:dark:bg-[#121212] lg:dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.c12transitionmetals_lab')}</button>
  </div>
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:overflow-visible">
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-teal-900 mb-4 flex items-center">
   <Flame className="mr-2" />  {t('lab.c12transitionmetals_theory')}
                        </h2>
   <div className="prose text-sm text-slate-700 dark:text-[#ffffff]">
   <p><strong>{t('lab.c12transitionmetals_transition_metals')}</strong>  {t('lab.c12transitionmetals_form_complex_ions_with_ligands')}</p>
   
   <h3 className="text-md font-semibold mt-4">{t('lab.c12transitionmetals_crystal_field_theory_colors')}</h3>
   <p>{t('lab.c12transitionmetals_the_energy_gap_between_split_d')}</p>
   <div className={`bg-slate-100 dark:bg-[#121212] p-3 rounded text-center font-mono my-2 flex-col `}>
    
                             {t('lab.c12transitionmetals_e_hc')}
                            </div>
   <p>{t('lab.c12transitionmetals_the_observed_color_is_the')} <strong>{t('lab.c12transitionmetals_complementary_color')}</strong>  {t('lab.c12transitionmetals_of_the_absorbed_light')}</p>
   
   <h3 className="text-md font-semibold mt-4">{t('lab.c12transitionmetals_spectrochemical_series')}</h3>
   <p>{t('lab.c12transitionmetals_ligands_split_d_orbitals_by_di')}<br/>
    
                             {t('lab.c12transitionmetals_i_lt_cl_lt_f_lt_oh_lt_h_o_lt_n')}
                            </p>

   <h3 className="text-md font-semibold mt-4">{t('lab.c12transitionmetals_industrial_catalysis')}</h3>
   <ul className="list-disc pl-5">
    <li><strong>{t('lab.c12transitionmetals_haber_process_nh')}</strong>  {t('lab.c12transitionmetals_uses_iron_fe_catalyst')}</li>
    <li><strong>{t('lab.c12transitionmetals_contact_process_h_so')}</strong>  {t('lab.c12transitionmetals_uses_vanadium_v_oxide_v_o')}</li>
   </ul>
   <p>{t('lab.c12transitionmetals_transition_metals_make_good_ca')}</p>
   </div>
  </div>

  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex-col items-center border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-teal-900 mb-4">{t('lab.c12transitionmetals_ligand_swapping_simulator')}</h2>
   
   <select 
   className={`w-full max-w-sm p-2 border rounded bg-slate-50 dark:bg-[#121212] mb-6 font-mono font-bold text-center flex-col `}
   value={complexIdx}
   onChange={e => setComplexIdx(parseInt(e.target.value))}
   >
   {complexes.map((c, i) => <option key={i} value={i}>{c.name}</option>)}
   </select>

   <div className="w-full flex gap-4">
   <div className="w-1/2 flex flex-col items-center">
    <h3 className="text-sm font-semibold mb-2">{t('lab.c12transitionmetals_solution_color')}</h3>
    <div 
    className="w-24 h-32 rounded-b-xl border-x-4 border-b-4 border-slate-300 dark:border-[#1c1b1b] relative overflow-hidden transition-colors duration-500"
    style={{ backgroundColor: activeComplex.color }}
    >
    <div className={`absolute top-0 w-full h-4 bg-slate-50 dark:bg-[#121212]/30 flex-col `}></div>
    </div>
    <p className="text-xs text-slate-500 dark:text-[#71717a] mt-2">{t('lab.c12transitionmetals_absorbs')}{activeComplex.lambda} nm</p>
   </div>
   
   <div className="w-1/2 flex flex-col items-center">
    <h3 className="text-sm font-semibold mb-2">{t('lab.c12transitionmetals_d_orbital_splitting')}</h3>
    <div className="w-full h-32 bg-slate-100 dark:bg-[#121212] rounded border border-slate-200 dark:border-[#1c1b1b] relative flex items-center justify-center p-2">
    {/* Render Octahedral Splitting Diagram symbolically */}
    <div className="flex flex-col items-center w-full h-full justify-around">
     {/* eg level */}
     <div className="flex gap-2 flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex">
     <div className="w-6 h-6 border-b-2 border-[#1c1b1b] dark:border-[#1c1b1b] relative">
      <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px]">↑</span>
     </div>
     <div className="w-6 h-6 border-b-2 border-[#1c1b1b] dark:border-[#1c1b1b] relative">
      {activeComplex.spin === 'High Spin' && <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px]">↑</span>}
     </div>
     </div>
     
     {/* Delta E arrow */}
     <div className="h-8 border-l-2 border-dashed border-teal-500 flex items-center">
     <span className="ml-1 text-xs text-teal-700 font-bold">Δ</span>
     </div>

     {/* t2g level */}
     <div className="flex gap-2 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex lg:flex-1 overflow-y-auto lg:overflow-visible rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
     <div className="w-6 h-6 border-b-2 border-[#1c1b1b] dark:border-[#1c1b1b] relative">
      <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px]">↑↓</span>
     </div>
     <div className="w-6 h-6 border-b-2 border-[#1c1b1b] dark:border-[#1c1b1b] relative">
      <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px]">↑</span>
     </div>
     <div className="w-6 h-6 border-b-2 border-[#1c1b1b] dark:border-[#1c1b1b] relative">
      <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px]">↑</span>
     </div>
     </div>
    </div>
    </div>
    <p className="text-xs text-slate-500 dark:text-[#71717a] mt-2">{activeComplex.spin}</p>
   </div>
   </div>
  </div>

  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-teal-900 mb-4 flex items-center">
   <Activity className="mr-2" />  {t('lab.c12transitionmetals_assessment')}
                        </h2>
   
   <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 flex-1">
   <h3 className="font-semibold text-teal-900 mb-2">{t('lab.c12transitionmetals_calculate_crystal_field_splitt')}</h3>
   <p className="text-sm text-teal-800 mb-3">
    
                             {t('lab.c12transitionmetals_the_complex')} <strong>{activeComplex.name}</strong>  {t('lab.c12transitionmetals_absorbs_light_at')} <strong>{activeComplex.lambda} nm</strong>.
    <br/><br/>
    
                             {t('lab.c12transitionmetals_calculate_the_crystal_field_sp')} <strong>{t('lab.c12transitionmetals_kj_mol')}</strong>.
    <br/><br/>
    <span className="text-xs text-slate-500 dark:text-[#71717a]">
    
                                 {t('lab.c12transitionmetals_h_6_626_10_j_s')} <br/>
    
                                 {t('lab.c12transitionmetals_c_3_00_10_m_s')} <br/>
    
                                 {t('lab.c12transitionmetals_n_a_6_022_10_mol')}
                                 </span>
   </p>
   <input 
    type="text" 
    placeholder={t('lab.c12transitionmetals_enter_value_in_kj_mol')} 
    value={ansEnergy}
    onChange={e => setAnsEnergy(e.target.value)}
    className="w-full p-2 border border-teal-200 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3"
   />
   <button 
    onClick={checkAnswer}
    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded transition-colors flex items-center justify-center dark:text-white dark:text-white dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-teal-500/40"
   >
    <CheckCircle className="mr-2" size={18} />  {t('lab.c12transitionmetals_check_answer')}
                            </button>
   {feedback && (
    <p className={`mt-3 text-sm font-semibold p-2 rounded ${feedback.includes('Correct') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
    {feedback}
    </p>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
