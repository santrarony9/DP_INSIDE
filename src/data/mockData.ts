import type { TeamMember, Client, JobCard, SocialPost, TimeLogEntry } from '../types';

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'usr-saurav',
    name: 'Saurav Banerjee',
    role: 'Owner & Creative Director',
    roleType: 'owner',
    phonePIN: '9830011111',
    avatar: 'SB',
    department: 'Management',
    hourlyRate: 1500,
    status: 'online',
    workstationPC: 'Executive Workstation #1',
    weeklyHoursLogged: 42.5,
    productivityScore: 98,
    appUsage: { premierePro: 4, afterEffects: 2, photoshop: 3, chromeDrive: 28, idleAway: 5.5 }
  },
  {
    id: 'usr-aditya',
    name: 'Aditya Sharma',
    role: 'Production Manager',
    roleType: 'manager',
    phonePIN: '9830022222',
    avatar: 'AS',
    department: 'Management',
    hourlyRate: 850,
    status: 'online',
    workstationPC: 'Production Hub #2',
    weeklyHoursLogged: 44.0,
    productivityScore: 95,
    appUsage: { premierePro: 6, afterEffects: 0, photoshop: 2, chromeDrive: 33, idleAway: 3 }
  },
  {
    id: 'usr-piyali',
    name: 'Piyali Das',
    role: 'Senior Video Editor',
    roleType: 'editor',
    phonePIN: '9830033333',
    avatar: 'PD',
    department: 'Post-Production',
    hourlyRate: 650,
    status: 'active-editing',
    workstationPC: 'Workstation PC #3',
    activeProjectTitle: 'Diandra Wedding - 5 Min Cinematic Highlight Reel 4K',
    activeJobId: 'job-101',
    weeklyHoursLogged: 38.5,
    productivityScore: 82,
    appUsage: { premierePro: 24.5, afterEffects: 8.0, photoshop: 1.5, chromeDrive: 3.5, idleAway: 1.0 }
  },
  {
    id: 'usr-rohan',
    name: 'Rohan Verma',
    role: 'Lead Colorist & VFX',
    roleType: 'editor',
    phonePIN: '9830044444',
    avatar: 'RV',
    department: 'Post-Production',
    hourlyRate: 600,
    status: 'active-editing',
    workstationPC: 'Workstation PC #4 (DaVinci Suite)',
    activeProjectTitle: 'TechCorp Q3 Product Launch Commercial Cut',
    activeJobId: 'job-102',
    weeklyHoursLogged: 39.0,
    productivityScore: 94,
    appUsage: { premierePro: 15.0, afterEffects: 18.5, photoshop: 3.0, chromeDrive: 2.0, idleAway: 0.5 }
  },
  {
    id: 'usr-sneha',
    name: 'Sneha Kapoor',
    role: 'Lead Photo Retoucher',
    roleType: 'editor',
    phonePIN: '9830055555',
    avatar: 'SK',
    department: 'Photography',
    hourlyRate: 500,
    status: 'idle',
    workstationPC: 'Workstation PC #5',
    weeklyHoursLogged: 36.0,
    productivityScore: 91,
    appUsage: { premierePro: 0, afterEffects: 0, photoshop: 31.0, chromeDrive: 3.5, idleAway: 1.5 }
  },
  {
    id: 'usr-vikram',
    name: 'Vikram Mehta',
    role: 'Social Media & Content Lead',
    roleType: 'social',
    phonePIN: '9830066666',
    avatar: 'VM',
    department: 'Social Media',
    hourlyRate: 550,
    status: 'online',
    workstationPC: 'Workstation PC #6',
    weeklyHoursLogged: 40.0,
    productivityScore: 93,
    appUsage: { premierePro: 2.0, afterEffects: 1.0, photoshop: 10.0, chromeDrive: 25.0, idleAway: 2.0 }
  },
  {
    id: 'usr-freelance-pool',
    name: 'Freelance Editor Pool [Seat 7]',
    role: 'External Contractor Roster (7-10 Editors)',
    roleType: 'freelance',
    phonePIN: '9830077777',
    avatar: 'FP',
    department: 'Freelance Contractor Pool',
    hourlyRate: 750,
    status: 'active-editing',
    workstationPC: 'External Remote Access',
    activeProjectTitle: 'Multiple External Client Edits & Overflows',
    weeklyHoursLogged: 114.5,
    productivityScore: 89,
    appUsage: { premierePro: 65.0, afterEffects: 28.0, photoshop: 12.0, chromeDrive: 9.5, idleAway: 0.0 },
    freelancerPoolRoster: [
      { id: 'fl-1', name: 'Rahul Bose', specialty: 'Reel Specialist', hourlyRate: 700, status: 'active-editing', currentJobTitle: 'Café Vibe Viral Reels Batch #2', turnaroundRating: '24h Fast' },
      { id: 'fl-2', name: 'Amit Chhetri', specialty: 'Colorist (DaVinci)', hourlyRate: 900, status: 'active-editing', currentJobTitle: 'Diandra Wedding Cam C Color Grading', turnaroundRating: '36h Avg' },
      { id: 'fl-3', name: 'Priya Nair', specialty: 'VFX Artist', hourlyRate: 1100, status: 'available', turnaroundRating: '48h Avg' },
      { id: 'fl-4', name: 'Tanmay Ghosh', specialty: 'Video Editor', hourlyRate: 650, status: 'active-editing', currentJobTitle: 'FitPulse Trainer Social Cut', turnaroundRating: '24h Fast' },
      { id: 'fl-5', name: 'Kiran Rao', specialty: 'DIT / Backup', hourlyRate: 500, status: 'available', turnaroundRating: '12h Express' },
      { id: 'fl-6', name: 'Arjun Sen', specialty: 'Video Editor', hourlyRate: 800, status: 'reviewing', currentJobTitle: 'TechCorp Keynote B-Roll Rough Cut', turnaroundRating: '48h Avg' },
      { id: 'fl-7', name: 'Shruti Patel', specialty: 'Reel Specialist', hourlyRate: 600, status: 'available', turnaroundRating: '24h Fast' },
      { id: 'fl-8', name: 'Manish Verma', specialty: 'Video Editor', hourlyRate: 750, status: 'active-editing', currentJobTitle: 'TechCorp CEO Keynote B-Roll Sync', turnaroundRating: '36h Avg' }
    ]
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-diandra',
    name: 'Diandra & Kabir Wedding',
    clientCode: 'DIA-WED-26',
    category: 'Luxury Wedding',
    folderStatus: 'complete',
    driveUrl: 'https://drive.google.com/drive/folders/dp-inside-diandra-raw-4k',
    dropboxUrl: 'https://www.dropbox.com/sh/diandra-wedding-master-deliverables',
    contractStatus: 'Signed',
    totalProjects: 6,
    completedProjects: 3,
    socialPlatforms: { facebook: true, instagram: true, youtube: true },
    contactPerson: 'Diandra Mukherjee',
    phone: '+91 98300 45120',
    projectFee: 180000,
    advancePaid: 90000
  },
  {
    id: 'cli-techcorp',
    name: 'TechCorp India Pvt Ltd',
    clientCode: 'TCI-Q3-COM',
    category: 'Commercial Brand',
    folderStatus: 'complete',
    driveUrl: 'https://drive.google.com/drive/folders/dp-inside-techcorp-commercial',
    dropboxUrl: 'https://www.dropbox.com/sh/techcorp-deliverables-v2',
    contractStatus: 'Signed',
    totalProjects: 8,
    completedProjects: 6,
    socialPlatforms: { facebook: true, instagram: true, youtube: true },
    contactPerson: 'Arunav Roy (CMO)',
    phone: '+91 98112 33490',
    projectFee: 250000,
    advancePaid: 250000
  },
  {
    id: 'cli-cafevibe',
    name: 'Café Vibe & Roastery',
    clientCode: 'CFV-SOC-26',
    category: 'Hospitality & F&B',
    folderStatus: 'missing-contracts',
    driveUrl: 'https://drive.google.com/drive/folders/dp-inside-cafevibe-monthly',
    dropboxUrl: 'https://www.dropbox.com/sh/cafevibe-instagram-reels',
    contractStatus: 'Pending Approval',
    totalProjects: 4,
    completedProjects: 1,
    socialPlatforms: { facebook: true, instagram: true, youtube: false },
    contactPerson: 'Siddharth Bose',
    phone: '+91 99034 88710',
    projectFee: 45000,
    advancePaid: 20000
  },
  {
    id: 'cli-fitpulse',
    name: 'FitPulse Gym Chain',
    clientCode: 'FPG-PRM-26',
    category: 'Fitness & Lifestyle',
    folderStatus: 'complete',
    driveUrl: 'https://drive.google.com/drive/folders/dp-inside-fitpulse-promo',
    dropboxUrl: 'https://www.dropbox.com/sh/fitpulse-promo-final',
    contractStatus: 'Signed',
    totalProjects: 5,
    completedProjects: 4,
    socialPlatforms: { facebook: true, instagram: true, youtube: true },
    contactPerson: 'Megha Singhania',
    phone: '+91 97482 19930',
    projectFee: 80000,
    advancePaid: 80000
  }
];

