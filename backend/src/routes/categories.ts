import express from 'express';
import Category from '../models/Category';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

// GET /api/categories
router.get('/', async (_req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    return res.json(categories);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/categories/:slug
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    return res.json(category);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/categories (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const category = await Category.create({ ...req.body, slug });
    return res.status(201).json(category);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Server error';
    return res.status(400).json({ message: msg });
  }
});

// PUT /api/categories/:id (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    return res.json(category);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/categories/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    return res.json({ message: 'Category deleted' });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
