import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import Passkey from '../models/Passkey';
import { protect, AuthRequest } from '../middleware/auth';
import passport from '../config/passport';

const router = express.Router();

const generateToken = (id: string): string =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });

const userPayload = (user: { _id: unknown; name: string; email: string; role: string }) => ({
  id: user._id, name: user.name, email: user.email, role: user.role
});

const challengeStore = new Map<string, { challenge: string; email?: string; userId?: string; expires: number }>();

// ── Email/Password ──────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please provide all required fields' });
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, role: 'user' });
    return res.status(201).json({ token: generateToken(user._id.toString()), user: userPayload(user) });
  } catch { return res.status(500).json({ message: 'Server error during registration' }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Please provide email and password' });
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    return res.json({ token: generateToken(user._id.toString()), user: userPayload(user) });
  } catch { return res.status(500).json({ message: 'Server error during login' }); }
});

router.get('/me', protect, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user: userPayload(user) });
  } catch { return res.status(500).json({ message: 'Server error' }); }
});

// ── Google OAuth ────────────────────────────────────────────────────────────
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed` }),
  (req, res) => {
    const user = req.user as { _id: unknown; name: string; email: string; role: string };
    const token = generateToken(user._id!.toString());
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&role=${user.role}&id=${user._id}`);
  }
);

// ── Facebook OAuth ──────────────────────────────────────────────────────────
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'], session: false })
);
router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=facebook_failed` }),
  (req, res) => {
    const user = req.user as { _id: unknown; name: string; email: string; role: string };
    const token = generateToken(user._id!.toString());
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&role=${user.role}&id=${user._id}`);
  }
);

// ── Passkey Registration ────────────────────────────────────────────────────
router.post('/passkey/register/start', protect, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const challenge = crypto.randomBytes(32).toString('base64url');
    challengeStore.set(`reg_${user._id}`, { challenge, userId: user._id.toString(), expires: Date.now() + 300000 });
    return res.json({
      challenge,
      rp: { name: 'CeylonCart', id: 'localhost' },
      user: { id: Buffer.from(user._id.toString()).toString('base64url'), name: user.email, displayName: user.name },
      pubKeyCredParams: [{ alg: -7, type: 'public-key' }, { alg: -257, type: 'public-key' }],
      timeout: 60000, attestation: 'none',
      authenticatorSelection: { userVerification: 'preferred', residentKey: 'preferred' }
    });
  } catch { return res.status(500).json({ message: 'Server error' }); }
});

router.post('/passkey/register/finish', protect, async (req: AuthRequest, res) => {
  try {
    const { credentialId, publicKey, deviceName } = req.body;
    const stored = challengeStore.get(`reg_${req.user?.id}`);
    if (!stored || Date.now() > stored.expires)
      return res.status(400).json({ message: 'Challenge expired. Please try again.' });
    challengeStore.delete(`reg_${req.user?.id}`);
    if (await Passkey.findOne({ credentialId }))
      return res.status(400).json({ message: 'This passkey is already registered' });
    await Passkey.create({ userId: req.user?.id, credentialId, publicKey, counter: 0, deviceName: deviceName || 'My Device' });
    return res.json({ message: 'Passkey registered successfully!' });
  } catch { return res.status(500).json({ message: 'Server error' }); }
});

// ── Passkey Login ───────────────────────────────────────────────────────────
router.post('/passkey/login/start', async (_req, res) => {
  try {
    const challenge = crypto.randomBytes(32).toString('base64url');
    const sessionId = crypto.randomBytes(16).toString('hex');
    challengeStore.set(sessionId, { challenge, expires: Date.now() + 300000 });
    return res.json({ sessionId, challenge, timeout: 60000, rpId: 'localhost', userVerification: 'preferred', allowCredentials: [] });
  } catch { return res.status(500).json({ message: 'Server error' }); }
});

router.post('/passkey/login/finish', async (req, res) => {
  try {
    const { sessionId, credentialId, userId } = req.body;
    const stored = challengeStore.get(sessionId);
    if (!stored || Date.now() > stored.expires)
      return res.status(400).json({ message: 'Challenge expired. Please try again.' });
    challengeStore.delete(sessionId);
    const passkey = await Passkey.findOne({ credentialId });
    if (!passkey) return res.status(401).json({ message: 'Passkey not recognised. Please register it first.' });
    const user = await User.findById(userId || passkey.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await Passkey.findByIdAndUpdate(passkey._id, { $inc: { counter: 1 } });
    return res.json({ token: generateToken(user._id.toString()), user: userPayload(user) });
  } catch { return res.status(500).json({ message: 'Server error' }); }
});

router.get('/passkeys', protect, async (req: AuthRequest, res) => {
  try {
    const passkeys = await Passkey.find({ userId: req.user?.id }).select('-publicKey');
    return res.json(passkeys);
  } catch { return res.status(500).json({ message: 'Server error' }); }
});

router.delete('/passkeys/:id', protect, async (req: AuthRequest, res) => {
  try {
    await Passkey.findOneAndDelete({ _id: req.params.id, userId: req.user?.id });
    return res.json({ message: 'Passkey removed' });
  } catch { return res.status(500).json({ message: 'Server error' }); }
});

export default router;