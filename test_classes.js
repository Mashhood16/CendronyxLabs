function getClasses(activeMobileTab) {
  const section1 = `w-full rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#1c1b1b] lg: lg:h-full overflow-hidden flex-col ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`;
  const section2 = `w-full bg-white lg:bg-slate-50 dark:bg-[#121212] lg:dark:bg-[#1c1b1b] rounded-xl shadow-sm p-6 border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#2a2a2a] lg:h-full lg: rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`;
  const section3 = `w-full bg-white lg:bg-slate-100 dark:bg-[#121212] lg:dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] lg:dark:border-[#1c1b1b] relative items-center justify-center p-8 lg:min-h-[35vh] lg:min-h-[500px] lg:h-full lg: order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`;
  
  return { section1, section2, section3 };
}

console.log("THEORY ACTIVE:");
console.log(getClasses('theory'));
console.log("LAB ACTIVE:");
console.log(getClasses('lab'));
