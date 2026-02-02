
import React, { useState } from 'react';
import { analyzeResume } from '../services/gemini';
import { useAppContext } from '../context/AppContext';

const CareerNavigator: React.FC = () => {
  const { portfolio } = useAppContext();
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalyzePortfolio = async () => {
    setAnalyzing(true);
    try {
      const resumeContent = `
        Skills: ${portfolio.skills.join(', ')}
        Projects: ${portfolio.projects.map(p => `${p.title}: ${p.desc}`).join('; ')}
        Experience: ${portfolio.experience.map(e => `${e.role} at ${e.company}`).join('; ')}
      `;
      const result = await analyzeResume(resumeContent);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setAnalyzing(true);
    // Simulation of parsing file text then calling AI
    setTimeout(handleAnalyzePortfolio, 1000);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-indigo-600 rounded-2xl text-white">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">AI Career Navigator</h1>
          <p className="text-slate-500">Personalized guidance based on your profile.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Resume Optimizer</h2>
            
            <button 
              onClick={handleAnalyzePortfolio}
              className="w-full mb-6 py-4 px-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <span>Analyze My Portfolio</span>
            </button>

            <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer group">
              <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              <svg className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              <p className="text-sm font-semibold text-slate-700">Or Upload PDF</p>
            </div>

            {analyzing && (
              <div className="mt-4 flex items-center justify-center p-4 bg-blue-50 rounded-xl animate-pulse">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-sm font-medium text-blue-600">AI Analysis in progress...</span>
              </div>
            )}

            {analysisResult && (
              <div className="mt-8 space-y-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Readiness</span>
                    <span className="text-2xl font-black text-blue-600">{analysisResult.score}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${analysisResult.score}%` }}></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Growth Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.missingSkills.map((s: string) => (
                      <span key={s} className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded border border-red-100">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Suggestions</h4>
                   <ul className="space-y-2">
                     {analysisResult.suggestions.slice(0, 3).map((s: string, i: number) => (
                       <li key={i} className="text-xs text-slate-600 flex items-start">
                         <span className="text-blue-500 mr-2">•</span> {s}
                       </li>
                     ))}
                   </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 min-h-[500px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-800">Interactive Career Pathmap</h2>
              <button className="text-blue-600 text-sm font-bold hover:underline">Customize Target Role</button>
            </div>

            {!analysisResult && !analyzing && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                 <div className="p-4 bg-slate-50 rounded-full mb-4">
                    <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <p className="text-slate-500 max-w-xs">Run a profile analysis to see your custom career roadmap and detailed gap analysis.</p>
              </div>
            )}

            <div className={`relative ${!analysisResult ? 'opacity-20 blur-sm select-none pointer-events-none' : 'opacity-100'}`}>
               <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-100"></div>
               <div className="space-y-12 relative">
                  {(analysisResult?.roadmapNodes || [
                    { id: '1', title: 'Data Structures Mastery', desc: 'Focus on Graphs & Trees for top-tier companies.' },
                    { id: '2', title: 'Fullstack Project Development', desc: 'Build a production-grade T3 stack app.' },
                    { id: '3', title: 'System Design Basics', desc: 'Learn scalability, load balancers, and caching.' }
                  ]).map((node: any, idx: number) => (
                    <div key={idx} className="flex items-start group">
                      <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shadow-md transition-all ${idx === 0 ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>
                        {idx + 1}
                      </div>
                      <div className="ml-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-blue-200 group-hover:bg-white transition-all flex-1 shadow-sm">
                        <h4 className="font-bold text-slate-800 text-lg">{node.title}</h4>
                        <p className="text-sm text-slate-500 mt-2">{node.desc}</p>
                        <div className="mt-4 flex items-center space-x-6">
                           <button className="text-xs font-bold text-blue-600 flex items-center hover:translate-x-1 transition-transform">
                             Take Recommended Course <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                           </button>
                           <button className="text-xs font-bold text-slate-400 hover:text-slate-800">
                             Mark as Completed
                           </button>
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerNavigator;
