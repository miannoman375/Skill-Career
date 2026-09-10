/*
# Create content tables for admin-managed site content

## Overview
This migration creates all the tables needed to make the home page content
admin-editable. Instead of hardcoded data in the frontend, all career tracks,
webinars, success stories, segments, steps, stats, and myths will live in the
database and be editable through an admin panel.

## New Tables

1. **segments** — The three audience types (Students, Women, Business Owners)
   - id (text, primary key) — e.g. 'students', 'women-home', 'business'
   - label (text) — display name
   - blurb (text) — short description
   - icon (text) — icon key: 'graduation-cap', 'home', 'store'
   - sort_order (int) — display ordering
   - created_at, updated_at (timestamps)

2. **tracks** — Career skill tracks shown in Career Explainer Library
   - id (text, primary key) — e.g. 'web-dev'
   - title, description, category, category_label
   - pay_range, time_to_income, duration, level
   - thumbnail (text — image URL)
   - suitable_for (text[] — array of tags)
   - segment_id (text FK → segments.id)
   - featured (boolean)
   - sort_order (int)
   - created_at, updated_at

3. **webinars** — Upcoming live sessions
   - id (text, primary key)
   - title, date, time, segment_tag, speaker
   - category (text, nullable)
   - sort_order (int)
   - created_at, updated_at

4. **stories** — Success stories
   - id (text, primary key)
   - name, role, location, quote, outcome
   - avatar (text — image URL)
   - sort_order (int)
   - created_at, updated_at

5. **steps** — "How it works" steps
   - id (text, primary key)
   - step (int), label, title, detail, icon
   - sort_order (int)
   - created_at, updated_at

6. **stats** — Stats bar numbers
   - id (text, primary key)
   - value (text), label (text)
   - sort_order (int)
   - created_at, updated_at

7. **myths** — Myth-busting section
   - id (text, primary key)
   - myth, truth
   - sort_order (int)
   - created_at, updated_at

## Security
- RLS enabled on ALL tables.
- Public read access (anon + authenticated) for all tables — the home page
  must load content without a login.
- Write access (INSERT/UPDATE/DELETE) restricted to authenticated users only
  (the admin). This is a simple admin gate: anyone with a Supabase auth account
  can edit. For a production app you'd add a role column, but this is sufficient
  for the admin panel use case.
*/

-- ============ SEGMENTS ============
CREATE TABLE IF NOT EXISTS segments (
  id text PRIMARY KEY,
  label text NOT NULL,
  blurb text NOT NULL,
  icon text NOT NULL DEFAULT 'graduation-cap',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE segments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_segments" ON segments;
CREATE POLICY "public_read_segments" ON segments FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_segments" ON segments;
CREATE POLICY "auth_insert_segments" ON segments FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_segments" ON segments;
CREATE POLICY "auth_update_segments" ON segments FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_segments" ON segments;
CREATE POLICY "auth_delete_segments" ON segments FOR DELETE
  TO authenticated USING (true);

-- ============ TRACKS ============
CREATE TABLE IF NOT EXISTS tracks (
  id text PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  category_label text NOT NULL,
  pay_range text NOT NULL,
  time_to_income text NOT NULL,
  duration text NOT NULL,
  level text NOT NULL,
  thumbnail text NOT NULL,
  description text NOT NULL,
  suitable_for text[] NOT NULL DEFAULT '{}',
  segment_id text REFERENCES segments(id) ON DELETE SET NULL,
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_tracks" ON tracks;
CREATE POLICY "public_read_tracks" ON tracks FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_tracks" ON tracks;
CREATE POLICY "auth_insert_tracks" ON tracks FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_tracks" ON tracks;
CREATE POLICY "auth_update_tracks" ON tracks FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_tracks" ON tracks;
CREATE POLICY "auth_delete_tracks" ON tracks FOR DELETE
  TO authenticated USING (true);

-- ============ WEBINARS ============
CREATE TABLE IF NOT EXISTS webinars (
  id text PRIMARY KEY,
  title text NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  segment_tag text NOT NULL,
  speaker text NOT NULL,
  category text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_webinars" ON webinars;
CREATE POLICY "public_read_webinars" ON webinars FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_webinars" ON webinars;
CREATE POLICY "auth_insert_webinars" ON webinars FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_webinars" ON webinars;
CREATE POLICY "auth_update_webinars" ON webinars FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_webinars" ON webinars;
CREATE POLICY "auth_delete_webinars" ON webinars FOR DELETE
  TO authenticated USING (true);

-- ============ STORIES ============
CREATE TABLE IF NOT EXISTS stories (
  id text PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  location text NOT NULL,
  quote text NOT NULL,
  outcome text NOT NULL,
  avatar text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_stories" ON stories;
CREATE POLICY "public_read_stories" ON stories FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_stories" ON stories;
CREATE POLICY "auth_insert_stories" ON stories FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_stories" ON stories;
CREATE POLICY "auth_update_stories" ON stories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_stories" ON stories;
CREATE POLICY "auth_delete_stories" ON stories FOR DELETE
  TO authenticated USING (true);

-- ============ STEPS ============
CREATE TABLE IF NOT EXISTS steps (
  id text PRIMARY KEY,
  step int NOT NULL,
  label text NOT NULL,
  title text NOT NULL,
  detail text NOT NULL,
  icon text NOT NULL DEFAULT 'radio',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE steps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_steps" ON steps;
CREATE POLICY "public_read_steps" ON steps FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_steps" ON steps;
CREATE POLICY "auth_insert_steps" ON steps FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_steps" ON steps;
CREATE POLICY "auth_update_steps" ON steps FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_steps" ON steps;
CREATE POLICY "auth_delete_steps" ON steps FOR DELETE
  TO authenticated USING (true);

-- ============ STATS ============
CREATE TABLE IF NOT EXISTS stats (
  id text PRIMARY KEY,
  value text NOT NULL,
  label text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_stats" ON stats;
CREATE POLICY "public_read_stats" ON stats FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_stats" ON stats;
CREATE POLICY "auth_insert_stats" ON stats FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_stats" ON stats;
CREATE POLICY "auth_update_stats" ON stats FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_stats" ON stats;
CREATE POLICY "auth_delete_stats" ON stats FOR DELETE
  TO authenticated USING (true);

-- ============ MYTHS ============
CREATE TABLE IF NOT EXISTS myths (
  id text PRIMARY KEY,
  myth text NOT NULL,
  truth text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE myths ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_myths" ON myths;
CREATE POLICY "public_read_myths" ON myths FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_myths" ON myths;
CREATE POLICY "auth_insert_myths" ON myths FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_myths" ON myths;
CREATE POLICY "auth_update_myths" ON myths FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_myths" ON myths;
CREATE POLICY "auth_delete_myths" ON myths FOR DELETE
  TO authenticated USING (true);

-- ============ updated_at trigger ============
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS segments_updated_at ON segments;
CREATE TRIGGER segments_updated_at BEFORE UPDATE ON segments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS tracks_updated_at ON tracks;
CREATE TRIGGER tracks_updated_at BEFORE UPDATE ON tracks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS webinars_updated_at ON webinars;
CREATE TRIGGER webinars_updated_at BEFORE UPDATE ON webinars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS stories_updated_at ON stories;
CREATE TRIGGER stories_updated_at BEFORE UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS steps_updated_at ON steps;
CREATE TRIGGER steps_updated_at BEFORE UPDATE ON steps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS stats_updated_at ON stats;
CREATE TRIGGER stats_updated_at BEFORE UPDATE ON stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS myths_updated_at ON myths;
CREATE TRIGGER myths_updated_at BEFORE UPDATE ON myths
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();