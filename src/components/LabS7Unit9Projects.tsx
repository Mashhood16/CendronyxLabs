import { ArrowLeft, BookOpen } from 'lucide-react';

interface LabProps {
  onExit: () => void;
}

export default function LabS7Unit9Projects({ onExit }: LabProps) {
  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans">
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
        <button onClick={onExit} className="flex items-center text-slate-600 hover:text-blue-600 font-medium">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
        </button>
        <h1 className="text-xl font-bold text-slate-800">Unit 9: Waves and Energy Projects</h1>
      </div>

      <div className="flex-1 p-8 flex flex-col items-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-4xl w-full">
          <div className="flex items-center mb-8">
            <div className="bg-purple-100 p-3 rounded-xl mr-4"><BookOpen className="w-8 h-8 text-purple-600" /></div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Rubber Band Instrument</h2>
              <p className="text-slate-500">Project Work Submission Guide</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <h3>Objective</h3>
            <p>Design and build a simple stringed instrument capable of playing at least 4 distinct musical notes ranging from a low pitch to a high pitch.</p>
            
            <h3>Instructions</h3>
            <ol>
              <li>Take a sturdy piece of thick card stock, a wooden board, or a sturdy empty tissue box.</li>
              <li>Place small nails or push-pins at varying distances apart. <em>(Ask an adult for help if using a hammer and nails).</em></li>
              <li>Stretch different sizes and thicknesses of rubber bands between the pins.</li>
              <li>Pluck each band and adjust the tension or length (by moving the pins) until you have a clear low, medium, high, and very high pitched note.</li>
            </ol>

            <div className="bg-slate-100 p-6 rounded-xl border border-slate-300 mt-8">
              <h4 className="text-slate-800 font-bold mt-0">Scientific Principles</h4>
              <p className="text-slate-700 mb-0">Be prepared to explain to your teacher how the <strong>thickness</strong> and <strong>length</strong> of the rubber bands affect the frequency of vibration and the resulting pitch.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
