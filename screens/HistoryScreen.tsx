import React from 'react';
import { useHabits } from '../context/HabitContext';
import { getReadableDate, getTodayDateKey } from '../utils/helpers';
import { Check, Archive } from 'lucide-react';

const HistoryScreen: React.FC = () => {
  const { logs, habits } = useHabits();
  const today = getTodayDateKey();
  
  // Sort dates descending, excluding today
  const historyKeys = Object.keys(logs)
    .filter(key => key !== today)
    .sort()
    .reverse();

  return (
    <div className="space-y-4 animate-fade-in">
       <div className="mb-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">History</h2>
        <p className="text-gray-500 dark:text-gray-400">Past Achievements</p>
      </div>

      {historyKeys.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
          <Archive className="w-16 h-16 mb-4 opacity-30" />
          <p className="font-medium">No history recorded yet.</p>
        </div>
      ) : (
        historyKeys.map(dateKey => {
          const log = logs[dateKey];
          const goalsMet = Object.keys(log.habits).filter(k => {
             const hLog = log.habits[k];
             return hLog.count >= hLog.goal;
          });
          const totalGoals = Object.keys(habits).length;
          const isPerfect = goalsMet.length === totalGoals && totalGoals > 0;

          return (
            <div key={dateKey} className={`p-5 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border ${isPerfect ? 'border-green-500/30 dark:border-green-500/30' : 'border-gray-100 dark:border-gray-700'}`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800 dark:text-gray-200">{getReadableDate(dateKey).split(',')[0]}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isPerfect ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                  {goalsMet.length} / {totalGoals} Goals
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-4">{getReadableDate(dateKey)}</p>
              
              <div className="flex flex-wrap gap-2">
                {goalsMet.map(habitId => (
                  <span key={habitId} className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border border-green-100 dark:border-green-900/50">
                    <Check className="w-3 h-3 mr-1" />
                    {habits[habitId]?.name || habitId}
                  </span>
                ))}
                {goalsMet.length === 0 && <span className="text-xs text-gray-400 italic">No goals met</span>}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default HistoryScreen;