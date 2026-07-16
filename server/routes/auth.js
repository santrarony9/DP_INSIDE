const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TeamMember = require('../models/Team');

// ── POST /api/auth/login ───────────────────────────────────
// Phone-based login: client sends { phone }, we compare against bcrypt-hashed phonePIN
router.post('/login', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }

    // Fetch all members and compare the plaintext phone against each hashed phonePIN
    const members = await TeamMember.find();
    let matched = null;

    for (const member of members) {
      if (member.phonePIN) {
        const isMatch = await bcrypt.compare(String(phone), member.phonePIN);
        if (isMatch) {
          matched = member;
          break;
        }
      }
    }

    if (!matched) {
      return res.status(401).json({ error: 'Invalid credentials. No team member found with that phone PIN.' });
    }

    const payload = {
      id: matched._id,
      name: matched.name,
      role: matched.role,
      roleType: matched.roleType
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Strip phonePIN from response
    const user = matched.toObject();
    delete user.phonePIN;

    return res.json({ token, user });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error during login.' });
  }
});

// ── POST /api/auth/login-bypass ────────────────────────────
// Quick "Switch Seat" login by memberId — convenience route for early adoption
router.post('/login-bypass', async (req, res) => {
  try {
    const { memberId } = req.body;
    if (!memberId) {
      return res.status(400).json({ error: 'memberId is required.' });
    }

    const member = await TeamMember.findById(memberId);
    if (!member) {
      return res.status(404).json({ error: 'Team member not found.' });
    }

    const payload = {
      id: member._id,
      name: member.name,
      role: member.role,
      roleType: member.roleType
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    const user = member.toObject();
    delete user.phonePIN;

    return res.json({ token, user });
  } catch (err) {
    console.error('Login-bypass error:', err);
    return res.status(500).json({ error: 'Server error during login-bypass.' });
  }
});

module.exports = router;
