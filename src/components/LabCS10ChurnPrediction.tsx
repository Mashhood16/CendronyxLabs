import { useState } from 'react';
import { UserX, AlertTriangle, CheckCircle, Target, TrendingDown } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface Customer {
 id: number;
 name: string;
 loginDays: number; // last 30 days
 supportTickets: number;
 churnRisk: number;
 status: 'Active' | 'Promoted' | 'Churned';
}

interface LabProps {
 onExit?: () => void;
}

export default function LabCS10ChurnPrediction({ onExit }: LabProps) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [customers, setCustomers] = useState<Customer[]>([
 { id: 101, name: 'Acme Corp', loginDays: 25, supportTickets: 1, churnRisk: 0, status: 'Active' },
 { id: 102, name: 'Beta Ltd', loginDays: 4, supportTickets: 5, churnRisk: 0, status: 'Active' },
 { id: 103, name: 'Gamma Co', loginDays: 12, supportTickets: 2, churnRisk: 0, status: 'Active' },
 { id: 104, name: 'Delta LLC', loginDays: 2, supportTickets: 7, churnRisk: 0, status: 'Active' },
 { id: 105, name: 'Epsilon Inc', loginDays: 18, supportTickets: 0, churnRisk: 0, status: 'Active' },
 ]);

 const [loginWeight, setLoginWeight] = useState<number>(-2); // low login -> higher risk
 const [ticketWeight, setTicketWeight] = useState<number>(10); // more tickets -> higher risk
 const [baseRisk, setBaseRisk] = useState<number>(50); // starting baseline

 const [logs, setLogs] = useState<string[]>([]);
 
 const [assessmentInput, setAssessmentInput] = useState('');
 const [assessmentRes, setAssessmentRes] = useState<boolean | null>(null);

 const recalculateRisk = () => {
 setCustomers(prev => prev.map(c => {
 if (c.status !== 'Active') return c;
 
 // Formula: BaseRisk + (Tickets * TicketWeight) + (LoginDays * LoginWeight)
 let risk = baseRisk + (c.supportTickets * ticketWeight) + (c.loginDays * loginWeight);
 if (risk < 0) risk = 0;
 if (risk > 100) risk = 100;
 
 return { ...c, churnRisk: risk };
 }));
 setLogs(prev => [...prev, `Recalculated risk scores. Formula: ${baseRisk} + (T*${ticketWeight}) + (L*${loginWeight})`]);
 };

 const applyPromo = (id: number) => {
 setCustomers(prev => prev.map(c => {
 if (c.id === id) {
 if (c.churnRisk > 60) {
 setLogs(prevLogs => [...prevLogs, `Applied Promo to ${c.name}. Risk reduced. Saved customer!`]);
 return { ...c, status: 'Promoted', churnRisk: 10 };
 } else {
 setLogs(prevLogs => [...prevLogs, `Wasted Promo on ${c.name}. They weren't high risk.`]);
 return { ...c, status: 'Promoted' };
 }
 }
 return c;
 }));
 };

 const simulateTime = () => {
 setCustomers(prev => prev.map(c => {
 if (c.status === 'Active' && c.churnRisk >= 80) {
 setLogs(prevLogs => [...prevLogs, `ALERT: ${c.name} has CHURNED! Risk was too high.`]);
 return { ...c, status: 'Churned' };
 }
 return c;
 }));
 };

 const checkAssessment = () => {
 // test customer: LoginDays = 5, Tickets = 3
 const ansRisk = baseRisk + (3 * ticketWeight) + (5 * loginWeight);
 const expected = Math.max(0, Math.min(100, ansRisk));
 if (parseInt(assessmentInput) === expected) {
 setAssessmentRes(true);
 } else {
 setAssessmentRes(false);
 }
 };

 return (
 <div className="flex flex-col bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.cs10churnprediction_churn_prediction_lab')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.cs10churnprediction_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.cs10churnprediction_lab')}</button>
 </div>
 <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 min-h-0 lg:overflow-hidden">
 {/* Theory */}
 <section className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
 <Target className="mr-2 text-orange-500" /> {t('lab.cs10churnprediction_model_setup')}
 </h2>
 <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa]">
 <p>
 <strong>{t('lab.cs10churnprediction_customer_churn')}</strong> {t('lab.cs10churnprediction_is_when_users_stop_doing_busin')}
 </p>
 
 <div className={`mt-6 bg-orange-50 p-4 rounded-lg border border-orange-100 flex-col `}>
 <h3 className="font-semibold text-orange-900 mb-3">{t('lab.cs10churnprediction_adjust_model_weights')}</h3>
 
 <div className="space-y-4">
 <div>
 <div className="flex justify-between text-sm mb-1 text-slate-700 dark:text-[#ffffff]">
 <label>{t('lab.cs10churnprediction_base_risk')}</label>
 <span>{baseRisk}</span>
 </div>
 <input 
 type="range" min="0" max="100" 
 value={baseRisk} onChange={(e) => setBaseRisk(parseInt(e.target.value))}
 className="w-full accent-orange-600"
 />
 </div>
 
 <div>
 <div className="flex justify-between text-sm mb-1 text-slate-700 dark:text-[#ffffff]">
 <label>{t('lab.cs10churnprediction_support_tickets_weight_positiv')}</label>
 <span>+{ticketWeight} {t('lab.cs10churnprediction_per_ticket')}</span>
 </div>
 <input 
 type="range" min="0" max="30" 
 value={ticketWeight} onChange={(e) => setTicketWeight(parseInt(e.target.value))}
 className="w-full accent-orange-600"
 />
 </div>
 
 <div>
 <div className="flex justify-between text-sm mb-1 text-slate-700 dark:text-[#ffffff]">
 <label>{t('lab.cs10churnprediction_login_days_weight_negative_ris')}</label>
 <span>{loginWeight} {t('lab.cs10churnprediction_per_day')}</span>
 </div>
 <input 
 type="range" min="-10" max="0" 
 value={loginWeight} onChange={(e) => setLoginWeight(parseInt(e.target.value))}
 className="w-full accent-orange-600"
 />
 </div>
 
 <button 
 onClick={recalculateRisk}
 className={`w-full py-2 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 transition dark:text-white dark:text-white dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40 flex-col `}
 >
 
 {t('lab.cs10churnprediction_recalculate_model')}
 </button>
 </div>
 </div>
 </div>
 </section>

 {/* Simulation */}
 <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
 <TrendingDown className="mr-2 text-orange-500" /> {t('lab.cs10churnprediction_customer_data')}
 </h2>
 
 <div className="flex-grow overflow-auto">
 <table className="w-full text-sm text-left border-collapse">
 <thead>
 <tr className="border-b-2 border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa]">
 <th className="p-2">{t('lab.cs10churnprediction_customer')}</th>
 <th className="p-2">{t('lab.cs10churnprediction_logins_30d')}</th>
 <th className="p-2">{t('lab.cs10churnprediction_tickets')}</th>
 <th className="p-2">{t('lab.cs10churnprediction_risk_score')}</th>
 <th className="p-2">{t('lab.cs10churnprediction_action')}</th>
 </tr>
 </thead>
 <tbody>
 {customers.map(c => (
 <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 dark:bg-[#121212]">
 <td className="p-2 font-medium text-slate-800 dark:text-[#ffffff]">{c.name}</td>
 <td className="p-2 text-slate-600 dark:text-[#a1a1aa]">{c.loginDays}</td>
 <td className="p-2 text-slate-600 dark:text-[#a1a1aa]">{c.supportTickets}</td>
 <td className="p-2">
 {c.status === 'Churned' ? (
 <span className="text-red-600 font-bold flex items-center">{t('lab.cs10churnprediction_churned')} <UserX size={14} className="ml-1"/></span>
 ) : c.status === 'Promoted' ? (
 <span className="text-green-600 font-bold flex items-center">{t('lab.cs10churnprediction_saved')} <CheckCircle size={14} className="ml-1"/></span>
 ) : (
 <div className="flex items-center">
 <div className={`w-16 h-2 bg-slate-200 dark:bg-[#121212] rounded-full mr-2 flex-col `}>
 <div 
 className={`h-full ${c.churnRisk > 70 ? 'bg-red-500' : c.churnRisk > 40 ? 'bg-yellow-500' : 'bg-green-500'}`} 
 style={{ width: `${c.churnRisk}%` }}
 ></div>
 </div>
 <span className={`font-bold ${c.churnRisk > 70 ? 'text-red-600' : 'text-slate-700 dark:text-[#ffffff]'}`}>{c.churnRisk}%</span>
 </div>
 )}
 </td>
 <td className="p-2">
 {c.status === 'Active' && (
 <button 
 onClick={() => applyPromo(c.id)}
 className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded hover:bg-indigo-200"
 >
 
 {t('lab.cs10churnprediction_promo')}
 </button>
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 
 <button 
 onClick={simulateTime}
 className="mt-4 w-full py-3 bg-red-50 text-red-700 border border-red-200 font-bold rounded-md hover:bg-red-100 flex items-center justify-center transition"
 >
 <AlertTriangle className="mr-2" size={18} /> {t('lab.cs10churnprediction_simulate_time_forward_high_ris')}
 </button>
 </section>

 {/* Analysis */}
 <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
 <Target className="mr-2 text-orange-500" /> {t('lab.cs10churnprediction_log_assessment')}
 </h2>
 
 <div className="mb-6 flex-grow">
 <h3 className="text-sm font-semibold text-slate-500 dark:text-[#71717a] uppercase mb-2">{t('lab.cs10churnprediction_campaign_log')}</h3>
 <div className="bg-[#000000] dark:bg-[#121212] rounded-lg p-3 h-48 lg:overflow-y-auto font-mono text-xs text-green-400">
 {logs.length === 0 && <span className="text-slate-500 dark:text-[#71717a]">{t('lab.cs10churnprediction_waiting_for_actions')}</span>}
 {logs.map((log, i) => (
 <div key={i}>{`> ${log}`}</div>
 ))}
 </div>
 </div>

 <div className="bg-orange-50 rounded-lg p-4">
 <h3 className="font-bold text-orange-900 mb-2">{t('lab.cs10churnprediction_knowledge_check')}</h3>
 <p className="text-sm text-orange-800 mb-4">
 
 {t('lab.cs10churnprediction_if_a_customer_has')} <strong>{t('lab.cs10churnprediction_5_logins')}</strong> {t('lab.cs10churnprediction_and')} <strong>{t('lab.cs10churnprediction_3_tickets')}</strong>{t('lab.cs10churnprediction_what_would_their_risk_score_be')}
 </p>
 <div className="flex gap-2">
 <input 
 type="number" 
 value={assessmentInput}
 onChange={(e) => setAssessmentInput(e.target.value)}
 className="w-full p-2 border border-orange-200 rounded-md focus:ring-2 focus:ring-orange-500"
 placeholder={t('lab.cs10churnprediction_expected_risk_score')}
 />
 <button 
 onClick={checkAssessment}
 className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 dark:text-white dark:text-white dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40"
 >
 
 {t('lab.cs10churnprediction_check')}
 </button>
 </div>
 {assessmentRes !== null && (
 <p className={`mt-2 text-sm font-semibold ${assessmentRes ? 'text-green-600' : 'text-red-600'}`}>
 {assessmentRes ? 'Correct formula applied!' : 'Incorrect, verify the math with current weights.'}
 </p>
 )}
 </div>
 </section>
 </main>
 </div>
 );
}
