interface SkeletonCardProps {
  variant?: 'card' | 'list';
}

export default function SkeletonCard({ variant = 'card' }: SkeletonCardProps) {
  if (variant === 'list') {
    return (
      <div className="flex items-center gap-5 p-4 rounded-2xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] animate-pulse">
        <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-zinc-700"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-zinc-700 rounded w-1/3"></div>
          <div className="h-3 bg-slate-200 dark:bg-zinc-700 rounded w-2/3"></div>
        </div>
        <div className="h-6 w-16 bg-slate-200 dark:bg-zinc-700 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#1c1b1b] overflow-hidden animate-pulse">
      <div className="h-32 bg-slate-200 dark:bg-zinc-700"></div>
      <div className="p-6 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-zinc-700 rounded w-3/4"></div>
        <div className="h-3 bg-slate-200 dark:bg-zinc-700 rounded w-full"></div>
        <div className="h-3 bg-slate-200 dark:bg-zinc-700 rounded w-2/3"></div>
        <div className="flex justify-between pt-3 border-t border-slate-100 dark:border-zinc-800">
          <div className="h-3 bg-slate-200 dark:bg-zinc-700 rounded w-16"></div>
          <div className="h-6 w-20 bg-slate-200 dark:bg-zinc-700 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
