const router = require('express').Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');

// All routes require authentication
router.use(auth);

// ── GET /api/jobs ──────────────────────────────────────────
router.get('/', async (_req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error('GET /jobs error:', err);
    res.status(500).json({ error: 'Failed to fetch jobs.' });
  }
});

// ── POST /api/jobs ─────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    console.error('POST /jobs error:', err);
    res.status(500).json({ error: 'Failed to create job.' });
  }
});

// ── PUT /api/jobs/:id ──────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    res.json(job);
  } catch (err) {
    console.error('PUT /jobs error:', err);
    res.status(500).json({ error: 'Failed to update job.' });
  }
});

// ── DELETE /api/jobs/:id ───────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }
    res.json({ message: 'Job deleted.', id: req.params.id });
  } catch (err) {
    console.error('DELETE /jobs error:', err);
    res.status(500).json({ error: 'Failed to delete job.' });
  }
});

module.exports = router;
