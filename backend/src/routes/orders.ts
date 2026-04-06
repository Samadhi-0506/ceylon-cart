import express from 'express';
import Order from '../models/Order';
import { protect, adminOnly, AuthRequest } from '../middleware/auth';

const router = express.Router();

// POST /api/orders (user)
router.post('/', protect, async (req: AuthRequest, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod, note } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    const order = await Order.create({
      user: req.user?.id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'cash_on_delivery',
      note,
      status: 'pending'
    });

    return res.status(201).json(order);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Server error';
    return res.status(400).json({ message: msg });
  }
});

// GET /api/orders/my (user)
router.get('/my', protect, async (req: AuthRequest, res) => {
  try {
    const orders = await Order.find({ user: req.user?.id })
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders (admin)
router.get('/', protect, adminOnly, async (_req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders/stats (admin)
router.get('/stats', protect, adminOnly, async (_req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const totalRevenueData = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = totalRevenueData[0]?.total || 0;

    return res.json({ totalOrders, pendingOrders, totalRevenue });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/orders/:id/status (admin)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json(order);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
