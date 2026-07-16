const mongoose = require('mongoose');

const freelancerSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  hourlyRate: Number,
  status: String,
  currentJobTitle: String,
  turnaroundRating: String,
  contactPhone: String
}, { _id: false });

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: 'Video Editor' },
  roleType: {
    type: String,
    enum: ['owner', 'manager', 'editor', 'social', 'freelance'],
    default: 'editor'
  },
  phonePIN: { type: String },
  avatar: { type: String, default: 'ED' },
  department: { type: String },
  hourlyRate: { type: Number, default: 650 },
  status: {
    type: String,
    enum: ['online', 'active-editing', 'idle', 'offline'],
    default: 'online'
  },
  workstationPC: { type: String },
  activeProjectTitle: { type: String },
  activeJobId: { type: String },
  weeklyHoursLogged: { type: Number, default: 0 },
  productivityScore: { type: Number, default: 92 },
  appUsage: {
    premierePro: { type: Number, default: 0 },
    afterEffects: { type: Number, default: 0 },
    photoshop: { type: Number, default: 0 },
    chromeDrive: { type: Number, default: 0 },
    idleAway: { type: Number, default: 0 }
  },
  freelancerPoolRoster: [freelancerSchema]
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
