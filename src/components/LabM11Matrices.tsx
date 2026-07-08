import { useState } from 'react';
import { CheckCircle, XCircle, Grid, Shield } from 'lucide-react';
import LabHeader from './LabHeader';
import MathText from './MathText';
import { useTranslate } from "../i18n";

export default function LabM11Matrices({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 // 2x2 Transformation Matrix
 const [m00, setM00] = useState<number>(1);
 const [m01, setM01] = useState<number>(0);
 const [m10, setM10] = useState<number>(0);
 const [m11, setM11] = useState<number>(1);

 // Original Shape (House)
 const baseShape = [
 {x: -2, y: -2},
 {x: 2, y: -2},
 {x: 2, y: 2},
 {x: 0, y: 4},
 {x: -2, y: 2},
 {x: -2, y: -2}
 ];

 const transformedShape = baseShape.map(p => ({
 x: m00 * p.x + m01 * p.y,
 y: m10 * p.x + m11 * p.y
 }));

 // Cryptography Assessment State
 const [detAnswer, setDetAnswer] = useState<string>("");
 const [detStatus, setDetStatus] = useState<"idle" | "correct" | "incorrect">("idle");

 const [cipherX, setCipherX] = useState<string>("");
 const [cipherY, setCipherY] = useState<string>("");
 const [cipherStatus, setCipherStatus] = useState<"idle" | "correct" | "incorrect">("idle");

 const checkDet = () => {
 const det = m00 * m11 - m01 * m10;
 if (Math.abs(parseFloat(detAnswer) - det) < 0.1) {
  setDetStatus("correct");
 } else {
  setDetStatus("incorrect");
 }
 };

 const checkCipher = () => {
 // Encrypt vector [3, 5]
 const vecX = 3;
 const vecY = 5;
 const expX = m00 * vecX + m01 * vecY;
 const expY = m10 * vecX + m11 * vecY;

 if (Math.abs(parseFloat(cipherX) - expX) < 0.1 && Math.abs(parseFloat(cipherY) - expY) < 0.1) {
  setCipherStatus("correct");
 } else {
  setCipherStatus("incorrect");
 }
 };

 const setPreset = (type: string) => {
 switch (type) {
  case 'identity': setM00(1); setM01(0); setM10(0); setM11(1); break;
  case 'scale': setM00(2); setM01(0); setM10(0); setM11(2); break;
  case 'shearX': setM00(1); setM01(1); setM10(0); setM11(1); break;
  case 'rotate90': setM00(0); setM01(-1); setM10(1); setM11(0); break;
 }
 setDetStatus("idle");
 setCipherStatus("idle");
 setDetAnswer("");
 setCipherX("");
 setCipherY("");
 };

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.m11matrices_matrix_transformations_cryptog')} variant="dark" subtitle={t('lab.subtitle_mathematics_class')} />

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.m11matrices_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.m11matrices_lab')}</button>
  </div>
  <main className="lg:flex-1 min-w-0 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg:overflow-visible">
  {/* LEFT: Theory & Setup */}
  <div className={`w-full bg-slate-50 dark:bg-[#121212] p-6 rounded-lg shadow flex flex-col gap-4 lg:overflow-y-auto border-t-4 border-indigo-500  ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-gray-800 dark:text-[#ffffff] flex items-center gap-2"><Grid size={20} />  {t('lab.m11matrices_matrix_operations')}</h2>
   <p className="text-gray-600 text-sm">
   
                        {t('lab.m11matrices_matrices_can_represent_geometr')}
                        </p>
   
   <div className={`bg-indigo-50 p-3 rounded-lg border border-indigo-100 mt-2 dark:bg-[#121212] dark:border-[#1c1b1b] flex-col `}>
    <p className="text-sm font-semibold text-indigo-900 mb-1 dark:text-[#ffffff]">{t('lab.m11matrices_transformation_form')}</p>
    <p className="font-mono text-center text-sm">
    {`[ x' ] = [ a b ] [ x ]`} <br />
    {`[ y' ] [ c d ] [ y ]`}
    </p>
   </div>

   <div className="mt-4 space-y-4">
   <h3 className="font-bold text-gray-800 dark:text-[#ffffff] border-b pb-1">{t('lab.m11matrices_define_matrix_a')}</h3>
   <div className="grid grid-cols-2 gap-4">
    <div>
    <label className="block text-xs font-medium text-gray-700 dark:text-[#ffffff] mb-1">{t('lab.m11matrices_a_m00')}</label>
    <input type="number" step="0.5" value={m00} onChange={(e) => setM00(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded" />
    </div>
    <div>
    <label className="block text-xs font-medium text-gray-700 dark:text-[#ffffff] mb-1">{t('lab.m11matrices_b_m01')}</label>
    <input type="number" step="0.5" value={m01} onChange={(e) => setM01(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded" />
    </div>
    <div>
    <label className="block text-xs font-medium text-gray-700 dark:text-[#ffffff] mb-1">{t('lab.m11matrices_c_m10')}</label>
    <input type="number" step="0.5" value={m10} onChange={(e) => setM10(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded" />
    </div>
    <div>
    <label className="block text-xs font-medium text-gray-700 dark:text-[#ffffff] mb-1">{t('lab.m11matrices_d_m11')}</label>
    <input type="number" step="0.5" value={m11} onChange={(e) => setM11(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded" />
    </div>
   </div>

   <div className="pt-2">
    <label className="block text-xs font-medium text-gray-700 dark:text-[#ffffff] mb-2">{t('lab.m11matrices_presets')}</label>
    <div className="flex flex-wrap gap-2">
    <button onClick={() => setPreset('identity')} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium">{t('lab.m11matrices_identity')}</button>
    <button onClick={() => setPreset('scale')} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium">{t('lab.m11matrices_scale_2x')}</button>
    <button onClick={() => setPreset('shearX')} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium">{t('lab.m11matrices_shear_x')}</button>
    <button onClick={() => setPreset('rotate90')} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium">{t('lab.m11matrices_rotate_90')}</button>
    </div>
   </div>
   </div>
  </div>

  {/* MIDDLE: Simulator */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#121212] p-6 rounded-lg shadow flex flex-col items-center justify-center border-t-4 border-fuchsia-500 relative  'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <h2 className="text-xl font-bold text-gray-800 dark:text-[#ffffff] absolute top-4 left-6">{t('lab.m11matrices_transformation_space')}</h2>
   
   <svg viewBox="-10 -10 20 20" className={`w-full h-80 max-w-md mt-6 border border-gray-200 rounded-lg shadow-inner bg-slate-50 dark:bg-[#121212] flex-col `}>
   {/* Grid lines */}
   {[...Array(21)].map((_, i) => (
    <line key={`v-${i}`} x1={i-10} y1="-10" x2={i-10} y2="10" stroke={i === 10 ? "#000" : "#ddd"} strokeWidth={i === 10 ? 0.1 : 0.05} />
   ))}
   {[...Array(21)].map((_, i) => (
    <line key={`h-${i}`} x1="-10" y1={i-10} x2="10" y2={i-10} stroke={i === 10 ? "#000" : "#ddd"} strokeWidth={i === 10 ? 0.1 : 0.05} />
   ))}

   {/* Base Shape */}
   <polygon 
    points={baseShape.map(p => `${p.x},${-p.y}`).join(' ')} 
    fill="rgba(156, 163, 175, 0.3)" 
    stroke="#9ca3af" 
    strokeWidth="0.1" 
    strokeDasharray="0.2"
   />

   {/* Transformed Shape */}
   <polygon 
    points={transformedShape.map(p => `${p.x},${-p.y}`).join(' ')} 
    fill="rgba(168, 85, 247, 0.4)" 
    stroke="#4158D1" 
    strokeWidth="0.15" 
   />
   </svg>
   <div className="mt-4 flex gap-4 text-sm flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t">
   <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-300 border border-gray-400"></div>  {t('lab.m11matrices_original')}</div>
   <div className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-400 border border-indigo-600"></div>  {t('lab.m11matrices_transformed')}</div>
   </div>
  </div>

  {/* RIGHT: Assessment */}
  <div className={`bg-slate-50 dark:bg-[#121212] p-6 rounded-lg shadow flex flex-col gap-4 border-t-4 border-pink-500 `}>
   <h2 className="text-xl font-bold text-gray-800 dark:text-[#ffffff]">{t('lab.m11matrices_cryptography_tasks')}</h2>
   <p className="text-sm text-gray-600 mb-2">{t('lab.m11matrices_use_the_current_matrix_a_to_pe')}</p>

   <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
   <p className="text-sm font-semibold text-gray-800 dark:text-[#ffffff] mb-2">{t('lab.m11matrices_1_find_the_determinant')}</p>
   <p className="text-xs text-gray-600 mb-3">
    <MathText>{"$$ |A| = ad - bc $$"}{t('lab.m11matrices_a_determinant_of_0_means_the_m')}</MathText>
   </p>
   <div className="flex items-center gap-2">
    <input 
    type="number" 
    className="flex-1 min-w-0 p-2 border rounded text-sm" 
    placeholder={t('lab.m11matrices_det_a')}
    value={detAnswer}
    onChange={(e) => { setDetAnswer(e.target.value); setDetStatus("idle"); }}
    />
    <button onClick={checkDet} className="bg-pink-600 text-white px-3 py-2 rounded text-sm font-bold hover:bg-pink-700 dark:text-white dark:text-white dark:bg-pink-500 dark:hover:bg-pink-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-pink-500/40">{t('lab.m11matrices_check')}</button>
   </div>
   {detStatus === "correct" && <p className="text-emerald-600 text-xs mt-2 flex items-center gap-1"><CheckCircle size={14} />  {t('lab.m11matrices_correct')}</p>}
   {detStatus === "incorrect" && <p className="text-red-600 text-xs mt-2 flex items-center gap-1"><XCircle size={14} />  {t('lab.m11matrices_incorrect')}</p>}
   </div>

   <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
   <p className="text-sm font-semibold text-gray-800 dark:text-[#ffffff] mb-2 flex items-center gap-2"><Shield size={16} className="text-pink-600"/>  {t('lab.m11matrices_2_encrypt_vector')}</p>
   <p className="text-xs text-gray-600 mb-3">
    
                             {t('lab.m11matrices_given_the_message_vector')} <span className="font-mono">{t('lab.m11matrices_3_5_t')}</span>{t('lab.m11matrices_multiply_it_by_matrix_a_to_fin')} <span className="font-mono">{t('lab.m11matrices_x_y_t')}</span>.
   </p>
   <div className="flex flex-wrap gap-2">
    <input 
    type="number" 
    className="w-1/2 p-2 border rounded text-sm" 
    placeholder={t("x'")}
    value={cipherX}
    onChange={(e) => { setCipherX(e.target.value); setCipherStatus("idle"); }}
    />
    <input 
    type="number" 
    className="w-1/2 p-2 border rounded text-sm" 
    placeholder={t("y'")}
    value={cipherY}
    onChange={(e) => { setCipherY(e.target.value); setCipherStatus("idle"); }}
    />
   </div>
   <button onClick={checkCipher} className="w-full mt-2 bg-pink-600 text-white px-3 py-2 rounded text-sm font-bold hover:bg-pink-700 dark:text-white dark:text-white dark:bg-pink-500 dark:hover:bg-pink-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-pink-500/40">{t('lab.m11matrices_encrypt_verify')}</button>
   {cipherStatus === "correct" && <p className="text-emerald-600 text-xs mt-2 flex items-center gap-1"><CheckCircle size={14} />  {t('lab.m11matrices_correctly_encrypted')}</p>}
   {cipherStatus === "incorrect" && <p className="text-red-600 text-xs mt-2 flex items-center gap-1"><XCircle size={14} />  {t('lab.m11matrices_incorrect_calculation')}</p>}
   </div>

  </div>
  </main>
 </div>
 );
}
