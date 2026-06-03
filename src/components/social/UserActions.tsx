import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, UserPlus, UserCheck, UserX, Flag, Ban, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { openDmWith } from "@/lib/messaging";
import {
  follow, unfollow, isFollowing,
  requestFriend, acceptFriend, rejectFriend, getFriendshipWith,
  blockUser, unblockUser, isBlocked, reportUser,
  type Friendship,
} from "@/lib/social";

interface Props {
  targetUserId: string;
  /** Whether the target user has the admin role — disables block. */
  targetIsAdmin?: boolean;
  className?: string;
}

export default function UserActions({ targetUserId, targetIsAdmin, className }: Props) {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const [following, setFollowing] = useState(false);
  const [friendship, setFriendship] = useState<Friendship | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const refresh = async () => {
    if (!user || user.id === targetUserId) return;
    const [f, fs, b] = await Promise.all([
      isFollowing(targetUserId),
      getFriendshipWith(targetUserId),
      isBlocked(targetUserId),
    ]);
    setFollowing(f); setFriendship(fs); setBlocked(b);
  };
  useEffect(() => { void refresh(); }, [user?.id, targetUserId]);

  if (!user) {
    return (
      <div className={className}>
        <Button size="sm" variant="outline" onClick={() => navigate("/auth")}>
          Sign in to connect
        </Button>
      </div>
    );
  }
  if (user.id === targetUserId) return null;

  const wrap = async (fn: () => Promise<unknown>, msg?: string) => {
    setBusy(true);
    try { await fn(); if (msg) toast.success(msg); await refresh(); }
    catch (e: any) { toast.error(e?.message ?? "Action failed"); }
    finally { setBusy(false); }
  };

  const isPendingMine = friendship?.status === "pending" && friendship.user_id === user.id;
  const isPendingTheirs = friendship?.status === "pending" && friendship.friend_user_id === user.id;
  const isFriend = friendship?.status === "accepted";

  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ""}`}>
      <Button
        size="sm"
        disabled={busy || blocked}
        onClick={() => wrap(async () => {
          const chatId = await openDmWith(targetUserId);
          navigate(`/messages/${chatId}`);
        })}
        className="gap-1"
      >
        <MessageCircle className="h-3.5 w-3.5" /> Message
      </Button>

      {following ? (
        <Button size="sm" variant="outline" disabled={busy} className="gap-1"
          onClick={() => wrap(() => unfollow(targetUserId), "Unfollowed")}>
          <UserCheck className="h-3.5 w-3.5" /> Following
        </Button>
      ) : (
        <Button size="sm" variant="outline" disabled={busy} className="gap-1"
          onClick={() => wrap(() => follow(targetUserId), "Now following")}>
          <UserPlus className="h-3.5 w-3.5" /> Follow
        </Button>
      )}

      {!friendship && (
        <Button size="sm" variant="outline" disabled={busy} className="gap-1"
          onClick={() => wrap(() => requestFriend(targetUserId), "Friend request sent")}>
          <UserPlus className="h-3.5 w-3.5" /> Add friend
        </Button>
      )}
      {isPendingMine && (
        <Button size="sm" variant="outline" disabled className="gap-1">
          <Loader2 className="h-3.5 w-3.5" /> Request sent
        </Button>
      )}
      {isPendingTheirs && (
        <>
          <Button size="sm" disabled={busy} className="gap-1"
            onClick={() => wrap(() => acceptFriend(friendship!.id), "Friend added")}>
            <UserCheck className="h-3.5 w-3.5" /> Accept
          </Button>
          <Button size="sm" variant="outline" disabled={busy} className="gap-1"
            onClick={() => wrap(() => rejectFriend(friendship!.id), "Declined")}>
            <UserX className="h-3.5 w-3.5" /> Decline
          </Button>
        </>
      )}
      {isFriend && (
        <Button size="sm" variant="outline" disabled={busy} className="gap-1"
          onClick={() => wrap(() => rejectFriend(friendship!.id), "Friend removed")}>
          <UserCheck className="h-3.5 w-3.5" /> Friends
        </Button>
      )}

      {!targetIsAdmin && (
        blocked ? (
          <Button size="sm" variant="outline" disabled={busy} className="gap-1"
            onClick={() => wrap(() => unblockUser(targetUserId), "Unblocked")}>
            <Ban className="h-3.5 w-3.5" /> Unblock
          </Button>
        ) : (
          <Button size="sm" variant="outline" disabled={busy} className="gap-1"
            onClick={() => wrap(() => blockUser(targetUserId), "Blocked")}>
            <Ban className="h-3.5 w-3.5" /> Block
          </Button>
        )
      )}

      <Button size="sm" variant="ghost" className="gap-1 text-muted-foreground"
        onClick={() => setReportOpen(true)}>
        <Flag className="h-3.5 w-3.5" /> Report
      </Button>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Report user</DialogTitle></DialogHeader>
          <Label className="text-xs">Reason</Label>
          <Textarea value={reportReason} onChange={(e) => setReportReason(e.target.value)}
            rows={4} placeholder="Describe what happened" />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setReportOpen(false)}>Cancel</Button>
            <Button disabled={busy || !reportReason.trim()}
              onClick={() => wrap(async () => {
                await reportUser({ reportedUserId: targetUserId, reason: reportReason.trim() });
                setReportOpen(false); setReportReason("");
              }, "Report submitted")}>
              Submit report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
