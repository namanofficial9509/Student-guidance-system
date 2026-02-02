
import React, { useState } from 'react';
import { PortfolioData } from '../types';
import { useAppContext } from '../context/AppContext';

const Portfolio: React.FC = () => {
  const { portfolio, setPortfolio, user } = useAppContext();
  const [newSkill, setNewSkill] = useState('');
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: '', desc: '' });

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (portfolio.skills.includes(newSkill)) return;
    setPortfolio({ ...portfolio, skills: [...portfolio.skills, newSkill] });
    setNewSkill('');
  };

  const removeSkill = (skill: string) => {
    setPortfolio({ ...portfolio, skills: portfolio.skills.filter(s => s !== skill) });
  };

  const handleAddProject = () => {
    if (!projectForm.title || !projectForm.desc) return;
    setPortfolio({ ...portfolio, projects: [...portfolio.projects, { ...projectForm }] });
    setProjectForm({ title: '', desc: '' });
    setIsAddingProject(false);
  };

  const generateResume = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500 max-w-6xl mx-auto pb-20">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Professional Portfolio</h1>
          <p className="text-slate-500">Curate your identity for recruiters and AI agents.</p>
        </div>
        <button 
          onClick={generateResume}
          className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <span>Generate Resume</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center">
             <div className="relative inline-block">
               <img src={user?.avatar || "https://picsum.photos/seed/portfolio/200"} className="w-32 h-32 rounded-3xl mx-auto object-cover border-4 border-white shadow-lg" />
               <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
             </div>
             <h2 className="text-2xl font-bold text-slate-800 mt-6">{user?.name || 'Student Name'}</h2>
             <p className="text-blue-600 font-medium text-sm">Full-Stack Engineer in training</p>
             
             <div className="mt-8 flex justify-center space-x-4">
                <a href={`https://github.com/${portfolio.socials.github}`} target="_blank" className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <img src="https://www.svgrepo.com/show/330541/github.svg" className="w-6 h-6" alt="GitHub" />
                </a>
                <a href={`https://linkedin.com/in/${portfolio.socials.linkedin}`} target="_blank" className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <img src="https://www.svgrepo.com/show/448234/linkedin.svg" className="w-6 h-6" alt="LinkedIn" />
                </a>
             </div>
           </div>

           <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 print:hidden">
             <h3 className="font-bold text-slate-800 mb-6 flex justify-between">
                <span>Top Skills</span>
                <span className="text-xs text-slate-400">{portfolio.skills.length}</span>
             </h3>
             <form onSubmit={addSkill} className="mb-6 flex gap-2">
               <input 
                 type="text" 
                 placeholder="Add skill..." 
                 className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                 value={newSkill}
                 onChange={(e) => setNewSkill(e.target.value)}
               />
               <button type="submit" className="px-4 bg-blue-600 text-white rounded-lg text-xs font-bold">+</button>
             </form>
             <div className="flex flex-wrap gap-2">
               {portfolio.skills.map(skill => (
                 <span key={skill} className="group relative px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg border border-slate-100 pr-6">
                   {skill}
                   <button 
                    onClick={() => removeSkill(skill)}
                    className="absolute right-1 top-1 text-slate-300 hover:text-red-500"
                   >
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                   </button>
                 </span>
               ))}
             </div>
           </div>
        </div>

        <div className="md:col-span-2 space-y-8">
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 text-xl mb-6">Experience & Education</h3>
             <div className="space-y-8">
               <div className="relative pl-6 border-l-2 border-slate-50">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100 border-4 border-white"></div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Education</h4>
                  {portfolio.academics.map((edu, idx) => (
                    <div key={idx} className="flex justify-between">
                       <div>
                         <p className="font-bold text-slate-800">{edu.degree}</p>
                         <p className="text-sm text-slate-500">{edu.school}</p>
                       </div>
                       <span className="text-xs font-bold text-green-600">{edu.score}</span>
                    </div>
                  ))}
               </div>
               <div className="relative pl-6 border-l-2 border-slate-50">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-100 border-4 border-white"></div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Experience</h4>
                  {portfolio.experience.map((exp, idx) => (
                    <div key={idx} className="flex justify-between">
                       <div>
                         <p className="font-bold text-slate-800">{exp.role}</p>
                         <p className="text-sm text-slate-500">{exp.company}</p>
                       </div>
                       <span className="text-xs font-medium text-slate-400">{exp.duration}</span>
                    </div>
                  ))}
               </div>
             </div>
           </div>

           <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-center mb-6 print:hidden">
               <h3 className="font-bold text-slate-800 text-xl">Key Projects</h3>
               <button 
                onClick={() => setIsAddingProject(true)}
                className="text-blue-600 text-sm font-bold hover:bg-blue-50 px-3 py-1 rounded-lg"
               >
                 + New Project
               </button>
             </div>
             
             {isAddingProject && (
               <div className="mb-6 p-6 bg-blue-50 rounded-2xl border border-blue-100 space-y-4 animate-in slide-in-from-top-2">
                  <input 
                    className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Project Title"
                    value={projectForm.title}
                    onChange={e => setProjectForm({...projectForm, title: e.target.value})}
                  />
                  <textarea 
                    className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Short description of what you built..."
                    rows={3}
                    value={projectForm.desc}
                    onChange={e => setProjectForm({...projectForm, desc: e.target.value})}
                  />
                  <div className="flex justify-end space-x-3">
                    <button onClick={() => setIsAddingProject(false)} className="px-4 py-2 text-sm font-semibold text-slate-500">Cancel</button>
                    <button onClick={handleAddProject} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20">Add Project</button>
                  </div>
               </div>
             )}

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {portfolio.projects.map((project, idx) => (
                 <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 group transition-all">
                   <h4 className="font-bold text-slate-800 group-hover:text-blue-600">{project.title}</h4>
                   <p className="text-sm text-slate-500 mt-2 line-clamp-3">{project.desc}</p>
                   <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                        GitHub
                      </div>
                      <button className="text-slate-300 hover:text-red-500 print:hidden" onClick={() => setPortfolio({...portfolio, projects: portfolio.projects.filter((_, i) => i !== idx)})}>
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
