
import React, { createContext, useContext, useState } from 'react';
import { User, PortfolioData, PlannerItem, AppContextType, Post, CommunityGroup, Alumni, Opportunity, AppNotification } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [planner, setPlanner] = useState<PlannerItem[]>([
    { id: '1', title: 'Complete React Certification', dueDate: '2023-11-30', completed: false, type: 'course' },
    { id: '2', title: 'Finish AI Chatbot Project', dueDate: '2023-12-05', completed: true, type: 'project' },
    { id: '3', title: 'Review Mock Interview', dueDate: '2023-11-28', completed: false, type: 'career' },
  ]);
  
  const [portfolio, setPortfolio] = useState<PortfolioData>({
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Python'],
    projects: [
      { title: 'AI Study Companion', desc: 'A smart notes app that uses LLMs to summarize lectures.', link: '#' },
      { title: 'Campus Marketplace', desc: 'A decentralized peer-to-peer selling platform for students.', link: '#' }
    ],
    certificates: [
      { name: 'Google UX Design Professional', issuer: 'Coursera', date: 'Oct 2023' }
    ],
    academics: [
      { degree: 'B.S. Computer Science', school: 'Tech University', score: '3.9 GPA' }
    ],
    experience: [
      { role: 'Front-end Intern', company: 'Digital Solutions Inc.', duration: 'June - Aug 2023' }
    ],
    socials: { github: 'student-dev', linkedin: 'student-profile', leetcode: 'student-algo' }
  });

  // Community State
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'p1',
      author: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah', role: 'Alumni @ Google' },
      content: "Just shared a new roadmap for Mastering System Design! Check it out if you're prepping for FAANG interviews. #resources #systemdesign",
      timestamp: '2h ago',
      likes: 124,
      comments: 18,
      tags: ['#resources', '#systemdesign'],
      image: 'https://picsum.photos/seed/system/800/400'
    },
    {
      id: 'p2',
      author: { name: 'David Miller', avatar: 'https://i.pravatar.cc/150?u=david', role: 'Junior Student' },
      content: "Does anyone have advice on how to balance open-source contributions with heavy semester loads? Struggling to find time. #doubts #advice",
      timestamp: '5h ago',
      likes: 45,
      comments: 32,
      tags: ['#doubts', '#advice']
    }
  ]);

  const [groups, setGroups] = useState<CommunityGroup[]>([
    { id: 'g1', name: 'Web Dev Wizards', description: 'Everything about Frontend, Backend, and Modern Frameworks.', members: 1240, category: 'Coding', isJoined: true, image: 'https://picsum.photos/seed/web/200' },
    { id: 'g2', name: 'AI Builders Club', description: 'Building the next generation of LLM-powered apps.', members: 890, category: 'AI', isJoined: false, image: 'https://picsum.photos/seed/ai/200' },
    { id: 'g3', name: 'Start-up Campus', description: 'From idea to MVP. Connect with student entrepreneurs.', members: 560, category: 'Startups', isJoined: false, image: 'https://picsum.photos/seed/startup/200' },
  ]);

  const [alumni, setAlumni] = useState<Alumni[]>([
    { id: 'a1', name: 'Emily Watson', avatar: 'https://i.pravatar.cc/150?u=emily', company: 'Meta', role: 'Product Manager', gradYear: 2021, skills: ['Strategy', 'Agile'], isMentoring: true, isFollowed: false },
    { id: 'a2', name: 'Michael Ross', avatar: 'https://i.pravatar.cc/150?u=michael', company: 'Netflix', role: 'Staff Engineer', gradYear: 2019, skills: ['Scalability', 'Go'], isMentoring: false, isFollowed: true },
  ]);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    { id: 'o1', title: 'Frontend Intern', org: 'Vercel', type: 'Internship', deadline: '2024-05-20', domain: 'React/Next.js', description: 'Join the Next.js team to build world-class DX.', eligibility: 'Undergrads only', link: 'https://vercel.com/careers', isBookmarked: false },
    { id: 'o2', title: 'Global AI Build 2024', org: 'Google Cloud', type: 'Hackathon', deadline: '2024-06-15', domain: 'Generative AI', description: 'Build innovative apps using Gemini API.', eligibility: 'Open to all students', link: 'https://cloud.google.com/hackathon', isBookmarked: true },
  ]);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: 'n1', title: 'New Opportunity', message: 'Vercel just posted a Frontend Intern position!', type: 'info', timestamp: '1h ago', read: false },
  ]);

  return (
    <AppContext.Provider value={{ 
      user, setUser, portfolio, setPortfolio, planner, setPlanner,
      posts, setPosts, groups, setGroups, alumni, setAlumni, opportunities, setOpportunities, notifications, setNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
