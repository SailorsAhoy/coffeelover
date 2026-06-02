import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Store, Users, ImageIcon, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const ShopOwnerDashboard = () => {
  const { user } = useCurrentUser();
  const [shops, setShops] = useState<Array<{ shop_id: string; banner_path: string | null; avatar_path: string | null }>>([]);
  const [staffCount, setStaffCount] = useState(0);
  const [photosCount, setPhotosCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: branding } = await supabase
        .from("shop_branding")
        .select("shop_id, banner_path, avatar_path")
        .eq("managed_by", user.id);
      const ids = (branding ?? []).map((b) => b.shop_id);
      setShops(branding ?? []);
      if (ids.length) {
        const head = { count: "exact" as const, head: true };
        const [st, ph] = await Promise.all([
          supabase.from("shop_staff").select("*", head).in("shop_id", ids),
          supabase.from("shop_photos").select("*", head).in("shop_id", ids),
        ]);
        setStaffCount(st.count ?? 0);
        setPhotosCount(ph.count ?? 0);
      }
    })();
  }, [user]);

  return (
    <DashboardLayout title="Shop owner hub" subtitle="Manage your shops, staff and content">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="My shops" value={shops.length} icon={Store} to="/shops" />
        <StatCard label="Staff" value={staffCount} icon={Users} />
        <StatCard label="Photos" value={photosCount} icon={ImageIcon} />
        <StatCard label="Reviews" value="—" icon={Star} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your shops</CardTitle>
          <Button asChild size="sm" variant="outline">
            <Link to="/shops">Browse all shops</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {shops.length === 0 ? (
            <p className="text-sm text-muted-foreground">No shops yet. Add one from the Shops page.</p>
          ) : (
            <ul className="divide-y">
              {shops.map((s) => (
                <li key={s.shop_id} className="py-3 flex items-center justify-between">
                  <span className="font-medium">{s.shop_id}</span>
                  <Button asChild size="sm" variant="ghost">
                    <Link to={`/shop/${s.shop_id}`}>
                      Open <ExternalLink className="w-3 h-3 ml-1" />
                    </Link>
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

export default ShopOwnerDashboard;
