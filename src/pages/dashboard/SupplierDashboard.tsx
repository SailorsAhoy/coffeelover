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
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Package, Plus, Trash2, Pencil, Factory, Eye } from "lucide-react";

interface SP {
  id: string; name: string; sale_price: number; currency: string | null;
  manufacturer_product_id: string | null; is_active: boolean; stock: number | null;
  description: string | null; image_url: string | null; created_at: string;
}
interface MP { id: string; name: string; base_price: number | null; currency: string | null }

const empty = { id: "", source: "new", manufacturer_product_id: "", name: "", sale_price: "", currency: "USD", stock: "", description: "", image_url: "", is_active: true };

const SupplierDashboard = () => {
  const { user, profile } = useCurrentUser();
  const { toast } = useToast();
  const [range, setRange] = useState<RangeKey>("30d");
  const since = useMemo(() => rangeStart(range), [range]);
  const [items, setItems] = useState<SP[]>([]);
  const [catalog, setCatalog] = useState<MP[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    let q = supabase.from("supplier_products").select("*").eq("supplier_user_id", user.id).order("created_at", { ascending: false });
    if (since) q = q.gte("created_at", since);
    const [mine, cat] = await Promise.all([
      q,
      supabase.from("manufacturer_products").select("id, name, base_price, currency").eq("is_published", true).order("name"),
    ]);
    setItems((mine.data as SP[]) ?? []);
    setCatalog((cat.data as MP[]) ?? []);
  };

  useEffect(() => { load(); }, [user, since]);

  const onPickCatalog = (id: string) => {
    const m = catalog.find((c) => c.id === id);
    setForm((f) => ({
      ...f,
      manufacturer_product_id: id,
      name: m?.name || f.name,
      currency: m?.currency || f.currency,
      sale_price: m?.base_price?.toString() || f.sale_price,
    }));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.sale_price) return;
    const linked = form.source === "catalog" && form.manufacturer_product_id;
    const name = linked ? catalog.find((c) => c.id === form.manufacturer_product_id)?.name || form.name : form.name.trim();
    if (!name) return toast({ title: "Pick a product or enter a name", variant: "destructive" });
    const payload: any = {
      supplier_user_id: user.id,
      manufacturer_product_id: linked ? form.manufacturer_product_id : null,
      name,
      sale_price: Number(form.sale_price),
      currency: form.currency || "USD",
      stock: form.stock ? Number(form.stock) : null,
      description: form.description || null,
      image_url: form.image_url || null,
      is_active: form.is_active,
    };
    const { error } = editingId
      ? await supabase.from("supplier_products").update(payload).eq("id", editingId)
      : await supabase.from("supplier_products").insert(payload);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    setForm(empty); setEditingId(null);
    toast({ title: editingId ? "Updated" : "Added" });
    load();
  };

  const edit = (p: SP) => {
    setEditingId(p.id);
    setForm({
      id: p.id, source: p.manufacturer_product_id ? "catalog" : "new",
      manufacturer_product_id: p.manufacturer_product_id || "", name: p.name,
      sale_price: p.sale_price.toString(), currency: p.currency || "USD",
      stock: p.stock?.toString() || "", description: p.description || "",
      image_url: p.image_url || "", is_active: p.is_active,
    });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("supplier_products").delete().eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    load();
  };

  const active = items.filter((i) => i.is_active).length;
  const inventoryValue = items.reduce((sum, i) => sum + (i.sale_price || 0) * (i.stock || 0), 0);

  return (
    <DashboardLayout title="Supplier hub" subtitle={profile?.name || ""}>
      <DateRangeFilter value={range} onChange={setRange} />
      <KpiRow
        items={[
          { label: "Company", value: "Profile", icon: Factory, to: "/profile" },
          { label: "Listings in period", value: items.length, icon: Package },
          { label: "Active", value: active, icon: Eye },
          { label: "Inventory value", value: inventoryValue.toFixed(0), icon: Package, hint: "stock × sale price" },
          { label: "Catalog", value: catalog.length, icon: Package, hint: "Manufacturer products" },
        ]}
      />

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-4 h-4" /> {editingId ? "Edit listing" : "Add listing"}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1 md:col-span-2">
              <Label>Source</Label>
              <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="catalog">Pick from manufacturer catalog</SelectItem>
                  <SelectItem value="new">Create new product</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.source === "catalog" ? (
              <div className="space-y-1 md:col-span-2">
                <Label>Manufacturer product *</Label>
                <Select value={form.manufacturer_product_id} onValueChange={onPickCatalog}>
                  <SelectTrigger><SelectValue placeholder="Choose product" /></SelectTrigger>
                  <SelectContent>
                    {catalog.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}{c.base_price ? ` — base ${c.base_price} ${c.currency || ""}` : ""}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-1 md:col-span-2">
                <Label>Product name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={120} />
              </div>
            )}
            <div className="space-y-1"><Label>Sale price *</Label><Input type="number" min="0" step="0.01" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} required /></div>
            <div className="space-y-1"><Label>Currency</Label><Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} maxLength={3} /></div>
            <div className="space-y-1"><Label>Stock</Label><Input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
            <div className="space-y-1"><Label>Image URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
            <div className="flex items-center gap-2 md:col-span-2">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <Label>Active listing</Label>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit">{editingId ? "Save" : "Add"}</Button>
              {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(empty); }}>Cancel</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>My listings</CardTitle></CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No listings yet.</p>
          ) : (
            <ul className="divide-y">
              {items.map((p) => (
                <li key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{p.name} {!p.is_active && <span className="text-xs text-muted-foreground">(inactive)</span>}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.sale_price} {p.currency} {p.stock != null ? `• stock ${p.stock}` : ""} {p.manufacturer_product_id ? "• from catalog" : ""}
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

export default SupplierDashboard;
