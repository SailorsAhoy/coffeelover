import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Package, Plus, Trash2, Building2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  base_price: number | null;
  currency: string | null;
  is_published: boolean;
}

const ManufacturerDashboard = () => {
  const { user, profile } = useCurrentUser();
  const { toast } = useToast();
  const [items, setItems] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", description: "", category: "", base_price: "", currency: "USD" });
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("manufacturer_products")
      .select("*")
      .eq("manufacturer_user_id", user.id)
      .order("created_at", { ascending: false });
    setItems((data as Product[]) ?? []);
  };

  useEffect(() => {
    load();
  }, [user]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.name.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("manufacturer_products").insert({
      manufacturer_user_id: user.id,
      name: form.name.trim(),
      description: form.description || null,
      category: form.category || null,
      base_price: form.base_price ? Number(form.base_price) : null,
      currency: form.currency || "USD",
    });
    setBusy(false);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    setForm({ name: "", description: "", category: "", base_price: "", currency: "USD" });
    toast({ title: "Product added" });
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("manufacturer_products").delete().eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    load();
  };

  return (
    <DashboardLayout title="Manufacturer hub" subtitle={profile?.name || ""}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Company" value="Profile" icon={Building2} to="/profile" />
        <StatCard label="Products" value={items.length} icon={Package} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Plus className="w-4 h-4" /> Add product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={120} />
            </div>
            <div className="space-y-1">
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Espresso machine, grinder..." />
            </div>
            <div className="space-y-1">
              <Label>Base price</Label>
              <Input type="number" min="0" step="0.01" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Currency</Label>
              <Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} maxLength={3} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={1000} />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Add product"}</Button>
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
                    <p className="font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {[p.category, p.base_price ? `${p.base_price} ${p.currency || ""}` : null].filter(Boolean).join(" • ")}
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

export default ManufacturerDashboard;
