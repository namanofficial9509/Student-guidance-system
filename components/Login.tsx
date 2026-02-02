
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleMockLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Firebase logic
    onLogin({
      id: 'mock-user-1',
      name: email.split('@')[0].toUpperCase(),
      email: email,
      avatar: 'https://picsum.photos/seed/student/200'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-400 p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex max-w-4xl w-full">
        <div className="hidden md:block w-1/2 relative">
          <img 
            src="https://picsum.photos/seed/campus/800/1200" 
            alt="Campus" 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/40 flex flex-col justify-end p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Student Hub AI</h1>
            <p className="opacity-90">Your intelligent gateway to academic excellence and career mastery.</p>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-blue-50 rounded-2xl mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleMockLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between">
            <hr className="flex-1 border-slate-100" />
            <span className="px-4 text-xs text-slate-400 font-medium uppercase tracking-wider">Social Login</span>
            <hr className="flex-1 border-slate-100" />
          </div>

          <div className="mt-6 flex space-x-4">
            <button className="flex-1 flex items-center justify-center py-2 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5 mr-2" alt="Google" />
              <span className="text-sm font-medium text-slate-700">Google</span>
            </button>
            <button className="flex-1 flex items-center justify-center py-2 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <img src="https://www.svgrepo.com/show/330541/github.svg" className="w-5 h-5 mr-2" alt="GitHub" />
              <span className="text-sm font-medium text-slate-700">GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
