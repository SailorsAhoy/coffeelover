import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Package, Plus, Trash2, Factory } from "lucide-react";

interface SP {
  id: string;
  name: string;
  sale_price: number;
  currency: string | null;
  manufacturer_product_id: string | null;
  is_active: boolean;
  stock: number | null;
}

interface MP { id: string; name: string }

const SupplierDashboard = () => {
  const { user, profile } = useCurrentUser();
  const { toast } = useToast();
  const [items, setItems] = useState<SP[]>([]);
  const [catalog, setCatalog] = useState<MP[]>([]);
  const [form, setForm] = useState({ source: "new", manufacturer_product_id: "", name: "", sale_price: "", currency: "USD", stock: "" });
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!user) return;
    const [mine, cat] = await Promise.all([
      supabase.from("supplier_products").select("*").eq("supplier_user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("manufacturer_products").select("id, name").eq("is_published", true).order("name"),
    ]);
    setItems((mine.data as SP[]) ?? []);
    setCatalog((cat.data as MP[]) ?? []);
  };

  useEffect(() => { load(); }, [user]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.sale_price) return;
    const linked = form.source === "catalog" && form.manufacturer_product_id;
    const name = linked
      ? catalog.find((c) => c.id === form.manufacturer_product_id)?.name || ""
      : form.name.trim();
    if (!name) return toast({ title: "Pick a product or enter a name", variant: "destructive" });
    setBusy(true);
    const { error } = await supabase.from("supplier_products").insert({
      supplier_user_id: user.id,
      manufacturer_product_id: linked ? form.manufacturer_product_id : null,
      name,
      sale_price: Number(form.sale_price),
      currency: form.currency || "USD",
      stock: form.stock ? Number(form.stock) : null,
    });
    setBusy(false);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    setForm({ source: "new", manufacturer_product_id: "", name: "", sale_price: "", currency: "USD", stock: "" });
    toast({ title: "Product added" });
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("supplier_products").delete().eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    load();
  };

  return (
    <DashboardLayout title="Supplier hub" subtitle={profile?.name || ""}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Company" value="Profile" icon={Factory} to="/profile" />
        <StatCard label="Listings" value={items.length} icon={Package} />
        <StatCard label="Catalog" value={catalog.length} icon={Package} hint="Manufacturer products" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Plus className="w-4 h-4" /> Add product listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                <Select value={form.manufacturer_product_id} onValueChange={(v) => setForm({ ...form, manufacturer_product_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Choose product" /></SelectTrigger>
                  <SelectContent>
                    {catalog.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-1 md:col-span-2">
                <Label>Product name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={120} />
              </div>
            )}
            <div className="space-y-1">
              <Label>Sale price *</Label>
              <Input type="number" min="0" step="0.01" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} required />
            </div>
            <div className="space-y-1">
              <Label>Currency</Label>
              <Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} maxLength={3} />
            </div>
            <div className="space-y-1">
              <Label>Stock</Label>
              <Input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Add listing"}</Button>
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
                    <p className="font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.sale_price} {p.currency} {p.stock != null ? `• stock ${p.stock}` : ""} {p.manufacturer_product_id ? "• from catalog" : ""}
                    </p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => remove(p.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
