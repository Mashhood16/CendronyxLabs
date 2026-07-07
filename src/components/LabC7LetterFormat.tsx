import { useState } from 'react';
import { CheckCircle, Type, Palette, Baseline } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabC7LetterFormat({ onExit }: LabProps) {
    const { t } = useTranslate();
 const [content, setContent] = useState('');
 const [font, setFont] = useState('Arial');
 const [size, setSize] = useState('12');
 const [color, setColor] = useState('text-slate-800 dark:text-slate-100');

 const isFontCorrect = font === 'Calibri';
 const isSizeCorrect = size === '11';
 const isColorCorrect = color === 'text-blue-700';
 const hasSignature = content.toLowerCase().includes('signature') || content.toLowerCase().includes('name') || content.toLowerCase().includes('class');

 const isSuccess = isFontCorrect && isSizeCorrect && isColorCorrect && hasSignature && content.length > 50;

 return (
 <div className="flex flex-col min- lg: font-sans bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.c7letterformat_formal_letter_formatting')} />
  <div className="flex-1 px-8 pb-8 flex flex-col lg:overflow-y-auto">

  <p className="text-slate-600 dark:text-[#a1a1aa] mb-6">{t('lab.c7letterformat_write_an_application_using_spe')}</p>

  {isSuccess && (
   <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl mb-6 flex items-center border border-emerald-300 shadow-sm">
   <CheckCircle className="w-6 h-6 mr-3" />
   <span className="font-bold">{t('lab.c7letterformat_perfect_formatting')}</span>  {t('lab.c7letterformat_you_have_applied_all_the_requi')}
                        </div>
  )}

  <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-xl border border-slate-300 dark:border-[#1c1b1b] flex flex-col flex-1 overflow-hidden max-w-4xl mx-auto w-full">
   {/* Word Processor Toolbar */}
   <div className="bg-blue-50 border-b border-blue-200 p-3 flex gap-4 items-center dark:bg-teal-950/20 dark:border-teal-900">
   {/* Font Family */}
   <div className="flex items-center bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded overflow-hidden">
    <Type className="w-4 h-4 mx-2 text-slate-400" />
    <select 
    value={font} 
    onChange={e => setFont(e.target.value)}
    className="py-1 px-2 outline-none border-l border-slate-300 dark:border-[#1c1b1b] bg-transparent text-sm w-32"
    >
    <option value="Arial">{t('lab.c7letterformat_arial')}</option>
    <option value="Times New Roman">{t('lab.c7letterformat_times_new_roman')}</option>
    <option value="Calibri">{t('lab.c7letterformat_calibri')}</option>
    <option value="Verdana">{t('lab.c7letterformat_verdana')}</option>
    </select>
   </div>

   {/* Font Size */}
   <div className="flex items-center bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded overflow-hidden">
    <Baseline className="w-4 h-4 mx-2 text-slate-400" />
    <select 
    value={size} 
    onChange={e => setSize(e.target.value)}
    className="py-1 px-2 outline-none border-l border-slate-300 dark:border-[#1c1b1b] bg-transparent text-sm w-16"
    >
    <option value="10">10</option>
    <option value="11">11</option>
    <option value="12">12</option>
    <option value="14">14</option>
    <option value="16">16</option>
    </select>
   </div>

   {/* Font Color */}
   <div className="flex items-center bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded overflow-hidden">
    <Palette className="w-4 h-4 mx-2 text-slate-400" />
    <select 
    value={color} 
    onChange={e => setColor(e.target.value)}
    className="py-1 px-2 outline-none border-l border-slate-300 dark:border-[#1c1b1b] bg-transparent text-sm w-24"
    >
    <option value="text-slate-800 dark:text-slate-100">{t('lab.c7letterformat_black')}</option>
    <option value="text-rose-600">{t('lab.c7letterformat_red')}</option>
    <option value="text-emerald-600">{t('lab.c7letterformat_green')}</option>
    <option value="text-blue-700">{t('lab.c7letterformat_blue')}</option>
    </select>
   </div>
   </div>

   {/* Paper */}
   <div className="flex-1 bg-slate-100 dark:bg-[#121212] p-8 lg:overflow-y-auto flex justify-center">
   <textarea
    className={`w-full max-w-2xl min-h-full bg-slate-50 dark:bg-[#121212] shadow-md border border-slate-200 dark:border-[#1c1b1b] p-12 resize-none outline-none transition-all ${font === 'Calibri' ? 'font-sans' : font === 'Times New Roman' ? 'font-serif' : font === 'Verdana' ? 'font-mono' : 'font-sans'} ${size === '11' ? 'text-sm' : size === '10' ? 'text-xs' : size === '14' ? 'text-lg' : size === '16' ? 'text-xl' : 'text-base'} ${color}`}
    placeholder={t('lab.c7letterformat_to_the_principal_10_10_10_your')}
    value={content}
    onChange={(e) => setContent(e.target.value)}
   />
   </div>
  </div>
  </div>

  <div className="w-80 bg-slate-50 dark:bg-[#121212] p-6 border-l border-slate-200 dark:border-[#1c1b1b] shadow-[-10px_0_20px_rgba(0,0,0,0.05)] z-10 flex flex-col lg:overflow-y-auto">
  <h2 className="font-bold text-lg mb-4">{t('lab.c7letterformat_requirements_checklist')}</h2>
  <ul className="space-y-4">
   <li className="flex items-center text-slate-600 dark:text-[#a1a1aa]">
   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${isFontCorrect ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-[#1c1b1b]'}`}>
    {isFontCorrect && <CheckCircle className="w-4 h-4" />}
   </div>
   
                        {t('lab.c7letterformat_font_type_calibri')}
                        </li>
   <li className="flex items-center text-slate-600 dark:text-[#a1a1aa]">
   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${isSizeCorrect ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-[#1c1b1b]'}`}>
    {isSizeCorrect && <CheckCircle className="w-4 h-4" />}
   </div>
   
                        {t('lab.c7letterformat_font_size_11')}
                        </li>
   <li className="flex items-center text-slate-600 dark:text-[#a1a1aa]">
   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${isColorCorrect ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-[#1c1b1b]'}`}>
    {isColorCorrect && <CheckCircle className="w-4 h-4" />}
   </div>
   
                        {t('lab.c7letterformat_font_color_blue')}
                        </li>
   <li className="flex items-center text-slate-600 dark:text-[#a1a1aa]">
   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${hasSignature ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-[#1c1b1b]'}`}>
    {hasSignature && <CheckCircle className="w-4 h-4" />}
   </div>
   
                        {t('lab.c7letterformat_include_name_class_signature')}
                        </li>
  </ul>
  </div>
 </div>
 );
}
