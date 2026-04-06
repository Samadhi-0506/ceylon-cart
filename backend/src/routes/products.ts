import express from 'express';
import Product from '../models/Product';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, page = 1, limit = 20 } = req.query;
    const query: Record<string, unknown> = { isActive: true };

    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug color icon')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug color icon');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/products (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    await product.populate('category', 'name slug color icon');
    return res.status(201).json(product);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Server error';
    return res.status(400).json({ message: msg });
  }
});

// PUT /api/products/:id (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('category', 'name slug color icon');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/products/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json({ message: 'Product deleted' });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
