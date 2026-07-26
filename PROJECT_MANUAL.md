# 📘 VirtualLab / Cendronyx Labs — Complete Technical & User Manual

---

## 1. Executive Summary & Application Overview

**VirtualLab (Cendronyx Labs)** is an interactive, web-based educational virtual laboratory platform designed for middle and high school students (Classes 6 through 12). It provides immersive, real-time interactive simulations, mathematical theorem viewers, step-by-step formula derivations, interactive quizzes, vocabulary modules, custom lab authoring tools (`LabBuilder`), and a full-fledged visual simulation studio (`SimulationStudio`).

### Core Target Audience & Curriculum Coverage
- **Classes 6–8 (Middle School)**: Fundamental Physics (Measurements, Forces, Light, Energy), Mathematics (Factors, Proportions, Geometry, Equations), English Grammar & Vocabulary.
- **Classes 9–10 (Secondary School)**: Kinematics, Dynamics, Work & Energy, Gravitation, Thermal Properties, Electricity, Optics, Sound, Algebra, Geometry, Chemistry, Biology, Computer Science.
- **Classes 11–12 (Higher Secondary School)**: Vectors, Simple Harmonic Motion (SHM), Waves, Quantum & Nuclear Physics, Electromagnetism, Thermodynamics, Calculus, Vectors & 3D Geometry, Organic Chemistry, Cell Biology, Data Structures.

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript.
- **Build Tool & HMR**: Vite.
- **Styling**: Tailwind CSS + Custom CSS Variables + Glassmorphism (`index.css`).
- **Icons**: Lucide React.
- **State & Storage**: React Context API (`store.tsx`), IndexedDB (`dbService.ts`), LocalStorage (`customLabService.ts`, `customSimService.ts`).
- **Offline & PWA**: Service Workers via Workbox / Vite PWA Plugin, Cache Expiry Monitor (`cacheExpiry.ts`).
- **Internationalization (i18n)**: Custom translation engine (`src/i18n/`) supporting **English** and **Roman Urdu**.
- **Math Formatting & Evaluation**: `equationEvaluator.ts` (safe expression parser for trig, powers, constants) + KaTeX/MathJax latex renderers.
- **Audio & Accessibility**: Browser Speech Synthesis API (`speech.d.ts`), responsive touch gestures (`useSwipeGesture.ts`).

---

## 2. Comprehensive Directory & File Structure

