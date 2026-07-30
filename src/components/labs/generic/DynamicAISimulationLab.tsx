import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, BookOpen, Activity, Award, Sparkles, CheckCircle, HelpCircle } from 'lucide-react';
import { AISimulationSpec, CanvasPrimitive } from '../../../types/aiSimulation';
import { evaluateEquation } from '../../../utils/equationEvaluator';
import MathFormula from '../../widgets/MathFormula';
import SimulationDataChart from '../../widgets/SimulationDataChart';
import { useTheme } from '../../../store';

interface Props {
  spec: AISimulationSpec;
  onBack?: () => void;
}

export default function DynamicAISimulationLab({ spec, onBack }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'sim' | 'theory' | 'chart' | 'quiz'>('sim');

  // Slider State Initialization
  const [sliderVals, setSliderVals] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    spec.variables.forEach(v => {
      initial[v.key] = v.default;
    });
    return initial;
  });

  // Animation Loop State
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Data logging for chart
  const [chartData, setChartData] = useState<Array<{ t: number; values: Record<string, number> }>>([]);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});

  // 1. Timer / Physics Animation Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        setTime(prev => {
          const newT = prev + dt * simSpeed;
          return newT;
        });
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, simSpeed]);

  // 2. Computed Variable Values
  const currentContext = { ...sliderVals, t: time };
  const evaluatedComputed: Record<string, number> = {};
  spec.computedVars.forEach(cv => {
    evaluatedComputed[cv.key] = evaluateEquation(cv.expr, currentContext);
  });

  // Combined variables object for canvas & chart
  const evalState: Record<string, number> = { ...sliderVals, ...evaluatedComputed, t: time };

  // Smart variable resolver with alias lookup for dynamic slider reactivity
  const getVar = (aliases: string[], fallbackDefault: number): number => {
    for (const a of aliases) {
      const keyMatch = Object.keys(evalState).find(k => k.toLowerCase() === a.toLowerCase());
      if (keyMatch !== undefined && typeof evalState[keyMatch] === 'number' && !isNaN(evalState[keyMatch])) {
        return evalState[keyMatch];
      }
    }
    return fallbackDefault;
  };

  // 3. Log data points for chart
  useEffect(() => {
    if (!isPlaying) return;
    const yVal = evaluateEquation(spec.chart.yAxisExpr, evalState);
    
    setChartData(prev => {
      const next = [...prev, { t: Number(time.toFixed(2)), values: { [spec.chart.yLabel]: Number(yVal.toFixed(2)) } }];
      if (next.length > 150) next.shift(); // Keep latest 150 points
      return next;
    });
  }, [time, isPlaying]);

  // 4. HTML5 2D Canvas Physics Renderer
  const renderCanvasFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Canvas Background Grid
    ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const centerX = width / 2;
    const centerY = height / 2;

    // --- SAFELY EXECUTE AI-GENERATED HTML5 CANVAS JS CODE IF PRESENT ---
    if (spec.renderCode) {
      try {
        const codeBody = spec.renderCode.includes('function')
          ? '(' + spec.renderCode + ')(ctx, width, height, time, evalState, isDark, getVar);'
          : spec.renderCode;
        const customRender = new Function('ctx', 'width', 'height', 'time', 'evalState', 'isDark', 'getVar', codeBody);
        customRender(ctx, width, height, time, evalState, isDark, getVar);
        return;
      } catch (err) {
        console.warn('AI custom renderCode compilation failed, rendering vector primitives:', err);
      }
    }

    // --- HIGH-DEFINITION MEDICAL & DOMAIN VECTOR VISUALIZERS DISPATCH ---
    const vType = (spec.visualType || '').toLowerCase();
    const primitiveLabels = (spec.canvasPrimitives || []).map(p => (p.label || '').toLowerCase()).join(' ');
    const allText = (spec.title + ' ' + spec.description + ' ' + spec.category + ' ' + primitiveLabels + ' ' + vType).toLowerCase();

    const isBrain = allText.includes('brain') || allText.includes('cerebrum') || allText.includes('lobe') || allText.includes('cerebell');
    const isEye = allText.includes('eye') || allText.includes('vision') || allText.includes('retina') || allText.includes('cornea');
    const isKidney = allText.includes('kidney') || allText.includes('nephron') || allText.includes('renal') || allText.includes('glomerulus') || allText.includes('bowman') || allText.includes('ureter');
    const isHeart = allText.includes('heart') || allText.includes('cardiac') || allText.includes('aorta') || allText.includes('ventricle');
    const isCell = allText.includes('cell') || allText.includes('mitochondria') || allText.includes('cytoplasm');

    if (isKidney) {
      // HIGH-DEFINITION 2D HUMAN KIDNEY CROSS-SECTION MODEL
      const activeIdx = Math.abs(Math.round(getVar(['structureindex', 'highlightedstructureindex', 'index', 'selectedindex', 'structure'], 0))) % 4;
      const kidneyParts = [
        { id: 0, name: '1. Renal Cortex', color: '#ef4444', desc: 'Outer dark red layer containing ~1 million nephron glomeruli filtering blood' },
        { id: 1, name: '2. Renal Medulla Pyramids', color: '#f59e0b', desc: 'Triangular tissue pyramids containing loops of Henle & collecting ducts' },
        { id: 2, name: '3. Renal Pelvis & Calyces', color: '#38bdf8', desc: 'Funnel-shaped basin receiving urine from collecting ducts' },
        { id: 3, name: '4. Renal Vessels & Ureter', color: '#a855f7', desc: 'Renal artery/vein supplying blood flow & ureter draining waste to bladder' }
      ];

      const activePart = kidneyParts[activeIdx] || kidneyParts[0];
      const kCX = centerX - 50;
      const kCY = centerY;

      // 1. Kidney Bean Outer Silhouette (Renal Cortex & Capsule - Semi-Transparent Background)
      ctx.fillStyle = activeIdx === 0 ? (isDark ? 'rgba(239, 68, 68, 0.35)' : 'rgba(254, 202, 202, 0.65)') : (isDark ? 'rgba(127, 29, 29, 0.25)' : 'rgba(254, 226, 226, 0.45)');
      ctx.strokeStyle = activeIdx === 0 ? '#ffffff' : '#ef4444';
      ctx.lineWidth = activeIdx === 0 ? 4 : 2.5;
      if (activeIdx === 0) { ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 22; }

      ctx.beginPath();
      ctx.moveTo(kCX - 20, kCY - 125);
      ctx.bezierCurveTo(kCX + 110, kCY - 125, kCX + 120, kCY + 125, kCX - 20, kCY + 125);
      ctx.bezierCurveTo(kCX - 65, kCY + 85, kCX - 45, kCY + 25, kCX - 45, kCY);
      ctx.bezierCurveTo(kCX - 45, kCY - 25, kCX - 65, kCY - 85, kCX - 20, kCY - 125);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 2. Renal Medulla Pyramids (6 Triangular Pyramids)
      ctx.shadowBlur = 0;
      ctx.fillStyle = activeIdx === 1 ? '#f59e0b' : (isDark ? '#78350f' : '#fde68a');
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = activeIdx === 1 ? 3 : 1.5;
      if (activeIdx === 1) { ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 18; }

      const numPyramids = 6;
      for (let p = 0; p < numPyramids; p++) {
        const pAngle = -Math.PI * 0.4 + p * (Math.PI * 0.8 / (numPyramids - 1));
        const apexX = kCX - 10 + 25 * Math.cos(pAngle);
        const apexY = kCY + 25 * Math.sin(pAngle);
        const base1X = kCX - 10 + 75 * Math.cos(pAngle - 0.18);
        const base1Y = kCY + 75 * Math.sin(pAngle - 0.18);
        const base2X = kCX - 10 + 75 * Math.cos(pAngle + 0.18);
        const base2Y = kCY + 75 * Math.sin(pAngle + 0.18);

        ctx.beginPath();
        ctx.moveTo(apexX, apexY);
        ctx.lineTo(base1X, base1Y);
        ctx.lineTo(base2X, base2Y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // 3. Renal Pelvis Basin & Calyces
      ctx.shadowBlur = 0;
      ctx.fillStyle = activeIdx === 2 ? '#38bdf8' : (isDark ? '#075985' : '#bae6fd');
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = activeIdx === 2 ? 3.5 : 2;
      if (activeIdx === 2) { ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 18; }

      ctx.beginPath();
      ctx.arc(kCX - 25, kCY, 32, -Math.PI * 0.5, Math.PI * 0.5);
      ctx.lineTo(kCX - 75, kCY + 50);
      ctx.lineTo(kCX - 75, kCY + 30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 4. Renal Artery (Red), Renal Vein (Blue) & Ureter (Purple)
      ctx.shadowBlur = 0;
      ctx.lineWidth = activeIdx === 3 ? 4 : 2;

      // Renal Artery
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(kCX - 95, kCY - 20, 50, 14);

      // Renal Vein
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(kCX - 95, kCY, 50, 14);

      // Ureter
      ctx.fillStyle = activeIdx === 3 ? '#a855f7' : '#9333ea';
      ctx.fillRect(kCX - 85, kCY + 20, 20, 90);

      // Fluid Nephron Filtration Stream Particles
      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
      for (let f = 0; f < 8; f++) {
        const streamProgress = (time * 1.5 + f * 0.6) % 1;
        const fx = (kCX + 50) - streamProgress * 120;
        const fy = kCY + Math.sin(streamProgress * Math.PI * 3) * 30;
        ctx.beginPath();
        ctx.arc(fx, fy, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Kidney Callout Card
      const cardX = width - 260;
      const cardY = 35;
      const cardW = 230;
      const cardH = 165;

      ctx.shadowBlur = 0;
      ctx.strokeStyle = activePart.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(kCX, kCY);
      ctx.lineTo(cardX - 15, cardY + cardH / 2);
      ctx.stroke();

      ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
      ctx.strokeStyle = activePart.color;
      ctx.lineWidth = 2;
      ctx.fillRect(cardX, cardY, cardW, cardH);
      ctx.strokeRect(cardX, cardY, cardW, cardH);

      ctx.fillStyle = activePart.color;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(activePart.name, cardX + 12, cardY + 25);

      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('PRIMARY RENAL FUNCTION:', cardX + 12, cardY + 45);

      ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
      ctx.font = '11px sans-serif';
      const words = activePart.desc.split(' ');
      let line = '';
      let lineY = cardY + 65;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        if (ctx.measureText(testLine).width > cardW - 24 && n > 0) {
          ctx.fillText(line, cardX + 12, lineY);
          line = words[n] + ' ';
          lineY += 16;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, cardX + 12, lineY);
      return;
    }

    if (isBrain) {
      // HIGH-DEFINITION 2D SAGITTAL HUMAN BRAIN MODEL
      const activeIdx = Math.abs(Math.round(getVar(['structureindex', 'highlightedstructureindex', 'index', 'selectedindex', 'structure', 'mode'], 0))) % 7;
      const pulse = Math.sin(time * 3.5) * 3;

      const brainParts = [
        { id: 0, name: '1. Frontal Lobe', color: '#ec4899', desc: 'Executive functions, decision making, motor control & reasoning' },
        { id: 1, name: '2. Parietal Lobe', color: '#38bdf8', desc: 'Sensory perception (touch, temp, pain) & spatial awareness' },
        { id: 2, name: '3. Occipital Lobe', color: '#f59e0b', desc: 'Visual processing center & color/motion recognition' },
        { id: 3, name: '4. Temporal Lobe', color: '#10b981', desc: 'Auditory processing, memory formation (hippocampus) & speech' },
        { id: 4, name: '5. Cerebellum', color: '#8b5cf6', desc: 'Balance, posture, muscle memory & fine motor coordination' },
        { id: 5, name: '6. Brainstem (Pons/Medulla)', color: '#ef4444', desc: 'Autonomic life support (heart rate, breathing, swallowing, blood pressure)' },
        { id: 6, name: '7. Corpus Callosum & Thalamus', color: '#a855f7', desc: 'Inter-hemispheric communication & main sensory signal relay' }
      ];

      const activePart = brainParts[activeIdx] || brainParts[0];
      const brainCX = centerX - 60;
      const brainCY = centerY - 15;

      // 1. FRONTAL LOBE
      ctx.fillStyle = activeIdx === 0 ? '#ec4899' : (isDark ? '#831843' : '#fbcfe8');
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = activeIdx === 0 ? 4 : 2;
      if (activeIdx === 0) { ctx.shadowColor = '#ec4899'; ctx.shadowBlur = 20; }
      ctx.beginPath();
      ctx.moveTo(brainCX - 120, brainCY + 15);
      ctx.bezierCurveTo(brainCX - 130, brainCY - 90, brainCX - 60, brainCY - 120, brainCX, brainCY - 120);
      ctx.bezierCurveTo(brainCX - 10, brainCY - 40, brainCX - 40, brainCY - 10, brainCX - 20, brainCY + 25);
      ctx.bezierCurveTo(brainCX - 70, brainCY + 30, brainCX - 100, brainCY + 25, brainCX - 120, brainCY + 15);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 2. PARIETAL LOBE
      ctx.shadowBlur = 0;
      ctx.fillStyle = activeIdx === 1 ? '#38bdf8' : (isDark ? '#075985' : '#bae6fd');
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = activeIdx === 1 ? 4 : 2;
      if (activeIdx === 1) { ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 20; }
      ctx.beginPath();
      ctx.moveTo(brainCX, brainCY - 120);
      ctx.bezierCurveTo(brainCX + 70, brainCY - 120, brainCX + 115, brainCY - 90, brainCX + 120, brainCY - 30);
      ctx.bezierCurveTo(brainCX + 60, brainCY - 20, brainCX + 20, brainCY - 30, brainCX - 20, brainCY + 25);
      ctx.bezierCurveTo(brainCX - 40, brainCY - 10, brainCX - 10, brainCY - 40, brainCX, brainCY - 120);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 3. OCCIPITAL LOBE
      ctx.shadowBlur = 0;
      ctx.fillStyle = activeIdx === 2 ? '#f59e0b' : (isDark ? '#78350f' : '#fde68a');
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = activeIdx === 2 ? 4 : 2;
      if (activeIdx === 2) { ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 20; }
      ctx.beginPath();
      ctx.moveTo(brainCX + 120, brainCY - 30);
      ctx.bezierCurveTo(brainCX + 145, brainCY, brainCX + 140, brainCY + 45, brainCX + 95, brainCY + 50);
      ctx.bezierCurveTo(brainCX + 70, brainCY + 20, brainCX + 85, brainCY - 10, brainCX + 120, brainCY - 30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 4. TEMPORAL LOBE
      ctx.shadowBlur = 0;
      ctx.fillStyle = activeIdx === 3 ? '#10b981' : (isDark ? '#064e3b' : '#a7f3d0');
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = activeIdx === 3 ? 4 : 2;
      if (activeIdx === 3) { ctx.shadowColor = '#10b981'; ctx.shadowBlur = 20; }
      ctx.beginPath();
      ctx.moveTo(brainCX - 100, brainCY + 25);
      ctx.bezierCurveTo(brainCX - 50, brainCY + 20, brainCX + 20, brainCY + 20, brainCX + 70, brainCY + 25);
      ctx.bezierCurveTo(brainCX + 60, brainCY + 60, brainCX - 20, brainCY + 65, brainCX - 70, brainCY + 50);
      ctx.bezierCurveTo(brainCX - 95, brainCY + 45, brainCX - 100, brainCY + 35, brainCX - 100, brainCY + 25);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 5. CEREBELLUM
      ctx.shadowBlur = 0;
      ctx.fillStyle = activeIdx === 4 ? '#8b5cf6' : (isDark ? '#4c1d95' : '#ddd6fe');
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = activeIdx === 4 ? 4 : 2;
      if (activeIdx === 4) { ctx.shadowColor = '#8b5cf6'; ctx.shadowBlur = 20; }
      ctx.beginPath();
      ctx.arc(brainCX + 75, brainCY + 80, 38 + (activeIdx === 4 ? pulse : 0), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = isDark ? '#a78bfa' : '#7c3aed';
      ctx.lineWidth = 1.5;
      for (let i = -20; i <= 20; i += 10) {
        ctx.beginPath();
        ctx.arc(brainCX + 75, brainCY + 80 + i, 30 - Math.abs(i) * 0.5, 0, Math.PI);
        ctx.stroke();
      }

      // 6. BRAINSTEM
      ctx.shadowBlur = 0;
      ctx.fillStyle = activeIdx === 5 ? '#ef4444' : (isDark ? '#7f1d1d' : '#fca5a5');
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = activeIdx === 5 ? 4 : 2;
      if (activeIdx === 5) { ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 20; }
      ctx.beginPath();
      ctx.fillRect(brainCX + 5, brainCY + 55, 34, 90);
      ctx.strokeRect(brainCX + 5, brainCY + 55, 34, 90);

      // 7. CORPUS CALLOSUM & THALAMUS
      ctx.shadowBlur = 0;
      ctx.fillStyle = activeIdx === 6 ? '#a855f7' : (isDark ? '#581c87' : '#f0abfc');
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = activeIdx === 6 ? 4 : 2;
      if (activeIdx === 6) { ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 20; }
      ctx.beginPath();
      ctx.arc(brainCX - 15, brainCY - 15, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // NEURAL SIGNAL IMPULSES
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      for (let s = 0; s < 6; s++) {
        const sigProgress = (time * 1.8 + s * 0.8) % 1;
        const sx = (brainCX - 100) + sigProgress * 210;
        const sy = (brainCY - 40) + Math.sin(sigProgress * Math.PI * 4) * 25;
        ctx.beginPath();
        ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // ANATOMICAL CALLOUT CARD
      const cardX = width - 260;
      const cardY = 30;
      const cardW = 230;
      const cardH = 175;

      ctx.shadowBlur = 0;
      ctx.strokeStyle = activePart.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(brainCX, brainCY);
      ctx.lineTo(cardX - 15, cardY + cardH / 2);
      ctx.stroke();

      ctx.fillStyle = activePart.color;
      ctx.beginPath();
      ctx.arc(cardX - 15, cardY + cardH / 2, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
      ctx.strokeStyle = activePart.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = activePart.color;
      ctx.shadowBlur = 12;
      ctx.fillRect(cardX, cardY, cardW, cardH);
      ctx.strokeRect(cardX, cardY, cardW, cardH);

      ctx.shadowBlur = 0;
      ctx.fillStyle = activePart.color;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(activePart.name, cardX + 12, cardY + 25);

      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('PRIMARY FUNCTION & SPECS:', cardX + 12, cardY + 45);

      ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
      ctx.font = '11px sans-serif';
      const words = activePart.desc.split(' ');
      let line = '';
      let lineY = cardY + 65;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        if (ctx.measureText(testLine).width > cardW - 24 && n > 0) {
          ctx.fillText(line, cardX + 12, lineY);
          line = words[n] + ' ';
          lineY += 16;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, cardX + 12, lineY);
      return;
    }

    if (isEye) {
      // HIGH-DEFINITION 2D HUMAN EYE MODEL WITH LIGHT RAY REFRACTION
      const activeIdx = Math.abs(Math.round(getVar(['structureindex', 'highlightedstructureindex', 'index', 'selectedindex', 'structure'], 0))) % 6;
      const eyeParts = [
        { id: 0, name: '1. Cornea', color: '#38bdf8', desc: 'Clear outer protective dome that refracts incoming light into the pupil' },
        { id: 1, name: '2. Iris & Pupil', color: '#ec4899', desc: 'Pigmented ring controlling pupil diameter and light entrance' },
        { id: 2, name: '3. Crystalline Lens', color: '#a855f7', desc: 'Flexible biconvex structure accommodating focal distance onto retina' },
        { id: 3, name: '4. Retina', color: '#f59e0b', desc: 'Photoreceptor layer (rods & cones) converting photons to nerve signals' },
        { id: 4, name: '5. Optic Nerve', color: '#ef4444', desc: 'Cranial nerve transmitting visual action potentials to occipital lobe' },
        { id: 5, name: '6. Sclera', color: '#cbd5e1', desc: 'Tough white fibrous outer wall maintaining eyeball structural shape' }
      ];

      const activePart = eyeParts[activeIdx] || eyeParts[0];
      const eyeCX = centerX - 40;
      const eyeCY = centerY;
      const eyeR = 100;

      // Eyeball Sclera Outer Boundary
      ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
      ctx.strokeStyle = activeIdx === 5 ? '#cbd5e1' : '#64748b';
      ctx.lineWidth = activeIdx === 5 ? 4 : 2;
      ctx.beginPath();
      ctx.arc(eyeCX, eyeCY, eyeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Retina Inner Wall Layer
      ctx.strokeStyle = activeIdx === 3 ? '#f59e0b' : '#b45309';
      ctx.lineWidth = activeIdx === 3 ? 5 : 3;
      ctx.beginPath();
      ctx.arc(eyeCX, eyeCY, eyeR - 6, -Math.PI * 0.7, Math.PI * 0.7);
      ctx.stroke();

      // Cornea Frontal Clear Dome
      ctx.strokeStyle = activeIdx === 0 ? '#38bdf8' : '#0284c7';
      ctx.lineWidth = activeIdx === 0 ? 5 : 3;
      ctx.beginPath();
      ctx.arc(eyeCX - eyeR + 25, eyeCY, 45, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();

      // Iris & Pupil Aperture
      ctx.fillStyle = activeIdx === 1 ? '#ec4899' : '#db2777';
      ctx.fillRect(eyeCX - eyeR + 32, eyeCY - 40, 10, 25);
      ctx.fillRect(eyeCX - eyeR + 32, eyeCY + 15, 10, 25);

      // Crystalline Lens Biconvex Body
      ctx.fillStyle = activeIdx === 2 ? '#a855f7' : (isDark ? '#581c87' : '#ddd6fe');
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = activeIdx === 2 ? 4 : 2;
      ctx.beginPath();
      ctx.ellipse(eyeCX - eyeR + 52, eyeCY, 12, 28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Optic Nerve Stalk
      ctx.fillStyle = activeIdx === 4 ? '#ef4444' : '#b91c1c';
      ctx.fillRect(eyeCX + eyeR - 5, eyeCY - 14, 45, 28);

      // Moving Refracted Light Rays
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      for (let r = -20; r <= 20; r += 10) {
        ctx.beginPath();
        ctx.moveTo(eyeCX - eyeR - 60, eyeCY + r);
        ctx.lineTo(eyeCX - eyeR + 52, eyeCY + r * 0.4);
        ctx.lineTo(eyeCX + eyeR - 10, eyeCY);
        ctx.stroke();
      }

      // Eye Callout Card
      const cardX = width - 260;
      const cardY = 40;
      ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
      ctx.strokeStyle = activePart.color;
      ctx.lineWidth = 2;
      ctx.fillRect(cardX, cardY, 230, 160);
      ctx.strokeRect(cardX, cardY, 230, 160);

      ctx.fillStyle = activePart.color;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(activePart.name, cardX + 12, cardY + 25);

      ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
      ctx.font = '11px sans-serif';
      ctx.fillText(activePart.desc, cardX + 12, cardY + 50, 200);
      return;
    }

    if (isHeart) {
      // HIGH-DEFINITION 2D 4-CHAMBER HUMAN HEART MODEL
      const activeIdx = Math.abs(Math.round(getVar(['structureindex', 'highlightedstructureindex', 'index', 'selectedindex', 'structure'], 0))) % 5;
      const heartParts = [
        { id: 0, name: '1. Left Ventricle', color: '#ef4444', desc: 'Thick muscular chamber pumping oxygenated blood to body systemic circulation' },
        { id: 1, name: '2. Right Ventricle', color: '#38bdf8', desc: 'Chamber pumping deoxygenated blood to the lungs for oxygen exchange' },
        { id: 2, name: '3. Aorta & Artery System', color: '#f59e0b', desc: 'Primary high-pressure artery distributing oxygen-rich blood' },
        { id: 3, name: '4. Atria (Left & Right)', color: '#ec4899', desc: 'Receiving chambers collecting returning blood from body & lungs' },
        { id: 4, name: '5. Cardiac Valves & Septum', color: '#a855f7', desc: 'Atrioventricular valves preventing backflow during ventricular contraction' }
      ];

      const activePart = heartParts[activeIdx] || heartParts[0];
      const hCX = centerX - 50;
      const hCY = centerY;

      // Outer Heart Muscle Wall (Myocardium)
      ctx.fillStyle = isDark ? '#450a0a' : '#fee2e2';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(hCX, hCY - 80);
      ctx.bezierCurveTo(hCX + 110, hCY - 140, hCX + 130, hCY + 20, hCX, hCY + 110);
      ctx.bezierCurveTo(hCX - 130, hCY + 20, hCX - 110, hCY - 140, hCX, hCY - 80);
      ctx.fill();
      ctx.stroke();

      // Left Ventricle
      ctx.fillStyle = activeIdx === 0 ? '#ef4444' : (isDark ? '#7f1d1d' : '#fca5a5');
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = activeIdx === 0 ? 4 : 2;
      ctx.fillRect(hCX + 10, hCY, 50, 65);

      // Right Ventricle
      ctx.fillStyle = activeIdx === 1 ? '#38bdf8' : (isDark ? '#075985' : '#bae6fd');
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = activeIdx === 1 ? 4 : 2;
      ctx.fillRect(hCX - 60, hCY, 50, 65);

      // Aorta Arc Tube
      ctx.strokeStyle = activeIdx === 2 ? '#f59e0b' : '#d97706';
      ctx.lineWidth = activeIdx === 2 ? 6 : 4;
      ctx.beginPath();
      ctx.arc(hCX, hCY - 85, 30, Math.PI, 0);
      ctx.stroke();

      // Blood Flow Impulses
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 10;
      for (let b = 0; b < 6; b++) {
        const bloodProgress = (time * 2 + b * 0.7) % 1;
        const bx = hCX + Math.sin(bloodProgress * Math.PI) * 45;
        const by = (hCY - 70) + bloodProgress * 150;
        ctx.beginPath();
        ctx.arc(bx, by, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Heart Callout Card
      const cardX = width - 260;
      const cardY = 40;
      ctx.shadowBlur = 0;
      ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
      ctx.strokeStyle = activePart.color;
      ctx.lineWidth = 2;
      ctx.fillRect(cardX, cardY, 230, 160);
      ctx.strokeRect(cardX, cardY, 230, 160);

      ctx.fillStyle = activePart.color;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(activePart.name, cardX + 12, cardY + 25);

      ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
      ctx.font = '11px sans-serif';
      ctx.fillText(activePart.desc, cardX + 12, cardY + 50, 200);
      return;
    }

    if (isCell) {
      // HIGH-DEFINITION 2D BIOLOGICAL CELL MODEL
      const activeIdx = Math.abs(Math.round(getVar(['structureindex', 'highlightedstructureindex', 'index', 'selectedindex', 'structure'], 0))) % 5;
      const cellParts = [
        { id: 0, name: '1. Cell Membrane', color: '#10b981', desc: 'Phospholipid bilayer controlling selective permeability & nutrient transport' },
        { id: 1, name: '2. Nucleus & DNA', color: '#a855f7', desc: 'Central organelle housing genetic chromatin material & nucleolus' },
        { id: 2, name: '3. Mitochondria', color: '#ef4444', desc: 'Powerhouse organelle generating cellular ATP energy via respiration' },
        { id: 3, name: '4. Cytoplasm & Fluid', color: '#38bdf8', desc: 'Cytosol gel suspended inside cell housing cellular metabolic reactions' },
        { id: 4, name: '5. Endoplasmic Reticulum', color: '#f59e0b', desc: 'Membranous organelle synthesizing proteins and lipids' }
      ];

      const activePart = cellParts[activeIdx] || cellParts[0];
      const cCX = centerX - 50;
      const cCY = centerY;

      // Cell Membrane Boundary
      ctx.fillStyle = activeIdx === 0 ? '#10b981' : (isDark ? '#064e3b' : '#d1fae5');
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = activeIdx === 0 ? 5 : 3;
      ctx.beginPath();
      ctx.ellipse(cCX, cCY, 130, 100, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Nucleus
      ctx.fillStyle = activeIdx === 1 ? '#a855f7' : (isDark ? '#581c87' : '#f0abfc');
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = activeIdx === 1 ? 4 : 2;
      ctx.beginPath();
      ctx.arc(cCX - 20, cCY - 10, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Mitochondria
      ctx.fillStyle = activeIdx === 2 ? '#ef4444' : '#b91c1c';
      ctx.beginPath();
      ctx.ellipse(cCX + 60, cCY - 30, 24, 14, Math.PI * 0.25, 0, Math.PI * 2);
      ctx.fill();

      // Cell Callout Card
      const cardX = width - 260;
      const cardY = 40;
      ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
      ctx.strokeStyle = activePart.color;
      ctx.lineWidth = 2;
      ctx.fillRect(cardX, cardY, 230, 160);
      ctx.strokeRect(cardX, cardY, 230, 160);

      ctx.fillStyle = activePart.color;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(activePart.name, cardX + 12, cardY + 25);

      ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
      ctx.font = '11px sans-serif';
      ctx.fillText(activePart.desc, cardX + 12, cardY + 50, 200);
      return;
    }

    // Defensive fallback: if canvasPrimitives is missing or empty, render a dynamic telemetry particle
    const primitivesToRender: CanvasPrimitive[] = (spec.canvasPrimitives && spec.canvasPrimitives.length > 0)
      ? spec.canvasPrimitives
      : [
          {
            id: 'fallback_telemetry_p1',
            type: 'particle',
            label: `${spec.title || 'Simulation State'} (${spec.chart.yLabel || 'Output'})`,
            color: '#38bdf8',
            xExpr: 'sin(t * 2.5) * 80',
            yExpr: 'cos(t * 2.5) * 40'
          }
        ];

    // Calculate Bounding Box of Primitives for Smart Auto-Scaling & Centering
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    primitivesToRender.forEach(p => {
      const px = p.x ?? centerX;
      const py = p.y ?? centerY;
      const r = p.radius ?? (p.width ? p.width / 2 : 45);
      minX = Math.min(minX, px - r);
      maxX = Math.max(maxX, px + r);
      minY = Math.min(minY, py - r);
      maxY = Math.max(maxY, py + r);
    });

    const pW = maxX > minX ? maxX - minX : 100;
    const pH = maxY > minY ? maxY - minY : 100;
    const pCX = isFinite(minX + maxX) ? (minX + maxX) / 2 : centerX;
    const pCY = isFinite(minY + maxY) ? (minY + maxY) / 2 : centerY;

    let scaleFactor = 1.0;
    if (pW > 10 && pH > 10) {
      const targetW = width * 0.65;
      const targetH = height * 0.65;
      scaleFactor = Math.min(3.2, Math.max(1.3, Math.min(targetW / pW, targetH / pH)));
    }

    // Helper for Anatomical Brain Lobe Positioning & Medical Metadata
    const getBrainLobeAnchor = (label: string) => {
      const l = label.toLowerCase();
      if (l.includes('frontal')) return { name: 'Frontal Lobe', x: centerX - 85, y: centerY - 40, w: 110, h: 100, color: '#ec4899', desc: 'Executive functions, decision making, motor control & reasoning' };
      if (l.includes('parietal')) return { name: 'Parietal Lobe', x: centerX + 20, y: centerY - 65, w: 105, h: 90, color: '#38bdf8', desc: 'Sensory perception (touch, temp, pain) & spatial awareness' };
      if (l.includes('occipital')) return { name: 'Occipital Lobe', x: centerX + 95, y: centerY - 15, w: 85, h: 80, color: '#f59e0b', desc: 'Visual processing center & color/motion recognition' };
      if (l.includes('temporal')) return { name: 'Temporal Lobe', x: centerX - 25, y: centerY + 25, w: 115, h: 70, color: '#10b981', desc: 'Auditory processing, memory formation (hippocampus) & speech' };
      if (l.includes('cerebellum')) return { name: 'Cerebellum', x: centerX + 75, y: centerY + 75, w: 75, h: 75, color: '#8b5cf6', desc: 'Balance, posture, muscle memory & fine motor coordination' };
      if (l.includes('stem') || l.includes('medulla') || l.includes('pons')) return { name: 'Brainstem', x: centerX + 15, y: centerY + 95, w: 40, h: 90, color: '#ef4444', desc: 'Autonomic life support (heart rate, breathing, blood pressure)' };
      if (l.includes('cerebrum') || l.includes('cortex')) return { name: 'Cerebrum', x: centerX - 30, y: centerY - 30, w: 220, h: 150, color: '#a855f7', desc: 'Higher cognitive thinking, sensory processing & voluntary action' };
      return null;
    };

    const hasBrainPrimitives = primitivesToRender.some(p => (p.label || '').toLowerCase().includes('lobe') || (p.label || '').toLowerCase().includes('cerebell') || (p.label || '').toLowerCase().includes('brain') || (p.label || '').toLowerCase().includes('stem'));

    // --- ANATOMICAL BRAIN BACKGROUND SILHOUETTE & NEURAL SIGNAL STREAM ---
    if (hasBrainPrimitives) {
      // 1. Draw Outer Cranial Anatomical Silhouette Line
      ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(centerX - 145, centerY + 15);
      ctx.bezierCurveTo(centerX - 155, centerY - 110, centerX - 70, centerY - 140, centerX, centerY - 140);
      ctx.bezierCurveTo(centerX + 80, centerY - 140, centerX + 145, centerY - 100, centerX + 150, centerY - 30);
      ctx.bezierCurveTo(centerX + 175, centerY + 20, centerX + 165, centerY + 75, centerX + 115, centerY + 85);
      ctx.bezierCurveTo(centerX + 70, centerY + 160, centerX - 10, centerY + 165, centerX - 70, centerY + 65);
      ctx.bezierCurveTo(centerX - 120, centerY + 60, centerX - 140, centerY + 35, centerX - 145, centerY + 15);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 2. Action Potential Neural Signal Stream across the brain
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      for (let s = 0; s < 7; s++) {
        const sigProgress = (time * 1.6 + s * 0.7) % 1;
        const sx = (centerX - 120) + sigProgress * 230;
        const sy = (centerY - 50) + Math.sin(sigProgress * Math.PI * 4) * 30;
        ctx.beginPath();
        ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    // Render Canvas Primitives
    for (let idx = 0; idx < primitivesToRender.length; idx++) {
      const prim = primitivesToRender[idx];
      ctx.save();
      const color = prim.color || '#38bdf8';
      const isHighlighted = prim.highlightExpr ? evaluateEquation(prim.highlightExpr, evalState) > 0 : false;
      const brainAnchor = getBrainLobeAnchor(prim.label || '');

      // --- ANATOMICAL BRAIN LOBE ASSEMBLY & VECTOR SYNTHESIS BRANCH ---
      if (brainAnchor) {
        const drawX = brainAnchor.x;
        const drawY = brainAnchor.y;
        const mainColor = brainAnchor.color || color;

        ctx.fillStyle = isHighlighted ? mainColor : (isDark ? mainColor + '33' : mainColor + '22');
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = isHighlighted ? 4 : 2;
        if (isHighlighted) { ctx.shadowColor = mainColor; ctx.shadowBlur = 22; }

        ctx.beginPath();
        if (brainAnchor.name === 'Frontal Lobe') {
          ctx.moveTo(drawX - 50, drawY + 25);
          ctx.bezierCurveTo(drawX - 60, drawY - 60, drawX - 10, drawY - 90, drawX + 50, drawY - 90);
          ctx.bezierCurveTo(drawX + 40, drawY - 10, drawX, drawY + 20, drawX - 50, drawY + 25);
        } else if (brainAnchor.name === 'Parietal Lobe') {
          ctx.moveTo(drawX - 45, drawY - 70);
          ctx.bezierCurveTo(drawX + 30, drawY - 70, drawX + 75, drawY - 45, drawX + 80, drawY + 15);
          ctx.bezierCurveTo(drawX + 20, drawY + 10, drawX - 20, drawY - 15, drawX - 45, drawY - 70);
        } else if (brainAnchor.name === 'Occipital Lobe') {
          ctx.moveTo(drawX + 25, drawY - 45);
          ctx.bezierCurveTo(drawX + 65, drawY - 15, drawX + 60, drawY + 35, drawX + 15, drawY + 40);
          ctx.bezierCurveTo(drawX - 10, drawY + 10, drawX, drawY - 20, drawX + 25, drawY - 45);
        } else if (brainAnchor.name === 'Temporal Lobe') {
          ctx.moveTo(drawX - 65, drawY - 20);
          ctx.bezierCurveTo(drawX + 20, drawY - 25, drawX + 70, drawY - 10, drawX + 75, drawY + 25);
          ctx.bezierCurveTo(drawX + 10, drawY + 45, drawX - 55, drawY + 35, drawX - 65, drawY - 20);
        } else if (brainAnchor.name === 'Cerebellum') {
          ctx.arc(drawX, drawY, 36, 0, Math.PI * 2);
        } else if (brainAnchor.name === 'Brainstem') {
          ctx.rect(drawX - 18, drawY - 35, 36, 85);
        } else {
          ctx.ellipse(drawX, drawY, brainAnchor.w / 2, brainAnchor.h / 2, 0, 0, Math.PI * 2);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Cerebral Sulci / Gyri Convolutions Texture Line
        ctx.strokeStyle = isHighlighted ? '#ffffff' : (isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.25)');
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(drawX - 10, drawY - 10, 18, 0, Math.PI);
        ctx.stroke();

        // Label Tag
        ctx.shadowBlur = 0;
        ctx.fillStyle = isHighlighted ? '#ffffff' : (isDark ? '#f8fafc' : '#0f172a');
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(prim.label || brainAnchor.name, drawX - 35, drawY + 4);

        // Highlight Callout Card pointer line
        if (isHighlighted) {
          const cardX = width - 240;
          const cardY = 40;
          ctx.strokeStyle = mainColor;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(drawX, drawY);
          ctx.lineTo(cardX - 10, cardY + 50);
          ctx.stroke();

          ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
          ctx.strokeStyle = mainColor;
          ctx.lineWidth = 2;
          ctx.shadowColor = mainColor;
          ctx.shadowBlur = 14;
          ctx.fillRect(cardX, cardY, 215, 125);
          ctx.strokeRect(cardX, cardY, 215, 125);

          ctx.shadowBlur = 0;
          ctx.fillStyle = mainColor;
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText(brainAnchor.name, cardX + 12, cardY + 24);

          ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
          ctx.font = '11px sans-serif';
          ctx.fillText(brainAnchor.desc, cardX + 12, cardY + 48, 190);
        }
      }
      // --- AI-GENERATED CUSTOM 2D VISUAL SHAPE / SVG PATH ENGINE ---
      else if (prim.pathData || prim.shape === 'path') {
        ctx.fillStyle = isHighlighted ? '#ec4899' : (prim.fill || prim.color || '#38bdf8');
        ctx.strokeStyle = prim.stroke || prim.color || '#38bdf8';
        ctx.lineWidth = isHighlighted ? 4 / scaleFactor : 2 / scaleFactor;
        if (isHighlighted) { ctx.shadowColor = '#ec4899'; ctx.shadowBlur = 22; }

        if (prim.pathData) {
          try {
            const p2d = new Path2D(prim.pathData);
            ctx.fill(p2d);
            ctx.stroke(p2d);

            // Add Cerebral Sulci & Gyri Anatomical Convolutions if it's a brain structure
            const isBrainLobe = (prim.label || '').toLowerCase().includes('lobe') || (prim.label || '').toLowerCase().includes('brain');
            if (isBrainLobe) {
              ctx.strokeStyle = isHighlighted ? '#ffffff' : (isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.25)');
              ctx.lineWidth = 1.2 / scaleFactor;
              ctx.stroke(p2d);
            }
          } catch {
            ctx.beginPath();
            ctx.arc(prim.x || centerX, prim.y || centerY, 35, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
        }

        if (prim.label) {
          const lx = prim.x || centerX;
          const ly = prim.y || centerY;

          // Draw Anatomical Leader Line & High-Contrast Label Tag
          ctx.shadowBlur = 0;
          ctx.fillStyle = isHighlighted ? '#ffffff' : (isDark ? '#f8fafc' : '#0f172a');
          ctx.font = `bold ${Math.max(10, Math.round(13 / Math.sqrt(scaleFactor)))}px sans-serif`;
          ctx.fillText(prim.label, lx - 25, ly);

          // Pulse glowing node dot on active selected structure
          if (isHighlighted) {
            const pulseR = (6 + Math.sin(time * 4) * 2) / scaleFactor;
            ctx.fillStyle = '#ec4899';
            ctx.shadowColor = '#ec4899';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(lx, ly, pulseR, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      else if (prim.shape === 'rect') {
        const rx = prim.x ?? (centerX - 40);
        const ry = prim.y ?? (centerY - 30);
        const rw = prim.width ?? 80;
        const rh = prim.height ?? 60;

        ctx.fillStyle = isHighlighted ? '#ec4899' : (prim.fill || prim.color || '#38bdf8');
        ctx.strokeStyle = prim.stroke || prim.color || '#38bdf8';
        ctx.lineWidth = isHighlighted ? 4 : 2;
        if (isHighlighted) { ctx.shadowColor = '#ec4899'; ctx.shadowBlur = 18; }

        ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeRect(rx, ry, rw, rh);

        if (prim.label) {
          ctx.shadowBlur = 0;
          ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(prim.label, rx + 6, ry + rh / 2 + 4);
        }
      }
      else if (prim.shape === 'text') {
        const tx = prim.x ?? centerX;
        const ty = prim.y ?? centerY;

        ctx.fillStyle = isHighlighted ? '#ec4899' : (prim.color || (isDark ? '#e2e8f0' : '#1e293b'));
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(prim.label || '', tx, ty);
      }
      else if (prim.type === 'projectile') {
        const v0 = getVar(['v0', 'v', 'velocity', 'speed'], 45);
        const angleDeg = getVar(['angle', 'theta', 'launchangle'], 45);
        const gVal = getVar(['g', 'gravity'], 9.8);

        const launchRad = (angleDeg * Math.PI) / 180;
        const flightTime = (2 * v0 * Math.sin(launchRad)) / gVal;
        const tLoop = time % Math.max(1, flightTime);

        const rawX = evaluateEquation(prim.xExpr || '0', evalState);
        const rawY = evaluateEquation(prim.yExpr || '0', evalState);

        const calcX = v0 * Math.cos(launchRad) * tLoop * 3.5;
        const calcY = Math.max(0, v0 * Math.sin(launchRad) * tLoop - 0.5 * gVal * tLoop * tLoop) * 3.5;

        const drawX = 60 + ((prim.xExpr && prim.xExpr.includes('t') ? rawX * 4 : calcX) % (width - 120));
        const drawY = height - 60 - (prim.yExpr && prim.yExpr.includes('t') ? rawY * 4 : calcY);
        const radius = evaluateEquation(prim.radiusExpr || '12', evalState);

        // Ground line
        ctx.strokeStyle = isDark ? '#475569' : '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(30, height - 50);
        ctx.lineTo(width - 30, height - 50);
        ctx.stroke();

        // Projectile ball
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
        ctx.fill();

        if (prim.label) {
          ctx.shadowBlur = 0;
          ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(prim.label, drawX - 25, drawY - radius - 8);
        }
      }
      else if (prim.type === 'spring') {
        const k = getVar(['k', 'springconstant', 'stiffness'], 50);
        const m = getVar(['m', 'mass', 'blockmass'], 2);
        const amp = getVar(['a', 'amplitude'], 0.8) * 45;

        const omega = Math.sqrt(k / m);
        const rawLen = evaluateEquation(prim.lengthExpr || '150', evalState);
        const hasTimeLen = prim.lengthExpr ? prim.lengthExpr.includes('t') : false;

        const len = hasTimeLen && Math.abs(rawLen) > 10 ? rawLen : 150 + amp * Math.cos(omega * time);
        const startX = 60;
        const drawY = centerY;

        // Anchor wall
        ctx.fillStyle = isDark ? '#475569' : '#94a3b8';
        ctx.fillRect(40, drawY - 40, 20, 80);

        // Spring Zigzag
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(startX, drawY);
        const coils = 12;
        const coilWidth = Math.max(20, len) / coils;
        for (let i = 0; i <= coils; i++) {
          const currX = startX + i * coilWidth;
          const currY = drawY + (i % 2 === 0 ? -15 : 15);
          ctx.lineTo(currX, currY);
        }
        ctx.stroke();

        // Attached Mass Block (scaling with mass m)
        const blockW = Math.min(80, Math.max(35, 30 + m * 3));
        const blockX = startX + len;
        ctx.fillStyle = '#ec4899';
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 12;
        ctx.fillRect(blockX, drawY - 25, blockW, 50);

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`m=${m}kg`, blockX + 6, drawY + 4);
      }
      else if (prim.type === 'neuron' || prim.type === 'brain_signal' || prim.type === 'brain') {
        // Anatomical Human Brain Explorer & Neural Signal Visualizer
        const activeIdx = Math.abs(Math.round(getVar(['highlightedstructureindex', 'index', 'structure', 'mode', 'viewmode', 'selectedindex'], 0))) % 7;
        const pulse = Math.sin(time * 3.5) * 3;

        const brainParts = [
          { id: 0, name: '1. Frontal Lobe', color: '#ec4899', desc: 'Executive functions, decision making, reasoning, motor control & speech' },
          { id: 1, name: '2. Parietal Lobe', color: '#38bdf8', desc: 'Sensory perception (touch, temp, pain) & spatial awareness' },
          { id: 2, name: '3. Occipital Lobe', color: '#f59e0b', desc: 'Visual processing center & color/motion recognition' },
          { id: 3, name: '4. Temporal Lobe', color: '#10b981', desc: 'Auditory processing, memory formation (hippocampus) & language' },
          { id: 4, name: '5. Cerebellum', color: '#8b5cf6', desc: 'Balance, posture, muscle memory & fine motor coordination' },
          { id: 5, name: '6. Brainstem (Pons/Medulla)', color: '#ef4444', desc: 'Autonomic life support (heart rate, breathing, swallowing, blood pressure)' },
          { id: 6, name: '7. Corpus Callosum & Thalamus', color: '#a855f7', desc: 'Inter-hemispheric communication & main sensory signal relay' }
        ];

        const activePart = brainParts[activeIdx] || brainParts[0];
        const brainCX = centerX - 60;
        const brainCY = centerY - 15;

        // --- 1. FRONTAL LOBE (Anatomical Anterior Superior) ---
        ctx.fillStyle = activeIdx === 0 ? '#ec4899' : (isDark ? '#831843' : '#fbcfe8');
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = activeIdx === 0 ? 4 : 2;
        if (activeIdx === 0) { ctx.shadowColor = '#ec4899'; ctx.shadowBlur = 20; }
        ctx.beginPath();
        ctx.moveTo(brainCX - 120, brainCY + 15);
        ctx.bezierCurveTo(brainCX - 130, brainCY - 90, brainCX - 60, brainCY - 120, brainCX, brainCY - 120);
        ctx.bezierCurveTo(brainCX - 10, brainCY - 40, brainCX - 40, brainCY - 10, brainCX - 20, brainCY + 25);
        ctx.bezierCurveTo(brainCX - 70, brainCY + 30, brainCX - 100, brainCY + 25, brainCX - 120, brainCY + 15);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // --- 2. PARIETAL LOBE (Anatomical Superior Posterior) ---
        ctx.shadowBlur = 0;
        ctx.fillStyle = activeIdx === 1 ? '#38bdf8' : (isDark ? '#075985' : '#bae6fd');
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = activeIdx === 1 ? 4 : 2;
        if (activeIdx === 1) { ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 20; }
        ctx.beginPath();
        ctx.moveTo(brainCX, brainCY - 120);
        ctx.bezierCurveTo(brainCX + 70, brainCY - 120, brainCX + 115, brainCY - 90, brainCX + 120, brainCY - 30);
        ctx.bezierCurveTo(brainCX + 60, brainCY - 20, brainCX + 20, brainCY - 30, brainCX - 20, brainCY + 25);
        ctx.bezierCurveTo(brainCX - 40, brainCY - 10, brainCX - 10, brainCY - 40, brainCX, brainCY - 120);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // --- 3. OCCIPITAL LOBE (Anatomical Inferior Posterior) ---
        ctx.shadowBlur = 0;
        ctx.fillStyle = activeIdx === 2 ? '#f59e0b' : (isDark ? '#78350f' : '#fde68a');
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = activeIdx === 2 ? 4 : 2;
        if (activeIdx === 2) { ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 20; }
        ctx.beginPath();
        ctx.moveTo(brainCX + 120, brainCY - 30);
        ctx.bezierCurveTo(brainCX + 145, brainCY, brainCX + 140, brainCY + 45, brainCX + 95, brainCY + 50);
        ctx.bezierCurveTo(brainCX + 70, brainCY + 20, brainCX + 85, brainCY - 10, brainCX + 120, brainCY - 30);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // --- 4. TEMPORAL LOBE (Anatomical Inferior Lateral) ---
        ctx.shadowBlur = 0;
        ctx.fillStyle = activeIdx === 3 ? '#10b981' : (isDark ? '#064e3b' : '#a7f3d0');
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = activeIdx === 3 ? 4 : 2;
        if (activeIdx === 3) { ctx.shadowColor = '#10b981'; ctx.shadowBlur = 20; }
        ctx.beginPath();
        ctx.moveTo(brainCX - 100, brainCY + 25);
        ctx.bezierCurveTo(brainCX - 50, brainCY + 20, brainCX + 20, brainCY + 20, brainCX + 70, brainCY + 25);
        ctx.bezierCurveTo(brainCX + 60, brainCY + 60, brainCX - 20, brainCY + 65, brainCX - 70, brainCY + 50);
        ctx.bezierCurveTo(brainCX - 95, brainCY + 45, brainCX - 100, brainCY + 35, brainCX - 100, brainCY + 25);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // --- 5. CEREBELLUM (Anatomical Posteroinferior) ---
        ctx.shadowBlur = 0;
        ctx.fillStyle = activeIdx === 4 ? '#8b5cf6' : (isDark ? '#4c1d95' : '#ddd6fe');
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = activeIdx === 4 ? 4 : 2;
        if (activeIdx === 4) { ctx.shadowColor = '#8b5cf6'; ctx.shadowBlur = 20; }
        ctx.beginPath();
        ctx.arc(brainCX + 75, brainCY + 80, 38 + (activeIdx === 4 ? pulse : 0), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Cerebellar Folia Stripes
        ctx.strokeStyle = isDark ? '#a78bfa' : '#7c3aed';
        ctx.lineWidth = 1.5;
        for (let i = -20; i <= 20; i += 10) {
          ctx.beginPath();
          ctx.arc(brainCX + 75, brainCY + 80 + i, 30 - Math.abs(i) * 0.5, 0, Math.PI);
          ctx.stroke();
        }

        // --- 6. BRAINSTEM (Pons & Medulla Oblongata) ---
        ctx.shadowBlur = 0;
        ctx.fillStyle = activeIdx === 5 ? '#ef4444' : (isDark ? '#7f1d1d' : '#fca5a5');
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = activeIdx === 5 ? 4 : 2;
        if (activeIdx === 5) { ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 20; }
        ctx.beginPath();
        ctx.fillRect(brainCX + 5, brainCY + 55, 34, 90);
        ctx.strokeRect(brainCX + 5, brainCY + 55, 34, 90);

        // --- 7. CORPUS CALLOSUM & THALAMUS (Central Deep Core) ---
        ctx.shadowBlur = 0;
        ctx.fillStyle = activeIdx === 6 ? '#a855f7' : (isDark ? '#581c87' : '#f0abfc');
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = activeIdx === 6 ? 4 : 2;
        if (activeIdx === 6) { ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 20; }
        ctx.beginPath();
        ctx.arc(brainCX - 15, brainCY - 15, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // --- MOVING ACTION POTENTIAL NEURAL SIGNAL PULSES ---
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        const numSignals = 6;
        for (let s = 0; s < numSignals; s++) {
          const sigProgress = (time * 1.8 + s * 0.8) % 1;
          const sx = (brainCX - 100) + sigProgress * 210;
          const sy = (brainCY - 40) + Math.sin(sigProgress * Math.PI * 4) * 25;
          ctx.beginPath();
          ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // --- ELEGANT ANATOMICAL STRUCTURE CALLOUT CARD ---
        const cardX = width - 260;
        const cardY = 30;
        const cardW = 230;
        const cardH = 175;

        // Leader Line from Active Structure to Callout Card
        ctx.shadowBlur = 0;
        ctx.strokeStyle = activePart.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(brainCX, brainCY);
        ctx.lineTo(cardX - 15, cardY + cardH / 2);
        ctx.stroke();

        ctx.fillStyle = activePart.color;
        ctx.beginPath();
        ctx.arc(cardX - 15, cardY + cardH / 2, 5, 0, Math.PI * 2);
        ctx.fill();

        // Callout Box Background
        ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
        ctx.strokeStyle = activePart.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = activePart.color;
        ctx.shadowBlur = 12;
        ctx.fillRect(cardX, cardY, cardW, cardH);
        ctx.strokeRect(cardX, cardY, cardW, cardH);

        // Header Title
        ctx.shadowBlur = 0;
        ctx.fillStyle = activePart.color;
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(activePart.name, cardX + 12, cardY + 25);

        // Function Label
        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('PRIMARY FUNCTION & SPECS:', cardX + 12, cardY + 45);

        // Function Description Body (Word Wrapped)
        ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
        ctx.font = '11px sans-serif';
        const words = activePart.desc.split(' ');
        let line = '';
        let lineY = cardY + 65;
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          if (ctx.measureText(testLine).width > cardW - 24 && n > 0) {
            ctx.fillText(line, cardX + 12, lineY);
            line = words[n] + ' ';
            lineY += 16;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, cardX + 12, lineY);

        // Footer Instruction Tag
        ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
        ctx.font = 'italic 10px sans-serif';
        ctx.fillText('💡 Use "Structure Index" slider to explore all 7 parts', cardX + 12, cardY + cardH - 12);
      }
      else if (prim.type === 'kidney' || prim.type === 'filtration' || prim.type === 'organ') {
        const filtrationRate = getVar(['filtrationrate', 'rate', 'flow', 'pressure'], 120);
        const organX = centerX;
        const organY = centerY;

        // Draw Kidney Outline Outer Boundary
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.fillStyle = isDark ? '#450a0a' : '#fee2e2';
        ctx.beginPath();
        ctx.ellipse(organX, organY, 130, 90, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Bowman's Capsule Filtration Membrane Center
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.fillStyle = isDark ? '#0f172a' : '#f0f9ff';
        ctx.beginPath();
        ctx.arc(organX - 20, organY, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Fluid Stream Particles (Filtration Process)
        const numParticles = 20;
        ctx.shadowBlur = 6;

        for (let p = 0; p < numParticles; p++) {
          const pTime = time * (filtrationRate / 40) + p * 0.5;
          const px = (organX - 100) + (pTime * 35) % 160;
          const py = organY + Math.sin(pTime * 2 + p) * 20;

          const isFiltered = px > organX - 20;
          ctx.fillStyle = isFiltered ? '#10b981' : '#ef4444';
          ctx.shadowColor = ctx.fillStyle;

          ctx.beginPath();
          ctx.arc(px, py, isFiltered ? 4 : 6, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.shadowBlur = 0;
        ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`Nephron Filtration Stream (${filtrationRate} mL/min)`, organX - 85, organY - 105);
      }
      else if (prim.type === 'beaker' || prim.type === 'titration') {
        const pH = getVar(['ph', 'concentration', 'conc', 'volume'], 7.0);
        const temp = getVar(['temp', 'temperature'], 25);

        const beakerW = 140;
        const beakerH = 170;
        const bx = centerX - beakerW / 2;
        const by = centerY - beakerH / 2 + 10;

        // Dynamic Liquid Color based on pH (acidic = red, neutral = green, basic = purple)
        let liquidColor = '#10b981'; // neutral
        if (pH < 6) liquidColor = '#ef4444'; // acid
        else if (pH > 8) liquidColor = '#8b5cf6'; // base

        // Beaker Glass Body
        ctx.strokeStyle = isDark ? '#cbd5e1' : '#64748b';
        ctx.lineWidth = 4;
        ctx.strokeRect(bx, by, beakerW, beakerH);

        // Liquid fill inside beaker
        const liquidH = Math.min(beakerH - 10, Math.max(40, (pH / 14) * beakerH));
        ctx.fillStyle = liquidColor;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(bx + 3, by + beakerH - liquidH, beakerW - 6, liquidH - 3);
        ctx.globalAlpha = 1.0;

        // Rising Reaction Bubbles
        const numBubbles = 8;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 6;

        for (let b = 0; b < numBubbles; b++) {
          const bubbleTime = (time * (temp / 15) + b * 0.8) % 4;
          const bubbleX = bx + 20 + (b * 16) % (beakerW - 40);
          const bubbleY = (by + beakerH - 10) - (bubbleTime / 4) * liquidH;

          if (bubbleY > by + beakerH - liquidH) {
            ctx.beginPath();
            ctx.arc(bubbleX, bubbleY, 3 + (b % 3), 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.shadowBlur = 0;
        ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`Chemical Reaction Beaker (pH=${pH.toFixed(1)}, Temp=${temp}°C)`, bx - 20, by - 15);
      }
      else if (prim.type === 'english_grammar' || prim.type === 'sentence_flow' || prim.type === 'vocabulary') {
        const speed = getVar(['speed', 'flow', 'rate', 'tensespeed'], 1.5);
        const complexity = getVar(['complexity', 'length', 'level'], 3);

        const nodes = [
          { label: 'Subject (Noun)', color: '#38bdf8', x: centerX - 180, y: centerY },
          { label: 'Verb / Action', color: '#ec4899', x: centerX, y: centerY },
          { label: 'Object / Clause', color: '#10b981', x: centerX + 180, y: centerY }
        ];

        // Draw Connecting Syntax Flow Arrows
        ctx.strokeStyle = isDark ? '#475569' : '#cbd5e1';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(nodes[0].x, nodes[0].y);
        ctx.lineTo(nodes[1].x, nodes[1].y);
        ctx.lineTo(nodes[2].x, nodes[2].y);
        ctx.stroke();

        // Moving Grammar Word Tokens along Syntax Flow
        const totalW = 360;
        const numTokens = Math.min(8, Math.max(3, Math.round(complexity)));
        ctx.shadowBlur = 10;

        for (let tokenIdx = 0; tokenIdx < numTokens; tokenIdx++) {
          const progress = ((time * speed * 40 + tokenIdx * (totalW / numTokens)) % totalW);
          const tokenX = centerX - 180 + progress;
          const tokenY = centerY + Math.sin(time * 3 + tokenIdx) * 12;

          ctx.fillStyle = tokenIdx % 2 === 0 ? '#38bdf8' : '#f59e0b';
          ctx.shadowColor = ctx.fillStyle;
          ctx.beginPath();
          ctx.arc(tokenX, tokenY, 8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw Syntax Node Cards
        nodes.forEach(node => {
          ctx.fillStyle = node.color;
          ctx.shadowColor = node.color;
          ctx.shadowBlur = 14;
          ctx.fillRect(node.x - 55, node.y - 25, 110, 50);

          ctx.shadowBlur = 0;
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText(node.label, node.x - 48, node.y + 4);
        });

        ctx.shadowBlur = 0;
        ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`English Grammar & Syntax Flow (Flow Speed=${speed}x)`, centerX - 120, centerY - 55);
      }
      else if (prim.type === 'wave') {
        const amplitude = evaluateEquation('A', evalState, 30);
        const freq = evaluateEquation('f', evalState, 1);
        const lambda = evaluateEquation('lambda', evalState, 100);

        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x < width; x += 3) {
          const y = centerY + amplitude * Math.sin((2 * Math.PI * x) / lambda - 2 * Math.PI * freq * time);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      else if (prim.type === 'circuit') {
        const currentVal = evaluateEquation('I', evalState, 1.2);
        const rectW = 340;
        const rectH = 180;
        const startX = centerX - rectW / 2;
        const startY = centerY - rectH / 2;

        // Circuit Loop Wire
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.strokeRect(startX, startY, rectW, rectH);

        // Moving Electron Dots
        const loopPerimeter = 2 * (rectW + rectH);
        const numElectrons = 16;
        const speed = currentVal * 80;

        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        for (let i = 0; i < numElectrons; i++) {
          const pos = (i * (loopPerimeter / numElectrons) + time * speed) % loopPerimeter;
          let ex = startX;
          let ey = startY;

          if (pos < rectW) {
            ex = startX + pos;
            ey = startY;
          } else if (pos < rectW + rectH) {
            ex = startX + rectW;
            ey = startY + (pos - rectW);
          } else if (pos < 2 * rectW + rectH) {
            ex = startX + rectW - (pos - (rectW + rectH));
            ey = startY + rectH;
          } else {
            ex = startX;
            ey = startY + rectH - (pos - (2 * rectW + rectH));
          }

          ctx.beginPath();
          ctx.arc(ex, ey, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      else if (prim.type === 'action_reaction') {
        const forceVal = evaluateEquation('F', evalState, 50);
        const m1 = evaluateEquation('m1', evalState, 5);
        const m2 = evaluateEquation('m2', evalState, 10);

        const a1 = forceVal / m1;
        const a2 = forceVal / m2;

        // Loop animation cycle every 4.5 seconds
        const cycleTime = time % 4.5;
        let offset1 = 0;
        let offset2 = 0;
        let isContact = false;

        if (cycleTime < 1.0) {
          // Approach phase: blocks slide toward collision center
          const approachProgress = 1 - cycleTime / 1.0;
          offset1 = approachProgress * 110;
          offset2 = approachProgress * 110;
        } else {
          // Separation / Push phase: accelerated apart by action-reaction force
          isContact = cycleTime < 1.3;
          const tPush = cycleTime - 1.0;
          offset1 = 0.5 * a1 * tPush * tPush * 8;
          offset2 = 0.5 * a2 * tPush * tPush * 8;
        }

        const trackY = centerY + 40;
        const blockW = 65;
        const blockH = 48;

        // Ground track
        ctx.strokeStyle = isDark ? '#475569' : '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(30, trackY + blockH / 2);
        ctx.lineTo(width - 30, trackY + blockH / 2);
        ctx.stroke();

        // Mass 1 Position (Pushed left)
        const b1X = Math.max(40, centerX - blockW - 3 - offset1);
        const b1Y = trackY - blockH / 2;

        // Mass 2 Position (Pushed right)
        const b2X = Math.min(width - 40 - blockW, centerX + 3 + offset2);
        const b2Y = trackY - blockH / 2;

        // Impact flash glow on collision contact
        if (isContact) {
          ctx.shadowColor = '#eab308';
          ctx.shadowBlur = 30;
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(centerX, trackY, 25, 0, Math.PI * 2);
          ctx.fill();
        }

        // Mass 1 (Left Block)
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.fillRect(b1X, b1Y, blockW, blockH);

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`m₁ (${m1}kg)`, b1X + 6, b1Y + 28);

        // Mass 2 (Right Block)
        ctx.fillStyle = '#ec4899';
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 12;
        ctx.fillRect(b2X, b2Y, blockW, blockH);

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`m₂ (${m2}kg)`, b2X + 6, b2Y + 28);

        // Vector Arrow Length scaling with Force F
        const arrowLen = Math.min(120, 30 + forceVal * 0.4);

        // Action Force Vector Arrow (F12 on m2 -> right)
        ctx.strokeStyle = '#38bdf8';
        ctx.fillStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(b2X + blockW, b2Y + blockH / 2);
        ctx.lineTo(b2X + blockW + arrowLen, b2Y + blockH / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(b2X + blockW + arrowLen, b2Y + blockH / 2);
        ctx.lineTo(b2X + blockW + arrowLen - 10, b2Y + blockH / 2 - 6);
        ctx.lineTo(b2X + blockW + arrowLen - 10, b2Y + blockH / 2 + 6);
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`F₁₂ = +${forceVal}N`, b2X + blockW + 5, b2Y - 8);

        // Reaction Force Vector Arrow (F21 on m1 -> left)
        ctx.strokeStyle = '#ec4899';
        ctx.fillStyle = '#ec4899';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(b1X, b1Y + blockH / 2);
        ctx.lineTo(b1X - arrowLen, b1Y + blockH / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(b1X - arrowLen, b1Y + blockH / 2);
        ctx.lineTo(b1X - arrowLen + 10, b1Y + blockH / 2 - 6);
        ctx.lineTo(b1X - arrowLen + 10, b1Y + blockH / 2 + 6);
        ctx.fill();

        ctx.fillStyle = '#ec4899';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`F₂₁ = -${forceVal}N`, b1X - arrowLen - 5, b1Y - 8);
      }
      else {
        // Universal Dynamic Simulation Node & Particle Engine
        // Accommodates ANY topic, concept, anatomy, chemistry, math, or subject prompt!
        const varKeys = spec.variables.map(v => v.key);
        const numVars = Math.max(1, varKeys.length);
        const radiusRing = Math.min(width, height) * 0.28;

        // Render Connecting Energy & Parameter Flow Lines
        ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < numVars; i++) {
          const angle1 = (i * (2 * Math.PI / numVars)) - Math.PI / 2;
          const x1 = centerX + radiusRing * Math.cos(angle1);
          const y1 = centerY + radiusRing * Math.sin(angle1);

          const nextIdx = (i + 1) % numVars;
          const angle2 = (nextIdx * (2 * Math.PI / numVars)) - Math.PI / 2;
          const x2 = centerX + radiusRing * Math.cos(angle2);
          const y2 = centerY + radiusRing * Math.sin(angle2);

          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x1, y1);
        }
        ctx.stroke();

        // Central System Core Node
        const corePulse = Math.sin(time * 3) * 6;
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 22 + corePulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(spec.subject || 'System', centerX - 18, centerY + 4);

        // Render Variable Nodes and Moving Signal Particles
        varKeys.forEach((vKey, vIdx) => {
          const angle = (vIdx * (2 * Math.PI / numVars)) - Math.PI / 2;
          const nodeX = centerX + radiusRing * Math.cos(angle);
          const nodeY = centerY + radiusRing * Math.sin(angle);
          const val = evalState[vKey] ?? 0;
          const vMeta = spec.variables.find(v => v.key === vKey);

          // Node Circle
          ctx.fillStyle = '#ec4899';
          ctx.shadowColor = '#ec4899';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(nodeX, nodeY, 18, 0, Math.PI * 2);
          ctx.fill();

          // Node Label & Value Tag
          ctx.shadowBlur = 0;
          ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
          ctx.font = 'bold 11px sans-serif';
          const labelText = (vMeta?.label || vKey) + ': ' + val + ' ' + (vMeta?.unit || '');
          ctx.fillText(labelText, nodeX - 45, nodeY > centerY ? nodeY + 30 : nodeY - 24);

          // Orbiting Signal Particle along the Line
          const flowProgress = (time * 2 + vIdx * 1.2) % 1;
          const particleX = centerX + (nodeX - centerX) * flowProgress;
          const particleY = centerY + (nodeY - centerY) * flowProgress;

          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(particleX, particleY, 5, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.shadowBlur = 0;
        ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Interactive Simulation', 30, height - 20);
      }

      ctx.restore();
    }
  };

  useEffect(() => {
    renderCanvasFrame();
  }, [evalState, isDark, spec, time]);

  const handleSliderChange = (key: string, val: number) => {
    setSliderVals(prev => ({ ...prev, [key]: val }));
  };

  const handleReset = () => {
    setTime(0);
    setChartData([]);
    const resetVals: Record<string, number> = {};
    spec.variables.forEach(v => { resetVals[v.key] = v.default; });
    setSliderVals(resetVals);
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 transition-colors duration-200 ${isDark ? 'bg-[#0a0a0c] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Top Navigation / Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className={`mb-2 text-sm font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'}`}
            >
              ← Back to Labs
            </button>
          )}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
              {spec.subject} • {spec.classLevel}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              AI Generated AST
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 flex items-center gap-2">
            {spec.title}
          </h1>
          <p className={`text-sm mt-1 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {spec.description}
          </p>
        </div>

        {/* Tab Selection Navigation Buttons */}
        <div className={`p-1.5 rounded-xl border flex items-center gap-1 ${isDark ? 'bg-[#121216] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          {[
            { id: 'sim', label: 'Interactive Lab', icon: Play },
            { id: 'theory', label: 'Theory & Derivation', icon: BookOpen },
            { id: 'chart', label: 'Data Analytics', icon: Activity },
            { id: 'quiz', label: 'Quiz', icon: Award }
          ].map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3.5 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-purple-600 text-white shadow-md'
                    : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto">
        {/* TAB 1: INTERACTIVE LAB SIMULATOR */}
        {activeTab === 'sim' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: 2D Physics Canvas Viewport */}
            <div className={`lg:col-span-8 p-4 md:p-6 rounded-2xl border flex flex-col justify-between ${isDark ? 'bg-[#121216] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Live 2D Physics Visualizer
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                  t = {time.toFixed(2)}s
                </span>
              </div>

              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={360}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Simulation Playback & Speed Controls */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/60">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-all ${
                      isPlaying ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>

                  <button
                    onClick={handleReset}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all flex items-center gap-1.5 ${
                      isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Speed:</span>
                  {[0.5, 1, 2].map(speed => (
                    <button
                      key={speed}
                      onClick={() => setSimSpeed(speed)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded border transition-colors ${
                        simSpeed === speed
                          ? 'bg-purple-600 text-white border-purple-500'
                          : isDark
                          ? 'border-slate-800 text-slate-400 hover:text-white'
                          : 'border-slate-200 text-slate-600 hover:text-black'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Controls & Real-Time Telemetry */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Dynamic Variable Sliders */}
              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#121216] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className="text-sm font-bold tracking-wide uppercase text-slate-400 mb-4 flex items-center justify-between">
                  <span>Control Parameters</span>
                  <span className="text-xs text-purple-400 font-mono">Live Inputs</span>
                </h3>

                <div className="space-y-4">
                  {spec.variables.map(v => (
                    <div key={v.key} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{v.label}</span>
                        <span className="font-mono text-purple-400">
                          {sliderVals[v.key]} {v.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={v.min}
                        max={v.max}
                        step={v.step}
                        value={sliderVals[v.key]}
                        onChange={e => handleSliderChange(v.key, parseFloat(e.target.value))}
                        className="w-full h-2 rounded-lg bg-slate-800 accent-purple-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>{v.min} {v.unit}</span>
                        <span>{v.max} {v.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Computed Formula Telemetry Readouts */}
              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#121216] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className="text-sm font-bold tracking-wide uppercase text-slate-400 mb-3">
                  Computed Telemetry
                </h3>
                <div className="space-y-2.5">
                  {spec.computedVars.map(cv => (
                    <div key={cv.key} className={`p-2.5 rounded-xl border flex items-center justify-between ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{cv.label}</span>
                      <span className="text-xs font-bold font-mono text-purple-400">
                        {evaluatedComputed[cv.key]?.toFixed(2) ?? '0.00'} {cv.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: THEORY & DERIVATION */}
        {activeTab === 'theory' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#121216] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                Conceptual Overview
              </h2>
              <p className={`leading-relaxed text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {spec.theory.overview}
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-purple-50/50 border-purple-100'}`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">Key Principles</h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {spec.theory.keyConcepts.map((kc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-purple-400 font-bold">•</span>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{kc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-emerald-50/50 border-emerald-100'}`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Real-World Application</h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {spec.theory.realWorldApplication}
                  </p>
                </div>
              </div>
            </div>

            {/* Step-by-Step Derivation */}
            {spec.derivation && (
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#121216] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  {spec.derivation.title}
                </h3>
                <div className="space-y-4">
                  {spec.derivation.steps.map(step => (
                    <div key={step.stepNumber} className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                          {step.stepNumber}
                        </span>
                        <span className="font-semibold text-sm">{step.label}</span>
                      </div>
                      <div className="my-2 p-2.5 rounded bg-slate-950/80 border border-slate-800 overflow-x-auto">
                        <MathFormula formula={step.formula} />
                      </div>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{step.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DATA ANALYTICS & CHART */}
        {activeTab === 'chart' && (
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#121216] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Real-Time Simulation Telemetry Chart
            </h2>
            <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Plotting {spec.chart.yLabel} vs {spec.chart.xLabel} dynamically as the simulation runs.
            </p>
            <div className="h-80 w-full">
              <SimulationDataChart
                data={chartData}
                variables={[spec.chart.yLabel]}
                title={`${spec.title} - Data Telemetry`}
                onClear={() => setChartData([])}
              />
            </div>
          </div>
        )}

        {/* TAB 4: QUIZ & ASSESSMENT */}
        {activeTab === 'quiz' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {spec.quiz.map((q, idx) => {
              const selected = quizAnswers[q.id];
              const isCorrect = selected === q.correctIndex;
              const hasAnswered = selected !== undefined;
              const showHint = showHints[q.id];

              return (
                <div key={q.id} className={`p-6 rounded-2xl border ${isDark ? 'bg-[#121216] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="font-bold text-base flex items-start gap-2">
                      <span className="text-purple-400 font-mono">Q{idx + 1}.</span>
                      <span>{q.question}</span>
                    </h3>
                    <button
                      onClick={() => setShowHints(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                      className="text-xs text-purple-400 hover:underline flex items-center gap-1 shrink-0"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      {showHint ? 'Hide Hint' : 'Hint'}
                    </button>
                  </div>

                  {showHint && (
                    <div className="mb-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
                      💡 {q.hint}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {q.options.map((opt, oIdx) => {
                      const isOptionSelected = selected === oIdx;
                      let btnStyle = isDark
                        ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-purple-500'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-purple-500';

                      if (hasAnswered) {
                        if (oIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-600/20 border-emerald-500 text-emerald-400 font-bold';
                        } else if (isOptionSelected) {
                          btnStyle = 'bg-rose-600/20 border-rose-500 text-rose-400';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={hasAnswered}
                          onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                          className={`p-3.5 text-left text-sm rounded-xl border transition-all ${btnStyle}`}
                        >
                          <span className="font-mono text-xs opacity-60 mr-2">{String.fromCharCode(65 + oIdx)}.</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {hasAnswered && (
                    <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                      isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}>
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block mb-1">{isCorrect ? 'Correct Answer!' : 'Incorrect'}</span>
                        {q.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
}
