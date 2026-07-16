/**
 * seed.js — Populate MongoDB with initial demo data for DP Inside StudioOS
 *
 * Usage:  node seed.js
 *
 * WARNING: This drops existing collections before inserting.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const TeamMember = require('./models/Team');
const Job = require('./models/Job');
const Client = require('./models/Client');
const SocialPost = require('./models/SocialPost');

// ── Helper ─────────────────────────────────────────────────
const hashPIN = async (pin) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(String(pin), salt);
};

// ── Seed Data ──────────────────────────────────────────────
const seedDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding.\n');

    // ─── Drop existing collections ──────────────────────────
    await TeamMember.deleteMany({});
    console.log('🗑  Cleared TeamMembers collection');
    await Job.deleteMany({});
    console.log('🗑  Cleared Jobs collection');
    await Client.deleteMany({});
    console.log('🗑  Cleared Clients collection');
    await SocialPost.deleteMany({});
    console.log('🗑  Cleared SocialPosts collection\n');

    // ════════════════════════════════════════════════════════
    //  TEAM MEMBERS
    // ════════════════════════════════════════════════════════
    const teamData = [
      {
        name: 'Saurav Banerjee',
        role: 'Owner / Creative Director',
        roleType: 'owner',
        phonePIN: await hashPIN('9830011111'),
        avatar: 'SB',
        department: 'Management',
        hourlyRate: 0,
        status: 'online',
        workstationPC: 'STUDIO-MAIN',
        activeProjectTitle: 'Diandra Wedding Highlight',
        weeklyHoursLogged: 32,
        productivityScore: 98,
        appUsage: { premierePro: 25, afterEffects: 30, photoshop: 10, chromeDrive: 25, idleAway: 10 }
      },
      {
        name: 'Aditya Sharma',
        role: 'Studio Manager',
        roleType: 'manager',
        phonePIN: await hashPIN('9830022222'),
        avatar: 'AS',
        department: 'Management',
        hourlyRate: 850,
        status: 'online',
        workstationPC: 'STUDIO-02',
        activeProjectTitle: 'TechCorp Product Launch',
        weeklyHoursLogged: 38,
        productivityScore: 95,
        appUsage: { premierePro: 10, afterEffects: 5, photoshop: 5, chromeDrive: 60, idleAway: 20 }
      },
      {
        name: 'Piyali Das',
        role: 'Senior Video Editor',
        roleType: 'editor',
        phonePIN: await hashPIN('9830033333'),
        avatar: 'PD',
        department: 'Post Production',
        hourlyRate: 750,
        status: 'active-editing',
        workstationPC: 'EDIT-01',
        activeProjectTitle: 'Diandra Wedding — Full Film',
        weeklyHoursLogged: 42,
        productivityScore: 96,
        appUsage: { premierePro: 55, afterEffects: 20, photoshop: 5, chromeDrive: 10, idleAway: 10 }
      },
      {
        name: 'Rohan Verma',
        role: 'Lead Colorist & VFX',
        roleType: 'editor',
        phonePIN: await hashPIN('9830044444'),
        avatar: 'RV',
        department: 'Post Production',
        hourlyRate: 700,
        status: 'active-editing',
        workstationPC: 'COLOR-01',
        activeProjectTitle: 'FitPulse Promo Reel',
        weeklyHoursLogged: 36,
        productivityScore: 91,
        appUsage: { premierePro: 20, afterEffects: 45, photoshop: 15, chromeDrive: 10, idleAway: 10 }
      },
      {
        name: 'Sneha Kapoor',
        role: 'Lead Photo Retoucher',
        roleType: 'editor',
        phonePIN: await hashPIN('9830055555'),
        avatar: 'SK',
        department: 'Post Production',
        hourlyRate: 650,
        status: 'idle',
        workstationPC: 'EDIT-02',
        activeProjectTitle: '',
        weeklyHoursLogged: 28,
        productivityScore: 88,
        appUsage: { premierePro: 5, afterEffects: 10, photoshop: 60, chromeDrive: 15, idleAway: 10 }
      },
      {
        name: 'Vikram Mehta',
        role: 'Social Media Lead',
        roleType: 'social',
        phonePIN: await hashPIN('9830066666'),
        avatar: 'VM',
        department: 'Social Media',
        hourlyRate: 600,
        status: 'online',
        workstationPC: 'SOCIAL-01',
        activeProjectTitle: 'Kolkata Food Trails — Weekly Posts',
        weeklyHoursLogged: 34,
        productivityScore: 90,
        appUsage: { premierePro: 10, afterEffects: 5, photoshop: 25, chromeDrive: 40, idleAway: 20 }
      },
      {
        name: 'Freelance Editor Pool',
        role: 'External Editors',
        roleType: 'freelance',
        phonePIN: await hashPIN('0000000000'),
        avatar: 'FP',
        department: 'Freelance',
        hourlyRate: 0,
        status: 'offline',
        workstationPC: 'REMOTE',
        activeProjectTitle: '',
        weeklyHoursLogged: 0,
        productivityScore: 0,
        freelancerPoolRoster: [
          {
            name: 'Rahul Bose',
            specialty: 'Wedding Films',
            hourlyRate: 500,
            status: 'Available',
            currentJobTitle: '',
            turnaroundRating: '4.5/5',
            contactPhone: '9830077777'
          },
          {
            name: 'Ananya Ghosh',
            specialty: 'Corporate Videos & Motion Graphics',
            hourlyRate: 550,
            status: 'Busy',
            currentJobTitle: 'TechCorp BTS Edit',
            turnaroundRating: '4.8/5',
            contactPhone: '9830088888'
          },
          {
            name: 'Deepak Nair',
            specialty: 'Social Media Reels & Shorts',
            hourlyRate: 400,
            status: 'Available',
            currentJobTitle: '',
            turnaroundRating: '4.2/5',
            contactPhone: '9830099999'
          }
        ]
      }
    ];

    const insertedTeam = await TeamMember.insertMany(teamData);
    console.log(`✅ Inserted ${insertedTeam.length} team members`);

    // Build a lookup by name for assigning jobs
    const teamLookup = {};
    insertedTeam.forEach(m => { teamLookup[m.name] = m._id.toString(); });

    // ════════════════════════════════════════════════════════
    //  CLIENTS
    // ════════════════════════════════════════════════════════
    const clientData = [
      {
        name: 'Diandra Wedding Studio',
        clientCode: 'PRJ-DIA-001',
        category: 'Wedding & Cinematic',
        folderStatus: 'complete',
        driveUrl: 'https://drive.google.com/drive/folders/diandra-studio',
        dropboxUrl: 'https://dropbox.com/diandra-raw',
        contractStatus: 'Signed',
        totalProjects: 3,
        completedProjects: 1,
        socialPlatforms: { facebook: true, instagram: true, youtube: true },
        contactPerson: 'Diandra Roy',
        phone: '9831000001',
        projectFee: 85000,
        advancePaid: 50000
      },
      {
        name: 'TechCorp India',
        clientCode: 'PRJ-TCH-002',
        category: 'Corporate Production',
        folderStatus: 'complete',
        driveUrl: 'https://drive.google.com/drive/folders/techcorp-india',
        dropboxUrl: 'https://dropbox.com/techcorp-raw',
        contractStatus: 'Signed',
        totalProjects: 2,
        completedProjects: 1,
        socialPlatforms: { facebook: true, instagram: false, youtube: true },
        contactPerson: 'Amit Ghoshal',
        phone: '9831000002',
        projectFee: 120000,
        advancePaid: 60000
      },
      {
        name: 'FitPulse Lifestyle',
        clientCode: 'PRJ-FIT-003',
        category: 'Fitness Content',
        folderStatus: 'complete',
        driveUrl: 'https://drive.google.com/drive/folders/fitpulse-lifestyle',
        dropboxUrl: 'https://dropbox.com/fitpulse-raw',
        contractStatus: 'Signed',
        totalProjects: 1,
        completedProjects: 0,
        socialPlatforms: { facebook: false, instagram: true, youtube: true },
        contactPerson: 'Priya Singh',
        phone: '9831000003',
        projectFee: 45000,
        advancePaid: 20000
      },
      {
        name: 'Kolkata Food Trails',
        clientCode: 'PRJ-KFT-004',
        category: 'Food & Lifestyle',
        folderStatus: 'complete',
        driveUrl: 'https://drive.google.com/drive/folders/kolkata-food-trails',
        dropboxUrl: 'https://dropbox.com/kft-raw',
        contractStatus: 'Signed',
        totalProjects: 2,
        completedProjects: 1,
        socialPlatforms: { facebook: true, instagram: true, youtube: false },
        contactPerson: 'Sourav Chatterjee',
        phone: '9831000004',
        projectFee: 35000,
        advancePaid: 35000
      }
    ];

    const insertedClients = await Client.insertMany(clientData);
    console.log(`✅ Inserted ${insertedClients.length} clients`);

    // Build client lookup by clientCode
    const clientLookup = {};
    insertedClients.forEach(c => { clientLookup[c.clientCode] = c._id.toString(); });

    // ════════════════════════════════════════════════════════
    //  JOBS
    // ════════════════════════════════════════════════════════
    const now = new Date();
    const jobData = [
      {
        title: 'Diandra Wedding — Highlight Reel',
        clientId: clientLookup['PRJ-DIA-001'],
        stage: 'editing',
        assignedTo: teamLookup['Piyali Das'],
        assignedBy: teamLookup['Aditya Sharma'],
        estimatedHours: 8,
        loggedHours: 5.5,
        turnaroundSLA: 48,
        acceptedAt: new Date(now.getTime() - 18 * 3600000).toISOString(),
        turnaroundClockStatus: 'Accepted & Ticking',
        daysInStage: 2,
        isOverdue: false,
        createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
        dueDate: new Date(now.getTime() + 1 * 86400000).toISOString(),
        priority: 'high',
        driveDeliverableLink: 'https://drive.google.com/drive/folders/diandra-deliverables',
        dropboxRawLink: 'https://dropbox.com/diandra-raw/highlight',
        notes: ['Client wants warm color palette', 'Include drone shots from ceremony'],
        checklist: { rawIngested: true, audioSynced: true, colorGraded: false, clientApproved: false }
      },
      {
        title: 'TechCorp — Product Launch Video',
        clientId: clientLookup['PRJ-TCH-002'],
        stage: 'review',
        assignedTo: teamLookup['Rohan Verma'],
        assignedBy: teamLookup['Saurav Banerjee'],
        assignedFreelancerName: 'Ananya Ghosh',
        freelanceCost: 8250,
        estimatedHours: 12,
        loggedHours: 11,
        turnaroundSLA: 72,
        acceptedAt: new Date(now.getTime() - 60 * 3600000).toISOString(),
        turnaroundClockStatus: 'Accepted & Ticking',
        daysInStage: 1,
        isOverdue: false,
        createdAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
        dueDate: new Date(now.getTime() + 2 * 86400000).toISOString(),
        priority: 'urgent',
        driveDeliverableLink: 'https://drive.google.com/drive/folders/techcorp-deliverables',
        dropboxRawLink: 'https://dropbox.com/techcorp-raw/launch',
        notes: ['CEO interview needs subtitles', 'Add motion graphics for product specs'],
        checklist: { rawIngested: true, audioSynced: true, colorGraded: true, clientApproved: false },
        submittedDeliverableUrl: 'https://drive.google.com/file/d/techcorp-v1-draft',
        submissionNotes: 'First cut ready for client review. Motion graphics pending final approval.',
        submittedAt: new Date(now.getTime() - 6 * 3600000).toISOString()
      },
      {
        title: 'FitPulse — Gym Promo Reel',
        clientId: clientLookup['PRJ-FIT-003'],
        stage: 'assigned',
        assignedTo: teamLookup['Rohan Verma'],
        assignedBy: teamLookup['Aditya Sharma'],
        estimatedHours: 6,
        loggedHours: 0,
        turnaroundSLA: 48,
        turnaroundClockStatus: 'Not Started',
        daysInStage: 1,
        isOverdue: false,
        createdAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
        dueDate: new Date(now.getTime() + 3 * 86400000).toISOString(),
        priority: 'normal',
        driveDeliverableLink: '',
        dropboxRawLink: 'https://dropbox.com/fitpulse-raw/promo',
        notes: ['Fast-paced cuts with energetic music'],
        checklist: { rawIngested: true, audioSynced: false, colorGraded: false, clientApproved: false }
      },
      {
        title: 'Kolkata Food Trails — Episode 4 Edit',
        clientId: clientLookup['PRJ-KFT-004'],
        stage: 'delivered',
        assignedTo: teamLookup['Piyali Das'],
        assignedBy: teamLookup['Saurav Banerjee'],
        estimatedHours: 5,
        loggedHours: 4.5,
        turnaroundSLA: 36,
        acceptedAt: new Date(now.getTime() - 96 * 3600000).toISOString(),
        turnaroundClockStatus: 'Completed',
        daysInStage: 0,
        isOverdue: false,
        createdAt: new Date(now.getTime() - 7 * 86400000).toISOString(),
        dueDate: new Date(now.getTime() - 2 * 86400000).toISOString(),
        priority: 'normal',
        driveDeliverableLink: 'https://drive.google.com/drive/folders/kft-ep4-final',
        dropboxRawLink: 'https://dropbox.com/kft-raw/ep4',
        notes: ['Client loved the cut — no revisions needed'],
        checklist: { rawIngested: true, audioSynced: true, colorGraded: true, clientApproved: true },
        submittedDeliverableUrl: 'https://drive.google.com/file/d/kft-ep4-final-v2',
        submissionNotes: 'Final approved version delivered to client.',
        submittedAt: new Date(now.getTime() - 48 * 3600000).toISOString()
      }
    ];

    const insertedJobs = await Job.insertMany(jobData);
    console.log(`✅ Inserted ${insertedJobs.length} jobs`);

    // ════════════════════════════════════════════════════════
    //  SOCIAL POSTS
    // ════════════════════════════════════════════════════════
    const socialData = [
      {
        title: 'Diandra Wedding — Behind the Scenes Reel',
        clientId: clientLookup['PRJ-DIA-001'],
        platform: 'Instagram',
        postDate: new Date(now.getTime() + 2 * 86400000).toISOString().split('T')[0],
        status: 'Owner Approved',
        contentCaption: '✨ Behind the magic of Diandra\'s dream wedding. Our team captured every candid moment. Stay tuned for the full film! 🎬 #WeddingCinema #DPInside',
        mediaLink: 'https://drive.google.com/file/d/diandra-bts-reel',
        assignedTo: teamLookup['Vikram Mehta'],
        thumbnailUrl: ''
      },
      {
        title: 'TechCorp — Product Launch Teaser',
        clientId: clientLookup['PRJ-TCH-002'],
        platform: 'YouTube',
        postDate: new Date(now.getTime() + 4 * 86400000).toISOString().split('T')[0],
        status: 'Draft',
        contentCaption: 'Something big is coming from TechCorp India. 🚀 The future of productivity, launching soon. #TechCorp #Innovation',
        mediaLink: 'https://drive.google.com/file/d/techcorp-teaser-v1',
        assignedTo: teamLookup['Vikram Mehta'],
        thumbnailUrl: ''
      },
      {
        title: 'FitPulse — Workout Transformation Post',
        clientId: clientLookup['PRJ-FIT-003'],
        platform: 'Instagram',
        postDate: new Date(now.getTime() + 1 * 86400000).toISOString().split('T')[0],
        status: 'Scheduled',
        contentCaption: '💪 30 days. One goal. Total transformation. See how FitPulse members crushed their fitness goals this month. #FitPulse #TransformationTuesday',
        mediaLink: 'https://drive.google.com/file/d/fitpulse-transformation',
        assignedTo: teamLookup['Vikram Mehta'],
        thumbnailUrl: ''
      },
      {
        title: 'Kolkata Food Trails — Episode 4 Promo',
        clientId: clientLookup['PRJ-KFT-004'],
        platform: 'Facebook',
        postDate: new Date(now.getTime() - 1 * 86400000).toISOString().split('T')[0],
        status: 'Published',
        contentCaption: '🍜 From the bylanes of North Kolkata — the ultimate puchka trail! Watch Episode 4 of Kolkata Food Trails now. Link in comments 👇 #KolkataFoodTrails #StreetFood',
        mediaLink: 'https://drive.google.com/file/d/kft-ep4-promo',
        assignedTo: teamLookup['Vikram Mehta'],
        thumbnailUrl: ''
      }
    ];

    const insertedPosts = await SocialPost.insertMany(socialData);
    console.log(`✅ Inserted ${insertedPosts.length} social posts`);

    // ── Summary ────────────────────────────────────────────
    console.log('\n══════════════════════════════════════════');
    console.log('  🌱 Seed complete!');
    console.log(`  Team Members : ${insertedTeam.length}`);
    console.log(`  Clients      : ${insertedClients.length}`);
    console.log(`  Jobs         : ${insertedJobs.length}`);
    console.log(`  Social Posts : ${insertedPosts.length}`);
    console.log('══════════════════════════════════════════\n');

    // ── Print login PINs for reference ─────────────────────
    console.log('📱 Login PINs (for testing):');
    console.log('   Saurav Banerjee     → 9830011111');
    console.log('   Aditya Sharma       → 9830022222');
    console.log('   Piyali Das          → 9830033333');
    console.log('   Rohan Verma         → 9830044444');
    console.log('   Sneha Kapoor        → 9830055555');
    console.log('   Vikram Mehta        → 9830066666');
    console.log('   Freelance Pool      → 0000000000\n');

    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedDB();