```
virtuallab/
├── index.html                       # HTML5 entry point & root DOM node (#root)
├── vite.config.ts                   # Vite configuration, PWA setup, build targets
├── tsconfig.json                    # Root TypeScript configuration
├── tsconfig.app.json                # Application TypeScript compilation rules
├── tsconfig.node.json               # Node script compilation rules
├── tailwind.config.js               # Tailwind CSS theme extensions & plugins
├── package.json                     # Node dependencies & project scripts
├── PROJECT_MANUAL.md                # This master documentation file
└── src/
    ├── App.tsx                      # Main React Router switchboard & route definitions
    ├── main.tsx                     # React root initialization, PWA monitor, StoreProvider
    ├── index.css                    # Global CSS design system, dark mode overrides, custom scrollbars
    ├── store.tsx                    # Global state context (Theme, User, Progress, StoreProvider)
    ├── speech.d.ts                  # TypeScript definitions for SpeechSynthesis API
    │
    ├── assets/                      # Static branding assets, icons, logo vectors
    │
    ├── components/                  # UI Component Library
    │   ├── Header.tsx               # Top navigation bar, theme toggle, profile menu, studio link
    │   ├── LabHeader.tsx            # Lab execution header (title, progress ring, back, reset)
    │   ├── Sidebar.tsx              # Sidebar navigation for dashboards & classes
    │   ├── BottomNav.tsx            # Mobile bottom navigation bar
    │   ├── ProtectedRoute.tsx       # Auth guard wrapper for private routes
    │   ├── ErrorBoundary.tsx        # React error boundary component with fallback UI
    │   ├── Login.tsx                # User authentication & session setup screen
    │   ├── Layout.tsx               # Master shell layout wrapper
    │   ├── WelcomeTour.tsx          # Onboarding step-by-step tour modal
    │   ├── CelebrationModal.tsx     # Lab completion celebratory popup with confetti
    │   ├── CustomSimulationRenderer.tsx # Dynamic SVG canvas renderer for equation-driven physics
    │   ├── CustomLabRunner.tsx      # Execution engine for teacher-created custom labs
    │   ├── FormulaBuilder.tsx       # Visual formula builder modal (operators, variables, functions)
    │   │
    │   ├── vocab/                   # Vocabulary & Language Learning Components
    │   │   ├── WordCard.tsx         # Interactive vocabulary flashcard with pronunciation & examples
    │   │   ├── WordMeaning.tsx      # Detailed definition & usage component
    │   │   └── vocabAccent.ts       # Accent styling utilities for vocabulary words
    │   │
    │   └── widgets/                 # Reusable Lab Widgets
    │       ├── AssessmentPanel.tsx  # Quiz questions, MCQs, and instant grading widget
    │       ├── DataChart.tsx        # Real-time charting widget (SVG line charts)
    │       ├── DataLedger.tsx       # Data logging table for recording sensor/experiment readings
    │       ├── DeepDivePanel.tsx    # Conceptual deep-dive expandable cards
    │       ├── DerivationQuiz.tsx   # Drag-and-drop step ordering quiz for derivations
    │       ├── EquationBuilder.tsx  # Interactive algebraic equation assembly widget
    │       ├── FormulaBuilder.tsx   # Reusable equation builder widget
    │       ├── FrontierApplicationsPanel.tsx # Real-world application highlights
    │       ├── InteractiveCanvas.tsx# Freehand & shape interactive canvas widget
    │       ├── MathFormula.tsx      # Formatted math formula display component
    │       ├── MathText.tsx         # Markdown + Math typesetting text renderer
    │       ├── PredictionChallenge.tsx # Pre-lab hypothesis & prediction prompt
    │       ├── ProgressionPath.tsx  # Multi-step lab workflow step indicator
    │       ├── ProgressRing.tsx     # Circular percentage completion indicator
    │       ├── ResearchPaperAnalysis.tsx # Scientific paper summary & methodology analyzer
    │       ├── ScientificCalculator.tsx # Built-in scientific calculator modal
    │       └── SimulationDataChart.tsx # Chart renderer connected to simulation time series
    │
    ├── data/                        # Curriculum Data & Presets
    │   ├── labModules.ts            # Central catalog of built-in labs (Classes 6-12)
    │   ├── simulationPresets.ts     # Pre-built physics law templates for Simulation Studio
    │   ├── derivations/             # Step-by-step mathematical derivations
    │   │   ├── class11Derivations.tsx
    │   │   └── class12Derivations.tsx
    │   └── theorems/                # Mathematical theorems & interactive geometric proofs
    │       ├── class9Theorems.tsx
    │       ├── class10Theorems.tsx
    │       ├── class11Theorems.tsx
    │       └── class12Theorems.tsx
    │
    ├── hooks/                       # Custom React Hooks
    │   ├── useProgressDB.ts         # IndexedDB progress reader/writer hook
    │   ├── useProgressStats.ts      # Calculated student performance stats (XP, streaks, completion %)
    │   ├── useStableRandom.ts       # Seeded stable random generator for test repeatability
    │   ├── useSwipeGesture.ts       # Mobile touch swipe gesture detection
    │   └── useSyncStatus.ts         # Online/offline sync status hook
    │
    ├── i18n/                        # Internationalization Engine
    │   ├── index.tsx                # Translation context (`useTranslate`, `t` function)
    │   ├── labContent.ts            # Localized descriptions & titles for labs
    │   └── types.ts                 # Supported languages (`en`, `roman-urdu`) & schema
    │
    ├── locales/                     # Dictionary Files
    │   ├── en/translation.json      # English translations
    │   └── roman-urdu/translation.json # Roman Urdu translations
    │
    ├── pages/                       # Application Views / Pages
    │   ├── ClassSelection.tsx       # Main home dashboard / Grade level selection
    │   ├── SubjectSelection.tsx     # Subject picker (Physics, Math, Chemistry, Bio, CS, English)
    │   ├── ModuleSelection.tsx      # Chapter & module listing page with tab filters
    │   ├── LabRunner.tsx            # Main lab route wrapper
    │   ├── LabRunnerInner.tsx       # Core rendering shell for built-in labs & derivations
    │   ├── LabBuilder.tsx           # Drag-and-drop Custom Lab Authoring Studio
    │   ├── SimulationStudio.tsx     # Dedicated Visual Simulation Studio (Full)
    │   ├── SimulationStudioSimple.tsx # Wizard-based Simulation Studio (Quick mode)
    │   ├── HistoryDashboard.tsx     # Student progress, analytics, achievements & transcripts
    │   ├── SettingsPanel.tsx        # App settings (theme, language, audio, data management)
    │   ├── AdminReview.tsx          # Teacher/Admin approval board for submitted custom labs
    │   ├── Class9Physics.tsx        # Dedicated Class 9 Physics Lab Suite
    │   ├── Class9Math.tsx           # Dedicated Class 9 Math Lab Suite
    │   ├── Class10Physics.tsx       # Dedicated Class 10 Physics Lab Suite
    │   ├── Class10Math.tsx          # Dedicated Class 10 Math Lab Suite
    │   ├── Class11Physics.tsx       # Dedicated Class 11 Physics Lab Suite
    │   ├── Class11Math.tsx          # Dedicated Class 11 Math Lab Suite
    │   ├── Class12Physics.tsx       # Dedicated Class 12 Physics Lab Suite
    │   └── Class12Math.tsx          # Dedicated Class 12 Math Lab Suite
    │
    ├── physics/                     # Mathematical & Physical Physics Engines
    │   ├── kinematics.ts            # Motion equations, velocity, acceleration, trajectory
    │   ├── dynamics.ts              # Newton's laws, friction, momentum, centripetal force
    │   ├── energy.ts                # Kinetic, potential, work-energy theorem, conservation
    │   ├── gravitation.ts           # Universal gravitation, orbital velocity, escape velocity
    │   ├── matter.ts                # Density, pressure, buoyancy, Pascal's & Archimedes' laws
    │   └── moments.ts               # Torque, center of gravity, equilibrium conditions
    │
    ├── routes/                      # Route helpers & mapping
    │   └── labRoutes.ts             # Dynamic route resolving for grade/subject/lab IDs
    │
    ├── services/                    # Data Services & Storage APIs
    │   ├── dbService.ts             # IndexedDB database management (Dexie-based wrapper)
    │   ├── customLabService.ts      # Custom lab storage, import/export JSON service
    │   ├── customSimService.ts      # Custom simulation storage & preset manager
    │   ├── studentService.ts        # Student XP, badges, levels, and user profile service
    │   └── syncService.ts           # Offline sync queue manager
    │
    ├── utils/                       # Core Utilities
    │   ├── cacheExpiry.ts           # 3-day offline cache expiry monitor & cleanup
    │   ├── equationEvaluator.ts     # Safe math expression evaluator (`evaluateEquation`)
    │   ├── formulaValidation.ts     # Math syntax validator
    │   ├── labRegistry.ts           # Central lookup registry for lab components
    │   ├── labScaffolding.ts        # Automated template generator for new lab creation
    │   ├── labTheme.ts              # Central design tokens & theme classes (Dark mode)
    │   ├── labThemeLight.ts         # Light mode design tokens
    │   ├── mathRender.tsx           # Math rendering helpers
    │   ├── measurementNoise.ts      # Realistic sensor noise & random error generator
    │   └── sessionId.ts             # Unique session ID generator for analytics
    │
    └── test/                        # Unit & Integration Tests (Vitest)
        ├── setup.ts                 # Test setup & mock definitions
        ├── physics/                 # Physics engine unit tests
        ├── services/                # Database & service unit tests
        └── utilities/               # Utility unit tests
```

