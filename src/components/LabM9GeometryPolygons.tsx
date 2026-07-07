import { useState, useEffect } from 'react';
import { CheckCircle, Calculator, RefreshCcw, Ruler, HelpCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface Point { x: number; y: number; }
interface LabProps { onExit?: () => void; }

export default function LabM9GeometryPolygons({ onExit }: LabProps) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [points, setPoints] = useState<Point[]>([]);
 const [grassRate, setGrassRate] = useState<number>(10);
 const [fenceRate, setFenceRate] = useState<number>(5);
 
 const [userAns, setUserAns] = useState<string>('');
 const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

 useEffect(() => {
 setGrassRate(Math.floor(Math.random() * 10) + 5);
 setFenceRate(Math.floor(Math.random() * 8) + 2);
 }, []);

 const SVG_SIZE = 400;
 const GRID_SIZE = 20;
 const scale = SVG_SIZE / GRID_SIZE;

 const handleSvgClick = (e: any) => {
 if (points.length >= 3) return;
 const rect = e.currentTarget.getBoundingClientRect();
 const xRaw = e.clientX - rect.left;
 const yRaw = e.clientY - rect.top;
 
 const x = Math.round(xRaw / scale);
 const y = Math.round((SVG_SIZE - yRaw) / scale);
 
 setPoints([...points, { x, y }]);
 setIsCorrect(null);
 };
 
 const resetPoints = () => {
 setPoints([]);
 setUserAns('');
 setIsCorrect(null);
 };
 
 let area = 0;
 let perimeter = 0;
 let cx = 0;
 let cy = 0;
 
 if (points.length === 3) {
 const [A, B, C] = points;
 area = Math.abs(A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y)) / 2;
 const d = (p1: Point, p2: Point) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
 perimeter = d(A, B) + d(B, C) + d(C, A);
 cx = (A.x + B.x + C.x) / 3;
 cy = (A.y + B.y + C.y) / 3;
 }
 
 const checkAns = () => {
 const total = (area * grassRate) + (perimeter * fenceRate);
 if (Math.abs(parseFloat(userAns) - total) <= 0.5) {
  setIsCorrect(true);
 } else {
  setIsCorrect(false);
 }
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.m9geometrypolygons_lab_m9_2_geometry_polygons')} />
  

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.m9geometrypolygons_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.m9geometrypolygons_lab')}</button>
  </div>
  <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:flex-1 max-w-7xl mx-auto w-full lg:overflow-visible">
  {/* Column 1: Theory */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-6 flex-col gap-4 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
   <HelpCircle className="text-emerald-600" size={20} />
   
                        {t('lab.m9geometrypolygons_area_perimeter_centroid')}
                        </h2>
   <div className="prose prose-slate text-sm">
   <p>
    
                             {t('lab.m9geometrypolygons_in_landscaping_geometric_prope')} 
                            </p>
   <ul className="list-disc pl-5 space-y-2 mt-2">
    <li><strong>{t('lab.m9geometrypolygons_perimeter')}</strong>  {t('lab.m9geometrypolygons_total_distance_around_the_boun')} <br/><span className="font-mono text-xs text-slate-500 dark:text-[#71717a]">{t('lab.m9geometrypolygons_p_d_a_b_d_b_c_d_c_a')}</span></li>
    <li><strong>{t('lab.m9geometrypolygons_area')}</strong>  {t('lab.m9geometrypolygons_the_2d_space_enclosed_used_to_')}<br/><span className="font-mono text-xs text-slate-500 dark:text-[#71717a]">{t('lab.m9geometrypolygons_shoelace_formula_x_y_y')}</span></li>
    <li><strong>{t('lab.m9geometrypolygons_centroid')}</strong>  {t('lab.m9geometrypolygons_the_geometric_center_ideal_for')}<br/><span className="font-mono text-xs text-slate-500 dark:text-[#71717a]">{t('lab.m9geometrypolygons_c_x_x_x_3_y_y_y_3')}</span></li>
   </ul>
   <p className="mt-4">
    <strong>{t('lab.m9geometrypolygons_instructions')}</strong>  {t('lab.m9geometrypolygons_click_anywhere_on_the_20x20_gr')}
                            </p>
   </div>
  </div>

  {/* Column 2: Simulator */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex-col gap-4 '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
   <Ruler className="text-emerald-600" size={20} />
   
                        {t('lab.m9geometrypolygons_interactive_yard_map')}
                        </h2>
   
   <div className="flex-1 min-w-0 flex flex-col items-center justify-center relative">
   <svg 
    width={SVG_SIZE} 
    height={SVG_SIZE} 
    className={`bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded-lg overflow- cursor-crosshair flex-col `}
    onClick={handleSvgClick}
   >
    {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
    <g key={`grid-${i}`}>
     <line x1={i * scale} y1={0} x2={i * scale} y2={SVG_SIZE} stroke="#e2e8f0" strokeWidth={i%5===0 ? 2 : 1} />
     <line x1={0} y1={i * scale} x2={SVG_SIZE} y2={i * scale} stroke="#e2e8f0" strokeWidth={i%5===0 ? 2 : 1} />
    </g>
    ))}
    
    {points.length === 3 && (
    <polygon 
     points={points.map(p => `${p.x * scale},${SVG_SIZE - p.y * scale}`).join(' ')}
     fill="rgba(16, 185, 129, 0.2)"
     stroke="#10b981"
     strokeWidth="2"
    />
    )}
    
    {points.map((p, i) => (
    <g key={i}>
     <circle cx={p.x * scale} cy={SVG_SIZE - p.y * scale} r={5} fill="#047857" />
     <text x={p.x * scale + 8} y={SVG_SIZE - p.y * scale - 8} className="text-xs font-bold fill-emerald-800">
     {['A', 'B', 'C'][i]} ({p.x}, {p.y})
     </text>
    </g>
    ))}

    {points.length === 3 && (
    <g>
     <circle cx={cx * scale} cy={SVG_SIZE - cy * scale} r={6} fill="#ef4444" />
     <text x={cx * scale + 10} y={SVG_SIZE - cy * scale} className="text-xs font-bold fill-red-600">
     
                                          {t('lab.m9geometrypolygons_centroid_1')}
                                          </text>
    </g>
    )}
   </svg>
   
   <div className="absolute bottom-2 right-2 text-xs text-slate-400 font-mono bg-slate-50 dark:bg-[#121212]/80 px-1 rounded">
    
                             {t('lab.m9geometrypolygons_grid_20x20_meters')}
                            </div>
   </div>

   <button 
   onClick={resetPoints} 
   className={`w-full py-2 bg-[#121212] dark:bg-[#121212] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-slate-700 dark:bg-[#121212] transition-colors `}
   >
   <RefreshCcw size={18} />  {t('lab.m9geometrypolygons_reset_canvas')}
                        </button>
  </div>

  {/* Column 3: Analysis */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-6 flex-col gap-4 '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] flex items-center gap-2">
   <Calculator className="text-emerald-600" size={20} />
   
                        {t('lab.m9geometrypolygons_data_log_cost_estimator')}
                        </h2>
   
   <div className={`flex-1 min-w-0 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg p-4 space-y-4 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <div>
    <h3 className="text-sm font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-wider">{t('lab.m9geometrypolygons_geometric_data')}</h3>
    <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-sm">
    <div className="bg-slate-50 dark:bg-[#121212] p-2 rounded border border-slate-200 dark:border-[#1c1b1b]">
     <span className="text-slate-400 block text-xs">{t('lab.m9geometrypolygons_perimeter_1')}</span>
     {points.length === 3 ? `${perimeter.toFixed(2)} m` : '-'}
    </div>
    <div className="bg-slate-50 dark:bg-[#121212] p-2 rounded border border-slate-200 dark:border-[#1c1b1b]">
     <span className="text-slate-400 block text-xs">{t('lab.m9geometrypolygons_area_1')}</span>
     {points.length === 3 ? `${area.toFixed(2)} m²` : '-'}
    </div>
    <div className="bg-slate-50 dark:bg-[#121212] p-2 rounded border border-slate-200 dark:border-[#1c1b1b] col-span-2">
     <span className="text-slate-400 block text-xs">{t('lab.m9geometrypolygons_centroid_sprinkler')}</span>
     {points.length === 3 ? `(${cx.toFixed(2)}, ${cy.toFixed(2)})` : '-'}
    </div>
    </div>
   </div>

   <div className="border-t border-slate-200 dark:border-[#1c1b1b] pt-4">
    <h3 className="text-sm font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-wider">{t('lab.m9geometrypolygons_cost_rates')}</h3>
    <ul className="text-sm mt-2 space-y-1">
    <li>{t('lab.m9geometrypolygons_grass_area')} <strong>${grassRate}  {t('lab.m9geometrypolygons_m')}</strong></li>
    <li>{t('lab.m9geometrypolygons_fencing_perimeter')} <strong>${fenceRate}  {t('lab.m9geometrypolygons_m_1')}</strong></li>
    </ul>
   </div>
   </div>

   <div className="mt-2 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
   <h3 className="font-bold text-emerald-900 mb-2">{t('lab.m9geometrypolygons_estimate_landscape_cost')}</h3>
   <p className="text-sm text-emerald-800 mb-3">
    
                             {t('lab.m9geometrypolygons_calculate_the_total_cost_to_la')}
                            </p>
   <div className="flex flex-wrap gap-2">
    <input 
    type="number" 
    placeholder={t('lab.m9geometrypolygons_total_cost')} 
    value={userAns}
    onChange={(e) => setUserAns(e.target.value)}
    disabled={points.length < 3}
    className="flex-1 min-w-0 px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
    />
    <button 
    onClick={checkAns}
    disabled={points.length < 3}
    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center disabled:opacity-50 dark:text-white dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40"
    >
    
                                 {t('lab.m9geometrypolygons_check')}
                                 </button>
   </div>
   
   {isCorrect === true && (
    <div className="mt-3 p-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2 text-sm">
    <CheckCircle size={16} />  {t('lab.m9geometrypolygons_accurate_estimation')}
                                 </div>
   )}
   {isCorrect === false && (
    <div className="mt-3 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
    
                                 {t('lab.m9geometrypolygons_incorrect_calculate_area_grass')}
                                 </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
