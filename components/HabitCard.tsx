import React, { useEffect, useState } from 'react';
import { Habit } from '../types';
import { 
  GlassWater, Moon, BrainCog, Dumbbell, Plus, Minus, Check, Sparkles,
  Book, Sun, Star, Coffee, Music, Briefcase, Zap, Leaf, Droplets, Smile, Wifi
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';

// Map icon strings to components - Exported for usage in Settings
export const iconMap: Record<string, React.ElementType> = {
  'glass-water': GlassWater,
  'moon': Moon,
  'brain-cog': BrainCog,
  'dumbbell': Dumbbell,
  'book': Book,
  'sun': Sun,
  'star': Star,
  'coffee': Coffee,
  'music': Music,
  'briefcase': Briefcase,
  'zap': Zap,
  'leaf': Leaf,
  'droplets': Droplets,
  'smile': Smile,
  'wifi': Wifi
};

// Map color strings to Tailwind classes - Exported for usage in Settings
export const colorMap: Record<string, { border: string, text: string, bg: string, bar: string, btn: string, btnHover: string, ring: string, preview: string }> = {
  sky: { border: 'border-sky-500', text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-500/10', bar: 'bg-sky-500', btn: 'bg-sky-100 dark:bg-sky-800', btnHover: 'hover:bg-sky-200 dark:hover:bg-sky-700', ring: 'ring-sky-500', preview: 'bg-sky-500' },
  indigo: { border: 'border-indigo-500', text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10', bar: 'bg-indigo-500', btn: 'bg-indigo-100 dark:bg-indigo-800', btnHover: 'hover:bg-indigo-200 dark:hover:bg-indigo-700', ring: 'ring-indigo-500', preview: 'bg-indigo-500' },
  purple: { border: 'border-purple-500', text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10', bar: 'bg-purple-500', btn: 'bg-purple-100 dark:bg-purple-800', btnHover: 'hover:bg-purple-200 dark:hover:bg-purple-700', ring: 'ring-purple-500', preview: 'bg-purple-500' },
  amber: { border: 'border-amber-500', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', bar: 'bg-amber-500', btn: 'bg-amber-100 dark:bg-amber-800', btnHover: 'hover:bg-amber-200 dark:hover:bg-amber-700', ring: 'ring-amber-500', preview: 'bg-amber-500' },
  emerald: { border: 'border-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', bar: 'bg-emerald-500', btn: 'bg-emerald-100 dark:bg-emerald-800', btnHover: 'hover:bg-emerald-200 dark:hover:bg-emerald-700', ring: 'ring-emerald-500', preview: 'bg-emerald-500' },
  rose: { border: 'border-rose-500', text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10', bar: 'bg-rose-500', btn: 'bg-rose-100 dark:bg-rose-800', btnHover: 'hover:bg-rose-200 dark:hover:bg-rose-700', ring: 'ring-rose-500', preview: 'bg-rose-500' },
  orange: { border: 'border-orange-500', text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-500/10', bar: 'bg-orange-500', btn: 'bg-orange-100 dark:bg-orange-800', btnHover: 'hover:bg-orange-200 dark:hover:bg-orange-700', ring: 'ring-orange-500', preview: 'bg-orange-500' },
  cyan: { border: 'border-cyan-500', text: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-500/10', bar: 'bg-cyan-500', btn: 'bg-cyan-100 dark:bg-cyan-800', btnHover: 'hover:bg-cyan-200 dark:hover:bg-cyan-700', ring: 'ring-cyan-500', preview: 'bg-cyan-500' },
};

const HabitCard: React.FC<{ habit: Habit }> = ({ habit }) => {
  const { trackHabit, untrackHabit } = useHabits();
  const [animate, setAnimate] = useState(false);
  const [pressed, setPressed] = useState<'plus' | 'minus' | null>(null);
  
  const Icon = iconMap[habit.iconName] || BrainCog;
  const colors = colorMap[habit.color] || colorMap.indigo;
  
  const percentage = Math.min(100, (habit.count / habit.goal) * 100);
  const isComplete = habit.count >= habit.goal;

  useEffect(() => {
    if (isComplete && !animate) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [habit.count, habit.goal]);

  const handleAction = (action: 'plus' | 'minus') => {
      setPressed(action);
      setTimeout(() => setPressed(null), 150);
      if (action === 'plus') trackHabit(habit.id);
      else untrackHabit(habit.id);
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-white dark:bg-[#1c1c1e] shadow-sm border border-gray-100 dark:border-[#2c2c2e] select-none transition-all duration-300 ${isComplete ? 'ring-1 ring-green-500/50 dark:ring-green-500/30' : ''}`}>
      
      {/* Progress Background (Subtle) */}
      <div 
        className={`absolute left-0 top-0 bottom-0 opacity-5 dark:opacity-10 transition-all duration-700 ease-out ${colors.bar}`} 
        style={{ width: `${percentage}%` }}
      />

      <div className="relative p-5">
        <div className="flex items-center justify-between mb-4">
          
          {/* Icon & Name */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className={`w-12 h-12 rounded-2xl flex flex-shrink-0 items-center justify-center transition-all duration-500 ${isComplete ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 rotate-3 scale-105' : `${colors.bg} ${colors.text}`}`}>
               {isComplete ? <Check className="w-6 h-6" strokeWidth={3} /> : <Icon className="w-6 h-6" />}
            </div>
            <div className="truncate">
               <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight truncate pr-2">{habit.name}</h3>
               <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5 flex items-center">
                 {habit.count} <span className="mx-1 opacity-50">/</span> {habit.goal} {habit.unit}
               </p>
            </div>
          </div>

          {/* Percentage Badge */}
           <div className="ml-2 flex-shrink-0">
               <span className={`text-sm font-bold ${isComplete ? 'text-green-500 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                   {Math.round(percentage)}%
               </span>
           </div>
        </div>

        {/* Interactive Area */}
        <div className="flex items-center gap-3">
            {/* Progress Bar */}
            <div className="flex-1 h-3 bg-gray-100 dark:bg-black/50 rounded-full overflow-hidden relative">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out ${isComplete ? 'bg-green-500' : colors.bar} ${animate ? 'animate-pulse' : ''}`}
                    style={{ width: `${percentage}%` }}
                />
                {/* Shine effect */}
                 <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" style={{ display: isComplete ? 'block' : 'none' }}></div>
            </div>

            {/* Controls */}
            <div className="flex items-center bg-gray-50 dark:bg-[#2c2c2e] rounded-full p-1 border border-gray-100 dark:border-gray-700/50">
                <button 
                onClick={(e) => { e.stopPropagation(); handleAction('minus'); }}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-150 active:scale-75 focus:outline-none ${pressed === 'minus' ? 'bg-gray-200 dark:bg-gray-600' : 'text-gray-400 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-red-500'}`}
                disabled={habit.count <= 0}
                >
                <Minus className="w-5 h-5" strokeWidth={2.5} />
                </button>
                
                <div className="w-px h-4 bg-gray-200 dark:bg-gray-600 mx-1"></div>

                <button 
                onClick={(e) => { e.stopPropagation(); handleAction('plus'); }}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-150 active:scale-75 focus:outline-none ${pressed === 'plus' ? 'bg-gray-200 dark:bg-gray-600' : ''} ${isComplete ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20' : 'text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                <Plus className="w-5 h-5" strokeWidth={2.5} />
                </button>
            </div>
        </div>
      </div>
      
      {/* Confetti Particles */}
      {animate && (
          <>
            <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-[ping_0.6s_ease-out_forwards]"></div>
            <div className="absolute top-1/4 left-3/4 w-1 h-1 bg-blue-400 rounded-full animate-[ping_0.8s_ease-out_forwards]"></div>
          </>
      )}
    </div>
  );
};

export default HabitCard;