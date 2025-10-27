// URL polyfill is required for React Native environments
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from './env';

// Create the client using values from `lib/env.ts` (so runtime checks are centralized)
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false, // we'll manage session storage ourselves
  },
});
