import { Router } from 'express';
import { fetchGolfCourses } from '../services/overpass.js';
import {
  getDb,
  isCacheValid,
  saveCacheEntry,
  upsertCourse,
  getCoursesInRadius,
  getLatestPricing,
} from '../database.js';

const router = Router();

router.get('/', async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);
  const radius = parseInt(req.query.radius) || 30000;

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return res.status(400).json({ error: 'Invalid lat/lng parameters' });
  }

  if (radius < 1000 || radius > 200000) {
    return res.status(400).json({ error: 'Radius must be between 1000 and 200000 meters' });
  }

  try {
    const cached = isCacheValid(lat, lng, radius);

    if (!cached) {
      console.log(`Fetching golf courses from Overpass: lat=${lat}, lng=${lng}, radius=${radius}`);
      const courses = await fetchGolfCourses(lat, lng, radius);
      console.log(`Found ${courses.length} courses from Overpass`);

      for (const course of courses) {
        upsertCourse(course);
      }

      saveCacheEntry(lat, lng, radius);
    }

    const courses = getCoursesInRadius(lat, lng, radius);

    const enriched = courses.map((course) => {
      const pricing = getLatestPricing(course.id);
      return {
        ...course,
        pricing: pricing || null,
      };
    });

    res.json({ courses: enriched, count: enriched.length, cached });
  } catch (err) {
    console.error('Error fetching courses:', err.message);
    // Try to return cached data even on error
    const courses = getCoursesInRadius(lat, lng, radius);
    if (courses.length > 0) {
      const enriched = courses.map((course) => {
        const pricing = getLatestPricing(course.id);
        return { ...course, pricing: pricing || null };
      });
      res.json({ courses: enriched, count: enriched.length, cached: true, stale: true });
    } else {
      res.status(502).json({ error: 'Unable to fetch golf courses. Please try again.' });
    }
  }
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid course ID' });

  const db = getDb();
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
  if (!course) return res.status(404).json({ error: 'Course not found' });

  const pricing = getLatestPricing(id);
  res.json({ ...course, pricing: pricing || null });
});

export default router;
