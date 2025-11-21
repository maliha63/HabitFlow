import React from 'react';
import { useHabits } from '../context/HabitContext';
import HabitCard from '../components/HabitCard';
import { getReadableDate, getTodayDateKey } from '../utils/helpers';
import { Habit } from '../types';

const TodayScreen: React.FC = () => {
  const { habits, logs, userProfile } = useHabits();
  const todayKey = getTodayDateKey();
  
  // Calculate progress
  const totalHabits = Object.keys(habits).length;
  const todayLog = logs[todayKey] || { habits: {} };
  let completedCount = 0;
  
  Object.values(habits).forEach((habit: Habit) => {
      const count = todayLog.habits[habit.id]?.count || 0;
      if (count >= habit.goal) completedCount++;
  });
  
  const progress = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Greeting Section */}
      <div className="flex items-center gap-3 pt-2 px-1">
         <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg border border-indigo-200 dark:border-indigo-500/30 shadow-sm">
            {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
         </div>
         <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              Hi, {userProfile.name.split(' ')[0]}!
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Let's crush your goals today.</p>
         </div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-600 dark:to-indigo-900 p-6 shadow-2xl shadow-indigo-600/20 text-white">
         {/* Abstract Shapes */}
         <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
         <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"></div>
         
         <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">
                        {getReadableDate(todayKey)}
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight">
                    {progress === 100 ? "All Done! 🎉" : progress > 50 ? "Almost there!" : "Let's do this."}
                    </h2>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-white/20 flex items-center justify-center backdrop-blur-sm">
                    <span className="font-bold text-sm">{Math.round(progress)}%</span>
                </div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-1">
                <div className="h-3 bg-black/20 rounded-xl overflow-hidden relative">
                    <div 
                        className="absolute top-0 bottom-0 left-0 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] rounded-xl transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
            <div className="flex justify-between mt-2 text-xs font-medium text-indigo-200/80 px-1">
                <span>{completedCount} completed</span>
                <span>{totalHabits - completedCount} remaining</span>
            </div>
         </div>
      </div>

      {/* Habits List */}
      <div className="pb-4">
        <div className="flex items-center justify-between mb-4 px-1">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Habits</h3>
             <span className="text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{totalHabits} Active</span>
        </div>
        <div className="space-y-4">
            {Object.values(habits).map((habit: Habit) => (
            <HabitCard key={habit.id} habit={habit} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default TodayScreen;