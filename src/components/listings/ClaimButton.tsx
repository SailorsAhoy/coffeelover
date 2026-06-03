import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getActiveClaim, getOwner, submitClaim, type ListingType } from "@/lib/claims";

interface Props {
  type: ListingType;
  listingId: string;
  /** Required subscription module (e.g. shop_listing). Admin always allowed. */
  requiredModule?: string;
}

export default function ClaimButton({ type, listingId, requiredModule }: Props) {
  const { user, hasRole, hasModule } = useCurrentUser();
  const [owner, setOwner] = useState<string | null>(null);
  const [claim, setClaim] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    setOwner(await getOwner(type, listingId));
    setClaim(await getActiveClaim(type, listingId));
  };
  useEffect(() => { void refresh(); }, [type, listingId]);

  if (!user) return null;

  if (owner) {
    return (
      <Badge variant="secondary" className="gap-1">
        <BadgeCheck className="h-3 w-3" /> Verified owner
      </Badge>
    );
  }

  if (claim?.status === "pending") {
    const mine = claim.claimant_user_id === user.id;
    return (
      <Badge variant="outline" className="gap-1">
        <ShieldCheck className="h-3 w-3" /> {mine ? "Your claim is pending" : "Claim pending"}
      </Badge>
    );
  }

  // Any signed-in user can request a claim; admins review and approve.
  void requiredModule;
  void hasModule;

  const onSubmit = async () => {
    setBusy(true);
    try {
      await submitClaim({ type, listingId, note, requestedRole: hasRole("admin") ? "admin" : "user" });
      toast.success("Claim submitted for review");
      setOpen(false);
      setNote("");
      await refresh();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to submit claim");
    } finally { setBusy(false); }
  };

  return (
    <>
      <Button size="sm" variant="outline" className="gap-1" onClick={() => setOpen(true)}>
        <ShieldCheck className="h-3 w-3" /> Claim listing
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Claim this listing</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            An admin will review your request. Once approved you become the verified owner and no further claims can be made.
          </p>
          <div className="space-y-1">
            <Label className="text-xs">Note for admin (optional)</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Proof of ownership, website, business email…" />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={onSubmit} disabled={busy}>Submit claim</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
