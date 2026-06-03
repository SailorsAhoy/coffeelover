import { supabase } from "@/integrations/supabase/client";

export type NotificationType =
  | "message"
  | "follow"
  | "friend_request"
  | "friend_accepted"
  | "claim_update"
  | "report_update"
  | "system";

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  data: Record<string, any>;
  read_at: string | null;
  created_at: string;
}

export async function listMyNotifications(limit = 50): Promise<AppNotification[]> {
  const { data } = await (supabase as any)
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as AppNotification[];
}

export async function unreadCount(): Promise<number> {
  const { data } = await (supabase as any).rpc("unread_notifications_count");
  return Number(data ?? 0);
}

export async function markNotificationRead(id: string) {
  await (supabase as any)
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id);
}

export async function markAllRead() {
  await (supabase as any)
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .is("read_at", null);
}

export function subscribeNotifications(userId: string, onChange: () => void) {
  const ch = supabase
    .channel(`notif:${userId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
      () => onChange(),
    )
    .subscribe();
  return () => {
    supabase.removeChannel(ch);
  };
}