---

## 3. Application Routes & Screen Navigation

```
                       ┌─────────────────────────┐
                       │     / (ClassSelection)  │
                       └────────────┬────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
┌─────────▼──────────┐   ┌──────────▼──────────┐   ┌──────────▼──────────┐
│ /class/:classId    │   │  /simulation-studio │   │     /create-lab     │
│ (SubjectSelection) │   │ (SimulationStudio)  │   │    (LabBuilder)     │
└─────────┬──────────┘   └─────────────────────┘   └─────────────────────┘
          │
┌─────────▼─────────────────────┐
│ /class/:classId/:subjectId    │
│ (ModuleSelection)             │
└─────────┬─────────────────────┘
          │
┌─────────▼─────────────────────────────────┐
│ /class/:classId/:subjectId/lab/:moduleId  │
│ (LabRunner)                               │
└───────────────────────────────────────────┘
```

### Route Table
| Path | Component | Purpose | Access Control |
|---|---|---|---|
| `/` | `ClassSelection` | Main grade selection dashboard (Classes 6–12) | Public |
| `/login` | `Login` | User login & authentication modal | Public |
| `/class/:classId` | `SubjectSelection` | Pick subject for chosen class (Physics, Math, Chem, Bio, CS, English) | Public |
| `/class/:classId/:subjectId` | `ModuleSelection` | Select lab module, view progress badges, filter by lab type | Public |
| `/class/:classId/:subjectId/lab/:moduleId` | `LabRunner` | Execute interactive lab, derivation, or theorem viewer | Public |
| `/create-lab` | `LabBuilder` | Build custom multi-widget lab from scratch | Protected |
| `/edit-lab/:labId` | `LabBuilder` | Edit an existing custom lab | Protected |
| `/simulation-studio` | `SimulationStudio` | Design custom physics/math simulations visually | Protected |
| `/edit-simulation/:simId` | `SimulationStudio` | Edit a saved custom simulation | Protected |
| `/progress` / `/history` | `HistoryDashboard` | Student analytics, XP, badges, activity timeline | Protected |
| `/settings` | `SettingsPanel` | Theme, language, audio preferences, cache & data management | Protected |
| `/admin/review` | `AdminReview` | Review and publish community-submitted labs | Protected |

