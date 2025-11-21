
export interface Habit {
  id: string;
  name: string;
  count: number;
  goal: number;
  unit: string;
  iconName: string;
  step: number;
  color: string;
}

export interface DailyLog {
  habits: Record<string, { count: number; goal: number }>;
}

export type Logs = Record<string, DailyLog>;

export type ScreenType = 'today' | 'history' | 'weekly' | 'stats' | 'settings';

export interface UserProfile {
  name: string;
  email: string;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface HabitContextType {
  habits: Record<string, Habit>;
  logs: Logs;
  userProfile: UserProfile;
  updateUserProfile: (profile: UserProfile) => void;
  trackHabit: (id: string) => void;
  untrackHabit: (id: string) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  addHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  resetToday: () => void;
  clearAllData: () => void;
  exportData: () => void;
  isAdmin: boolean;
  toggleAdmin: (password: string) => boolean;
  googleSheetSync: () => Promise<void>;
  isSyncing: boolean;
  
  // New Cloud Config
  googleSheetUrl: string;
  webAppUrl: string;
  updateCloudConfig: (sheetUrl: string, appUrl: string) => void;

  // Install Prompt
  installPrompt: any;
  triggerInstall: () => void;
}