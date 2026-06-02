import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { GraduationCap, BookOpen, Users, User, Crown } from "lucide-react";

const TeacherDashboard = () => {
  const { user, subscriptions, profile } = useCurrentUser();
  const [students, setStudents] = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { count } = await supabase
        .from("course_progress")
        .select("user_id", { count: "exact", head: true });
      setStudents(count ?? 0);
    })();
  }, [user]);

  return (
    <DashboardLayout title={`Teacher hub – ${profile?.name || ""}`} subtitle="Manage your academy presence">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Courses" value="—" icon={GraduationCap} to="/academy" hint="Publish & edit" />
        <StatCard label="Students" value={students} icon={Users} hint="Engaged learners" />
        <StatCard label="Lessons" value="—" icon={BookOpen} to="/academy" />
        <StatCard label="Subscriptions" value={subscriptions.length} icon={Crown} to="/profile" />
        <StatCard label="Profile" value="Edit" icon={User} to="/profile" />
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
