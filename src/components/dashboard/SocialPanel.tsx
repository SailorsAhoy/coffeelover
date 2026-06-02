import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { MessageCircle, MessageSquare, Users, UserPlus, ArrowRight } from "lucide-react";

interface Props { userId: string }

interface Counts {
  groups: number;
  friends: number;
  pendingFriends: number;
  followers: number;
  threads: number;
  unread: number;
}

export const SocialPanel = ({ userId }: Props) => {
  const [c, setC] = useState<Counts>({ groups: 0, friends: 0, pendingFriends: 0, followers: 0, threads: 0, unread: 0 });

  useEffect(() => {
    (async () => {
      const head = { count: "exact" as const, head: true };
      const [g, fr, pf, fol, th, parts] = await Promise.all([
        supabase.from("group_members").select("*", head).eq("user_id", userId),
        supabase.from("friendships").select("*", head).or(`user_id.eq.${userId},friend_user_id.eq.${userId}`).eq("status", "accepted"),
        supabase.from("friendships").select("*", head).eq("friend_user_id", userId).eq("status", "pending"),
        supabase.from("follows").select("*", head).eq("followee_user_id", userId),
        supabase.from("forum_threads").select("*", head).eq("author_user_id", userId),
        supabase.from("chat_participants").select("chat_id, last_read_at").eq("user_id", userId),
      ]);
      // Compute unread
      let unread = 0;
      const ps = (parts.data as any[]) ?? [];
      if (ps.length) {
        const ids = ps.map((p) => p.chat_id);
        const { data: msgs } = await supabase
          .from("chat_messages")
          .select("chat_id, created_at, sender_user_id")
          .in("chat_id", ids)
          .order("created_at", { ascending: false })
          .limit(500);
        const lastRead = new Map(ps.map((p) => [p.chat_id, new Date(p.last_read_at).getTime()]));
        (msgs ?? []).forEach((m: any) => {
          if (m.sender_user_id === userId) return;
          if (new Date(m.created_at).getTime() > (lastRead.get(m.chat_id) ?? 0)) unread += 1;
        });
      }
      setC({
        groups: g.count ?? 0,
        friends: fr.count ?? 0,
        pendingFriends: pf.count ?? 0,
        followers: fol.count ?? 0,
        threads: th.count ?? 0,
        unread,
      });
    })();
  }, [userId]);

  const tile = (icon: any, label: string, value: number | string, to: string, badge?: number) => {
    const Icon = icon;
    return (
      <Link to={to} className="block">
        <div className="border rounded-lg p-4 hover:bg-accent/40 transition relative">
          <div className="flex items-center justify-between">
            <Icon className="w-5 h-5 text-muted-foreground" />
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
          {badge ? (
            <Badge variant="destructive" className="absolute top-2 right-6 h-5 px-1.5 text-[10px]">{badge}</Badge>
          ) : null}
        </div>
      </Link>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Social</CardTitle>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline"><Link to="/forum">New thread</Link></Button>
          <Button asChild size="sm"><Link to="/messaging">Open chats</Link></Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {tile(MessageCircle, "Unread messages", c.unread, "/messaging", c.unread)}
        {tile(UserPlus, "Friend requests", c.pendingFriends, "/social", c.pendingFriends)}
        {tile(Users, "Friends", c.friends, "/social")}
        {tile(Users, "Followers", c.followers, "/social")}
        {tile(MessageSquare, "My threads", c.threads, "/forum")}
        {tile(Users, "Groups", c.groups, "/social")}
      </CardContent>
    </Card>
  );
};
