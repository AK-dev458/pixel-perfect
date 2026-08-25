import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "@/integrations/supabase/client";

export type Profile = { id: string; full_name: string | null; avatar_url: string | null };

type AuthValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  displayName: string;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signUp: (
    fullName: string,
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; needsConfirmation?: boolean; error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id ?? null;

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }
    let active = true;
    void supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setProfile(data ?? null);
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const signIn = useCallback<AuthValue["signIn"]>(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  const signUp = useCallback<AuthValue["signUp"]>(async (fullName, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: fullName.trim() },
      },
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, needsConfirmation: !data.session };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  }, []);

  const value = useMemo<AuthValue>(() => {
    const email = session?.user.email ?? "";
    return {
      user: session?.user ?? null,
      session,
      profile,
      loading,
      displayName:
        profile?.full_name ||
        (session?.user.user_metadata?.["full_name"] as string | undefined) ||
        email.split("@")[0] ||
        "Member",
      signIn,
      signUp,
      signOut,
    };
  }, [session, profile, loading, signIn, signUp, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
