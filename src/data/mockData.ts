import type { TeamMember, Client, JobCard, SocialPost, TimeLogEntry } from '../types';

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'usr-rony',
    name: 'Rony Santra',
    role: 'Super Admin & Owner',
    roleType: 'owner',
    phonePIN: '8240054002',
    avatar: 'RS',
    department: 'Management',
    hourlyRate: 1500,
    status: 'online',
    workstationPC: 'Admin Console',
    weeklyHoursLogged: 0,
    productivityScore: 100,
    appUsage: { premierePro: 0, afterEffects: 0, photoshop: 0, chromeDrive: 0, idleAway: 0 },
    freelancerPoolRoster: []
  }
];

export const INITIAL_CLIENTS: Client[] = [];
export const INITIAL_JOBS: JobCard[] = [];
export const INITIAL_SOCIAL_POSTS: SocialPost[] = [];
export const INITIAL_TIMELOGS: TimeLogEntry[] = [];
