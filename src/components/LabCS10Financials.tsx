import { useState, useEffect } from 'react';
import { CheckCircle, DollarSign, LineChart } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface Props {
 onExit?: () => void;
}

export default function LabCS10Financials({ onExit }: Props) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 // Financial Inputs
 const [pricePerUnit, setPricePerUnit] = useState<number>(50);
 const [unitsSoldPerMonth, setUnitsSoldPerMonth] = useState<number>(100);
 const [fixedCosts, setFixedCosts] = useState<number>(2000);
 const [variableCostPerUnit, setVariableCostPerUnit] = useState<number>(20);

 // Computed values
 const monthlyRevenue = pricePerUnit * unitsSoldPerMonth;
 const monthlyVariableCosts = variableCostPerUnit * unitsSoldPerMonth;
 const totalMonthlyCosts = fixedCosts + monthlyVariableCosts;
 const monthlyProfit = monthlyRevenue - totalMonthlyCosts;
 const breakEvenUnits = pricePerUnit - variableCostPerUnit > 0 
 ? Math.ceil(fixedCosts / (pricePerUnit - variableCostPerUnit)) 
 : 0;

 // Chart Generation (12 months projection)
 const projectionData = Array.from({ length: 12 }).map((_, i) => {
 // Add a little realistic growth/noise if we wanted, but let's keep it simple fixed for 1st year
 // Actually, let's make units grow by 5% each month for more realism
 const monthUnits = Math.round(unitsSoldPerMonth * Math.pow(1.05, i));
 const rev = pricePerUnit * monthUnits;
 const cost = fixedCosts + (variableCostPerUnit * monthUnits);
 const prof = rev - cost;
 return { month: i + 1, rev, cost, prof, units: monthUnits };
 });

 const maxVal = Math.max(...projectionData.map(d => Math.max(d.rev, d.cost))) * 1.1 || 1;
 const minVal = Math.min(0, ...projectionData.map(d => d.prof));
 const graphRange = maxVal - minVal;

 // Data Logging
 const [logs, setLogs] = useState<{ id: number; price: number; units: number; fixed: number; vc: number; profit: number }[]>([]);

 // Assessment
 const [assessmentScenario, setAssessmentScenario] = useState({ fc: 5000, p: 100, vc: 50 });
 const [userAnswer, setUserAnswer] = useState<string>('');
 const [assessmentFeedback, setAssessmentFeedback] = useState<string | null>(null);

 useEffect(() => {
 setAssessmentScenario({
  fc: (Math.floor(Math.random() * 50) + 10) * 100,
  p: Math.floor(Math.random() * 50) + 50,
  vc: Math.floor(Math.random() * 30) + 10
 });
 }, []);

 const handleRecordData = () => {
 const totalYear1Profit = projectionData.reduce((acc, curr) => acc + curr.prof, 0);
 setLogs(prev => [...prev, {
  id: prev.length + 1,
  price: pricePerUnit,
  units: unitsSoldPerMonth,
  fixed: fixedCosts,
  vc: variableCostPerUnit,
  profit: totalYear1Profit
 }]);
 };

 const checkAnswer = () => {
 const correctBreakEven = Math.ceil(assessmentScenario.fc / (assessmentScenario.p - assessmentScenario.vc));
 if (parseInt(userAnswer) === correctBreakEven) {
  setAssessmentFeedback('Correct! You calculated the break-even point perfectly.');
 } else {
  setAssessmentFeedback(`Incorrect. The correct break-even point is ${correctBreakEven} units.`);
 }
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.cs10financials_lab_financial_projections')} subtitle={t('lab.subtitle_grade_computer_science')} variant="emerald" />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.cs10financials_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.cs10financials_lab')}</button>
  </div>
  <main className="lg:flex-1 p-4 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:overflow-visible">
  
  {/* Column 1: Theory */}
  <section className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
   <DollarSign className="text-emerald-600" />  {t('lab.cs10financials_financial_concepts')}
                        </h2>
   
   <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] space-y-4">
   <div>
    <h3 className="text-md font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.cs10financials_revenue_expenses')}</h3>
    <p><strong>{t('lab.cs10financials_revenue')}</strong>  {t('lab.cs10financials_is_the_total_amount_of_money_b')} <strong>{t('lab.cs10financials_expenses')}</strong>  {t('lab.cs10financials_are_the_costs_required_to_oper')}</p>
    <div className={`bg-emerald-50 p-2 rounded-md text-emerald-800 font-mono text-xs mt-1 flex-col `}>
    
                                 {t('lab.cs10financials_profit_revenue_total_expenses')}
                                 </div>
   </div>
   
   <div>
    <h3 className="text-md font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.cs10financials_fixed_vs_variable_costs')}</h3>
    <p><strong>{t('lab.cs10financials_fixed_costs')}</strong>  {t('lab.cs10financials_e_g_rent_salaries_don_t_change')} <strong>{t('lab.cs10financials_variable_costs')}</strong>  {t('lab.cs10financials_e_g_raw_materials_increase_wit')}</p>
   </div>

   <div>
    <h3 className="text-md font-semibold text-slate-700 dark:text-[#ffffff]">{t('lab.cs10financials_break_even_point')}</h3>
    <p>{t('lab.cs10financials_the_point_where_total_revenue_')}</p>
    <div className={`bg-emerald-50 p-2 rounded-md text-emerald-800 font-mono text-xs mt-1 flex-col `}>
    
                                 {t('lab.cs10financials_break_even_units_fixed_costs_p')}
                                 </div>
   </div>
   </div>
  </section>

  {/* Column 2: Simulation */}
  <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col gap-6 '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
   <LineChart className="text-emerald-600" />  {t('lab.cs10financials_interactive_spreadsheet')}
                        </h2>
   
   <div className="grid grid-cols-2 gap-4">
   <div className={`bg-slate-50 dark:bg-[#121212] p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col `}>
    <label className="block text-xs font-semibold text-slate-600 dark:text-[#a1a1aa] mb-1">{t('lab.cs10financials_price_per_unit')}</label>
    <input type="number" min="0" value={pricePerUnit} onChange={(e) => setPricePerUnit(Number(e.target.value) || 0)} className="w-full px-2 py-1 border rounded" />
   </div>
   <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
    <label className="block text-xs font-semibold text-slate-600 dark:text-[#a1a1aa] mb-1">{t('lab.cs10financials_variable_cost_unit')}</label>
    <input type="number" min="0" value={variableCostPerUnit} onChange={(e) => setVariableCostPerUnit(Number(e.target.value) || 0)} className="w-full px-2 py-1 border rounded" />
   </div>
   <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
    <label className="block text-xs font-semibold text-slate-600 dark:text-[#a1a1aa] mb-1">{t('lab.cs10financials_fixed_costs_month')}</label>
    <input type="number" min="0" step="100" value={fixedCosts} onChange={(e) => setFixedCosts(Number(e.target.value) || 0)} className="w-full px-2 py-1 border rounded" />
   </div>
   <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded-lg border border-slate-200 dark:border-[#1c1b1b]">
    <label className="block text-xs font-semibold text-slate-600 dark:text-[#a1a1aa] mb-1">{t('lab.cs10financials_start_units_sold_month')}</label>
    <input type="number" min="0" value={unitsSoldPerMonth} onChange={(e) => setUnitsSoldPerMonth(Number(e.target.value) || 0)} className="w-full px-2 py-1 border rounded" />
   </div>
   </div>

   <div className="flex justify-between bg-emerald-100 p-3 rounded-lg border border-emerald-200">
   <div className="text-center">
    <div className="text-xs text-emerald-800 uppercase font-bold">{t('lab.cs10financials_monthly_profit')}</div>
    <div className={`text-lg font-black ${monthlyProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>${monthlyProfit.toFixed(0)}</div>
   </div>
   <div className="text-center">
    <div className="text-xs text-emerald-800 uppercase font-bold">{t('lab.cs10financials_break_even_units')}</div>
    <div className="text-lg font-black text-emerald-700">{breakEvenUnits}</div>
   </div>
   </div>

   <div className={`flex-1 bg-slate-50 dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-[#1c1b1b] p-2 relative `}>
   <h3 className="text-xs font-bold text-center text-slate-500 dark:text-[#71717a] mb-2">{t('lab.cs10financials_12_month_projection_5_monthly_')}</h3>
   <svg width="100%" height="100%" viewBox="0 0 120 100" preserveAspectRatio="none" className="overflow-visible px-2">
    {/* Zero line */}
    <line x1="0" y1={(maxVal / graphRange) * 100} x2="120" y2={(maxVal / graphRange) * 100} stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2" />
    
    {projectionData.map((d, i) => {
    const barWidth = 6;
    const x = i * 10 + 2;
    
    // Revenue Bar
    const revHeight = (d.rev / graphRange) * 100;
    const revY = ((maxVal - d.rev) / graphRange) * 100;
    
    // Cost Bar
    const costHeight = (d.cost / graphRange) * 100;
    const costY = ((maxVal - d.cost) / graphRange) * 100;

    return (
     <g key={i}>
     {/* Revenue (Green) */}
     <rect x={x} y={revY} width={barWidth / 2} height={revHeight} fill="#34d399" />
     {/* Cost (Red) */}
     <rect x={x + barWidth / 2} y={costY} width={barWidth / 2} height={costHeight} fill="#f87171" />
     <text x={x + barWidth/2} y="98" fontSize="4" textAnchor="middle" fill="#64748b">M{d.month}</text>
     </g>
    );
    })}
   </svg>
   </div>
   <button onClick={handleRecordData} className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm font-semibold dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40">
   
                        {t('lab.cs10financials_log_projection')}
                        </button>
  </section>

  {/* Column 3: Analysis */}
  <section className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5 flex-col gap-6 rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
   <CheckCircle className="text-emerald-600" />  {t('lab.cs10financials_data_logs_assessment')}
                        </h2>

   <div className="flex-1 overflow-auto">
   <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] mb-2 text-sm">{t('lab.cs10financials_saved_scenarios')}</h3>
   <table className="w-full text-xs text-left text-slate-600 dark:text-[#a1a1aa]">
    <thead className="bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] uppercase">
    <tr>
     <th className="p-2">#</th>
     <th className="p-2">{t('lab.cs10financials_price')}</th>
     <th className="p-2">{t('lab.cs10financials_units')}</th>
     <th className="p-2">VC</th>
     <th className="p-2">FC</th>
     <th className="p-2">{t('lab.cs10financials_y1_profit')}</th>
    </tr>
    </thead>
    <tbody>
    {logs.length === 0 ? (
     <tr><td colSpan={6} className="p-2 text-center text-slate-400">{t('lab.cs10financials_no_projections_logged')}</td></tr>
    ) : (
     logs.map((log) => (
     <tr key={log.id} className="border-b border-slate-100">
      <td className="p-2">{log.id}</td>
      <td className="p-2">${log.price}</td>
      <td className="p-2">{log.units}</td>
      <td className="p-2">${log.vc}</td>
      <td className="p-2">${log.fixed}</td>
      <td className={`p-2 font-bold ${log.profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>${log.profit.toFixed(0)}</td>
     </tr>
     ))
    )}
    </tbody>
   </table>
   </div>

   <div className={`bg-slate-50 dark:bg-[#121212] p-4 rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h3 className="font-semibold text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.cs10financials_break_even_challenge')}</h3>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">
    
                             {t('lab.cs10financials_your_fixed_costs_are')} <strong>${assessmentScenario.fc}</strong>{t('lab.cs10financials_you_sell_a_product_for')} <strong>${assessmentScenario.p}</strong>{t('lab.cs10financials_and_the_variable_cost_per_unit')} <strong>${assessmentScenario.vc}</strong>{t('lab.cs10financials_how_many_units_do_you_need_to_')}
                            </p>
   <div className="flex gap-2">
    <input 
    type="number" 
    value={userAnswer}
    onChange={(e) => setUserAnswer(e.target.value)}
    className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#1c1b1b] rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
    placeholder={t('lab.cs10financials_units_1')}
    />
    <button 
    onClick={checkAnswer}
    className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm font-semibold dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
    >
    
                                 {t('lab.cs10financials_check')}
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
