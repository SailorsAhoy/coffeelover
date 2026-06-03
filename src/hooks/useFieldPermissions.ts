import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { FieldCategory } from "@/lib/fieldRegistry";

interface Row {
  category: string;
  role: string;
  field_key: string;
  can_edit: boolean;
}

/**
 * Returns a `can(fieldKey)` helper for the given category, based on the
 * field_permissions table. The user's "effective role" for matching is:
 *   admin > owner (any list_* permission) > role on user_roles > "user".
 * Admins always pass (defensive default).
 */
export const useFieldPermissions = (category: FieldCategory) => {
  const { roles, can } = useCurrentUser();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("field_permissions" as any)
        .select("category, role, field_key, can_edit")
        .eq("category", category);
      if (!active) return;
      setRows(((data as unknown) as Row[]) ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [category]);

  const effectiveRole = useMemo<string>(() => {
    if (roles.includes("admin")) return "admin";
    if (
      can("list_shop") ||
      can("list_roaster") ||
      can("list_equipment") ||
      roles.includes("company") ||
      roles.includes("coffee_shop") ||
      roles.includes("roaster") ||
      roles.includes("producer")
    )
      return "owner";
    return "user";
  }, [roles, can]);

  const canField = useMemo(() => {
    const map = new Map<string, boolean>();
    rows.forEach((r) => {
      if (r.role === effectiveRole) map.set(r.field_key, r.can_edit);
    });
    return (key: string) => {
      if (effectiveRole === "admin") return true;
      // If no rule exists, default to false for safety on gated fields,
      // but allow universal basics so forms still work pre-seeding.
      const v = map.get(key);
      return v === undefined ? false : v;
    };
  }, [rows, effectiveRole]);

  return { canField, loading, effectiveRole };
};
