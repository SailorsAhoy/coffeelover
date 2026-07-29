import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { KpiRow } from "@/components/dashboard/KpiRow";
import { DateRangeFilter, rangeStart, type RangeKey } from "@/components/dashboard/DateRangeFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Store, Users, ImageIcon, Star, ExternalLink, Plus, Trash2, UserPlus } from "lucide-react";

interface Branding { id: string; shop_id: string; banner_path: string | null; avatar_path: string | null; managed_by: string | null }
interface Staff { id: string; shop_id: string; name: string; role: string; staff_user_id: string | null }

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ShopOwnerDashboard = () => {
  const { user } = useCurrentUser();
  const { toast } = useToast();
  const [range, setRange] = useState<RangeKey>("30d");
  const since = useMemo(() => rangeStart(range), [range]);
  const [shops, setShops] = useState<Branding[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [stats, setStats] = useState({ photos: 0, reviews: 0, ratingAvg: 0 });
  const [newShopId, setNewShopId] = useState("");
  const [newStaff, setNewStaff] = useState({ shop_id: "", identifier: "", role: "barista" });
  const [linkInput, setLinkInput] = useState<Record<string, string>>({});

  const load = async () => {
    if (!user) return;
    const { data: branding } = await supabase
      .from("shop_branding")
      .select("id, shop_id, banner_path, avatar_path, managed_by")
      .eq("managed_by", user.id);
    const list = (branding as Branding[]) ?? [];
    setShops(list);
    const ids = list.map((b) => b.shop_id);
    if (ids.length) {
      const head = { count: "exact" as const, head: true };
      const withSince = (q: any) => (since ? q.gte("created_at", since) : q);
      const [st, ph, rv] = await Promise.all([
        supabase.from("shop_staff").select("id, shop_id, name, role, staff_user_id").in("shop_id", ids),
        withSince(supabase.from("shop_photos").select("*", head).in("shop_id", ids)),
        supabase.from("reviews").select("rating").eq("reviewable_type", "shop").in("reviewable_id", ids as any),
      ]);
      setStaff((st.data as Staff[]) ?? []);
      const ratings = (rv.data as any[]) ?? [];
      const avg = ratings.length ? ratings.reduce((a, b) => a + (b.rating || 0), 0) / ratings.length : 0;
      setStats({ photos: ph.count ?? 0, reviews: ratings.length, ratingAvg: avg });
    } else {
      setStaff([]);
      setStats({ photos: 0, reviews: 0, ratingAvg: 0 });
    }
  };

  useEffect(() => { load(); }, [user, since]);

  const claimShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newShopId.trim()) return;
    const { error } = await supabase.from("shop_branding").insert({ shop_id: newShopId.trim(), managed_by: user.id });
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    setNewShopId("");
    toast({ title: "Shop linked" });
    load();
  };

  const unclaim = async (id: string) => {
    const { error } = await supabase.from("shop_branding").delete().eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    load();
  };

  const transferManager = async (id: string) => {
    const v = linkInput[id]?.trim();
    if (!v) return;
    let newId = v;
    if (!UUID_RE.test(v)) {
      const { data: found } = await (supabase as any).rpc("lookup_profile", { _q: v });
      const prof = found?.[0];
      if (!prof?.id) return toast({ title: "No user found for that email", variant: "destructive" });
      newId = prof.id;
    }
    const { error } = await supabase.from("shop_branding").update({ managed_by: newId }).eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "Manager transferred" });
    setLinkInput((s) => ({ ...s, [id]: "" }));
    load();
  };

  const addStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const id = newStaff.identifier.trim();
    if (!newStaff.shop_id || !id) return;
    let userId: string | null = null;
    let name = "";
    const { data: found } = await (supabase as any).rpc("lookup_profile", { _q: id });
    const prof = found?.[0];
    if (!prof) return toast({ title: "User not found", variant: "destructive" });
    userId = prof.id; name = prof.name || "";
    const { error } = await supabase.from("shop_staff").insert({
      shop_id: newStaff.shop_id, staff_user_id: userId, name, role: newStaff.role, managed_by: user.id,
    });
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    setNewStaff({ shop_id: "", identifier: "", role: "barista" });
    toast({ title: "Staff added" });
    load();
  };

  const removeStaff = async (id: string) => {
    const { error } = await supabase.from("shop_staff").delete().eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    load();
  };

  return (
    <DashboardLayout title="Shop owner hub" subtitle="Manage your shops, staff and content">
      <DateRangeFilter value={range} onChange={setRange} />
      <KpiRow
        items={[
          { label: "My shops", value: shops.length, icon: Store, to: "/shops" },
          { label: "Staff", value: staff.length, icon: Users },
          { label: "Photos in period", value: stats.photos, icon: ImageIcon },
          { label: "Avg rating", value: stats.ratingAvg.toFixed(2), icon: Star, hint: `${stats.reviews} reviews` },
        ]}
      />

      <Tabs defaultValue="shops">
        <TabsList>
          <TabsTrigger value="shops">Shops</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="managers">Manager linkage</TabsTrigger>
        </TabsList>

        <TabsContent value="shops" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-4 h-4" /> Link a shop</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={claimShop} className="flex gap-2">
                <Input value={newShopId} onChange={(e) => setNewShopId(e.target.value)} placeholder="Shop ID" />
                <Button type="submit">Link</Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Your shops</CardTitle></CardHeader>
            <CardContent>
              {shops.length === 0 ? (
                <p className="text-sm text-muted-foreground">No shops yet.</p>
              ) : (
                <ul className="divide-y">
                  {shops.map((s) => (
                    <li key={s.id} className="py-3 flex items-center justify-between gap-3">
                      <span className="font-medium truncate">{s.shop_id}</span>
                      <div className="flex gap-2">
                        <Button asChild size="sm" variant="ghost"><Link to={`/shop/${s.shop_id}`}>Open <ExternalLink className="w-3 h-3 ml-1" /></Link></Button>
                        <Button size="icon" variant="ghost" onClick={() => unclaim(s.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><UserPlus className="w-4 h-4" /> Add staff</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={addStaff} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div>
                  <Label className="text-xs">Shop</Label>
                  <select
                    value={newStaff.shop_id}
                    onChange={(e) => setNewStaff({ ...newStaff, shop_id: e.target.value })}
                    className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                  >
                    <option value="">Choose shop</option>
                    {shops.map((s) => <option key={s.id} value={s.shop_id}>{s.shop_id}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs">User (email or UUID)</Label>
                  <Input value={newStaff.identifier} onChange={(e) => setNewStaff({ ...newStaff, identifier: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Role</Label>
                  <Input value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })} />
                </div>
                <div className="flex items-end"><Button type="submit" className="w-full">Add</Button></div>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Staff across your shops</CardTitle></CardHeader>
            <CardContent>
              {staff.length === 0 ? (
                <p className="text-sm text-muted-foreground">No staff yet.</p>
              ) : (
                <ul className="divide-y">
                  {staff.map((s) => (
                    <li key={s.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.role} · shop {s.shop_id}</p>
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => removeStaff(s.id)}><Trash2 className="w-4 h-4" /></Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="managers" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Shop ↔ manager linkages</CardTitle></CardHeader>
            <CardContent>
              {shops.length === 0 ? (
                <p className="text-sm text-muted-foreground">No shops yet.</p>
              ) : (
                <ul className="divide-y">
                  {shops.map((s) => (
                    <li key={s.id} className="py-3 grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                      <div>
                        <p className="font-medium truncate">{s.shop_id}</p>
                        <p className="text-xs text-muted-foreground truncate">manager: {s.managed_by}</p>
                      </div>
                      <Input
                        placeholder="New manager email or UUID"
                        value={linkInput[s.id] || ""}
                        onChange={(e) => setLinkInput((x) => ({ ...x, [s.id]: e.target.value }))}
                      />
                      <Button onClick={() => transferManager(s.id)} variant="outline">Transfer</Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ShopOwnerDashboard;
