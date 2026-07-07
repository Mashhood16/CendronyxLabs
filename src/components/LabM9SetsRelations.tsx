import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Users } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface Props {
 onExit?: () => void;
}

type Region = 'unassigned' | 'math' | 'science' | 'both' | 'neither';

interface Student {
 id: string;
 name: string;
 likesMath: boolean;
 likesScience: boolean;
 region: Region;
}

const initialStudents: Student[] = [
 { id: '1', name: 'Alice', likesMath: true, likesScience: false, region: 'unassigned' },
 { id: '2', name: 'Bob', likesMath: false, likesScience: true, region: 'unassigned' },
 { id: '3', name: 'Charlie', likesMath: true, likesScience: true, region: 'unassigned' },
 { id: '4', name: 'Diana', likesMath: false, likesScience: false, region: 'unassigned' },
 { id: '5', name: 'Eve', likesMath: true, likesScience: false, region: 'unassigned' },
 { id: '6', name: 'Frank', likesMath: false, likesScience: true, region: 'unassigned' },
];

export default function LabM9SetsRelations({ onExit }: Props) {
    const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [students, setStudents] = useState<Student[]>(initialStudents);

 const handleDragStart = (e: React.DragEvent, id: string) => {
 e.dataTransfer.setData('studentId', id);
 };

 const handleDrop = (e: React.DragEvent, region: Region) => {
 e.preventDefault();
 const id = e.dataTransfer.getData('studentId');
 setStudents(prev => prev.map(s => s.id === id ? { ...s, region } : s));
 };

 const handleDragOver = (e: React.DragEvent) => {
 e.preventDefault();
 };

 // Assessment
 const [nA, setNA] = useState(0);
 const [nB, setNB] = useState(0);
 const [nIntersect, setNIntersect] = useState(0);
 const [qAns, setQAns] = useState("");
 const [qStatus, setQStatus] = useState<null | boolean>(null);
 const [qExpected, setQExpected] = useState(0);

 useEffect(() => {
 const a = Math.floor(Math.random() * 10) + 10;
 const b = Math.floor(Math.random() * 10) + 10;
 const inter = Math.floor(Math.random() * 5) + 2;
 setNA(a);
 setNB(b);
 setNIntersect(inter);
 setQExpected(a + b - inter);
 }, []);

 const checkAnswer = () => setQStatus(Number(qAns) === qExpected);

 const getCorrectRegion = (s: Student) => {
 if (s.likesMath && s.likesScience) return 'both';
 if (s.likesMath) return 'math';
 if (s.likesScience) return 'science';
 return 'neither';
 };

 const isAllCorrect = students.every(s => s.region === getCorrectRegion(s)) && students.every(s => s.region !== 'unassigned');

 return (
 <div className="flex flex-col min- lg: bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff] min-h-screen lg:h-screen overflow-x-hidden w-full">
  <LabHeader onExit={onExit} title={t('lab.m9setsrelations_grade_9_math_sets_venn_diagram')} />
  

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    
                     {t('lab.m9setsrelations_theory')}
                    </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >{t('lab.m9setsrelations_lab')}</button>
  </div>
  <div className="lg:flex-1 min-w-0 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-6 p-6 lg:overflow-visible">
  {/* Theory Column */}
  <div className={`w-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex-col gap-4 border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2">{t('lab.m9setsrelations_theory_overlapping_sets')}</h2>
   
   <div className="prose prose-slate">
   <h3 className="text-lg font-semibold text-indigo-700">{t('lab.m9setsrelations_what_is_a_set')}</h3>
   <p className="text-slate-600 dark:text-[#a1a1aa]">
    
                             {t('lab.m9setsrelations_a_set_is_a_collection_of_disti')}
                            </p>
   
   <h3 className="text-lg font-semibold text-indigo-700 mt-4">{t('lab.m9setsrelations_key_operations')}</h3>
   <ul className="text-slate-600 dark:text-[#a1a1aa] list-disc pl-5">
    <li><strong>{t('lab.m9setsrelations_intersection_a_b')}</strong>  {t('lab.m9setsrelations_elements_that_belong_to_both_s')}</li>
    <li><strong>{t('lab.m9setsrelations_union_a_b')}</strong>  {t('lab.m9setsrelations_elements_that_belong_to_set_a_')}</li>
    <li><strong>{t('lab.m9setsrelations_complement_a')}</strong>  {t('lab.m9setsrelations_elements_outside_of_set_a')}</li>
   </ul>

   <h3 className="text-lg font-semibold text-indigo-700 mt-4">{t('lab.m9setsrelations_the_union_formula')}</h3>
   <p className={`text-slate-600 dark:text-[#a1a1aa] font-mono bg-slate-100 dark:bg-[#121212] p-2 rounded text-sm text-center flex-col `}>
    
                             {t('lab.m9setsrelations_n_a_b_n_a_n_b_n_a_b')}
                            </p>
   <p className="text-slate-600 dark:text-[#a1a1aa] text-sm mt-2">
    
                             {t('lab.m9setsrelations_we_subtract_the_intersection_o')}
                            </p>
   </div>
  </div>

  {/* Interactive Simulator */}
  <div className={`w-full bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex-col gap-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] '' : ''} rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 flex items-center gap-2">
   <Users className="text-indigo-600" />  {t('lab.m9setsrelations_survey_categorizer')}
                        </h2>
   
   {/* Unassigned Area */}
   <div className={`w-full lg:min-h-[80px] bg-white dark:bg-[#121212] dark:border-[#1c1b1b] lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#121212] rounded-lg p-3 border border-slate-300 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b]  'block' : 'hidden'} lg:block order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
   <div className="text-xs font-bold text-slate-500 dark:text-[#71717a] mb-2 uppercase">{t('lab.m9setsrelations_drag_students_to_categorize')}</div>
   <div className="flex flex-wrap gap-2">
    {students.filter(s => s.region === 'unassigned').map(s => (
    <div
     key={s.id}
     draggable
     onDragStart={(e) => handleDragStart(e, s.id)}
     className={`px-3 py-1.5 bg-slate-50 dark:!bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] shadow-sm rounded-md cursor-grab active:cursor-grabbing text-sm font-medium hover:bg-slate-50 dark:!bg-[#121212] transition-colors flex-col `}
    >
     {s.name} ({s.likesMath ? 'M' : ''}{s.likesMath && s.likesScience ? ', ' : ''}{s.likesScience ? 'S' : ''}{!s.likesMath && !s.likesScience ? 'None' : ''})
    </div>
    ))}
    {students.filter(s => s.region === 'unassigned').length === 0 && (
    <span className="text-slate-400 italic text-sm py-1">{t('lab.m9setsrelations_all_students_categorized')}</span>
    )}
   </div>
   </div>

   {/* Venn Diagram Area */}
   <div className={`relative w-full h-80 bg-slate-50 dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-[#1c1b1b] flex items-center justify-center overflow- flex-col `}>
   
   {/* Left Circle - Math */}
   <div 
    className="absolute w-56 h-56 rounded-full border-4 border-blue-400 bg-blue-100/40 flex flex-col items-start justify-center p-6 -translate-x-16 transition-colors hover:bg-blue-200/50"
    onDragOver={handleDragOver}
    onDrop={(e) => handleDrop(e, 'math')}
   >
    <span className="text-sm font-bold text-blue-800 absolute top-6 left-6 dark:text-[#ffffff]">{t('lab.m9setsrelations_math_only')}</span>
    <div className="flex flex-col gap-1 w-full mt-4 items-start">
    {students.filter(s => s.region === 'math').map(s => (
     <div key={s.id} draggable onDragStart={(e) => handleDragStart(e, s.id)} className="text-xs bg-slate-50 dark:bg-[#121212]/90 border border-blue-300 px-2 py-1 rounded shadow-sm cursor-grab">{s.name}</div>
    ))}
    </div>
   </div>

   {/* Right Circle - Science */}
   <div 
    className="absolute w-56 h-56 rounded-full border-4 border-green-400 bg-green-100/40 flex flex-col items-end justify-center p-6 translate-x-16 transition-colors hover:bg-green-200/50"
    onDragOver={handleDragOver}
    onDrop={(e) => handleDrop(e, 'science')}
   >
    <span className="text-sm font-bold text-green-800 absolute top-6 right-6 dark:text-[#ffffff]">{t('lab.m9setsrelations_science_only')}</span>
    <div className="flex flex-col gap-1 w-full mt-4 items-end">
    {students.filter(s => s.region === 'science').map(s => (
     <div key={s.id} draggable onDragStart={(e) => handleDragStart(e, s.id)} className="text-xs bg-slate-50 dark:bg-[#121212]/90 border border-green-300 px-2 py-1 rounded shadow-sm cursor-grab">{s.name}</div>
    ))}
    </div>
   </div>

   {/* Intersection - Both */}
   <div 
    className="absolute w-24 h-48 flex flex-col items-center justify-center z-10 rounded-3xl transition-colors hover:bg-indigo-200/40"
    onDragOver={handleDragOver}
    onDrop={(e) => handleDrop(e, 'both')}
   >
    <span className="text-sm font-bold text-indigo-900 absolute top-2 dark:text-[#ffffff]">{t('lab.m9setsrelations_both')}</span>
    <div className="flex flex-col gap-1 w-full mt-6 items-center">
    {students.filter(s => s.region === 'both').map(s => (
     <div key={s.id} draggable onDragStart={(e) => handleDragStart(e, s.id)} className="text-xs bg-slate-50 dark:bg-[#121212]/90 border border-indigo-300 px-2 py-1 rounded shadow-sm cursor-grab">{s.name}</div>
    ))}
    </div>
   </div>

   {/* Neither Container */}
   <div 
    className="absolute bottom-3 right-3 w-32 h-32 border-2 border-dashed border-slate-400 dark:border-[#1c1b1b] bg-slate-100 dark:bg-[#121212]/80 flex flex-col items-center p-3 rounded-lg transition-colors hover:bg-slate-200 dark:bg-[#121212]"
    onDragOver={handleDragOver}
    onDrop={(e) => handleDrop(e, 'neither')}
   >
    <span className="text-xs font-bold text-slate-600 dark:text-[#a1a1aa] mb-1">{t('lab.m9setsrelations_neither')}</span>
    <div className="flex flex-wrap justify-center gap-1 lg:overflow-y-auto">
    {students.filter(s => s.region === 'neither').map(s => (
     <div key={s.id} draggable onDragStart={(e) => handleDragStart(e, s.id)} className="text-xs bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] px-2 py-1 rounded shadow-sm cursor-grab">{s.name}</div>
    ))}
    </div>
   </div>

   </div>
  </div>

  {/* Data & Assessment */}
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm p-6 flex-col gap-6 border border-slate-200 dark:border-[#1c1b1b] ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
   <h2 className="text-xl font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2">{t('lab.m9setsrelations_analysis_assessment')}</h2>
   
   <div className="flex-1 min-w-0 bg-slate-50 dark:bg-[#121212] border rounded-lg p-4 flex flex-col justify-center items-center text-center">
   {isAllCorrect ? (
    <div className="text-green-600 flex flex-col items-center gap-2">
    <CheckCircle size={48} />
    <h3 className="font-bold text-lg">{t('lab.m9setsrelations_diagram_complete')}</h3>
    <p className="text-sm">{t('lab.m9setsrelations_you_have_correctly_categorized')}</p>
    </div>
   ) : (
    <div className="text-slate-500 dark:text-[#71717a]">
    
                                     {t('lab.m9setsrelations_categorize_all_students_correc')}
                                     </div>
   )}
   </div>

   <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 dark:bg-[#121212] dark:border-[#1c1b1b]">
   <h3 className="font-bold text-indigo-800 mb-2 dark:text-[#ffffff]">{t('lab.m9setsrelations_word_problem')}</h3>
   <p className="text-sm text-slate-700 dark:text-[#ffffff] mb-4">
    
                             {t('lab.m9setsrelations_in_a_class_survey_n_math')} {nA}  {t('lab.m9setsrelations_and_n_science')} {nB}{t('lab.m9setsrelations_if_n_math_science')} {nIntersect}{t('lab.m9setsrelations_how_many_students_like')} <b>{t('lab.m9setsrelations_at_least_one')}</b>  {t('lab.m9setsrelations_of_the_subjects_n_math_science')}
                            </p>
   <div className="flex flex-wrap gap-2">
    <input 
    type="number" value={qAns} onChange={(e) => setQAns(e.target.value)}
    className="flex-1 min-w-0 border rounded px-2 py-1 outline-none focus:border-indigo-400"
    placeholder={t('lab.m9setsrelations_total_union')}
    />
    <button onClick={checkAnswer} className="px-3 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40">{t('lab.m9setsrelations_check')}</button>
   </div>
   {qStatus !== null && (
    <div className={`mt-2 flex items-center gap-1 text-sm font-bold ${qStatus ? 'text-green-600' : 'text-red-500'}`}>
    {qStatus ? <CheckCircle size={16} /> : <XCircle size={16} />}
    {qStatus ? 'Correct! n(A∪B) = n(A) + n(B) - n(A∩B)' : 'Incorrect. Use the Union formula!'}
    </div>
   )}
   </div>
  </div>
  </div>
 </div>
 );
}
