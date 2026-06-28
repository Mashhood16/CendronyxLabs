import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, RefreshCw, BookOpen, Activity, Target } from 'lucide-react';

interface WordToken {
    id: string;
    text: string;
    type: 'noun' | 'pronoun' | 'other';
}

interface Connection {
    pronounId: string;
    antecedentId: string;
}

export default function LabE11NounsPronouns({ onExit }: { onExit?: () => void }) {
    const [complexity, setComplexity] = useState<number>(2);
    const [selectedPronoun, setSelectedPronoun] = useState<string | null>(null);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [feedback, setFeedback] = useState<string>("Select a highlighted pronoun to begin mapping.");
    const [attempts, setAttempts] = useState<{ attempt: number, score: number, max: number }[]>([]);
    const [assessmentAnswer, setAssessmentAnswer] = useState('');
    const [assessmentResult, setAssessmentResult] = useState('');

    const datasets: Record<number, { tokens: WordToken[], correct: Connection[] }> = {
        1: {
            tokens: [
                { id: 't0', text: 'The', type: 'other' },
                { id: 't1', text: 'queen', type: 'noun' },
                { id: 't2', text: 'lost', type: 'other' },
                { id: 't3', text: 'her', type: 'pronoun' },
                { id: 't4', text: 'crown.', type: 'noun' }
            ],
            correct: [{ pronounId: 't3', antecedentId: 't1' }]
        },
        2: {
            tokens: [
                { id: 't0', text: 'The', type: 'other' },
                { id: 't1', text: 'wise', type: 'other' },
                { id: 't2', text: 'queen', type: 'noun' },
                { id: 't3', text: 'realized', type: 'other' },
                { id: 't4', text: 'that', type: 'other' },
                { id: 't5', text: 'her', type: 'pronoun' },
                { id: 't6', text: 'kingdom', type: 'noun' },
                { id: 't7', text: 'was', type: 'other' },
                { id: 't8', text: 'in', type: 'other' },
                { id: 't9', text: 'danger,', type: 'other' },
                { id: 't10', text: 'so', type: 'other' },
                { id: 't11', text: 'she', type: 'pronoun' },
                { id: 't12', text: 'summoned', type: 'other' },
                { id: 't13', text: 'the', type: 'other' },
                { id: 't14', text: 'knights.', type: 'noun' },
                { id: 't15', text: 'They', type: 'pronoun' },
                { id: 't16', text: 'arrived', type: 'other' },
                { id: 't17', text: 'to', type: 'other' },
                { id: 't18', text: 'protect', type: 'other' },
                { id: 't19', text: 'it.', type: 'pronoun' }
            ],
            correct: [
                { pronounId: 't5', antecedentId: 't2' },
                { pronounId: 't11', antecedentId: 't2' },
                { pronounId: 't15', antecedentId: 't14' },
                { pronounId: 't19', antecedentId: 't6' }
            ]
        },
        3: {
            tokens: [
                { id: 't0', text: 'Although', type: 'other' },
                { id: 't1', text: 'he', type: 'pronoun' },
                { id: 't2', text: 'was', type: 'other' },
                { id: 't3', text: 'tired,', type: 'other' },
                { id: 't4', text: 'the', type: 'other' },
                { id: 't5', text: 'king', type: 'noun' },
                { id: 't6', text: 'fought', type: 'other' },
                { id: 't7', text: 'the', type: 'other' },
                { id: 't8', text: 'dragon.', type: 'noun' },
                { id: 't9', text: 'It', type: 'pronoun' },
                { id: 't10', text: 'breathed', type: 'other' },
                { id: 't11', text: 'fire,', type: 'noun' },
                { id: 't12', text: 'but', type: 'other' },
                { id: 't13', text: 'he', type: 'pronoun' },
                { id: 't14', text: 'dodged', type: 'other' },
                { id: 't15', text: 'it.', type: 'pronoun' }
            ],
            correct: [
                { pronounId: 't1', antecedentId: 't5' },
                { pronounId: 't9', antecedentId: 't8' },
                { pronounId: 't13', antecedentId: 't5' },
                { pronounId: 't15', antecedentId: 't11' }
            ]
        }
    };

    const currentData = datasets[complexity];

    useEffect(() => {
        resetActivity();
    }, [complexity]);

    const handleWordClick = (token: WordToken) => {
        if (token.type === 'pronoun') {
            setSelectedPronoun(token.id);
            setFeedback(`You selected the pronoun "${token.text}". Now click its antecedent (noun).`);
        } else if (token.type === 'noun' && selectedPronoun) {
            setConnections(prev => {
                const filtered = prev.filter(c => c.pronounId !== selectedPronoun);
                return [...filtered, { pronounId: selectedPronoun, antecedentId: token.id }];
            });
            setSelectedPronoun(null);
            setFeedback(`Link created! You can select another pronoun, or check your answers.`);
        } else if (token.type === 'noun') {
            setFeedback(`"${token.text}" is a noun. First select a pronoun to find its antecedent.`);
        }
    };

    const checkAnswers = () => {
        let correctCount = 0;
        connections.forEach(c => {
            const isCorrect = currentData.correct.some(cc => cc.pronounId === c.pronounId && cc.antecedentId === c.antecedentId);
            if (isCorrect) correctCount++;
        });

        const maxScore = currentData.correct.length;
        setAttempts(prev => [...prev, { attempt: prev.length + 1, score: correctCount, max: maxScore }]);

        if (correctCount === maxScore && connections.length === maxScore) {
            setFeedback("Excellent! All pronoun-antecedent references are correct.");
        } else {
            setFeedback(`You got ${correctCount} out of ${maxScore} correct. Keep trying!`);
        }
    };

    const resetActivity = () => {
        setConnections([]);
        setSelectedPronoun(null);
        setFeedback("Select a highlighted pronoun to begin mapping.");
    };

    const checkAssessment = () => {
        if (assessmentAnswer.toLowerCase().includes('cataphoric')) {
            setAssessmentResult('Correct! When a pronoun appears before its antecedent, it is a cataphoric reference.');
        } else {
            setAssessmentResult('Incorrect. Hint: It starts with "cata".');
        }
    };

    const getConnectionColor = (pronounId: string) => {
        const colors = ['bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'];
        const index = currentData.correct.findIndex(c => c.pronounId === pronounId);
        return colors[index % colors.length] || 'bg-slate-500';
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
            <div className="mt-6 bg-white dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    Accuracy Over Time
                </h3>
                <svg viewBox={`-10 -10 ${width + 20} ${height + 20}`} className="w-full h-24 overflow-visible">
                    <line x1="0" y1="0" x2="0" y2={height} stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-600" />
                    <line x1="0" y1={height} x2={width} y2={height} stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-600" />
                    
                    <polyline fill="none" stroke="#6366f1" strokeWidth="3" points={points} />
                    {attempts.map((a, i) => {
                        const x = (i / maxAttempts) * width;
                        const y = height - (a.score / a.max) * height;
                        return (
                            <g key={i}>
                                <circle cx={x} cy={y} r="4" fill="#6366f1" />
                                <text x={x} y={y - 10} fontSize="10" fill="currentColor" textAnchor="middle" className="text-slate-600 dark:text-[#71717a]">
                                    {Math.round((a.score / a.max) * 100)}%
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 dark:!bg-[#000000] font-sans select-none text-slate-800 dark:text-[#ffffff]">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b]">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onExit}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors whitespace-nowrap flex-shrink-0"
                        title="Go Back"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg md:text-xl font-bold">Nouns & Pronouns: Reference Mapping</h1>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row flex-1 min-h-0">
                {/* Left Column: Interactive Controls */}
                <div className="w-full lg:w-[40%] bg-white dark:bg-[#121212] border-r border-slate-200 dark:border-[#1c1b1b] p-6 flex flex-col lg:overflow-y-auto">
                    
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
                            <BookOpen className="w-5 h-5 text-indigo-500" />
                            Lab Configuration
                        </h2>
                        <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#1c1b1b]">
                            <label className="text-sm font-semibold mb-2 block">Sentence Complexity: {complexity}</label>
                            <input 
                                type="range" 
                                min="1" 
                                max="3" 
                                value={complexity} 
                                onChange={(e) => setComplexity(parseInt(e.target.value))}
                                className="w-full accent-indigo-600"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>Basic</span>
                                <span>Standard</span>
                                <span>Complex</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-700/50 rounded-xl p-5 mb-6 shadow-inner">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Target className="w-5 h-5 text-indigo-500" />
                            Activity Status
                        </h3>
                        <p className="text-sm font-medium mb-4 min-h-[40px] text-indigo-700 dark:text-indigo-300">
                            {feedback}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={checkAnswers}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors whitespace-nowrap flex-shrink-0 font-medium dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Check Links
                            </button>
                            <button
                                onClick={resetActivity}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-[#ffffff] rounded-lg transition-colors whitespace-nowrap flex-shrink-0 font-medium"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="mb-6 flex-shrink-0">
                        <h3 className="font-semibold mb-3 text-sm text-slate-500 uppercase tracking-wider">Current Links (Data Table)</h3>
                        <div className="bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b] text-xs uppercase text-slate-500">
                                    <tr>
                                        <th className="px-4 py-2">Pronoun</th>
                                        <th className="px-4 py-2">Antecedent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {connections.length === 0 ? (
                                        <tr>
                                            <td colSpan={2} className="px-4 py-3 text-center text-slate-400 italic">No links recorded yet</td>
                                        </tr>
                                    ) : (
                                        connections.map((c, i) => {
                                            const p = currentData.tokens.find(t => t.id === c.pronounId);
                                            const a = currentData.tokens.find(t => t.id === c.antecedentId);
                                            return (
                                                <tr key={i} className="border-b border-slate-100 dark:border-[#1c1b1b]/50 last:border-0">
                                                    <td className="px-4 py-2 font-medium flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${getConnectionColor(c.pronounId)}`}></span>
                                                        {p?.text}
                                                    </td>
                                                    <td className="px-4 py-2 font-medium text-amber-600 dark:text-amber-400">{a?.text}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {renderGraph()}

                    <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl">
                        <h3 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2">Assessment / Analysis</h3>
                        <p className="text-sm text-indigo-800 dark:text-indigo-300 mb-3">
                            In Complexity 3, the pronoun "he" appears before its antecedent "king". What is this type of reference called?
                        </p>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={assessmentAnswer}
                                onChange={(e) => setAssessmentAnswer(e.target.value)}
                                placeholder="Enter reference type..."
                                className="flex-1 px-3 py-2 rounded-lg border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-[#121212] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button 
                                onClick={checkAssessment}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium whitespace-nowrap flex-shrink-0 dark:text-white dark:text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-indigo-500/40"
                            >
                                Submit
                            </button>
                        </div>
                        {assessmentResult && (
                            <p className="mt-2 text-sm font-medium text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded">{assessmentResult}</p>
                        )}
                    </div>

                </div>

                {/* Right Column: Simulation Stage */}
                <div className="w-full lg:w-[60%] p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#121212]">
                    
                    <div className="bg-white dark:!bg-[#121212] rounded-2xl shadow-xl p-10 max-w-3xl w-full border border-slate-200 dark:border-[#1c1b1b]">
                        <h2 className="text-2xl font-serif text-slate-800 dark:text-[#ffffff] mb-8 border-b border-slate-200 dark:border-[#1c1b1b] pb-4">
                            Interactive Stage: Complexity {complexity}
                        </h2>
                        
                        <div className="text-xl leading-loose font-serif">
                            {currentData.tokens.map((token) => {
                                const isPronoun = token.type === 'pronoun';
                                const isNoun = token.type === 'noun';
                                const isSelected = selectedPronoun === token.id;
                                
                                const connectionAsPronoun = connections.find(c => c.pronounId === token.id);
                                const connectionsAsAntecedent = connections.filter(c => c.antecedentId === token.id);

                                let spanClasses = "inline-block px-1 rounded transition-colors duration-200 ";
                                
                                if (isPronoun) {
                                    spanClasses += "cursor-pointer font-bold border-b-2 border-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 ";
                                    if (isSelected) {
                                        spanClasses += "bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-100 ";
                                    } else if (connectionAsPronoun) {
                                        spanClasses += "bg-indigo-50 dark:bg-indigo-900/30 ";
                                    }
                                } else if (isNoun) {
                                    spanClasses += "cursor-pointer border-b-2 border-dashed border-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 ";
                                    if (connectionsAsAntecedent.length > 0) {
                                        spanClasses += "bg-amber-50 dark:bg-amber-900/30 ";
                                    }
                                }

                                return (
                                    <span key={token.id} className="relative inline-flex items-center">
                                        <span 
                                            className={spanClasses}
                                            onClick={() => handleWordClick(token)}
                                        >
                                            {token.text}
                                        </span>
                                        
                                        {/* Connection Badges */}
                                        {isPronoun && connectionAsPronoun && (
                                            <span className={`absolute -top-3 -right-1 w-3 h-3 rounded-full ${getConnectionColor(connectionAsPronoun.pronounId)} shadow-sm border border-white dark:border-[#1c1b1b]`} />
                                        )}
                                        {isNoun && connectionsAsAntecedent.length > 0 && (
                                            <div className="absolute -top-4 right-0 flex gap-0.5">
                                                {connectionsAsAntecedent.map(c => (
                                                    <span key={c.pronounId} className={`w-3 h-3 rounded-full ${getConnectionColor(c.pronounId)} shadow-sm border border-white dark:border-[#1c1b1b]`} />
                                                ))}
                                            </div>
                                        )}
                                        {/* Space after word */}
                                        <span className="w-1.5 inline-block"></span>
                                    </span>
                                );
                            })}
                        </div>

                        <div className="mt-12 flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-[#71717a] bg-slate-50 dark:bg-[#121212]/50 p-4 rounded-lg">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-1 bg-indigo-400 rounded-full"></span>
                                <span>Pronouns (Click first)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-1 border-b-2 border-dashed border-amber-400"></span>
                                <span>Nouns (Antecedents)</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
