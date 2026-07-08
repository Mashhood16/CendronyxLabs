import { useState } from 'react';
import { Target, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';
import MathFormula from './MathFormula';
import { useTranslate } from '../i18n';

export default function LabP9DerivationForceMomentum({ onExit }: { onExit?: () => void }) {
  const { t } = useTranslate();
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [mass, setMass] = useState(2);
  const [vi, setVi] = useState(0);
  const [vf, setVf] = useState(10);
  const [time, setTime] = useState(2);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const deltaP = mass * (vf - vi);
  const force = deltaP / time;

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    const expected = force;
    setCheckResult(Math.abs(val - expected) < expected * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: t('lab.step1_label'), formula: 'F = m × a', detail: t('lab.step1_detail') },
    { label: t('lab.step2_label'), formula: 'a = (vf − vi) / Δt', detail: t('lab.step2_detail') },
    { label: t('lab.step3_label'), formula: 'F = m × (vf − vi) / Δt', detail: t('lab.step3_detail') },
    { label: t('lab.step4_label'), formula: 'F = (pf − pi) / Δt = Δp / Δt', detail: t('lab.step4_detail') },
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title={t("Derivation: Force & Change in Momentum")} />

      {/* Mobile Tabs */}
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')}
          className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>{t('lab.tab.derivation')}</button>
        <button onClick={() => setActiveMobileTab('lab')}
          className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>{t('lab.tab.simulation')}</button>
      </div>

      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        {/* Column 1: Derivation (primary focus - spans 3 columns) */}
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{t('lab.step_by_step')}</h2>
              <p className="text-xs text-slate-500">{t('lab.derivation_subtitle')}</p>
            </div>
          </div>

          {/* Formula card - always visible */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-blue-200 font-semibold uppercase tracking-wider">{t('lab.final_formula')}</p>
            <p className="text-2xl font-bold text-white mt-1"><MathFormula formula="F = Δp / Δt" /></p>
            <p className="text-xs text-blue-200 mt-1">{t('lab.final_formula_desc')}</p>
          </div>

          {/* Derivation chain - ALL steps always visible */}
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  {/* Step number vertical connector */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">
                      {idx + 1}
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-blue-400 to-blue-200 dark:from-blue-600 dark:to-blue-800" />
                    )}
                  </div>
                  {/* Step content */}
                  <div className="flex-1 pb-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800 mb-1">
                      <p className="font-bold text-base text-blue-800 dark:text-blue-300">{step.label}</p>
                    </div>
                    {/* Formula highlight */}
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]">
                      <MathFormula formula={step.formula} className="text-base font-bold text-yellow-400" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">
                      {step.detail}
                    </p>
                    {/* Arrow between steps */}
                    {idx < steps.length - 1 && (
                      <div className="flex justify-center mt-1">
                        <ArrowRight className="w-4 h-4 text-blue-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Interactive + Assessment (spans 2 columns) */}
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          {/* Interactive Simulator */}
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold">{t('lab.see_in_action')}</h2>
            </div>
            <p className="text-sm text-slate-500 mb-4">{t('lab.adjust_sliders')}</p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold"><span>{t('lab.mass_label')}</span><span className="text-blue-600 font-mono">{mass} kg</span></div>
                <input type="range" min="1" max="10" step="0.5" value={mass} onChange={e => { setMass(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold"><span>{t('lab.initial_velocity_label')}</span><span className="text-blue-600 font-mono">{vi}  {t('lab.p9derivationforcemomentum_m_s')}</span></div>
                <input type="range" min="0" max="20" step="1" value={vi} onChange={e => { setVi(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold"><span>{t('lab.final_velocity_label')}</span><span className="text-blue-600 font-mono">{vf}  {t('lab.p9derivationforcemomentum_m_s')}</span></div>
                <input type="range" min="0" max="30" step="1" value={vf} onChange={e => { setVf(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold"><span>{t('lab.time_interval_label')}</span><span className="text-blue-600 font-mono">{time} s</span></div>
                <input type="range" min="0.5" max="5" step="0.5" value={time} onChange={e => { setTime(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-blue-500" />
              </div>

              {/* Derivation trace showing each step with current values */}
              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-2">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{t('lab.derivation_trace')}</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm"><span className="text-slate-400">{t('lab.trace_step1')}</span><span className="text-slate-500">{t('lab.p9derivationforcemomentum_f')} {mass}  {t('lab.p9derivationforcemomentum_a')}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">{t('lab.trace_step2')}</span><span className="text-slate-500">{t('lab.p9derivationforcemomentum_a_1')}{vf} − {vi}) / {time} = {((vf - vi) / time).toFixed(1)}  {t('lab.p9derivationforcemomentum_m_s_1')}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">{t('lab.trace_step3')}</span><span className="text-slate-500">{t('lab.p9derivationforcemomentum_f')} {mass} × {((vf - vi) / time).toFixed(1)}</span></div>
                  <div className="border-t border-[#2a2a2a] pt-1.5 flex justify-between text-xs"><span className="text-green-400 font-bold">{t('lab.trace_step4')}</span><span className="text-yellow-400 font-mono font-bold">{force.toFixed(1)} N</span></div>
                </div>
              </div>

              {/* Motion visual */}
              <div className="relative h-10 bg-slate-100 dark:bg-[#1c1b1b] rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a2a2a]">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-300 dark:bg-[#2a2a2a]" />
                <div className="absolute transition-all duration-500 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-[8px] text-white font-bold shadow-lg"
                  style={{ left: `${10 + (vf / 30) * 70}%` }}>
                  m
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-base text-amber-700 dark:text-amber-300">{t('lab.real_life_application')}</p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{t('lab.real_life_airbags')}</p>
              </div>
            </div>
          </div>

          {/* Assessment */}
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-500" />
              {t('lab.practice_apply')}
            </h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">{t('lab.practice_cricket_q')}</p>
              <p className="text-base font-medium">{t('lab.practice_force_q')}</p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2 mt-2">
                <p className="text-xs text-blue-700 dark:text-blue-300 font-mono">{t('lab.practice_hint')}</p>
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
                placeholder={t('lab.force_placeholder')}
                className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-blue-500 outline-none" />
              <button onClick={checkAnswer}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
                {t('lab.check')}
              </button>
            </div>
            {checkResult === 'correct' && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <p className="text-xs text-emerald-700 dark:text-emerald-300">                <strong>{t('lab.correct')}</strong> {t('lab.practice_correct_feedback')}</p>
              </div>
            )}
            {checkResult === 'incorrect' && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-xs text-red-700 dark:text-red-300"><strong>{t('lab.incorrect')}</strong> {t('lab.incorrect_feedback')}</p>
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="text-[11px] text-slate-400 dark:text-[#71717a]">
              {t('lab.footer_prefix')}{' '}
              <span className="font-semibold text-indigo-500 dark:text-indigo-400">{t('lab.calculator')}</span>
              {' '}{t('lab.footer_suffix')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
