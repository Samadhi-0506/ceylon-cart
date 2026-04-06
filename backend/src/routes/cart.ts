import express from 'express';

const router = express.Router();

// Cart is managed client-side via localStorage/context
// These routes are placeholders for future server-side cart
router.get('/', (_req, res) => {
  res.json({ message: 'Cart is managed client-side' });
});

export default router;
