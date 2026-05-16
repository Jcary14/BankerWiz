const express = require('express');
const validator = require('validator');
const { sendNotificationEmail } = require('../services/email');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  if (phone && !validator.isMobilePhone(phone, 'any', { strictMode: false })) {
    return res.status(400).json({ error: 'Invalid phone number.' });
  }

  const sanitized = {
    name: validator.escape(validator.trim(name)),
    email: validator.normalizeEmail(email),
    phone: phone ? validator.trim(phone) : null,
    message: message ? validator.escape(validator.trim(message)) : null,
    submittedAt: new Date().toISOString()
  };

  try {
    await sendNotificationEmail(sanitized);
    res.status(201).json({
      success: true,
      message: 'Thank you for signing up! We will be in touch soon.'
    });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ error: 'Unable to process your request. Please try again later.' });
  }
});

module.exports = { router };
