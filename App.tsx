
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import ErrorBoundary from './components/ErrorBoundary';
import { AppView, UserProfile, Organization } from './types';
import { auth, onAuthStateChanged, syncUserAndOrg, signOut } from './services/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [orgProfile, setOrgProfile] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (currentUser) => {
      setLoading(true);
      
      if (currentUser) {
        // Verification Gate
        if (!currentUser.emailVerified && currentUser.providerData[0]?.providerId === 'password') {
          await signOut();
          setUserProfile(null);
          setOrgProfile(null);
          setView('landing');
          setLoading(false);
          alert("Please verify your email address to access the terminal.");
          return;
        }

        try {
          // CORE: Self-Healing Sync
          const { userProfile, orgProfile } = await syncUserAndOrg(currentUser);
          
          setUserProfile(userProfile);
          setOrgProfile(orgProfile);

          // Routing Logic
          if (!userProfile.country || !userProfile.taxID) {
            setView('onboarding');
          } else {
            setView('dashboard');
          }

        } catch (error) {
          console.error("Initialization Failed:", error);
          // Fallback to landing if sync explodes
          setUserProfile(null);
          setOrgProfile(null);
          setView('landing');
        }
      } else {
        setUserProfile(null);
        setOrgProfile(null);
        setView('landing');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut();
    setUserProfile(null);
    setOrgProfile(null);
    setView('landing');
  };

  const handleOnboardingComplete = (data: any) => {
    if (userProfile) setUserProfile({ ...userProfile, ...data });
    setView('dashboard');
  };

  const handleProfileUpdate = (updates: Partial<UserProfile>) => {
    if (userProfile) setUserProfile({ ...userProfile, ...updates });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Initializing Secure Node...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
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
            userProfile={userProfile}
            orgProfile={orgProfile} // Pass Org Data
            onProfileUpdate={handleProfileUpdate}
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
    </ErrorBoundary>
  );
};

export default App;
