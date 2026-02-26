-- Migration SQL pour Supabase
-- À exécuter dans le SQL Editor de Supabase

-- Table des parcours de golf
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  osm_id TEXT UNIQUE NOT NULL,
  osm_type TEXT NOT NULL,
  name TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  website TEXT,
  phone TEXT,
  holes TEXT,
  operator TEXT,
  address TEXT,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des tarifs
CREATE TABLE IF NOT EXISTS pricing (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  weekday_price DOUBLE PRECISION,
  weekend_price DOUBLE PRECISION,
  cart_price DOUBLE PRECISION,
  currency TEXT DEFAULT 'EUR',
  notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source TEXT DEFAULT 'user'
);

-- Table de cache des recherches
CREATE TABLE IF NOT EXISTS search_cache (
  id SERIAL PRIMARY KEY,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  radius INTEGER NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_courses_location ON courses(lat, lng);
CREATE INDEX IF NOT EXISTS idx_pricing_course ON pricing(course_id);
CREATE INDEX IF NOT EXISTS idx_cache_location ON search_cache(lat, lng, radius);
