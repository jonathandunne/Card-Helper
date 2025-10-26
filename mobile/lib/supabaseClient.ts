// URL polyfill is required for React Native environments
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project's values
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false, // we'll manage session storage ourselves
  },
});
