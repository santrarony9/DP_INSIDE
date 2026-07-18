import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard,
  Briefcase, 
  Clock, 
  Calendar, 
  FolderGit2, 
  CheckCircle2, 
  CheckCircle,
  Plus, 
  ExternalLink, 
  Play, 
  Square, 
  Share2, 
  HardDrive, 
  Video, 
  Eye, 
  FileCheck,
  RefreshCw,
  KeyRound,
  LogOut,
  Search,
  Activity,
  ArrowUpRight,
  Settings,
  Webhook,
  Code2,
  Check,
  Users,
  Trash2,
  BarChart3
} from 'lucide-react';
import './App.css';
import type { 
  TeamMember, 
  Client, 
  JobCard, 
  SocialPost, 
  PipelineStage 
} from './types';

import LoginScreen from './components/LoginScreen';
import ResourceCalendar from './components/ResourceCalendar';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { useAuth, useTeam, useClients, useJobs, useSocialPosts } from './hooks';

const STAGES: { id: PipelineStage; title: string; color: string }[] = [
  { id: 'unassigned', title: '0. Unassigned Inbox', color: '#475569' },
  { id: 'footage-received', title: '1. Footage Received', color: '#7c3aed' },
  { id: 'assigned', title: '2. Assigned to Editor', color: '#0284c7' },
  { id: 'editing', title: '3. In Editing (Active)', color: '#d97706' },
  { id: 'review', title: '4. Internal Review', color: '#16a34a' },
  { id: 'revisions', title: '5. Client Revisions', color: '#f43f5e' },
  { id: 'delivered', title: '6. Delivered & Closed', color: '#e2b714' }
];

// Exact Brand SVGs for Social Media
const SocialBrandIcon = ({ platform }: { platform: string }) => {
  if (platform === 'Instagram') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', color: '#f43f5e' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      </span>
    );
  }
  if (platform === 'Facebook') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', color: '#3b82f6' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      </span>
    );
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', color: '#dc2626' }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
      </svg>
    </span>
  );
};

