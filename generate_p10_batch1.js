const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');

const template = (name, title, desc, body) => \`import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface LabProps { onExit?: () => void; }

export default function \${name}({ onExit }: LabProps) {
  const [step, setStep] = useState(0);

  const reset = () => {
    setStep(0);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans select-none">
      <div className="bg-white border-b p-4 flex items-center justify-between sticky top-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          {onExit && <button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeft className="w-5 h-5" /></button>}
          <div>
            <h1 className="text-xl font-bold text-slate-800">\${title}</h1>
            <p className="text-sm text-slate-500">\${desc}</p>
          </div>
        </div>
        <button onClick={reset} className="flex items-center gap-2 bg-slate-200 px-4 py-2 rounded-md hover:bg-slate-300 font-medium">
          <RefreshCw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
        \${body}
      </div>
    </div>
  );
}
\`;

const labs = [
  {
    name: 'LabP10CarbonFootprint',
    title: 'Unit 10: Carbon Footprint Calculator',
    desc: 'Calculate daily CO2 emissions from transportation to school.',
    body: \`
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-lg font-bold text-slate-700 mb-4">Daily Commute Emissions</h3>
        <p className="text-slate-600 mb-6">A typical car emits about 0.2 kg of CO2 per kilometer. Adjust your trip distance to see the environmental impact.</p>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 w-full space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Distance to School (One-way): {step} km</label>
              <input type="range" min="0" max="30" value={step} onChange={e => setStep(Number(e.target.value))} className="w-full accent-emerald-600" />
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-sm text-slate-500">Daily Total (Round Trip: {step * 2} km)</div>
              <div className="text-3xl font-bold text-emerald-700">{(step * 2 * 0.2).toFixed(1)} kg CO₂</div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-sm text-slate-500">Weekly Total (5 Days)</div>
              <div className="text-3xl font-bold text-teal-700">{(step * 2 * 0.2 * 5).toFixed(1)} kg CO₂</div>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-emerald-500 shadow-lg overflow-hidden">
                <div 
                  className="absolute bottom-0 w-full bg-slate-800 transition-all duration-500 opacity-50" 
                  style={{ height: \\\`\${Math.min(100, (step / 30) * 100)}%\\\` }} 
                />
                <span className="text-4xl relative z-10">{step > 15 ? '🚗' : step > 5 ? '🚙' : '🚲'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    \`
  },
  {
    name: 'LabP10SpecificHeatMixture',
    title: 'Unit 10: Specific Heat (Method of Mixtures)',
    desc: 'Calculate specific heat by transferring a hot solid into a cold liquid.',
    body: \`
      <div className="flex flex-col md:flex-row gap-6 h-[500px]">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
            <h3 className="font-bold text-slate-700">Procedure</h3>
            <button onClick={() => setStep(1)} className="py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg font-medium">1. Heat Solid in Boiling Water (100°C)</button>
            <button onClick={() => setStep(2)} className="py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-lg font-medium" disabled={step < 1}>2. Transfer to Calorimeter (20°C)</button>
            <button onClick={() => setStep(3)} className="py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-medium" disabled={step < 2}>3. Stir & Record Eq. Temp</button>
          </div>
          
          {step === 3 && (
            <div className="bg-slate-800 text-green-400 p-4 rounded-xl font-mono text-sm shadow-inner">
              <p>Eq Temp: 28.5 °C</p>
              <p>Heat Lost = Heat Gained</p>
              <p>m₁c₁(T₁-T) = m₂c₂(T-T₂)</p>
              <p className="text-white mt-2">c₁ ≈ 385 J/kg°C (Copper)</p>
            </div>
          )}
        </div>
        
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 relative flex items-center justify-center p-8 overflow-hidden">
          {/* Burner & Beaker */}
          <div className="absolute left-10 bottom-20 flex flex-col items-center">
             <div className="w-24 h-32 border-4 border-slate-300 rounded-b-xl border-t-0 relative bg-blue-50/50 flex items-end">
               <div className="w-full h-24 bg-blue-200/50 relative">
                 {step === 1 && <div className="absolute inset-x-2 bottom-2 h-8 bg-amber-600 rounded-sm animate-bounce" />}
               </div>
             </div>
             {step === 1 && <div className="w-16 h-8 bg-orange-500 rounded-t-full mt-2 animate-pulse opacity-80" />}
          </div>
          
          {/* Calorimeter */}
          <div className="absolute right-20 bottom-20 flex flex-col items-center">
             <div className="w-32 h-40 bg-slate-300 rounded-xl border-4 border-slate-400 relative flex items-end p-2">
               <div className="w-full bg-blue-300 transition-all duration-1000 flex items-end justify-center pb-2" style={{ height: step >= 2 ? '70%' : '50%' }}>
                 {step >= 2 && <div className="w-10 h-10 bg-amber-600 rounded-sm" />}
               </div>
               {/* Thermometer */}
               <div className="absolute top-2 right-4 w-2 h-32 bg-white/50 border border-slate-400 rounded-full flex items-end">
                 <div className="w-full bg-red-500 rounded-full transition-all duration-1000" style={{ height: step === 3 ? '60%' : step >= 2 ? '40%' : '20%' }} />
               </div>
             </div>
             <div className="mt-4 font-bold text-slate-600 text-xl">
               {step === 3 ? '28.5 °C' : step >= 2 ? 'Mixing...' : '20.0 °C'}
             </div>
          </div>
          
          {/* Transfer Animation */}
          {step === 2 && (
             <div className="absolute w-10 h-10 bg-amber-600 rounded-sm shadow-xl animate-[ping_1s_ease-in-out_forwards] left-[40%] top-[30%]" />
          )}
        </div>
      </div>
    \`
  },
  {
    name: 'LabP10SpecificHeatElectrical',
    title: 'Unit 10: Specific Heat (Electrical Method)',
    desc: 'Calculate heat energy using an immersion heater in an insulated metal block.',
    body: \`
      <div className="bg-slate-900 rounded-2xl p-8 h-[500px] flex flex-col items-center justify-center relative text-white">
        
        <div className="flex gap-12 mb-12">
          <div className="bg-black/50 p-4 rounded-xl border border-white/10 w-40 text-center">
            <div className="text-slate-400 text-sm mb-1">Voltmeter</div>
            <div className="text-3xl font-mono text-green-400 font-bold">{step > 0 ? '12.0' : '0.0'} <span className="text-lg">V</span></div>
          </div>
          <div className="bg-black/50 p-4 rounded-xl border border-white/10 w-40 text-center">
            <div className="text-slate-400 text-sm mb-1">Ammeter</div>
            <div className="text-3xl font-mono text-blue-400 font-bold">{step > 0 ? '3.5' : '0.0'} <span className="text-lg">A</span></div>
          </div>
          <div className="bg-black/50 p-4 rounded-xl border border-white/10 w-40 text-center">
            <div className="text-slate-400 text-sm mb-1">Thermometer</div>
            <div className="text-3xl font-mono text-red-400 font-bold">{20 + step * 2} <span className="text-lg">°C</span></div>
          </div>
        </div>

        {/* Metal Block */}
        <div className="relative w-64 h-48 bg-slate-400 rounded-lg shadow-2xl border-t-8 border-slate-300 flex items-start justify-center pt-4">
          <div className="absolute inset-0 border-8 border-yellow-600/30 rounded-lg pointer-events-none" /> {/* Insulation */}
          
          {/* Heater */}
          <div className="w-8 h-32 bg-zinc-800 rounded-b-md relative">
             <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-1 h-16 bg-red-500" />
             {step > 0 && <div className="absolute inset-0 bg-red-500/50 animate-pulse rounded-b-md" />}
          </div>
          
          {/* Thermometer hole */}
          <div className="w-4 h-24 bg-white/20 ml-8 rounded-b-full border border-white/30 relative flex items-end">
             <div className="w-full bg-red-500 transition-all duration-500 rounded-b-full" style={{ height: \\\`\${Math.min(100, 20 + step * 4)}%\\\` }} />
          </div>
        </div>

        <button 
          onClick={() => setStep(s => Math.min(10, s + 1))}
          className="absolute bottom-8 px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full shadow-lg transition-transform active:scale-95"
        >
          {step === 0 ? 'Turn On Heater' : step === 10 ? 'Max Temp Reached' : 'Advance Time (1 min)'}
        </button>
      </div>
    \`
  },
  {
    name: 'LabP10ThermalConduction',
    title: 'Unit 10: Thermal Conduction',
    desc: 'Heat the ends of Copper, Iron, and Aluminium strips to see which conducts heat fastest.',
    body: \`
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 h-[500px] flex flex-col relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-32 bg-slate-300 rounded-t-xl z-0">
          {step > 0 && (
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-12 h-20 bg-orange-500 rounded-full blur-md animate-pulse mix-blend-screen" />
          )}
        </div>

        <div className="flex-1 flex gap-8 items-start justify-center mt-12 relative z-10">
          
          {/* Copper */}
          <div className="relative w-12 h-64 bg-orange-700/80 rounded-t-md flex flex-col items-center">
            <div className="text-white font-bold text-xs mt-2">Cu</div>
            <div className="absolute bottom-0 w-full transition-all duration-1000 bg-red-500/50 blur-sm rounded-t-md" style={{ height: step > 0 ? '90%' : '0%' }} />
            {step < 1 ? (
              <div className="absolute top-4 w-4 h-4 bg-white rounded-full shadow-md" />
            ) : (
              <div className="absolute top-32 w-4 h-4 bg-white rounded-full shadow-md animate-bounce opacity-50" />
            )}
          </div>

          {/* Aluminium */}
          <div className="relative w-12 h-64 bg-slate-300 rounded-t-md flex flex-col items-center">
            <div className="text-slate-800 font-bold text-xs mt-2">Al</div>
            <div className="absolute bottom-0 w-full transition-all duration-1000 bg-red-500/50 blur-sm rounded-t-md" style={{ height: step > 0 ? '70%' : '0%' }} />
            {step < 2 ? (
              <div className="absolute top-4 w-4 h-4 bg-white rounded-full shadow-md" />
            ) : (
              <div className="absolute top-32 w-4 h-4 bg-white rounded-full shadow-md animate-bounce opacity-50" />
            )}
          </div>

          {/* Iron */}
          <div className="relative w-12 h-64 bg-zinc-600 rounded-t-md flex flex-col items-center">
            <div className="text-white font-bold text-xs mt-2">Fe</div>
            <div className="absolute bottom-0 w-full transition-all duration-1000 bg-red-500/50 blur-sm rounded-t-md" style={{ height: step > 0 ? '40%' : '0%' }} />
            {step < 3 ? (
              <div className="absolute top-4 w-4 h-4 bg-white rounded-full shadow-md" />
            ) : (
              <div className="absolute top-32 w-4 h-4 bg-white rounded-full shadow-md animate-bounce opacity-50" />
            )}
          </div>

        </div>

        <button 
          onClick={() => setStep(s => s < 3 ? s + 1 : 3)}
          className="absolute right-8 top-8 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold shadow-md"
        >
          {step === 0 ? 'Light Bunsen Burner' : step === 3 ? 'Experiment Complete' : 'Time Passes...'}
        </button>

        {step > 0 && (
          <div className="absolute left-8 top-8 bg-slate-800 text-white p-4 rounded-xl shadow-lg">
            <h4 className="font-bold mb-2">Observation log:</h4>
            {step >= 1 && <p className="text-orange-300">1. Copper pin falls (Best conductor)</p>}
            {step >= 2 && <p className="text-slate-300">2. Aluminium pin falls (Good conductor)</p>}
            {step >= 3 && <p className="text-zinc-400">3. Iron pin falls (Fair conductor)</p>}
          </div>
        )}
      </div>
    \`
  },
  {
    name: 'LabP10ConvectionCurrents',
    title: 'Unit 10: Convection Currents',
    desc: 'Observe a colored stream of potassium permanganate travel upward as water is heated.',
    body: \`
      <div className="bg-slate-900 rounded-2xl p-8 h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="w-64 h-80 border-4 border-white/20 rounded-b-3xl relative bg-blue-900/40 p-2 flex flex-col">
          {/* Water level */}
          <div className="absolute inset-x-0 bottom-0 h-[80%] bg-blue-500/20 rounded-b-2xl border-t border-blue-400/50" />
          
          {/* Crystal */}
          <div className="absolute bottom-4 right-1/4 w-4 h-4 bg-purple-600 rounded-sm blur-[1px]" />
          
          {/* Convection plume */}
          {step > 0 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path 
                 d="M 70 90 C 70 70, 30 50, 40 20 C 50 10, 80 10, 85 40 C 90 70, 70 90, 70 90" 
                 fill="none" 
                 stroke="rgba(168, 85, 247, 0.6)" 
                 strokeWidth="4"
                 strokeLinecap="round"
                 className="animate-[dash_3s_linear_infinite]"
                 strokeDasharray="20 10"
               />
               <path 
                 d="M 40 20 C 30 30, 20 60, 40 80" 
                 fill="none" 
                 stroke="rgba(59, 130, 246, 0.4)" 
                 strokeWidth="4"
                 strokeLinecap="round"
                 className="animate-[dash_4s_linear_infinite_reverse]"
                 strokeDasharray="15 15"
               />
            </svg>
          )}
        </div>

        {/* Burner */}
        <div className="w-32 h-12 bg-zinc-700 rounded-md mt-4 relative flex justify-center">
          <div className="absolute -top-2 w-16 h-2 bg-zinc-800" />
          {step > 0 && (
             <div className="absolute -top-12 w-10 h-10 bg-orange-500 rounded-full blur-md animate-pulse mix-blend-screen" />
          )}
        </div>

        <button 
          onClick={() => setStep(1)}
          className="absolute right-8 top-8 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold shadow-md"
        >
          Heat Beaker
        </button>

        {step > 0 && (
          <div className="absolute left-8 top-8 max-w-xs bg-black/50 text-white p-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <h4 className="font-bold text-purple-400 mb-2">Convection Cell</h4>
            <p className="text-sm text-slate-300">Heated water expands, becomes less dense, and rises, carrying the purple dye. Cooler, denser water sinks to replace it, forming a continuous cycle.</p>
          </div>
        )}
        <style>{\\\`
          @keyframes dash {
            to { stroke-dashoffset: -30; }
          }
        \\\`}</style>
      </div>
    \`
  },
  {
    name: 'LabP10InsulatingMaterials',
    title: 'Unit 10: Insulating Materials',
    desc: 'Wrap hot water bottles in different insulators to see which retains heat best over an hour.',
    body: \`
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col gap-8 h-[500px]">
        
        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-700">Time Elapsed: {step * 15} mins</h3>
          <button onClick={() => setStep(s => Math.min(4, s + 1))} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium" disabled={step >= 4}>
            Wait 15 mins
          </button>
        </div>

        <div className="flex-1 flex gap-6 justify-center items-end pb-8">
          
          {/* No Insulator */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-32 bg-red-400 rounded-3xl relative overflow-hidden flex items-end">
               <div className="w-full bg-red-600 transition-all duration-500" style={{ height: \\\`\${100 - step * 18}%\\\` }} />
            </div>
            <div className="text-center">
              <div className="font-bold text-slate-700">None</div>
              <div className="text-red-600 font-mono text-xl">{80 - step * 12}°C</div>
            </div>
          </div>

          {/* Newspaper */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-32 bg-red-400 rounded-3xl relative overflow-hidden flex items-end border-4 border-dashed border-slate-400">
               <div className="w-full bg-red-600 transition-all duration-500" style={{ height: \\\`\${100 - step * 12}%\\\` }} />
            </div>
            <div className="text-center">
              <div className="font-bold text-slate-700">Newspaper</div>
              <div className="text-orange-600 font-mono text-xl">{80 - step * 8}°C</div>
            </div>
          </div>

          {/* Foam */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-32 bg-red-400 rounded-3xl relative overflow-hidden flex items-end border-8 border-yellow-200">
               <div className="w-full bg-red-600 transition-all duration-500" style={{ height: \\\`\${100 - step * 6}%\\\` }} />
            </div>
            <div className="text-center">
              <div className="font-bold text-slate-700">Foam Sheet</div>
              <div className="text-yellow-600 font-mono text-xl">{80 - step * 4}°C</div>
            </div>
          </div>

          {/* Bubble Wrap */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-32 bg-red-400 rounded-3xl relative overflow-hidden flex items-end">
               <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iOCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuNSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')] opacity-60 z-10" />
               <div className="w-full bg-red-600 transition-all duration-500" style={{ height: \\\`\${100 - step * 8}%\\\` }} />
            </div>
            <div className="text-center">
              <div className="font-bold text-slate-700">Bubble Wrap</div>
              <div className="text-amber-500 font-mono text-xl">{80 - step * 5}°C</div>
            </div>
          </div>

        </div>
      </div>
    \`
  },
  {
    name: 'LabP10AbsorbersReflectors',
    title: 'Unit 10: Absorbers and Reflectors of Heat',
    desc: 'Compare heating rates of a shiny silver can vs a dull black can using a radiant heater.',
    body: \`
      <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 p-8 h-[500px] flex flex-col relative">
        <div className="text-white mb-8 text-center max-w-2xl mx-auto">
          Both cans start at 20°C. The radiant heater emits infrared radiation equally in both directions.
        </div>

        <div className="flex-1 flex justify-center items-center gap-16 relative">
          
          {/* Black Can */}
          <div className="flex flex-col items-center gap-4">
             <div className="w-32 h-40 bg-zinc-900 rounded-lg shadow-2xl border border-zinc-800 relative flex items-center justify-center">
                <div className="absolute -top-12 text-3xl font-mono text-red-400 font-bold">{20 + step * 4}°C</div>
                <div className="w-2 h-24 bg-white/10 rounded-full flex items-end">
                   <div className="w-full bg-red-500 rounded-full transition-all duration-500" style={{ height: \\\`\${Math.min(100, 20 + step * 8)}%\\\` }} />
                </div>
             </div>
             <div className="text-white font-bold">Matt Black</div>
          </div>

          {/* Heater */}
          <div className="w-16 h-48 bg-orange-600 rounded-full blur-[2px] flex items-center justify-center shadow-[0_0_50px_rgba(234,88,12,0.8)] z-10">
             <div className="w-4 h-40 bg-yellow-400 rounded-full animate-pulse" />
          </div>

          {/* Heat waves left */}
          <div className="absolute left-[38%] top-1/2 -translate-y-1/2 text-orange-500 animate-pulse text-4xl tracking-widest">❮❮❮</div>
          {/* Heat waves right */}
          <div className="absolute right-[38%] top-1/2 -translate-y-1/2 text-orange-500 animate-pulse text-4xl tracking-widest opacity-60">❯❯❯</div>

          {/* Shiny Can */}
          <div className="flex flex-col items-center gap-4">
             <div className="w-32 h-40 bg-slate-300 rounded-lg shadow-2xl border-l-4 border-white/50 relative flex items-center justify-center bg-gradient-to-r from-slate-300 via-white to-slate-400">
                <div className="absolute -top-12 text-3xl font-mono text-orange-400 font-bold">{20 + step * 1}°C</div>
                <div className="w-2 h-24 bg-black/10 rounded-full flex items-end">
                   <div className="w-full bg-red-500 rounded-full transition-all duration-500" style={{ height: \\\`\${Math.min(100, 20 + step * 2)}%\\\` }} />
                </div>
             </div>
             <div className="text-white font-bold">Shiny Silver</div>
          </div>

        </div>

        <button 
          onClick={() => setStep(s => s < 10 ? s + 1 : 10)}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full shadow-lg"
        >
          Heat for 1 Min (Total: {step} mins)
        </button>
      </div>
    \`
  },
  {
    name: 'LabP10LeslieCube',
    title: 'Unit 10: Leslie Cube Experiment',
    desc: 'Measure infrared radiation emitted from 4 different surfaces of a Leslie Cube filled with boiling water.',
    body: \`
      <div className="bg-slate-100 rounded-2xl shadow-sm border border-slate-300 p-8 h-[500px] flex gap-8">
        
        {/* Faces selector */}
        <div className="w-64 bg-white p-4 rounded-xl shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-slate-700 mb-2">Measure Surface</h3>
          <button onClick={() => setStep(1)} className="p-3 bg-zinc-900 text-white rounded text-left font-bold shadow-sm">Matt Black</button>
          <button onClick={() => setStep(2)} className="p-3 bg-zinc-700 text-white rounded text-left font-bold shadow-sm">Shiny Black</button>
          <button onClick={() => setStep(3)} className="p-3 bg-white border-2 border-slate-200 text-slate-800 rounded text-left font-bold shadow-sm">Matt White</button>
          <button onClick={() => setStep(4)} className="p-3 bg-gradient-to-r from-slate-300 via-white to-slate-400 text-slate-800 rounded text-left font-bold shadow-sm border border-slate-300">Shiny Silver</button>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center relative border border-slate-200">
          
          <div className="absolute top-8 text-slate-500 text-sm">Boiling Water inside (100°C)</div>

          {/* Cube representation */}
          <div className="relative w-48 h-48 mb-8 flex items-center justify-center shadow-2xl rounded-sm transition-colors duration-500" style={{
            backgroundColor: step === 1 ? '#18181b' : step === 2 ? '#3f3f46' : step === 3 ? '#ffffff' : step === 4 ? '#cbd5e1' : '#e2e8f0',
            border: step === 3 ? '1px solid #e2e8f0' : 'none'
          }}>
            {step === 4 && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-50" />}
            {step > 0 && (
              <div className="absolute -right-16 text-red-500 animate-pulse text-4xl">❯❯</div>
            )}
          </div>

          {/* IR Thermometer */}
          <div className="bg-slate-800 text-white p-6 rounded-xl border-4 border-slate-700 shadow-xl w-64 text-center transform translate-x-32 relative">
             <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-12 h-2 bg-slate-700" />
             <div className="text-slate-400 text-xs mb-2">IR SENSOR READING</div>
             <div className="text-4xl font-mono text-emerald-400 font-bold">
               {step === 0 ? '---' : step === 1 ? '72.4' : step === 2 ? '61.8' : step === 3 ? '45.2' : '23.1'} °C
             </div>
          </div>
          
          {step > 0 && (
            <div className="absolute bottom-8 left-8 text-sm text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200 max-w-xs">
              {step === 1 && "Matt Black is the best emitter of thermal radiation."}
              {step === 2 && "Shiny Black emits less than matt black."}
              {step === 3 && "Matt White is a poor emitter compared to black surfaces."}
              {step === 4 && "Shiny Silver is the worst emitter (best reflector)."}
            </div>
          )}

        </div>
      </div>
    \`
  },
  {
    name: 'LabP10ThermalExpansionSolid',
    title: 'Unit 11: Thermal Expansion of Solids',
    desc: 'Heat a metal rod secured by a bolt to observe the massive force of thermal expansion.',
    body: \`
      <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-700 p-8 h-[500px] flex flex-col items-center justify-center relative text-white">
        
        {/* Apparatus */}
        <div className="relative w-3/4 h-32 flex items-center justify-between border-x-8 border-slate-600 px-8">
           {/* The Rod */}
           <div className="absolute left-10 right-10 h-6 bg-slate-400 rounded-sm shadow-xl flex items-center justify-center transition-all duration-[3000ms]" style={{
             backgroundColor: step > 0 ? '#f87171' : '#94a3b8',
             boxShadow: step > 0 ? '0 0 30px rgba(248, 113, 113, 0.8)' : 'none',
             transform: step > 0 ? 'scaleX(1.02)' : 'scaleX(1)'
           }}>
             <span className="text-xs text-slate-800 font-bold mix-blend-overlay">IRON ROD</span>
           </div>
           
           {/* The Bolt (right side constraint) */}
           <div className="absolute right-8 h-16 w-3 bg-zinc-800 rounded-sm shadow-md flex items-center justify-center z-10 transition-transform duration-[3000ms]" style={{
             transform: step === 2 ? 'rotate(45deg) translate(10px, -20px)' : 'none',
             opacity: step === 2 ? 0 : 1
           }}>
             <div className="w-5 h-2 bg-zinc-900 absolute -top-1" />
           </div>
           {step === 2 && (
             <div className="absolute right-4 top-4 text-4xl animate-ping">💥</div>
           )}
        </div>

        {/* Burner */}
        <div className="w-32 h-12 bg-zinc-800 rounded-md mt-16 relative flex justify-center">
           {step > 0 && <div className="absolute -top-16 w-20 h-20 bg-blue-500 rounded-full blur-xl animate-pulse mix-blend-screen" />}
           {step > 0 && <div className="absolute -top-10 w-10 h-16 bg-blue-400/80 rounded-t-full blur-sm" />}
        </div>

        <div className="absolute bottom-8 flex gap-4">
          <button 
            onClick={() => setStep(1)}
            disabled={step > 0}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-lg font-bold"
          >
            Light Burner
          </button>
          <button 
            onClick={() => setStep(2)}
            disabled={step !== 1}
            className="px-6 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg font-bold"
          >
            Continue Heating (Snap!)
          </button>
        </div>

        {step === 2 && (
          <div className="absolute top-8 bg-red-900/50 border border-red-500 p-4 rounded-xl max-w-md text-center">
            <p className="font-bold text-red-200">The bolt snaps!</p>
            <p className="text-sm text-red-300 mt-2">The expanding iron rod exerts a massive force that exceeds the tensile strength of the cast iron bolt, snapping it in half.</p>
          </div>
        )}
      </div>
    \`
  },
  {
    name: 'LabP10ExpansionLiquids',
    title: 'Unit 11: Real and Apparent Expansion of Liquids',
    desc: 'Observe a liquid drop initially before rising due to glass expansion.',
    body: \`
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 h-[500px] flex justify-center items-end pb-24 relative">
        
        {/* Flask */}
        <div className="relative w-40 h-40 bg-blue-50/50 rounded-full border-4 border-slate-300 flex justify-center items-end p-2 transition-all duration-1000" style={{
          transform: step > 0 ? 'scale(1.05)' : 'scale(1)'
        }}>
          {/* Liquid pool */}
          <div className="absolute bottom-2 inset-x-2 h-20 bg-blue-500 rounded-b-full opacity-80" />
          
          {/* Capillary Tube */}
          <div className="absolute bottom-[90%] w-6 h-64 bg-white/80 border-x-4 border-slate-300 flex items-end justify-center">
            {/* Liquid column */}
            <div className="w-full bg-blue-500 transition-all duration-[2000ms] ease-in-out opacity-80" style={{
              height: step === 0 ? '40%' : step === 1 ? '20%' : '80%'
            }} />
          </div>
        </div>

        {/* Burner */}
        <div className="absolute bottom-8 w-24 h-8 bg-zinc-700 rounded-md">
          {step > 0 && <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-12 h-16 bg-orange-500 blur-md rounded-full animate-pulse" />}
        </div>

        {/* Marks */}
        <div className="absolute top-20 right-[40%] flex flex-col gap-[3rem] text-sm font-bold text-slate-500">
           <div className={step === 2 ? 'text-blue-600' : ''}>V3 (Real) ────</div>
           <div className={step === 0 ? 'text-blue-600' : ''}>V1 (Start) ────</div>
           <div className={step === 1 ? 'text-blue-600' : ''}>V2 (Apparent) ──</div>
        </div>

        <button 
          onClick={() => setStep(s => s < 2 ? s + 1 : 2)}
          className="absolute right-8 top-8 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold shadow-md"
        >
          {step === 0 ? 'Heat Flask' : step === 1 ? 'Wait longer...' : 'Done'}
        </button>

        {step > 0 && (
          <div className="absolute left-8 top-8 bg-blue-50 p-4 border border-blue-200 rounded-xl max-w-xs shadow-sm">
            <h4 className="font-bold text-blue-800 mb-2">Observation</h4>
            {step === 1 && <p className="text-slate-600 text-sm">The liquid level drops to V2! The glass flask expands first before the heat reaches the liquid.</p>}
            {step === 2 && <p className="text-slate-600 text-sm">The heat reaches the liquid, which expands significantly more than the glass, rising past V1 to V3.</p>}
          </div>
        )}
      </div>
    \`
  },
  {
    name: 'LabP10GasPressureBalloon',
    title: 'Unit 11: Pressure Exerted by Gas Particles',
    desc: 'Observe an inflated balloon expand in heat and shrink in cold.',
    body: \`
      <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-700 p-8 h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Environment controls */}
        <div className="absolute top-8 flex gap-4 bg-black/40 p-2 rounded-xl backdrop-blur-md z-20">
          <button onClick={() => setStep(1)} className="px-6 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-bold">Ice Water (0°C)</button>
          <button onClick={() => setStep(0)} className="px-6 py-2 bg-slate-500 hover:bg-slate-400 text-white rounded-lg font-bold">Room Temp (25°C)</button>
          <button onClick={() => setStep(2)} className="px-6 py-2 bg-red-500 hover:bg-red-400 text-white rounded-lg font-bold">Hot Water (80°C)</button>
        </div>

        {/* The Balloon */}
        <div className="relative z-10 transition-all duration-1000 ease-[cubic-bezier(0.4, 0, 0.2, 1)]" style={{
          transform: step === 1 ? 'scale(0.7)' : step === 2 ? 'scale(1.4)' : 'scale(1)'
        }}>
           <div className="w-48 h-56 bg-red-500 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-[inset_-20px_-20px_40px_rgba(0,0,0,0.3)] relative flex items-center justify-center overflow-hidden">
             
             {/* Particles representation */}
             <div className="absolute inset-0 opacity-50 flex items-center justify-center">
                <div className="w-full h-full animate-spin" style={{ animationDuration: step === 1 ? '10s' : step === 2 ? '1s' : '4s' }}>
                   {[...Array(12)].map((_, i) => (
                     <div key={i} className="absolute w-2 h-2 bg-white rounded-full" style={{
                       top: \\\`\${50 + Math.sin(i) * 30}%\\\`,
                       left: \\\`\${50 + Math.cos(i) * 30}%\\\`
                     }} />
                   ))}
                </div>
             </div>

           </div>
           {/* Balloon tie */}
           <div className="w-4 h-6 bg-red-600 mx-auto mt-[-5px] rounded-b-md shadow-sm" />
        </div>

        {/* The bath */}
        <div className="absolute bottom-0 w-3/4 h-32 rounded-t-3xl border-t-4 border-x-4 border-white/20 transition-colors duration-1000 flex items-start justify-center p-2" style={{
          backgroundColor: step === 1 ? 'rgba(59, 130, 246, 0.4)' : step === 2 ? 'rgba(239, 68, 68, 0.4)' : 'transparent',
          borderColor: step === 0 ? 'transparent' : 'rgba(255,255,255,0.2)'
        }}>
          {step === 1 && <div className="text-blue-200 font-bold opacity-50">ICE BATH</div>}
          {step === 2 && <div className="text-red-200 font-bold opacity-50">HOT WATER BATH</div>}
        </div>

        {step !== 0 && (
          <div className="absolute bottom-8 left-8 bg-black/60 p-4 rounded-xl border border-white/10 max-w-sm text-white">
            <h4 className="font-bold text-amber-400 mb-1">Kinetic Theory</h4>
            <p className="text-sm">
              {step === 1 ? "Lower temperature means lower kinetic energy. Particles move slower, exerting less pressure on the walls, causing the balloon to shrink." : "Higher temperature means higher kinetic energy. Particles move faster, hitting the walls more forcefully and frequently, expanding the balloon."}
            </p>
          </div>
        )}
      </div>
    \`
  },
  {
    name: 'LabP10LatentHeat',
    title: 'Unit 11: Latent Heat of Fusion and Vaporization',
    desc: 'Heat ice continuously and observe the temperature plateaus during state changes.',
    body: \`
      <div className="bg-slate-50 flex flex-col md:flex-row gap-6 h-[500px]">
        
        {/* Graph Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h3 className="font-bold text-slate-700 mb-4 text-center">Temperature vs Time</h3>
          <div className="flex-1 relative border-l-2 border-b-2 border-slate-800 ml-8 mb-8">
            
            <div className="absolute -left-8 bottom-[0%] text-xs font-mono text-slate-500">-20</div>
            <div className="absolute -left-6 bottom-[20%] text-xs font-mono text-slate-500">0</div>
            <div className="absolute -left-8 bottom-[60%] text-xs font-mono text-slate-500">100</div>
            <div className="absolute -left-8 bottom-[80%] text-xs font-mono text-slate-500">120</div>

            {/* The Graph Line (drawn progressively) */}
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
              <path d="M 0 100 L 15 80 L 40 80 L 65 40 L 95 40 L 100 20" fill="none" stroke="#e2e8f0" strokeWidth="4" />
              
              <path d="M 0 100 L 15 80 L 40 80 L 65 40 L 95 40 L 100 20" fill="none" stroke="#ef4444" strokeWidth="4" 
                strokeDasharray="300" strokeDashoffset={300 - (step / 5) * 300} className="transition-all duration-1000" />
            </svg>

            {step >= 1 && step <= 2 && <div className="absolute left-[20%] bottom-[82%] text-xs font-bold text-blue-600 bg-blue-50 px-2 rounded">Melting (Latent Heat of Fusion)</div>}
            {step >= 4 && <div className="absolute left-[70%] bottom-[42%] text-xs font-bold text-red-600 bg-red-50 px-2 rounded">Boiling (Latent Heat of Vaporization)</div>}
          </div>
        </div>

        {/* Experiment Area */}
        <div className="w-1/3 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-between">
          
          <div className="text-3xl font-mono font-bold text-slate-800 mb-4">
            {step === 0 ? '-20' : step === 1 || step === 2 ? '0' : step === 3 ? '50' : step === 4 || step === 5 ? '100' : '110'}°C
          </div>

          <div className="relative w-32 h-40 border-4 border-slate-300 rounded-b-xl border-t-0 flex items-end justify-center pb-2 bg-sky-50 overflow-hidden">
            
            {/* Ice */}
            {step < 2 && (
              <div className="absolute bottom-2 w-24 h-20 bg-blue-200/80 border-2 border-blue-300 rounded-sm grid grid-cols-2 gap-1 p-1 transform -rotate-6">
                <div className="bg-white/50 rounded-sm" /><div className="bg-white/50 rounded-sm" />
                <div className="bg-white/50 rounded-sm" /><div className="bg-white/50 rounded-sm" />
              </div>
            )}

            {/* Water */}
            {step >= 1 && step < 5 && (
              <div className="absolute bottom-0 w-full bg-blue-500/60 transition-all duration-1000" style={{ height: step === 1 ? '30%' : step === 4 ? '40%' : '60%' }} />
            )}

            {/* Steam bubbles */}
            {step >= 4 && (
              <div className="absolute inset-0 flex flex-col justify-end pb-4 items-center opacity-60">
                <div className="w-2 h-2 bg-white rounded-full animate-ping mb-2" />
                <div className="w-3 h-3 bg-white rounded-full animate-ping mb-4" />
              </div>
            )}
            
            {/* Steam Cloud out top */}
            {step >= 5 && (
              <div className="absolute -top-10 w-24 h-20 bg-slate-300/40 rounded-full blur-xl animate-pulse" />
            )}
          </div>

          <button 
            onClick={() => setStep(s => Math.min(5, s + 1))}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg mt-8"
          >
            {step === 5 ? 'Done' : 'Heat +'}
          </button>
        </div>

      </div>
    \`
  }
];

labs.forEach(lab => {
  const code = template(lab.name, lab.title, lab.desc, lab.body);
  fs.writeFileSync(path.join(componentsDir, \`\${lab.name}.tsx\`), code, 'utf-8');
});

console.log('Batch 1 complete.');
