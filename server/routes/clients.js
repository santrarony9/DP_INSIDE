const router = require('express').Router();
const auth = require('../middleware/auth');
const Client = require('../models/Client');

// All routes require authentication
router.use(auth);

// ── GET /api/clients ───────────────────────────────────────
router.get('/', async (_req, res) => {
  try {
    const clients = await Client.find().sort({ name: 1 });
    res.json(clients);
  } catch (err) {
    console.error('GET /clients error:', err);
    res.status(500).json({ error: 'Failed to fetch clients.' });
  }
});

// ── POST /api/clients ──────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (err) {
    console.error('POST /clients error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Client with this clientCode already exists.' });
    }
    res.status(500).json({ error: 'Failed to create client.' });
  }
});

// ── PUT /api/clients/:id ───────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found.' });
    }

    res.json(client);
  } catch (err) {
    console.error('PUT /clients error:', err);
    res.status(500).json({ error: 'Failed to update client.' });
  }
});

// ── DELETE /api/clients/:id ────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found.' });
    }
    res.json({ message: 'Client deleted.', id: req.params.id });
  } catch (err) {
    console.error('DELETE /clients error:', err);
    res.status(500).json({ error: 'Failed to delete client.' });
  }
});

module.exports = router;
