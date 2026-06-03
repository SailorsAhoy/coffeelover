import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  LISTING_TYPES, fetchListingName, listClaims, searchListings, submitClaim,
  type ListingClaim, type ListingType,
} from "@/lib/claims";

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  rejected: "bg-destructive/15 text-destructive",
};

export default function MyClaimsPanel() {
  const [claims, setClaims] = useState<ListingClaim[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [type, setType] = useState<ListingType>("shop");
  const [q, setQ] = useState("");
  const [results, setResults] = useState<{ id: string; name: string; owner_user_id: string | null }[]>([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const mine = await listClaims({ mine: true });
    setClaims(mine);
    const map: Record<string, string> = {};
    await Promise.all(mine.map(async (c) => {
      map[c.id] = await fetchListingName(c.listing_type, c.listing_id);
    }));
    setNames(map);
  };
  useEffect(() => { void load(); }, []);

  useEffect(() => {
    const t = setTimeout(async () => setResults(await searchListings(type, q)), 250);
    return () => clearTimeout(t);
  }, [type, q]);

  const claim = async (id: string) => {
    setBusy(true);
    try {
      await submitClaim({ type, listingId: id });
      toast.success("Claim submitted. An admin will review it.");
      setQ(""); setResults([]);
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to submit claim");
    } finally { setBusy(false); }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> My listing claims</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Listing type</Label>
            <Select value={type} onValueChange={(v) => setType(v as ListingType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {LISTING_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Search by name</Label>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Start typing…" />
          </div>
        </div>

        {results.length > 0 && (
          <ul className="divide-y rounded-md border">
            {results.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-2 p-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{r.name}</p>
                  {r.owner_user_id && <p className="text-xs text-muted-foreground">Already owned</p>}
                </div>
                <Button size="sm" variant="outline" className="gap-1" disabled={busy || !!r.owner_user_id} onClick={() => claim(r.id)}>
                  <Plus className="h-3 w-3" /> Claim
                </Button>
              </li>
            ))}
          </ul>
        )}

        <div>
          <h4 className="text-sm font-medium mb-2">Your claims</h4>
          {claims.length === 0 ? (
            <p className="text-sm text-muted-foreground">No claims yet.</p>
          ) : (
            <ul className="divide-y">
              {claims.map((c) => (
                <li key={c.id} className="py-2 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{names[c.id] ?? c.listing_id}</p>
                    <p className="text-xs text-muted-foreground">{c.listing_type} · {new Date(c.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge className={STATUS_COLOR[c.status]} variant="outline">{c.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
