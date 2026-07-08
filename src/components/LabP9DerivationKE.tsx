import { useState } from 'react';
import { Zap, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import LabHeader from './LabHeader';
import MathFormula from './MathFormula';
import { useTranslate } from '../i18n';

export default function LabP9DerivationKE({ onExit }: { onExit?: () => void }) {
  const { t } = useTranslate();
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
  const [mass, setMass] = useState(2);
  const [velocity, setVelocity] = useState(5);
  const [userAns, setUserAns] = useState('');
  const [checkResult, setCheckResult] = useState<'idle'|'correct'|'incorrect'>('idle');

  const kineticEnergy = 0.5 * mass * velocity * velocity;

  const checkAnswer = () => {
    const val = parseFloat(userAns);
    if (isNaN(val)) return;
    setCheckResult(Math.abs(val - kineticEnergy) < kineticEnergy * 0.1 ? 'correct' : 'incorrect');
  };

  const steps = [
    { label: t('lab.ke_step1_label'), formula: 'Eₖ = W = F × d', detail: t('lab.ke_step1_detail') },
    { label: t('lab.ke_step2_label'), formula: 'Eₖ = (m × a) × d', detail: t('lab.ke_step2_detail') },
    { label: t('lab.ke_step3_label'), formula: 'd = (v/2) × t, a = v/t', detail: t('lab.ke_step3_detail') },
    { label: t('lab.ke_step4_label'), formula: 'Eₖ = ½mv²', detail: t('lab.ke_step4_detail') },
  ];

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 dark:bg-[#000000] font-sans select-none text-slate-800 dark:text-white overflow-x-hidden w-full">
      <LabHeader onExit={onExit} title={t("Derivation: Kinetic Energy (Eₖ = ½mv²)")} />
      <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 shrink-0">
        <button onClick={() => setActiveMobileTab('theory')}
          className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-yellow-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>{t('lab.tab.derivation')}</button>
        <button onClick={() => setActiveMobileTab('lab')}
          className={`py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-yellow-600 text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}>{t('lab.tab.simulation')}</button>
      </div>
      <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 p-4 lg:p-6 lg:overflow-visible">
        {/* Column 1: Derivation (primary - spans 3) */}
        <div className={`lg:col-span-3 w-full bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] p-5 flex-col gap-4 lg:overflow-y-auto ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{t('lab.step_by_step')}</h2>
              <p className="text-xs text-slate-500">{t('lab.ke_subtitle')}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl p-5 text-center shadow-lg mb-3">
            <p className="text-xs text-yellow-200 font-semibold uppercase tracking-wider">{t('lab.final_formula')}</p>
            <p className="text-2xl font-bold text-white mt-1"><MathFormula formula="Eₖ = ½ × m × v²" /></p>
            <p className="text-xs text-yellow-200 mt-1">{t('lab.ke_final_desc')}</p>
          </div>

          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">{idx + 1}</div>
                    {idx < steps.length - 1 && <div className="w-0.5 h-full min-h-[24px] bg-gradient-to-b from-yellow-400 to-yellow-200 dark:from-yellow-600 dark:to-yellow-800" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800 mb-1">
                      <p className="font-bold text-base text-yellow-800 dark:text-yellow-300">{step.label}</p>
                    </div>
                    <div className="bg-[#000000] rounded-lg mx-1 my-1.5 px-3 py-2 text-center border border-[#1c1b1b]">
                      <MathFormula formula={step.formula} className="text-base font-bold text-yellow-400" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-1">{step.detail}</p>
                    {idx < steps.length - 1 && <div className="flex justify-center mt-1"><ArrowRight className="w-4 h-4 text-yellow-400" /></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Interactive + Assessment */}
        <div className={`lg:col-span-2 w-full flex flex-col gap-5 ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-5 h-5 text-yellow-500" /><h2 className="text-lg font-bold">{t('lab.see_in_action')}</h2></div>
            <p className="text-sm text-slate-500 mb-4">{t('lab.ke_adjust_desc')}</p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold"><span>{t('lab.ke_mass_label')}</span><span className="text-yellow-600 font-mono">{mass} kg</span></div>
                <input type="range" min="0.5" max="20" step="0.5" value={mass} onChange={e => { setMass(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-yellow-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold"><span>{t('lab.ke_vel_label')}</span><span className="text-yellow-600 font-mono">{velocity}  {t('lab.p9derivationke_m_s')}</span></div>
                <input type="range" min="1" max="20" step="0.5" value={velocity} onChange={e => { setVelocity(parseFloat(e.target.value)); setCheckResult('idle'); }} className="w-full accent-yellow-500" />
              </div>

              <div className="space-y-1.5">
                <div className="relative h-8 bg-slate-200 dark:bg-[#1c1b1b] rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300 rounded-full"
                    style={{ width: `${Math.min((kineticEnergy / 400) * 100, 100)}%` }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white drop-shadow-md">{kineticEnergy.toFixed(1)} J</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                <p className="text-xs font-bold text-yellow-700 dark:text-yellow-300">{'⚡'}  {t('lab.p9derivationke_the_v_effect')}</p>
                <div className="mt-1 space-y-1">
                  <div className="flex justify-between text-xs"><span className="text-slate-500">{t('lab.p9derivationke_half_speed')}{Math.max(1, (velocity * 0.5)).toFixed(1)}  {t('lab.p9derivationke_m_s_1')}</span><span className="text-yellow-600 font-mono">{(0.5 * mass * Math.max(1, velocity * 0.5) ** 2).toFixed(1)} J</span></div>
                  <div className="flex justify-between text-xs"><span className="text-slate-500">{t('lab.p9derivationke_current')}{velocity}  {t('lab.p9derivationke_m_s_1')}</span><span className="text-orange-600 font-mono font-bold">{kineticEnergy.toFixed(1)} J</span></div>
                  <div className="flex justify-between text-xs"><span className="text-slate-500">{t('lab.p9derivationke_double_speed')}{Math.min(velocity * 2, 20)}  {t('lab.p9derivationke_m_s_1')}</span><span className="text-red-600 font-mono">{(0.5 * mass * Math.min(velocity * 2, 20) ** 2).toFixed(1)}  {t('lab.p9derivationke_j')}{Math.min((velocity * 2) ** 2 / velocity ** 2, 20 ** 2 / velocity ** 2).toFixed(0)}×)</span></div>
                </div>
              </div>

              <div className="bg-[#000000] rounded-lg p-4 border border-[#1c1b1b] space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase">{t('lab.derivation_trace')}</p>
                <p className="text-sm text-slate-400">{t('lab.ke_trace1', { m: mass, v: velocity })}</p>
                <p className="text-sm text-slate-400">{t('lab.ke_trace2', { m: mass, vsq: velocity * velocity })}</p>
                <p className="border-t border-[#2a2a2a] pt-1 text-xs"><span className="text-green-400 font-bold">{t('lab.ke_trace3', { ke: kineticEnergy.toFixed(1) })}</span></p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-base text-amber-700 dark:text-amber-300">{t('lab.real_life_application')}</p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{t('lab.ke_real_life')}</p>
              </div>
            </div>
          </div>

          {/* Assessment */}
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Zap className="w-5 h-5 text-emerald-500" /> {t('lab.practice_apply')}</h2>
            <div className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-4 border border-slate-200 dark:border-[#2a2a2a] mb-3">
              <p className="text-base font-medium mb-2">{t('lab.ke_practice_q')}</p>
              <p className="text-base font-medium">{t('lab.ke_practice_q2')}</p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded p-2 mt-2">
                <p className="text-xs text-yellow-700 dark:text-yellow-300 font-mono">{t('lab.ke_practice_hint')}</p>
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="number" value={userAns} onChange={e => setUserAns(e.target.value)}
                placeholder={t('lab.ke_placeholder')}
                className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-[#2a2a2a] rounded-lg bg-white dark:bg-[#121212] focus:ring-2 focus:ring-yellow-500 outline-none" />
              <button onClick={checkAnswer} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors">{t('lab.check')}</button>
            </div>
            {checkResult === 'correct' && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <p className="text-xs text-emerald-700 dark:text-emerald-300"><strong>{t('lab.correct')}</strong> {t('lab.ke_correct_feedback')}</p>
              </div>
            )}
            {checkResult === 'incorrect' && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-xs text-red-700 dark:text-red-300"><strong>{t('lab.incorrect')}</strong> {t('lab.ke_incorrect_feedback')}</p>
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="text-[11px] text-slate-400 dark:text-[#71717a]">
              {t('lab.footer_prefix')}{' '}
              <span className="font-semibold text-indigo-500 dark:text-indigo-400">
                {t('lab.calculator')}
              </span>
              {' '}{t('lab.footer_suffix')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