---

## 4. Architectural Deep Dive & Key Modules

### A. State Management & Storage Layer (`store.tsx` & `services/`)
1. **`store.tsx`**:
   - `StoreProvider` wraps the entire React app at the root (`main.tsx`).
   - Manages global state: `theme` (`'dark'` | `'light'`), `user` profile, and language preferences.
   - Listens to system color scheme preferences and updates the root `<html>` element class (`.dark`).
2. **`dbService.ts`**:
   - Provides an asynchronous IndexedDB database instance (`cendronyx_labs_db`).
   - Stores user progress, completed modules, quiz scores, timestamped attempt logs, and custom lab snapshots.
   - Automatically synchronizes with `useProgressStats.ts` hook.
3. **`customLabService.ts`**:
   - Manages custom labs created via `LabBuilder`.
   - Saves labs to `localStorage` under `cendronyx_custom_labs`.
   - Supports export to `.json` files and import from `.json` files for sharing custom labs between teachers.
4. **`customSimService.ts`**:
   - Manages custom equation-driven physics simulations created via `SimulationStudio`.
   - Stores simulation structures (`variables`, `equations`, `shapes`, `behavior`) in `localStorage` under `cendronyx_custom_simulations`.
5. **`cacheExpiry.ts`**:
   - Tracks the last active connection timestamp (`cendronyx_last_server_connection`).
   - On first visit, initializes the connection timestamp.
   - If the app is opened after 3+ days offline without a server connection, it cleanly purges expired ServiceWorker caches and updates the timestamp without entering infinite reload loops.

---

### B. Simulation Studio Engine (`SimulationStudio.tsx` & `CustomSimulationRenderer.tsx`)
The **Simulation Studio** enables teachers and students to build custom physics simulations from scratch without writing code:
1. **Variables**: Users define dynamic input variables (e.g., mass `m`, acceleration `a`, length `L`, gravity `g`, angle `theta`) with min, max, step size, default value, unit, and slider styling.
2. **Formulas / Equations**: Users write custom math expressions (e.g., `x = 200 + L * sin(theta)`, `y = 100 + L * cos(theta)`, `v = sqrt(2 * g * h)`).
3. **Shape Objects**: Users create vector shapes:
   - `circle` / `ball`: Controlled by `xExpr`, `yExpr`, `radiusExpr`, `color`.
   - `rectangle` / `block`: Controlled by `xExpr`, `yExpr`, `widthExpr`, `heightExpr`, `angleExpr`.
   - `line`: Controlled by `xExpr`, `yExpr`, `wExpr`, `hExpr` (start and end points).
   - `triangle`: Vector polygon scaled by size expressions.
   - `text`: Text label displaying raw text or live formula values.
