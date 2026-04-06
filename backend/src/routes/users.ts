import express from 'express';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import Category from '../models/Category';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

// GET /api/users (admin)
router.get('/', protect, adminOnly, async (_req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/dashboard-stats (admin)
router.get('/dashboard-stats', protect, adminOnly, async (_req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const totalCategories = await Category.countDocuments({ isActive: true });
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    const revenueData = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories,
      pendingOrders,
      totalRevenue,
      recentOrders
    });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/users/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ message: 'User deleted' });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
