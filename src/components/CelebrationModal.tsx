import { useEffect, useState } from 'react';
import { useTheme } from '../store';
import { Trophy, Star, X } from 'lucide-react';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'milestone' | 'achievement';
}

export default function CelebrationModal({ isOpen, onClose, title, message, type = 'milestone' }: CelebrationModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (isOpen) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-2 h-2 rounded-full animate-confetti"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animationDelay: `${p.delay}s`,
              backgroundColor: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#3b82f6'][p.id % 5],
            }}
          />
        ))}
      </div>

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Card */}
      <div className={`relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl ${
        isDark ? 'bg-[#121212] border border-[#1c1b1b]' : 'bg-white'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${
            isDark ? 'text-[#71717a] hover:text-white hover:bg-[#1c1b1b]' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg animate-bounce-in">
              {type === 'milestone' ? (
                <Trophy className="w-10 h-10 text-white" />
              ) : (
                <Star className="w-10 h-10 text-white" />
              )}
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center animate-spin-slow">
              <Star className="w-4 h-4 text-white" fill="white" />
            </div>
          </div>

          <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {title}
          </h3>
          <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-[#a1a1aa]' : 'text-slate-500'}`}>
            {message}
          </p>

          <button
            onClick={onClose}
            className="w-full px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 transition-opacity shadow-lg"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
}
