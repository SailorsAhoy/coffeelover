import { useEffect, useState, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { type Permission, evaluate } from "@/lib/permissions";

export type AppRole = "admin" | "company" | "staff" | "pro_user" | "teacher" | "roaster" | "coffee_shop" | "producer" | "user" | "manufacturer" | "supplier" | "author";

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
}

export interface ActiveSubscription {
  id: string;
  plan_id: string;
  status: string;
  expires_at: string | null;
  plan: {
    code: string;
    name: string;
    modules: string[];
  };
}

export interface CurrentUserState {
  user: User | null;
  profile: Profile | null;
  roles: AppRole[];
  subscriptions: ActiveSubscription[];
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: AppRole) => boolean;
  hasModule: (mod: string) => boolean;
  can: (permission: Permission, ctx?: Record<string, unknown>) => boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useCurrentUser = (): CurrentUserState => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [subscriptions, setSubscriptions] = useState<ActiveSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(async (u: User | null) => {
    if (!u) {
      setProfile(null);
      setRoles([]);
      setSubscriptions([]);
      return;
    }
    const [{ data: p }, { data: r }, { data: s }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", u.id).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", u.id),
      (supabase as any)
        .from("user_subscriptions")
        .select("id, plan_id, status, expires_at, plan:subscription_plans(code, name, modules)")
        .eq("user_id", u.id)
        .eq("status", "active"),
    ]);
    setProfile(p as Profile | null);
    setRoles(((r ?? []) as { role: AppRole }[]).map((x) => x.role));
    setSubscriptions((s ?? []) as ActiveSubscription[]);
  }, []);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
    await loadUserData(data.user);
  }, [loadUserData]);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ?? null);
      // Defer DB calls to avoid deadlocks
      setTimeout(() => {
        loadUserData(session?.user ?? null);
      }, 0);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      loadUserData(session?.user ?? null).finally(() => setLoading(false));
    });

    return () => sub.subscription.unsubscribe();
  }, [loadUserData]);

  const hasRole = useCallback((role: AppRole) => roles.includes(role), [roles]);
  const hasModule = useCallback(
    (mod: string) =>
      subscriptions.some(
        (s) =>
          s.status === "active" &&
          (!s.expires_at || new Date(s.expires_at) > new Date()) &&
          s.plan?.modules?.includes(mod),
      ),
    [subscriptions],
  );

  const can = useCallback(
    (permission: Permission, ctx?: Record<string, unknown>) =>
      evaluate(permission, { user, roles, hasModule }, ctx),
    [user, roles, hasModule],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return {
    user,
    profile,
    roles,
    subscriptions,
    loading,
    isAuthenticated: !!user,
    hasRole,
    hasModule,
    can,
    refresh,
    signOut,
  };
};
