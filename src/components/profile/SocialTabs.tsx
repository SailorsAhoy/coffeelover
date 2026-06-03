import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users, UserPlus, Ban, Mail, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  listFriendships, acceptFriend, rejectFriend,
  listFollowers, listFollowing,
  listMyBlocks, unblockUser, getProfileLite,
  type Friendship,
} from "@/lib/social";
import { listMyChats, type ChatSummary } from "@/lib/messaging";

function initials(name?: string | null) {
  return (name ?? "U").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function PersonRow({ id, name, avatar, right }: { id: string; name: string | null; avatar: string | null; right?: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 py-2">
      <Avatar className="h-8 w-8"><AvatarImage src={avatar ?? ""} /><AvatarFallback>{initials(name)}</AvatarFallback></Avatar>
      <span className="text-sm flex-1 truncate">{name ?? id.slice(0, 8)}</span>
      {right}
    </li>
  );
}

export default function SocialTabs() {
  const { user } = useCurrentUser();
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [profMap, setProfMap] = useState<Record<string, any>>({});
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [blockProfs, setBlockProfs] = useState<Record<string, any>>({});
  const [chats, setChats] = useState<ChatSummary[]>([]);

  const refresh = async () => {
    if (!user) return;
    const [fs, fwers, fwing, bks, chs] = await Promise.all([
      listFriendships(), listFollowers(user.id), listFollowing(user.id), listMyBlocks(), listMyChats(),
    ]);
    setFriendships(fs); setFollowers(fwers); setFollowing(fwing); setBlocks(bks); setChats(chs);

    const ids = Array.from(new Set(fs.flatMap((f) => [f.user_id, f.friend_user_id])));
    const profs: Record<string, any> = {};
    await Promise.all(ids.map(async (id) => { profs[id] = await getProfileLite(id); }));
    setProfMap(profs);

    const bProfs: Record<string, any> = {};
    await Promise.all(bks.map(async (b: any) => { bProfs[b.blocked_user_id] = await getProfileLite(b.blocked_user_id); }));
    setBlockProfs(bProfs);
  };
  useEffect(() => { void refresh(); }, [user?.id]);

  if (!user) return null;

  const accepted = friendships.filter((f) => f.status === "accepted");
  const incoming = friendships.filter((f) => f.status === "pending" && f.friend_user_id === user.id);
  const outgoing = friendships.filter((f) => f.status === "pending" && f.user_id === user.id);

  return (
    <Card>
      <CardContent className="pt-4">
        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="messages" className="gap-1"><MessageCircle className="h-3.5 w-3.5" /> Messages</TabsTrigger>
            <TabsTrigger value="friends" className="gap-1"><UserPlus className="h-3.5 w-3.5" /> Friends</TabsTrigger>
            <TabsTrigger value="follows" className="gap-1"><Users className="h-3.5 w-3.5" /> Network</TabsTrigger>
            <TabsTrigger value="blocked" className="gap-1"><Ban className="h-3.5 w-3.5" /> Blocked</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="mt-3">
            {chats.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No conversations yet.</p>
            ) : (
              <ul className="divide-y">
                {chats.slice(0, 6).map((c) => {
                  const other = c.participants.find((p) => p.user_id !== user.id) ?? c.participants[0];
                  return (
                    <li key={c.id}>
                      <Link to={`/messages/${c.id}`} className="flex items-center gap-3 py-2 hover:bg-accent rounded-md px-2">
                        <Avatar className="h-9 w-9"><AvatarImage src={other?.avatar_url ?? ""} /><AvatarFallback>{initials(other?.name)}</AvatarFallback></Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium truncate">{c.title ?? other?.name ?? "Conversation"}</p>
                            {c.unread > 0 && <Badge className="h-5 min-w-5 px-1 text-[10px]">{c.unread}</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{c.last_message?.body ?? "—"}</p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="mt-2"><Button asChild size="sm" variant="outline"><Link to="/messages">Open inbox</Link></Button></div>
          </TabsContent>

          <TabsContent value="friends" className="mt-3 space-y-4">
            {incoming.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Pending requests</p>
                <ul className="divide-y">
                  {incoming.map((f) => {
                    const p = profMap[f.user_id];
                    return (
                      <PersonRow key={f.id} id={f.user_id} name={p?.name} avatar={p?.avatar_url}
                        right={
                          <div className="flex gap-1">
                            <Button size="sm" className="h-7 gap-1 text-xs" onClick={async () => { await acceptFriend(f.id); toast.success("Friend added"); await refresh(); }}>
                              <Check className="h-3 w-3" /> Accept
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={async () => { await rejectFriend(f.id); toast.success("Declined"); await refresh(); }}>
                              <X className="h-3 w-3" /> Decline
                            </Button>
                          </div>
                        } />
                    );
                  })}
                </ul>
              </div>
            )}
            {outgoing.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Sent</p>
                <ul className="divide-y">
                  {outgoing.map((f) => {
                    const p = profMap[f.friend_user_id];
                    return (
                      <PersonRow key={f.id} id={f.friend_user_id} name={p?.name} avatar={p?.avatar_url}
                        right={<Badge variant="outline">Pending</Badge>} />
                    );
                  })}
                </ul>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Friends ({accepted.length})</p>
              {accepted.length === 0 ? (
                <p className="text-sm text-muted-foreground">No friends yet.</p>
              ) : (
                <ul className="divide-y">
                  {accepted.map((f) => {
                    const otherId = f.user_id === user.id ? f.friend_user_id : f.user_id;
                    const p = profMap[otherId];
                    return (
                      <PersonRow key={f.id} id={otherId} name={p?.name} avatar={p?.avatar_url}
                        right={<Button size="sm" variant="ghost" asChild><Link to={`/messages`}><Mail className="h-3.5 w-3.5" /></Link></Button>} />
                    );
                  })}
                </ul>
              )}
            </div>
          </TabsContent>

          <TabsContent value="follows" className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Followers ({followers.length})</p>
              {followers.length === 0 ? <p className="text-sm text-muted-foreground">No followers yet.</p> : (
                <ul className="divide-y">
                  {followers.map((f: any) => (
                    <PersonRow key={f.profiles.id} id={f.profiles.id} name={f.profiles.name} avatar={f.profiles.avatar_url} />
                  ))}
                </ul>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Following ({following.length})</p>
              {following.length === 0 ? <p className="text-sm text-muted-foreground">Not following anyone yet.</p> : (
                <ul className="divide-y">
                  {following.map((f: any) => (
                    <PersonRow key={f.profiles.id} id={f.profiles.id} name={f.profiles.name} avatar={f.profiles.avatar_url} />
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>

          <TabsContent value="blocked" className="mt-3">
            {blocks.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">You haven't blocked anyone.</p>
            ) : (
              <ul className="divide-y">
                {blocks.map((b: any) => {
                  const p = blockProfs[b.blocked_user_id];
                  return (
                    <PersonRow key={b.id} id={b.blocked_user_id} name={p?.name} avatar={p?.avatar_url}
                      right={<Button size="sm" variant="outline" className="h-7 text-xs" onClick={async () => { await unblockUser(b.blocked_user_id); toast.success("Unblocked"); await refresh(); }}>Unblock</Button>} />
                  );
                })}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
