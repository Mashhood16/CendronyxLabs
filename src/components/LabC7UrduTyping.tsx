import { useState } from 'react';
import { Keyboard, Type } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabC7UrduTyping({ onExit }: LabProps) {
    const { t } = useTranslate();
 const [text, setText] = useState('');
 const [urduMode, setUrduMode] = useState(false);

 // Simplified mapping for Pak Urdu Installer phonetic layout
 const urduMap: Record<string, string> = {
 'a': 'ا', 'b': 'ب', 'c': 'چ', 'd': 'د', 'e': 'ع', 'f': 'ف', 'g': 'گ', 'h': 'ہ', 'i': 'ی', 'j': 'ج', 
 'k': 'ک', 'l': 'ل', 'm': 'م', 'n': 'ن', 'o': 'و', 'p': 'پ', 'q': 'ق', 'r': 'ر', 's': 'س', 't': 'ت', 
 'u': 'ئ', 'v': 'ط', 'w': 'و', 'x': 'ش', 'y': 'ے', 'z': 'ز', ' ': ' ', '\n': '\n'
 };

 const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
 if (urduMode) {
  // Don't intercept control keys like Backspace, Enter, etc.
  if (e.key.length === 1) {
  e.preventDefault();
  const lowerKey = e.key.toLowerCase();
  const urduChar = urduMap[lowerKey] || e.key;
  setText(prev => prev + urduChar);
  }
 }
 };

 return (
 <div className="flex flex-col min- lg: font-sans bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.c7urdutyping_urdu_typing_practice')} />
  <div className="flex-1 px-8 pb-8 flex flex-col lg:overflow-y-auto">

  <p className="text-slate-600 dark:text-[#a1a1aa] mb-8">{t('lab.c7urdutyping_toggle_the_pak_urdu_installer_')}</p>

  <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col flex-1 overflow-hidden">
   {/* Editor Toolbar */}
   <div className="border-b border-slate-200 dark:border-[#1c1b1b] bg-slate-100 dark:bg-[#121212] p-2 flex gap-2 items-center">
   <button 
    onClick={() => setUrduMode(!urduMode)}
    className={`px-4 py-2 rounded font-medium flex items-center transition-colors ${urduMode ? 'bg-emerald-600 text-white' : 'bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] text-slate-700 dark:text-[#ffffff] hover:bg-slate-50 dark:bg-[#121212]'}`}
   >
    <Keyboard className="w-4 h-4 mr-2" />
    {urduMode ? 'Urdu Keyboard Active' : 'Enable Urdu Keyboard'}
   </button>
   <span className="text-sm text-slate-500 dark:text-[#71717a] ml-4 font-medium italic">
    {urduMode ? 'Phonetic typing enabled (e.g., a=ا, b=ب, p=پ)' : 'Standard English typing'}
   </span>
   </div>

   {/* Text Area */}
   <textarea
   className={`flex-1 px-8 pb-8 text-2xl resize-none outline-none ${urduMode ? 'text-right font-urdu' : 'text-left font-sans'}`}
   placeholder={urduMode ? "یہاں لکھیں..." : "Start typing here..."}
   value={text}
   onChange={(e) => {
    if (!urduMode) setText(e.target.value);
   }}
   onKeyDown={handleKeyDown}
   dir={urduMode ? 'rtl' : 'ltr'}
   />
  </div>
  </div>

  <div className="w-80 bg-slate-50 dark:bg-[#121212] p-6 border-l border-slate-200 dark:border-[#1c1b1b] shadow-[-10px_0_20px_rgba(0,0,0,0.05)] z-10 flex flex-col lg:overflow-y-auto">
  <h2 className="font-bold text-lg mb-4 flex items-center"><Type className="w-5 h-5 mr-2 text-blue-500"/>  {t('lab.c7urdutyping_phonetic_map')}</h2>
  <p className="text-sm text-slate-600 dark:text-[#a1a1aa] mb-4">{t('lab.c7urdutyping_a_simplified_reference_for_the')}</p>
  
  <div className="grid grid-cols-2 gap-2 text-sm">
   {Object.entries(urduMap).map(([eng, urd]) => {
   if (eng === ' ' || eng === '\n') return null;
   return (
    <div key={eng} className="flex justify-between items-center bg-slate-50 dark:bg-[#121212] p-2 rounded border border-slate-100">
    <span className="font-mono font-bold text-slate-500 dark:text-[#71717a]">{eng.toUpperCase()}</span>
    <span className="text-xl font-bold text-slate-800 dark:text-[#ffffff]">{urd}</span>
    </div>
   )
   })}
  </div>
  </div>
 </div>
 );
}
