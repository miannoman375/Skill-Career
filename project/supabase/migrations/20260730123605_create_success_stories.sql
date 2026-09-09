/*
# Create success_stories table

1. New Tables
- `success_stories`
  - `id` (uuid, primary key)
  - `name` (text, learner's name)
  - `city` (text, learner's city)
  - `segment` (text, which audience segment: students / women-home / business)
  - `category` (text, skill track category: tech / creative / marketing / business / freelancing)
  - `track_label` (text, human-readable track name, e.g. "Full-Stack Web Development")
  - `outcome` (text, short one-line outcome, e.g. "Started earning Rs 40k/month")
  - `quote` (text, full outcome quote / story)
  - `photo_url` (text, URL to learner's photo/avatar)
  - `video_url` (text, optional URL to a video testimonial clip)
  - `featured` (boolean, whether to show as the hero featured story; default false)
  - `approved_for_publish` (boolean, admin approval flag; default false — submitted stories enter an approval queue)
  - `submitter_email` (text, optional contact for the learner who submitted)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `success_stories`.
- SELECT: anyone (anon + authenticated) can read only approved stories (approved_for_publish = true).
- INSERT: anyone (anon + authenticated) can submit a new story, but it MUST arrive as
  approved_for_publish = false so it enters the approval queue — the WITH CHECK enforces this.
- UPDATE / DELETE: no anon policies — only the service role (admin) can moderate/publish or remove stories.

3. Important Notes
- The public page only ever shows approved_for_publish = true rows.
- Submitted stories via the "Submit your story" form are inserted with approved_for_publish = false
  and stay hidden until an admin flips the flag (using the service role key in a moderation tool).
- No user_id / auth dependency — this is a single-tenant public submission flow.
*/

CREATE TABLE IF NOT EXISTS success_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  segment text NOT NULL,
  category text NOT NULL,
  track_label text NOT NULL,
  outcome text NOT NULL,
  quote text NOT NULL,
  photo_url text NOT NULL,
  video_url text,
  featured boolean NOT NULL DEFAULT false,
  approved_for_publish boolean NOT NULL DEFAULT false,
  submitter_email text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;

-- Public can read only approved stories
DROP POLICY IF EXISTS "public_read_approved_stories" ON success_stories;
CREATE POLICY "public_read_approved_stories"
ON success_stories FOR SELECT
TO anon, authenticated
USING (approved_for_publish = true);

-- Anyone can submit a story, but it must enter the queue as unapproved
DROP POLICY IF EXISTS "public_submit_story" ON success_stories;
CREATE POLICY "public_submit_story"
ON success_stories FOR INSERT
TO anon, authenticated
WITH CHECK (approved_for_publish = false);

-- Index for the common query: approved stories, optionally filtered
CREATE INDEX IF NOT EXISTS idx_success_stories_approved
ON success_stories (approved_for_publish, segment, category);
