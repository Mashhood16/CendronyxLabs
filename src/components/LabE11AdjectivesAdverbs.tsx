import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, RefreshCw, BookOpen, Activity, Target } from 'lucide-react';

interface WordItem { id: string; text: string; category: string; }

export default function LabE11AdjectivesAdverbs({ onExit }: { onExit?: () => void }) {
    const [complexity, setComplexity] = useState<number>(2);
    const [bank, setBank] = useState<WordItem[]>([]);
    const [sentence, setSentence] = useState<WordItem[]>([]);
    const [feedback, setFeedback] = useState<string>("Click words from the bank to build the sequence.");
    const [attempts, setAttempts] = useState<{ attempt: number, score: number, max: number }[]>([]);
    const [assessmentAnswer, setAssessmentAnswer] = useState('');
    const [assessmentResult, setAssessmentResult] = useState('');

    const levels: Record<number, { words: WordItem[], correct: string[], templateParts: string[] }> = {
        1: {
            words: [
                { id: 'a1', text: 'beautiful', category: 'Opinion (Adj)' },
                { id: 'a2', text: 'red', category: 'Color (Adj)' },
                { id: 'n1', text: 'car.', category: 'Noun' }
            ],
            correct: ['a1', 'a2', 'n1'],
            templateParts: ["He drives a ", ""]
        },
        2: {
            words: [
                { id: 'a4', text: 'old', category: 'Age (Adj)' },
                { id: 'a2', text: 'small', category: 'Size (Adj)' },
                { id: 'a6', text: 'dining', category: 'Purpose (Adj)' },
                { id: 'a1', text: 'beautiful', category: 'Opinion (Adj)' },
                { id: 'a5', text: 'wooden', category: 'Material (Adj)' },
                { id: 'a3', text: 'round', category: 'Shape (Adj)' },
                { id: 'n1', text: 'table.', category: 'Noun' }
            ],
            correct: ['a1', 'a2', 'a4', 'a3', 'a5', 'a6', 'n1'],
            templateParts: ["I bought a ", ""]
        },
        3: {
            words: [
                { id: 'adv1', text: 'quickly', category: 'Manner (Adv)' },
                { id: 'adv3', text: 'yesterday.', category: 'Time (Adv)' },
                { id: 'a2', text: 'little', category: 'Size (Adj)' },
                { id: 'adv2', text: 'outside', category: 'Place (Adv)' },
                { id: 'n1', text: 'fox', category: 'Noun' },
                { id: 'a1', text: 'clever', category: 'Opinion (Adj)' }
            ],
            correct: ['a1', 'a2', 'n1', 'adv1', 'adv2', 'adv3'],
            templateParts: ["The ", " ran "]
        }
    };

    const currentLevel = levels[complexity];

    useEffect(() => {
        resetActivity();
    }, [complexity]);

    const handleBankClick = (w: WordItem) => {
        setBank(prev => prev.filter(item => item.id !== w.id));
        setSentence(prev => [...prev, w]);
        setFeedback("Word added. Keep going!");
    };

    const handleSentenceClick = (w: WordItem) => {
        setSentence(prev => prev.filter(item => item.id !== w.id));
        setBank(prev => [...prev, w]);
        setFeedback("Word returned to bank.");
    };

    const checkAnswers = () => {
        if (sentence.length < currentLevel.correct.length) {
            setFeedback("Please use all the words from the bank first.");
            return;
        }

        let isCorrect = true;
        let score = 0;
        for (let i = 0; i < sentence.length; i++) {
            if (sentence[i].id === currentLevel.correct[i]) {
                score++;
            } else {
                isCorrect = false;
            }
        }

        const maxScore = currentLevel.correct.length;
        setAttempts(prev => [...prev, { attempt: prev.length + 1, score, max: maxScore }]);

        if (isCorrect) {
            setFeedback(`Perfect! The sequence is grammatically correct.`);
        } else {
            setFeedback(`Not quite right. You got ${score} words in the correct position. Try again.`);
        }
    };

    const resetActivity = () => {
        setBank([...currentLevel.words]);
        setSentence([]);
        setFeedback("Click words from the bank to build the sequence.");
    };

    const checkAssessment = () => {
        if (assessmentAnswer.toUpperCase().includes('MPT')) {
            setAssessmentResult('Correct! MPT stands for Manner, Place, Time.');
        } else {
            setAssessmentResult('Incorrect. Hint: It is a 3-letter acronym starting with M.');
        }
    };

    const renderGraph = () => {
        if (attempts.length === 0) return null;
        const width = 200;
        const height = 80;
        const maxAttempts = Math.max(1, attempts.length - 1);
        
        const points = attempts.map((a, i) => {
            const x = (i / maxAttempts) * width;
            const y = height - (a.score / a.max) * height;
            return `${x},${y}`;
        }).join(' ');

        return (
            <div className="mt-6 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    Accuracy Over Time
                </h3>
                <svg viewBox={`-10 -10 ${width + 20} ${height + 20}`} className="w-full h-24 overflow-visible">
                    <line x1="0" y1="0" x2="0" y2={height} stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-600" />
                    <line x1="0" y1={height} x2={width} y2={height} stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-600" />
                    
                    <polyline fill="none" stroke="#10b981" strokeWidth="3" points={points} />
                    {attempts.map((a, i) => {
                        const x = (i / maxAttempts) * width;
                        const y = height - (a.score / a.max) * height;
                        return (
                            <g key={i}>
                                <circle cx={x} cy={y} r="4" fill="#10b981" />
                                <text x={x} y={y - 10} fontSize="10" fill="currentColor" textAnchor="middle" className="text-slate-600 dark:text-slate-400">
                                    {Math.round((a.score / a.max) * 100)}%
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        );
    };

    const renderSentenceUI = () => {
        if (complexity === 3) {
            const adjPart = sentence.filter(w => w.category.includes('Adj') || w.category === 'Noun');
            const advPart = sentence.filter(w => w.category.includes('Adv'));
            return (
                <div className="flex flex-wrap items-center gap-2 text-xl font-serif">
                    <span>{currentLevel.templateParts[0]}</span>
                    {adjPart.map(w => (
                        <span key={w.id} onClick={() => handleSentenceClick(w)} className="cursor-pointer px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-100 rounded-lg shadow-sm border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors">
                            {w.text}
                        </span>
                    ))}
                    {adjPart.length === 0 && <span className="inline-block w-24 h-1 border-b-2 border-dashed border-slate-300 dark:border-slate-600"></span>}
                    <span>{currentLevel.templateParts[1]}</span>
                    {advPart.map(w => (
                        <span key={w.id} onClick={() => handleSentenceClick(w)} className="cursor-pointer px-3 py-1 bg-sky-100 dark:bg-sky-900/50 text-sky-900 dark:text-sky-100 rounded-lg shadow-sm border border-sky-200 dark:border-sky-700 hover:bg-sky-200 dark:hover:bg-sky-800 transition-colors">
                            {w.text}
                        </span>
                    ))}
                    {advPart.length === 0 && <span className="inline-block w-32 h-1 border-b-2 border-dashed border-slate-300 dark:border-slate-600"></span>}
                </div>
            );
        }

        return (
            <div className="flex flex-wrap items-center gap-2 text-xl font-serif">
                <span>{currentLevel.templateParts[0]}</span>
                {sentence.length === 0 ? (
                    <span className="inline-block w-64 h-1 border-b-2 border-dashed border-slate-300 dark:border-slate-600"></span>
                ) : (
                    sentence.map((w) => (
                        <span 
                            key={w.id} 
                            onClick={() => handleSentenceClick(w)}
                            className="cursor-pointer px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-100 rounded-lg shadow-sm border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors"
                        >
                            {w.text}
                        </span>
                    ))
                )}
                <span>{currentLevel.templateParts[1]}</span>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900 font-sans select-none text-slate-800 dark:text-slate-100">
            <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onExit}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors whitespace-nowrap flex-shrink-0"
                        title="Go Back"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg md:text-xl font-bold">Adjectives & Adverbs: Sequence Builder</h1>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row flex-1 min-h-0">
                <div className="w-full lg:w-[40%] bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-6 flex flex-col overflow-y-auto">
                    
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
                            <BookOpen className="w-5 h-5 text-emerald-500" />
                            Lab Configuration
                        </h2>
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                            <label className="text-sm font-semibold mb-2 block">Grammar Complexity: {complexity}</label>
                            <input 
                                type="range" 
                                min="1" 
                                max="3" 
                                value={complexity} 
                                onChange={(e) => setComplexity(parseInt(e.target.value))}
                                className="w-full accent-emerald-600"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>Basic</span>
                                <span>Royal Order</span>
                                <span>Adj + Adv</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-700/50 rounded-xl p-5 mb-6 shadow-inner">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Target className="w-5 h-5 text-emerald-500" />
                            Activity Status
                        </h3>
                        <p className="text-sm font-medium mb-4 min-h-[40px] text-emerald-700 dark:text-emerald-300">
                            {feedback}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={checkAnswers}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors whitespace-nowrap flex-shrink-0 font-medium"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Check Sequence
                            </button>
                            <button
                                onClick={resetActivity}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 rounded-lg transition-colors whitespace-nowrap flex-shrink-0 font-medium"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="mb-6 flex-shrink-0">
                        <h3 className="font-semibold mb-3 text-sm text-slate-500 uppercase tracking-wider">Word Categories (Data Table)</h3>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500">
                                    <tr>
                                        <th className="px-4 py-2">Word</th>
                                        <th className="px-4 py-2">Category</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sentence.length === 0 ? (
                                        <tr>
                                            <td colSpan={2} className="px-4 py-3 text-center text-slate-400 italic">No words added yet</td>
                                        </tr>
                                    ) : (
                                        sentence.map((w, i) => (
                                            <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                                                <td className="px-4 py-2 font-medium">{w.text}</td>
                                                <td className="px-4 py-2 font-medium text-emerald-600 dark:text-emerald-400">{w.category}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {renderGraph()}

                    <div className="mt-8 bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-xl">
                        <h3 className="font-semibold text-emerald-900 dark:text-emerald-200 mb-2">Assessment / Analysis</h3>
                        <p className="text-sm text-emerald-800 dark:text-emerald-300 mb-3">
                            What is the standard order of Adverbs in a sentence? (Use the 3-letter acronym)
                        </p>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={assessmentAnswer}
                                onChange={(e) => setAssessmentAnswer(e.target.value)}
                                placeholder="Enter acronym..."
                                className="flex-1 px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <button 
                                onClick={checkAssessment}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium whitespace-nowrap flex-shrink-0"
                            >
                                Submit
                            </button>
                        </div>
                        {assessmentResult && (
                            <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded">{assessmentResult}</p>
                        )}
                    </div>

                </div>

                <div className="w-full lg:w-[60%] p-8 flex flex-col items-center justify-start bg-slate-50 dark:bg-slate-900">
                    
                    <div className="w-full max-w-3xl mb-8">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Word Bank</h3>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm min-h-[120px] flex flex-wrap gap-3 items-start content-start">
                            {bank.length === 0 ? (
                                <p className="text-slate-400 italic text-sm w-full text-center mt-4">All words used!</p>
                            ) : (
                                bank.map((w) => (
                                    <button
                                        key={w.id}
                                        onClick={() => handleBankClick(w)}
                                        className="group relative px-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-lg shadow-sm hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all whitespace-nowrap flex-shrink-0"
                                    >
                                        <span className="font-serif text-lg">{w.text}</span>
                                        <span className="absolute -top-2 -right-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            {w.category}
                                        </span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="w-full max-w-3xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-10 border border-slate-200 dark:border-slate-700">
                        <h2 className="text-2xl font-serif text-slate-800 dark:text-slate-100 mb-8 border-b border-slate-200 dark:border-slate-700 pb-4">
                            Interactive Stage: Sentence Builder
                        </h2>
                        
                        <div className="min-h-[100px] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                            {renderSentenceUI()}
                        </div>
                        
                        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                            Tip: Click words in the sentence to return them to the bank.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
