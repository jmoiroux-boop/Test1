import { Router } from 'express';
import { addPricing, getLatestPricing, getDb } from '../database.js';

const router = Router();

router.get('/courses/:id/pricing', (req, res) => {
  const courseId = parseInt(req.params.id);
  if (isNaN(courseId)) return res.status(400).json({ error: 'Invalid course ID' });

  const db = getDb();
  const pricingHistory = db.prepare(`
    SELECT * FROM pricing WHERE course_id = ? ORDER BY submitted_at DESC LIMIT 10
  `).all(courseId);

  res.json({ pricing: pricingHistory });
});

router.post('/courses/:id/pricing', (req, res) => {
  const courseId = parseInt(req.params.id);
  if (isNaN(courseId)) return res.status(400).json({ error: 'Invalid course ID' });

  const db = getDb();
  const course = db.prepare('SELECT id FROM courses WHERE id = ?').get(courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });

  const { weekday_price, weekend_price, cart_price, currency, notes } = req.body;

  if (!weekday_price && !weekend_price && !cart_price) {
    return res.status(400).json({ error: 'At least one price must be provided' });
  }

  addPricing(courseId, { weekday_price, weekend_price, cart_price, currency, notes });

  const latest = getLatestPricing(courseId);
  res.json({ success: true, pricing: latest });
});

export default router;
