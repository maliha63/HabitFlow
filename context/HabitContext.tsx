
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Habit, Logs, HabitContextType, UserProfile } from '../types';
import { STORAGE_KEY, DEFAULT_HABITS, ADMIN_HASH } from '../constants';
import { getTodayDateKey, generateUserId, triggerHaptic, checkPassword } from '../utils/helpers';

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Record<string, Habit>>(DEFAULT_HABITS);
  const [logs, setLogs] = useState<Logs>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Cloud Config State (Loaded from Storage, not Code)
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [webAppUrl, setWebAppUrl] = useState('');

  // Install Prompt State
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Refs for accessing latest state in async functions/effects without dependency cycles
  const habitsRef = useRef(habits);
  const isSyncingRef = useRef(isSyncing);
  const userProfileRef = useRef<UserProfile>({ name: '', email: '' });
  const webAppUrlRef = useRef('');

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
      const saved = localStorage.getItem('habitFlowUserProfile');
      return saved ? JSON.parse(saved) : { name: '', email: '' };
  });

  const currentDayKey = getTodayDateKey();

  // Keep refs updated
  useEffect(() => { habitsRef.current = habits; }, [habits]);
  useEffect(() => { userProfileRef.current = userProfile; }, [userProfile]);
  useEffect(() => { isSyncingRef.current = isSyncing; }, [isSyncing]);
  useEffect(() => { webAppUrlRef.current = webAppUrl; }, [webAppUrl]);

  // Load State
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLogs(parsed.logs || {});
        
        // Merge saved goals with default structure to prevent schema breaks
        const loadedHabits = { ...DEFAULT_HABITS };
        if (parsed.habits) {
          Object.keys(parsed.habits).forEach(key => {
             if (loadedHabits[key]) {
                loadedHabits[key] = {
                  ...loadedHabits[key],
                  goal: parsed.habits[key].goal,
                  unit: parsed.habits[key].unit || loadedHabits[key].unit,
                  count: 0 // Reset count initially, will be set by logs
                };
             } else {
                loadedHabits[key] = { ...parsed.habits[key], count: 0 };
             }
          });
        }
        setHabits(loadedHabits);
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }

    // Load Cloud Config
    const savedSheetUrl = localStorage.getItem('habitFlowSheetUrl');
    const savedAppUrl = localStorage.getItem('habitFlowAppUrl');
    if (savedSheetUrl) setGoogleSheetUrl(savedSheetUrl);
    if (savedAppUrl) setWebAppUrl(savedAppUrl);

    // Install Prompt Listener
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  // Sync Today's Log to State
  useEffect(() => {
    const todayLog = logs[currentDayKey];
    setHabits(prev => {
      const next = { ...prev };
      let changed = false;
      Object.keys(next).forEach(key => {
        const logCount = todayLog?.habits[key]?.count || 0;
        if (next[key].count !== logCount) {
          next[key] = { ...next[key], count: logCount };
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [logs, currentDayKey]);

  // Save State
  useEffect(() => {
    const stateToSave = {
      logs,
      habits
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [logs, habits]);

  const updateUserProfile = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('habitFlowUserProfile', JSON.stringify(profile));
  }, []);

  const updateCloudConfig = useCallback((sheetUrl: string, appUrl: string) => {
    setGoogleSheetUrl(sheetUrl);
    setWebAppUrl(appUrl);
    localStorage.setItem('habitFlowSheetUrl', sheetUrl);
    localStorage.setItem('habitFlowAppUrl', appUrl);
  }, []);

  const triggerInstall = useCallback(() => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setInstallPrompt(null);
      });
    }
  }, [installPrompt]);

  // Stable Sync Function
  const googleSheetSync = useCallback(async () => {
    const url = webAppUrlRef.current;
    if (!url) {
      alert("Please configure Web App URL in Settings > Admin Access");
      return;
    }

    // Prevent overlapping syncs
    if (isSyncingRef.current) return;
    
    setIsSyncing(true);
    isSyncingRef.current = true;

    const userId = generateUserId();
    const profile = userProfileRef.current;
    const currentHabits = habitsRef.current;

    const data: any = {
      userId,
      userName: profile.name || 'Anonymous',
      userEmail: profile.email || 'No Email',
      date: getTodayDateKey(),
    };
    
    Object.keys(currentHabits).forEach(key => {
        data[key] = currentHabits[key].count;
        data[`${key}Goal`] = currentHabits[key].goal;
    });

    try {
        // Using no-cors for Google Apps Script
        await fetch(`${url}?timestamp=${new Date().getTime()}`, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(data),
            mode: 'no-cors'
        });
        // Minimum spinner time for UI feedback if manually triggered
        await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (e) {
        console.error("Sync failed", e);
    } finally {
        setIsSyncing(false);
        isSyncingRef.current = false;
    }
  }, []); 

  // AUTO-SYNC WATCHER
  useEffect(() => {
    // Skip if no habits (initial load) or no URL configured
    if (Object.keys(habits).length === 0 || !webAppUrl) return;

    // Debounce: Wait 2 seconds after the LAST change before syncing
    const timeoutId = setTimeout(() => {
        googleSheetSync();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [habits, googleSheetSync, webAppUrl]);

  const updateLog = useCallback((habitId: string, newCount: number) => {
    setLogs(prev => {
      const today = getTodayDateKey();
      const todayLog = prev[today] || { habits: {} };
      const currentHabit = habits[habitId];
      if (!currentHabit) return prev;

      return {
        ...prev,
        [today]: {
          ...todayLog,
          habits: {
            ...todayLog.habits,
            [habitId]: { count: newCount, goal: currentHabit.goal }
          }
        }
      };
    });
  }, [habits]);

  const trackHabit = useCallback((id: string) => {
    triggerHaptic();
    const habit = habits[id];
    if (!habit) return;
    const newCount = habit.count + habit.step;
    updateLog(id, newCount);
  }, [habits, updateLog]);

  const untrackHabit = useCallback((id: string) => {
    triggerHaptic();
    const habit = habits[id];
    if (!habit) return;
    const newCount = Math.max(0, habit.count - habit.step);
    updateLog(id, newCount);
  }, [habits, updateLog]);

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    setHabits(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates }
    }));
  }, []);

  const addHabit = useCallback((habit: Habit) => {
    setHabits(prev => ({
      ...prev,
      [habit.id]: habit
    }));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const resetToday = useCallback(() => {
    const today = getTodayDateKey();
    
    setLogs(prev => {
      const next = { ...prev };
      if (next[today]) {
        delete next[today];
      }
      return next;
    });

    setHabits(prev => {
      const next = { ...prev };
      let changed = false;
      Object.keys(next).forEach(key => {
        if (next[key].count !== 0) {
          next[key] = { ...next[key], count: 0 };
          changed = true;
        }
      });
      return changed ? next : prev;
    });
    
    triggerHaptic();
  }, []);

  const clearAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('habitFlowUserProfile');
    localStorage.removeItem('habitFlowSheetUrl');
    localStorage.removeItem('habitFlowAppUrl');
    
    setLogs({});
    setHabits(DEFAULT_HABITS);
    setUserProfile({ name: '', email: '' });
    setIsAdmin(false);
    setGoogleSheetUrl('');
    setWebAppUrl('');
    
    triggerHaptic();
    window.location.reload();
  }, []);

  const toggleAdmin = useCallback((password: string) => {
    // If already admin, just toggle off
    if (isAdmin) {
        setIsAdmin(false);
        return false;
    }

    // Verify password against hardcoded (but encoded) hash
    // This ensures ONLY 'maliha638' works, regardless of who uses the app
    if (checkPassword(password, ADMIN_HASH)) {
      setIsAdmin(true);
      return true;
    }
    
    return false;
  }, [isAdmin]);

  const exportData = useCallback(() => {
    const habitKeys = Object.keys(habits);
    let csv = 'Date,' + habitKeys.map(k => habits[k].name).join(',') + '\n';
    
    Object.keys(logs).sort().forEach(dateKey => {
      const row = [dateKey];
      habitKeys.forEach(key => {
        const val = logs[dateKey].habits[key]?.count || 0;
        row.push(val.toString());
      });
      csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'habit_data.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [logs, habits]);

  return (
    <HabitContext.Provider value={{
      habits,
      logs,
      userProfile,
      updateUserProfile,
      trackHabit,
      untrackHabit,
      updateHabit,
      addHabit,
      deleteHabit,
      resetToday,
      clearAllData,
      exportData,
      isAdmin,
      toggleAdmin,
      googleSheetSync,
      isSyncing,
      googleSheetUrl,
      webAppUrl,
      updateCloudConfig,
      installPrompt,
      triggerInstall
    }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) throw new Error("useHabits must be used within a HabitProvider");
  return context;
};