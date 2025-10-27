// Simple environment helper for Supabase config
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export function isSupabaseConfigured() {
  // Consider configured when both values are present and not the example placeholders
  if (!SUPABASE_URL || !SUPABASE_KEY) return false;
  const placeholders = ['https://your-project.supabase.co', 'your-anon-key', 'your-publishable-key'];
  if (placeholders.includes(SUPABASE_URL)) return false;
  if (placeholders.includes(SUPABASE_KEY)) return false;
  return true;
}

export default {
  SUPABASE_URL,
  SUPABASE_KEY,
  isSupabaseConfigured,
};
