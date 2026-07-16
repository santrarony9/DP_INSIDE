/**
 * seed.js — Populate MongoDB with initial data for DP Inside StudioOS
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
    //  TEAM MEMBERS (Only Rony Santra)
    // ════════════════════════════════════════════════════════
    const teamData = [
      {
        name: 'Rony Santra',
        role: 'Super Admin',
        roleType: 'owner',
        phonePIN: await hashPIN('8240054002'),
        avatar: 'RS',
        department: 'Management',
        hourlyRate: 0,
        status: 'online',
        workstationPC: 'STUDIO-MAIN',
        activeProjectTitle: 'System Setup',
        weeklyHoursLogged: 0,
        productivityScore: 100,
        appUsage: { premierePro: 0, afterEffects: 0, photoshop: 0, chromeDrive: 0, idleAway: 0 }
      }
    ];

    await TeamMember.insertMany(teamData);
    console.log(`✅ Inserted ${teamData.length} team members`);

    // Clients, Jobs, SocialPosts are explicitly left empty for a fresh start
    const clientsData = [];
    const jobsData = [];
    const socialPostsData = [];

    console.log('\n══════════════════════════════════════════');
    console.log('  🌱 Seed complete!');
    console.log(`  Team Members : ${teamData.length}`);
    console.log(`  Clients      : ${clientsData.length}`);
    console.log(`  Jobs         : ${jobsData.length}`);
    console.log(`  Social Posts : ${socialPostsData.length}`);
    console.log('══════════════════════════════════════════');
    console.log('\n📱 Super Admin PIN:');
    console.log('   Rony Santra → 8240054002\n');

  } catch (err) {
    console.error('❌ Error seeding database:', err);
  } finally {
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  }
};

seedDB();
