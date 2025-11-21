import React, { useState, useEffect } from 'react';
import { HabitProvider, useHabits } from './context/HabitContext';
import { ScreenType, ThemeContextType } from './types';
import { Sun, Moon, ListChecks, History, BarChart2, TrendingUp, Settings, LayoutDashboard } from 'lucide-react';
import TodayScreen from './screens/TodayScreen';
import HistoryScreen from './screens/HistoryScreen';
import WeeklyScreen from './screens/WeeklyScreen';
import StatsScreen from './screens/StatsScreen';
import SettingsScreen from './screens/SettingsScreen';
import WelcomeScreen from './screens/WelcomeScreen';

// Inner component that has access to the Context
const AppContent: React.FC<{ themeContext: ThemeContextType }> = ({ themeContext }) => {
  const { userProfile } = useHabits();
  const [screen, setScreen] = useState<ScreenType>('today');
  const { theme, toggleTheme } = themeContext;

  // If user has no name, show Welcome/Auth Screen
  if (!userProfile.name) {
    return <WelcomeScreen />;
  }

  const renderScreen = () => {
    switch (screen) {
      case 'today': return <TodayScreen />;
      case 'history': return <HistoryScreen />;
      case 'weekly': return <WeeklyScreen />;
      case 'stats': return <StatsScreen />;
      case 'settings': return <SettingsScreen themeContext={themeContext} />;
      default: return <TodayScreen />;
    }
  };

  const NavButton = ({ target, icon: Icon, label }: { target: ScreenType, icon: any, label: string }) => {
    const isActive = screen === target;
    return (
      <button 
        onClick={() => {
            if (screen !== target) {
                 if (navigator.vibrate) navigator.vibrate(5);
                 setScreen(target);
            }
        }}
        className="relative flex-1 flex flex-col items-center justify-center py-1 group"
      >
        <div className={`relative p-1.5 transition-all duration-300 ease-out rounded-2xl ${isActive ? 'bg-indigo-100 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400 -translate-y-1' : 'text-gray-400 dark:text-gray-500'}`}>
           <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : 'stroke-current'}`} strokeWidth={isActive ? 2 : 2} />
           {isActive && (
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full opacity-0 animate-fade-in sm:opacity-100" />
           )}
        </div>
        <span className={`text-[10px] mt-1 font-medium transition-all duration-300 ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-400 dark:text-gray-600'}`}>
            {label}
        </span>
      </button>
    );
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-black text-gray-900 dark:text-gray-100 overflow-hidden items-center justify-center">
        
        {/* Desktop Constraint Wrapper - Restored to max-w-sm full height */}
        <div className="h-full w-full max-w-sm mx-auto flex flex-col relative bg-gray-50 dark:bg-black shadow-2xl overflow-hidden sm:border-x sm:border-gray-800">
            
            {/* Status Bar Area */}
            <div className="h-safe-top w-full bg-white/80 dark:bg-black/80 backdrop-blur-md z-50 fixed top-0 max-w-sm mx-auto pointer-events-none" />

            {/* Header */}
            <header className="flex-none z-40 px-5 py-3 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 pt-safe-top mt-safe-top transition-colors duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                      <LayoutDashboard className="text-white w-4 h-4" />
                  </div>
                  <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Habit<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
                  </h1>
                </div>
                <button 
                  onClick={toggleTheme}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800/80 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-90"
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </header>

            {/* Scrollable Content Area */}
            <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth bg-gray-50 dark:bg-black pb-24 overscroll-none">
              <div className="px-5 py-6 min-h-full">
                {/* Render screen directly without key/wrapper to prevent unmount flash */}
                {renderScreen()}
              </div>
            </main>

            {/* Bottom Navigation Dock */}
            <nav className="flex-none absolute bottom-0 w-full bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 z-50 pb-safe-bottom pt-2 shadow-[0_-1px_10px_rgba(0,0,0,0.05)] dark:shadow-none">
              <div className="flex justify-between items-center px-4">
                <NavButton target="today" icon={ListChecks} label="Today" />
                <NavButton target="history" icon={History} label="History" />
                <NavButton target="weekly" icon={BarChart2} label="Weekly" />
                <NavButton target="stats" icon={TrendingUp} label="Stats" />
                <NavButton target="settings" icon={Settings} label="Settings" />
              </div>
            </nav>

        </div>
      </div>
  );
}

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('habitFlowTheme') as 'light' | 'dark';
    if (savedTheme) setTheme(savedTheme);
    else setTheme('dark');
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('habitFlowTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const themeContext: ThemeContextType = { theme, toggleTheme };

  return (
    <HabitProvider>
      <AppContent themeContext={themeContext} />
    </HabitProvider>
  );
};

export default App;