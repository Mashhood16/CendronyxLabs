import { useState, useEffect } from 'react';
import { Play, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];

export default function LabCS11DataScience({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [points, setPoints] = useState<{ x: number; y: number; cluster: number }[]>([]);
 const [centroids, setCentroids] = useState<{ x: number; y: number }[]>([]);
 const [k, setK] = useState(3);
 const [step, setStep] = useState(0);

 const [assessmentAns, setAssessmentAns] = useState('');
 const [feedback, setFeedback] = useState<string | null>(null);

 const generateData = () => {
 const newPoints = [];
 for (let i = 0; i < 50; i++) {
  const cx = 100 + Math.random() * 200;
  const cy = 100 + Math.random() * 200;
  newPoints.push({ x: cx + (Math.random() * 40 - 20), y: cy + (Math.random() * 40 - 20), cluster: -1 });
 }
 setPoints(newPoints);
 setCentroids([]);
 setStep(0);
 setFeedback(null);
 setAssessmentAns('');
 };

 useEffect(() => {
 generateData();
 }, []);

 const initCentroids = () => {
 const newCentroids = [];
 for (let i = 0; i < k; i++) {
  newCentroids.push({ x: 50 + Math.random() * 300, y: 50 + Math.random() * 300 });
 }
 setCentroids(newCentroids);
 setPoints(points.map(p => ({ ...p, cluster: -1 })));
 setStep(1);
 setFeedback(null);
 };

 const doStep = () => {
 if (centroids.length === 0) return;
 if (step % 2 === 1) {
  // Assign points
  const newPoints = points.map(p => {
  let minDist = Infinity;
  let bestC = -1;
  centroids.forEach((c, i) => {
   const d = Math.hypot(p.x - c.x, p.y - c.y);
   if (d < minDist) {
   minDist = d;
   bestC = i;
   }
  });
  return { ...p, cluster: bestC };
  });
  setPoints(newPoints);
 } else {
  // Update centroids
  const newCentroids = centroids.map((c, i) => {
  const clusterPoints = points.filter(p => p.cluster === i);
  if (clusterPoints.length === 0) return c;
  const sumX = clusterPoints.reduce((sum, p) => sum + p.x, 0);
  const sumY = clusterPoints.reduce((sum, p) => sum + p.y, 0);
  return { x: sumX / clusterPoints.length, y: sumY / clusterPoints.length };
  });
  setCentroids(newCentroids);
 }
 setStep(step + 1);
 };

 const checkAnswer = () => {
 const count0 = points.filter(p => p.cluster === 0).length;
 if (parseInt(assessmentAns) === count0) {
  setFeedback('Correct! You accurately tracked the final cluster population.');
 } else {
  setFeedback('Incorrect. Ensure you ran the simulation and check the stats panel below the graph.');
 }
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.cs11datascience_lab_data_science_analytics')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.cs11datascience_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.cs11datascience_lab')}</button>
  </div>
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:min-h-0 lg:overflow-visible">
  {/* Left Column: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 shrink-0">{t('lab.cs11datascience_theory_setup')}</h2>
   
   <div className="text-slate-600 dark:text-[#a1a1aa] space-y-4 text-sm">
   <p><strong>{t('lab.cs11datascience_k_means_clustering')}</strong>  {t('lab.cs11datascience_is_an_unsupervised_machine_lea')} <em>k</em>  {t('lab.cs11datascience_distinct_clusters')}</p>
   <ol className="list-decimal pl-5 space-y-2">
    <li><strong>{t('lab.cs11datascience_initialization')}</strong>  {t('lab.cs11datascience_choose')} <em>k</em>  {t('lab.cs11datascience_random_centroids')}</li>
    <li><strong>{t('lab.cs11datascience_assignment')}</strong>  {t('lab.cs11datascience_assign_each_data_point_to_the_')}</li>
    <li><strong>{t('lab.cs11datascience_update')}</strong>  {t('lab.cs11datascience_move_each_centroid_to_the_mean')}</li>
    <li><strong>{t('lab.cs11datascience_repeat')}</strong>  {t('lab.cs11datascience_continue_assignment_and_update')}</li>
   </ol>
   
   <div className={`bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900 flex-col `}>
    <h3 className="font-semibold text-blue-800 mb-2 dark:text-[#ffffff]">{t('lab.cs11datascience_distance_formula_euclidean')}</h3>
    <p className="font-mono text-xs">{t('lab.cs11datascience_d_x_x_y_y')}</p>
   </div>
   
   <p><strong>{t('lab.cs11datascience_a_b_testing_note')}</strong>  {t('lab.cs11datascience_similar_statistical_grouping_l')}</p>
   </div>
  </div>

  {/* Middle Column: Simulator */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex-col relative '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4 shrink-0">{t('lab.cs11datascience_interactive_visualizer')}</h2>
   
   <div className="flex gap-4 mb-4 shrink-0">
   <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-[#ffffff]">
    
                             {t('lab.cs11datascience_clusters_k')}
                             <input type="range" min="2" max="4" value={k} onChange={(e) => setK(parseInt(e.target.value))} className="w-24" />
    {k}
   </label>
   <button onClick={generateData} className={`px-3 py-1.5 bg-slate-100 dark:bg-[#121212] hover:bg-slate-200 dark:bg-[#121212] rounded text-sm font-medium flex items-center gap-1 text-slate-700 dark:text-[#ffffff] transition-colors flex-col `}>
    <RefreshCw size={16} />  {t('lab.cs11datascience_new_data')}
                            </button>
   </div>

   <div className="flex gap-2 mb-4 shrink-0">
   <button onClick={initCentroids} className={`flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40 flex-col `}>
    
                             {t('lab.cs11datascience_1_init_centroids')}
                            </button>
   <button onClick={doStep} disabled={centroids.length === 0} className={`flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm flex items-center justify-center gap-1 transition-colors dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40 `}>
    <Play size={16} /> {step % 2 === 1 ? '2. Assign Points' : '3. Update Centroids'}
   </button>
   </div>

   <div className="flex-1 border rounded-lg bg-slate-50 dark:bg-[#121212] flex flex-col items-center justify-center overflow-hidden min-h-[300px]">
   <svg viewBox="0 0 400 400" className="w-full h-full max-h-80 object-contain bg-slate-50 dark:bg-[#121212]">
    <rect width="400" height="400" fill="#f8fafc" />
    {/* Grid */}
    <path d="M0,100 H400 M0,200 H400 M0,300 H400 M100,0 V400 M200,0 V400 M300,0 V400" stroke="#e2e8f0" strokeWidth="1" />
    
    {/* Points */}
    {points.map((p, i) => (
    <circle
     key={`p-${i}`}
     cx={p.x}
     cy={p.y}
     r={4}
     fill={p.cluster >= 0 ? COLORS[p.cluster] : '#94a3b8'}
     className="transition-all duration-500"
    />
    ))}

    {/* Centroids */}
    {centroids.map((c, i) => (
    <g key={`c-${i}`} transform={`translate(${c.x}, ${c.y})`} className="transition-all duration-500">
     <polygon
     points="0,-8 8,8 -8,8"
     fill={COLORS[i]}
     stroke="#fff"
     strokeWidth="1.5"
     />
     <circle cx="0" cy="0" r="12" fill="none" stroke={COLORS[i]} strokeWidth="2" strokeDasharray="2,2" opacity="0.5" />
    </g>
    ))}
   </svg>
   
   <div className="w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] p-2 flex flex-wrap gap-4 justify-center text-xs border-t flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
    {centroids.length === 0 && <span className="text-slate-500 dark:text-[#71717a] italic">{t('lab.cs11datascience_centroids_not_initialized')}</span>}
    {centroids.map((_, i) => (
    <div key={i} className="flex items-center gap-1 font-bold" style={{ color: COLORS[i] }}>
     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
     
                 {t('lab.cs11datascience_cluster')} {i}: {points.filter(p => p.cluster === i).length}  {t('lab.cs11datascience_pts')}
                </div>
    ))}
   </div>
   </div>
   
   <div className="mt-4 text-center text-sm text-slate-500 dark:text-[#71717a] font-medium shrink-0">
   
                        {t('lab.cs11datascience_current_stage')} {step === 0 ? 'Data Generated' : (step % 2 === 1 ? 'Needs Assignment' : 'Needs Update')}  {t('lab.cs11datascience_step_count')} {step}
   </div>
  </div>

  {/* Right Column: Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col lg:overflow-y-auto ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4 shrink-0">{t('lab.cs11datascience_assessment_analysis')}</h2>
   
   <div className="space-y-6 flex-1 pr-2">
   <div className={`p-4 bg-slate-50 dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">{t('lab.cs11datascience_q1_cluster_population_analysis')}</h3>
    <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-3">
    
                                 {t('lab.cs11datascience_1_initialize_the_centroids')}<br/>
    
                                 {t('lab.cs11datascience_2_alternate_clicking_the_green')}<br/>
    
                                 {t('lab.cs11datascience_3_look_at_the_stats_panel_how_')} <strong>{t('lab.cs11datascience_red_cluster_cluster_0')}</strong>?
    </p>
    
    <div className="flex gap-2">
    <input
     type="number"
     value={assessmentAns}
     onChange={e => setAssessmentAns(e.target.value)}
     className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
     placeholder={t('lab.cs11datascience_enter_point_count')}
    />
    <button
     onClick={checkAnswer}
     className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm transition-colors dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
    >
     
                                      {t('lab.cs11datascience_check')}
                                     </button>
    </div>
    
    {feedback && (
    <div className={`mt-3 p-3 rounded-md flex items-center gap-2 text-sm font-medium ${feedback.includes('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
     {feedback.includes('Correct') ? <CheckCircle size={16} /> : <XCircle size={16} />}
     {feedback}
    </div>
    )}
   </div>

   <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 dark:bg-[#121212] dark:border-[#1c1b1b]">
    <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2 dark:text-[#ffffff]">
     
                                  {t('lab.cs11datascience_observation_task')}
                                 </h3>
    <p className="text-sm text-amber-900 leading-relaxed dark:text-[#ffffff]">
     
                                  {t('lab.cs11datascience_notice_how_the_centroids_itera')} <strong>{t('lab.cs11datascience_center_of_mass')}</strong>  {t('lab.cs11datascience_of_their_assigned_points_try_r')}
                                 </p>
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}
