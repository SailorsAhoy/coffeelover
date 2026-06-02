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
import { useToast } from "@/hooks/use-toast";
import { Coffee, Package, Star, Plus, Trash2, Pencil } from "lucide-react";

interface Brand {
  id: string; name: string; description: string | null; origin_country: string | null;
  price_per_kg: number | null; is_available: boolean; image_url: string | null;
  affiliate_link: string | null; created_at: string;
}

const empty = { id: "", name: "", description: "", origin_country: "", price_per_kg: "", image_url: "", affiliate_link: "" };

const RoasteryDashboard = () => {
  const { user } = useCurrentUser();
  const { toast } = useToast();
  const [range, setRange] = useState<RangeKey>("30d");
  const since = useMemo(() => rangeStart(range), [range]);
  const [roasterId, setRoasterId] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rating, setRating] = useState({ avg: 0, count: 0 });

  const load = async () => {
    if (!user) return;
    const { data: rp } = await supabase.from("roaster_profiles").select("id").eq("user_id", user.id).maybeSingle();
    if (!rp?.id) return;
    setRoasterId(rp.id);
    let q = supabase.from("coffee_brands").select("*").eq("roaster_id", rp.id).order("created_at", { ascending: false });
    if (since) q = q.gte("created_at", since);
    const { data } = await q;
    setBrands((data as Brand[]) ?? []);
    const { data: rv } = await supabase.from("reviews").select("rating").eq("reviewable_type", "roaster").eq("reviewable_id", rp.id);
    const ratings = (rv as any[]) ?? [];
    setRating({ count: ratings.length, avg: ratings.length ? ratings.reduce((a, b) => a + (b.rating || 0), 0) / ratings.length : 0 });
  };

  useEffect(() => { load(); }, [user, since]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roasterId || !form.name.trim()) return;
    const payload: any = {
      roaster_id: roasterId,
      name: form.name.trim(),
      description: form.description || null,
      origin_country: form.origin_country || null,
      price_per_kg: form.price_per_kg ? Number(form.price_per_kg) : null,
      image_url: form.image_url || null,
      affiliate_link: form.affiliate_link || null,
    };
    const { error } = editingId
      ? await supabase.from("coffee_brands").update(payload).eq("id", editingId)
      : await supabase.from("coffee_brands").insert(payload);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    setForm(empty); setEditingId(null);
    toast({ title: editingId ? "Updated" : "Added" });
    load();
  };

  const edit = (b: Brand) => {
    setEditingId(b.id);
    setForm({
      id: b.id, name: b.name, description: b.description || "", origin_country: b.origin_country || "",
      price_per_kg: b.price_per_kg?.toString() || "", image_url: b.image_url || "", affiliate_link: b.affiliate_link || "",
    });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("coffee_brands").delete().eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    load();
  };

  return (
    <DashboardLayout title="Roastery hub" subtitle="Manage your roaster profile and coffees">
      <DateRangeFilter value={range} onChange={setRange} />
      <KpiRow
        items={[
          { label: "Roaster profile", value: roasterId ? "Active" : "Not set", icon: Coffee, to: "/roasters" },
          { label: "Coffees in period", value: brands.length, icon: Package, to: "/coffee" },
          { label: "Avg rating", value: rating.avg.toFixed(2), icon: Star, hint: `${rating.count} reviews` },
        ]}
      />

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-4 h-4" /> {editingId ? "Edit coffee" : "Add coffee"}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={120} /></div>
            <div className="space-y-1"><Label>Origin country</Label><Input value={form.origin_country} onChange={(e) => setForm({ ...form, origin_country: e.target.value })} /></div>
            <div className="space-y-1"><Label>Price per kg</Label><Input type="number" min="0" step="0.01" value={form.price_per_kg} onChange={(e) => setForm({ ...form, price_per_kg: e.target.value })} /></div>
            <div className="space-y-1"><Label>Image URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
            <div className="space-y-1 md:col-span-2"><Label>Affiliate link</Label><Input value={form.affiliate_link} onChange={(e) => setForm({ ...form, affiliate_link: e.target.value })} placeholder="https://..." /></div>
            <div className="space-y-1 md:col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={1000} /></div>
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit">{editingId ? "Save" : "Add"}</Button>
              {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(empty); }}>Cancel</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>My coffees</CardTitle></CardHeader>
        <CardContent>
          {brands.length === 0 ? (
            <p className="text-sm text-muted-foreground">No coffees yet.</p>
          ) : (
            <ul className="divide-y">
              {brands.map((b) => (
                <li key={b.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{b.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{[b.origin_country, b.price_per_kg ? `${b.price_per_kg} /kg` : null].filter(Boolean).join(" • ")}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => edit(b)}><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(b.id)}><Trash2 className="w-4 h-4" /></Button>
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

export default RoasteryDashboard;
