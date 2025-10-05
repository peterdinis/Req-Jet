import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { env } from '@/env';

// Vytvorenie custom storage adapteru pre Next.js
const createBrowserStorage = () => {
  if (typeof window === 'undefined') {
    // Fallback pre server-side rendering
    return {
      getItem: (key: string) => null,
      setItem: (key: string, value: string) => {},
      removeItem: (key: string) => {},
    };
  }
  return localStorage;
};

export const supabase = createClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL, 
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 
  {
    auth: {
      storage: createBrowserStorage(),
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);