const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  clientCode: { type: String, required: true, unique: true },
  category: { type: String, default: 'Production Campaign' },
  folderStatus: { type: String, default: 'complete' },
  driveUrl: { type: String },
  dropboxUrl: { type: String },
  contractStatus: { type: String, default: 'Signed' },
  totalProjects: { type: Number, default: 1 },
  completedProjects: { type: Number, default: 0 },
  socialPlatforms: {
    facebook: { type: Boolean, default: false },
    instagram: { type: Boolean, default: false },
    youtube: { type: Boolean, default: false }
  },
  contactPerson: { type: String },
  phone: { type: String },
  projectFee: { type: Number },
  advancePaid: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
