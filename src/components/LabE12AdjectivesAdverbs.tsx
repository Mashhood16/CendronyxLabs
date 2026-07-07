import { useState, useEffect } from 'react';
import { SlidersHorizontal, ArrowLeft, FastForward, Car, BookOpen } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

export default function LabE12AdjectivesAdverbs({ onExit }: { onExit?: () => void }) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [speedSlider, setSpeedSlider] = useState(50);
 const [frequencySlider, setFrequencySlider] = useState(50);
 
 const [adjectiveMode, setAdjectiveMode] = useState<'descriptive' | 'quantitative'>('descriptive');
 const [selectedAdj, setSelectedAdj] = useState<string | null>(null);
 const adjTarget = adjectiveMode === 'descriptive' ? 'red' : 'three';
 const adjSentence = adjectiveMode === 'descriptive' 
  ? "The [red] car raced down the track." 
  : "I saw [three] cars on the track.";

 // Derived values for the simulation
 const speedText = speedSlider < 30 ? 'slowly' : speedSlider > 70 ? 'rapidly' : 'steadily';
 const freqText = frequencySlider < 30 ? 'rarely' : frequencySlider > 70 ? 'frequently' : 'sometimes';
 
 const baseDuration = 5; // seconds to cross screen
 const speedMultiplier = speedSlider / 50; // 0.1 to 2.0
 const currentDuration = Math.max(0.5, baseDuration / (speedMultiplier || 0.1));

 return (
  <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
   <LabHeader onExit={onExit} title={t('lab.e12adjectivesadverbs_modifier_engine_lab')} />

   
   {/* Mobile Tab Navigation */}
   <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
     onClick={() => setActiveMobileTab('theory')}
     className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
    >
     
                      {t('lab.e12adjectivesadverbs_theory')}
                     </button>
   <button 
     onClick={() => setActiveMobileTab('lab')}
     className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
    >{t('lab.e12adjectivesadverbs_lab')}</button>
  </div>
   
   <main className="flex-grow p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 lg:overflow-visible">
    {/* Window 1: Theory */}
    <section className={`w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] mb-4 flex items-center">
      <BookOpen className="mr-2 text-indigo-500" />  {t('lab.e12adjectivesadverbs_grammar_theory')}
                          </h2>
     <div className="prose prose-sm text-slate-600 dark:text-[#a1a1aa] overflow-y-auto h-[500px] pr-2">
      <p>
       <strong>{t('lab.e12adjectivesadverbs_modifiers')}</strong>  {t('lab.e12adjectivesadverbs_are_words_phrases_or_clauses_t')}
                               </p>
      
      <h4 className="font-bold text-slate-800 dark:text-gray-200 mt-4">{t('lab.e12adjectivesadverbs_adjective_taxonomy')}</h4>
      <p className="mt-2">{t('lab.e12adjectivesadverbs_adjectives_modify_nouns_and_pr')} <em>{t('lab.e12adjectivesadverbs_which_one')}</em>, <em>{t('lab.e12adjectivesadverbs_what_kind')}</em>{t('lab.e12adjectivesadverbs_or')} <em>{t('lab.e12adjectivesadverbs_how_many')}</em></p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
       <li><strong>{t('lab.e12adjectivesadverbs_descriptive')}</strong>  {t('lab.e12adjectivesadverbs_provides_detail_about_physical')} <em>{t('lab.e12adjectivesadverbs_red')}</em>  {t('lab.e12adjectivesadverbs_car')}</li>
       <li><strong>{t('lab.e12adjectivesadverbs_quantitative')}</strong>  {t('lab.e12adjectivesadverbs_indicates_exact_or_approximate')} <em>{t('lab.e12adjectivesadverbs_three')}</em>  {t('lab.e12adjectivesadverbs_cars')} <em>{t('lab.e12adjectivesadverbs_many')}</em>  {t('lab.e12adjectivesadverbs_people')}</li>
       <li><strong>{t('lab.e12adjectivesadverbs_demonstrative')}</strong>  {t('lab.e12adjectivesadverbs_points_to_specific_nouns_e_g')} <em>{t('lab.e12adjectivesadverbs_this')}</em>  {t('lab.e12adjectivesadverbs_car_1')} <em>{t('lab.e12adjectivesadverbs_those')}</em>  {t('lab.e12adjectivesadverbs_buildings')}</li>
       <li><strong>{t('lab.e12adjectivesadverbs_possessive')}</strong>  {t('lab.e12adjectivesadverbs_shows_ownership_e_g')} <em>My</em>  {t('lab.e12adjectivesadverbs_car_1')} <em>{t('lab.e12adjectivesadverbs_her')}</em>  {t('lab.e12adjectivesadverbs_book')}</li>
      </ul>

      <hr className="my-6 border-slate-200 dark:border-gray-800" />

      <h4 className="font-bold text-slate-800 dark:text-gray-200 mt-4">{t('lab.e12adjectivesadverbs_adverbial_vectors')}</h4>
      <p className="mt-2">
       
                                {t('lab.e12adjectivesadverbs_adverbs_modify_verbs_adjective')}
                               </p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
       <li><strong>{t('lab.e12adjectivesadverbs_manner')}</strong>  {t('lab.e12adjectivesadverbs_how_an_action_happens_e_g_the_')} <em>{t('lab.e12adjectivesadverbs_slowly')}</em> or <em>{t('lab.e12adjectivesadverbs_rapidly')}</em>).</li>
       <li><strong>{t('lab.e12adjectivesadverbs_frequency')}</strong>  {t('lab.e12adjectivesadverbs_how_often_an_action_happens_e_')} <em>{t('lab.e12adjectivesadverbs_rarely')}</em> or <em>{t('lab.e12adjectivesadverbs_frequently')}</em>  {t('lab.e12adjectivesadverbs_drives_by')}</li>
       <li><strong>{t('lab.e12adjectivesadverbs_degree')}</strong>  {t('lab.e12adjectivesadverbs_the_intensity_of_the_modifier_')} <em>{t('lab.e12adjectivesadverbs_very')}</em>  {t('lab.e12adjectivesadverbs_fast')} <em>{t('lab.e12adjectivesadverbs_somewhat')}</em>  {t('lab.e12adjectivesadverbs_tired')}</li>
      </ul>
     </div>
    </section>

    {/* Window 2: Controls */}
    <section className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-col '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
     <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
      <SlidersHorizontal className="text-[#4158D1]" />  {t('lab.e12adjectivesadverbs_syntactic_equalizer')}
                          </h2>

     <div className="flex-1 overflow-y-auto space-y-8">
      {/* Adverb Sliders */}
      <div className={`w-full p-5 rounded-2xl border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] flex-col '' : ''} ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
       <h3 className="font-bold text-slate-800 dark:text-white mb-4">{t('lab.e12adjectivesadverbs_adverbial_injection')}</h3>
       
       <div className="space-y-6">
        <div>
         <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-gray-400 mb-2 uppercase">
          <span>{t('lab.e12adjectivesadverbs_adverb_of_manner')}</span>
          <span className="text-[#4158D1]">{speedText}</span>
         </div>
         <input 
          type="range" min="10" max="100" value={speedSlider} 
          onChange={e => setSpeedSlider(Number(e.target.value))}
          className="w-full accent-[#4158D1]"
         />
         <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>{t('lab.e12adjectivesadverbs_slowly_1')}</span>
          <span>{t('lab.e12adjectivesadverbs_rapidly_1')}</span>
         </div>
        </div>

        <div>
         <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-gray-400 mb-2 uppercase">
          <span>{t('lab.e12adjectivesadverbs_adverb_of_frequency')}</span>
          <span className="text-purple-500">{freqText}</span>
         </div>
         <input 
          type="range" min="10" max="100" value={frequencySlider} 
          onChange={e => setFrequencySlider(Number(e.target.value))}
          className="w-full accent-purple-500"
         />
         <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>{t('lab.e12adjectivesadverbs_rarely_1')}</span>
          <span>{t('lab.e12adjectivesadverbs_frequently_1')}</span>
         </div>
        </div>
       </div>

       <div className={`mt-6 p-4 rounded-lg bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-gray-800 flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
        <p className="text-sm font-medium dark:text-gray-300">
         
                                          {t('lab.e12adjectivesadverbs_the_car')} <span className="font-bold text-purple-500">{freqText}</span>  {t('lab.e12adjectivesadverbs_drives')} <span className="font-bold text-[#4158D1]">{speedText}</span>  {t('lab.e12adjectivesadverbs_across_the_track')}
                                         </p>
       </div>
      </div>

      {/* Adjective Classifier */}
      <div className={`p-5 rounded-2xl border border-slate-200 dark:border-[#2a2a2a] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
       <h3 className="font-bold text-slate-800 dark:text-white mb-4">{t('lab.e12adjectivesadverbs_adjective_taxonomy')}</h3>
       <div className="flex gap-2 mb-4">
        <button onClick={() => { setAdjectiveMode('descriptive'); setSelectedAdj(null); }} className={`flex-1 py-1.5 text-xs font-bold rounded ${adjectiveMode === 'descriptive' ? 'bg-[#4158D1] text-white' : 'bg-slate-100 dark:bg-[#1c1b1b] text-slate-600 dark:bg-[#2a2a2a] dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>{t('lab.e12adjectivesadverbs_descriptive_1')}</button>
        <button onClick={() => { setAdjectiveMode('quantitative'); setSelectedAdj(null); }} className={`flex-1 py-1.5 text-xs font-bold rounded ${adjectiveMode === 'quantitative' ? 'bg-[#4158D1] text-white' : 'bg-slate-100 dark:bg-[#1c1b1b] text-slate-600 dark:bg-[#2a2a2a] dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>{t('lab.e12adjectivesadverbs_quantitative_1')}</button>
       </div>
       
       <p className="text-lg font-medium text-center py-3 bg-slate-50 dark:bg-[#1a1a1a] rounded-lg border border-slate-200 dark:border-gray-800 mb-4 dark:text-white">
        {adjSentence}
       </p>

       <div className="grid grid-cols-2 gap-2">
        {['Descriptive', 'Quantitative', 'Demonstrative', 'Possessive'].map(type => (
         <button 
          key={type}
          onClick={() => setSelectedAdj(type)}
          className={`p-2 text-sm font-bold rounded-lg border ${selectedAdj === type ? (adjectiveMode.toLowerCase() === type.toLowerCase() ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-red-500 text-white border-red-500') : 'bg-slate-50 dark:bg-[#1a1a1a] border-slate-300 dark:border-gray-700 dark:text-gray-300'}`}
         >
          {type}
         </button>
        ))}
       </div>
      </div>
     </div>
    </section>

    {/* Window 3: Simulation */}
    <section className={`bg-slate-100 dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] relative items-center justify-center p-8 overflow- min-h-[500px] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
     <div className="absolute inset-0 opacity-10 dark:opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#4158D1 1px, transparent 1px), linear-gradient(90deg, #4158D1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
     
     {/* The Track */}
     <div className="absolute top-1/2 left-0 right-0 h-32 -mt-16 bg-slate-800 dark:bg-[#111] border-y-4 border-slate-400 dark:border-[#333] flex items-center shadow-2xl">
      {/* Dashed line */}
      <div className="w-full h-2 border-t-4 border-dashed border-yellow-500" />

      {/* The Cars */}
      {Array.from({ length: adjectiveMode === 'quantitative' ? 3 : 1 }).map((_, i) => (
       <div 
        key={i}
        className="absolute left-[-100px]"
        style={{
         animation: `drive ${currentDuration}s linear infinite`,
         animationDelay: `${i * 0.5}s`,
         opacity: (Math.random() * 100) < frequencySlider ? 1 : 0.1
        }}
       >
        <Car className={`w-24 h-24 ${adjectiveMode === 'descriptive' ? 'text-red-500' : 'text-blue-500'}`} />
       </div>
      ))}
     </div>

     <style>{`
      @keyframes drive {
       from { transform: translateX(-100px); }
       to { transform: translateX(1200px); }
      }
     `}</style>
    </section>
   </main>
  </div>
 );
}
