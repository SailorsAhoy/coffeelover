import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { KpiRow } from "@/components/dashboard/KpiRow";
import { DateRangeFilter, rangeStart, type RangeKey } from "@/components/dashboard/DateRangeFilter";
import { ActivityLog } from "@/components/dashboard/ActivityLog";
import ClaimsAdminPanel from "@/components/listings/ClaimsAdminPanel";
import ReportsAdminPanel from "@/components/admin/ReportsAdminPanel";
import { Users, Store, Package, Coffee, GraduationCap, Briefcase, MessageSquare, Star, Upload } from "lucide-react";

const AdminDashboard = () => {
  const [range, setRange] = useState<RangeKey>("30d");
  const since = useMemo(() => rangeStart(range), [range]);
  const [c, setC] = useState({ users: 0, shops: 0, roasters: 0, products: 0, threads: 0, reviews: 0, ratingAvg: 0 });

  useEffect(() => {
    (async () => {
      const head = { count: "exact" as const, head: true };
      const withSince = (q: any) => (since ? q.gte("created_at", since) : q);
      const [u, s, r, mp, sp, t, rv, rAvg] = await Promise.all([
        withSince(supabase.from("profiles").select("*", head)),
        withSince(supabase.from("coffee_shop_profiles").select("*", head)),
        withSince(supabase.from("roaster_profiles").select("*", head)),
        withSince(supabase.from("manufacturer_products").select("*", head)),
        withSince(supabase.from("supplier_products").select("*", head)),
        withSince(supabase.from("forum_threads").select("*", head)),
        withSince(supabase.from("reviews").select("*", head)),
        supabase.from("reviews").select("rating"),
      ]);
      const ratings = (rAvg.data as any[]) ?? [];
      const avg = ratings.length ? ratings.reduce((a, b) => a + (b.rating || 0), 0) / ratings.length : 0;
      setC({
        users: u.count ?? 0,
        shops: s.count ?? 0,
        roasters: r.count ?? 0,
        products: (mp.count ?? 0) + (sp.count ?? 0),
        threads: t.count ?? 0,
        reviews: rv.count ?? 0,
        ratingAvg: avg,
      });
    })();
  }, [since]);

  return (
    <DashboardLayout title="Admin overview" subtitle="Platform-wide activity">
      <DateRangeFilter value={range} onChange={setRange} />
      <KpiRow
        items={[
          { label: "Users", value: c.users, icon: Users, to: "/settings/user-management" },
          { label: "Shops", value: c.shops, icon: Store, to: "/settings/shop-management" },
          { label: "Roasters", value: c.roasters, icon: Coffee, to: "/roasters" },
          { label: "Products", value: c.products, icon: Package, hint: "Manufacturer + supplier" },
          { label: "Forum threads", value: c.threads, icon: MessageSquare, to: "/forum" },
          { label: "Reviews", value: c.reviews, icon: Star, hint: `Avg ${c.ratingAvg.toFixed(2)}` },
          { label: "Academy", value: "—", icon: GraduationCap, to: "/academy" },
          { label: "Jobs", value: "—", icon: Briefcase, to: "/jobs" },
          { label: "Bulk Imports", value: "CSV", icon: Upload, to: "/settings/imports" },
        ]}
      />
      <ClaimsAdminPanel />
      <ReportsAdminPanel scope="admin" />
      <ActivityLog sinceISO={since} />
    </DashboardLayout>
  );
};

export default AdminDashboard;
