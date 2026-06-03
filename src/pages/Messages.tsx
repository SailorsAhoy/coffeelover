import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Send, MessageCircle, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  listMyChats, listMessages, sendMessage, markChatRead, subscribeChat,
  type ChatSummary, type ChatMessage,
} from "@/lib/messaging";
import { formatDistanceToNow } from "date-fns";

function getOther(chat: ChatSummary, meId: string) {
  return chat.participants.find((p) => p.user_id !== meId) ?? chat.participants[0];
}
function initials(name?: string | null) {
  return (name ?? "U").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export default function Messages() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const refreshChats = async () => setChats(await listMyChats());
  const refreshMessages = async (id: string) => setMessages(await listMessages(id));

  useEffect(() => { void refreshChats(); }, []);

  useEffect(() => {
    if (!chatId) return;
    void refreshMessages(chatId);
    void markChatRead(chatId);
    const unsub = subscribeChat(chatId, () => {
      void refreshMessages(chatId);
      void markChatRead(chatId);
      void refreshChats();
    });
    return unsub;
  }, [chatId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const active = chats.find((c) => c.id === chatId);

  const onSend = async () => {
    if (!chatId || !body.trim()) return;
    setSending(true);
    try {
      await sendMessage(chatId, body.trim());
      setBody("");
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally { setSending(false); }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-5xl px-3 py-4 md:px-6">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <MessageCircle className="h-5 w-5" /> Messages
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-3 h-[70vh] border rounded-lg overflow-hidden bg-card">
          {/* Sidebar */}
          <div className={cn("border-r flex flex-col", chatId ? "hidden md:flex" : "flex")}>
            <ScrollArea className="flex-1">
              {chats.length === 0 ? (
                <p className="p-6 text-center text-sm text-muted-foreground">No conversations yet</p>
              ) : (
                <ul className="divide-y">
                  {chats.map((c) => {
                    const other = getOther(c, user?.id ?? "");
                    return (
                      <li key={c.id}>
                        <button
                          onClick={() => navigate(`/messages/${c.id}`)}
                          className={cn(
                            "w-full text-left p-3 flex gap-3 items-center hover:bg-accent transition-colors",
                            chatId === c.id && "bg-accent",
                          )}
                        >
                          <Avatar className="h-9 w-9 shrink-0">
                            <AvatarImage src={other?.avatar_url ?? ""} />
                            <AvatarFallback>{initials(other?.name)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium truncate">
                                {c.title ?? other?.name ?? "Conversation"}
                              </p>
                              {c.unread > 0 && (
                                <Badge className="h-5 min-w-5 px-1 text-[10px]">{c.unread}</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {c.last_message?.body ?? "No messages yet"}
                            </p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </ScrollArea>
          </div>

          {/* Thread */}
          <div className={cn("flex flex-col", !chatId && "hidden md:flex")}>
            {!chatId ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                Select a conversation
              </div>
            ) : (
              <>
                <div className="p-3 border-b flex items-center gap-2">
                  <Button size="sm" variant="ghost" className="md:hidden" onClick={() => navigate("/messages")}>
                    ← Back
                  </Button>
                  {active && (() => {
                    const other = getOther(active, user?.id ?? "");
                    return (
                      <>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={other?.avatar_url ?? ""} />
                          <AvatarFallback>{initials(other?.name)}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium truncate">{active.title ?? other?.name ?? "Conversation"}</p>
                      </>
                    );
                  })()}
                </div>
                <ScrollArea className="flex-1 px-3 py-3">
                  <div className="space-y-2">
                    {messages.map((m) => {
                      const mine = m.sender_user_id === user?.id;
                      return (
                        <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                          <div className={cn(
                            "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                            mine ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}>
                            <p className="whitespace-pre-wrap break-words">{m.body}</p>
                            <p className={cn("text-[10px] mt-1 opacity-70")}>
                              {formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={endRef} />
                  </div>
                </ScrollArea>
                <form
                  onSubmit={(e) => { e.preventDefault(); void onSend(); }}
                  className="border-t p-2 flex gap-2"
                >
                  <Input
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Type a message…"
                    disabled={sending}
                  />
                  <Button type="submit" disabled={sending || !body.trim()} size="icon">
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