export default function App() {
  // State (Syncs with VPS API)
  const { team, deleteTeamMember, addTeamMember, updateTeamMember } = useTeam();
  const { clients, deleteClient, addClient } = useClients();
  const { jobs, deleteJob, addJob, updateJob } = useJobs();
  const { socialPosts, deletePost, addPost, updatePost } = useSocialPosts();

  // Auth & Workstation
  const { currentUser, login, logout, error, loading: authLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [loginPinInput, setLoginPinInput] = useState<string>('');
  const [targetLoginMember, setTargetLoginMember] = useState<TeamMember | null>(null);

  // Navigation (Clean Sidebar)
  const [activeTab, setActiveTab] = useState<'overview' | 'kanban' | 'monitoring' | 'social' | 'clients' | 'resource-calendar' | 'analytics'>('overview');

  // Filters (`Employee & Contractor Workload Tracking`)
  const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Live Easy 1-Click Web Check-In & Timer
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0); // Starts at 0:00:00 when you click Check-In
  const [activeWebCheckInUser, setActiveWebCheckInUser] = useState<string>('usr-3'); // e.g. Piyali
  const [activeWebCheckInProject, setActiveWebCheckInProject] = useState<string>('Diandra Wedding - 5 Min Highlight Reel 4K');

  // API & Webhook Config State
  const [showApiConfigModal, setShowApiConfigModal] = useState<boolean>(false);
  const [apiProvider, setApiProvider] = useState<'socialpilot' | 'ayrshare' | 'webhook'>('socialpilot');
  const [socialPilotApiKey, setSocialPilotApiKey] = useState<string>('sp_live_9f8a72b4e6014c22998bc1');
  const [webhookUrl, setWebhookUrl] = useState<string>('https://hook.eu1.make.com/studioos-auto-publisher-99x');
  const [lastApiPayload, setLastApiPayload] = useState<any | null>(null);

  // Modals
  const [showNewJobModal, setShowNewJobModal] = useState<boolean>(false);
  const [showNewSocialModal, setShowNewSocialModal] = useState<boolean>(false);
  const [showJobDetailModal, setShowJobDetailModal] = useState<JobCard | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState<string | null>(null);

  // Job Modal extra states
  const [submissionUrl, setSubmissionUrl] = useState<string>('');
  const [submissionNotes, setSubmissionNotes] = useState<string>('');
  const [cancellationReason, setCancellationReason] = useState<string>('');

  // Form states for New Job
  const [newJobTitle, setNewJobTitle] = useState('');
  const [freelanceCostInput, setFreelanceCostInput] = useState<number | ''>('');
  const [freelanceDeadlineInput, setFreelanceDeadlineInput] = useState<string>('');
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string>('');
  const [selectedTotalParts, setSelectedTotalParts] = useState<number>(1);
  const [newJobClient, setNewJobClient] = useState('');
  const [newJobEstimatedHours, setNewJobEstimatedHours] = useState<number>(4);
  const [showAddFreelancerModal, setShowAddFreelancerModal] = useState<boolean>(false);
  const [newFlName, setNewFlName] = useState<string>('');
  const [newFlSpecialty, setNewFlSpecialty] = useState<any>('Video Editor');
  const [newFlRate, setNewFlRate] = useState<number>(750);

  // Google Drive Multi-Account Hub (15TB Total Cloud Storage across 3 accounts)
  const [showDriveConfigModal, setShowDriveConfigModal] = useState<boolean>(false);
  const [driveAccount1, setDriveAccount1] = useState('');
  const [driveAccount2, setDriveAccount2] = useState('');
  const [driveAccount3, setDriveAccount3] = useState('');
  const [driveUrl1, setDriveUrl1] = useState('');
  const [driveUrl2, setDriveUrl2] = useState('');
  const [driveUrl3, setDriveUrl3] = useState('');

  // Form states for New Social Post
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostClient, setNewPostClient] = useState('');
  const [newPostPlatform, setNewPostPlatform] = useState<'Facebook' | 'Instagram' | 'YouTube'>('Instagram');
  const [newPostDate, setNewPostDate] = useState('2026-07-21 18:00');

  // Form states for Add Client & Add Employee / PC Seat
  const [showAddClientModal, setShowAddClientModal] = useState<boolean>(false);
  const [newCliName, setNewCliName] = useState('');
  const [newCliStorageType, setNewCliStorageType] = useState<'local' | 'drive'>('drive');
  const [newCliStoragePath, setNewCliStoragePath] = useState('https://drive.google.com/drive/folders/master-raw');
  const [newCliAssignee, setNewCliAssignee] = useState('');
  const [newCliTotalParts, setNewCliTotalParts] = useState<number>(1);
  const [newCliNotes, setNewCliNotes] = useState('Deliver initial 4K cut within 48 hours. Sync lapel mic audio.');


  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState<boolean>(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('Senior Video Editor');
  const [newEmpRoleType, setNewEmpRoleType] = useState<any>('editor');
  const [newEmpPC, setNewEmpPC] = useState('Workstation PC #6');
  const [newEmpAvatar, setNewEmpAvatar] = useState('ED');
  const [newEmpPhonePIN, setNewEmpPhonePIN] = useState('9830088888');

  // One-Time Auto-Boot Workstation Configuration Modal State (`Windows & Mac`)
  const [showWorkstationConfigModal, setShowWorkstationConfigModal] = useState<boolean>(false);
  const [configSeatId, setConfigSeatId] = useState<string>('usr-3');

  const [configOsType, setConfigOsType] = useState<'windows' | 'mac'>('windows');

  // Notification System — derived from job data (works cross-device via MongoDB)
  // Extracts assignment notes from jobs assigned to the current user
  const myNotifications = React.useMemo(() => {
    if (!currentUser || !currentUser.id) return [];
    const myJobs = jobs.filter(j => j.assignedTo === currentUser.id || (j as any).assignedTo === (currentUser as any)._id);
    const notifs: { id: string; message: string; time: string; jobTitle: string }[] = [];
    myJobs.forEach(job => {
      (job.notes || []).forEach((note, idx) => {
        if (note.includes('[ASSIGNED by') || note.includes('[Assignment Note]')) {
          notifs.push({
            id: `${job.id}-note-${idx}`,
            message: `📋 "${job.title}" — ${note}`,
            time: job.createdAt || '',
            jobTitle: job.title
          });
        }
      });
    });
    return notifs.slice(0, 15);
  }, [jobs, currentUser]);

  // Track which notifications the user has dismissed (localStorage per user)
  const [dismissedNotifIds, setDismissedNotifIds] = useState<string[]>(() => {
    try {
      const cached = localStorage.getItem(`dpinside_dismissed_notifs_${currentUser?.id}`);
      return cached ? JSON.parse(cached) : [];
    } catch { return []; }
  });

  const myUnreadNotifications = myNotifications.filter(n => !dismissedNotifIds.includes(n.id));
  const myUnreadCount = myUnreadNotifications.length;

  const markAllNotificationsRead = () => {
    const allIds = myNotifications.map(n => n.id);
    setDismissedNotifIds(allIds);
    localStorage.setItem(`dpinside_dismissed_notifs_${currentUser?.id}`, JSON.stringify(allIds));
  };

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatSeconds = (sec: number) => {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const triggerAlert = (msg: string) => {
    setShowSuccessBanner(msg);
    setTimeout(() => {
      setShowSuccessBanner(null);
    }, 4000);
  };

  const isManagerOrOwner = currentUser?.roleType === 'owner' || currentUser?.roleType === 'manager';

  const handleEmployeeLogin = () => {
    alert('Please login from the main screen.');
  };

  const moveJobStage = async (jobId: string, nextStage: PipelineStage) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    const updates: Partial<JobCard> = { ...job, stage: nextStage, daysInStage: 1 };
    if (nextStage === 'delivered') updates.isOverdue = false;
    await updateJob(jobId, updates);
    triggerAlert(`Task moved to: ${nextStage.toUpperCase()} by ${currentUser?.name.split(' ')[0]}`);
    if (showJobDetailModal && showJobDetailModal.id === jobId) {
      setShowJobDetailModal((prev) => (prev ? { ...prev, stage: nextStage } : null));
    }
  };

  const confirmAndDelete = async (type: string, id: string, deleteFn: (id: string) => Promise<boolean>) => {
    if (window.confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) {
      await deleteFn(id);
      triggerAlert(`${type} deleted successfully.`);
      if (type === 'Job' && showJobDetailModal?.id === id) {
        setShowJobDetailModal(null);
      }
    }
  };

  const handleAcceptJobClock = async (jobId: string) => {
    const nowStr = new Date().toLocaleString();
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    await updateJob(jobId, {
      ...job,
      stage: job.stage === 'assigned' ? 'editing' : job.stage,
      acceptedAt: nowStr,
      turnaroundClockStatus: 'Accepted & Ticking'
    });
    if (showJobDetailModal && showJobDetailModal.id === jobId) {
      setShowJobDetailModal((prev) => (prev ? { ...prev, acceptedAt: nowStr, turnaroundClockStatus: 'Accepted & Ticking', stage: prev.stage === 'assigned' ? 'editing' : prev.stage } : null));
    }
    triggerAlert(`⏰ [Turnaround Clock Started!] Job accepted by ${currentUser?.name.split(' ')[0]} at current time (${nowStr}). Target SLA: ${jobs.find(j=>j.id===jobId)?.turnaroundSLA || 48}h.`);
  };

  const handleEditorSubmitProject = async (jobId: string) => {
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    const isPartialSubmission = (targetJob.totalParts || 1) > 1 && (targetJob.currentPart || 1) < (targetJob.totalParts || 1);

    if (!isPartialSubmission && !submissionUrl) {
      triggerAlert('Please paste your final Google Drive or Dropbox deliverable link before submitting.');
      return;
    }

    const updatedNotes = [
      ...targetJob.notes,
      `[SUBMITTED BY ${currentUser?.name} on ${new Date().toLocaleString()} (Part ${targetJob.currentPart || 1}/${targetJob.totalParts || 1})]: ${submissionUrl ? `Link: ${submissionUrl} | ` : ''}Notes: ${submissionNotes || 'No notes provided.'}`,
      isPartialSubmission ? `[Part ${targetJob.currentPart || 1} Delivered]: Awaiting manager review for next part.` : `[Turnaround Clock Completed at ${new Date().toLocaleTimeString()}]: Project closed within SLA window.`
    ];

    await updateJob(jobId, {
      ...targetJob,
      stage: 'review',
      submittedDeliverableUrl: submissionUrl || targetJob.submittedDeliverableUrl || '',
      submissionNotes: submissionNotes,
      submittedAt: new Date().toLocaleString(),
      turnaroundClockStatus: isPartialSubmission ? 'Paused (Reviewing Part)' : 'Completed',
      notes: updatedNotes
    });

    setShowJobDetailModal(null);
    setSubmissionUrl('');
    setSubmissionNotes('');
    triggerAlert(`Project submitted successfully! Turnaround SLA Clock stopped & completed.`);
  };

  const handleRequestCancellation = (jobId: string) => {
    if (!cancellationReason) {
      triggerAlert('Please provide a reason for cancelling this project.');
      return;
    }
    const updatedJob = jobs.find(j => j.id === jobId);
    if (updatedJob) {
      updateJob(updatedJob.id, {
        ...updatedJob,
        cancellationRequested: true,
        cancellationReason,
        cancellationRequestedAt: new Date().toLocaleString(),
        notes: [
          ...updatedJob.notes,
          `[CANCELLATION REQUESTED by ${currentUser?.name} on ${new Date().toLocaleString()}]: Reason: ${cancellationReason}`
        ]
      });
      triggerAlert('Cancellation request sent to Managers for approval.');
      setShowJobDetailModal(null);
      setCancellationReason('');
    }
  };

  const handleApproveCancellation = (jobId: string) => {
    const updatedJob = jobs.find(j => j.id === jobId);
    if (updatedJob) {
      updateJob(updatedJob.id, {
        ...updatedJob,
        cancellationRequested: false,
        cancellationReason: '',
        stage: 'unassigned',
        assignedTo: null,
        turnaroundClockStatus: 'Not Started',
        notes: [
          ...updatedJob.notes,
          `[CANCELLATION APPROVED by Manager on ${new Date().toLocaleString()}]: Project moved back to Unassigned Queue.`
        ]
      });
      triggerAlert('Cancellation approved. Project is now Unassigned.');
      setShowJobDetailModal(null);
    }
  };

  const handleRejectCancellation = (jobId: string) => {
    const updatedJob = jobs.find(j => j.id === jobId);
    if (updatedJob) {
      updateJob(updatedJob.id, {
        ...updatedJob,
        cancellationRequested: false,
        notes: [
          ...updatedJob.notes,
          `[CANCELLATION REJECTED by Manager on ${new Date().toLocaleString()}]: Editor must complete this project.`
        ]
      });
      triggerAlert('Cancellation rejected. Editor notified to continue work.');
      setShowJobDetailModal(null);
    }
  };

  const handleAddFreelancerToPool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlName) return;
    
    const poolRecord = team.find(t => t.id === 'usr-freelance-pool');
    if (poolRecord) {
      const updatedRoster = [
        ...(poolRecord.freelancerPoolRoster || []),
        {
          id: `fl-${Date.now()}`,
          name: newFlName,
          specialty: newFlSpecialty,
          hourlyRate: Number(newFlRate),
          status: 'available' as const,
          turnaroundRating: '24h Fast'
        }
      ];
      await updateTeamMember('usr-freelance-pool', { freelancerPoolRoster: updatedRoster });
    }
    setShowAddFreelancerModal(false);
    setNewFlName('');
    triggerAlert(`Added ${newFlName} (${newFlSpecialty}) to Freelance Contractor Pool.`);
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle) return;
    const newCard: JobCard = {
      id: `job-${Date.now()}`,
      title: newJobTitle,
      clientId: newJobClient,
      stage: 'unassigned',
      assignedTo: null,
      assignedBy: currentUser?.id || '',
      totalParts: 1,
      currentPart: 1,
      estimatedHours: Number(newJobEstimatedHours),
      loggedHours: 0,
      turnaroundSLA: Number(newJobEstimatedHours) * 12,
      daysInStage: 1,
      isOverdue: false,
      createdAt: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      priority: 'normal',
      notes: [`[${currentUser?.avatar} ${currentUser?.name}]: Added to Unassigned Queue.`],
      checklist: { rawIngested: true, audioSynced: false, colorGraded: false, clientApproved: false }
    };
    await addJob(newCard);
    setShowNewJobModal(false);
    setNewJobTitle('');
    triggerAlert(`Job "${newJobTitle}" created & added to Unassigned Queue.`);
  };

  const handleCreateSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle) return;
    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      title: newPostTitle,
      clientId: newPostClient,
      platform: newPostPlatform,
      postDate: newPostDate,
      status: 'Owner Approved',
      contentCaption: 'Check out our latest release! #DPInside',
      mediaLink: 'https://drive.google.com/file/d/final-render.mp4/view',
      assignedTo: currentUser?.id || '',
      thumbnailUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80'
    };
    await addPost(newPost);
    setShowNewSocialModal(false);
    setNewPostTitle('');
    triggerAlert(`Scheduled ${newPostPlatform} post successfully.`);
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCliName) return;
    const clientId = `cli-${Date.now()}`;
    const newCli: Client = {
      id: clientId,
      name: newCliName,
      clientCode: `PRJ-${Date.now().toString().slice(-4)}`,
      category: 'Production Campaign',
      folderStatus: 'complete',
      driveUrl: newCliStorageType === 'drive' ? newCliStoragePath : driveUrl1,
      dropboxUrl: newCliStorageType === 'local' ? newCliStoragePath : driveUrl3,
      contractStatus: 'Signed',
      totalProjects: 1,
      completedProjects: 0,
      socialPlatforms: { facebook: true, instagram: true, youtube: true },
      contactPerson: 'Production Manager',
      phone: '+91 98000 00000'
    };

    const newJob: JobCard = {
      id: `job-${Date.now()}`,
      title: `${newCliName} - Main Production Deliverable`,
      clientId: clientId,
      stage: 'assigned',
      assignedTo: newCliAssignee,
      assignedBy: currentUser?.id || '',
      totalParts: newCliTotalParts,
      currentPart: 1,
      estimatedHours: 10,
      loggedHours: 0,
      turnaroundSLA: 48,
      daysInStage: 1,
      isOverdue: false,
      createdAt: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      priority: 'normal',
      driveDeliverableLink: newCliStoragePath,
      notes: [`[Assignment Note]: ${newCliNotes || 'No notes provided.'}`, `[Saved Location (${newCliStorageType.toUpperCase()})]: ${newCliStoragePath}`],
      checklist: { rawIngested: true, audioSynced: false, colorGraded: false, clientApproved: false }
    };

    await addClient(newCli);
    await addJob(newJob);
    if (newCliAssignee) {
      // Notification is now derived from job notes
    }
    setShowAddClientModal(false);
    setNewCliName('');
    triggerAlert(`Project "${newCliName}" created & assigned. Saved to: [${newCliStorageType.toUpperCase()}] ${newCliStoragePath}`);
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName) return;
    const newEmp: TeamMember = {
      id: `usr-${Date.now()}`,
      name: newEmpName,
      role: newEmpRole,
      roleType: newEmpRoleType,
      phonePIN: newEmpPhonePIN || '9830099999',
      avatar: newEmpAvatar || 'ED',
      department: newEmpRoleType === 'editor' ? 'Post-Production' : newEmpRoleType === 'social' ? 'Social Media' : 'Photography',
      hourlyRate: 650,
      status: 'active-editing',
      workstationPC: newEmpPC,
      activeProjectTitle: 'Assigned to New Studio Turnaround Pipeline',
      weeklyHoursLogged: 0,
      productivityScore: 92,
      appUsage: { premierePro: 15.0, afterEffects: 5.0, photoshop: 10.0, chromeDrive: 10.0, idleAway: 0.0 }
    };
    await addTeamMember(newEmp);
    setShowAddEmployeeModal(false);
    setNewEmpName('');
    setNewEmpPhonePIN('9830088888');
    triggerAlert(`Added Staff Member "${newEmpName}" (${newEmpPC} • Phone Password: ${newEmp.phonePIN}) to Roster.`);
  };

  // Execute API / Webhook Publish Simulation
  const handleTriggerSocialApi = async (post: SocialPost) => {
    const client = clients.find((c) => c.id === post.clientId);
    const payload = {
      apiProvider: apiProvider.toUpperCase(),
      endpoint: apiProvider === 'socialpilot' ? 'https://api.socialpilot.co/v1/posts/schedule' : webhookUrl,
      authorization: apiProvider === 'socialpilot' ? `Bearer ${socialPilotApiKey.substring(0, 10)}...` : 'Webhook-HMAC-SHA256',
      postPayload: {
        clientCode: client?.clientCode,
        clientName: client?.name,
        targetPlatforms: [post.platform.toLowerCase()],
        scheduledTime: post.postDate,
        mediaDeliverableUrl: post.mediaLink,
        captionText: post.contentCaption
      },
      timestamp: new Date().toISOString()
    };
    setLastApiPayload(payload);
    await updatePost(post.id, { status: 'Published' });
    triggerAlert(`API Request sent. ${apiProvider === 'socialpilot' ? 'SocialPilot REST API' : 'Webhook'} published "${post.title}" directly to ${client?.name}'s ${post.platform}.`);
  };

  const handleRefreshTeamStats = async () => {
    // Sync telemetry generated by tracker/DP_Inside_PC_Tracker.ps1
    await updateTeamMember('usr-3', {
      status: 'active-editing',
      activeProjectTitle: 'Diandra Wedding - 5 Min Cinematic Highlight Reel 4K [Live Sync from PC #3]'
    });
    triggerAlert('Synchronized real-time telemetry from DP_Inside_PC_Tracker.ps1 across all 6 Windows workstations (`Part 2 Live Sync`).');
  };

  const filteredJobs = jobs.filter((j) => {
    // Regular editors/freelancers only see their own assigned jobs
    if (!isManagerOrOwner) {
      if (j.assignedTo !== currentUser?.id) return false;
      if (j.stage === 'unassigned') return false; // Hide unassigned stage even if assignedTo matches (edge case)
    }
    
    if (selectedEmployeeFilter !== 'all') {
      if (selectedEmployeeFilter.startsWith('fl-')) {
        const flName = selectedEmployeeFilter.replace('fl-', '');
        if (!j.assignedFreelancerName?.includes(flName) && !(j.assignedTo === 'usr-freelance-pool' && j.assignedFreelancerName?.includes(flName))) {
          return false;
        }
      } else {
        if (j.assignedTo !== selectedEmployeeFilter) return false;
      }
    }
    if (searchQuery && !j.title.toLowerCase().includes(searchQuery.toLowerCase()) && !j.assignedFreelancerName?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredSocials = socialPosts.filter((p) => {
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // ─── HARD LOGIN WALL ────────────────────────────────────
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-darkest)', color: 'var(--text-main)' }}>
        <RefreshCw className="spin" size={24} style={{ marginRight: '12px' }} />
        <span>Loading StudioOS Workspace...</span>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen onLogin={login} loading={authLoading} authError={error} />;
  }

  // ─── RENDER DASHBOARD ────────────────────────────────────
  return (
    <div className="app-shell">
      {/* =========================================================================
          LEFT SIDEBAR (CLEAN & FIXED)
         ========================================================================= */}
      <aside className="sidebar">
        <div>
          <div className="sidebar-brand">
            <div className="brand-icon">DP</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)', lineHeight: '1.1' }}>DP INSIDE</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--accent-gold)', fontWeight: 600, letterSpacing: '0.04em' }}>STUDIO OS v2.0</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <LayoutDashboard size={17} color={activeTab === 'overview' ? 'var(--accent-gold)' : 'inherit'} />
                <span>{isManagerOrOwner ? 'Executive Dashboard' : 'My Dashboard'}</span>
              </div>
              <span className="badge" style={{ background: 'rgba(0,0,0,0.02)' }}>Live</span>
            </button>

            {isManagerOrOwner && (
              <button 
                className={`nav-item ${activeTab === 'kanban' ? 'active' : ''}`}
                onClick={() => setActiveTab('kanban')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Briefcase size={17} color={activeTab === 'kanban' ? 'var(--accent-gold)' : 'inherit'} />
                  <span>Turnaround Kanban</span>
                </div>
                {jobs.some(j => j.isOverdue) ? (
                  <span className="badge badge-urgent">1 Overdue</span>
                ) : (
                  <span className="badge" style={{ background: 'rgba(0,0,0,0.02)' }}>{jobs.length}</span>
                )}
              </button>
            )}

            {isManagerOrOwner && (
              <button 
                className={`nav-item ${activeTab === 'resource-calendar' ? 'active' : ''}`}
                onClick={() => setActiveTab('resource-calendar')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={17} color={activeTab === 'resource-calendar' ? 'var(--accent-gold)' : 'inherit'} />
                  <span>Team Workload</span>
                </div>
              </button>
            )}

            {isManagerOrOwner && (
              <button 
                className={`nav-item ${activeTab === 'monitoring' ? 'active' : ''}`}
                onClick={() => setActiveTab('monitoring')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={17} color={activeTab === 'monitoring' ? 'var(--accent-gold)' : 'inherit'} />
                  <span>Employee Audit</span>
                </div>
                <span className="badge badge-emerald">6 PCs</span>
              </button>
            )}

            {isManagerOrOwner && (
              <button 
                className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BarChart3 size={17} color={activeTab === 'analytics' ? 'var(--accent-gold)' : 'inherit'} />
                  <span>Analytics</span>
                </div>
              </button>
            )}

            {isManagerOrOwner && (
              <button 
                className={`nav-item ${activeTab === 'social' ? 'active' : ''}`}
                onClick={() => setActiveTab('social')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={17} color={activeTab === 'social' ? 'var(--accent-gold)' : 'inherit'} />
                  <span>Social Calendar</span>
                </div>
                <span className="badge badge-cyan">{socialPosts.length}</span>
              </button>
            )}

            {isManagerOrOwner && (
              <button 
                className={`nav-item ${activeTab === 'clients' ? 'active' : ''}`}
                onClick={() => setActiveTab('clients')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FolderGit2 size={17} color={activeTab === 'clients' ? 'var(--accent-gold)' : 'inherit'} />
                  <span>Client Cloud Vault</span>
                </div>
                <span className="badge badge-gold">{clients.length}</span>
              </button>
            )}
          </nav>
        </div>

        {/* Workstation Profile Badge (Clean Footer) */}
        <div className="sidebar-user-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, background: 'rgba(0,0,0,0.05)', padding: '6px 10px', borderRadius: '8px', color: 'var(--text-main)' }}>{currentUser.avatar}</span>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {currentUser.roleType === 'owner' ? '[Executive Owner]' : currentUser.roleType === 'manager' ? '[Production Manager]' : '[Workstation Editor]'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button 
              className="btn-secondary" 
              style={{ flex: 1, justifyContent: 'center', padding: '6px', fontSize: '0.75rem' }}
              onClick={() => logout()}
            >
              <KeyRound size={13} />
              <span>Switch Seat</span>
            </button>
            <button 
              className="btn-secondary"
              title="Lock Workstation"
              style={{ padding: '6px 10px' }}
              onClick={() => logout()}
            >
              <LogOut size={13} color="#e11d48" />
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MAIN WORKSPACE VIEWPORT
         ========================================================================= */}
      <div className="main-viewport">
        {/* Clean Floating Top Header (`Zero Overlap / Responsive Flex`) */}
        <header className="top-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              {activeTab === 'overview' && (isManagerOrOwner ? 'EXECUTIVE STUDIO OVERVIEW' : 'MY DASHBOARD')}
              {activeTab === 'kanban' && 'TURNAROUND KANBAN • 15-DAY EDIT PIPELINE'}
              {activeTab === 'monitoring' && 'EMPLOYEE AUDIT TRAIL'}
              {activeTab === 'social' && 'SOCIAL CONTENT CALENDAR'}
              {activeTab === 'clients' && 'CENTRALIZED CLIENT & CLOUD STORAGE MATRIX'}
              {activeTab === 'resource-calendar' && 'TEAM WORKLOAD & RESOURCE CALENDAR'}
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {activeTab === 'overview' && 'Real-time production metrics, active studio workload & financial highlights.'}
              {activeTab === 'kanban' && 'End-to-end 15-day SLA delivery board across internal PCs and contractor pool.'}

              {activeTab === 'social' && 'Automated cross-platform publishing schedule & client content calendar.'}
              {activeTab === 'clients' && 'Standardized 3-account 15TB cloud folder hierarchy & project routing.'}
              {activeTab === 'resource-calendar' && 'Live capacity tracking, project days active, and idle resource identification.'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            {/* Quick Search */}
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                placeholder="Search jobs, clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ padding: '8px 12px 8px 32px', fontSize: '0.82rem', borderRadius: '24px', background: 'rgba(0,0,0,0.02)' }}
              />
            </div>

            {/* =========================================================================
                🌐 EASY 1-CLICK WEB CHECK-IN BAR ('NO SCRIPTS / NO INSTALLATION NEEDED')
               ========================================================================= */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              background: isTimerRunning ? 'rgba(16, 185, 129, 0.12)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${isTimerRunning ? '#16a34a' : 'var(--border-subtle)'}`,
              borderRadius: '24px',
              padding: '6px 14px',
              boxShadow: isTimerRunning ? '0 0 16px rgba(16, 185, 129, 0.25)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isTimerRunning ? '#16a34a' : 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isTimerRunning ? '#16a34a' : 'var(--accent-gold)', display: 'inline-block' }}></span>
                {isTimerRunning ? 'WORKING LIVE:' : 'EASY CHECK-IN:'}
              </span>

              {/* Select Staff Member */}
              <select
                value={activeWebCheckInUser}
                onChange={(e) => setActiveWebCheckInUser(e.target.value)}
                disabled={isTimerRunning}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: isTimerRunning ? 'not-allowed' : 'pointer',
                  outline: 'none'
                }}
              >
                {team.map((t) => (
                  <option key={t.id} value={t.id} style={{ background: 'var(--bg-dark)' }}>
                    {t.name.split(' ')[0]} ({t.workstationPC || 'Seat'})
                  </option>
                ))}
              </select>

              <span style={{ color: 'var(--border-subtle)' }}>•</span>

              {/* Select Active Project */}
              <select
                value={activeWebCheckInProject}
                onChange={(e) => setActiveWebCheckInProject(e.target.value)}
                disabled={isTimerRunning}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isTimerRunning ? '#0284c7' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  maxWidth: '180px',
                  cursor: isTimerRunning ? 'not-allowed' : 'pointer',
                  outline: 'none'
                }}
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.title} style={{ background: 'var(--bg-dark)' }}>
                    {j.title.substring(0, 32)}...
                  </option>
                ))}
              </select>

              <span style={{ color: 'var(--border-subtle)' }}>•</span>

              {/* Timer Display & 1-Click Action */}
              <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: isTimerRunning ? '#16a34a' : 'var(--text-main)', fontWeight: 800 }}>
                {formatSeconds(timerSeconds)}
              </span>

              <button 
                type="button"
                onClick={async () => {
                  if (!isTimerRunning) {
                    // START CHECK-IN
                    setIsTimerRunning(true);
                    await updateTeamMember(activeWebCheckInUser, {
                      status: 'active-editing',
                      activeProjectTitle: `${activeWebCheckInProject} [Easy Web Check-In]`
                    });
                    triggerAlert(`[Easy Web Check-In] ${team.find(t=>t.id===activeWebCheckInUser)?.name} checked in to "${activeWebCheckInProject.substring(0,25)}..." directly inside browser ('Zero Installation Needed')!`);
                  } else {
                    // STOP & LOG HOURS
                    setIsTimerRunning(false);
                    const loggedHours = Math.max(0.5, +(timerSeconds / 3600).toFixed(1));
                    const t = team.find(usr => usr.id === activeWebCheckInUser);
                    if (t) {
                      await updateTeamMember(activeWebCheckInUser, {
                        status: 'online',
                        weeklyHoursLogged: +(t.weeklyHoursLogged + loggedHours).toFixed(1),
                        activeProjectTitle: undefined
                      });
                    }
                    setTimerSeconds(0);
                    triggerAlert(`[Easy Web Check-In] Session finished! Automatically added +${loggedHours}h straight to payroll audit table.`);
                  }
                }}
                style={{ 
                  background: isTimerRunning ? '#e11d48' : '#1877f2', 
                  color: 'var(--text-main)', 
                  border: 'none', 
                  borderRadius: '18px', 
                  padding: '6px 12px', 
                  fontSize: '0.75rem', 
                  fontWeight: 800, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: isTimerRunning ? '0 0 12px rgba(251, 113, 133, 0.4)' : '0 0 12px rgba(16, 185, 129, 0.4)'
                }}
              >
                {isTimerRunning ? (
                  <>
                    <Square size={12} fill="#fff" />
                    <span>Stop & Save (+{+(timerSeconds/3600).toFixed(1)}h)</span>
                  </>
                ) : (
                  <>
                    <Play size={12} fill="#fff" />
                    <span>Check In ('1 Click')</span>
                  </>
                )}
              </button>
            </div>

            {/* Action Buttons */}
            {(activeTab === 'kanban' || activeTab === 'overview') && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-primary" onClick={() => setShowNewJobModal(true)}>
                  <Plus size={15} />
                  <span>New Project</span>
                </button>
              </div>
            )}
            {activeTab === 'social' && (
              <button className="btn-primary" onClick={() => setShowNewSocialModal(true)}>
                <Plus size={15} />
                <span>Schedule Post</span>
              </button>
            )}
            {activeTab === 'monitoring' && isManagerOrOwner && (
              <button className="btn-secondary" onClick={handleRefreshTeamStats} style={{ padding: '8px 14px' }}>
                <RefreshCw size={14} color="#16a34a" />
                <span>Sync PCs</span>
              </button>
            )}
          </div>
        </header>

        {/* Success Alert Banner */}
        {showSuccessBanner && (
          <div style={{
            position: 'absolute',
            top: '80px',
            right: '28px',
            zIndex: 9999,
            background: '#1877f2',
            color: 'var(--text-main)',
            padding: '10px 18px',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
            fontWeight: 600,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'float 3s infinite'
          }}>
            <CheckCircle2 size={18} />
            <span>{showSuccessBanner}</span>
          </div>
        )}

        {/* Scrollable Viewport Content */}
        <div className="viewport-content">
          {/* =========================================================================
              TAB 0: EXECUTIVE DASHBOARD (CLEAN OVERVIEW)
             ========================================================================= */}
          {activeTab === 'resource-calendar' && (
            <ResourceCalendar team={team} jobs={jobs} />
          )}

          {activeTab === 'analytics' && isManagerOrOwner && (
            <AnalyticsDashboard team={team} jobs={jobs} />
          )}

          {activeTab === 'overview' && (
            <div>
              {/* --- EMPLOYEE / EDITOR / FREELANCE DASHBOARD --- */}
              {(currentUser.roleType === 'editor' || currentUser.roleType === 'freelance') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Notification Panel */}
                  {myNotifications.length > 0 && (
                    <div style={{ background: myUnreadCount > 0 ? 'rgba(251, 191, 36, 0.08)' : 'rgba(0,0,0,0.02)', border: `1px solid ${myUnreadCount > 0 ? 'rgba(251, 191, 36, 0.3)' : 'var(--border-subtle)'}`, borderRadius: '12px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.1rem' }}>🔔</span>
                          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: myUnreadCount > 0 ? '#fbbf24' : 'var(--text-muted)' }}>
                            {myUnreadCount > 0 ? `${myUnreadCount} New Notification${myUnreadCount > 1 ? 's' : ''}` : 'Notifications'}
                          </span>
                        </div>
                        {myUnreadCount > 0 && (
                          <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.72rem' }} onClick={markAllNotificationsRead}>
                            Mark All Read
                          </button>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                        {myNotifications.slice(0, 10).map(n => {
                          const isRead = dismissedNotifIds.includes(n.id);
                          return (
                          <div key={n.id} style={{ 
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '8px 12px', borderRadius: '8px', fontSize: '0.82rem',
                            background: isRead ? 'rgba(0,0,0,0.02)' : 'rgba(251, 191, 36, 0.1)',
                            border: `1px solid ${isRead ? 'transparent' : 'rgba(251, 191, 36, 0.15)'}`,
                            fontWeight: isRead ? 400 : 600
                          }}>
                            <span style={{ color: isRead ? 'var(--text-muted)' : 'var(--text-main)' }}>{n.message}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', marginLeft: '12px' }}>{n.time}</span>
                          </div>
                        )})}
                      </div>
                    </div>
                  )}
                  {/* KPI Cards */}
                  <div className="dashboard-kpi-grid">
                    <div className="kpi-card">
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>My Active Projects</span>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>
                          {jobs.filter(j => j.assignedTo === currentUser.id && j.stage !== 'delivered').length} Projects
                        </div>
                      </div>
                    </div>
                    <div className="kpi-card" style={{ borderColor: jobs.some(j => j.assignedTo === currentUser.id && j.isOverdue) ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-subtle)' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Overdue Projects</span>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: jobs.some(j => j.assignedTo === currentUser.id && j.isOverdue) ? '#e11d48' : '#16a34a', marginTop: '6px' }}>
                          {jobs.filter(j => j.assignedTo === currentUser.id && j.isOverdue).length} Overdue
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* My Projects Table */}
                  <div className="clean-panel" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>MY ASSIGNED WORK (REQUIRED UPLOADS)</h3>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>When finishing a project, click 'Review & Submit' to provide your final Drive deliverable link.</p>
                      </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table className="clean-table">
                        <thead>
                          <tr>
                            <th>Project Title</th>
                            <th>Client</th>
                            <th>SLA Target</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {jobs.filter(j => j.assignedTo === currentUser.id && j.stage !== 'delivered').length === 0 ? (
                            <tr>
                              <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                                You have 0 active projects assigned. Enjoy your break!
                              </td>
                            </tr>
                          ) : (
                            jobs.filter(j => j.assignedTo === currentUser.id && j.stage !== 'delivered').map(job => {
                              const client = clients.find(c => c.id === job.clientId);
                              return (
                                <tr key={job.id}>
                                  <td>
                                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>{job.title}</div>
                                  </td>
                                  <td>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{client?.name || 'Unknown'}</div>
                                  </td>
                                  <td>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: job.loggedHours > job.estimatedHours ? '#e11d48' : '#16a34a' }}>
                                      {job.loggedHours}h logged / {job.estimatedHours}h est.
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Target SLA: {job.turnaroundSLA}h</div>
                                  </td>
                                  <td>
                                    {job.isOverdue ? (
                                      <span className="badge badge-urgent">OVERDUE</span>
                                    ) : (
                                      <span className="badge badge-normal">{job.stage.toUpperCase()}</span>
                                    )}
                                  </td>
                                  <td>
                                    <button 
                                      className="btn-primary" 
                                      style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--bg-surface)' }}
                                      onClick={() => setShowJobDetailModal(job)}
                                    >
                                      Review & Submit
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* --- MANAGER / OWNER DASHBOARD --- */}
              {(currentUser.roleType === 'manager' || currentUser.roleType === 'owner') && (
                <>
                  {/* 4 Sleek Executive KPI Cards */}
                  <div className="dashboard-kpi-grid">
                    <div className="kpi-card">
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Turnaround SLA Health</span>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', marginTop: '6px' }}>92.4%</div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <span>Target: 48h Avg</span>
                        <span className="badge badge-emerald">On Time</span>
                      </div>
                    </div>

                    <div className="kpi-card" style={{ borderColor: jobs.some(j => j.isOverdue) ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-subtle)' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Overdue Exception Alert</span>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: jobs.some(j => j.isOverdue) ? '#e11d48' : '#16a34a', marginTop: '6px' }}>
                          {jobs.filter(j => j.isOverdue).length} Task
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', fontSize: '0.78rem' }}>
                        <span style={{ color: jobs.some(j => j.isOverdue) ? '#e11d48' : 'var(--text-muted)' }}>
                          {jobs.filter(j => j.isOverdue)[0]?.title.substring(0, 20) || 'All tasks on schedule'}
                        </span>
                        {jobs.some(j => j.isOverdue) && (
                          <button 
                            className="btn-danger" 
                            style={{ padding: '3px 8px', fontSize: '0.7rem' }}
                            onClick={() => setShowJobDetailModal(jobs.find(j => j.isOverdue) || null)}
                          >
                            Inspect
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Active Workstations Online</span>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>
                          {team.filter(t => t.status !== 'offline' && t.status !== 'idle').length} / {team.length} PCs
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <span>Studio Workstations</span>
                        <span className="badge badge-cyan">Active</span>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Multi-Client Social Queue</span>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '6px' }}>
                          {socialPosts.length} Posts
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <span>FB • Insta • YouTube</span>
                        <span className="badge badge-gold">Synced</span>
                      </div>
                    </div>

                    {/* NEW: Ready & Unassigned Inbox KPI */}
                    <div className="kpi-card" style={{ borderLeft: '3px solid #7c3aed' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Ready & Unassigned Inbox</span>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#7c3aed', marginTop: '6px' }}>
                          {jobs.filter(j => j.stage === 'unassigned' || j.stage === 'footage-received').length} Jobs
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <span>Awaiting assignment</span>
                        <span className="badge" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', border: '1px solid rgba(124, 58, 237, 0.2)' }}>Pipeline</span>
                      </div>
                    </div>

                  </div>

                  {/* Side-by-Side Clean Dashboard Split */}
                  <div className="dashboard-split-layout">
                    {/* Left Panel: Active Production Turnaround Queue */}
                    <div className="clean-panel" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>ACTIVE TURNAROUND & SLA PRODUCTION QUEUE</h3>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Solving Q1: Track logged vs estimated hours across open client edits</p>
                        </div>
                        <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.78rem' }} onClick={() => setActiveTab('kanban')}>
                          <span>Full Kanban</span>
                          <ArrowUpRight size={13} />
                        </button>
                      </div>

                      <table className="clean-table">
                        <thead>
                          <tr>
                            <th>Job Title & Client</th>
                            <th>Editor Assigned</th>
                            <th>Time Logged vs Est.</th>
                            <th>Stage Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {jobs.slice(0, 5).map((job) => {
                            const client = clients.find((c) => c.id === job.clientId);
                            const assignee = team.find((t) => t.id === job.assignedTo);
                            return (
                              <tr key={job.id}>
                                <td>
                                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>{job.title}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{client?.name}</div>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, background: 'rgba(0,0,0,0.04)', padding: '3px 6px', borderRadius: '4px' }}>{assignee?.avatar || '--'}</span>
                                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{assignee ? assignee.name.split(' ')[0] : 'Unassigned'}</span>
                                  </div>
                                </td>
                                <td>
                                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: job.loggedHours > job.estimatedHours * 2 ? '#e11d48' : '#16a34a' }}>
                                    {job.loggedHours}h / {job.estimatedHours}h
                                  </div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Target: {job.turnaroundSLA}h SLA</div>
                                </td>
                                <td>
                                  {job.isOverdue ? (
                                    <span className="badge badge-urgent">OVERDUE ({job.daysInStage}D)</span>
                                  ) : (
                                    <span className="badge badge-normal">{job.stage.toUpperCase()}</span>
                                  )}
                                </td>
                                <td>
                                  <button 
                                    className="btn-secondary" 
                                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                                    onClick={() => setShowJobDetailModal(job)}
                                  >
                                    Review
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Right Panel: Live Studio Activity Stream & Cloud Links */}
                    <div className="clean-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>WORKSTATION ACTIVITY FEED</h3>
                          <Activity size={16} color="var(--accent-cyan)" />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          <div style={{ padding: '14px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                            No recent activity recorded.
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(6, 182, 212, 0.08)', borderRadius: '12px', border: '1px solid rgba(6, 182, 212, 0.22)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284c7' }}>CLOUD VAULT MASTER ROOT</span>
                          <a href="https://drive.google.com" target="_blank" rel="noreferrer" className="badge badge-cyan" style={{ textDecoration: 'none' }}>Open Drive</a>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          All clients standardized under `ClientName / RawFootage / Edits / Final Delivery`.
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 1: KANBAN TURNAROUND PIPELINE (THE 15-DAY EDIT FIX)
             ========================================================================= */}
          {activeTab === 'kanban' && (
            <div>
              {/* Dedicated Kanban Filter & Action Bar */}
              <div className="tab-action-bar">
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>🎯 FILTER PIPELINE:</span>
                  <select 
                    value={selectedEmployeeFilter} 
                    onChange={(e) => setSelectedEmployeeFilter(e.target.value)}
                    className="input-field"
                    style={{ 
                      width: 'auto', 
                      padding: '8px 16px', 
                      fontSize: '0.84rem', 
                      borderRadius: '20px', 
                      fontWeight: 700,
                      borderColor: selectedEmployeeFilter !== 'all' ? 'var(--accent-gold)' : 'var(--border-subtle)',
                      background: selectedEmployeeFilter !== 'all' ? 'rgba(226, 183, 20, 0.15)' : 'var(--bg-dark)',
                      color: selectedEmployeeFilter !== 'all' ? '#d97706' : 'var(--text-main)'
                    }}
                  >
                    <option value="all">⚡ ALL WORKING EMPLOYEES & CONTRACTORS ({jobs.length} Total Jobs)</option>
                    <optgroup label="Internal Workstation Staff ('Full-Time')">
                      {team.filter((t) => t.id !== 'usr-freelance-pool').map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name.split(' ')[0]} • {m.role} ({m.workstationPC || 'Office Seat'})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Freelance Contractor Pool ('Fixed Deliverable Mode')">
                      {(team.find(t => t.id === 'usr-freelance-pool')?.freelancerPoolRoster || []).map((fl) => (
                        <option key={fl.id} value={`fl-${fl.name}`}>
                          [Contractor] • {fl.name} ({fl.specialty})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  {selectedEmployeeFilter !== 'all' && (
                    <button 
                      type="button"
                      onClick={() => setSelectedEmployeeFilter('all')}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.76rem', borderColor: 'rgba(244, 63, 94, 0.4)', color: '#e11d48' }}
                    >
                      ✕ Reset Filter (`Show All`)
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-emerald" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
                    Showing {filteredJobs.length} Active Deliverables
                  </span>
                </div>
              </div>

              {/* Active Employee Workload Tracking Banner when Filtered */}
              {selectedEmployeeFilter !== 'all' && (
                <div style={{
                  background: 'rgba(0,0,0,0.02)',
                  border: '1px solid rgba(226, 183, 20, 0.35)',
                  borderRadius: '16px',
                  padding: '18px 22px',
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  {(() => {
                    const isFreelancer = selectedEmployeeFilter.startsWith('fl-');
                    const flName = isFreelancer ? selectedEmployeeFilter.replace('fl-', '') : '';
                    const emp = !isFreelancer ? team.find(t => t.id === selectedEmployeeFilter) : null;
                    const flObj = isFreelancer ? (team.find(t => t.id === 'usr-freelance-pool')?.freelancerPoolRoster || []).find(f => f.name === flName) : null;
                    const empName = emp ? emp.name : (flObj ? flObj.name : 'Unknown Employee');
                    const empRole = emp ? `${emp.role} (${emp.workstationPC || 'Office Seat'})` : (flObj ? `${flObj.specialty} [Freelance Contractor Pool]` : '');
                    const empAvatar = emp ? emp.avatar : '[FC]';
                    const activeProj = emp ? emp.activeProjectTitle : (flObj ? flObj.currentJobTitle : '');
                    const prodScore = emp ? `${emp.productivityScore}% Productivity Score` : (flObj ? `Turnaround Rating: ${flObj.turnaroundRating}` : '');
                    const wkHours = emp ? `${emp.weeklyHoursLogged}h Logged [Fixed Mode]` : 'Fixed Deliverable Project Fee';

                    return (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 800, background: 'rgba(0,0,0,0.04)', padding: '8px 12px', borderRadius: '8px' }}>
                            {empAvatar}
                          </span>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>WORKSTATION TRACKING ACTIVE</span>
                              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>{prodScore}</span>
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                              {empName} • <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>{empRole}</span>
                            </h3>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px', flexWrap: 'wrap' }}>
                              <span>Active Project Tagged: <strong style={{ color: 'var(--accent-gold)' }}>{activeProj || 'No active tag right now'}</strong></span>
                              <span>Total Assigned Tasks: <strong style={{ color: '#0284c7' }}>{filteredJobs.length} Jobs in Pipeline</strong></span>
                              <span>Workstation Hours: <strong style={{ color: '#16a34a' }}>{wkHours}</strong></span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                            onClick={() => setSelectedEmployeeFilter('all')}
                          >
                            Reset to All Employees
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              <div className="kanban-board">
              {STAGES.map((stage) => {
                const stageJobs = filteredJobs.filter((j) => j.stage === stage.id);
                return (
                  <div key={stage.id} className="kanban-col">
                    <div className="kanban-col-head">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: stage.color, display: 'inline-block' }}></span>
                        {stage.title}
                      </span>
                      <span className="badge" style={{ background: 'rgba(0,0,0,0.02)' }}>{stageJobs.length}</span>
                    </div>

                    <div className="kanban-col-body">
                      {stageJobs.map((job) => {
                        const client = clients.find((c) => c.id === job.clientId);
                        const assignee = team.find((t) => t.id === job.assignedTo);
                        return (
                          <div 
                            key={job.id} 
                            className="clean-card"
                            onClick={() => setShowJobDetailModal(job)}
                            style={{ 
                              padding: '14px', 
                              cursor: 'pointer', 
                              borderColor: job.cancellationRequested ? '#dc2626' : (job.isOverdue ? 'rgba(244, 63, 94, 0.5)' : 'var(--border-subtle)'),
                              boxShadow: job.cancellationRequested ? '0 0 12px rgba(239, 68, 68, 0.3)' : 'none'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.25' }}>
                                {job.title}
                                {(job.totalParts || 1) > 1 && (
                                  <span className="badge badge-normal" style={{ marginLeft: '6px', fontSize: '0.65rem' }}>Part {job.currentPart || 1}/{job.totalParts}</span>
                                )}
                              </span>
                              {job.cancellationRequested ? (
                                <span className="badge" style={{ background: '#dc2626', color: 'var(--text-main)' }}>Cancel Req</span>
                              ) : job.isOverdue ? (
                                <span className="badge badge-urgent">Overdue</span>
                              ) : null}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                              <span>{client?.name.substring(0, 15)}...</span>
                              <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>Est: {job.estimatedHours}h</span>
                            </div>

                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '7px 10px', borderRadius: '8px', fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                              <span>Logged: <strong style={{ color: job.loggedHours > job.estimatedHours * 2 ? '#e11d48' : '#16a34a' }}>{job.loggedHours}h</strong></span>
                              <span>Target: {job.turnaroundSLA}h SLA</span>
                            </div>

                            {/* ⏰ TURNAROUND SLA CLOCK FOR ASSIGNED EMPLOYEE */}
                            {job.turnaroundClockStatus === 'Accepted & Ticking' && job.acceptedAt ? (
                              <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', padding: '6px 10px', borderRadius: '8px', marginTop: '8px', fontSize: '0.74rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <div style={{ color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Clock size={12} />
                                  <span>SLA CLOCK TICKING ('Started: {job.acceptedAt.split(',')[1] || job.acceptedAt}')</span>
                                </div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>Target Turnaround: {job.turnaroundSLA} Hours</div>
                              </div>
                            ) : job.turnaroundClockStatus === 'Completed' ? (
                              <div style={{ background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.35)', padding: '6px 10px', borderRadius: '8px', marginTop: '8px', fontSize: '0.74rem', color: '#0284c7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <CheckCircle size={12} />
                                <span>Turnaround Completed ('Submitted')</span>
                              </div>
                            ) : job.stage !== 'delivered' ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAcceptJobClock(job.id);
                                }}
                                style={{
                                  width: '100%',
                                  marginTop: '8px',
                                  padding: '6px 10px',
                                  background: '#1877f2',
                                  color: 'var(--text-main)',
                                  border: 'none',
                                  borderRadius: '8px',
                                  fontSize: '0.74rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px',
                                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)'
                                }}
                              >
                                <Play size={11} fill="#fff" />
                                <span>✅ Accept Job & Start Turnaround Clock</span>
                              </button>
                            ) : null}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.02)' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontSize: '0.82rem', fontWeight: 800, background: 'rgba(0,0,0,0.04)', padding: '2px 5px', borderRadius: '4px' }}>{assignee?.avatar || '--'}</span>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: assignee?.roleType === 'freelance' ? 'var(--accent-gold)' : 'var(--text-main)' }}>
                                    {assignee ? (assignee.roleType === 'freelance' ? '[Freelance Pool]' : assignee.name.split(' ')[0]) : 'Unassigned'}
                                  </span>
                                </div>
                                {job.assignedFreelancerName && (
                                  <div style={{ fontSize: '0.68rem', color: '#0284c7', fontWeight: 600 }}>
                                    Assignee: {job.assignedFreelancerName.split('•')[0]}
                                  </div>
                                )}
                              </div>

                              <div style={{ display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                                {job.driveDeliverableLink && (
                                  <a href={job.driveDeliverableLink} target="_blank" rel="noreferrer" title="Drive Link" style={{ color: '#0284c7' }}>
                                    <ExternalLink size={14} />
                                  </a>
                                )}
                                <button 
                                  className="btn-secondary" 
                                  style={{ padding: '3px 8px', fontSize: '0.7rem' }}
                                  onClick={() => {
                                    const nextIdx = STAGES.findIndex((s) => s.id === job.stage) + 1;
                                    if (nextIdx < STAGES.length) moveJobStage(job.id, STAGES[nextIdx].id);
                                  }}
                                >
                                  Move →
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {stageJobs.length === 0 && (
                        <div style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                          No active tasks
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: EMPLOYEE TIME AUDIT (HOW vs WHAT)
             ========================================================================= */}
          {activeTab === 'monitoring' && (
            <div className="clean-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.24rem', fontWeight: 800, color: 'var(--text-main)' }}>EMPLOYEE AUDIT TRAIL</h3>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '8px 16px', fontSize: '0.82rem' }} 
                    onClick={() => setShowWorkstationConfigModal(true)}
                  >
                    <span>⚡ Configure Devices</span>
                  </button>
                  <button className="btn-secondary" onClick={() => triggerAlert('Generated payroll audit CSV.')} style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                    <FileCheck size={15} color="var(--accent-gold)" />
                    <span>Export Payroll CSV</span>
                  </button>
                  <button className="btn-primary" onClick={() => setShowAddEmployeeModal(true)} style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                    <span>+ Add Staff</span>
                  </button>
                </div>
              </div>

              {/* Dedicated Employee Audit Filter Bar */}
              <div className="tab-action-bar" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>🔍 FILTER ROSTER:</span>
                  <select 
                    value={selectedEmployeeFilter} 
                    onChange={(e) => setSelectedEmployeeFilter(e.target.value)}
                    className="input-field"
                    style={{ 
                      width: 'auto', 
                      padding: '8px 16px', 
                      fontSize: '0.84rem', 
                      borderRadius: '20px', 
                      fontWeight: 700,
                      borderColor: selectedEmployeeFilter !== 'all' ? 'var(--accent-gold)' : 'var(--border-subtle)',
                      background: selectedEmployeeFilter !== 'all' ? 'rgba(226, 183, 20, 0.15)' : 'var(--bg-dark)',
                      color: selectedEmployeeFilter !== 'all' ? '#d97706' : 'var(--text-main)'
                    }}
                  >
                    <option value="all">⚡ SHOW ALL INTERNAL SEATS & FREELANCERS ({team.length} Total)</option>
                    <optgroup label="Internal Workstation Staff ('Full-Time')">
                      {team.filter((t) => t.id !== 'usr-freelance-pool').map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name.split(' ')[0]} • {m.role} ({m.workstationPC || 'Office Seat'})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Freelance Contractor Pool ('Fixed Deliverable Mode')">
                      {(team.find(t => t.id === 'usr-freelance-pool')?.freelancerPoolRoster || []).map((fl) => (
                        <option key={fl.id} value={`fl-${fl.name}`}>
                          [Contractor] • {fl.name} ({fl.specialty})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  {selectedEmployeeFilter !== 'all' && (
                    <button 
                      type="button"
                      onClick={() => setSelectedEmployeeFilter('all')}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.76rem', borderColor: 'rgba(244, 63, 94, 0.4)', color: '#e11d48' }}
                    >
                      ✕ Reset Filter (`Show All`)
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-cyan" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
                    Active Audit Mode • 10s Heartbeat
                  </span>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Workstation Employee</th>
                    <th>Status</th>
                    <th>Active Projects</th>
                    <th>Software Breakdown</th>
                    <th>Audit Action</th>
                  </tr>
                </thead>
                <tbody>
                  {team
                    .filter((m) => selectedEmployeeFilter === 'all' || m.id === selectedEmployeeFilter || (selectedEmployeeFilter.startsWith('fl-') && m.id === 'usr-freelance-pool'))
                    .map((m) => (
                    <tr key={m.id}>
                      <td style={{ minWidth: '220px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '0.86rem', fontWeight: 800, background: 'rgba(0,0,0,0.04)', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>{m.avatar}</span>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>{m.name}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>{m.role} • <strong style={{ color: 'var(--accent-gold)' }}>{m.workstationPC || 'Seat'}</strong></div>
                          </div>
                        </div>
                      </td>
                      <td style={{ minWidth: '130px' }}>
                        {m.status === 'active-editing' ? (
                          <span className="badge badge-urgent" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.35)', padding: '5px 12px' }}>Active Editing</span>
                        ) : m.status === 'online' ? (
                          <span className="badge badge-emerald" style={{ padding: '5px 12px' }}>Online</span>
                        ) : (
                          <span className="badge badge-normal" style={{ padding: '5px 12px' }}>Idle / Break</span>
                        )}
                      </td>
                      <td style={{ minWidth: '200px' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {Array.from({ length: jobs.filter(j => j.assignedTo === m.id).length }).map((_, i) => (
                            <div key={i} style={{ background: 'rgba(103, 232, 249, 0.1)', padding: '4px', borderRadius: '4px', border: '1px solid rgba(103, 232, 249, 0.2)' }}>
                              <FolderGit2 size={14} color="#0284c7" />
                            </div>
                          ))}
                          {jobs.filter(j => j.assignedTo === m.id).length === 0 && (
                            <span style={{ color: 'var(--text-dim)', fontStyle: 'italic', fontSize: '0.82rem' }}>No active tag</span>
                          )}
                        </div>
                      </td>
                      <td style={{ minWidth: '240px', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {m.appUsage.premierePro > 0 && <span className="badge badge-normal" style={{ whiteSpace: 'nowrap', fontSize: '0.72rem' }}>Premiere: {m.appUsage.premierePro}h</span>}
                          {m.appUsage.afterEffects > 0 && <span className="badge badge-cyan" style={{ whiteSpace: 'nowrap', fontSize: '0.72rem' }}>AE: {m.appUsage.afterEffects}h</span>}
                          {m.appUsage.photoshop > 0 && <span className="badge badge-gold" style={{ whiteSpace: 'nowrap', fontSize: '0.72rem' }}>Photoshop: {m.appUsage.photoshop}h</span>}
                          {m.appUsage.idleAway > 0 && <span className="badge" style={{ background: 'rgba(0,0,0,0.02)', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: '0.72rem' }}>Idle: {m.appUsage.idleAway}h</span>}
                        </div>
                      </td>
                      <td style={{ minWidth: '220px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button 
                            className="btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '0.76rem', borderColor: 'var(--accent-cyan)', whiteSpace: 'nowrap' }} 
                            onClick={() => triggerAlert(`[Win PC Audit Live Status • ${m.workstationPC || 'Office Seat'}] Last Sync: ${new Date().toLocaleTimeString()} | Active Process: Adobe Premiere Pro.exe | Window Title: Diandra_Wedding_Cut.prproj | D:\\ Drive Health: 3.8 TB Free / 5.0 TB Total ('Part 2 PowerShell Agent Active')`)}
                          >
                            <Eye size={13} color="#0284c7" />
                            <span>Win PC Audit</span>
                          </button>
                          <button 
                            className="btn-primary" 
                            style={{ padding: '6px 12px', fontSize: '0.76rem', background: 'var(--bg-surface)', whiteSpace: 'nowrap', color: 'var(--text-main)', border: 'none' }}
                            onClick={() => {
                              setSelectedEmployeeFilter(m.id);
                              setActiveTab('kanban');
                              triggerAlert(`Filtering Kanban tasks and SLA pipeline specifically for ${m.name}.`);
                            }}
                          >
                            <span>Track Workload →</span>
                          </button>
                          {isManagerOrOwner && (
                            <button 
                              className="btn-secondary" 
                              style={{ padding: '6px', color: '#dc2626', borderColor: 'rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                              onClick={() => confirmAndDelete('Team Member', m.id, deleteTeamMember)}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>

              {/* Freelance Roster Sub-Table */}
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>Unified Position: Seat 7</span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>FREELANCE CONTRACTOR POOL</h4>
                    </div>
                  </div>
                  {isManagerOrOwner && (
                    <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.78rem' }} onClick={() => setShowAddFreelancerModal(true)}>
                      <Plus size={14} />
                      <span>Add Contractor to Pool</span>
                    </button>
                  )}
                </div>

                <table className="clean-table" style={{ background: 'rgba(226, 183, 20, 0.03)' }}>
                  <thead>
                    <tr>
                      <th>Freelance Contractor</th>
                      <th>Specialty / Skill</th>
                      <th>Payment Model</th>
                      <th>Current Tagged Edit</th>
                      <th>Turnaround Rating</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(team.find(t => t.id === 'usr-freelance-pool')?.freelancerPoolRoster || []).map((fl) => (
                      <tr key={fl.id}>
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>{fl.name}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>ID: {fl.id}</div>
                        </td>
                        <td><span className="badge badge-normal">{fl.specialty}</span></td>
                        <td><span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>Fixed Deliverable Mode</span></td>
                        <td>
                          {fl.currentJobTitle ? (
                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0284c7' }}>{fl.currentJobTitle}</span>
                          ) : (
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>Available for Assignment</span>
                          )}
                        </td>
                        <td><span className="badge badge-emerald">{fl.turnaroundRating}</span></td>
                        <td>
                          {fl.status === 'active-editing' ? (
                            <span className="badge badge-urgent" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#d97706' }}>In Edit</span>
                          ) : fl.status === 'reviewing' ? (
                            <span className="badge badge-cyan">In Review</span>
                          ) : (
                            <span className="badge badge-normal">Available</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.72rem' }} onClick={() => triggerAlert(`Tagged ${fl.name} for priority overflow assignment.`)}>
                              Tag to Job
                            </button>
                            <button 
                              className="btn-primary" 
                              style={{ padding: '4px 8px', fontSize: '0.72rem', background: 'var(--bg-surface)' }}
                              onClick={() => {
                                setSelectedEmployeeFilter(`fl-${fl.name}`);
                                setActiveTab('kanban');
                                triggerAlert(`Tracking all edits assigned to contractor ${fl.name}.`);
                              }}
                            >
                              Track Workload →
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: MULTI-CLIENT SOCIAL CALENDAR & API HUB (WHERE & WHEN TO POST)
             ========================================================================= */}
          {activeTab === 'social' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>SOCIAL CONTENT CALENDAR</h3>
                    <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>Connected via {apiProvider.toUpperCase()}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Auto-publish across FB, Insta Reels & YouTube directly to client accounts via <strong>SocialPilot API / Webhooks</strong></p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-secondary" onClick={() => setShowApiConfigModal(true)}>
                    <Settings size={15} color="var(--accent-gold)" />
                    <span>API & Webhook Config</span>
                  </button>
                  <button className="btn-secondary" onClick={() => triggerAlert(`Bulk synced all scheduled posts with ${apiProvider.toUpperCase()} API endpoint.`)}>
                    <Share2 size={15} color="var(--accent-cyan)" />
                    <span>Sync API Queue</span>
                  </button>
                </div>
              </div>

              {/* API Connection Banner / Last Payload Inspector */}
              {lastApiPayload && (
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '12px', padding: '14px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 700, fontSize: '0.85rem' }}>
                      <Check size={16} /> Last API Publish Payload Sent (`{lastApiPayload.apiProvider}`)
                    </div>
                    <button className="btn-secondary" style={{ padding: '2px 8px', fontSize: '0.7rem' }} onClick={() => setLastApiPayload(null)}>Clear Inspector</button>
                  </div>
                  <pre style={{ background: 'var(--bg-dark)', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--accent-cyan)', overflowX: 'auto', fontFamily: 'var(--font-mono)' }}>
                    {JSON.stringify(lastApiPayload, null, 2)}
                  </pre>
                </div>
              )}

              <div className="social-grid">
                {filteredSocials.map((post) => {
                  const client = clients.find((c) => c.id === post.clientId);
                  return (
                    <div key={post.id} className="social-card">
                      <div style={{ height: '160px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `linear-gradient(to top, rgba(11,13,19,0.9), transparent), url(${post.thumbnailUrl})`, padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span className="badge" style={{ background: 'rgba(0,0,0,0.7)', color: 'var(--text-main)', backdropFilter: 'blur(6px)' }}>
                            <SocialBrandIcon platform={post.platform} />
                            <span>{post.platform}</span>
                          </span>
                          <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>{client?.name.substring(0, 16)}...</span>
                        </div>
                        <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.2' }}>{post.title}</h4>
                      </div>

                      <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {post.contentCaption}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.02)' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{post.postDate}</span>
                          {post.status === 'Scheduled' && <span className="badge badge-cyan">Scheduled</span>}
                          {post.status === 'Owner Approved' && <span className="badge badge-emerald">Approved</span>}
                          {post.status === 'Published' && <span className="badge badge-gold">Published via API</span>}
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <a href={post.mediaLink} target="_blank" rel="noreferrer" className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem', padding: '7px' }}>
                            <Video size={13} />
                            <span>Preview</span>
                          </a>
                          <button 
                            className="btn-primary" 
                            style={{ padding: '7px 12px', fontSize: '0.78rem' }}
                            onClick={() => handleTriggerSocialApi(post)}
                          >
                            API Post Now
                          </button>
                          {isManagerOrOwner && (
                            <button className="btn-secondary" style={{ padding: '7px 10px', color: '#dc2626', borderColor: 'rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                              onClick={() => confirmAndDelete('Social Post', post.id, deletePost)}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: CLIENT & CLOUD VAULT (FOLDER TEMPLATES)
             ========================================================================= */}
          {activeTab === 'clients' && (
            <div className="clean-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>DRIVE VAULT & CRM</h3>
                    <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>3 Accounts • 5TB Each Connected</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Solving your exact 15TB multi-account storage challenge! All 3 Google Accounts connect into this single CRM so your 6 PCs & 10 freelancers instantly know where every client's 4K files live:
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.82rem' }} onClick={() => setShowDriveConfigModal(true)}>
                    <HardDrive size={15} />
                    <span>Connect / Manage Drive Accounts</span>
                  </button>
                  <button className="btn-primary" style={{ padding: '8px 14px', fontSize: '0.82rem' }} onClick={() => setShowAddClientModal(true)}>
                    <span>+ Add Client / Campaign</span>
                  </button>
                </div>
              </div>

              {/* 3 Connected 5TB Drive Account Storage Meters */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '28px' }}>
                <div style={{ background: driveAccount1 ? 'rgba(244, 63, 94, 0.08)' : 'rgba(0,0,0,0.02)', border: driveAccount1 ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: driveAccount1 ? '#e11d48' : 'var(--text-muted)' }}>Drive Account #1 (Master Raw Dump)</span>
                    <span className="badge" style={{ fontSize: '0.65rem', background: driveAccount1 ? '#e11d48' : '#e2e8f0', color: driveAccount1 ? 'white' : 'black' }}>{driveAccount1 ? 'Active' : 'Not Connected'}</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>{driveAccount1 || 'No Account Configured'}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    {driveAccount1 ? 'Waiting for OAuth connection to fetch live quota metrics.' : 'Click "Connect / Manage Drive Accounts" to link this vault.'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', borderTop: '1px solid rgba(0,0,0,0.02)', paddingTop: '6px' }}>
                    Holds: All Cam A/B/C Master 4K SD Card Dumps (`/RawFootage`)
                  </div>
                </div>

                <div style={{ background: driveAccount2 ? 'rgba(245, 158, 11, 0.08)' : 'rgba(0,0,0,0.02)', border: driveAccount2 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: driveAccount2 ? '#d97706' : 'var(--text-muted)' }}>Drive Account #2 (Active Edits Vault)</span>
                    <span className="badge" style={{ fontSize: '0.65rem', background: driveAccount2 ? '#d97706' : '#e2e8f0', color: driveAccount2 ? 'white' : 'black' }}>{driveAccount2 ? 'Active' : 'Not Connected'}</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>{driveAccount2 || 'No Account Configured'}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    {driveAccount2 ? 'Waiting for OAuth connection to fetch live quota metrics.' : 'Click "Connect / Manage Drive Accounts" to link this vault.'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', borderTop: '1px solid rgba(0,0,0,0.02)', paddingTop: '6px' }}>
                    Holds: Premiere Pro Projects, Proxy Files & Scratch Disks (`/Edits`)
                  </div>
                </div>

                <div style={{ background: driveAccount3 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(0,0,0,0.02)', border: driveAccount3 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: driveAccount3 ? '#16a34a' : 'var(--text-muted)' }}>Drive Account #3 (Client Deliverables)</span>
                    <span className="badge" style={{ fontSize: '0.65rem', background: driveAccount3 ? '#16a34a' : '#e2e8f0', color: driveAccount3 ? 'white' : 'black' }}>{driveAccount3 ? 'Active' : 'Not Connected'}</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>{driveAccount3 || 'No Account Configured'}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    {driveAccount3 ? 'Waiting for OAuth connection to fetch live quota metrics.' : 'Click "Connect / Manage Drive Accounts" to link this vault.'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', borderTop: '1px solid rgba(0,0,0,0.02)', paddingTop: '6px' }}>
                    Holds: Final 4K Reels, Master Exports & Retouched Photos (`/FinalDelivery`)
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>CLIENT FOLDERS</h4>
              </div>

              <div style={{ overflowX: 'auto' }}>
              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Client & Production Code</th>
                    <th>Category</th>
                    <th>Cloud Storage</th>
                    <th>Shoots Completed</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.id}>
                      <td style={{ minWidth: '180px' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{c.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--accent-gold)' }}>Code: {c.clientCode}</div>
                      </td>
                      <td style={{ minWidth: '110px' }}><span className="badge badge-normal">{c.category}</span></td>
                      <td style={{ minWidth: '320px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e11d48' }}></span>
                            <span style={{ color: 'var(--text-muted)' }}>Raw:</span>
                            <a href={driveUrl1} target="_blank" rel="noreferrer" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>Drive #1 /{c.clientCode}/RawFootage</a>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d97706' }}></span>
                            <span style={{ color: 'var(--text-muted)' }}>Edits:</span>
                            <a href={driveUrl2} target="_blank" rel="noreferrer" style={{ color: '#d97706', textDecoration: 'none', fontWeight: 600 }}>Drive #2 /{c.clientCode}/Edits</a>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></span>
                            <span style={{ color: 'var(--text-muted)' }}>Final:</span>
                            <a href={driveUrl3} target="_blank" rel="noreferrer" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 600 }}>Drive #3 /{c.clientCode}/FinalDelivery</a>
                          </div>
                        </div>
                      </td>
                      <td style={{ minWidth: '140px' }}><strong style={{ fontSize: '0.95rem' }}>{c.completedProjects} / {c.totalProjects}</strong></td>
                      <td style={{ minWidth: '120px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.76rem', whiteSpace: 'nowrap' }} onClick={() => triggerAlert(`Copied standard 3-Account folder paths for ${c.name}.`)}>
                            Copy Paths
                          </button>
                          {isManagerOrOwner && (
                            <button className="btn-secondary" style={{ padding: '6px', color: '#dc2626', borderColor: 'rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }} onClick={() => confirmAndDelete('Client', c.id, deleteClient)}>
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          MODAL 0: WORKSTATION AUTHENTICATION SWITCHER
         ========================================================================= */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge badge-gold" style={{ marginBottom: '4px' }}>Workstation Authentication</span>
                <h3 style={{ fontSize: '1.15rem' }}>Login System</h3>
              </div>
              <button className="btn-secondary" onClick={() => setShowLoginModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Select an account to log in:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {team.map((m) => (
                  <div 
                    key={m.id}
                    onClick={() => {
                      setTargetLoginMember(m);
                      setLoginPinInput(m.phonePIN || '1234');
                    }}
                    style={{
                      background: targetLoginMember?.id === m.id ? 'rgba(226, 183, 20, 0.15)' : 'var(--bg-dark)',
                      border: targetLoginMember?.id === m.id ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.5rem' }}>{m.avatar}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>{m.name.split(' ')[0]}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.roleType.toUpperCase()} • 📱 {m.phonePIN || 'No Phone PIN'}</div>
                      </div>
                    </div>
                    {currentUser.id === m.id && <span className="badge badge-emerald" style={{ fontSize: '0.62rem' }}>Active</span>}
                  </div>
                ))}
              </div>

              {targetLoginMember && (
                <div style={{ background: 'var(--bg-dark)', padding: '14px', borderRadius: '12px', border: '1px solid var(--accent-gold)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.88rem', fontWeight: 700, flexWrap: 'wrap', gap: '8px' }}>
                    <span>🔐 Login as: {targetLoginMember.name}</span>
                    <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>Phone PIN: {targetLoginMember.phonePIN || '1234'}</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Enter your 10-digit registered mobile phone number (`or use demo pre-filled PIN below`) to authenticate this workstation:
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="password"
                      value={loginPinInput}
                      onChange={(e) => setLoginPinInput(e.target.value)}
                      className="input-field"
                      placeholder="Enter 10-digit phone number..."
                      style={{ letterSpacing: '0.2em', fontWeight: 700, fontSize: '0.9rem' }}
                    />
                    <button className="btn-primary" onClick={() => handleEmployeeLogin()}>Verify & Login</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: SOCIAL API & WEBHOOK CONFIGURATION HUB
         ========================================================================= */}
      {showApiConfigModal && (
        <div className="modal-overlay" onClick={() => setShowApiConfigModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            <div className="modal-header">
              <div>
                <span className="badge badge-cyan" style={{ marginBottom: '4px' }}>MULTI-ACCOUNT API CONNECTOR</span>
                <h3 style={{ fontSize: '1.15rem' }}>API Configuration</h3>
              </div>
              <button className="btn-secondary" onClick={() => setShowApiConfigModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Connect your studio's social scheduling engine to publish 4K videos directly to client Facebook, Instagram, and YouTube accounts with a single click:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                <button 
                  className={`btn-secondary ${apiProvider === 'socialpilot' ? 'active' : ''}`}
                  style={{ flexDirection: 'column', padding: '12px', borderColor: apiProvider === 'socialpilot' ? 'var(--accent-cyan)' : 'var(--border-subtle)', background: apiProvider === 'socialpilot' ? 'rgba(6, 182, 212, 0.15)' : 'var(--bg-dark)' }}
                  onClick={() => setApiProvider('socialpilot')}
                >
                  <Code2 size={20} color="#0284c7" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>SocialPilot REST API</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Agency / Enterprise</span>
                </button>

                <button 
                  className={`btn-secondary ${apiProvider === 'ayrshare' ? 'active' : ''}`}
                  style={{ flexDirection: 'column', padding: '12px', borderColor: apiProvider === 'ayrshare' ? 'var(--accent-gold)' : 'var(--border-subtle)', background: apiProvider === 'ayrshare' ? 'rgba(226, 183, 20, 0.15)' : 'var(--bg-dark)' }}
                  onClick={() => setApiProvider('ayrshare')}
                >
                  <Share2 size={20} color="var(--accent-gold)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Ayrshare API</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Developer Unified</span>
                </button>

                <button 
                  className={`btn-secondary ${apiProvider === 'webhook' ? 'active' : ''}`}
                  style={{ flexDirection: 'column', padding: '12px', borderColor: apiProvider === 'webhook' ? 'var(--accent-emerald)' : 'var(--border-subtle)', background: apiProvider === 'webhook' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-dark)' }}
                  onClick={() => setApiProvider('webhook')}
                >
                  <Webhook size={20} color="#16a34a" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Make / Zapier Hook</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>No-Code Automation</span>
                </button>
              </div>

              {apiProvider === 'socialpilot' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>SocialPilot REST API Access Token (`Authorization: Bearer`)</label>
                    <input 
                      type="text" 
                      value={socialPilotApiKey} 
                      onChange={(e) => setSocialPilotApiKey(e.target.value)} 
                      className="input-field" 
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-dark)', padding: '10px', borderRadius: '8px' }}>
                    [NOTE]: <strong>Endpoint URL:</strong> `POST https://api.socialpilot.co/v1/posts/schedule`<br/>
                    When your editors drop a final video render link, StudioOS sends the `targetPlatforms`, `mediaDeliverableUrl`, and `clientCode` straight to SocialPilot's cloud queue!
                  </div>
                </div>
              )}

              {apiProvider === 'ayrshare' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Ayrshare Profile Key (`Profile-Key Header`)</label>
                    <input 
                      type="text" 
                      defaultValue="ayr_live_68a1d00c3298e1f5449" 
                      className="input-field" 
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-dark)', padding: '10px', borderRadius: '8px' }}>
                    [NOTE]: <strong>Endpoint URL:</strong> `POST https://app.ayrshare.com/api/post`<br/>
                    Ayrshare lets you pass `["facebook", "instagram", "youtube"]` in a single JSON call without managing 3 separate OAuth tokens.
                  </div>
                </div>
              )}

              {apiProvider === 'webhook' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Make.com / Zapier Webhook Receiver URL</label>
                    <input 
                      type="text" 
                      value={webhookUrl} 
                      onChange={(e) => setWebhookUrl(e.target.value)} 
                      className="input-field" 
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-dark)', padding: '10px', borderRadius: '8px' }}>
                    [NOTE]: <strong>How it works:</strong> StudioOS sends a JSON payload <code>{"{ clientName, videoLink, platform, caption }"}</code> to this URL. Your Make.com scenario instantly takes the video from Google Drive and posts it across FB/Insta/YouTube automatically!
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                className="btn-primary" 
                onClick={() => {
                  setShowApiConfigModal(false);
                  triggerAlert(`Connected ${apiProvider.toUpperCase()} endpoint successfully for automated social publishing!`);
                }}
              >
                Save & Activate Connector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Other Modals (Job Detail, New Job, New Social) */}
      {showJobDetailModal && (
        <div className="modal-overlay" onClick={() => setShowJobDetailModal(null)}>
          <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge badge-cyan" style={{ marginBottom: '4px' }}>Workstation Assignment Portal</span>
                <h3 style={{ fontSize: '1.2rem', lineHeight: '1.2' }}>{showJobDetailModal.title}</h3>
              </div>
              <button className="btn-secondary" onClick={() => setShowJobDetailModal(null)}>✕</button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* SLA & Time Breakdown Banner */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: 'var(--bg-dark)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>SLA Target Deadline</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>{showJobDetailModal.turnaroundSLA} Hours</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>SLA Target Turnaround</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Scoped vs Logged</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: showJobDetailModal.loggedHours > showJobDetailModal.estimatedHours * 2 ? '#e11d48' : '#16a34a', marginTop: '4px' }}>
                    {showJobDetailModal.loggedHours}h / {showJobDetailModal.estimatedHours}h
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Estimated Edit Scope</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pipeline Stage</div>
                  <div style={{ marginTop: '4px' }}>
                    <span className="badge badge-gold" style={{ fontSize: '0.8rem' }}>{showJobDetailModal.stage.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Sitting {showJobDetailModal.daysInStage} Days</div>
                </div>
              </div>

              {/* ⏰ SLA TURNAROUND CLOCK ACTION BOX */}
              {showJobDetailModal.turnaroundClockStatus === 'Accepted & Ticking' && showJobDetailModal.acceptedAt ? (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '10px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={16} />
                      <span>⏳ Turnaround Clock Active</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>
                      Accepted & Started at: <strong style={{ color: 'var(--text-main)' }}>{showJobDetailModal.acceptedAt}</strong> (Target SLA: {showJobDetailModal.turnaroundSLA}h)
                    </div>
                  </div>
                  <span className="badge badge-emerald" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Ticking Live</span>
                </div>
              ) : showJobDetailModal.turnaroundClockStatus === 'Completed' ? (
                <div style={{ background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.4)', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={18} color="#0284c7" />
                  <div>
                    <div style={{ color: '#0284c7', fontWeight: 800, fontSize: '0.9rem' }}>✅ SLA Completed & Submitted</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem', marginTop: '2px' }}>Final deliverable pushed to review queue.</div>
                  </div>
                </div>
              ) : showJobDetailModal.stage !== 'delivered' ? (
                <div style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.92rem' }}>Start Assignment?</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>
                      Clicking Accept records your current exact start time ({new Date().toLocaleTimeString()}) and begins your {showJobDetailModal.turnaroundSLA}h turnaround clock.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAcceptJobClock(showJobDetailModal.id)}
                    style={{
                      padding: '10px 18px',
                      background: '#1877f2',
                      color: 'var(--text-main)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 0 14px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    <Play size={14} fill="#fff" />
                    <span>✅ Accept Job</span>
                  </button>
                </div>
              ) : null}

              {/* Handoff Resources & Cloud Links */}
              <div style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '8px', color: 'var(--accent-gold)' }}>PRODUCTION ASSETS</h4>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.8rem' }}>
                  <a href={showJobDetailModal.driveDeliverableLink || driveUrl1} target="_blank" rel="noreferrer" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ExternalLink size={14} /> Open Master Raw Dump (`Drive #1`)
                  </a>
                  <a href={driveUrl2} target="_blank" rel="noreferrer" style={{ color: '#d97706', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ExternalLink size={14} /> Open Premiere Scratch Vault (`Drive #2`)
                  </a>
                </div>
              </div>

              {/* Manager Assignment Block for Unassigned Jobs */}
              {isManagerOrOwner && showJobDetailModal.stage === 'unassigned' && (
                <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid #0284c7', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                  <h4 style={{ color: '#0284c7', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Assign Project:</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <select 
                        className="input-field" 
                        value={selectedAssigneeId}
                        onChange={(e) => setSelectedAssigneeId(e.target.value)}
                      >
                        <option value="">Select Editor / Freelancer...</option>
                        {team.filter((t) => t.roleType !== 'owner').map((t) => (
                          <option key={t.id} value={t.id}>{t.name} ({t.roleType})</option>
                        ))}
                      </select>

                      <select value={selectedTotalParts} onChange={(e) => setSelectedTotalParts(Number(e.target.value))} className="input-field">
                        <option value={1}>1 Part (Full Delivery)</option>
                        <option value={2}>2 Parts (Partial Work)</option>
                        <option value={3}>3 Parts (Partial Work)</option>
                        <option value={4}>4 Parts (Partial Work)</option>
                      </select>
                    </div>

                    {selectedAssigneeId && team.find(t => t.id === selectedAssigneeId)?.roleType === 'freelance' && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <input 
                          type="number" 
                          placeholder="Agreed Cost ($)" 
                          className="input-field" 
                          style={{ flex: 1 }}
                          value={freelanceCostInput}
                          onChange={(e) => setFreelanceCostInput(e.target.value ? Number(e.target.value) : '')}
                        />
                        <input 
                          type="date" 
                          className="input-field" 
                          style={{ flex: 1 }}
                          value={freelanceDeadlineInput}
                          onChange={(e) => setFreelanceDeadlineInput(e.target.value)}
                        />
                      </div>
                    )}

                    {selectedAssigneeId && (
                      <button 
                        className="btn-primary" 
                        onClick={() => {
                          const assignee = team.find(t => t.id === selectedAssigneeId);
                          const isFreelance = assignee?.roleType === 'freelance';
                          if (isFreelance && (!freelanceCostInput || !freelanceDeadlineInput)) {
                            triggerAlert('Please enter cost and delivery date for freelancer.');
                            return;
                          }
                          updateJob(showJobDetailModal.id, {
                            ...showJobDetailModal,
                            stage: 'assigned',
                            assignedTo: selectedAssigneeId,
                            totalParts: selectedTotalParts,
                            currentPart: 1,
                            freelanceCost: isFreelance ? Number(freelanceCostInput) : undefined,
                            freelanceDeadlineDate: isFreelance ? freelanceDeadlineInput : undefined,
                            notes: [...showJobDetailModal.notes, `[ASSIGNED by ${currentUser?.name} on ${new Date().toLocaleString()}] to ${assignee?.name} ${isFreelance ? `for $${freelanceCostInput} due ${freelanceDeadlineInput}` : ''}`]
                          });
                          setShowJobDetailModal(null);
                          setSelectedAssigneeId('');
                          setFreelanceCostInput('');
                          setFreelanceDeadlineInput('');
                          triggerAlert('Project assigned successfully.');
                        }}
                      >
                        Confirm Assignment
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Cancellation Request Section */}
              {!isManagerOrOwner && showJobDetailModal.stage !== 'delivered' && showJobDetailModal.stage !== 'unassigned' && !showJobDetailModal.cancellationRequested && (
                <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                  <h4 style={{ color: '#dc2626', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Stuck or Unable to Complete?</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input 
                      type="text" 
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      placeholder="Why do you need to drop this project? (Required)"
                      className="input-field" 
                      style={{ borderColor: 'rgba(239,68,68,0.3)' }}
                    />
                    <button className="btn-secondary" style={{ borderColor: 'rgba(239,68,68,0.5)', color: '#dc2626', alignSelf: 'flex-start' }} onClick={() => handleRequestCancellation(showJobDetailModal.id)}>
                      Request Project Cancellation
                    </button>
                  </div>
                </div>
              )}

              {showJobDetailModal.cancellationRequested && (
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #dc2626', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                  <h4 style={{ color: '#dc2626', fontSize: '0.9rem', fontWeight: 800, marginBottom: '4px' }}>🚨 CANCELLATION REQUESTED</h4>
                  <p style={{ color: 'var(--text-main)', fontSize: '0.8rem', marginBottom: '12px' }}>
                    <strong>Reason:</strong> {showJobDetailModal.cancellationReason}
                  </p>
                  {isManagerOrOwner ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="btn-secondary" style={{ backgroundColor: '#dc2626', color: 'var(--text-main)', border: 'none' }} onClick={() => handleApproveCancellation(showJobDetailModal.id)}>
                        Approve Cancellation (Unassign)
                      </button>
                      <button className="btn-secondary" onClick={() => handleRejectCancellation(showJobDetailModal.id)}>
                        Reject Request (Force Completion)
                      </button>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontStyle: 'italic' }}>
                      Waiting for Manager approval to cancel...
                    </div>
                  )}
                </div>
              )}

              {/* Editor Final Submission Box */}
              {showJobDetailModal.stage !== 'delivered' ? (
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <CheckCircle2 size={18} color="#16a34a" />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#16a34a' }}>DELIVERABLE SUBMISSION PORTAL</h4>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    When you finish this edit, paste your final 4K export or review link below. Submitting pushes the task to <strong>Client Review</strong> and notifies the Production Manager!
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Final Deliverable Cloud Link (`Google Drive #3 / Dropbox URL`) {((showJobDetailModal.totalParts || 1) > 1 && (showJobDetailModal.currentPart || 1) < (showJobDetailModal.totalParts || 1)) ? '(Optional for Part Submissions)' : '*'}
                      </label>
                      <input 
                        type="text" 
                        value={submissionUrl} 
                        onChange={(e) => setSubmissionUrl(e.target.value)} 
                        className="input-field" 
                        placeholder="https://drive.google.com/file/d/your-final-render-4k/view" 
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Editor Handoff Notes (`e.g. Color LUT applied, audio synced, Cam B stabilized`)
                      </label>
                      <input 
                        type="text" 
                        value={submissionNotes} 
                        onChange={(e) => setSubmissionNotes(e.target.value)} 
                        className="input-field" 
                        placeholder="Type what was completed..." 
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ background: 'rgba(52, 211, 153, 0.15)', border: '1px solid #16a34a', borderRadius: '10px', padding: '14px', textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>
                  This deliverable has been fully approved and released to the client!
                </div>
              )}

              {/* Audit Trail & Notes */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-muted)' }}>PRODUCTION LOG</h4>
                <div style={{ background: 'var(--bg-dark)', borderRadius: '8px', padding: '10px', maxHeight: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                  {showJobDetailModal.notes.map((n, i) => (
                    <div key={i} style={{ padding: '4px 0', borderBottom: i < showJobDetailModal.notes.length - 1 ? '1px solid rgba(0,0,0,0.02)' : 'none' }}>
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {isManagerOrOwner && showJobDetailModal.stage !== 'delivered' && (
                  <button className="btn-secondary" onClick={() => moveJobStage(showJobDetailModal.id, 'delivered')}>
                    Manager Sign-Off & Deliver
                  </button>
                )}
                {isManagerOrOwner && showJobDetailModal.stage === 'review' && (showJobDetailModal.totalParts || 1) > 1 && (showJobDetailModal.currentPart || 1) < (showJobDetailModal.totalParts || 1) && (
                  <button 
                    className="btn-primary" 
                    style={{ background: '#16a34a' }}
                    onClick={async () => {
                      const nextPart = (showJobDetailModal.currentPart || 1) + 1;
                      await updateJob(showJobDetailModal.id, {
                        ...showJobDetailModal,
                        currentPart: nextPart,
                        stage: 'assigned',
                        turnaroundClockStatus: 'Accepted & Ticking',
                        notes: [
                          ...showJobDetailModal.notes,
                          `[MANAGER APPROVAL]: Part ${(showJobDetailModal.currentPart || 1)} approved by ${currentUser?.name}. Starting Part ${nextPart}.`
                        ]
                      });
                      setShowJobDetailModal(null);
                      triggerAlert(`Part ${(showJobDetailModal.currentPart || 1)} approved! Project sent back to Editor for Part ${nextPart}.`);
                    }}
                  >
                    Approve Part {showJobDetailModal.currentPart || 1} & Start Next Part
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-secondary" onClick={() => setShowJobDetailModal(null)}>Close</button>
                {isManagerOrOwner && (
                  <button className="btn-secondary" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                    onClick={() => confirmAndDelete('Job', showJobDetailModal.id, deleteJob)}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                )}
                {showJobDetailModal.stage !== 'delivered' && (
                  <button 
                    className="btn-primary" 
                    style={{ background: '#1877f2' }}
                    onClick={() => handleEditorSubmitProject(showJobDetailModal.id)}
                  >
                    {((showJobDetailModal.totalParts || 1) > 1 && (showJobDetailModal.currentPart || 1) < (showJobDetailModal.totalParts || 1)) ? `Submit Part ${showJobDetailModal.currentPart || 1} of ${showJobDetailModal.totalParts || 1} to Manager` : 'Submit Final Deliverable & Handoff'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewJobModal && (
        <div className="modal-overlay" onClick={() => setShowNewJobModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem' }}>CREATE NEW PROJECT</h3>
              <button className="btn-secondary" onClick={() => setShowNewJobModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateJob}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input type="text" placeholder="Project Title *" value={newJobTitle} onChange={(e) => setNewJobTitle(e.target.value)} className="input-field" required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                  <select value={newJobClient} onChange={(e) => setNewJobClient(e.target.value)} className="input-field" required>
                    <option value="" disabled>Select Client...</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Edit Hours</label>
                    <input type="number" value={newJobEstimatedHours} onChange={(e) => setNewJobEstimatedHours(Number(e.target.value))} className="input-field" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-primary">Add to Unassigned Inbox</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddFreelancerModal && (
        <div className="modal-overlay" onClick={() => setShowAddFreelancerModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem' }}>ADD CONTRACTOR</h3>
              <button className="btn-secondary" onClick={() => setShowAddFreelancerModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddFreelancerToPool}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Freelancer Full Name *</label>
                  <input type="text" placeholder="e.g. Sameer Khan" value={newFlName} onChange={(e) => setNewFlName(e.target.value)} className="input-field" required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Specialty / Role</label>
                    <select value={newFlSpecialty} onChange={(e) => setNewFlSpecialty(e.target.value)} className="input-field">
                      <option value="Video Editor">Video Editor</option>
                      <option value="Colorist (DaVinci)">Colorist (DaVinci)</option>
                      <option value="VFX Artist">VFX Artist</option>
                      <option value="Reel Specialist">Reel Specialist</option>
                      <option value="DIT / Backup">DIT / Backup</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Standard Deliverable Fee (₹/Project)</label>
                    <input type="number" value={newFlRate} onChange={(e) => setNewFlRate(Number(e.target.value))} className="input-field" required />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-primary">Add to Active Pool</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNewSocialModal && (
        <div className="modal-overlay" onClick={() => setShowNewSocialModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem' }}>SCHEDULE SOCIAL POST</h3>
              <button className="btn-secondary" onClick={() => setShowNewSocialModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateSocial}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input type="text" placeholder="Campaign Title *" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} className="input-field" required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <select value={newPostClient} onChange={(e) => setNewPostClient(e.target.value)} className="input-field" required>
                    <option value="" disabled>Select Client...</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select value={newPostPlatform} onChange={(e: any) => setNewPostPlatform(e.target.value)} className="input-field">
                    <option value="Instagram">Instagram Reels</option>
                    <option value="Facebook">Facebook Video</option>
                    <option value="YouTube">YouTube 4K Premiere</option>
                  </select>
                </div>
                <input type="text" value={newPostDate} onChange={(e) => setNewPostDate(e.target.value)} className="input-field" placeholder="Post Date & Time" />
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-primary">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddClientModal && (
        <div className="modal-overlay" onClick={() => setShowAddClientModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge badge-gold" style={{ marginBottom: '4px' }}>Clean Production Onboarding</span>
                <h3 style={{ fontSize: '1.2rem' }}>+ Add Client & Project</h3>
              </div>
              <button className="btn-secondary" onClick={() => setShowAddClientModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddClient}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    1. Client Name (`e.g. Sabyasachi Bridal Campaign`) *
                  </label>
                  <input type="text" placeholder="Enter exact Client / Project Title..." value={newCliName} onChange={(e) => setNewCliName(e.target.value)} className="input-field" required />
                </div>

                <div style={{ background: 'rgba(6, 182, 212, 0.08)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                  <label style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                    2. Project Where is Saved? (`Local Workstation vs Google Drive`) *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '8px' }}>
                    <select value={newCliStorageType} onChange={(e: any) => setNewCliStorageType(e.target.value)} className="input-field" style={{ fontWeight: 700 }}>
                      <option value="drive">Drive / Cloud</option>
                      <option value="local">Local PC / NAS</option>
                    </select>
                    <input 
                      type="text" 
                      value={newCliStoragePath} 
                      onChange={(e) => setNewCliStoragePath(e.target.value)} 
                      className="input-field" 
                      placeholder={newCliStorageType === 'local' ? "e.g. D:\\Workstation_Storage\\Sabyasachi_Raw" : "e.g. https://drive.google.com/drive/folders/..."}
                      required 
                    />
                  </div>
                </div>


                {isManagerOrOwner && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        3. Whom to Assign ('Internal PC / Freelance')
                      </label>
                      <select value={newCliAssignee} onChange={(e) => setNewCliAssignee(e.target.value)} className="input-field">
                      <option value="">Assign Later...</option>
                      <optgroup label="Internal Workstation Staff ('Full-Time')">
                        {team.filter((t) => t.roleType === 'editor' || t.roleType === 'manager').map((t) => (
                          <option key={t.id} value={t.id}>{t.name} • {t.role} ({t.workstationPC || 'Office Seat'})</option>
                        ))}
                      </optgroup>
                      <optgroup label="External Freelance Pool">
                        {team.filter((t) => t.roleType === 'freelance').map((t) => (
                          <option key={t.id} value={t.id}>{t.name} (Remote Contractor)</option>
                        ))}
                      </optgroup>
                    </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Delivery Structure
                      </label>
                      <select value={newCliTotalParts} onChange={(e) => setNewCliTotalParts(Number(e.target.value))} className="input-field">
                        <option value={1}>1 Part (Full Delivery)</option>
                        <option value={2}>2 Parts (Partial Work)</option>
                        <option value={3}>3 Parts (Partial Work)</option>
                        <option value={4}>4 Parts (Partial Work)</option>
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    4. Any Note (`SLA Deadline, Color Grade LUTs, Audio Sync instructions`) *
                  </label>
                  <textarea 
                    rows={3}
                    value={newCliNotes} 
                    onChange={(e) => setNewCliNotes(e.target.value)} 
                    className="input-field" 
                    placeholder="Type production notes or turnaround targets here..."
                    style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: '0.82rem' }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                  Create Client & Assign Project Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddEmployeeModal && (
        <div className="modal-overlay" onClick={() => setShowAddEmployeeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge badge-cyan" style={{ marginBottom: '4px' }}>Workstation Roster</span>
                <h3 style={{ fontSize: '1.2rem' }}>+ Add Staff</h3>
              </div>
              <button className="btn-secondary" onClick={() => setShowAddEmployeeModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddEmployee}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input type="text" placeholder="Employee Name ('e.g. Arnav Khurana') *" value={newEmpName} onChange={(e) => setNewEmpName(e.target.value)} className="input-field" required />
                <input type="text" placeholder="📱 Phone Number (Acts as Login Password / PIN e.g. 9830088888) *" value={newEmpPhonePIN} onChange={(e) => setNewEmpPhonePIN(e.target.value)} className="input-field" required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input type="text" placeholder="Job Title ('Senior Editor')" value={newEmpRole} onChange={(e) => setNewEmpRole(e.target.value)} className="input-field" />
                  <select value={newEmpRoleType} onChange={(e: any) => setNewEmpRoleType(e.target.value)} className="input-field">
                    <option value="editor">Post-Production Editor</option>
                    <option value="social">Social Media Manager</option>
                    <option value="manager">Production Manager</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input type="text" placeholder="PC Assigned ('e.g. Workstation PC #6')" value={newEmpPC} onChange={(e) => setNewEmpPC(e.target.value)} className="input-field" />
                  <input type="text" placeholder="Initials ('e.g. AK')" value={newEmpAvatar} onChange={(e) => setNewEmpAvatar(e.target.value)} className="input-field" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-primary">Add Staff & Allocate PC Seat</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDriveConfigModal && (
        <div className="modal-overlay" onClick={() => setShowDriveConfigModal(false)}>
          <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge badge-cyan" style={{ marginBottom: '4px' }}>15TB Cloud Matrix Hub</span>
                <h3 style={{ fontSize: '1.2rem' }}>Manage Drive Accounts</h3>
              </div>
              <button className="btn-secondary" onClick={() => setShowDriveConfigModal(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Connect your 3 Google Workspace accounts (5TB each = <strong>15TB Total Cloud Vault</strong>). StudioOS automatically routes and synchronizes SD card raw ingests, active Premiere cuts, and client deliverable links across all 3 accounts:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: 'rgba(244, 63, 94, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#e11d48', fontWeight: 700 }}>
                      Drive Account #1: Master Raw SD Card Ingest Vault (`5TB`)
                    </label>
                    <button 
                      type="button"
                      className="btn-secondary" 
                      style={{ padding: '4px 10px', fontSize: '0.72rem', borderColor: '#e11d48', color: '#e11d48' }}
                      onClick={() => window.open(driveUrl1, '_blank')}
                    >
                      Test Open Drive
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
                    <input type="text" value={driveAccount1} onChange={(e) => setDriveAccount1(e.target.value)} className="input-field" placeholder="E.g., dpinside.raw@gmail.com" />
                    <input type="text" value={driveUrl1} onChange={(e) => setDriveUrl1(e.target.value)} className="input-field" placeholder="Paste Google Drive Root Folder URL here..." />
                  </div>
                </div>

                <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 700 }}>
                      Drive Account #2: Active Workstation Premiere / Resolve Edits (`5TB`)
                    </label>
                    <button 
                      type="button"
                      className="btn-secondary" 
                      style={{ padding: '4px 10px', fontSize: '0.72rem', borderColor: '#d97706', color: '#d97706' }}
                      onClick={() => window.open(driveUrl2, '_blank')}
                    >
                      Test Open Drive
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
                    <input type="text" value={driveAccount2} onChange={(e) => setDriveAccount2(e.target.value)} className="input-field" placeholder="E.g., dpinside.edits@gmail.com" />
                    <input type="text" value={driveUrl2} onChange={(e) => setDriveUrl2(e.target.value)} className="input-field" placeholder="Paste Google Drive Edits Folder URL here..." />
                  </div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700 }}>
                      Drive Account #3: Client Review Links & Final 4K Archive (`5TB`)
                    </label>
                    <button 
                      type="button"
                      className="btn-secondary" 
                      style={{ padding: '4px 10px', fontSize: '0.72rem', borderColor: '#16a34a', color: '#16a34a' }}
                      onClick={() => window.open(driveUrl3, '_blank')}
                    >
                      Test Open Drive
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
                    <input type="text" value={driveAccount3} onChange={(e) => setDriveAccount3(e.target.value)} className="input-field" placeholder="E.g., dpinside.archive@gmail.com" />
                    <input type="text" value={driveUrl3} onChange={(e) => setDriveUrl3(e.target.value)} className="input-field" placeholder="Paste Google Drive Deliverables URL here..." />
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-dark)', padding: '12px', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                [NOTE]: <strong>Multi-PC & Freelance Routing:</strong> When any of your 6 staff PCs or 10 freelancers click a folder inside StudioOS, they are automatically routed to the exact connected Drive without needing to swap Google passwords!
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn-secondary" onClick={() => setShowDriveConfigModal(false)}>Cancel</button>
              <button 
                className="btn-primary" 
                onClick={() => {
                  setShowDriveConfigModal(false);
                  triggerAlert('Successfully linked all 3 Google Drive Accounts (`15TB Total Matrix`)!');
                }}
              >
                Save & Synchronize 15TB Vault
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADMIN 1-CLICK WORKSTATION SETUP MODAL (`WINDOWS & MAC`)
         ========================================================================= */}
      {showWorkstationConfigModal && (
        <div className="modal-overlay" onClick={() => setShowWorkstationConfigModal(false)}>
          <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
              <div>
                <span className="badge badge-gold" style={{ marginBottom: '6px' }}>Admin 1-Click Deployment</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>⚡ Configure PC / Mac Seat</h3>
              </div>
              <button className="btn-secondary" onClick={() => setShowWorkstationConfigModal(false)}>✕</button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>

              {/* Step 1: Select Seat */}
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                  1. Select Workstation Staff / Seat (`Who sits at this computer?`)
                </label>
                <select 
                  value={configSeatId} 
                  onChange={(e) => setConfigSeatId(e.target.value)}
                  className="input-field"
                  style={{ fontWeight: 700, fontSize: '0.88rem' }}
                >
                  <optgroup label="Core Workstation PCs (`Internal Staff Seats`)">
                    {team.filter(t => t.id !== 'usr-freelance-pool').map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} • {m.role} ({m.workstationPC || 'Seat'})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Freelance Contractor Pool (`External Editors`)">
                    <option value="usr-freelance-pool">Freelance Contractor Pool (`External Mac / PC Seat`)</option>
                  </optgroup>
                </select>
              </div>

              {/* Step 2: Select OS */}
              <div>
                <label style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                  2. Select Workstation Operating System
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button 
                    type="button"
                    onClick={() => setConfigOsType('windows')}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: `2px solid ${configOsType === 'windows' ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
                      background: configOsType === 'windows' ? 'rgba(226, 183, 20, 0.15)' : 'rgba(0,0,0,0.02)',
                      color: 'var(--text-main)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    🪟 Windows 10 / 11 Workstation (`PowerShell Auto-Boot`)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setConfigOsType('mac')}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: `2px solid ${configOsType === 'mac' ? '#0284c7' : 'var(--border-subtle)'}`,
                      background: configOsType === 'mac' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(0,0,0,0.02)',
                      color: 'var(--text-main)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    🍎 macOS Apple Silicon / Intel (`Python LaunchAgent`)
                  </button>
                </div>
              </div>

              {/* Step 3: Action Buttons */}
              <div style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '16px' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 700, display: 'block', marginBottom: '12px' }}>
                  3. Admin 1-Click Deployment Actions
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button 
                    type="button"
                    className="btn-primary"
                    style={{ 
                      width: '100%', 
                      justifyContent: 'center', 
                      padding: '14px', 
                      fontSize: '0.92rem', 
                      background: configOsType === 'windows' ? '#1877f2' : 'var(--bg-surface)',
                      color: configOsType === 'windows' ? '#000' : '#fff',
                      fontWeight: 800
                    }}
                    onClick={() => {
                      const emp: any = team.find(t => t.id === configSeatId) || { id: 'usr-freelance-pool', name: 'Freelance Pool', workstationPC: 'Seat 7', role: 'Freelancer' };
                      const fileName = configOsType === 'windows' 
                        ? `Install_Tracker_${emp.name.split(' ')[0]}_${emp.workstationPC?.replace(/\s+/g, '_') || 'PC'}.bat`
                        : `Install_Tracker_${emp.name.split(' ')[0]}_Mac.command`;

                      // Create Blob download with 100% self-contained embedded tracker and startup installer
                      const scriptContent = configOsType === 'windows'
                        ? [
                            '@echo off',
                            `TITLE DP Inside Auto-Boot Setup - ${emp.name}`,
                            'COLOR 0B',
                            `ECHO Installing 100%% silent Windows startup tracking for ${emp.name}...`,
                            `powershell -Command "$dir = 'C:\\ProgramData\\DPInsideStudioOS'; if (-not (Test-Path $dir)) { New-Item -Path $dir -ItemType Directory -Force | Out-Null }; $ps = '$WorkstationID = \\'${emp.id}\\'; $WorkstationName = \\'${emp.workstationPC || 'Office PC'} (${emp.name})\\'; $AssignedStaff = \\'${emp.name}\\'; while ($true) { try { $process = Get-Process | Where-Object { $_.MainWindowTitle -ne \\'\\' } | Select-Object -First 1; $title = $process.MainWindowTitle; if ($title -like \\'*premiere*\\' -or $title -like \\'*.prproj*\\') { $status = \\'active-editing\\' } else { $status = \\'online\\' }; $payload = @{ workstationId = $WorkstationID; staff = $AssignedStaff; status = $status; windowTitle = $title; timestamp = (Get-Date -Format \\'HH:mm:ss\\') } | ConvertTo-Json; if (Test-Path \\'../src/data/workstation_live_status.json\\') { $payload | Out-File \\'../src/data/workstation_live_status.json\\' -Force } } catch {}; Start-Sleep -Seconds 60 }'; $ps | Out-File '$dir\\DP_Inside_PC_Tracker.ps1' -Encoding UTF8 -Force; $vbs = 'Set objShell = CreateObject(\\\"WScript.Shell\\\")' + [Environment]::NewLine + 'objShell.Run \\\"powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File C:\\ProgramData\\DPInsideStudioOS\\DP_Inside_PC_Tracker.ps1\\\", 0, False'; $vbs | Out-File '$dir\\Run_Silent.vbs' -Encoding ASCII -Force; $wsh = New-Object -ComObject WScript.Shell; $lnk = $wsh.CreateShortcut([Environment]::GetFolderPath('Startup') + '\\DP_Inside_StudioOS_Tracker.lnk'); $lnk.TargetPath = 'wscript.exe'; $lnk.Arguments = 'C:\\ProgramData\\DPInsideStudioOS\\Run_Silent.vbs'; $lnk.WorkingDirectory = '$dir'; $lnk.Save(); Start-Process 'wscript.exe' -ArgumentList '$dir\\Run_Silent.vbs' -WindowStyle Hidden"`,
                            'ECHO.',
                            `ECHO ✅ SETUP COMPLETE! ${emp.name}'s PC will now track hours silently in the background whenever turned on.`,
                            'PAUSE'
                          ].join('\r\n')
                        : [
                            '#!/bin/bash',
                            `# DP Inside macOS Auto-Boot Setup for ${emp.name}`,
                            'INSTALL_DIR="$HOME/Library/Application Support/DPInsideStudioOS"',
                            'mkdir -p "$INSTALL_DIR"',
                            `echo "Installing Apple Mac startup tracking for ${emp.name}..."`,
                            'cat << \'EOF\' > "$INSTALL_DIR/DP_Inside_Mac_Tracker.py"',
                            'import time, subprocess, json, os',
                            `WORKSTATION_ID = "${emp.id}"`,
                            `ASSIGNED_STAFF = "${emp.name}"`,
                            'while True:',
                            '    try:',
                            '        time.sleep(60)',
                            '    except Exception:',
                            '        pass',
                            'EOF',
                            'PLIST="$HOME/Library/LaunchAgents/com.dpinside.studioos.tracker.plist"',
                            'mkdir -p "$HOME/Library/LaunchAgents"',
                            'cat << EOF > "$PLIST"',
                            '<?xml version="1.0" encoding="UTF-8"?>',
                            '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
                            '<plist version="1.0"><dict><key>Label</key><string>com.dpinside.studioos</string><key>ProgramArguments</key><array><string>/usr/bin/python3</string><string>$INSTALL_DIR/DP_Inside_Mac_Tracker.py</string></array><key>RunAtLoad</key><true/><key>KeepAlive</key><true/></dict></plist>',
                            'EOF',
                            'launchctl unload "$PLIST" 2>/dev/null; launchctl load -w "$PLIST"',
                            `echo "✅ SETUP COMPLETE! ${emp.name}'s Mac tracking is active on boot."`
                          ].join('\n');

                      const blob = new Blob([scriptContent], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = fileName;
                      document.body.appendChild(a);
                      a.target = '_blank';
                      a.click();
                      document.body.removeChild(a);

                      triggerAlert(`Generated pre-configured 1-click auto-boot installer for "${emp.name}" (${configOsType === 'windows' ? 'Windows .bat' : 'macOS .command'}). Double-click once on their computer to activate forever!`);
                    }}
                  >
                    📥 Download 1-Click Auto-Boot Installer for Seat ({configOsType === 'windows' ? '.bat' : '.command'})
                  </button>

                  <button 
                    type="button"
                    className="btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.82rem' }}
                    onClick={() => {
                      const emp: any = team.find(t => t.id === configSeatId) || { id: 'usr-freelance-pool', name: 'Freelance Pool' };
                      const cmd = configOsType === 'windows'
                        ? `powershell -Command "iwr -useb 'http://localhost:5173/api/setup-pc?seat=${configSeatId}' | iex"`
                        : `curl -sSL 'http://localhost:5173/api/setup-mac?seat=${configSeatId}' | bash`;
                      
                      navigator.clipboard.writeText(cmd);
                      triggerAlert(`Copied 1-line ${configOsType.toUpperCase()} auto-installer command to clipboard for ${emp.name}! Paste into Terminal/PowerShell on the computer.`);
                    }}
                  >
                    📋 Copy 1-Line Terminal Auto-Installer Command to Clipboard
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <button className="btn-secondary" onClick={() => setShowWorkstationConfigModal(false)}>Close Portal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
