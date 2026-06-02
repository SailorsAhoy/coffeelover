import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { KpiRow } from "@/components/dashboard/KpiRow";
import { DateRangeFilter, rangeStart, type RangeKey } from "@/components/dashboard/DateRangeFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Package, Plus, Trash2, Pencil, Building2, Eye } from "lucide-react";

interface Product {
  id: string; name: string; description: string | null; category: string | null;
  base_price: number | null; currency: string | null; is_published: boolean; image_url: string | null; created_at: string;
}

const empty = { id: "", name: "", description: "", category: "", base_price: "", currency: "USD", image_url: "", is_published: true };

const ManufacturerDashboard = () => {
  const { user, profile } = useCurrentUser();
  const { toast } = useToast();
  const [range, setRange] = useState<RangeKey>("30d");
  const since = useMemo(() => rangeStart(range), [range]);
  const [items, setItems] = useState<Product[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    let q = supabase.from("manufacturer_products").select("*").eq("manufacturer_user_id", user.id).order("created_at", { ascending: false });
    if (since) q = q.gte("created_at", since);
    const { data } = await q;
    setItems((data as Product[]) ?? []);
  };

  useEffect(() => { load(); }, [user, since]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.name.trim()) return;
    const payload: any = {
      manufacturer_user_id: user.id,
      name: form.name.trim(),
      description: form.description || null,
      category: form.category || null,
      base_price: form.base_price ? Number(form.base_price) : null,
      currency: form.currency || "USD",
      image_url: form.image_url || null,
      is_published: form.is_published,
    };
    const { error } = editingId
      ? await supabase.from("manufacturer_products").update(payload).eq("id", editingId)
      : await supabase.from("manufacturer_products").insert(payload);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    setForm(empty); setEditingId(null);
    toast({ title: editingId ? "Updated" : "Added" });
    load();
  };

  const edit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      id: p.id, name: p.name, description: p.description || "", category: p.category || "",
      base_price: p.base_price?.toString() || "", currency: p.currency || "USD",
      image_url: p.image_url || "", is_published: p.is_published,
    });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("manufacturer_products").delete().eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    load();
  };

  const published = items.filter((i) => i.is_published).length;

  return (
    <DashboardLayout title="Manufacturer hub" subtitle={profile?.name || ""}>
      <DateRangeFilter value={range} onChange={setRange} />
      <KpiRow
        items={[
          { label: "Company", value: "Profile", icon: Building2, to: "/profile" },
          { label: "Products in period", value: items.length, icon: Package },
          { label: "Published", value: published, icon: Eye },
        ]}
      />

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-4 h-4" /> {editingId ? "Edit product" : "Add product"}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={120} /></div>
            <div className="space-y-1"><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Espresso machine, grinder..." /></div>
            <div className="space-y-1"><Label>Base price</Label><Input type="number" min="0" step="0.01" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: e.target.value })} /></div>
            <div className="space-y-1"><Label>Currency</Label><Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} maxLength={3} /></div>
            <div className="space-y-1 md:col-span-2"><Label>Image URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
            <div className="space-y-1 md:col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={1000} /></div>
            <div className="flex items-center gap-2 md:col-span-2">
              <Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} />
              <Label>Published in catalog (visible to suppliers)</Label>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit">{editingId ? "Save" : "Add"}</Button>
              {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(empty); }}>Cancel</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>My products</CardTitle></CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products yet.</p>
          ) : (
            <ul className="divide-y">
              {items.map((p) => (
                <li key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{p.name} {!p.is_published && <span className="text-xs text-muted-foreground">(draft)</span>}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {[p.category, p.base_price ? `${p.base_price} ${p.currency || ""}` : null].filter(Boolean).join(" • ")}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => edit(p)}><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ManufacturerDashboard;
