import { useState } from 'react';
import { Briefcase, Camera, Music, Code, Paintbrush, DollarSign, Calculator, LineChart } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabC6HobbyMonetization({ onExit }: LabProps) {
 const { t } = useTranslate();
 const [hobby, setHobby] = useState<string | null>(null);
 const [price, setPrice] = useState('500');
 const [cost, setCost] = useState('200');
 const [sales, setSales] = useState('10');

 const hobbies = [
 { id: 'photo', name: 'Photography', icon: Camera, desc: 'Selling prints or offering photoshoots.' },
 { id: 'music', name: 'Music Production', icon: Music, desc: 'Making beats or giving online lessons.' },
 { id: 'code', name: 'Web Development', icon: Code, desc: 'Building small websites for local shops.' },
 { id: 'art', name: 'Digital Art', icon: Paintbrush, desc: 'Taking commissions for custom avatars.' }
 ];

 const parsedPrice = parseFloat(price) || 0;
 const parsedCost = parseFloat(cost) || 0;
 const parsedSales = parseInt(sales) || 0;

 const profitPerItem = parsedPrice - parsedCost;
 const totalProfit = profitPerItem * parsedSales;

 return (
 <div className="flex flex-col font-sans bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.c6hobbymonetization_hobby_monetization_business_pl')} />
 <div className="flex-1 px-8 pb-8 flex flex-col lg:overflow-y-auto">
 

 <p className="text-slate-600 dark:text-[#a1a1aa] mb-8">{t('lab.c6hobbymonetization_choose_a_hobby_plan_your_start')}</p>

 <div className="flex gap-8 flex-1">
 {/* Section 1: Business Idea */}
 <div className="w-1/2 flex flex-col gap-6">
 <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6">
 <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
 <Briefcase className="w-6 h-6 text-indigo-600" /> {t('lab.c6hobbymonetization_1_select_your_startup_idea')}
 </h2>
 <div className="grid grid-cols-2 gap-4">
 {hobbies.map(h => {
 const Icon = h.icon;
 return (
 <button
 key={h.id}
 onClick={() => setHobby(h.id)}
 className={`p-4 rounded-xl border-2 text-left transition-all ${ hobby === h.id ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-slate-200 dark:border-[#1c1b1b] hover:border-slate-300 dark:border-[#1c1b1b] hover:bg-slate-50 dark:bg-[#121212]' }`}
 >
 <Icon className={`w-8 h-8 mb-3 ${hobby === h.id ? 'text-indigo-600' : 'text-slate-400'}`} />
 <div className="font-bold text-slate-800 dark:text-[#ffffff] mb-1">{h.name}</div>
 <div className="text-xs text-slate-500 dark:text-[#71717a]">{h.desc}</div>
 </button>
 );
 })}
 </div>
 </div>

 <div className="bg-indigo-600 text-white rounded-xl shadow-lg p-8 relative overflow-hidden flex-1 flex flex-col justify-center dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
 <div className="absolute -right-8 -bottom-8 opacity-10">
 <LineChart className="w-64 h-64" />
 </div>
 <h3 className="text-2xl font-bold mb-2 relative z-10">{t('lab.c6hobbymonetization_your_pitch')}</h3>
 {hobby ? (
 <p className="text-indigo-100 text-lg relative z-10 leading-relaxed">
 
 {t('lab.c6hobbymonetization_my_startup_transforms_my_passi')} <strong className="text-white">{hobbies.find(h=>h.id===hobby)?.name}</strong> {t('lab.c6hobbymonetization_into_a_profitable_business_by')} <strong className="text-white border-b border-indigo-400 pb-0.5">{hobbies.find(h=>h.id===hobby)?.desc.toLowerCase()}</strong>"
 </p>
 ) : (
 <p className="text-indigo-300 italic relative z-10">{t('lab.c6hobbymonetization_select_a_hobby_above_to_genera')}</p>
 )}
 </div>
 </div>

 {/* Section 2: Financials */}
 <div className="w-1/2 bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-8 flex flex-col">
 <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
 <Calculator className="w-6 h-6 text-emerald-600" /> {t('lab.c6hobbymonetization_2_calculate_profit')}
 </h2>

 <div className="flex flex-col gap-6 flex-1">
 <div>
 <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.c6hobbymonetization_selling_price_per_item_service')}</label>
 <div className="relative">
 <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
 <input 
 type="number" 
 value={price}
 onChange={e => setPrice(e.target.value)}
 className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-mono"
 />
 </div>
 </div>

 <div>
 <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.c6hobbymonetization_cost_price_per_item_service_rs')}</label>
 <div className="relative">
 <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
 <input 
 type="number" 
 value={cost}
 onChange={e => setCost(e.target.value)}
 className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-mono"
 />
 </div>
 </div>

 <div>
 <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-2">{t('lab.c6hobbymonetization_estimated_sales_quantity')}</label>
 <input 
 type="number" 
 value={sales}
 onChange={e => setSales(e.target.value)}
 className="w-full px-4 py-3 border border-slate-300 dark:border-[#1c1b1b] rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-mono"
 />
 </div>

 <div className="mt-auto bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-xl p-6">
 <h3 className="font-bold text-slate-500 dark:text-[#71717a] text-sm uppercase tracking-wider mb-4">{t('lab.c6hobbymonetization_financial_summary')}</h3>
 <div className="flex justify-between items-center mb-2">
 <span className="text-slate-600 dark:text-[#a1a1aa]">{t('lab.c6hobbymonetization_profit_per_item_selling_cost')}</span>
 <span className={`font-mono font-bold ${profitPerItem >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
 Rs {profitPerItem}
 </span>
 </div>
 <div className="w-full h-px bg-slate-200 dark:bg-[#121212] my-4"></div>
 <div className="flex justify-between items-center">
 <span className="text-slate-800 dark:text-[#ffffff] font-bold text-lg">{t('lab.c6hobbymonetization_total_estimated_profit')}</span>
 <span className={`font-mono font-black text-2xl ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
 Rs {totalProfit}
 </span>
 </div>
 </div>

 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
