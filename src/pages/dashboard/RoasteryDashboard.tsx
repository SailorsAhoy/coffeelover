import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Coffee, Package, Users, Star } from "lucide-react";

const RoasteryDashboard = () => {
  const { user } = useCurrentUser();
  const [roasterId, setRoasterId] = useState<string | null>(null);
  const [brands, setBrands] = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: rp } = await supabase
        .from("roaster_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (rp?.id) {
        setRoasterId(rp.id);
        const { count } = await supabase
          .from("coffee_brands")
          .select("*", { count: "exact", head: true })
          .eq("roaster_id", rp.id);
        setBrands(count ?? 0);
      }
    })();
  }, [user]);

  return (
    <DashboardLayout title="Roastery hub" subtitle="Manage your roaster profile and coffees">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Roaster profile" value={roasterId ? "Active" : "Not set"} icon={Coffee} to="/roasters" />
        <StatCard label="Coffee products" value={brands} icon={Package} to="/coffee" />
        <StatCard label="Followers" value="—" icon={Users} />
        <StatCard label="Reviews" value="—" icon={Star} />
      </div>
    </DashboardLayout>
  );
};

export default RoasteryDashboard;
