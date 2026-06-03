import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, MessageSquare, UserPlus, Users, ShieldCheck, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  listMyNotifications, markAllRead, markNotificationRead,
  subscribeNotifications, type AppNotification,
} from "@/lib/notifications";
import { formatDistanceToNow } from "date-fns";

const ICONS: Record<string, any> = {
  message: MessageSquare,
  follow: Users,
  friend_request: UserPlus,
  friend_accepted: UserPlus,
  claim_update: ShieldCheck,
  report_update: ShieldCheck,
  system: Info,
};

export default function NotificationBell() {
  const { user } = useCurrentUser();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);

  const refresh = async () => setItems(await listMyNotifications(30));

  useEffect(() => {
    if (!user) { setItems([]); return; }
    void refresh();
    return subscribeNotifications(user.id, () => { void refresh(); });
  }, [user?.id]);

  if (!user) return null;
  const unread = items.filter((n) => !n.read_at).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 hover:bg-accent rounded-lg transition-colors" aria-label="Notifications">
          <Bell className="w-5 h-5 text-foreground" />
          {unread > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-xs">
              {unread > 99 ? "99+" : unread}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 bg-card">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="font-medium text-sm">Notifications</div>
          {unread > 0 && (
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={async () => { await markAllRead(); await refresh(); }}>
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-96">
          {items.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No notifications yet</p>
          ) : (
            <ul className="divide-y">
              {items.map((n) => {
                const Icon = ICONS[n.type] ?? Info;
                const content = (
                  <div className="flex gap-3 p-3 hover:bg-accent transition-colors">
                    <div className={`mt-0.5 rounded-md p-1.5 shrink-0 ${n.read_at ? "bg-muted" : "bg-primary/15 text-primary"}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm truncate ${n.read_at ? "text-muted-foreground" : "font-medium"}`}>{n.title}</p>
                      {n.body && <p className="text-xs text-muted-foreground line-clamp-2">{n.body}</p>}
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    {!n.read_at && <span className="h-2 w-2 rounded-full bg-primary self-center shrink-0" />}
                  </div>
                );
                const onClick = async () => {
                  if (!n.read_at) await markNotificationRead(n.id);
                  setOpen(false);
                  await refresh();
                };
                return (
                  <li key={n.id}>
                    {n.link ? (
                      <Link to={n.link} onClick={onClick}>{content}</Link>
                    ) : (
                      <button className="w-full text-left" onClick={onClick}>{content}</button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
