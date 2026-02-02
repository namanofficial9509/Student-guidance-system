
// Fix: Import React to resolve React.Dispatch and React.SetStateAction namespace errors
import React from 'react';

export enum AppView {
  DASHBOARD = 'dashboard',
  NAVIGATOR = 'navigator',
  COMMUNITY = 'community',
  PORTFOLIO = 'portfolio',
  LOGIN = 'login'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface PlannerItem {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  type: 'course' | 'project' | 'career';
}

// Fix: Export GapMetric interface to resolve missing export error in Dashboard.tsx
export interface GapMetric {
  skill: string;
  current: number;
  target: number;
}

export interface PortfolioData {
  skills: string[];
  projects: { title: string; desc: string; link?: string }[];
  certificates: { name: string; issuer: string; date: string }[];
  academics: { degree: string; school: string; score: string }[];
  experience: { role: string; company: string; duration: string }[];
  socials: { github?: string; linkedin?: string; leetcode?: string };
}

export interface Post {
  id: string;
  author: { name: string; avatar: string; role: string };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  tags: string[];
  image?: string;
  hasLiked?: boolean;
  hasSaved?: boolean;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  isJoined: boolean;
  image: string;
}

export interface Alumni {
  id: string;
  name: string;
  avatar: string;
  company: string;
  role: string;
  gradYear: number;
  skills: string[];
  isMentoring: boolean;
  isFollowed: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  org: string;
  type: 'Job' | 'Internship' | 'Hackathon' | 'Scholarship';
  deadline: string;
  domain: string;
  description: string;
  eligibility: string;
  link: string;
  isBookmarked: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
  read: boolean;
}

export interface AppContextType {
  user: User | null;
  portfolio: PortfolioData;
  setPortfolio: (data: PortfolioData) => void;
  setUser: (user: User | null) => void;
  planner: PlannerItem[];
  setPlanner: (items: PlannerItem[]) => void;
  // Community State
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  groups: CommunityGroup[];
  setGroups: React.Dispatch<React.SetStateAction<CommunityGroup[]>>;
  alumni: Alumni[];
  setAlumni: React.Dispatch<React.SetStateAction<Alumni[]>>;
  opportunities: Opportunity[];
  setOpportunities: React.Dispatch<React.SetStateAction<Opportunity[]>>;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
}
