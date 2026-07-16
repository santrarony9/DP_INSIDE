const mongoose = require('mongoose');

const socialPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  clientId: { type: String, required: true },
  platform: {
    type: String,
    enum: ['Facebook', 'Instagram', 'YouTube']
  },
  postDate: { type: String },
  status: {
    type: String,
    enum: ['Draft', 'Owner Approved', 'Scheduled', 'Published'],
    default: 'Owner Approved'
  },
  contentCaption: { type: String },
  mediaLink: { type: String },
  assignedTo: { type: String },
  thumbnailUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('SocialPost', socialPostSchema);
