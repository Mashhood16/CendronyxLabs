import { useState, useEffect } from 'react';
import { useTheme } from '../store';
import { X, ArrowRight, Beaker, Sparkles } from 'lucide-react';

const TOUR_KEY = 'cendronyx-tour-completed';

const TOUR_STEPS = [
  {
    title: 'Welcome to Cendronyx Labs!',
    description: 'Explore 464+ interactive virtual labs across Science, Physics, Chemistry, Biology, Math, and Computer Science.',
    icon: Sparkles,
    color: 'from-indigo-500 to-purple-600',
  },
  {
    title: 'Choose Your Class',
    description: 'Select your grade level from Class 6 to 12. Each class has curated labs aligned with your curriculum.',
    icon: Beaker,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Learn by Doing',
    description: 'Each lab features interactive simulations, real-time data tracking, and hands-on experiments you can repeat anytime.',
    icon: ArrowRight,
    color: 'from-pink-500 to-rose-600',
  },
];

export default function WelcomeTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const completed = localStorage.getItem(TOUR_KEY);
    if (!completed) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(TOUR_KEY, 'true');
  };

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const StepIcon = step.icon;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>
      
      {/* Tour Card */}
      <div className={`relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl ${
        isDark ? 'bg-[#121212] border border-[#1c1b1b]' : 'bg-white'
      }`}>
        {/* Header gradient */}
        <div className={`h-2 bg-gradient-to-r ${step.color}`}></div>
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${
            isDark ? 'text-[#71717a] hover:text-white hover:bg-[#1c1b1b]' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center">
          {/* Icon */}
          <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
            <StepIcon className="w-8 h-8 text-white" />
          </div>

          {/* Content */}
          <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {step.title}
          </h3>
          <p className={`text-sm leading-relaxed mb-8 ${isDark ? 'text-[#a1a1aa]' : 'text-slate-500'}`}>
            {step.description}
          </p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {TOUR_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStep
                    ? `w-6 bg-gradient-to-r ${step.color}`
                    : idx < currentStep
                    ? 'w-2 bg-indigo-500'
                    : `w-2 ${isDark ? 'bg-[#2a2a2a]' : 'bg-slate-200'}`
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                isDark ? 'text-[#71717a] hover:text-white hover:bg-[#1c1b1b]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r ${step.color} hover:opacity-90 transition-opacity shadow-lg`}
            >
              {currentStep < TOUR_STEPS.length - 1 ? 'Next' : 'Get Started'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
