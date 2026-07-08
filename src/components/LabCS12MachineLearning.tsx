import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, BarChart2, BookOpen, CheckCircle, Target, Save } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

interface Point {
 id: number;
 x: number;
 y: number;
 actual: boolean;
 isTrain: boolean;
 predicted: boolean;
}

export default function LabCS12MachineLearning({ onExit }: { onExit?: () => void }) {
 const { setLabScore } = useLab();
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [splitRatio, setSplitRatio] = useState<number>(0.8);
 const [rawPoints, setRawPoints] = useState<{id:number, x:number, y:number, actual:boolean}[]>([]);
 const [points, setPoints] = useState<Point[]>([]);
 const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
 
 const [ansAcc, setAnsAcc] = useState<string>('');
 const [ansPrec, setAnsPrec] = useState<string>('');
 const [ansRec, setAnsRec] = useState<string>('');
 const [ansPVal, setAnsPVal] = useState<string>('');
 const [feedback, setFeedback] = useState<string>('');

 const initData = useCallback(() => {
  const newPoints = [];
  for (let i = 0; i < 100; i++) {
   const actual = i >= 50;
   const cx = actual ? 60 : 40;
   const cy = actual ? 60 : 40;
   newPoints.push({
    id: i,
    x: Math.max(5, Math.min(95, cx + (Math.random() - 0.5) * 45)),
    y: Math.max(5, Math.min(95, cy + (Math.random() - 0.5) * 45)),
    actual
   });
  }
  newPoints.sort(() => Math.random() - 0.5);
  setRawPoints(newPoints);
 }, []);

 useEffect(() => {
  initData();
 }, [initData]);

 useEffect(() => {
  setPoints(rawPoints.map((p, i) => ({
   ...p,
   isTrain: i < rawPoints.length * splitRatio,
   predicted: false
  })));
  setIsEvaluated(false);
 }, [rawPoints, splitRatio]);

 const evaluateModel = () => {
  setPoints(pts => pts.map(p => ({
   ...p,
   predicted: (p.x + p.y) > 100
  })));
  setIsEvaluated(true);
 };

 const testPoints = points.filter(p => !p.isTrain);
 const tp = testPoints.filter(p => p.actual && p.predicted).length;
 const fp = testPoints.filter(p => !p.actual && p.predicted).length;
 const tn = testPoints.filter(p => !p.actual && !p.predicted).length;
 const fn = testPoints.filter(p => p.actual && !p.predicted).length;

 const checkAnswers = () => {
  const acc = testPoints.length > 0 ? (tp + tn) / testPoints.length : 0;
  const prec = (tp + fp) > 0 ? tp / (tp + fp) : 0;
  const rec = (tp + fn) > 0 ? tp / (tp + fn) : 0;

  let score = 0;
  if (Math.abs(parseFloat(ansAcc) - acc) < 0.05) score++;
  if (Math.abs(parseFloat(ansPrec) - prec) < 0.05) score++;
  if (Math.abs(parseFloat(ansRec) - rec) < 0.05) score++;
  if (ansPVal.toLowerCase().trim() === 'yes') score++;

  if (score === 4) setFeedback('Perfect! All answers correct.');
  else setFeedback(`You scored ${score}/4. Keep trying! (Ensure calculations use exact TP, FP, TN, FN)`);
    setLabScore(score, 4);
 };

 const handleComplete = () => {
  if (onExit) onExit();
 };

 return (
  <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
   {/* Header */}
   <LabHeader onExit={onExit} title={t('lab.cs12machinelearning_lab_12_1_machine_learning_stat')} />

   {/* Main 3-column Grid */}
   
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.cs12machinelearning_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.cs12machinelearning_lab')}</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:flex-1 lg:h-full lg:min-h-0 lg:overflow-visible">
    {/* Column 1: Theory */}
    <div className={`w-full bg-slate-50 dark:bg-[#121212] p-6 rounded-xl shadow border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2">
      <BookOpen className="text-indigo-500" />  {t('lab.cs12machinelearning_theory_context')}
                          </h2>
     <div className="text-sm text-slate-700 dark:text-[#ffffff] space-y-4">
      <p>{t('lab.cs12machinelearning_in_machine_learning_we_evaluat')} <strong>{t('lab.cs12machinelearning_training')}</strong>  {t('lab.cs12machinelearning_and')} <strong>{t('lab.cs12machinelearning_testing')}</strong>  {t('lab.cs12machinelearning_subsets_to_prevent_overfitting')}</p>
      <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">{t('lab.cs12machinelearning_confusion_matrix')}</h3>
      <ul className="list-disc pl-5 space-y-1">
       <li><strong>TP</strong>  {t('lab.cs12machinelearning_true_positives_actual_positive')}</li>
       <li><strong>TN</strong>  {t('lab.cs12machinelearning_true_negatives_actual_negative')}</li>
       <li><strong>FP</strong>  {t('lab.cs12machinelearning_false_positives_actual_negativ')}</li>
       <li><strong>FN</strong>  {t('lab.cs12machinelearning_false_negatives_actual_positiv')}</li>
      </ul>
      <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">{t('lab.cs12machinelearning_key_metrics')}</h3>
      <p><strong>{t('lab.cs12machinelearning_accuracy')}</strong>  {t('lab.cs12machinelearning_tp_tn_total_test')}</p>
      <p><strong>{t('lab.cs12machinelearning_precision')}</strong>  {t('lab.cs12machinelearning_tp_tp_fp')}</p>
      <p><strong>{t('lab.cs12machinelearning_recall')}</strong>  {t('lab.cs12machinelearning_tp_tp_fn')}</p>
      <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mt-4">{t('lab.cs12machinelearning_statistical_hypothesis_testing')}</h3>
      <p>{t('lab.cs12machinelearning_we_use_p_values_to_determine_i')}</p>
     </div>
    </div>

    {/* Column 2: Simulator */}
    <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] p-6 rounded-xl shadow border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2 shrink-0">
      <BarChart2 className="text-indigo-500" />  {t('lab.cs12machinelearning_interactive_data_science')}
                          </h2>
     
     <div className="mb-4 shrink-0">
      <label className="text-sm font-semibold text-slate-700 dark:text-[#ffffff] block mb-1">
       
                                {t('lab.cs12machinelearning_train_test_split')} {Math.round(splitRatio * 100)}{t('lab.cs12machinelearning_train')} {100 - Math.round(splitRatio * 100)}{t('lab.cs12machinelearning_test')}
                               </label>
      <input 
       type="range" min="0.1" max="0.9" step="0.1" 
       value={splitRatio} 
       onChange={(e) => setSplitRatio(parseFloat(e.target.value))}
       className="w-full"
      />
     </div>

     <div className="flex gap-2 mb-4 shrink-0">
      <button onClick={initData} className={`flex-1 bg-slate-200 dark:bg-[#121212] hover:bg-slate-300 dark:bg-[#121212] text-slate-800 dark:text-[#ffffff] py-2 rounded flex justify-center items-center gap-2 text-sm font-medium transition-colors flex-col `}>
       <RefreshCw size={16} />  {t('lab.cs12machinelearning_reshuffle_data')}
                               </button>
      <button onClick={evaluateModel} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded flex justify-center items-center gap-2 text-sm font-medium transition-colors dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">
       <Target size={16} />  {t('lab.cs12machinelearning_evaluate_on_test_set')}
                               </button>
     </div>

     <svg viewBox="0 0 100 100" className="w-full h-64 bg-slate-100 dark:bg-[#121212] rounded-lg shadow-inner mb-4 shrink-0">
      {isEvaluated && <line x1="0" y1="100" x2="100" y2="0" stroke="#64748b" strokeWidth="1" strokeDasharray="2" />}
      {points.map(p => (
       <circle 
        key={p.id} 
        cx={p.x} cy={p.y} r={p.isTrain ? 2 : 2.5}
        fill={p.actual ? '#3b82f6' : '#ef4444'}
        fillOpacity={p.isTrain ? 0.7 : 0.2}
        stroke={!p.isTrain ? (p.actual ? '#1d4ed8' : '#b91c1c') : 'none'}
        strokeWidth={!p.isTrain ? 0.5 : 0}
       />
      ))}
     </svg>

     {isEvaluated && (
      <div className="bg-slate-50 dark:bg-[#121212] p-3 rounded border border-slate-200 dark:border-[#1c1b1b] shrink-0 mt-auto">
       <h3 className="text-sm font-bold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.cs12machinelearning_test_set_results_confusion_mat')}</h3>
       <div className="grid grid-cols-2 gap-2 text-sm text-slate-700 dark:text-[#ffffff]">
        <div><strong>{t('lab.cs12machinelearning_true_positives_tp')}</strong> {tp}</div>
        <div><strong>{t('lab.cs12machinelearning_false_positives_fp')}</strong> {fp}</div>
        <div><strong>{t('lab.cs12machinelearning_true_negatives_tn')}</strong> {tn}</div>
        <div><strong>{t('lab.cs12machinelearning_false_negatives_fn')}</strong> {fn}</div>
        <div className="col-span-2 pt-2 border-t border-slate-200 dark:border-[#1c1b1b]">
         <strong>{t('lab.cs12machinelearning_total_test_points')}</strong> {testPoints.length}
        </div>
       </div>
      </div>
     )}
    </div>

    {/* Column 3: Assessment */}
    <div className={`bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] p-6 rounded-xl shadow border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] flex-col rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center gap-2 shrink-0">
      <CheckCircle className="text-indigo-500" />  {t('lab.cs12machinelearning_assessment_analysis')}
                          </h2>
     
     {!isEvaluated ? (
      <div className="text-sm text-slate-500 dark:text-[#71717a] italic p-4 bg-slate-50 dark:bg-[#121212] rounded">
       
                                {t('lab.cs12machinelearning_please_evaluate_the_model_in_t')}
                               </div>
     ) : (
      <div className="space-y-4 flex-1 lg:overflow-y-auto text-sm pr-2">
       <div>
        <label className="block text-slate-700 dark:text-[#ffffff] mb-1 font-medium">{t('lab.cs12machinelearning_1_calculate_model_accuracy_dec')}</label>
        <input type="number" step="0.01" value={ansAcc} onChange={e => setAnsAcc(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded" />
       </div>
       <div>
        <label className="block text-slate-700 dark:text-[#ffffff] mb-1 font-medium">{t('lab.cs12machinelearning_2_calculate_precision_decimal_')}</label>
        <input type="number" step="0.01" value={ansPrec} onChange={e => setAnsPrec(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded" />
       </div>
       <div>
        <label className="block text-slate-700 dark:text-[#ffffff] mb-1 font-medium">{t('lab.cs12machinelearning_3_calculate_recall_decimal_for')}</label>
        <input type="number" step="0.01" value={ansRec} onChange={e => setAnsRec(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded" />
       </div>
       <div className="pt-2 border-t border-slate-200 dark:border-[#1c1b1b]">
        <label className="block text-slate-700 dark:text-[#ffffff] mb-1 font-medium">{t('lab.cs12machinelearning_4_if_a_t_test_compares_our_mod')}</label>
        <input type="text" value={ansPVal} onChange={e => setAnsPVal(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-[#1c1b1b] rounded" />
       </div>

       <button onClick={checkAnswers} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors dark:text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40">
        
                                         {t('lab.cs12machinelearning_check_answers')}
                                        </button>

       {feedback && (
        <div className={`p-3 rounded mt-4 font-medium ${feedback.includes('Perfect') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
         {feedback}
        </div>
       )}

       <div className="pt-4 border-t border-slate-200 dark:border-[#1c1b1b] mt-6">
        <button 
         onClick={handleComplete}
         className={`w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40 `}
        >
         <Save size={20} />
         
                                              {t('lab.cs12machinelearning_submit_results_exit')}
                                             </button>
       </div>
      </div>
     )}
    </div>
   </div>
  </div>
 );
}
