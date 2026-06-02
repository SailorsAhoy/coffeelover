import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { KpiRow } from "@/components/dashboard/KpiRow";
import { DateRangeFilter, rangeStart, type RangeKey } from "@/components/dashboard/DateRangeFilter";
import { SocialPanel } from "@/components/dashboard/SocialPanel";
import { GraduationCap, BookOpen, Users, Crown, Star } from "lucide-react";

const TeacherDashboard = () => {
  const { user, subscriptions, profile } = useCurrentUser();
  const [range, setRange] = useState<RangeKey>("30d");
  const since = useMemo(() => rangeStart(range), [range]);
  const [stats, setStats] = useState({ students: 0, completions: 0, reviews: 0, ratingAvg: 0 });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const head = { count: "exact" as const, head: true };
      const withSince = (q: any) => (since ? q.gte("created_at", since) : q);
      const [st, comp, rv] = await Promise.all([
        withSince(supabase.from("course_progress").select("user_id", head)),
        withSince(supabase.from("course_progress").select("*", head).eq("completed", true)),
        supabase.from("reviews").select("rating").eq("reviewable_type", "course"),
      ]);
      const ratings = (rv.data as any[]) ?? [];
      const avg = ratings.length ? ratings.reduce((a, b) => a + (b.rating || 0), 0) / ratings.length : 0;
      setStats({
        students: st.count ?? 0,
        completions: comp.count ?? 0,
        reviews: ratings.length,
        ratingAvg: avg,
      });
    })();
  }, [user, since]);

  if (!user) return null;
  return (
    <DashboardLayout title={`Teacher hub – ${profile?.name || ""}`} subtitle="Manage your academy presence">
      <DateRangeFilter value={range} onChange={setRange} />
      <KpiRow
        items={[
          { label: "Courses", value: "—", icon: GraduationCap, to: "/academy", hint: "Publish & edit" },
          { label: "Students", value: stats.students, icon: Users, hint: "Engaged learners" },
          { label: "Completions", value: stats.completions, icon: BookOpen },
          { label: "Avg rating", value: stats.ratingAvg.toFixed(2), icon: Star, hint: `${stats.reviews} reviews` },
          { label: "Subscriptions", value: subscriptions.length, icon: Crown, to: "/profile" },
        ]}
      />
      <SocialPanel userId={user.id} />
    </DashboardLayout>
  );
};

export default TeacherDashboard;
