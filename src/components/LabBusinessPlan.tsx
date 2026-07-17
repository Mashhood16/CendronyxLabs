import { useState } from 'react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

interface LabProps {
 onExit: () => void;
}

export default function LabBusinessPlan({ onExit }: LabProps) {
    const { t } = useTranslate();
 const [plan, setPlan] = useState({
 name: '',
 overview: '',
 objectives: '',
 market: '',
 costing: ''
 });

 const [feedback, setFeedback] = useState<string | null>(null);

 const evaluatePitch = () => {
 let score = 0;
 if (plan.name.length > 3) score += 10;
 if (plan.overview.length > 20) score += 20;
 if (plan.objectives.length > 20) score += 20;
 if (plan.market.length > 20) score += 25;
 if (plan.costing.length > 20 && /\d/.test(plan.costing)) score += 25; // should have some numbers

 if (score < 40) {
  setFeedback("Partners' Feedback: The plan is too vague. We need more detail in every section before investing.");
 } else if (score < 80) {
  setFeedback("Partners' Feedback: Good start! But make sure your costing includes actual financial figures and your market analysis is deep.");
 } else {
  setFeedback("Partners' Feedback: Excellent Business Plan! We are ready to invest. Let's launch this brand!");
 }
 };

 return (
 <div className="w-full   bg-slate-50 dark:!bg-[#000000] flex flex-col font-sans min-h-screen lg:h-screen overflow-x-hidden">
  <LabHeader onExit={onExit} title={t('lab.businessplan_act_6_1_business_plan_drafting')} subtitle={t('lab.subtitle_draft_your_startup')} variant="dark" />

  <div className="flex-1 flex lg:overflow-hidden">
  
  {/* Editor Area */}
  <div className="flex-1 bg-slate-50 dark:bg-[#121212] p-12 lg:overflow-y-auto">
   
   <div className="max-w-3xl mx-auto">
    <div className="border-b-4 border-indigo-800 pb-4 mb-8 flex justify-between items-end">
    <input 
     type="text" 
     placeholder={t('lab.businessplan_brand_company_name')}
     className="text-4xl font-bold outline-none text-slate-800 dark:text-[#ffffff] w-2/3 placeholder-slate-300"
     value={plan.name} onChange={e=>setPlan({...plan, name: e.target.value})}
    />
    <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">{t('lab.businessplan_official_business_plan')}</span>
    </div>

    <div className="space-y-8">
    
    <div className="group">
     <label className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-[#ffffff] mb-2">
      <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-sm dark:text-[#ffffff]">1</span>
      
                                       {t('lab.businessplan_business_overview')}
                                      </label>
     <p className="text-sm text-slate-500 dark:text-[#71717a] mb-2">{t('lab.businessplan_what_does_your_company_do_what')}</p>
     <textarea 
      className="w-full h-32 p-4 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 resize-none transition-shadow"
      placeholder={t('lab.businessplan_e_g_we_are_creating_a_smart_ba')}
      value={plan.overview} onChange={e=>setPlan({...plan, overview: e.target.value})}
     ></textarea>
    </div>

    <div className="group">
     <label className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-[#ffffff] mb-2">
      <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-sm dark:text-[#ffffff]">2</span>
      
                                       {t('lab.businessplan_objectives')}
                                      </label>
     <p className="text-sm text-slate-500 dark:text-[#71717a] mb-2">{t('lab.businessplan_what_are_your_short_term_and_l')}</p>
     <textarea 
      className="w-full h-32 p-4 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 resize-none transition-shadow"
      placeholder={t('lab.businessplan_e_g_sell_10_000_units_in_year_')}
      value={plan.objectives} onChange={e=>setPlan({...plan, objectives: e.target.value})}
     ></textarea>
    </div>

    <div className="group">
     <label className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-[#ffffff] mb-2">
      <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-sm dark:text-[#ffffff]">3</span>
      
                                       {t('lab.businessplan_market_analysis')}
                                      </label>
     <p className="text-sm text-slate-500 dark:text-[#71717a] mb-2">{t('lab.businessplan_who_are_your_customers_who_are')}</p>
     <textarea 
      className="w-full h-32 p-4 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 resize-none transition-shadow"
      placeholder={t('lab.businessplan_e_g_target_audience_is_college')}
      value={plan.market} onChange={e=>setPlan({...plan, market: e.target.value})}
     ></textarea>
    </div>

    <div className="group">
     <label className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-[#ffffff] mb-2">
      <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-sm dark:text-[#ffffff]">4</span>
      
                                       {t('lab.businessplan_financial_costing')}
                                      </label>
     <p className="text-sm text-slate-500 dark:text-[#71717a] mb-2">{t('lab.businessplan_what_is_the_budget_required_br')}</p>
     <textarea 
      className="w-full h-32 p-4 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 resize-none transition-shadow"
      placeholder={t('lab.businessplan_e_g_production_50_000_marketin')}
      value={plan.costing} onChange={e=>setPlan({...plan, costing: e.target.value})}
     ></textarea>
    </div>

    </div>

    <div className="mt-12 text-center pb-12">
    <button 
     onClick={evaluatePitch}
     className="px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 mx-auto dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
    >
     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
     
                                  {t('lab.businessplan_present_to_partners')}
                                 </button>
    </div>
   </div>
  </div>

  {/* Partners Feedback Panel */}
  {feedback && (
   <div className="w-96 bg-[#000000] dark:bg-[#121212] text-white p-8 shadow-[-20px_0_40px_rgba(0,0,0,0.2)] z-10 animate-fade-in flex flex-col lg:overflow-y-auto">
    <h2 className="text-2xl font-bold mb-6 text-indigo-400 border-b border-[#1c1b1b] dark:border-[#1c1b1b] pb-2">{t('lab.businessplan_boardroom_decision')}</h2>
    
    <div className="flex-1">
    <div className="bg-[#121212] dark:bg-[#121212] p-6 rounded-xl border border-[#1c1b1b] dark:border-[#1c1b1b] relative">
     <div className="absolute -left-3 top-6 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-slate-800"></div>
     <p className="text-lg leading-relaxed">{feedback}</p>
    </div>
    </div>

    <button onClick={() => setFeedback(null)} className="w-full py-3 bg-slate-700 dark:bg-[#121212] hover:bg-slate-600 dark:bg-[#121212] rounded font-bold transition-colors mt-auto">{t('lab.businessplan_return_to_editing')}</button>
   </div>
  )}

  </div>
 </div>
 );
}
