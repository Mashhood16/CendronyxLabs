import { useState, useEffect } from 'react';
import { Database, Calculator, Box, Target } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

export default function LabC11MolecularBonding({ onExit }: { onExit?: () => void }) {
 const { setLabScore } = useLab();
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [centralAtom, setCentralAtom] = useState('C');
 const [peripheralCount, setPeripheralCount] = useState(4);
 const [lonePairs, setLonePairs] = useState(0);

 const getShape = () => {
 const stericNum = peripheralCount + lonePairs;
 if (stericNum === 2) return 'Linear';
 if (stericNum === 3 && lonePairs === 0) return 'Trigonal Planar';
 if (stericNum === 3 && lonePairs === 1) return 'Bent';
 if (stericNum === 4 && lonePairs === 0) return 'Tetrahedral';
 if (stericNum === 4 && lonePairs === 1) return 'Trigonal Pyramidal';
 if (stericNum === 4 && lonePairs === 2) return 'Bent';
 return 'Complex/Unknown';
 };

 const [logs, setLogs] = useState<{molecule: string, shape: string}[]>([]);
 const logData = () => {
 setLogs([...logs, { molecule: `${centralAtom}X${peripheralCount}E${lonePairs}`, shape: getShape() }]);
 };

 // Assessment
 const molecules = [
 { name: 'CH4', shape: 'Tetrahedral' },
 { name: 'NH3', shape: 'Trigonal Pyramidal' },
 { name: 'H2O', shape: 'Bent' },
 { name: 'CO2', shape: 'Linear' },
 { name: 'BF3', shape: 'Trigonal Planar' }
 ];
 const [targetMolecule, setTargetMolecule] = useState<{name: string, shape: string} | null>(null);
 const [answerShape, setAnswerShape] = useState('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 useEffect(() => {
 const rand = molecules[Math.floor(Math.random() * molecules.length)];
 setTargetMolecule(rand);
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 const checkAnswer = () => {
 if (targetMolecule && answerShape.toLowerCase() === targetMolecule.shape.toLowerCase()) {
 setIsCorrect(true);
 } else {
 setIsCorrect(false);
 setLabScore(isCorrect ? 100 : 0, 100);
 }
 };

 return (
 <div className="flex flex-col bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.c11molecularbonding_vsepr_theory_molecular_bonding')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.c11molecularbonding_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.c11molecularbonding_lab')}</button>
 </div>
 <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 min-h-0 lg:overflow-hidden">
 
 {/* Column 1: Theory */}
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex-col gap-6 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <div>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2 flex items-center gap-2">
 <Box className="w-5 h-5 text-fuchsia-500" />
 
 {t('lab.c11molecularbonding_vsepr_theory_setup')}
 </h2>
 <p className="text-slate-600 dark:text-[#a1a1aa] text-sm leading-relaxed mb-4">
 
 {t('lab.c11molecularbonding_valence_shell_electron_pair_re')}
 </p>
 <p className="text-slate-600 dark:text-[#a1a1aa] text-sm leading-relaxed mb-4">
 
 {t('lab.c11molecularbonding_by_controlling_the_number_of_b')}
 </p>
 </div>

 <div className={`flex-1 bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] mb-4">{t('lab.c11molecularbonding_molecular_builder')}</h3>
 
 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.c11molecularbonding_central_atom_symbol')}</label>
 <input 
 type="text" maxLength={2} 
 value={centralAtom} onChange={(e) => setCentralAtom(e.target.value)}
 className="w-full mb-4 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg uppercase"
 />

 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.c11molecularbonding_peripheral_atoms')} {peripheralCount}</label>
 <input 
 type="range" min="1" max="6" step="1" 
 value={peripheralCount} onChange={(e) => setPeripheralCount(parseInt(e.target.value))}
 className="w-full mb-4 accent-fuchsia-600"
 />

 <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.c11molecularbonding_lone_pairs')} {lonePairs}</label>
 <input 
 type="range" min="0" max="3" step="1" 
 value={lonePairs} onChange={(e) => setLonePairs(parseInt(e.target.value))}
 className="w-full mb-6 accent-fuchsia-600"
 />

 <div className={`text-center p-3 bg-fuchsia-100 rounded-lg flex-col `}>
 <span className="text-sm text-fuchsia-800 font-semibold">{t('lab.c11molecularbonding_predicted_geometry')}</span>
 <div className="text-lg font-bold text-fuchsia-900">{getShape()}</div>
 </div>
 </div>
 </div>

 {/* Column 2: 3D Visualizer Simulator */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col items-center justify-center '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] w-full mb-4">{t('lab.c11molecularbonding_3d_molecular_projection')}</h2>
 
 <svg viewBox="0 0 400 400" className="w-full h-80 bg-[#000000] dark:bg-[#121212] rounded-lg shadow-inner">
 <circle cx="200" cy="200" r="30" fill="#f43f5e" />
 <text x="200" y="205" className="text-sm fill-white font-bold" textAnchor="middle">{centralAtom || '?'}</text>

 {Array.from({ length: peripheralCount }).map((_, i) => {
 const angle = (i * (360 / peripheralCount)) * (Math.PI / 180);
 const radius = 100;
 const cx = 200 + radius * Math.cos(angle);
 const cy = 200 + radius * Math.sin(angle);
 return (
 <g key={`p-${i}`} className="transition-all duration-500">
 <line x1="200" y1="200" x2={cx} y2={cy} stroke="#cbd5e1" strokeWidth="4" />
 <circle cx={cx} cy={cy} r="20" fill="#3b82f6" />
 <text x={cx} y={cy+5} className="text-xs fill-white font-bold" textAnchor="middle">X</text>
 </g>
 );
 })}
 
 {Array.from({ length: lonePairs }).map((_, i) => {
 const totalPositions = peripheralCount + lonePairs;
 const positionIndex = peripheralCount + i;
 const angle = (positionIndex * (360 / Math.max(1, totalPositions))) * (Math.PI / 180);
 const radius = 80;
 const cx = 200 + radius * Math.cos(angle);
 const cy = 200 + radius * Math.sin(angle);
 return (
 <g key={`lp-${i}`} className="transition-all duration-500 animate-pulse">
 <path d={`M 200 200 Q ${cx} ${cy-30} ${cx} ${cy} Q ${cx} ${cy+30} 200 200`} fill="#fde047" opacity="0.4" />
 <circle cx={cx} cy={cy} r="6" fill="#fbbf24" />
 <circle cx={cx + (cx > 200 ? 12 : -12)} cy={cy} r="6" fill="#fbbf24" />
 </g>
 );
 })}
 </svg>

 <button onClick={logData} className={`mt-6 px-4 py-2 bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-800 rounded-lg font-semibold flex items-center gap-2 transition-colors `}>
 <Database className="w-4 h-4" /> {t('lab.c11molecularbonding_save_molecular_profile')}
 </button>
 </div>

 {/* Column 3: Analysis */}
 <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col gap-6 '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <div className="flex-1">
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
 <Database className="w-5 h-5 text-emerald-500" />
 
 {t('lab.c11molecularbonding_molecule_library')}
 </h2>
 <div className="lg:overflow-y-auto max-h-48 border border-slate-200 dark:border-[#1c1b1b] rounded-lg">
 <table className="w-full text-sm text-left">
 <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b] text-slate-700 dark:text-[#ffffff] sticky top-0">
 <tr>
 <th className="px-3 py-2">{t('lab.c11molecularbonding_configuration')}</th>
 <th className="px-3 py-2">{t('lab.c11molecularbonding_geometry')}</th>
 </tr>
 </thead>
 <tbody>
 {logs.length === 0 ? (
 <tr><td colSpan={2} className="px-3 py-4 text-center text-slate-500 dark:text-[#71717a] italic">{t('lab.c11molecularbonding_no_molecules_saved')}</td></tr>
 ) : (
 logs.map((l, i) => (
 <tr key={i} className="border-b border-slate-100">
 <td className="px-3 py-2 font-mono">{l.molecule}</td>
 <td className="px-3 py-2">{l.shape}</td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>

 <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-2 flex items-center gap-2">
 <Calculator className="w-5 h-5 text-rose-500" />
 
 {t('lab.c11molecularbonding_geometry_assessment')}
 </h2>
 {targetMolecule && (
 <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
 
 {t('lab.c11molecularbonding_what_is_the_vsepr_geometry_of')} <strong>{targetMolecule.name}</strong>{t('lab.c11molecularbonding_use_the_builder_to_figure_out_')}
 </p>
 )}
 <div className="flex gap-2">
 <select 
 value={answerShape} onChange={(e) => setAnswerShape(e.target.value)}
 className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50 dark:bg-[#121212]"
 >
 <option value="">{t('lab.c11molecularbonding_select_shape')}</option>
 <option value="Linear">{t('lab.c11molecularbonding_linear')}</option>
 <option value="Bent">{t('lab.c11molecularbonding_bent')}</option>
 <option value="Trigonal Planar">{t('lab.c11molecularbonding_trigonal_planar')}</option>
 <option value="Trigonal Pyramidal">{t('lab.c11molecularbonding_trigonal_pyramidal')}</option>
 <option value="Tetrahedral">{t('lab.c11molecularbonding_tetrahedral')}</option>
 </select>
 <button onClick={checkAnswer} className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors dark:text-white dark:text-white dark:bg-rose-500 dark:hover:bg-rose-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-rose-500/40">
 <Target className="w-4 h-4" /> {t('lab.c11molecularbonding_verify')}
 </button>
 </div>
 {isCorrect === true && <p className="text-emerald-600 text-sm font-bold mt-2">{t('lab.c11molecularbonding_correct_geometry_identified')}</p>}
 {isCorrect === false && <p className="text-red-500 text-sm font-bold mt-2">{t('lab.c11molecularbonding_incorrect_re_evaluate_the_elec')}</p>}
 </div>
 </div>

 </div>
 </div>
 );
}
