import React, { useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import { Zap, Trophy, CheckCircle } from 'lucide-react';
import { getTodayDateKey } from '../utils/helpers';
import { Habit, DailyLog } from '../types';

const StatsScreen: React.FC = () => {
  const { logs, habits } = useHabits();
  const currentDayKey = getTodayDateKey();

  const streaks = useMemo(() => {
    const historyKeys = Object.keys(logs).sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    let streakCheckDate = new Date();
    for (let i = 0; i < historyKeys.length + 1; i++) {
        const checkKey = streakCheckDate.toISOString().split('T')[0];
        const logEntry = logs[checkKey];
        
        let isDayComplete = false;
        if (logEntry && logEntry.habits) {
            isDayComplete = Object.values(logEntry.habits).every((h: any) => h.count >= h.goal);
            if (Object.keys(logEntry.habits).length === 0) isDayComplete = false;
        }

        if (isDayComplete) {
             if (checkKey === currentDayKey || historyKeys.includes(checkKey)) {
               currentStreak++;
            } else if (i > 0) {
                break;
            }
        } else if (checkKey !== currentDayKey) { 
            break;
        }
        streakCheckDate.setDate(streakCheckDate.getDate() - 1);
    }

    historyKeys.forEach(key => {
        const logEntry = logs[key];
        const isDayComplete = logEntry && Object.values(logEntry.habits).every((h: any) => h.count >= h.goal) && Object.keys(logEntry.habits).length > 0;
        
        if (isDayComplete) {
            tempStreak++;
        } else {
            tempStreak = 0;
        }
        longestStreak = Math.max(longestStreak, tempStreak);
    });

    return { current: currentStreak, longest: Math.max(longestStreak, currentStreak) };
  }, [logs, currentDayKey]);

  const totalLogs = Object.keys(logs).length;
  let perfectDays = 0;
  Object.values(logs).forEach((log: DailyLog) => {
      const isPerfect = Object.values(log.habits).length > 0 && Object.values(log.habits).every((h: any) => h.count >= h.goal);
      if (isPerfect) perfectDays++;
  });

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="mb-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Statistics</h2>
        <p className="text-gray-500 dark:text-gray-400">Your Journey in Numbers</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col items-center text-center border border-gray-100 dark:border-gray-700">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-3 text-amber-600 dark:text-amber-400">
                <Zap className="w-6 h-6" />
            </div>
            <span className="text-4xl font-black text-gray-900 dark:text-white">{streaks.current}</span>
            <span className="text-xs text-gray-500 uppercase font-bold tracking-wide mt-1">Current Streak</span>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col items-center text-center border border-gray-100 dark:border-gray-700">
             <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-3 text-indigo-600 dark:text-indigo-400">
                <Trophy className="w-6 h-6" />
            </div>
            <span className="text-4xl font-black text-gray-900 dark:text-white">{streaks.longest}</span>
            <span className="text-xs text-gray-500 uppercase font-bold tracking-wide mt-1">Best Streak</span>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg text-white flex items-center">
        <div className="mr-5 p-3 bg-white/20 rounded-full backdrop-blur-sm">
            <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <div>
            <h3 className="text-lg font-bold">Perfect Days</h3>
            <p className="text-emerald-100 text-sm opacity-90">
                Total <span className="font-bold text-white text-lg mx-1">{perfectDays}</span> perfect days recorded.
            </p>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <h3 className="font-bold text-gray-800 dark:text-gray-200 px-1">Habit Averages</h3>
        <div className="space-y-3">
            {Object.entries(habits).map(([key, habit]: [string, Habit]) => {
                let totalCount = 0;
                Object.values(logs).forEach((l: DailyLog) => {
                    if (l.habits[key]) totalCount += l.habits[key].count;
                });
                const avg = totalLogs > 0 ? (totalCount / totalLogs).toFixed(1) : 0;

                return (
                    <div key={key} className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{habit.name}</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{avg} <span className="text-xs text-gray-400 font-normal uppercase ml-1">{habit.unit}/day</span></span>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default StatsScreen;