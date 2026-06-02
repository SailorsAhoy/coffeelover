import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Users, Store, Package, Coffee, GraduationCap, Briefcase, MessageSquare, Settings } from "lucide-react";

interface Counts {
  users: number;
  shops: number;
  roasters: number;
  products: number;
  threads: number;
  groups: number;
}

const AdminDashboard = () => {
  const [c, setC] = useState<Counts>({ users: 0, shops: 0, roasters: 0, products: 0, threads: 0, groups: 0 });

  useEffect(() => {
    (async () => {
      const head = { count: "exact" as const, head: true };
      const [u, s, r, mp, sp, t, g] = await Promise.all([
        supabase.from("profiles").select("*", head),
        supabase.from("coffee_shop_profiles").select("*", head),
        supabase.from("roaster_profiles").select("*", head),
        supabase.from("manufacturer_products").select("*", head),
        supabase.from("supplier_products").select("*", head),
        supabase.from("forum_threads").select("*", head),
        supabase.from("social_groups").select("*", head),
      ]);
      setC({
        users: u.count ?? 0,
        shops: s.count ?? 0,
        roasters: r.count ?? 0,
        products: (mp.count ?? 0) + (sp.count ?? 0),
        threads: t.count ?? 0,
        groups: g.count ?? 0,
      });
    })();
  }, []);

  return (
    <DashboardLayout title="Admin overview" subtitle="Platform-wide activity">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard label="Users" value={c.users} icon={Users} to="/settings/user-management" />
        <StatCard label="Shops" value={c.shops} icon={Store} to="/settings/shop-management" />
        <StatCard label="Roasters" value={c.roasters} icon={Coffee} to="/roasters" />
        <StatCard label="Products" value={c.products} icon={Package} hint="Manufacturer + supplier" />
        <StatCard label="Forum threads" value={c.threads} icon={MessageSquare} to="/forum" />
        <StatCard label="Groups" value={c.groups} icon={Users} />
        <StatCard label="Academy" value="—" icon={GraduationCap} to="/academy" />
        <StatCard label="Jobs" value="—" icon={Briefcase} to="/jobs" />
        <StatCard label="Settings" value="Manage" icon={Settings} to="/settings/shop-types" />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
