
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import { AppView, CompanyProfile } from './types';
import { auth, onAuthStateChanged, User, signOut } from './services/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, LogOut, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [company, setCompany] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser && currentUser.emailVerified) {
        // Check if onboarding is complete from local storage for now
        // In a real app, this would be a Firestore check
        const storedCompany = localStorage.getItem(`rateguard_company_${currentUser.uid}`);
        if (storedCompany) {
          setCompany(JSON.parse(storedCompany));
          setView('dashboard');
        } else {
          setView('onboarding');
        }
      } else {
        setView('landing');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setView('landing');
  };

  const reloadUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });
      if (auth.currentUser.emailVerified) {
        const storedCompany = localStorage.getItem(`rateguard_company_${auth.currentUser.uid}`);
        if (storedCompany) {
          setView('dashboard');
        } else {
          setView('onboarding');
        }
      }
    }
  };

  const handleOnboardingComplete = (data: any) => {
    if (user) {
      localStorage.setItem(`rateguard_company_${user.uid}`, JSON.stringify(data));
      setCompany(data);
      setView('dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Verification Gate
  if (user && !user.emailVerified) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#121826] border border-zinc-800 p-10 rounded-[2.5rem] shadow-2xl text-center space-y-8"
        >
          <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto text-blue-500">
            <Mail size={40} />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Confirm Intelligence</h2>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
              An activation link was sent to <span className="text-white font-bold">{user.email}</span>. Please verify your identity to access the terminal.
            </p>
          </div>
          <div className="space-y-4">
            <button 
              onClick={reloadUser}
              className="w-full py-4 bg-white text-[#07090e] font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl hover:bg-zinc-200 flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} /> I've Verified
            </button>
            <button 
              onClick={handleLogout}
              className="w-full py-4 bg-zinc-900 text-zinc-500 font-black uppercase text-xs tracking-widest rounded-2xl transition-all border border-zinc-800 flex items-center justify-center gap-2"
            >
              <LogOut size={18} /> Use Another Account
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e]">
      {view === 'landing' && (
        <LandingPage onEnter={() => setShowAuth(true)} />
      )}

      {view === 'onboarding' && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}

      {view !== 'landing' && view !== 'onboarding' && (
        <Dashboard 
          currentView={view} 
          onViewChange={setView} 
          onLogout={handleLogout} 
        />
      )}

      <AnimatePresence>
        {showAuth && (
          <Auth 
            onClose={() => setShowAuth(false)} 
            onSuccess={() => setShowAuth(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
