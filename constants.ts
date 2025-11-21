
import { Habit } from './types';

export const STORAGE_KEY = 'habitFlowState_v1';

// SECURITY UPDATE:
// We do NOT store the Google Sheet URL here anymore.
// You will enter it inside the app's Settings > Admin panel.

// This is the Base64 encoded version of "maliha638"
// This prevents casual readers from seeing the password immediately in the code.
export const ADMIN_HASH = "bWFsaWhhNjM4"; 

// Admin Email (for display purposes)
export const ADMIN_EMAIL = "malihathedev@gmail.com"; 

export const DEFAULT_HABITS: Record<string, Habit> = {
  water: { id: 'water', name: 'Water', count: 0, goal: 8, unit: 'glasses', iconName: 'glass-water', step: 1, color: 'sky' },
  sleep: { id: 'sleep', name: 'Sleep', count: 0, goal: 8, unit: 'hours', iconName: 'moon', step: 0.5, color: 'indigo' },
  meditation: { id: 'meditation', name: 'Meditation', count: 0, goal: 10, unit: 'minutes', iconName: 'brain-cog', step: 5, color: 'purple' },
  workout: { id: 'workout', name: 'Workout', count: 0, goal: 1, unit: 'sessions', iconName: 'dumbbell', step: 1, color: 'amber' },
};
