
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Post, CommunityGroup, Alumni, Opportunity } from '../types';

const Community: React.FC = () => {
  const { posts, setPosts, groups, setGroups, alumni, setAlumni, opportunities, setOpportunities, user } = useAppContext();
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'alumni' | 'opportunities'>('feed');
  const [postContent, setPostContent] = useState('');
  const [postTags, setPostTags] = useState('');
  const [oppFilter, setOppFilter] = useState('All');

  // Actions
  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.hasLiked ? p.likes - 1 : p.likes + 1, hasLiked: !p.hasLiked } : p));
  };

  const handleJoinGroup = (id: string) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, isJoined: !g.isJoined, members: g.isJoined ? g.members - 1 : g.members + 1 } : g));
  };

  const handleFollowAlumni = (id: string) => {
    setAlumni(prev => prev.map(a => a.id === id ? { ...a, isFollowed: !a.isFollowed } : a));
  };

  const toggleBookmark = (id: string) => {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, isBookmarked: !o.isBookmarked } : o));
  };

  const createPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    const newPost: Post = {
      id: Date.now().toString(),
      author: { name: user?.name || 'Student', avatar: user?.avatar || '', role: 'Student' },
      content: postContent,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      tags: postTags.split(' ').filter(t => t.startsWith('#')),
    };
    setPosts([newPost, ...posts]);
    setPostContent('');
    setPostTags('');
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Student Community</h1>
          <p className="text-slate-500 mt-1">Connect with 4,200+ fellow learners and industry mentors.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {(['feed', 'groups', 'alumni', 'opportunities'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar - Navigation & Context */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">My Dashboard</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Groups Joined</span>
                <span className="font-bold text-blue-600">{groups.filter(g => g.isJoined).length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Saved Jobs</span>
                <span className="font-bold text-blue-600">{opportunities.filter(o => o.isBookmarked).length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Alumni Connected</span>
                <span className="font-bold text-blue-600">{alumni.filter(a => a.isFollowed).length}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-500/20">
            <h3 className="font-bold mb-2">Build Together</h3>
            <p className="text-sm opacity-80 leading-relaxed">Join a study group or start a project with peers to level up faster.</p>
            <button className="mt-4 w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-all border border-white/20">
              Create a Group
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'feed' && (
            <div className="space-y-6">
              {/* Post Creator */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <form onSubmit={createPost}>
                  <div className="flex space-x-4">
                    <img src={user?.avatar} className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-3">
                      <textarea
                        placeholder="Share an achievement, ask a doubt, or showcase your project..."
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                        value={postContent}
                        onChange={e => setPostContent(e.target.value)}
                      />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <input
                          type="text"
                          placeholder="Add tags (e.g. #projects #help)"
                          className="bg-transparent border-b border-slate-100 py-1 text-xs text-blue-600 outline-none"
                          value={postTags}
                          onChange={e => setPostTags(e.target.value)}
                        />
                        <div className="flex items-center space-x-3">
                          <button type="button" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </button>
                          <button type="button" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                          </button>
                          <button type="submit" className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">
                            Post
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Sorting */}
              <div className="flex items-center space-x-6 text-sm font-bold text-slate-400 px-4">
                <button className="text-blue-600 border-b-2 border-blue-600 pb-1">Latest</button>
                <button className="hover:text-slate-600 transition-colors">Trending</button>
                <button className="hover:text-slate-600 transition-colors">Following</button>
              </div>

              {/* Feed Items */}
              {posts.map(post => (
                <div key={post.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:border-blue-200 transition-all group">
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img src={post.author.avatar} className="w-10 h-10 rounded-full border border-slate-100" />
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{post.author.name}</h4>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{post.author.role} • {post.timestamp}</p>
                        </div>
                      </div>
                      <button className="text-slate-300 hover:text-slate-600 p-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{post.content}</p>
                    {post.image && <img src={post.image} className="rounded-2xl w-full h-64 object-cover" />}
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map(t => <span key={t} className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{t}</span>)}
                    </div>
                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <button onClick={() => handleLike(post.id)} className={`flex items-center space-x-2 text-xs font-bold transition-all ${post.hasLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}>
                          <svg className={`w-5 h-5 ${post.hasLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-all">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                          <span>{post.comments}</span>
                        </button>
                      </div>
                      <button className="text-slate-400 hover:text-blue-600 p-2 rounded-xl">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'groups' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groups.map(group => (
                <div key={group.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex flex-col">
                  <div className="flex items-start space-x-4">
                    <img src={group.image} className="w-16 h-16 rounded-2xl object-cover" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{group.category}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{group.members} Members</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-lg mt-2">{group.name}</h4>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-4 flex-1">{group.description}</p>
                  <button
                    onClick={() => handleJoinGroup(group.id)}
                    className={`mt-6 w-full py-2.5 rounded-xl font-bold transition-all text-sm ${
                      group.isJoined ? 'bg-slate-100 text-slate-500' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700'
                    }`}
                  >
                    {group.isJoined ? 'Leave Group' : 'Join Group'}
                  </button>
                </div>
              ))}
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center min-h-[200px] hover:border-blue-400 transition-colors cursor-pointer group">
                 <div className="p-3 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                   <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                 </div>
                 <h4 className="font-bold text-slate-800">New Group</h4>
                 <p className="text-xs text-slate-400 mt-1">Start a niche club or study circle</p>
              </div>
            </div>
          )}

          {activeTab === 'alumni' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {alumni.map(person => (
                <div key={person.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all">
                  <div className="flex items-center space-x-4">
                    <img src={person.avatar} className="w-20 h-20 rounded-2xl border-2 border-white shadow-md object-cover" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-800 text-lg">{person.name}</h4>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Class of {person.gradYear}</span>
                      </div>
                      <p className="text-blue-600 text-xs font-bold mt-1">{person.role} @ {person.company}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {person.skills.map(s => <span key={s} className="text-[9px] font-bold text-slate-400 border border-slate-100 px-1.5 rounded">{s}</span>)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleFollowAlumni(person.id)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        person.isFollowed ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {person.isFollowed ? 'Following' : 'Follow'}
                    </button>
                    {person.isMentoring ? (
                      <button className="py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">
                        Request Mentorship
                      </button>
                    ) : (
                      <button className="py-2 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed">
                        Busy
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'opportunities' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-2">
                   {['All', 'Internship', 'Job', 'Hackathon'].map(f => (
                     <button
                      key={f}
                      onClick={() => setOppFilter(f)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${oppFilter === f ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                     >
                       {f}
                     </button>
                   ))}
                </div>
                <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input type="text" placeholder="Search title, tech..." className="bg-transparent border-none text-xs focus:ring-0 w-32 md:w-48" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {opportunities.filter(o => oppFilter === 'All' || o.type === oppFilter).map(opp => (
                  <div key={opp.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group relative">
                    <button
                      onClick={() => toggleBookmark(opp.id)}
                      className={`absolute top-6 right-6 p-2 rounded-xl transition-all ${opp.isBookmarked ? 'text-blue-600 bg-blue-50' : 'text-slate-200 hover:text-slate-400'}`}
                    >
                      <svg className={`w-6 h-6 ${opp.isBookmarked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    </button>
                    
                    <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-blue-600 text-xl border border-slate-100">
                        {opp.org[0]}
                      </div>
                      <div className="flex-1 mt-4 md:mt-0 space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${
                            opp.type === 'Internship' ? 'bg-indigo-50 text-indigo-600' : 
                            opp.type === 'Job' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                          }`}>
                            {opp.type}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">• {opp.deadline}</span>
                        </div>
                        <h4 className="text-xl font-bold text-slate-800">{opp.title}</h4>
                        <p className="text-sm font-bold text-slate-500">{opp.org} • {opp.domain}</p>
                        <p className="text-sm text-slate-500 line-clamp-2 mt-2">{opp.description}</p>
                        <div className="flex items-center justify-between mt-6">
                          <div className="text-[11px] font-bold text-slate-400">Eligibility: <span className="text-slate-800">{opp.eligibility}</span></div>
                          <a
                            href={opp.link}
                            target="_blank"
                            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                          >
                            Apply Now
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
