// Supabase is no longer used — this project now uses a custom
// Node.js + MongoDB backend (see src/lib/api.ts). This export is
// kept only so older files that still import `supabase` don't crash
// immediately; they will be updated to use the API instead.
export const supabase = null;