import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  FIELD_REGISTRY, PERMISSION_ROLES, type FieldCategory, type PermissionRole,
} from "@/lib/fieldRegistry";

interface Row {
  id?: string;
  category: string;
  role: string;
  field_key: string;
  can_edit: boolean;
}

const CATEGORIES: FieldCategory[] = ["shop", "roaster", "beans", "equipment"];

const FieldPermissions = () => {
  const [category, setCategory] = useState<FieldCategory>("shop");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("field_permissions" as any)
      .select("id, category, role, field_key, can_edit");
    if (error) toast.error(error.message);
    setRows(((data as unknown) as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const lookup = useMemo(() => {
    const m = new Map<string, Row>();
    rows.forEach((r) => m.set(`${r.category}|${r.role}|${r.field_key}`, r));
    return m;
  }, [rows]);

  const toggle = async (role: PermissionRole, field_key: string, next: boolean) => {
    const key = `${category}|${role}|${field_key}`;
    const existing = lookup.get(key);
    if (existing?.id) {
      const { error } = await supabase
        .from("field_permissions" as any)
        .update({ can_edit: next })
        .eq("id", existing.id);
      if (error) return toast.error(error.message);
      setRows((p) => p.map((r) => (r.id === existing.id ? { ...r, can_edit: next } : r)));
    } else {
      const { data, error } = await supabase
        .from("field_permissions" as any)
        .insert({ category, role, field_key, can_edit: next })
        .select()
        .single();
      if (error) return toast.error(error.message);
      setRows((p) => [...p, (data as unknown) as Row]);
    }
  };

  const fields = FIELD_REGISTRY[category];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Field permissions</CardTitle>
        <CardDescription>
          Control which fields each role can edit when creating or updating
          shops, roasters, beans, or equipment. Admins always have full access.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={category} onValueChange={(v) => setCategory(v as FieldCategory)}>
          <TabsList className="grid grid-cols-4 w-full md:w-[420px]">
            {CATEGORIES.map((c) => (
              <TabsTrigger key={c} value={c} className="capitalize">
                {c}
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORIES.map((c) => (
            <TabsContent key={c} value={c} className="mt-4">
              {c !== category ? null : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left font-medium py-2 pr-3">Field</th>
                        {PERMISSION_ROLES.map((r) => (
                          <th key={r} className="text-center font-medium py-2 px-2 capitalize">
                            {r.replace("_", " ")}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {fields.map((f) => (
                        <tr key={f.key} className="border-b last:border-0">
                          <td className="py-2 pr-3">
                            <div className="font-medium">{f.label}</div>
                            {f.group && (
                              <div className="text-[11px] text-muted-foreground">{f.group}</div>
                            )}
                          </td>
                          {PERMISSION_ROLES.map((role) => {
                            const v = lookup.get(`${category}|${role}|${f.key}`)?.can_edit ?? false;
                            const isAdmin = role === "admin";
                            return (
                              <td key={role} className="text-center py-2 px-2">
                                <Checkbox
                                  checked={isAdmin ? true : v}
                                  disabled={isAdmin || loading}
                                  onCheckedChange={(checked) =>
                                    toggle(role, f.key, !!checked)
                                  }
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {fields.length === 0 && (
                    <p className="py-6 text-center text-muted-foreground">
                      No fields registered for this category yet.
                    </p>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FieldPermissions;
