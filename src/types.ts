export type RoleType = 'owner' | 'manager' | 'editor' | 'social' | 'freelance';

export interface FreelancerProfile {
  id: string;
  name: string;
  specialty: 'Video Editor' | 'Colorist (DaVinci)' | 'VFX Artist' | 'Reel Specialist' | 'DIT / Backup';
  hourlyRate: number;
  status: 'active-editing' | 'available' | 'reviewing';
  currentJobTitle?: string;
  turnaroundRating: string; // e.g., "Fast (24h avg)"
  contactPhone?: string;
}

export type PipelineStage = 
  | 'unassigned'
  | 'footage-received'
  | 'assigned'
  | 'editing'
  | 'review'
  | 'revisions'
  | 'delivered';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  roleType: RoleType;
  phonePIN?: string; // Phone number acting as Employee Login Password / Workstation PIN
  avatar: string;
  department: 'Management' | 'Post-Production' | 'Photography' | 'Social Media' | 'Freelance Contractor Pool';
  hourlyRate: number; // in INR or USD
  status: 'online' | 'active-editing' | 'idle' | 'offline';
  workstationPC?: string; // e.g. Workstation PC #1
  activeProjectTitle?: string;
  activeJobId?: string;
  weeklyHoursLogged: number;
  productivityScore: number; // e.g. 94%
  appUsage: {
    premierePro: number; // hours
    afterEffects: number;
    photoshop: number;
    chromeDrive: number;
    idleAway: number;
  };
  freelancerPoolRoster?: FreelancerProfile[];
}

export interface Client {
  id: string;
  name: string;
  clientCode: string;
  category: string;
  folderStatus: 'complete' | 'missing-contracts' | 'missing-raw';
  driveUrl: string;
  dropboxUrl: string;
  contractStatus: 'Signed' | 'Pending Approval' | 'Renewed';
  totalProjects: number;
  completedProjects: number;
  socialPlatforms: {
    facebook: boolean;
    instagram: boolean;
    youtube: boolean;
  };
  contactPerson: string;
  phone: string;
  projectFee?: number; // Total agreed project/deliverable fee
  advancePaid?: number; // Advance amount received before master release
}

export interface JobCard {
  id: string;
  title: string;
  clientId: string;
  stage: PipelineStage;
  assignedTo: string | null; // TeamMember id
  assignedBy: string; // TeamMember id (Aditya or Saurav)
  assignedFreelancerName?: string; // If assigned to Freelance Pool, which specific freelancer?
  freelanceCost?: number; // Estimated/Actual cost for this contractor
  freelanceDeadlineDate?: string; // Estimated Delivery Date (Date string)
  estimatedHours: number; // e.g. 2 hours edit work
  loggedHours: number; // e.g. 18.5 hours (overdue anomaly!)
  turnaroundSLA: number; // target hours from start to finish
  acceptedAt?: string; // Timestamp when employee accepted the job (e.g. "2026-07-16 10:15:00")
  turnaroundClockStatus?: 'Not Started' | 'Accepted & Ticking' | 'Completed';
  daysInStage: number; // how many days card has sat in current column
  isOverdue: boolean;
  createdAt: string;
  dueDate: string;
  priority: 'urgent' | 'high' | 'normal';
  driveDeliverableLink?: string;
  dropboxRawLink?: string;
  notes: string[];
  checklist: {
    rawIngested: boolean;
    audioSynced: boolean;
    colorGraded: boolean;
    clientApproved: boolean;
  };
  submittedDeliverableUrl?: string; // Link submitted by editor when finishing work
  submissionNotes?: string; // Editor handoff notes upon submission
  submittedAt?: string; // Timestamp of submission
  cancellationRequested?: boolean;
  cancellationReason?: string;
  cancellationRequestedAt?: string;
}

export type SocialPlatform = 'Facebook' | 'Instagram' | 'YouTube';
export type PostStatus = 'Draft' | 'Owner Approved' | 'Scheduled' | 'Published';

export interface SocialPost {
  id: string;
  title: string;
  clientId: string;
  platform: SocialPlatform;
  postDate: string; // YYYY-MM-DD HH:mm
  status: PostStatus;
  contentCaption: string;
  mediaLink: string;
  assignedTo: string; // TeamMember id
  thumbnailUrl?: string;
}

export interface TimeLogEntry {
  id: string;
  memberId: string;
  jobId: string;
  jobTitle: string;
  clientName: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  activePercentage: number;
  primaryApp: string;
  screenshotProofCount: number;
}
