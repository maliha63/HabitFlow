import React, { useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const WeeklyScreen: React.FC = () => {
  const { logs, habits } = useHabits();
  
  const weeklyData = useMemo(() => {
    const data = [];
    const today = new Date();
    const totalHabitTypes = Object.keys(habits).length;

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      const log = logs[dateKey];
      let completed = 0;

      if (log && log.habits) {
        Object.values(log.habits).forEach((h: any) => {
          if (h.count >= h.goal) completed++;
        });
      }

      data.push({
        day: dayName,
        completed: completed,
        total: totalHabitTypes,
        score: totalHabitTypes > 0 ? (completed / totalHabitTypes) * 100 : 0
      });
    }
    return data;
  }, [logs, habits]);

  const totalCompleted = weeklyData.reduce((sum, d) => sum + d.completed, 0);
  const totalPossible = weeklyData.reduce((sum, d) => sum + d.total, 0);
  const weeklyPercentage = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Weekly</h2>
        <p className="text-gray-500 dark:text-gray-400">Performance Overview</p>
      </div>

      {/* Score Card */}
      <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl text-center text-white">
        <h3 className="text-lg font-medium text-indigo-100 mb-1">Consistency Score</h3>
        <div className="text-5xl font-black tracking-tight mb-2">
          {weeklyPercentage}%
        </div>
        <p className="text-sm text-indigo-100 opacity-80">
          {totalCompleted} goals met out of {totalPossible}
        </p>
      </div>

      {/* Chart */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-gray-800 dark:text-gray-200">Daily Completion</h3>
             <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-1 rounded">Last 7 Days</span>
        </div>
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
                <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} 
                dy={10}
                />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff', padding: '8px 12px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => [`${Math.round(value)}%`, 'Score']}
                />
                <Bar dataKey="score" radius={[6, 6, 6, 6]} barSize={12}>
                {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score === 100 ? '#22c55e' : '#6366f1'} />
                ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WeeklyScreen;