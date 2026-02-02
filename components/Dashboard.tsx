
import React from 'react';
import { User, PlannerItem, GapMetric } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Tooltip, Radar } from 'recharts';
import { useAppContext } from '../context/AppContext';

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const { portfolio, planner, setPlanner } = useAppContext();

  const mockGapData: GapMetric[] = portfolio.skills.map((skill, i) => ({
    skill,
    current: 40 + (i * 10) % 60,
    target: 90
  }));

  const toggleTask = (id: string) => {
    setPlanner(planner.map(p => p.id === id ? { ...p, completed: !p.completed } : p));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Hello, {user.name}! 👋</h1>
          <p className="text-slate-500">Your profile is {portfolio.projects.length > 2 ? 'looking strong' : 'ready for more projects'}.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          <button className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-600 rounded-lg">Overview</button>
          <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-lg">Stats</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl">
          <h3 className="text-lg font-semibold opacity-80">Skills Maturity</h3>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-4xl font-bold">{Math.round((portfolio.skills.length / 15) * 100)}%</span>
            <span className="text-sm bg-white/20 px-2 py-1 rounded-md">{portfolio.skills.length} Tech Skills</span>
          </div>
          <div className="mt-6 w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div className="bg-white h-full" style={{ width: `${(portfolio.skills.length / 15) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Portfolio Status</h3>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-4xl font-bold text-slate-800">{portfolio.projects.length}</span>
            <span className="text-sm text-blue-600 font-medium">Projects Built</span>
          </div>
          <p className="mt-6 text-sm text-slate-500 italic">"Your work speaks for itself."</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Tasks Pending</h3>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-4xl font-bold text-orange-600">{planner.filter(p => !p.completed).length}</span>
            <div className="flex -space-x-2">
               <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold border-2 border-white">!</div>
            </div>
          </div>
          <p className="mt-6 text-sm text-slate-500">Next: {planner.find(p => !p.completed)?.title || 'All caught up!'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Learner Planner</h2>
            <button className="text-blue-600 text-sm font-semibold hover:underline">+ Quick Task</button>
          </div>
          <div className="space-y-4">
            {planner.map((item) => (
              <div 
                key={item.id} 
                onClick={() => toggleTask(item.id)}
                className="flex items-center p-4 rounded-2xl bg-slate-50 border border-slate-100 group cursor-pointer hover:border-blue-200 transition-colors"
              >
                <div className={`w-5 h-5 rounded border transition-colors flex items-center justify-center ${item.completed ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                  {item.completed && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <div className="ml-4 flex-1">
                  <h4 className={`text-sm font-semibold ${item.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">Due {item.dueDate}</p>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                  item.type === 'course' ? 'bg-blue-100 text-blue-700' : 
                  item.type === 'project' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {item.type}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Career Gap Analysis</h2>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Overview</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockGapData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 10 }} />
                <Radar name="Current" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Radar name="Target" dataKey="target" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div> Current Ability</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-slate-300 rounded-full mr-2"></div> Market Demand</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