4. **Physics Behaviors**: Preset behaviors like `x-position`, `y-position`, `gravity`, `friction`, `spring`, `collision`, `size`, `rotation`, and `opacity`.
5. **Execution & Animation Loop**:
   - Uses high-performance SVG vector rendering (`CustomSimulationRenderer.tsx`).
   - Runs a `requestAnimationFrame` loop animating time `t` (in seconds).
   - Calculates formulas frame-by-frame via `evaluateEquation.ts`.
   - Provides Play, Pause, Reset, and Animation Speed controls (0.25x to 4x).

---

### C. Lab Builder (`LabBuilder.tsx`)
The **Lab Builder** allows users to construct multi-widget educational labs:
- **Available Widgets**:
  - `Markdown Text Block`: Rich text explanations and mathematical formulas.
  - `Control Slider`: Interactive input slider linked to lab state variables (`simState`).
  - `Simulation Widget`: Mounts standard physics simulations (`pendulum`, `circuit`, `projectile`, etc.) or imports custom saved simulations built in `SimulationStudio`.
  - `Data Chart`: Line chart recording simulation state variables over time.
  - `Data Ledger`: Data table logging experiment observations and trials.
  - `Multiple Choice Quiz`: Quiz questions with options, correct answers, and feedback explanations.
  - `Prediction Challenge`: Hypothesis entry prompt before starting the lab.
  - `Derivation Quiz`: Drag-and-drop step ordering challenge.
- **Import / Export**: Built labs can be saved locally, exported to a JSON file, or published for administrative review (`AdminReview.tsx`).

---

### D. Safe Mathematical Expression Evaluator (`equationEvaluator.ts`)
The `evaluateEquation` function parses math string expressions safely without invoking unsafe `eval()`:
- **Supported Operators**: `+`, `-`, `*`, `/`, `%`, `^` (power).
- **Supported Constants**: `pi` (\(\pi\)), `e` (\(e\)).
- **Supported Trigonometric Functions**: `sin(x)`, `cos(x)`, `tan(x)`, `asin(x)`, `acos(x)`, `atan(x)`.
- **Supported Math Functions**: `sqrt(x)`, `abs(x)`, `pow(base, exp)`, `exp(x)`, `log(x)`, `log10(x)`, `floor(x)`, `ceil(x)`, `round(x)`, `min(a, b)`, `max(a, b)`.
- **Variable Substitution**: Dynamically substitutes variable keys (e.g. `t`, `m`, `g`, `L`) with their numerical values before evaluation.
- **Fallback**: Returns a user-specified fallback value (default `0`) if a syntax error or division by zero occurs.

---

### E. Physics Engines (`src/physics/`)
1. **`kinematics.ts`**:
   - Uniform motion: \(x = x_0 + v \cdot t\)
   - Accelerated motion: \(v = v_0 + a \cdot t\), \(x = x_0 + v_0 t + \frac{1}{2} a t^2\), \(v^2 = v_0^2 + 2 a \Delta x\)
   - Projectile motion: Trajectory coordinates \(x(t) = v_0 \cos(\theta) t\), \(y(t) = v_0 \sin(\theta) t - \frac{1}{2} g t^2\), max height, range, flight time.
2. **`dynamics.ts`**:
   - Newton's Second Law: \(F = m \cdot a\)
   - Friction force: \(f_s \le \mu_s N\), \(f_k = \mu_k N\)
   - Momentum & Impulse: \(p = m \cdot v\), \(J = F \cdot \Delta t = \Delta p\)
   - Centripetal Force: \(F_c = \frac{m v^2}{r}\)
3. **`energy.ts`**:
   - Kinetic Energy: \(KE = \frac{1}{2} m v^2\)
   - Potential Energy: \(PE = m g h\)
   - Elastic Potential Energy: \(SPE = \frac{1}{2} k x^2\)
   - Conservation of Mechanical Energy: \(E_{total} = KE + PE\)
4. **`gravitation.ts`**:
   - Universal Gravitation: \(F = G \frac{m_1 m_2}{r^2}\)
   - Gravitational Acceleration: \(g = \frac{G M}{R^2}\)
   - Orbital & Escape Velocity: \(v_o = \sqrt{\frac{G M}{r}}\), \(v_e = \sqrt{\frac{2 G M}{R}}\)
5. **`matter.ts`**:
   - Density: \(\rho = \frac{m}{V}\), Pressure: \(P = \frac{F}{A}\)
   - Hydrostatic Pressure: \(P = \rho g h\)
   - Archimedes' Principle & Buoyant Force: \(F_b = \rho_{fluid} V_{displaced} g\)
   - Pascal's Law: \(\frac{F_1}{A_1} = \frac{F_2}{A_2}\)