export const INITIAL_JOBS: JobCard[] = [
  {
    id: 'job-101',
    title: 'Diandra Wedding - 5 Min Cinematic Highlight Reel 4K',
    clientId: 'cli-diandra',
    stage: 'editing',
    assignedTo: 'usr-piyali',
    assignedBy: 'usr-aditya',
    estimatedHours: 4,
    loggedHours: 18.5,
    turnaroundSLA: 48,
    daysInStage: 14,
    isOverdue: true,
    createdAt: '2026-07-02',
    dueDate: '2026-07-04',
    priority: 'urgent',
    driveDeliverableLink: 'https://drive.google.com/file/d/diandra-highlight-draft-v3.mp4/view',
    dropboxRawLink: 'https://www.dropbox.com/sh/diandra-wedding-master/raw-cam-a',
    notes: [
      '[Aditya - Manager]: Piyali, this job was scoped for 4 hours edit. It has sat in Editing for 14 days.',
      '[Piyali - Editor]: Resolved 4K color grade sync on Cam B, finishing final export now and submitting.'
    ],
    checklist: {
      rawIngested: true,
      audioSynced: true,
      colorGraded: false,
      clientApproved: false
    }
  },
  {
    id: 'job-102',
    title: 'TechCorp Q3 Product Launch Commercial Cut',
    clientId: 'cli-techcorp',
    stage: 'review',
    assignedTo: 'usr-rohan',
    assignedBy: 'usr-aditya',
    estimatedHours: 6,
    loggedHours: 5.2,
    turnaroundSLA: 72,
    daysInStage: 1,
    isOverdue: false,
    createdAt: '2026-07-14',
    dueDate: '2026-07-17',
    priority: 'high',
    driveDeliverableLink: 'https://drive.google.com/file/d/techcorp-launch-v1-review.mp4/view',
    dropboxRawLink: 'https://www.dropbox.com/sh/techcorp-deliverables/raw-footage',
    notes: [
      '[Aditya - Manager]: Rohan submitted exactly within the 6-hour SLA. Ready for Saurav internal review.'
    ],
    checklist: {
      rawIngested: true,
      audioSynced: true,
      colorGraded: true,
      clientApproved: false
    }
  },
  {
    id: 'job-103',
    title: 'Café Vibe - 10 Viral Instagram Reels Batch',
    clientId: 'cli-cafevibe',
    stage: 'assigned',
    assignedTo: 'usr-piyali',
    assignedBy: 'usr-saurav',
    estimatedHours: 5,
    loggedHours: 0,
    turnaroundSLA: 48,
    daysInStage: 1,
    isOverdue: false,
    createdAt: '2026-07-16',
    dueDate: '2026-07-18',
    priority: 'normal',
    dropboxRawLink: 'https://www.dropbox.com/sh/cafevibe-reels/food-shoots-july',
    notes: [
      '[Saurav - Owner]: Assigned to Piyali right after shoot check-in. Target 30 min per reel.'
    ],
    checklist: {
      rawIngested: true,
      audioSynced: false,
      colorGraded: false,
      clientApproved: false
    }
  },
  {
    id: 'job-104',
    title: 'Diandra & Kabir - Mehendi & Sangeet Retouch (500 Pics)',
    clientId: 'cli-diandra',
    stage: 'revisions',
    assignedTo: 'usr-sneha',
    assignedBy: 'usr-aditya',
    estimatedHours: 8,
    loggedHours: 7.8,
    turnaroundSLA: 96,
    daysInStage: 3,
    isOverdue: false,
    createdAt: '2026-07-10',
    dueDate: '2026-07-14',
    priority: 'high',
    driveDeliverableLink: 'https://drive.google.com/drive/folders/diandra-sangeet-retouched-v2',
    notes: [
      '[Sneha - Photo Lead]: Client requested slightly warmer tones on bride portraits. Re-exporting batch.'
    ],
    checklist: {
      rawIngested: true,
      audioSynced: true,
      colorGraded: true,
      clientApproved: false
    }
  },
  {
    id: 'job-105',
    title: 'FitPulse - 60s High-Energy Trainer Promo Cut',
    clientId: 'cli-fitpulse',
    stage: 'delivered',
    assignedTo: 'usr-rohan',
    assignedBy: 'usr-aditya',
    estimatedHours: 3,
    loggedHours: 2.8,
    turnaroundSLA: 36,
    daysInStage: 1,
    isOverdue: false,
    createdAt: '2026-07-12',
    dueDate: '2026-07-13',
    priority: 'normal',
    driveDeliverableLink: 'https://drive.google.com/file/d/fitpulse-promo-final-v2.mp4/view',
    notes: [
      '[Aditya - Manager]: Delivered on time. Client approved via Drive comment.'
    ],
    checklist: {
      rawIngested: true,
      audioSynced: true,
      colorGraded: true,
      clientApproved: true
    }
  },
  {
    id: 'job-106',
    title: 'TechCorp CEO Annual Keynote B-Roll Sync & Cut',
    clientId: 'cli-techcorp',
    stage: 'editing',
    assignedTo: 'usr-freelance-pool',
    assignedBy: 'usr-saurav',
    assignedFreelancerName: 'Manish Verma • B-Roll & Sync Lead (@ ₹750/hr)',
    estimatedHours: 4,
    loggedHours: 1.5,
    turnaroundSLA: 48,
    daysInStage: 1,
    isOverdue: false,
    createdAt: '2026-07-16',
    dueDate: '2026-07-18',
    priority: 'normal',
    dropboxRawLink: 'https://www.dropbox.com/sh/techcorp-deliverables/keynote-raw-sd-cards',
    notes: [
      '[Saurav - Owner]: Assigned to Freelance Pool. Manish picked up the 4K B-Roll sync task.'
    ],
    checklist: {
      rawIngested: true,
      audioSynced: true,
      colorGraded: false,
      clientApproved: false
    }
  }
];

