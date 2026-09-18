import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

function makeStorage() {
  if (Platform.OS === 'web') {
    return {
      getItem: (k: string) => Promise.resolve(localStorage.getItem(k)),
      setItem: (k: string, v: string) => Promise.resolve(localStorage.setItem(k, v)),
      removeItem: (k: string) => Promise.resolve(localStorage.removeItem(k)),
    };
  }
  const A = require('@react-native-async-storage/async-storage').default;
  return A;
}

export const supabase =
  url && key
    ? createClient(url, key, {
        auth: {
          storage: makeStorage(),
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;
