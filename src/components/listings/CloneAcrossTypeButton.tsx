import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { cloneRoasterToShop, cloneShopToRoaster } from "@/lib/listingClone";

interface Props {
  source: "shop" | "roaster";
  sourceId: string;
  /** Verified owner user id; admins can always clone. */
  ownerUserId?: string | null;
  /** If a link already exists in this direction, hide. */
  alreadyLinkedId?: string | null;
}

export default function CloneAcrossTypeButton({ source, sourceId, ownerUserId, alreadyLinkedId }: Props) {
  const { user, hasRole } = useCurrentUser();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  if (!user) return null;
  const allowed = hasRole("admin") || (ownerUserId && ownerUserId === user.id);
  if (!allowed) return null;
  if (alreadyLinkedId) return null;

  const target = source === "shop" ? "roaster" : "shop";

  const clone = async () => {
    setBusy(true);
    try {
      const newId = source === "shop"
        ? await cloneShopToRoaster(sourceId)
        : await cloneRoasterToShop(sourceId);
      toast.success(`Cloned to ${target}`);
      navigate(target === "shop" ? `/shop/${newId}` : `/roaster/${newId}`);
    } catch (e: any) {
      toast.error(e?.message ?? "Clone failed");
    } finally { setBusy(false); }
  };

  return (
    <Button size="sm" variant="outline" className="gap-1" disabled={busy} onClick={clone}>
      {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Copy className="h-3 w-3" />}
      Clone as {target}
    </Button>
  );
}
