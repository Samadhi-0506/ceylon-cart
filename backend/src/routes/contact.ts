import express from 'express';
import Contact from '../models/Contact';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

// POST /api/contact  — public, anyone can submit
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message)
      return res.status(400).json({ message: 'Please fill in all required fields.' });

    const contact = await Contact.create({ name, email, phone, subject, message });
    return res.status(201).json({ message: 'Your message has been sent! We will get back to you soon.', id: contact._id });
  } catch (err) {
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// GET /api/contact  — admin only
router.get('/', protect, adminOnly, async (_req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    return res.json(messages);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/contact/:id/status  — admin mark as read/replied
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!contact) return res.status(404).json({ message: 'Message not found' });
    return res.json(contact);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/contact/:id  — admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Deleted' });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
