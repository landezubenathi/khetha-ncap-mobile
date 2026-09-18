/**
 * src/lib/session.ts
 * Session management: guard hook, token refresh watcher, expiry handler.
 */

import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { supabase } from './supabase';

export type AuthState = 'loading' | 'authenticated' | 'guest' | 'unauthenticated';

/**
 * Returns the current auth state and the user id (if authenticated).
 * Redirects to /auth if the session expires mid-session.
 */
export function useSession(): { authState: AuthState; userId: string | null } {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      // Demo / guest mode — no Supabase configured
      setAuthState('guest');
      return;
    }

    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        setAuthState('authenticated');
      } else {
        setAuthState('unauthenticated');
      }
    });

    // Watch for auth state changes (token refresh, sign-out, expiry)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUserId(session.user.id);
        setAuthState('authenticated');
      }
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setUserId(null);
        setAuthState('unauthenticated');
        router.replace('/auth');
      }
      if (event === 'TOKEN_REFRESHED' && session?.user) {
        setUserId(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { authState, userId };
}

/**
 * Require authentication to view a screen.
 * Returns true once the session is confirmed (authenticated or guest).
 * Redirects to /auth if unauthenticated.
 */
export function useRequireAuth(): boolean {
  const { authState } = useSession();

  useEffect(() => {
    if (authState === 'unauthenticated') {
      router.replace('/auth');
    }
  }, [authState]);

  return authState === 'authenticated' || authState === 'guest';
}

/**
 * Sign out and clear session.
 */
export async function signOut(): Promise<void> {
  if (supabase) await supabase.auth.signOut();
  router.replace('/auth');
}
