import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { approveClaim, fetchListingName, listClaims, rejectClaim, type ListingClaim } from "@/lib/claims";

export default function ClaimsAdminPanel() {
  const [claims, setClaims] = useState<ListingClaim[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    const all = await listClaims({ status: "pending" });
    setClaims(all);
    const map: Record<string, string> = {};
    await Promise.all(all.map(async (c) => {
      map[c.id] = await fetchListingName(c.listing_type, c.listing_id);
    }));
    setNames(map);
  };
  useEffect(() => { void load(); }, []);

  const handle = async (c: ListingClaim, action: "approve" | "reject") => {
    setBusy(c.id);
    try {
      if (action === "approve") await approveClaim(c);
      else await rejectClaim(c);
      toast.success(action === "approve" ? "Claim approved" : "Claim rejected");
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? "Action failed");
    } finally { setBusy(null); }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Ownership claims</CardTitle>
      </CardHeader>
      <CardContent>
        {claims.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending claims.</p>
        ) : (
          <ul className="divide-y">
            {claims.map((c) => (
              <li key={c.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium truncate">{names[c.id] ?? c.listing_id}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.listing_type} · requested as {c.requested_role} · {new Date(c.created_at).toLocaleString()}
                  </p>
                  {c.note && <p className="text-xs mt-1 italic text-muted-foreground line-clamp-2">{c.note}</p>}
                </div>
                <div className="flex gap-1.5">
                  <Badge variant="outline" className="hidden md:inline-flex">{c.claimant_user_id.slice(0, 8)}</Badge>
                  <Button size="sm" className="gap-1" disabled={busy === c.id} onClick={() => handle(c, "approve")}>
                    <Check className="h-3 w-3" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1" disabled={busy === c.id} onClick={() => handle(c, "reject")}>
                    <X className="h-3 w-3" /> Reject
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
