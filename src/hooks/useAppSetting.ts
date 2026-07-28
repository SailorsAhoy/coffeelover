import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAppSetting<T = unknown>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (supabase as any)
      .from("app_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle()
      .then(({ data }: any) => {
        if (!alive) return;
        if (data?.value !== undefined && data?.value !== null) setValue(data.value as T);
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
