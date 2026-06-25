import { useState } from 'react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8ConservationMass({ onExit }: LabProps) {
  const [stage, setStage] = useState<'initial' | 'mixed'>('initial');

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <LabHeader onExit={onExit} title="Act 6.2: Conservation of Mass" subtitle="Mass remains constant before and after reaction" />

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 dark:border-slate-500 max-w-2xl w-full flex flex-col items-center relative min-h-[500px]">
          
          <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-8 text-center">
            {stage === 'initial' ? 'Before Reaction (Unmixed)' : 'After Reaction (Mixed)'}
          </h2>

          <div className="relative flex flex-col items-center">
            {/* Top Platform */}
            <div className="w-64 h-4 bg-slate-300 dark:bg-slate-800 rounded-t-lg z-0" />
            
            {/* The Flask Setup */}
            <div className={`absolute bottom-4 z-10 transition-transform duration-1000 origin-bottom ${stage === 'mixed' ? 'rotate-[360deg] scale-105' : ''}`}>
              {/* Flask */}
              <div className="w-32 h-32 border-4 border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded-b-[40px] rounded-t-md relative bg-slate-50 dark:bg-slate-900/50 overflow-hidden flex flex-col justify-end">
                {/* Sodium Sulphate Solution (in flask) */}
                <div className={`w-full h-1/2 transition-colors duration-1000 ${stage === 'mixed' ? 'bg-slate-100 dark:bg-slate-800' : 'bg-blue-50'}`}>
                  {/* Precipitate Formed */}
                  {stage === 'mixed' && (
                    <div className="absolute bottom-0 w-full h-1/2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 dark:border-slate-500 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400 opacity-90 animate-fade-in">
                      CaSO4 Solid
                    </div>
                  )}
                </div>
                
                {/* Test Tube inside Flask (Calcium Chloride) */}
                <div className={`absolute top-4 left-1/2 -translate-x-1/2 w-8 h-20 border-2 border-slate-400 dark:border-slate-500 rounded-b-xl overflow-hidden transition-all duration-1000 ${stage === 'mixed' ? 'rotate-180 translate-y-4 opacity-50' : ''}`}>
                  <div className="absolute bottom-0 w-full h-1/2 bg-slate-200 dark:bg-slate-800/80" />
                </div>
              </div>
              {/* Flask Neck/Cork */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-6 border-x-4 border-slate-300 dark:border-slate-700 dark:border-slate-500">
                <div className="absolute -top-4 -left-1 w-10 h-4 bg-amber-700 rounded-sm" />
              </div>
            </div>

            {/* Base */}
            <div className="w-72 h-16 bg-slate-800 dark:bg-slate-800 rounded-b-xl flex items-center justify-center shadow-xl z-20">
              {/* Digital Display */}
              <div className="bg-emerald-900 px-6 py-2 rounded border-2 border-emerald-950 font-mono text-3xl text-emerald-400 shadow-inner min-w-[150px] text-center">
                <span className={`transition-opacity duration-300 ${stage === 'mixed' ? 'animate-pulse' : ''}`}>
                  145.2 g
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center w-full">
            {stage === 'initial' ? (
              <>
                <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:border-slate-500 rounded-xl text-left max-w-md mx-auto">
                  <h4 className="font-bold text-sm mb-2">Setup:</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-1">• Flask contains Sodium Sulphate (Na<sub>2</sub>SO<sub>4</sub>) solution</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-1">• Test tube inside contains Calcium Chloride (CaCl<sub>2</sub>)</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">• System is sealed with a cork</p>
                </div>
                <button 
                  onClick={() => setStage('mixed')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 text-xl shadow-lg transition-transform active:scale-95"
                >
                  Invert Flask to Mix
                </button>
              </>
            ) : (
              <>
                <div className="bg-blue-50 border-2 border-blue-200 px-6 py-4 rounded-xl text-blue-900 animate-fade-in max-w-md mx-auto">
                  <h3 className="font-bold text-lg mb-2">Mass is Conserved!</h3>
                  <p className="text-sm">Even though a solid precipitate (CaSO<sub>4</sub>) formed — a chemical change — the total mass of the sealed system remains exactly <strong>145.2 g</strong>.</p>
                  <div className="mt-3 text-xs text-blue-700 border-t border-blue-200 pt-2">
                    <strong>Reaction:</strong> Na<sub>2</sub>SO<sub>4</sub> + CaCl<sub>2</sub> → CaSO<sub>4</sub>↓ + 2NaCl
                  </div>
                </div>
                <button onClick={() => setStage('initial')} className="mt-3 text-sm font-medium text-slate-400 hover:text-slate-600 dark:text-slate-300 underline">Reset</button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
