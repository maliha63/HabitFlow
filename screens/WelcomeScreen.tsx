import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { User, Mail, ArrowRight } from 'lucide-react';

const WelcomeScreen: React.FC = () => {
    const { updateUserProfile } = useHabits();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleStart = () => {
        if (!name.trim() || !email.trim()) {
            setError('Please fill in all fields to continue.');
            return;
        }
        // Basic email validation
        if (!email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }

        updateUserProfile({ name: name.trim(), email: email.trim() });
    };

    return (
        <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-black text-white p-6 relative overflow-y-auto supports-[min-height:100dvh]:min-h-[100dvh]">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[100px] animate-pulse-slow fixed" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px] animate-pulse-slow fixed" />

            <div className="w-full max-w-sm z-10 animate-slide-up space-y-8 my-auto">
                
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome to HabitFlow</h1>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Track your goals, visualize progress, and build better habits. Let's get to know you first.
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-4 bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
                    
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Your Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-500" />
                            </div>
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/50 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-gray-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-500" />
                            </div>
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/50 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-gray-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-400 text-xs text-center font-medium pt-2 animate-bounce-short">{error}</p>
                    )}

                    <button 
                        onClick={handleStart}
                        className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform hover:shadow-indigo-600/50"
                    >
                        Start Tracking
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
                
                <p className="text-center text-[10px] text-gray-500 max-w-[250px] mx-auto">
                    By continuing, you agree that your name and email will be used to sync your habit data securely.
                </p>
            </div>
        </div>
    );
};

export default WelcomeScreen;
