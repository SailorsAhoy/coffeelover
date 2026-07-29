import { supabase } from "@/integrations/supabase/client";

async function uid() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return user.id;
}

// ----- Follows
export async function follow(targetUserId: string) {
  const me = await uid();
  const { error } = await (supabase as any).from("follows").insert({
    follower_user_id: me, followee_user_id: targetUserId,
  });
  if (error) throw error;
}
export async function unfollow(targetUserId: string) {
  const me = await uid();
  await (supabase as any).from("follows").delete()
    .eq("follower_user_id", me).eq("followee_user_id", targetUserId);
}
export async function isFollowing(targetUserId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await (supabase as any).from("follows")
    .select("id").eq("follower_user_id", user.id).eq("followee_user_id", targetUserId).maybeSingle();
  return !!data;
}
export async function listFollowers(userId: string) {
  const { data } = await (supabase as any).from("follows")
    .select("follower_user_id, profiles:profiles!follows_follower_user_id_fkey(id, name, avatar_url)")
    .eq("followee_user_id", userId);
  // FK may not exist; fall back to manual join
  if (data && data.length && data[0].profiles) return data;
  const { data: raw } = await (supabase as any).from("follows").select("follower_user_id").eq("followee_user_id", userId);
  const ids = (raw ?? []).map((r: any) => r.follower_user_id);
  if (!ids.length) return [];
  const { data: profs } = await (supabase as any).from("profiles_public").select("id, name, avatar_url").in("id", ids);
  return (profs ?? []).map((p: any) => ({ follower_user_id: p.id, profiles: p }));
}
export async function listFollowing(userId: string) {
  const { data: raw } = await (supabase as any).from("follows").select("followee_user_id").eq("follower_user_id", userId);
  const ids = (raw ?? []).map((r: any) => r.followee_user_id);
  if (!ids.length) return [];
  const { data: profs } = await (supabase as any).from("profiles_public").select("id, name, avatar_url").in("id", ids);
  return (profs ?? []).map((p: any) => ({ followee_user_id: p.id, profiles: p }));
}

// ----- Friendships
export type FriendshipStatus = "pending" | "accepted" | "blocked";
export interface Friendship {
  id: string; user_id: string; friend_user_id: string;
  status: FriendshipStatus; created_at: string; updated_at: string;
}
export async function requestFriend(targetUserId: string) {
  const me = await uid();
  const { error } = await (supabase as any).from("friendships").insert({
    user_id: me, friend_user_id: targetUserId, status: "pending",
  });
  if (error) throw error;
}
export async function acceptFriend(friendshipId: string) {
  const { error } = await (supabase as any).from("friendships")
    .update({ status: "accepted" }).eq("id", friendshipId);
  if (error) throw error;
}
export async function rejectFriend(friendshipId: string) {
  await (supabase as any).from("friendships").delete().eq("id", friendshipId);
}
export async function getFriendshipWith(otherUserId: string): Promise<Friendship | null> {
  const me = await uid();
  const { data } = await (supabase as any).from("friendships").select("*")
    .or(`and(user_id.eq.${me},friend_user_id.eq.${otherUserId}),and(user_id.eq.${otherUserId},friend_user_id.eq.${me})`)
    .maybeSingle();
  return (data as Friendship) ?? null;
}
export async function listFriendships(): Promise<Friendship[]> {
  const me = await uid();
  const { data } = await (supabase as any).from("friendships").select("*")
    .or(`user_id.eq.${me},friend_user_id.eq.${me}`).order("created_at", { ascending: false });
  return (data ?? []) as Friendship[];
}

// ----- Blocks
export interface UserBlock {
  id: string; blocker_user_id: string; blocked_user_id: string; reason: string | null; created_at: string;
}
export async function blockUser(targetUserId: string, reason?: string) {
  const me = await uid();
  const { error } = await (supabase as any).from("user_blocks").insert({
    blocker_user_id: me, blocked_user_id: targetUserId, reason: reason ?? null,
  });
  if (error) throw error;
}
export async function unblockUser(targetUserId: string) {
  const me = await uid();
  await (supabase as any).from("user_blocks").delete()
    .eq("blocker_user_id", me).eq("blocked_user_id", targetUserId);
}
export async function isBlocked(targetUserId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await (supabase as any).from("user_blocks")
    .select("id").eq("blocker_user_id", user.id).eq("blocked_user_id", targetUserId).maybeSingle();
  return !!data;
}
export async function listMyBlocks(): Promise<UserBlock[]> {
  const me = await uid();
  const { data } = await (supabase as any).from("user_blocks").select("*").eq("blocker_user_id", me);
  return (data ?? []) as UserBlock[];
}

// ----- Reports
export async function reportUser(opts: {
  reportedUserId: string; reason: string; contextType?: "chat" | "profile" | "other"; contextId?: string;
}) {
  const me = await uid();
  const { error } = await (supabase as any).from("user_reports").insert({
    reporter_user_id: me, reported_user_id: opts.reportedUserId,
    reason: opts.reason, context_type: opts.contextType ?? "profile", context_id: opts.contextId ?? null,
  });
  if (error) throw error;
}
export async function listReports(scope: "mine" | "admin" | "owner") {
  let q = (supabase as any).from("user_reports").select("*").order("created_at", { ascending: false });
  if (scope === "mine") {
    const me = await uid();
    q = q.eq("reporter_user_id", me);
  }
  const { data } = await q;
  return (data ?? []) as any[];
}
export async function updateReportStatus(id: string, status: "open" | "reviewing" | "resolved" | "dismissed", note?: string) {
  const me = await uid();
  await (supabase as any).from("user_reports").update({
    status, resolution_note: note ?? null, handled_by: me,
  }).eq("id", id);
}

// ----- Profile lookup
export async function getProfileLite(userId: string) {
  const { data } = await (supabase as any).from("profiles_public").select("id, name, avatar_url").eq("id", userId).maybeSingle();
  return data as { id: string; name: string | null; avatar_url: string | null } | null;
}
