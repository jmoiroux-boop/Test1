import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export function getSupabase() {
  return supabase;
}

export function initDatabase() {
  console.log('Connected to Supabase:', supabaseUrl);
}

// Haversine distance in meters
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function isCacheValid(lat, lng, radius) {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('search_cache')
    .select('*')
    .gte('radius', radius)
    .gte('fetched_at', oneDayAgo);

  if (error || !data) return false;

  for (const entry of data) {
    const dist = haversineDistance(lat, lng, entry.lat, entry.lng);
    if (dist < 5000) return true;
  }
  return false;
}

export async function saveCacheEntry(lat, lng, radius) {
  await supabase.from('search_cache').insert({ lat, lng, radius });
}

export async function upsertCourse(course) {
  const { error } = await supabase
    .from('courses')
    .upsert(
      {
        osm_id: course.osm_id,
        osm_type: course.osm_type,
        name: course.name,
        lat: course.lat,
        lng: course.lng,
        website: course.website,
        phone: course.phone,
        holes: course.holes,
        operator: course.operator,
        address: course.address,
        fetched_at: new Date().toISOString(),
      },
      { onConflict: 'osm_id' }
    );

  if (error) console.error('Upsert course error:', error.message);
}

export async function getCoursesInRadius(lat, lng, radius) {
  const { data, error } = await supabase.from('courses').select('*');

  if (error || !data) return [];

  return data
    .map((c) => ({
      ...c,
      distance: haversineDistance(lat, lng, c.lat, c.lng),
    }))
    .filter((c) => c.distance <= radius)
    .sort((a, b) => a.distance - b.distance);
}

export async function getLatestPricing(courseId) {
  const { data, error } = await supabase
    .from('pricing')
    .select('*')
    .eq('course_id', courseId)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data;
}

export async function addPricing(courseId, pricing) {
  const { data, error } = await supabase
    .from('pricing')
    .insert({
      course_id: courseId,
      weekday_price: pricing.weekday_price ?? null,
      weekend_price: pricing.weekend_price ?? null,
      cart_price: pricing.cart_price ?? null,
      currency: pricing.currency || 'EUR',
      notes: pricing.notes || null,
      source: pricing.source || 'user',
    })
    .select()
    .single();

  if (error) console.error('Add pricing error:', error.message);
  return data;
}
