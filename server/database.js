import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'data', 'golf.db');

let db;

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function initDatabase() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      osm_id TEXT UNIQUE NOT NULL,
      osm_type TEXT NOT NULL,
      name TEXT,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      website TEXT,
      phone TEXT,
      holes TEXT,
      operator TEXT,
      address TEXT,
      fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS pricing (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL REFERENCES courses(id),
      weekday_price REAL,
      weekend_price REAL,
      cart_price REAL,
      currency TEXT DEFAULT 'EUR',
      notes TEXT,
      submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
      source TEXT DEFAULT 'user'
    );

    CREATE TABLE IF NOT EXISTS search_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      radius INTEGER NOT NULL,
      fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_courses_location ON courses(lat, lng);
    CREATE INDEX IF NOT EXISTS idx_pricing_course ON pricing(course_id);
    CREATE INDEX IF NOT EXISTS idx_cache_location ON search_cache(lat, lng, radius);
  `);

  return db;
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

export function isCacheValid(lat, lng, radius) {
  const db = getDb();
  const row = db.prepare(`
    SELECT id, lat, lng, radius, fetched_at FROM search_cache
    WHERE radius >= ?
      AND datetime(fetched_at) > datetime('now', '-24 hours')
    ORDER BY fetched_at DESC
  `).all(radius);

  for (const entry of row) {
    const dist = haversineDistance(lat, lng, entry.lat, entry.lng);
    if (dist < 5000) return true;
  }
  return false;
}

export function saveCacheEntry(lat, lng, radius) {
  const db = getDb();
  db.prepare('INSERT INTO search_cache (lat, lng, radius) VALUES (?, ?, ?)').run(lat, lng, radius);
}

export function upsertCourse(course) {
  const db = getDb();
  db.prepare(`
    INSERT INTO courses (osm_id, osm_type, name, lat, lng, website, phone, holes, operator, address)
    VALUES (@osm_id, @osm_type, @name, @lat, @lng, @website, @phone, @holes, @operator, @address)
    ON CONFLICT(osm_id) DO UPDATE SET
      name = excluded.name,
      lat = excluded.lat,
      lng = excluded.lng,
      website = excluded.website,
      phone = excluded.phone,
      holes = excluded.holes,
      operator = excluded.operator,
      address = excluded.address,
      fetched_at = datetime('now')
  `).run(course);
}

export function getCoursesInRadius(lat, lng, radius) {
  const db = getDb();
  const courses = db.prepare('SELECT * FROM courses').all();

  return courses
    .map((c) => ({
      ...c,
      distance: haversineDistance(lat, lng, c.lat, c.lng),
    }))
    .filter((c) => c.distance <= radius)
    .sort((a, b) => a.distance - b.distance);
}

export function getLatestPricing(courseId) {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM pricing
    WHERE course_id = ?
    ORDER BY submitted_at DESC
    LIMIT 1
  `).get(courseId);
}

export function addPricing(courseId, pricing) {
  const db = getDb();
  return db.prepare(`
    INSERT INTO pricing (course_id, weekday_price, weekend_price, cart_price, currency, notes, source)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    courseId,
    pricing.weekday_price ?? null,
    pricing.weekend_price ?? null,
    pricing.cart_price ?? null,
    pricing.currency || 'EUR',
    pricing.notes || null,
    pricing.source || 'user'
  );
}
