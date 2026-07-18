const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  clientId: { type: String, required: true },
  stage: {
    type: String,
    enum: ['unassigned', 'footage-received', 'assigned', 'editing', 'review', 'revisions', 'delivered'],
    default: 'unassigned'
  },
  assignedTo: { type: String, default: null },
  assignedBy: { type: String },
  assignedFreelancerName: { type: String },
  freelanceCost: { type: Number },
  freelanceDeadlineDate: { type: String },
  estimatedHours: { type: Number, default: 4 },
  loggedHours: { type: Number, default: 0 },
  turnaroundSLA: { type: Number, default: 48 },
  acceptedAt: { type: String },
  turnaroundClockStatus: {
    type: String,
    enum: ['Not Started', 'Accepted & Ticking', 'Completed'],
    default: 'Not Started'
  },
  daysInStage: { type: Number, default: 1 },
  isOverdue: { type: Boolean, default: false },
  createdAt: { type: String },
  dueDate: { type: String },
  priority: {
    type: String,
    enum: ['urgent', 'high', 'normal'],
    default: 'normal'
  },
  driveDeliverableLink: { type: String },
  dropboxRawLink: { type: String },
  notes: [String],
  checklist: {
    rawIngested: { type: Boolean, default: false },
    audioSynced: { type: Boolean, default: false },
    colorGraded: { type: Boolean, default: false },
    clientApproved: { type: Boolean, default: false }
  },
  submittedDeliverableUrl: { type: String },
  submissionNotes: { type: String },
  submittedAt: { type: String },
  cancellationRequested: { type: Boolean, default: false },
  cancellationReason: { type: String },
  cancellationRequestedAt: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