export const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post-201',
    title: 'Diandra & Kabir - Teaser Reel (Insta Collab)',
    clientId: 'cli-diandra',
    platform: 'Instagram',
    postDate: '2026-07-17 18:30',
    status: 'Scheduled',
    contentCaption: 'Two hearts, one eternity ✨ Watch Diandra & Kabir’s breathtaking royal entry at Taj Bengal! #DiandraWedding #LuxuryWedding #DPInside',
    mediaLink: 'https://drive.google.com/file/d/diandra-highlight-draft-v3.mp4/view',
    assignedTo: 'usr-vikram',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'post-202',
    title: 'Diandra & Kabir - 4K Cinematic Film Premiere',
    clientId: 'cli-diandra',
    platform: 'YouTube',
    postDate: '2026-07-20 20:00',
    status: 'Owner Approved',
    contentCaption: 'The official 4K Wedding Feature of Diandra Mukherjee & Kabir Khanna. Produced by DP Inside Studios.',
    mediaLink: 'https://drive.google.com/file/d/diandra-highlight-draft-v3.mp4/view',
    assignedTo: 'usr-vikram',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'post-203',
    title: 'TechCorp Q3 Product Reveal - 60s Cut',
    clientId: 'cli-techcorp',
    platform: 'Facebook',
    postDate: '2026-07-18 11:00',
    status: 'Scheduled',
    contentCaption: 'Innovation meets performance. Introducing the next generation of enterprise AI hardware. #TechCorp #Launch #TechNews',
    mediaLink: 'https://drive.google.com/file/d/techcorp-launch-v1-review.mp4/view',
    assignedTo: 'usr-vikram',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'post-204',
    title: 'Café Vibe - Artisan Latte Art ASMR Reel',
    clientId: 'cli-cafevibe',
    platform: 'Instagram',
    postDate: '2026-07-18 17:00',
    status: 'Draft',
    contentCaption: 'Pouring pure perfection at Café Vibe today ☕ Which latte art is your weekend vibe? #CafeVibe #KolkataCafes #LatteArt',
    mediaLink: 'https://www.dropbox.com/sh/cafevibe-reels/latte-art.mp4',
    assignedTo: 'usr-vikram',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'post-205',
    title: 'FitPulse - 30 Day Transformation Challenge Promo',
    clientId: 'cli-fitpulse',
    platform: 'Instagram',
    postDate: '2026-07-19 09:00',
    status: 'Published',
    contentCaption: 'No excuses. Only results. Join the FitPulse 30-Day transformation now! Link in bio. #FitPulse #BeastMode #FitnessIndia',
    mediaLink: 'https://drive.google.com/file/d/fitpulse-promo-final-v2.mp4/view',
    assignedTo: 'usr-vikram',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_TIMELOGS: TimeLogEntry[] = [
  {
    id: 'log-301',
    memberId: 'usr-piyali',
    jobId: 'job-101',
    jobTitle: 'Diandra Wedding - 5 Min Cinematic Highlight Reel 4K',
    clientName: 'Diandra & Kabir Wedding',
    startTime: '2026-07-16 14:00',
    endTime: '2026-07-16 18:30',
    durationMinutes: 270,
    activePercentage: 92,
    primaryApp: 'Adobe Premiere Pro 2026',
    screenshotProofCount: 18
  },
  {
    id: 'log-302',
    memberId: 'usr-rohan',
    jobId: 'job-102',
    jobTitle: 'TechCorp Q3 Product Launch Commercial Cut',
    clientName: 'TechCorp India Pvt Ltd',
    startTime: '2026-07-16 11:30',
    endTime: '2026-07-16 16:45',
    durationMinutes: 315,
    activePercentage: 96,
    primaryApp: 'Adobe After Effects / DaVinci Resolve',
    screenshotProofCount: 21
  },
  {
    id: 'log-303',
    memberId: 'usr-sneha',
    jobId: 'job-104',
    jobTitle: 'Diandra & Kabir - Mehendi & Sangeet Retouch (500 Pics)',
    clientName: 'Diandra & Kabir Wedding',
    startTime: '2026-07-16 10:00',
    endTime: '2026-07-16 15:00',
    durationMinutes: 300,
    activePercentage: 94,
    primaryApp: 'Adobe Photoshop / Lightroom',
    screenshotProofCount: 20
  }
];
