const router = require('express').Router();
const auth = require('../middleware/auth');
const SocialPost = require('../models/SocialPost');

// All routes require authentication
router.use(auth);

// ── GET /api/social ────────────────────────────────────────
router.get('/', async (_req, res) => {
  try {
    const posts = await SocialPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('GET /social error:', err);
    res.status(500).json({ error: 'Failed to fetch social posts.' });
  }
});

// ── POST /api/social ───────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const post = await SocialPost.create(req.body);
    res.status(201).json(post);
  } catch (err) {
    console.error('POST /social error:', err);
    res.status(500).json({ error: 'Failed to create social post.' });
  }
});

// ── PUT /api/social/:id ────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const post = await SocialPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!post) {
      return res.status(404).json({ error: 'Social post not found.' });
    }

    res.json(post);
  } catch (err) {
    console.error('PUT /social error:', err);
    res.status(500).json({ error: 'Failed to update social post.' });
  }
});

// ── DELETE /api/social/:id ─────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const post = await SocialPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Social post not found.' });
    }
    res.json({ message: 'Social post deleted.', id: req.params.id });
  } catch (err) {
    console.error('DELETE /social error:', err);
    res.status(500).json({ error: 'Failed to delete social post.' });
  }
});

module.exports = router;
