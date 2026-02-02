
import React, { useState } from 'react';
import { User, AppView } from '../types';
import { useAppContext } from '../context/AppContext';

interface HeaderProps {
  user: User;
  setView: (view: AppView) => void;
  onToggleVoice: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, setView, onToggleVoice }) => {
  const { notifications } = useAppContext();
  const unreadCount = notifications.filter(n => !n.read).length;
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center space-x-4">
        <button className="lg:hidden text-slate-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 border border-slate-200 w-96">
          <svg className="w-5 h-5 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search internships, courses, roadmap..." className="bg-transparent border-none focus:outline-none text-sm w-full" />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotif(!showNotif)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>
          
          {showNotif && (
            <div className="absolute top-12 right-0 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <span className="font-bold text-slate-800">Notifications</span>
                <span className="text-[10px] font-bold text-blue-600 uppercase">Clear All</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 cursor-pointer ${!n.read ? 'bg-blue-50/30' : ''}`}>
                    <h5 className="text-xs font-bold text-slate-800">{n.title}</h5>
                    <p className="text-[11px] text-slate-500 mt-1">{n.message}</p>
                    <span className="text-[9px] text-slate-400 mt-2 block">{n.timestamp}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 text-center text-xs font-bold text-slate-500 hover:bg-slate-50">View All</button>
            </div>
          )}
        </div>

        <button 
          onClick={onToggleVoice}
          className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors border border-blue-200 group"
        >
          <div className="relative">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
             <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
             </span>
          </div>
          <span className="text-sm font-semibold hidden sm:inline">Talk to Mentor</span>
        </button>

        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setView(AppView.PORTFOLIO)}>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-none">{user.name}</p>
            <p className="text-xs text-slate-500 leading-none mt-1">Free Tier</p>
          </div>
          <img 
            src={user.avatar} 
            alt="Profile" 
            className="w-10 h-10 rounded-full border-2 border-slate-200 group-hover:border-blue-400 transition-colors"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