6. **`moments.ts`**:
   - Torque / Moment of Force: \(\tau = F \cdot d \cdot \sin(\theta)\)
   - Conditions of Equilibrium: \(\sum \vec{F} = 0\), \(\sum \vec{\tau} = 0\)

---

### F. Design System & Dark Mode (`labTheme.ts` & `index.css`)
- **Theme Tokens**: Standardized dark mode (`dark:bg-slate-900`, `dark:bg-slate-950`, `dark:border-slate-800`, `dark:text-slate-200`) and light mode styling tokens (`bg-white`, `bg-slate-50`, `text-slate-800`, `border-slate-200`).
- **Tailwind Opacity Override**: Global dark mode rules in `index.css` prevent inverted slate variable opacity classes (e.g. `dark:bg-slate-900/50`) from rendering with light silver backgrounds in dark mode.
- **Glassmorphism**: Backdrop blur effects (`backdrop-blur-md`, `bg-slate-900/80`).

---

### G. Internationalization Engine (`src/i18n/`)
- Supports **English** (`en`) and **Roman Urdu** (`roman-urdu`).
- `useTranslate()` hook returns the translation function `t("Key")`.
- Translation files located in `src/locales/en/translation.json` and `src/locales/roman-urdu/translation.json`.

---

## 5. Complete Curriculum Lab Inventory

### Class 6–8 (Middle School)
- **Physics**: Measurement & Instruments, Forces & Motion, Simple Machines, Light & Shadows, Heat & Temperature.
- **Mathematics**: Factors & Multiples, Fractions & Decimals, Basic Algebra, Perimeter & Area, Data Handling.
- **English**: Parts of Speech, Tenses & Verbs, Sentence Structure, Vocabulary Building.

### Class 9–10 (Secondary School)
- **Physics**: Physical Quantities & Measurement, Kinematics, Dynamics, Turning Effect of Forces, Gravitation, Work & Energy, Properties of Matter, Thermal Properties, Simple Harmonic Motion, Sound, Geometrical Optics, Electrostatics, Current Electricity, Electromagnetism, Basic Electronics, Atomic & Nuclear Physics.
- **Mathematics**: Real & Complex Numbers, Logarithms, Algebraic Expressions & Formulas, Factorization & Matrices, Linear Equations & Inequalities, Quadratic Equations, Coordinate Geometry, Trigonometry, Circle Theorems.
- **Chemistry**: Structure of Atom, Periodic Table, Chemical Bonding, States of Matter, Solutions, Electrochemistry, Chemical Reactivity.
- **Biology**: Cell Biology, Bioenergetics, Nutrition, Transport in Plants & Animals, Respiration, Coordination & Control.
- **Computer Science**: Problem Solving & Algorithms, Flowcharts, Basics of Programming, Data Structures, Computer Networks.

### Class 11–12 (Higher Secondary School)
- **Physics**: Vectors & Equilibrium, Motion & Force, Work & Energy, Circular Motion, Fluid Dynamics, Oscillations, Waves, Physical Optics, Thermodynamics, Electrostatics, Current Electricity, Electromagnetism, Electromagnetic Induction, Alternating Current, Physics of Solids, Electronics, Dawn of Modern Physics, Atomic Spectra, Nuclear Physics.
- **Mathematics**: Number Systems, Sets, Functions & Groups, Matrices & Determinants, Quadratic Equations, Partial Fractions, Sequences & Series, Permutations & Combinations, Mathematical Induction, Trigonometric Identities, Functions & Limits, Differentiation, Integration, Analytic Geometry, Vectors in 3D.

---

## 6. How to Run, Test, and Build

### Development Mode
```bash
npm run dev
```
Starts the Vite local development server at `http://localhost:5173`.

### Unit & Integration Testing
```bash
npm run test
```
Runs the Vitest test runner for physics calculations, services, and utility tests.

### Type Checking
```bash
npx tsc -p tsconfig.app.json --noEmit
```
Verifies TypeScript compilation and type safety across all components.

### Production Build
```bash
npm run build
```
Compiles TypeScript, runs Vite bundling, and generates production PWA output inside the `dist/` directory.

---

*Manual generated automatically for Cendronyx Labs VirtualLab codebase.*
