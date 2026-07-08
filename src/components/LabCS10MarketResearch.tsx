import { useState, useEffect } from 'react';
import { CheckCircle, Calculator, BarChart2 } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

interface Props {
 onExit?: () => void;
}

export default function LabCS10MarketResearch({ onExit }: Props) {

const { recordLabData } = useLab();
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 // Middle Column State: CAC Calculator
 const [marketingSpend, setMarketingSpend] = useState<number>(500);
 const [salesSpend, setSalesSpend] = useState<number>(300);
 const [newCustomers, setNewCustomers] = useState<number>(20);
 
 const cac = newCustomers > 0 ? ((marketingSpend + salesSpend) / newCustomers).toFixed(2) : '0.00';

 // Middle Column State: USP Matrix
 const [ownProduct, setOwnProduct] = useState({ x: 50, y: 50 }); // 0-100 for Low-High Price, Low-High Quality

 // Right Column State: Data Logging & Assessment
 const [logs, setLogs] = useState<{ id: number; mkt: number; sales: number; cust: number; cac: string }[]>([]);
 
 // Assessment
 const [assessmentScenario, setAssessmentScenario] = useState({ mkt: 1200, sales: 800, cust: 40 });
 const [userAnswer, setUserAnswer] = useState<string>('');
 const [assessmentFeedback, setAssessmentFeedback] = useState<string | null>(null);

 useEffect(() => {
 setAssessmentScenario({
  mkt: Math.floor(Math.random() * 2000) + 500,
  sales: Math.floor(Math.random() * 1500) + 300,
  cust: Math.floor(Math.random() * 80) + 10
 });
 }, []);

 const handleRecordData = () => {
 const newId = logs.length + 1;
 setLogs(prev => [...prev, {
  id: newId,
  mkt: marketingSpend,
  sales: salesSpend,
  cust: newCustomers,
  cac
 }]);
   recordLabData({ timestamp: Date.now(), 
  id: newId,
  mkt: marketingSpend,
  sales: salesSpend,
  cust: newCustomers,
  cac
 });
 };

 const checkAnswer = () => {
 const correctCac = (assessmentScenario.mkt + assessmentScenario.sales) / assessmentScenario.cust;
 if (Math.abs(parseFloat(userAnswer) - correctCac) < 0.1) {
  setAssessmentFeedback('Correct! Great job calculating CAC.');
 } else {
  setAssessmentFeedback(`Incorrect. The correct CAC is $${correctCac.toFixed(2)}.`);
 }
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.cs10marketresearch_lab_market_research_cac')} subtitle={t('lab.subtitle_grade_computer_science')} variant="blue" />

  {/* Main 3-Column Grid */}
  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.cs10marketresearch_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.cs10marketresearch_lab')}</button>
  </div>
  <main className="lg:flex-1 p-4 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:overflow-visible">
  
  {/* Column 1: Theory */}
  <section className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
   <BarChart2 className="text-blue-600" />  {t('lab.cs10marketresearch_theory_setup')}
                        </h2>
   
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa]">
   <h3 className="text-md font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.cs10marketresearch_customer_acquisition_cost_cac')}</h3>
   <p>
    
                             {t('lab.cs10marketresearch_cac_is_the_total_cost_of_acqui')}
                            </p>
   <div className={`bg-blue-50 p-3 rounded-md text-blue-800 font-mono text-xs my-2 dark:bg-teal-950/20 dark:border-teal-900 dark:text-[#ffffff] flex-col `}>
    
                             {t('lab.cs10marketresearch_cac_marketing_spend_sales_spen')}
                            </div>
   
   <h3 className="text-md font-semibold text-slate-700 dark:text-[#ffffff] mt-4">{t('lab.cs10marketresearch_unique_selling_proposition_usp')}</h3>
   <p>
    
                             {t('lab.cs10marketresearch_a_usp_is_what_makes_your_produ')}
                            </p>
   </div>
  </section>

  {/* Column 2: Simulation */}
  <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col gap-6 '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
   <Calculator className="text-blue-600" />  {t('lab.cs10marketresearch_interactive_builders')}
                        </h2>
   
   {/* CAC Calculator */}
   <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] mb-4">{t('lab.cs10marketresearch_cac_calculator')}</h3>
   <div className="space-y-4">
    <div>
    <label className="flex justify-between text-sm font-medium text-slate-600 dark:text-[#a1a1aa] mb-1">
     <span>{t('lab.cs10marketresearch_marketing_spend')}</span>
     <span>${marketingSpend}</span>
    </label>
    <input type="range" min="0" max="5000" step="100" value={marketingSpend} onChange={(e) => setMarketingSpend(Number(e.target.value))} className="w-full accent-blue-600" />
    </div>
    <div>
    <label className="flex justify-between text-sm font-medium text-slate-600 dark:text-[#a1a1aa] mb-1">
     <span>{t('lab.cs10marketresearch_sales_spend')}</span>
     <span>${salesSpend}</span>
    </label>
    <input type="range" min="0" max="5000" step="100" value={salesSpend} onChange={(e) => setSalesSpend(Number(e.target.value))} className="w-full accent-blue-600" />
    </div>
    <div>
    <label className="flex justify-between text-sm font-medium text-slate-600 dark:text-[#a1a1aa] mb-1">
     <span>{t('lab.cs10marketresearch_new_customers')}</span>
     <span>{newCustomers}</span>
    </label>
    <input type="range" min="1" max="200" step="1" value={newCustomers} onChange={(e) => setNewCustomers(Number(e.target.value))} className="w-full accent-blue-600" />
    </div>
   </div>
   <div className={`mt-4 flex items-center justify-between p-3 bg-blue-100 rounded-md border border-blue-200 flex-col `}>
    <span className="font-semibold text-blue-900 dark:text-[#ffffff]">{t('lab.cs10marketresearch_current_cac')}</span>
    <span className="text-xl font-bold text-blue-700">${cac}</span>
   </div>
   <button onClick={handleRecordData} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-semibold dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40">
    
                             {t('lab.cs10marketresearch_record_data')}
                            </button>
   </div>

   {/* USP Matrix Builder */}
   <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-1 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.cs10marketresearch_usp_matrix_builder')}</h3>
   <p className="text-xs text-slate-500 dark:text-[#71717a] mb-4">{t('lab.cs10marketresearch_click_on_the_grid_to_position_')}</p>
   <div 
    className="relative w-full aspect-square bg-slate-50 dark:bg-[#121212] border-2 border-slate-300 dark:border-[#1c1b1b] cursor-crosshair rounded-md overflow-hidden"
    onClick={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOwnProduct({ x, y });
    }}
   >
    {/* Axes lines */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="w-full h-px bg-slate-300 dark:bg-[#121212]" />
    </div>
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="h-full w-px bg-slate-300 dark:bg-[#121212]" />
    </div>
    
    {/* Labels */}
    <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 pointer-events-none">{t('lab.cs10marketresearch_high_quality')}</span>
    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 pointer-events-none">{t('lab.cs10marketresearch_low_quality')}</span>
    <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 pointer-events-none -rotate-90 origin-left">{t('lab.cs10marketresearch_low_price')}</span>
    <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 pointer-events-none rotate-90 origin-right">{t('lab.cs10marketresearch_high_price')}</span>

    {/* Competitors (Static) */}
    <div className="absolute w-4 h-4 bg-red-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" style={{ left: '80%', top: '20%' }} title={t('lab.cs10marketresearch_competitor_a')} />
    <div className="absolute w-4 h-4 bg-red-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" style={{ left: '30%', top: '70%' }} title={t('lab.cs10marketresearch_competitor_b')} />

    {/* Own Product */}
    <div 
    className="absolute w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-200"
    style={{ left: `${ownProduct.x}%`, top: `${ownProduct.y}%` }}
    >
    <span className="text-[10px] text-white font-bold">{t('lab.cs10marketresearch_you')}</span>
    </div>
   </div>
   <div className="mt-2 text-xs text-center text-slate-600 dark:text-[#a1a1aa]">
    
                             {t('lab.cs10marketresearch_your_product_price')} {ownProduct.x.toFixed(0)}{t('lab.cs10marketresearch_quality')} {(100 - ownProduct.y).toFixed(0)}%
   </div>
   </div>
  </section>

  {/* Column 3: Analysis */}
  <section className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-6 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
   <CheckCircle className="text-blue-600" />  {t('lab.cs10marketresearch_data_assessment')}
                        </h2>

   <div className="flex-1 overflow-auto">
   <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] mb-2 text-sm">{t('lab.cs10marketresearch_data_log')}</h3>
   <table className="w-full text-xs text-left text-slate-600 dark:text-[#a1a1aa]">
    <thead className="bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] uppercase">
    <tr>
     <th className="p-2">{t('lab.cs10marketresearch_trial')}</th>
     <th className="p-2">{t('lab.cs10marketresearch_mkt')}</th>
     <th className="p-2">{t('lab.cs10marketresearch_sales')}</th>
     <th className="p-2">{t('lab.cs10marketresearch_cust')}</th>
     <th className="p-2">{t('lab.cs10marketresearch_cac')}</th>
    </tr>
    </thead>
    <tbody>
    {logs.length === 0 ? (
     <tr><td colSpan={5} className="p-2 text-center text-slate-400">{t('lab.cs10marketresearch_no_data_recorded_yet')}</td></tr>
    ) : (
     logs.map((log) => (
     <tr key={log.id} className="border-b border-slate-100">
      <td className="p-2">{log.id}</td>
      <td className="p-2">{log.mkt}</td>
      <td className="p-2">{log.sales}</td>
      <td className="p-2">{log.cust}</td>
      <td className="p-2 font-bold">{log.cac}</td>
     </tr>
     ))
    )}
    </tbody>
   </table>
   </div>

   <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.cs10marketresearch_knowledge_check')}</h3>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
    
                             {t('lab.cs10marketresearch_your_startup_spent')} <strong>${assessmentScenario.mkt}</strong>  {t('lab.cs10marketresearch_on_marketing_and')} <strong>${assessmentScenario.sales}</strong>  {t('lab.cs10marketresearch_on_sales_this_month_you_acquir')} <strong>{assessmentScenario.cust}</strong>  {t('lab.cs10marketresearch_new_customers_what_is_your_cac')}
                            </p>
   <div className="flex gap-2">
    <div className="relative flex-1">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-[#71717a]">$</span>
    <input 
     type="number" 
     value={userAnswer}
     onChange={(e) => setUserAnswer(e.target.value)}
     className="w-full pl-7 pr-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
     placeholder="0.00"
    />
    </div>
    <button 
    onClick={checkAnswer}
    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-semibold dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"
    >
    
                                 {t('lab.cs10marketresearch_check')}
                                 </button>
   </div>
   {assessmentFeedback && (
    <div className={`mt-3 p-2 rounded-md text-sm ${assessmentFeedback.startsWith('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
    {assessmentFeedback}
    </div>
   )}
   </div>
  </section>

  </main>
 </div>
 );
}
