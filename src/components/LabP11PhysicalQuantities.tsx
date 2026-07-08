import { useState } from 'react';
import {Activity, Calculator, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from '../i18n';
import { useLab } from '../store';

interface Point { x: number; y: number }

export default function LabP11PhysicalQuantities({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const { setLabScore } = useLab();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [shots, setShots] = useState<Point[]>([]);
 const [meanGuess, setMeanGuess] = useState('');
 const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);
 const [lastMean, setLastMean] = useState(0);

 const handleShoot = (e: React.MouseEvent<SVGSVGElement>) => {
 const rect = e.currentTarget.getBoundingClientRect();
 const x = e.clientX - rect.left - 150;
 const y = e.clientY - rect.top - 150;
 setShots([...shots, { x, y }]);
 };

 const clearShots = () => {
 setShots([]);
 setFeedbackType(null);
 };

 const checkAnswer = () => {
 if (shots.length === 0) return;
 const meanX = shots.reduce((acc, s) => acc + s.x, 0) / shots.length;
 const guess = parseFloat(meanGuess);
 setLastMean(meanX);
 if (Math.abs(meanX - guess) < 2) {
  setFeedbackType('correct');
 } else {
  setFeedbackType('incorrect');
    setLabScore(feedbackType === 'correct' ? 100 : 0, 100);
 }
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.p11_quantities_title')} />

  
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
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 lg:overflow-y-auto flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
   <Activity className="w-5 h-5 text-indigo-500" />
   {t('lab.p11_quantities_theory_title')}
   </h2>
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa]" dangerouslySetInnerHTML={{ __html: t('lab.p11_quantities_theory_p1') }} />
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa]" dangerouslySetInnerHTML={{ __html: t('lab.p11_quantities_theory_p2') }} />
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa]">
   <p>{t('lab.p11_quantities_theory_p3')}</p>
   <ul className="list-disc pl-4 space-y-1 mt-2">
    <li>{t('lab.p11_quantities_theory_li1')}</li>
    <li>{t('lab.p11_quantities_theory_li2')}</li>
    <li>{t('lab.p11_quantities_theory_li3')}</li>
   </ul>
   </div>
  </div>

  {/* Simulator */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col items-center '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4">{t('lab.p11_quantities_sim_title')}</h2>
   <svg width="300" height="300" className={`bg-slate-100 dark:bg-[#121212] rounded-full border border-slate-300 dark:border-[#1c1b1b] cursor-crosshair shadow-inner flex-col `} onClick={handleShoot}>
   {/*rings */}
   <circle cx="150" cy="150" r="140" fill="white" stroke="#cbd5e1" strokeWidth="2" />
   <circle cx="150" cy="150" r="105" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
   <circle cx="150" cy="150" r="70" fill="#bfdbfe" stroke="#60a5fa" strokeWidth="2" />
   <circle cx="150" cy="150" r="35" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
   
   {/* Axes */}
   <line x1="150" y1="0" x2="150" y2="300" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
   <line x1="0" y1="150" x2="300" y2="150" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />

   {/* Shots */}
   {shots.map((s, i) => (
    <circle key={i} cx={150 + s.x} cy={150 + s.y} r="5" fill="#1e293b" />
   ))}
   </svg>
   <div className="mt-4 flex gap-3 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <button onClick={clearShots} className={`px-4 py-2 bg-slate-200 dark:bg-[#121212] hover:bg-slate-300 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] rounded-lg font-medium transition-colors flex-col `}>
    {t('lab.p11_quantities_clear_btn')}
   </button>
   </div>
  </div>

  {/* Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 lg:overflow-y-auto flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
   <Calculator className="w-5 h-5 text-emerald-500" />
   {t('lab.p11_quantities_assess_title')}
   </h2>
   
   <div className={`mb-4 max-h-48 lg:overflow-y-auto border border-slate-200 dark:border-[#1c1b1b] rounded p-2 bg-slate-50 dark:bg-[#121212] flex-col `}>
   <table className="w-full text-sm text-left">
    <thead>
    <tr className="border-b border-slate-300 dark:border-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa]">
     <th className="pb-1 px-2">{t('lab.p11_quantities_table_shot')}</th>
     <th className="pb-1 px-2">{t('lab.p11_quantities_table_x')}</th>
     <th className="pb-1 px-2">{t('lab.p11_quantities_table_y')}</th>
    </tr>
    </thead>
    <tbody>
    {shots.map((s, i) => (
     <tr key={i} className="border-b border-slate-100 last:border-0">
     <td className="py-1 px-2">{i + 1}</td>
     <td className="py-1 px-2">{s.x.toFixed(1)}</td>
     <td className="py-1 px-2">{s.y.toFixed(1)}</td>
     </tr>
    ))}
    {shots.length === 0 && <tr><td colSpan={3} className="py-2 px-2 text-slate-400 italic">{t('lab.p11_quantities_no_data')}</td></tr>}
    </tbody>
   </table>
   </div>

   <div className="space-y-4">
   <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] mb-1">
    {t('lab.p11_quantities_mean_label')}
    </label>
    <input
    type="number"
    value={meanGuess}
    onChange={(e) => setMeanGuess(e.target.value)}
    placeholder={t('lab.p11_quantities_placeholder')}
    className="w-full px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
   </div>
   
   <button 
    onClick={checkAnswer}
    disabled={shots.length === 0}
    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
   >
    <CheckCircle className="w-4 h-4" /> {t('lab.p11_quantities_check_btn')}
   </button>

   {feedbackType === 'correct' && (
    <div className="p-3 rounded-lg text-sm flex items-start gap-2 bg-green-50 text-green-800 border border-green-200">
    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
    <span>{t('lab.p11_quantities_correct_fb')}</span>
    </div>
   )}
   {feedbackType === 'incorrect' && (
    <div className="p-3 rounded-lg text-sm flex items-start gap-2 bg-red-50 text-red-800 border border-red-200">
    <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
    <span>{t('lab.p11_quantities_incorrect_fb', { meanX: lastMean.toFixed(1) })}</span>
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
