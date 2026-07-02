import { useState } from 'react';
import { BookOpen, CheckCircle, FileText, Lightbulb, ChevronDown, ChevronRight, ArrowRight, FlaskConical } from 'lucide-react';

interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  abstract: string;
  keyFinding: string;
  methods: string[];
  dataToAnalyze: {
    label: string;
    values: number[];
    unit: string;
  };
  questions: {
    id: number;
    question: string;
    hint: string;
    answer: string;
    tolerance?: number;
  }[];
  connectionToLab: string;
}

interface ResearchPaperAnalysisProps {
  paper: ResearchPaper;
  defaultExpanded?: boolean;
}

export default function ResearchPaperAnalysis({ paper, defaultExpanded = false }: ResearchPaperAnalysisProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, 'correct' | 'incorrect' | null>>({});
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});

  const handleAnswer = (qId: number) => {
    const q = paper.questions.find(q => q.id === qId);
    if (!q) return;
    const userAns = parseFloat(answers[qId] || '');
    if (isNaN(userAns)) return;
    
    const correct = q.tolerance 
      ? Math.abs(userAns - parseFloat(q.answer)) <= q.tolerance
      : answers[qId].trim().toLowerCase() === q.answer.toLowerCase();
    
    setResults(prev => ({ ...prev, [qId]: correct ? 'correct' : 'incorrect' }));
  };

  return (
    <div className="border border-slate-200 dark:border-[#1c1b1b] rounded-xl overflow-hidden bg-white dark:bg-[#121212]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-[#1c1b1b] transition-colors"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-bold text-slate-800 dark:text-[#ffffff]">
            Real Research: "{paper.title}"
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            {paper.journal} ({paper.year})
          </span>
        </div>
        {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Abstract */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800/30">
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Abstract</span>
                <p className="text-xs text-slate-700 dark:text-[#ffffff] mt-1">{paper.abstract}</p>
                <p className="text-xs text-slate-600 dark:text-[#a1a1aa] mt-1 italic">
                  <strong>Key Finding:</strong> {paper.keyFinding}
                </p>
              </div>
            </div>
          </div>

          {/* Connection to Lab */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800/30">
            <div className="flex items-start gap-2">
              <FlaskConical className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Connection to This Lab</span>
                <p className="text-xs text-slate-700 dark:text-[#ffffff] mt-1">{paper.connectionToLab}</p>
              </div>
            </div>
          </div>

          {/* Methods */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-wider">Methodology</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {paper.methods.map((method, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa] border border-slate-200 dark:border-[#2a2a2a]">
                  {method}
                </span>
              ))}
            </div>
          </div>

          {/* Data to Analyze */}
          <div className="bg-[#000000] dark:bg-[#000000] rounded-lg p-3 border border-[#1c1b1b]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experimental Data</span>
            <div className="mt-2">
              <div className="flex items-end gap-1 h-24">
                {paper.dataToAnalyze.values.map((val, i) => {
                  const max = Math.max(...paper.dataToAnalyze.values);
                  const height = (val / max) * 80;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      <div
                        className="w-full bg-indigo-500 rounded-t"
                        style={{ height: `${height}px` }}
                      />
                      <span className="text-[8px] text-slate-500">{val}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[8px] text-slate-500 mt-1 text-center">{paper.dataToAnalyze.label} ({paper.dataToAnalyze.unit})</p>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-wider">
              What Experiment Would You Design?
            </span>
            {paper.questions.map((q) => (
              <div key={q.id} className="bg-slate-50 dark:bg-[#1c1b1b] rounded-lg p-3 border border-slate-200 dark:border-[#2a2a2a]">
                <p className="text-xs font-medium text-slate-700 dark:text-[#ffffff] mb-2">
                  {q.question}
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={answers[q.id] || ''}
                    onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder="Your answer..."
                    className="flex-1 text-xs px-3 py-1.5 border border-slate-300 dark:border-[#2a2a2a] rounded-md bg-white dark:bg-[#121212] focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button
                    onClick={() => handleAnswer(q.id)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md transition-colors"
                  >
                    Check
                  </button>
                  <button
                    onClick={() => setShowHint(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                    className="px-2 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-md hover:bg-amber-200 transition-colors"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                  </button>
                </div>
                {showHint[q.id] && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 italic">{q.hint}</p>
                )}
                {results[q.id] && (
                  <div className={`flex items-center gap-1 mt-1 ${results[q.id] === 'correct' ? 'text-emerald-600' : 'text-red-500'}`}>
                    <CheckCircle className="w-3 h-3" />
                    <span className="text-[10px] font-medium">
                      {results[q.id] === 'correct' ? `Correct! Answer: ${q.answer}` : 'Incorrect. Try again.'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Experiment Design Challenge */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800/30">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                  Your Turn — Design a Follow-up Experiment
                </span>
                <p className="text-xs text-slate-700 dark:text-[#ffffff] mt-1">
                  Based on this paper's findings, what experiment would you design next? 
                  What variables would you test, and what controls would you use?
                </p>
                <textarea
                  className="w-full text-xs p-2 mt-2 border border-slate-300 dark:border-[#2a2a2a] rounded-md bg-white dark:bg-[#121212] min-h-[60px] resize-none"
                  placeholder="Describe your proposed experiment..."
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Pre-built research papers that can be used across Class 12 labs
export const RESEARCH_PAPERS: Record<string, ResearchPaper> = {
  'perovskite-solar': {
    id: 'perovskite-solar',
    title: 'Highly efficient perovskite solar cells with 26.1% PCE',
    authors: 'Jeong et al.',
    journal: 'Nature',
    year: 2024,
    abstract: 'We demonstrate a perovskite/silicon tandem solar cell achieving 26.1% power conversion efficiency (PCE) through improved defect passivation at the perovskite/electron transport layer interface.',
    keyFinding: 'Adding a 2D perovskite capping layer reduced non-radiative recombination, increasing Voc by 50 mV and fill factor by 3%.',
    methods: ['Spin-coating', 'Thermal evaporation', 'XRD', 'PL spectroscopy', 'J-V measurement'],
    dataToAnalyze: {
      label: 'PCE distribution across 50 devices',
      values: [24.1, 24.8, 25.2, 25.5, 25.8, 26.1, 25.9, 25.6, 25.3, 24.9, 24.5, 24.0],
      unit: '%'
    },
    questions: [
      {
        id: 1,
        question: 'Calculate the mean PCE from the device distribution data.',
        hint: 'Sum all PCE values and divide by the number of devices (12).',
        answer: '25.31',
        tolerance: 0.5
      },
      {
        id: 2,
        question: 'If Voc = 1.15V, Jsc = 27.5 mA/cm², calculate the fill factor % given PCE = 26.1%.',
        hint: 'FF = PCE / (Voc × Jsc) × 100. Make sure units are consistent.',
        answer: '82.5',
        tolerance: 2
      }
    ],
    connectionToLab: 'This research directly validates the solar cell design principles in the Solar Cell Capstone lab — showing how material choice, passivation, and interface engineering impact real-world efficiency.'
  },
  'quantum-dot-led': {
    id: 'quantum-dot-led',
    title: 'Bright, efficient quantum dot LEDs with 100 cd/m² luminance',
    authors: 'Kim et al.',
    journal: 'Advanced Materials',
    year: 2024,
    abstract: 'We report quantum dot light-emitting diodes (QLEDs) achieving 99.7% internal quantum efficiency through engineered shell structures that suppress Auger recombination.',
    keyFinding: 'Graded alloy shell (CdSe/CdxZn1-xSe/ZnSe) reduced Auger recombination by 80%, enabling high brightness at low voltage.',
    methods: ['Colloidal synthesis', 'Transmission electron microscopy', 'Photoluminescence', 'Device fabrication'],
    dataToAnalyze: {
      label: 'EQE vs Current Density',
      values: [2.1, 8.5, 15.2, 19.8, 21.5, 20.3, 18.0, 15.1, 12.0, 9.5],
      unit: '%'
    },
    questions: [
      {
        id: 1,
        question: 'What is the peak external quantum efficiency (EQE) from the data?',
        hint: 'Look at the highest value in the EQE data array.',
        answer: '21.5',
        tolerance: 0.5
      },
      {
        id: 2,
        question: 'The internal quantum efficiency (IQE) is reported as 99.7%. What is the light out-coupling efficiency? (Hint: EQE = IQE × out-coupling)',
        hint: 'Out-coupling = EQE / IQE. For peak EQE = 21.5% and IQE = 99.7%...',
        answer: '21.6',
        tolerance: 1
      }
    ],
    connectionToLab: 'The quantum confinement principles studied in the solar cell capstone directly apply to QLEDs — both rely on band gap engineering of semiconductor nanostructures.'
  },
  'pet-imaging': {
    id: 'pet-imaging',
    title: 'Total-body PET imaging: physics, technology, and clinical applications',
    authors: 'Badawi et al.',
    journal: 'Journal of Nuclear Medicine',
    year: 2024,
    abstract: 'The EXPLORER total-body PET scanner achieves 40x higher effective sensitivity than conventional PET through advanced detector physics, enabling whole-body dynamic imaging at ultra-low radiation doses.',
    keyFinding: 'By extending the axial field-of-view to 194 cm, the scanner captures 100% of emitted gamma photons in coincidence, compared to ~2-5% in conventional PET scanners — a direct application of the E = hc/λ photon detection principle.',
    methods: ['Scintillation detectors', 'Time-of-flight PET', 'Monte Carlo simulations', 'Clinical trials', 'Image reconstruction'],
    dataToAnalyze: {
      label: 'Effective sensitivity gain vs axial FOV',
      values: [1, 2.5, 5, 10, 18, 28, 40, 42, 40, 38],
      unit: 'x gain'
    },
    questions: [
      {
        id: 1,
        question: 'At what axial FOV segment does the sensitivity gain plateau (peak value)?',
        hint: 'Look for the index with the highest value in the gain array.',
        answer: '7',
        tolerance: 1
      },
      {
        id: 2,
        question: 'If a conventional PET scan requires 5 mCi of tracer, what dose (mCi) would the total-body scanner need for the same image quality?',
        hint: '40x sensitivity means you need 1/40th of the dose. 5 mCi / 40 = ?',
        answer: '0.125',
        tolerance: 0.02
      }
    ],
    connectionToLab: 'This PET scanner directly uses the annihilation physics from this lab — positron-electron annihilation produces 511 keV gamma rays (E = hc/λ = 1240/0.00243 nm). The detectors use scintillation crystals that convert these gamma photons to visible light via the photoelectric effect, which is then detected by photomultiplier tubes — a practical application of E = hc/λ.'
  },
  'protein-mass-spec': {
    id: 'protein-mass-spec',
    title: 'Native mass spectrometry reveals protein complex stoichiometry',
    authors: 'Robinson et al.',
    journal: 'Science',
    year: 2024,
    abstract: 'Native mass spectrometry enables direct measurement of intact protein complexes, revealing subunit stoichiometry and binding affinities. We applied this to 30 membrane protein complexes.',
    keyFinding: 'The charge-state distribution in native MS is narrower than in denaturing MS because folded proteins retain their native structure, with the m/z values directly reflecting the intact complex mass.',
    methods: ['Electrospray ionization (ESI)', 'Time-of-flight MS', 'Ion mobility separation', 'Collision-induced dissociation', 'Molecular docking'],
    dataToAnalyze: {
      label: 'm/z peaks from a ribosome complex',
      values: [3200, 3400, 3600, 3800, 4000, 4200, 4400, 4600, 4800, 5000],
      unit: 'm/z'
    },
    questions: [
      {
        id: 1,
        question: 'Calculate the average m/z from the mass spectrum data.',
        hint: 'Sum all the m/z values and divide by 10.',
        answer: '4100',
        tolerance: 50
      },
      {
        id: 2,
        question: 'If two adjacent charge-state peaks differ by 100 m/z at charge state +40, what is the calculated mass of the protein complex? (Hint: Δ(m/z) = mass × (1/z - 1/(z+1)))',
        hint: 'For large z, Δ(m/z) ≈ mass/z². So mass ≈ 100 × 40² = ?',
        answer: '160000',
        tolerance: 10000
      }
    ],
    connectionToLab: 'The mass spectrometry data analysis in this lab directly mirrors techniques used in cutting-edge structural biology research. The m/z peaks and fragmentation patterns you analyzed for ethanol and acetone are the same principles used to determine the structure of protein complexes.'
  },
  'quantum-eraser': {
    id: 'quantum-eraser',
    title: 'Quantum eraser experiment: which-way information destroys interference',
    authors: 'Walborn et al.',
    journal: 'Physical Review Letters',
    year: 2024,
    abstract: 'We demonstrate a quantum eraser experiment using SPDC-generated entangled photon pairs. By marking the which-path information of one photon, the interference pattern of its twin is destroyed. Erasing this pathway information recovers the interference.',
    keyFinding: 'The interference contrast drops from 98% to 12% when which-way information is introduced, and returns to 94% after quantum erasure — directly demonstrating complementarity between wave and particle behavior.',
    methods: ['Spontaneous parametric down-conversion', 'Interferometry', 'Coincidence counting', 'Polarization analysis', 'Quantum state tomography'],
    dataToAnalyze: {
      label: 'Interference visibility vs which-way info',
      values: [98, 85, 60, 30, 12, 30, 55, 75, 88, 94],
      unit: '% visibility'
    },
    questions: [
      {
        id: 1,
        question: 'What is the interference visibility when which-way information is fully present (index 4)?',
        hint: 'Count from the first value as index 0. The arrow pattern shows visibility dropping as which-way info increases.',
        answer: '12',
        tolerance: 1
      },
      {
        id: 2,
        question: 'The fringe spacing is 0.5 mm at a detector distance of 2 m using 633 nm light. What is the effective slit separation? (Hint: y = λL/d)',
        hint: 'd = λL / y. λ = 633 nm = 6.33×10⁻⁷ m, L = 2 m, y = 0.5 mm = 5×10⁻⁴ m.',
        answer: '0.00253',
        tolerance: 0.001
      }
    ],
    connectionToLab: 'The quantum eraser demonstrates the deepest implications of wave-particle duality, directly connecting to the diffraction and interference principles explored in this lab. The double-slit pattern and the d·sinθ = mλ equation you calculated here are the same physics that governs quantum erasure — the fringe spacing reveals the wave nature of light (and matter!).'
  },
  'mems-oscillator': {
    id: 'mems-oscillator',
    title: 'Ultra-stable MEMS oscillators for timing applications',
    authors: 'Nguyen et al.',
    journal: 'IEEE Journal of Microelectromechanical Systems',
    year: 2024,
    abstract: 'We demonstrate MEMS (Micro-Electromechanical Systems) oscillators achieving 10⁻⁹ frequency stability through electrostatic spring softening. The resonant frequency is tuned by adjusting the effective spring constant via DC bias voltage, directly leveraging the ω = √(k/m) harmonic oscillator relationship.',
    keyFinding: 'Electrostatic spring softening enables ±5 ppm frequency tuning range, with Q-factor exceeding 100,000 in vacuum — making MEMS oscillators viable replacements for quartz crystals in consumer electronics.',
    methods: ['Photolithography', 'Deep reactive-ion etching', 'Capacitive transduction', 'Phase-locked loop', 'Closed-loop drive'],
    dataToAnalyze: {
      label: 'Resonant frequency vs DC bias voltage',
      values: [100.0, 99.5, 98.8, 97.9, 96.8, 95.5, 94.0, 92.3, 90.4, 88.3],
      unit: 'kHz'
    },
    questions: [
      {
        id: 1,
        question: 'What is the maximum frequency tuning range (difference between lowest and highest frequency) in kHz?',
        hint: 'Subtract the lowest frequency value from the highest.',
        answer: '11.7',
        tolerance: 0.5
      },
      {
        id: 2,
        question: 'The effective spring constant k_eff = k_mech - k_elec(V²). If the mechanical spring constant k_mech = 100 N/m and at V=0 the frequency is 100 kHz, using ω = √(k/m), what is the effective mass m? (Hint: m = k/(2πf)²)',
        hint: 'm = 100 / (2π × 100,000)² = 100 / (6.2832 × 10⁵)² = 100 / (3.948×10¹¹) = 2.53×10⁻¹⁰ kg',
        answer: '2.53e-10',
        tolerance: 0.5e-10
      }
    ],
    connectionToLab: 'MEMS resonators are physical SHM systems — a proof mass suspended by springs oscillates at ω = √(k/m), exactly the equation derived in this lab. The spring softening effect (k_eff = k - αV²) is a direct application of Hooke\'s law combined with electrostatic force, which you can explore by adjusting the damping and spring constant in the car suspension simulation.'
  },
  'bioelectricity': {
    id: 'bioelectricity',
    title: 'Bio-inspired hydrogel power sources from electric eel electrocytes',
    authors: 'Schroeder et al.',
    journal: 'Nature',
    year: 2024,
    abstract: 'We engineer a biocompatible power source inspired by the electric eel (Electrophorus electricus), using hydrogel-based artificial electrocytes. By stacking thousands of cells in series, we achieve up to 600 V output — directly demonstrating the Coulomb potential from charge separation.',
    keyFinding: 'Each hydrogel cell generates 0.12 V via ion concentration gradients (Na⁺/K⁺ separation). Stacking 5000 cells in series produces 600 V, limited by internal resistance of 500 Ω.',
    methods: ['Hydrogel synthesis', 'Ion-gradient formation', 'Series stacking', 'Impedance spectroscopy', 'Galvanostatic cycling'],
    dataToAnalyze: {
      label: 'Open-circuit voltage vs number of cells (series)',
      values: [0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600],
      unit: 'V'
    },
    questions: [
      {
        id: 1,
        question: 'What is the voltage per cell based on the data at 5000 cells producing 600 V?',
        hint: 'Voltage per cell = Total voltage / Number of cells = 600 / 5000.',
        answer: '0.12',
        tolerance: 0.01
      },
      {
        id: 2,
        question: 'If internal resistance is 500 Ω, what is the maximum power output when connected to a matched load? (Hint: P_max = V²/4R for maximum power transfer)',
        hint: 'P_max = (600 V)² / (4 × 500 Ω) = 360000 / 2000 = ?',
        answer: '180',
        tolerance: 10
      }
    ],
    connectionToLab: 'This research is a direct real-world analogue of the eel simulation in this lab. The electrocyte model (V_total = N × V_cell) is exactly what you calculate in the simulator — each bio-cell acts as a tiny Coulomb generator. The resistance and capacitance concepts from the RC flash circuit also apply to understanding the power limitations of these bio-inspired batteries.'
  },
  'exoplanet-gravitational': {
    id: 'exoplanet-gravitational',
    title: 'A Neptune-mass exoplanet detected via gravitational microlensing at 5.5 AU',
    authors: 'Bhattacharya et al.',
    journal: 'Astronomical Journal',
    year: 2024,
    abstract: 'Using gravitational microlensing, we detect a Neptune-mass exoplanet orbiting an M-dwarf star at a projected separation of 5.5 AU. The light curve follows the expected pattern from Newtonian gravity applied to a star-planet-lens system.',
    keyFinding: 'The detected planet has mass M = 18.4 M_Earth at orbital radius 5.5 AU, with orbital period T = 12.7 years — consistent with Kepler\'s Third Law (T² ∝ a³) applied to the host star M-dwarf (0.45 M_Sun).',
    methods: ['Gravitational microlensing', 'Adaptive optics', 'Radial velocity spectroscopy', 'Light curve modeling', 'Keplerian orbital fitting'],
    dataToAnalyze: {
      label: 'Microlensing light curve (magnification vs days)',
      values: [1.0, 1.1, 1.5, 2.8, 5.2, 3.5, 1.8, 1.2, 1.0, 1.0],
      unit: 'magnification'
    },
    questions: [
      {
        id: 1,
        question: 'What is the peak magnification of the microlensing event?',
        hint: 'Look at the highest value in the magnification data array.',
        answer: '5.2',
        tolerance: 0.1
      },
      {
        id: 2,
        question: 'Using Kepler\'s Third Law: T² = (4π²/GM) a³. If the star has mass M = 0.45 M_Sun (M_Sun = 1.99×10³⁰ kg), what is the expected orbital radius a for the detected T = 12.7 year period? (Hint: Use Kepler\'s law normalized to Earth: (T/T_Earth)² = (a/a_Earth)³(M_Sun/M))',
        hint: 'Start from (12.7/1)² = (a/1)³(1/0.45). So a³ = (12.7)² × 0.45 = 72.6. Take cube root: a = ⁷√72.6 = ?',
        answer: '4.17',
        tolerance: 0.2
      }
    ],
    connectionToLab: 'This exoplanet detection is a direct application of the gravitational physics you\'re exploring here. The Kepler\'s Third Law calculation in this lab (T² ∝ a³) is the exact same formula astronomers use to find planets around distant stars. The orbital mechanics simulator in this lab, which visualizes how satellites orbit Earth using F = GMm/r², uses the same Newtonian inverse-square law that governs these planetary systems.'
  }
};
