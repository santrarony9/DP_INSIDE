const router = require('express').Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const TeamMember = require('../models/Team');

// All routes require authentication
router.use(auth);

// ── GET /api/team ──────────────────────────────────────────
router.get('/', async (_req, res) => {
  try {
    const members = await TeamMember.find().select('-phonePIN');
    res.json(members);
  } catch (err) {
    console.error('GET /team error:', err);
    res.status(500).json({ error: 'Failed to fetch team members.' });
  }
});

// ── POST /api/team ─────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const data = { ...req.body };

    // Hash phonePIN before saving
    if (data.phonePIN) {
      const salt = await bcrypt.genSalt(10);
      data.phonePIN = await bcrypt.hash(String(data.phonePIN), salt);
    }

    const member = await TeamMember.create(data);
    const result = member.toObject();
    delete result.phonePIN;

    res.status(201).json(result);
  } catch (err) {
    console.error('POST /team error:', err);
    res.status(500).json({ error: 'Failed to create team member.' });
  }
});

// ── PUT /api/team/:id ──────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const data = { ...req.body };

    // If updating phonePIN, hash the new value
    if (data.phonePIN) {
      const salt = await bcrypt.genSalt(10);
      data.phonePIN = await bcrypt.hash(String(data.phonePIN), salt);
    }

    const member = await TeamMember.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    }).select('-phonePIN');

    if (!member) {
      return res.status(404).json({ error: 'Team member not found.' });
    }

    res.json(member);
  } catch (err) {
    console.error('PUT /team error:', err);
    res.status(500).json({ error: 'Failed to update team member.' });
  }
});

// ── DELETE /api/team/:id ───────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Team member not found.' });
    }
    res.json({ message: 'Team member deleted.', id: req.params.id });
  } catch (err) {
    console.error('DELETE /team error:', err);
    res.status(500).json({ error: 'Failed to delete team member.' });
  }
});

module.exports = router;
