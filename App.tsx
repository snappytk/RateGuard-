
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import { AppView } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mock persistence
  useEffect(() => {
    const savedAuth = localStorage.getItem('ff_auth');
    if (savedAuth === 'true') {
      setIsLoggedIn(true);
      setView('dashboard');
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setView('dashboard');
    localStorage.setItem('ff_auth', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView('landing');
    localStorage.removeItem('ff_auth');
  };

  if (!isLoggedIn && view === 'landing') {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <Dashboard 
      currentView={view} 
      onViewChange={setView} 
      onLogout={handleLogout} 
    />
  );
};

export default App;
