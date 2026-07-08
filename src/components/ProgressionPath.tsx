import { useTranslate } from '../i18n';
import { ArrowRight, GraduationCap } from 'lucide-react';

interface ProgressionLink {
  fromClass: number;
  fromSubject: string;
  fromLab: string;
  toConcept: string;
}

interface ProgressionPathProps {
  links: ProgressionLink[];
  currentClass: number;
}

export default function ProgressionPath({ links, currentClass }: ProgressionPathProps) {
  const { t } = useTranslate();
  return (
    <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-pink-950/20 rounded-xl border border-indigo-200 dark:border-indigo-800/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{t("Learning Pathway")}</span>
      </div>
      <div className="space-y-2">
        {links.map((link, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 shrink-0 mt-0.5">
              {t("Class")} {link.fromClass}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-1" />
            <span className="text-slate-600 dark:text-slate-300">
              <span className="font-semibold">{link.fromLab}</span>
              <span className="text-slate-400 dark:text-slate-500"> — {link.toConcept}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-indigo-200/50 dark:border-indigo-800/30">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {t("Building on concepts from earlier classes — now going deeper in Class")} {currentClass}.
        </span>
      </div>
    </div>
  );
}
