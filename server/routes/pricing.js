import { Router } from 'express';
import { addPricing, getLatestPricing, getSupabase } from '../database.js';

const router = Router();

router.get('/courses/:id/pricing', async (req, res) => {
  const courseId = parseInt(req.params.id);
  if (isNaN(courseId)) return res.status(400).json({ error: 'Invalid course ID' });

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('pricing')
    .select('*')
    .eq('course_id', courseId)
    .order('submitted_at', { ascending: false })
    .limit(10);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ pricing: data || [] });
});

router.post('/courses/:id/pricing', async (req, res) => {
  const courseId = parseInt(req.params.id);
  if (isNaN(courseId)) return res.status(400).json({ error: 'Invalid course ID' });

  const supabase = getSupabase();
  const { data: course } = await supabase
    .from('courses')
    .select('id')
    .eq('id', courseId)
    .single();

  if (!course) return res.status(404).json({ error: 'Course not found' });

  const { weekday_price, weekend_price, cart_price, currency, notes } = req.body;

  if (!weekday_price && !weekend_price && !cart_price) {
    return res.status(400).json({ error: 'At least one price must be provided' });
  }

  await addPricing(courseId, { weekday_price, weekend_price, cart_price, currency, notes });

  const latest = await getLatestPricing(courseId);
  res.json({ success: true, pricing: latest });
});

export default router;
