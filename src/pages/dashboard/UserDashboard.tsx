import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { KpiRow } from "@/components/dashboard/KpiRow";
import { DateRangeFilter, rangeStart, type RangeKey } from "@/components/dashboard/DateRangeFilter";
import { SocialPanel } from "@/components/dashboard/SocialPanel";
import { User, Users, GraduationCap, Crown, Star } from "lucide-react";

const UserDashboard = () => {
  const { user, profile, subscriptions } = useCurrentUser();
  const [range, setRange] = useState<RangeKey>("30d");
  const since = useMemo(() => rangeStart(range), [range]);
  const [stats, setStats] = useState({ threadsRange: 0, reviewsRange: 0 });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const head = { count: "exact" as const, head: true };
      const withSince = (q: any) => (since ? q.gte("created_at", since) : q);
      const [t, rv] = await Promise.all([
        withSince(supabase.from("forum_threads").select("*", head).eq("author_user_id", user.id)),
        withSince(supabase.from("reviews").select("*", head).eq("user_id", user.id)),
      ]);
      setStats({ threadsRange: t.count ?? 0, reviewsRange: rv.count ?? 0 });
    })();
  }, [user, since]);

  if (!user) return null;
  return (
    <DashboardLayout title={`Welcome, ${profile?.name || "friend"}`} subtitle="Your personal hub">
      <DateRangeFilter value={range} onChange={setRange} />
      <KpiRow
        items={[
          { label: "Threads in period", value: stats.threadsRange, icon: User, to: "/forum" },
          { label: "Reviews in period", value: stats.reviewsRange, icon: Star },
          { label: "Subscriptions", value: subscriptions.length, icon: Crown, to: "/profile" },
          { label: "Academy", value: "Browse", icon: GraduationCap, to: "/academy" },
          { label: "Social Connect", value: "Discover", icon: Users, to: "/social" },
          { label: "Profile", value: "Edit", icon: User, to: "/profile" },
        ]}
      />
      <SocialPanel userId={user.id} />
    </DashboardLayout>
  );
};

export default UserDashboard;
