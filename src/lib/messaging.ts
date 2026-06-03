import { supabase } from "@/integrations/supabase/client";

export interface ChatSummary {
  id: string;
  is_group: boolean;
  title: string | null;
  created_by: string;
  created_at: string;
  last_message?: { body: string; created_at: string; sender_user_id: string } | null;
  participants: { user_id: string; name: string | null; avatar_url: string | null }[];
  unread: number;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_user_id: string;
  body: string;
  created_at: string;
}

export async function openDmWith(otherUserId: string): Promise<string> {
  const { data, error } = await (supabase as any).rpc("get_or_create_dm", { other_user: otherUserId });
  if (error) throw error;
  return data as string;
}

export async function listMyChats(): Promise<ChatSummary[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: parts } = await (supabase as any)
    .from("chat_participants")
    .select("chat_id, last_read_at")
    .eq("user_id", user.id);
  const chatIds = (parts ?? []).map((p: any) => p.chat_id);
  if (chatIds.length === 0) return [];

  const lastReadMap = Object.fromEntries((parts ?? []).map((p: any) => [p.chat_id, p.last_read_at]));

  const [{ data: chats }, { data: allParts }, { data: msgs }] = await Promise.all([
    (supabase as any).from("chats").select("*").in("id", chatIds),
    (supabase as any).from("chat_participants").select("chat_id, user_id").in("chat_id", chatIds),
    (supabase as any)
      .from("chat_messages")
      .select("chat_id, body, created_at, sender_user_id")
      .in("chat_id", chatIds)
      .order("created_at", { ascending: false }),
  ]);

  const userIds = Array.from(new Set((allParts ?? []).map((p: any) => p.user_id)));
  const { data: profiles } = await (supabase as any)
    .from("profiles")
    .select("id, name, avatar_url")
    .in("id", userIds);
  const profMap = Object.fromEntries((profiles ?? []).map((p: any) => [p.id, p]));

  const partsByChat: Record<string, any[]> = {};
  (allParts ?? []).forEach((p: any) => {
    (partsByChat[p.chat_id] ||= []).push({
      user_id: p.user_id,
      name: profMap[p.user_id]?.name ?? null,
      avatar_url: profMap[p.user_id]?.avatar_url ?? null,
    });
  });

  const lastByChat: Record<string, any> = {};
  const countsByChat: Record<string, number> = {};
  (msgs ?? []).forEach((m: any) => {
    if (!lastByChat[m.chat_id]) lastByChat[m.chat_id] = m;
    const lr = lastReadMap[m.chat_id];
    if (m.sender_user_id !== user.id && (!lr || new Date(m.created_at) > new Date(lr))) {
      countsByChat[m.chat_id] = (countsByChat[m.chat_id] ?? 0) + 1;
    }
  });

  return (chats ?? [])
    .map((c: any) => ({
      ...c,
      participants: partsByChat[c.id] ?? [],
      last_message: lastByChat[c.id] ?? null,
      unread: countsByChat[c.id] ?? 0,
    }))
    .sort((a: any, b: any) => {
      const ta = a.last_message?.created_at ?? a.created_at;
      const tb = b.last_message?.created_at ?? b.created_at;
      return tb.localeCompare(ta);
    });
}

export async function listMessages(chatId: string, limit = 200): Promise<ChatMessage[]> {
  const { data } = await (supabase as any)
    .from("chat_messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true })
    .limit(limit);
  return (data ?? []) as ChatMessage[];
}

export async function sendMessage(chatId: string, body: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  const { error } = await (supabase as any)
    .from("chat_messages")
    .insert({ chat_id: chatId, sender_user_id: user.id, body });
  if (error) throw error;
}

export async function markChatRead(chatId: string) {
  await (supabase as any).rpc("mark_chat_read", { _chat_id: chatId });
}

export function subscribeChat(chatId: string, onChange: () => void) {
  const ch = supabase.channel(`chat:${chatId}:${Math.random().toString(36).slice(2)}`);
  ch.on(
    "postgres_changes" as any,
    { event: "*", schema: "public", table: "chat_messages", filter: `chat_id=eq.${chatId}` },
    () => onChange(),
  ).subscribe();
  return () => { supabase.removeChannel(ch); };
}
