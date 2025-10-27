import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getSecureValue, saveSecureValue, deleteSecureValue, hashPasscode } from '../lib/secure';
import { isSupabaseConfigured } from '../lib/env';

type User = any;

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUpWithEmail: (email: string, password: string) => Promise<any>;
  signInWithEmail: (email: string, password: string, remember?: boolean) => Promise<any>;
  signInWithProvider: (provider: 'google' | 'apple') => Promise<any>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // load session from secure store if present
    (async () => {
      try {
        const token = await getSecureValue('supabase_session');
        if (token) {
          try {
            const { data, error } = await supabase.auth.getUser(token);
            if (!error && data.user) setUser(data.user);
          } catch (e) {
            console.warn('Failed to restore session', e);
          }
        }
      } catch {
        console.warn('Error reading secure session');
      } finally {
        setLoading(false);
      }
    })();
    let authListener: any = null;
    try {
      const sub = supabase.auth.onAuthStateChange((event, session) => {
        try {
          if (session?.access_token) {
            setUser(session.user ?? null);
            // store session
            saveSecureValue('supabase_session', session.access_token).catch(console.warn);
          } else {
            setUser(null);
            deleteSecureValue('supabase_session').catch(console.warn);
          }
        } catch (e) {
          console.warn('Error in auth state change handler', e);
        }
      });
      authListener = sub;
    } catch {
      console.warn('Failed to subscribe to auth state changes');
    }

    return () => {
      try {
        authListener?.subscription?.unsubscribe();
      } catch {
        // ignore
      }
    };
  }, []);

  async function signUpWithEmail(email: string, password: string) {
    if (!isSupabaseConfigured()) {
      return { error: { message: 'Supabase not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY.' } };
    }
    const res = await supabase.auth.signUp({ email, password });
    return res;
  }

  async function signInWithEmail(email: string, password: string, remember = false) {
    if (!isSupabaseConfigured()) {
      return { error: { message: 'Supabase not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY.' } };
    }
    const res = await supabase.auth.signInWithPassword({ email, password });
    if (remember && res.data.session?.access_token) {
      // store access token (short-lived) and hashed passcode as fallback
      await saveSecureValue('supabase_session', res.data.session.access_token);
      const hashed = await hashPasscode(password);
      await saveSecureValue('remember_passcode_hash', hashed);
    }
    return res;
  }

  async function signInWithProvider(provider: 'google' | 'apple') {
    const res = await supabase.auth.signInWithOAuth({ provider });
    return res;
  }

  async function signOut() {
    await supabase.auth.signOut();
    await deleteSecureValue('supabase_session');
    await deleteSecureValue('remember_passcode_hash');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUpWithEmail, signInWithEmail, signInWithProvider, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
