import { useTranslate } from '../i18n';
import { useRef, useCallback, useMemo, useEffect, useState } from 'react';
import { getLabComponent } from '../routes/labRoutes';
import { LAB_MODULES } from '../data/labModules';
import { historyDB } from '../services/dbService';
import type { LabDataEntry } from '../store';
import { useAuth, useLab, LabProvider } from '../store';
import { getAnonymousId } from '../utils/sessionId';
import Layout from '../components/Layout';
import { theme } from '../utils/labTheme';
import CustomLabRunner from '../components/CustomLabRunner';
import { customLabService } from '../services/customLabService';

interface LabRunnerInnerProps {
  moduleId: string | undefined;
  onExit: () => void;
}

/** Build a flat experimentData object from lab context data entries */
function buildExperimentData(
  entries: LabDataEntry[]
): Record<string, string | number> | undefined {
  if (!entries || entries.length === 0) return undefined;

  const result: Record<string, string | number> = {
    _dataPoints: entries.length,
  };

  // Summarize the last 5 entries as key-value pairs
  const recent = entries.slice(-5);
  recent.forEach((entry, i) => {
    for (const [key, val] of Object.entries(entry)) {
      if (key === 'timestamp') continue;
      const label = `${key}_${i + 1}`;
      if (typeof val === 'string' || typeof val === 'number') {
        result[label] = val;
      }
    }
  });

  return result;
}

export default function LabRunnerInner({ moduleId, onExit }: LabRunnerInnerProps) {
  const { t } = useTranslate();
  const { user } = useAuth();
  const labCtx = useLab();
  const startTime = useRef(Date.now());
  const exiting = useRef(false);
  const [customLab, setCustomLab] = useState<any | null>(null);

  useEffect(() => {
    if (moduleId && moduleId.startsWith('custom_')) {
      customLabService.getLab(moduleId).then(setCustomLab);
    }
  }, [moduleId]);

  const mod = useMemo(() => {
    if (!moduleId) return null;
    if (moduleId.startsWith('custom_')) {
      if (!customLab) return null;
      return {
        id: customLab.id,
        title: customLab.title,
        subject: customLab.subject,
        classLevel: customLab.classLevel,
      };
    }
    return LAB_MODULES.find(m => m.id === moduleId) || null;
  }, [moduleId, customLab]);

  const LabComponent = useMemo(() => {
    if (!moduleId) return null;
    if (moduleId.startsWith('custom_')) {
      return CustomLabRunner;
    }
    return getLabComponent(moduleId);
  }, [moduleId]);

  // Keep refs for labData and labScore so the unmount cleanup always sees latest data
  const labDataRef = useRef(labCtx.labData);
  labDataRef.current = labCtx.labData;
  const labScoreRef = useRef(labCtx.labScore);
  labScoreRef.current = labCtx.labScore;

  // Save history on unmount (catches browser back button, keyboard nav, etc.)
  useEffect(() => {
    return () => {
      if (exiting.current) return;
      if (!moduleId || !mod) return;
      const userId = user?.id || getAnonymousId();
      const elapsed = Math.round((Date.now() - startTime.current) / 1000);
      const experimentData = buildExperimentData(labDataRef.current);
      const ls = labScoreRef.current;
      const score = ls?.score ?? 0;
      const maxScore = ls?.maxScore ?? 100;
      historyDB.addRecord(userId, {
        labId: mod.id,
        title: mod.title,
        subject: mod.subject,
        score,
        maxScore,
        timeSpentSeconds: elapsed,
        experimentData,
      }).catch(err => console.error('Unmount save failed', err));
    };
  }, [moduleId, mod, user]);

  const saveRecord = useCallback(async (experimentData?: Record<string, string | number>, scoreOverride?: { score: number; maxScore: number }) => {
    if (!moduleId || !mod) return;
    const userId = user?.id || getAnonymousId();
    const elapsed = Math.round((Date.now() - startTime.current) / 1000);
    const { score, maxScore } = scoreOverride || { score: 0, maxScore: 100 };
    await historyDB.addRecord(userId, {
      labId: mod.id,
      title: mod.title,
      subject: mod.subject,
      score,
      maxScore,
      timeSpentSeconds: elapsed,
      experimentData,
    });
  }, [moduleId, mod, user]);

  const handleExit = useCallback(async () => {
    if (exiting.current) return;
    exiting.current = true;

    if (moduleId && mod) {
      try {
        const experimentData = buildExperimentData(labCtx.labData);
        // Use score from lab context if set, otherwise default to 0/100
        const scoreOverride = labCtx.labScore ?? undefined;
        await saveRecord(experimentData, scoreOverride);
      } catch (err) {
        console.error('Failed to save lab history', err);
      }
    }

    onExit();
  }, [moduleId, mod, onExit, labCtx.labData, labCtx.labScore, saveRecord]);

  const hideCalculator = useMemo(() => {
    if (!mod) return false;
    return mod.subject === 'english' || ['6', '7', '8'].includes(mod.classLevel);
  }, [mod]);

  const isEnglishLab = useMemo(() => {
    return mod?.subject === 'english';
  }, [mod]);

  if (!LabComponent || !moduleId || (moduleId.startsWith('custom_') && !customLab)) {
    return (
      <Layout>
        <div className={`flex flex-col items-center justify-center min-h-[60vh] ${theme.page.bg} rounded-2xl border ${theme.border.default}`}>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{t("Module Not Found")}</h2>
          <p className="text-slate-500 mb-6">{t("The module \"")}{moduleId}{t("\" does not exist or is still under construction.")}</p>
          <button onClick={handleExit} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent">
            {t("Return to Dashboard")}
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <LabProvider value={{ hideCalculator, isEnglishLab, moduleId }}>
      <div className={`${isEnglishLab ? 'english-lab-runner' : ''} ${theme.text.primary} ${theme.page.bg} min-h-screen`}>
        <LabComponent onExit={handleExit} moduleId={moduleId} />
      </div>
    </LabProvider>
  );
}
