

import React, { useState, useEffect } from 'react';
import { useHabits } from '../context/HabitContext';
import { ThemeContextType, Habit } from '../types';
import { ShieldCheck, Download, RefreshCw, Trash2, ExternalLink, Palette, ChevronRight, LogOut, Plus, X, MinusCircle, User, Check, UploadCloud, Loader, Lock, Save, CheckCircle2, FileCode, Smartphone } from 'lucide-react';
import { iconMap, colorMap } from '../components/HabitCard';
import { generateUserId } from '../utils/helpers';
import { ADMIN_EMAIL } from '../constants';

interface SettingsProps {
    themeContext: ThemeContextType;
}

type ModalType = 'DELETE_HABIT' | 'RESET_TODAY' | 'DELETE_ALL' | 'LOGOUT' | null;

const SettingsScreen: React.FC<SettingsProps> = ({ themeContext }) => {
  const { habits, updateHabit, isAdmin, toggleAdmin, resetToday, clearAllData, exportData, addHabit, deleteHabit, userProfile, updateUserProfile, googleSheetSync, isSyncing, googleSheetUrl, webAppUrl, updateCloudConfig, installPrompt, triggerInstall } = useHabits();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const userId = generateUserId();
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  
  // Config Local State
  const [configSheetUrl, setConfigSheetUrl] = useState(googleSheetUrl);
  const [configAppUrl, setConfigAppUrl] = useState(webAppUrl);
  
  // Update local config state when global state changes
  useEffect(() => {
      setConfigSheetUrl(googleSheetUrl);
      setConfigAppUrl(webAppUrl);
  }, [googleSheetUrl, webAppUrl]);

  // Add Habit State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({
      name: '',
      goal: 1,
      unit: 'times',
      iconName: 'star',
      color: 'indigo'
  });

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
      isOpen: boolean;
      type: ModalType;
      title: string;
      message: string;
      habitId?: string; // Optional, only for DELETE_HABIT
  }>({ isOpen: false, type: null, title: '', message: '' });

  const handleAdminAction = (e: React.FormEvent) => {
      e.preventDefault();
      if (!passwordInput.trim()) return;

      if (toggleAdmin(passwordInput)) {
          setShowAdminLogin(false);
          setPasswordInput('');
      } else {
          alert("Incorrect Password");
      }
  };

  const handleSaveConfig = () => {
      updateCloudConfig(configSheetUrl, configAppUrl);
  };

  const handleCreateHabit = () => {
      if (!newHabit.name.trim()) return;
      
      const id = newHabit.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4);
      
      addHabit({
          id,
          name: newHabit.name,
          count: 0,
          goal: Number(newHabit.goal) || 1,
          unit: newHabit.unit,
          iconName: newHabit.iconName,
          color: newHabit.color,
          step: 1
      });
      
      setIsAddModalOpen(false);
      setNewHabit({ name: '', goal: 1, unit: 'times', iconName: 'star', color: 'indigo' });
  };

  const openDeleteHabitModal = (habit: Habit) => {
      setConfirmModal({
          isOpen: true,
          type: 'DELETE_HABIT',
          title: 'Delete Habit?',
          message: `Are you sure you want to remove "${habit.name}"? This action cannot be undone.`,
          habitId: habit.id
      });
  };

  const openResetTodayModal = () => {
      setConfirmModal({
          isOpen: true,
          type: 'RESET_TODAY',
          title: 'Reset Today?',
          message: 'This will clear all progress for the current day. Are you sure?',
      });
  };

  const openDeleteAllModal = () => {
      setConfirmModal({
          isOpen: true,
          type: 'DELETE_ALL',
          title: 'Delete All Data?',
          message: 'This will permanently delete all your habits, history, and profile. The app will reset to default.',
      });
  };

  const openLogoutModal = () => {
      setConfirmModal({
          isOpen: true,
          type: 'LOGOUT',
          title: 'Log Out?',
          message: 'You will be returned to the welcome screen. Your habit data will remain safe on this device.',
      });
  };

  const handleConfirmAction = () => {
      if (confirmModal.type === 'DELETE_HABIT' && confirmModal.habitId) {
          deleteHabit(confirmModal.habitId);
      } else if (confirmModal.type === 'RESET_TODAY') {
          resetToday();
      } else if (confirmModal.type === 'DELETE_ALL') {
          clearAllData();
      } else if (confirmModal.type === 'LOGOUT') {
          updateUserProfile({ name: '', email: '' });
      }
      setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const SectionHeader = ({ title }: { title: string }) => (
      <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 mt-6">{title}</h3>
  );

  const ListItem = ({ icon: Icon, label, children, onClick, destructive, colorClass, spinIcon }: any) => (
    <div 
        onClick={onClick}
        className={`group flex items-center justify-between p-4 bg-white dark:bg-[#1c1c1e] active:bg-gray-50 dark:active:bg-[#2c2c2e] transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-0 ${onClick ? 'cursor-pointer' : ''}`}
    >
        <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-md ${colorClass || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                <Icon className={`w-5 h-5 ${spinIcon ? 'animate-spin' : ''}`} />
            </div>
            <span className={`font-medium ${destructive ? 'text-red-600 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}>{label}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
            {children}
        </div>
    </div>
  );

  const isConfigSaved = googleSheetUrl && webAppUrl && googleSheetUrl === configSheetUrl && webAppUrl === configAppUrl;

  return (
    <div className="animate-fade-in pb-10 relative">
      <div className="px-1 mb-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h2>
      </div>

      {/* User Profile Section */}
      <div className="mx-4 mt-2 mb-6 p-4 bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4">
          <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 flex-shrink-0">
                  {userProfile.name ? (
                      <span className="text-xl font-bold">{userProfile.name.charAt(0).toUpperCase()}</span>
                  ) : (
                      <User className="w-7 h-7" />
                  )}
              </div>
              <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight truncate">
                      {userProfile.name || 'Guest User'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      {userProfile.email || 'No email linked'}
                  </p>
                  <p className="text-[9px] font-mono text-gray-400 mt-1 select-all bg-gray-100 dark:bg-black/50 inline-block px-1.5 py-0.5 rounded">
                      ID: {userId}
                  </p>
              </div>
          </div>
          
          <div className="space-y-3">
            <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Display Name</label>
                <input 
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => updateUserProfile({ ...userProfile, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-sm font-medium dark:text-white placeholder:text-gray-400"
                />
            </div>
            <div>
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Email Address</label>
                <input 
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => updateUserProfile({ ...userProfile, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-sm font-medium dark:text-white placeholder:text-gray-400"
                />
            </div>
          </div>
      </div>

      {/* App Info & Install */}
      {(installPrompt || isIOS) && (
        <>
          <SectionHeader title="Application" />
          <div className="rounded-xl overflow-hidden shadow-sm bg-white dark:bg-[#1c1c1e]">
            {installPrompt ? (
                <ListItem 
                    icon={Smartphone} 
                    label="Install App" 
                    onClick={triggerInstall}
                    colorClass="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                >
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 mr-2 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">Get App</span>
                    <ChevronRight className="w-4 h-4" />
                </ListItem>
            ) : isIOS ? (
                <div className="p-4 bg-white dark:bg-[#1c1c1e] flex gap-3 items-start">
                    <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                        <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Install on iPhone</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Tap the <span className="font-bold">Share</span> button below, then scroll down and select <span className="font-bold">"Add to Home Screen"</span>.
                        </p>
                    </div>
                </div>
            ) : null}
          </div>
        </>
      )}

      {/* Appearance */}
      <SectionHeader title="Appearance" />
      <div className="rounded-xl overflow-hidden shadow-sm bg-white dark:bg-[#1c1c1e]">
        <ListItem 
            icon={Palette} 
            label="Dark Mode" 
            colorClass="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
        >
            <button 
            onClick={themeContext.toggleTheme}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${themeContext.theme === 'dark' ? 'bg-green-500' : 'bg-gray-200'}`}
            >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${themeContext.theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
        </ListItem>
      </div>

      {/* Goals */}
      <SectionHeader title="Habit Goals" />
      <div className="rounded-xl overflow-hidden shadow-sm bg-white dark:bg-[#1c1c1e] divide-y divide-gray-100 dark:divide-gray-800">
        {Object.values(habits).map((habit: Habit) => (
            <div key={habit.id} className="flex items-center justify-between p-4 bg-white dark:bg-[#1c1c1e]">
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                     <button 
                        onClick={() => openDeleteHabitModal(habit)}
                        className="p-2 -ml-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-full active:bg-gray-100 dark:active:bg-gray-800 flex-shrink-0"
                     >
                        <MinusCircle className="w-5 h-5" />
                     </button>
                     <div className={`w-1.5 h-8 rounded-full bg-${habit.color}-500 flex-shrink-0`}></div>
                     
                     <div className="flex flex-col justify-center min-w-0 mr-2 flex-1">
                        <p className="font-medium text-gray-900 dark:text-white truncate text-sm leading-tight">{habit.name}</p>
                        <div className="flex items-center mt-0.5">
                            <span className="text-[10px] text-gray-400 uppercase font-bold mr-1">Unit:</span>
                            <input
                                type="text"
                                value={habit.unit}
                                onChange={(e) => updateHabit(habit.id, { unit: e.target.value })}
                                className="bg-transparent border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 focus:border-indigo-500 focus:text-indigo-600 dark:focus:text-indigo-400 outline-none w-16 transition-colors py-0.5"
                            />
                        </div>
                     </div>
                </div>

                {/* Goal Input */}
                <div className="flex flex-col items-center gap-1 ml-2 flex-shrink-0">
                    <span className="text-[8px] font-bold text-gray-400 uppercase">Goal</span>
                    <div className="flex items-center bg-gray-100 dark:bg-black rounded-lg p-1">
                        <input 
                            type="number" 
                            inputMode="numeric"
                            pattern="[0-9]*"
                            min="1"
                            value={habit.goal}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val) && val > 0) {
                                    updateHabit(habit.id, { goal: val });
                                }
                            }}
                            className="w-12 text-center bg-transparent font-mono font-bold text-gray-900 dark:text-white focus:outline-none text-sm"
                        />
                    </div>
                </div>
            </div>
        ))}
        {/* Add Button */}
        <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full p-4 flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors active:scale-[0.99]"
        >
            <Plus className="w-5 h-5" />
            Add New Habit
        </button>
      </div>

      {/* Data */}
      <SectionHeader title="Data Management" />
      <div className="rounded-xl overflow-hidden shadow-sm bg-white dark:bg-[#1c1c1e] divide-y divide-gray-100 dark:divide-gray-800">
         <ListItem 
            icon={RefreshCw} 
            label="Reset Today's Data" 
            onClick={openResetTodayModal}
            colorClass="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500"
         >
             <ChevronRight className="w-4 h-4" />
         </ListItem>
         <ListItem 
            icon={Download} 
            label="Export CSV" 
            onClick={exportData}
            colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500"
         >
            <ChevronRight className="w-4 h-4" />
         </ListItem>

         <ListItem 
            icon={Trash2} 
            label="Delete All Data" 
            destructive 
            onClick={openDeleteAllModal}
            colorClass="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500"
         >
             <ChevronRight className="w-4 h-4" />
         </ListItem>
      </div>

      {/* Admin */}
      <SectionHeader title="Sync & Cloud" />
      <div className="rounded-xl overflow-hidden shadow-sm bg-white dark:bg-[#1c1c1e] divide-y divide-gray-100 dark:divide-gray-800">
        <ListItem 
            icon={isSyncing ? Loader : UploadCloud} 
            spinIcon={isSyncing}
            label={isSyncing ? "Syncing..." : (webAppUrl ? "Sync Now" : "Sync Disabled")}
            onClick={() => {
                if (isSyncing) return;
                if (!webAppUrl) {
                    alert("Please unlock Admin settings and configure the Web App URL first.");
                    return;
                }
                googleSheetSync();
            }}
            colorClass="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-500"
        >
            {webAppUrl ? <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div> : null}
            <ChevronRight className="w-4 h-4" />
        </ListItem>

        {!isAdmin ? (
            showAdminLogin ? (
                 <form onSubmit={handleAdminAction} className="p-3 sm:p-4 flex flex-col gap-2 bg-gray-50 dark:bg-black/50 animate-fade-in">
                    <div className="flex justify-between items-center px-1">
                        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            Admin Access
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">{ADMIN_EMAIL}</p>
                    </div>
                    
                    <div className="flex gap-2 items-center">
                        <input 
                            type="password" 
                            placeholder="Password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-white dark:bg-[#2c2c2e] dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            autoFocus
                        />
                        <button type="submit" className="px-3 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 whitespace-nowrap text-sm flex-shrink-0">
                            Unlock
                        </button>
                    </div>
                </form>
            ) : (
                <ListItem 
                    icon={ShieldCheck} 
                    label="Admin Access" 
                    onClick={() => setShowAdminLogin(true)}
                    colorClass="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                    <span className="text-xs text-gray-400 mr-2">Locked</span>
                    <ChevronRight className="w-4 h-4" />
                </ListItem>
            )
        ) : (
            <div className="p-4 bg-gray-50 dark:bg-black/20 animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                        <Lock className="w-4 h-4 text-indigo-500" />
                        Admin Configuration
                    </h4>
                     <button onClick={() => toggleAdmin('')} className="text-xs text-red-500 font-medium px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded">
                        Lock
                     </button>
                </div>
                
                <div className="space-y-4">
                    {/* Google Sheet URL Input */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Google Sheet URL</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={configSheetUrl}
                                onChange={(e) => setConfigSheetUrl(e.target.value)}
                                placeholder="https://docs.google.com/spreadsheets..."
                                className="flex-1 min-w-0 p-2 rounded-lg bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-gray-700 text-xs dark:text-white"
                            />
                            {configSheetUrl && (
                                <button 
                                    onClick={() => window.open(configSheetUrl, '_blank')}
                                    className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg flex-shrink-0"
                                    title="Open Sheet"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Web App URL Input */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Apps Script Web App URL</label>
                        <input 
                            type="text" 
                            value={configAppUrl}
                            onChange={(e) => setConfigAppUrl(e.target.value)}
                            placeholder="https://script.google.com/macros/s/..."
                            className="w-full p-2 rounded-lg bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-gray-700 text-xs dark:text-white mb-2"
                        />
                         <div className="flex items-start gap-1.5 mt-1 bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg">
                            <FileCode className="w-3 h-3 text-indigo-500 mt-0.5 flex-shrink-0" />
                            <p className="text-[10px] text-indigo-600 dark:text-indigo-300 leading-tight">
                                <strong>Tip:</strong> Need the code? Copy content from <code>backend_script.js</code> in your file list into your Google Apps Script editor.
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={handleSaveConfig}
                        className={`w-full py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${isConfigSaved ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                    >
                        {isConfigSaved ? (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Saved & Secure
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Configuration Locally
                            </>
                        )}
                    </button>
                    
                    <div className="text-[10px] text-gray-400 italic mt-2 border-t border-gray-200 dark:border-gray-700 pt-3">
                        <p className="mb-1"><span className="font-bold text-indigo-500">Note:</span> Your URLs are saved securely to your phone's internal storage.</p>
                        <p>You do <u>not</u> need to enter them again. Even if someone reads the source code, they cannot see these URLs because they are not in the code.</p>
                    </div>
                </div>
            </div>
        )}
      </div>
      
      {/* Account Actions (Logout) */}
      <SectionHeader title="Account" />
      <div className="mx-4 mb-12">
          <button 
            onClick={openLogoutModal}
            className="w-full py-3.5 rounded-xl bg-white dark:bg-[#1c1c1e] border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-500 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
          <p className="text-[10px] text-center text-gray-400 mt-4 pb-4">
             HabitFlow v1.0.2 &bull; Build 2025.11
          </p>
      </div>

      {/* ADD HABIT MODAL */}
      {isAddModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 sm:p-0">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsAddModalOpen(false)} />
              
              <div className="relative w-full max-w-sm bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-2xl overflow-hidden animate-slide-up m-auto">
                  <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">New Habit</h3>
                      <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <div className="p-5 space-y-5">
                      {/* Name */}
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Name</label>
                          <input 
                              type="text" 
                              placeholder="e.g. Read Books"
                              value={newHabit.name}
                              onChange={e => setNewHabit({...newHabit, name: e.target.value})}
                              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none dark:text-white"
                          />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Goal */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Daily Goal</label>
                            <input 
                                type="number" 
                                value={newHabit.goal}
                                onChange={e => setNewHabit({...newHabit, goal: parseInt(e.target.value) || 1})}
                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                            />
                        </div>
                         {/* Unit */}
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Unit</label>
                            <input 
                                type="text" 
                                placeholder="mins, times"
                                value={newHabit.unit}
                                onChange={e => setNewHabit({...newHabit, unit: e.target.value})}
                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                            />
                        </div>
                      </div>

                      {/* Colors */}
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Color</label>
                          <div className="flex flex-wrap gap-3">
                              {Object.keys(colorMap).map(color => (
                                  <button
                                    key={color}
                                    onClick={() => setNewHabit({...newHabit, color})}
                                    className={`w-8 h-8 rounded-full transition-transform ${colorMap[color].preview} ${newHabit.color === color ? 'ring-4 ring-offset-2 ring-gray-200 dark:ring-gray-700 scale-110' : 'opacity-70 hover:opacity-100'}`}
                                  />
                              ))}
                          </div>
                      </div>

                      {/* Icons */}
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Icon</label>
                          <div className="grid grid-cols-6 gap-2">
                              {Object.keys(iconMap).slice(0, 12).map(iconName => {
                                  const Icon = iconMap[iconName];
                                  return (
                                      <button
                                        key={iconName}
                                        onClick={() => setNewHabit({...newHabit, iconName})}
                                        className={`p-2 rounded-lg flex items-center justify-center transition-all ${newHabit.iconName === iconName ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' : 'bg-gray-50 dark:bg-black/50 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                      >
                                          <Icon className="w-5 h-5" />
                                      </button>
                                  );
                              })}
                          </div>
                      </div>

                      <button 
                        onClick={handleCreateHabit}
                        disabled={!newHabit.name.trim()}
                        className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                      >
                          Create Habit
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setConfirmModal({...confirmModal, isOpen: false})} />
            <div className="relative w-full max-w-xs bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-2xl p-6 animate-scale-press text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    {confirmModal.type === 'LOGOUT' ? <LogOut className="w-6 h-6" /> : <Trash2 className="w-6 h-6" />}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{confirmModal.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    {confirmModal.message}
                </p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setConfirmModal({...confirmModal, isOpen: false})}
                        className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirmAction}
                        className={`flex-1 py-2.5 rounded-xl font-semibold shadow-lg text-white ${confirmModal.type === 'LOGOUT' ? 'bg-gray-900 dark:bg-gray-700' : 'bg-red-600 shadow-red-600/30'}`}
                    >
                        {confirmModal.type === 'LOGOUT' ? 'Log Out' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default SettingsScreen;
