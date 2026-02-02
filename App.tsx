
import React, { useState, useEffect } from 'react';
import { AppView, User } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CareerNavigator from './components/CareerNavigator';
import Community from './components/Community';
import Portfolio from './components/Portfolio';
import Chatbot from './components/Chatbot';
import VoiceAssistant from './components/VoiceAssistant';
import { AppProvider, useAppContext } from './context/AppContext';

const AppContent: React.FC = () => {
  const { user, setUser } = useAppContext();
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('student_hub_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setCurrentView(AppView.DASHBOARD);
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('student_hub_user', JSON.stringify(newUser));
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('student_hub_user');
    setCurrentView(AppView.LOGIN);
  };

  if (currentView === AppView.LOGIN || !user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        onLogout={handleLogout} 
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header user={user} setView={setCurrentView} onToggleVoice={() => setIsVoiceActive(!isVoiceActive)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
          {currentView === AppView.DASHBOARD && <Dashboard user={user} />}
          {currentView === AppView.NAVIGATOR && <CareerNavigator />}
          {currentView === AppView.COMMUNITY && <Community />}
          {currentView === AppView.PORTFOLIO && <Portfolio />}
        </main>
      </div>

      <Chatbot />
      {isVoiceActive && <VoiceAssistant onClose={() => setIsVoiceActive(false)} />}
    </div>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;
