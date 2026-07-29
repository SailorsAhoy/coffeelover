import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAppSetting<T = unknown>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    // Reads go through a security-definer function that only exposes
    // whitelisted public keys. Admin-only settings stay unreadable.
    (supabase as any)
      .rpc("get_public_app_setting", { _key: key })
      .then(async ({ data, error }: any) => {
        let next = data;
        if (error || next === null || next === undefined) {
          // Admins (and only admins) can still read the row directly.
          const { data: row } = await (supabase as any)
            .from("app_settings")
            .select("value")
            .eq("key", key)
            .maybeSingle();
          next = row?.value;
        }
        if (!alive) return;
        if (next !== undefined && next !== null) setValue(next as T);
        setLoading(false);
      });


    const channel = supabase
      .channel(`app_settings:${key}:${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "app_settings", filter: `key=eq.${key}` },
        (payload: any) => {
          const next = payload.new?.value;
          if (next !== undefined && next !== null) setValue(next as T);
        },
      )
      .subscribe();

    return () => {
      alive = false;
      supabase.removeChannel(channel);
    };
  }, [key]);

  const update = useCallback(
    async (next: T) => {
      const { error } = await (supabase as any)
        .from("app_settings")
        .upsert({ key, value: next as any, updated_at: new Date().toISOString() }, { onConflict: "key" });
      if (!error) setValue(next);
      return { error };
    },
    [key],
  );

  return { value, loading, update };
}
