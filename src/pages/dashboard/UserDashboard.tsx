import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { User, Users, MessageCircle, MessageSquare, UserPlus, Heart, GraduationCap, Crown } from "lucide-react";

const UserDashboard = () => {
  const { user, profile, subscriptions } = useCurrentUser();
  const [stats, setStats] = useState({ friends: 0, followers: 0, following: 0, groups: 0, threads: 0, chats: 0 });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const head = { count: "exact" as const, head: true };
      const [fr, fo, fol, gm, th, ch] = await Promise.all([
        supabase.from("friendships").select("*", head).or(`user_id.eq.${user.id},friend_user_id.eq.${user.id}`).eq("status", "accepted"),
        supabase.from("follows").select("*", head).eq("followee_user_id", user.id),
        supabase.from("follows").select("*", head).eq("follower_user_id", user.id),
        supabase.from("group_members").select("*", head).eq("user_id", user.id),
        supabase.from("forum_threads").select("*", head).eq("author_user_id", user.id),
        supabase.from("chat_participants").select("*", head).eq("user_id", user.id),
      ]);
      setStats({
        friends: fr.count ?? 0,
        followers: fo.count ?? 0,
        following: fol.count ?? 0,
        groups: gm.count ?? 0,
        threads: th.count ?? 0,
        chats: ch.count ?? 0,
      });
    })();
  }, [user]);

  return (
    <DashboardLayout title={`Welcome, ${profile?.name || "friend"}`} subtitle="Your personal hub">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Friends" value={stats.friends} icon={UserPlus} to="/social" />
        <StatCard label="Followers" value={stats.followers} icon={Heart} />
        <StatCard label="Following" value={stats.following} icon={Users} />
        <StatCard label="Groups" value={stats.groups} icon={Users} />
        <StatCard label="My threads" value={stats.threads} icon={MessageSquare} to="/forum" />
        <StatCard label="Chats" value={stats.chats} icon={MessageCircle} to="/messaging" />
        <StatCard label="Subscriptions" value={subscriptions.length} icon={Crown} to="/profile" />
        <StatCard label="Profile" value="Edit" icon={User} to="/profile" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard label="Academy" value="Browse" icon={GraduationCap} to="/academy" hint="Continue learning" />
        <StatCard label="Social Connect" value="Discover" icon={Users} to="/social" hint="Nearby coffee lovers" />
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
