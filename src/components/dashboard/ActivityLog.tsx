import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { Activity } from "lucide-react";

interface Entry {
  id: string;
  actor_user_id: string | null;
  entity_type: string;
  entity_id: string | null;
  action: string;
  shop_id: string | null;
  metadata: any;
  created_at: string;
  actor?: { name: string | null; email: string | null } | null;
}

const ENTITY_OPTIONS = ["all", "shop", "staff", "manufacturer_product", "supplier_product", "coffee_product"];
const ACTION_OPTIONS = ["all", "created", "updated", "deleted"];

export const ActivityLog = ({ sinceISO }: { sinceISO: string | null }) => {
  const [items, setItems] = useState<Entry[]>([]);
  const [entity, setEntity] = useState("all");
  const [action, setAction] = useState("all");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let query = supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (sinceISO) query = query.gte("created_at", sinceISO);
      if (entity !== "all") query = query.eq("entity_type", entity);
      if (action !== "all") query = query.eq("action", action);
      const { data } = await query;
      const rows = (data as Entry[]) ?? [];
      const ids = Array.from(new Set(rows.map((r) => r.actor_user_id).filter(Boolean))) as string[];
      let profiles: Record<string, { name: string | null; email: string | null }> = {};
      if (ids.length) {
        const { data: p } = await supabase.from("profiles").select("id, name, email").in("id", ids);
        (p ?? []).forEach((x: any) => (profiles[x.id] = { name: x.name, email: x.email }));
      }
      setItems(rows.map((r) => ({ ...r, actor: r.actor_user_id ? profiles[r.actor_user_id] ?? null : null })));
      setLoading(false);
    })();
  }, [sinceISO, entity, action]);

  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const s = q.toLowerCase();
    return items.filter(
      (e) =>
        (e.actor?.name || "").toLowerCase().includes(s) ||
        (e.actor?.email || "").toLowerCase().includes(s) ||
        (e.entity_id || "").toLowerCase().includes(s) ||
        (e.shop_id || "").toLowerCase().includes(s),
    );
  }, [items, q]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Activity className="w-4 h-4" /> Activity log</CardTitle>
        <div className="flex flex-wrap gap-2 pt-3">
          <Select value={entity} onValueChange={setEntity}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              {ENTITY_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              {ACTION_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search actor, entity, shop" className="max-w-xs" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity in this period.</p>
        ) : (
          <ul className="divide-y max-h-[480px] overflow-auto">
            {filtered.map((e) => (
              <li key={e.id} className="py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{e.actor?.name || e.actor?.email || "Unknown user"}</span>{" "}
                    <Badge variant="outline" className="ml-1">{e.action}</Badge>{" "}
                    <span className="text-muted-foreground">{e.entity_type}</span>
                    {e.shop_id && <span className="text-muted-foreground"> · shop {e.shop_id}</span>}
                  </p>
                  {e.entity_id && <p className="text-xs text-muted-foreground truncate">id: {e.entity_id}</p>}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(e.created_at), { addSuffix: true })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
