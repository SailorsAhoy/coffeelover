import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flag, Check, X } from "lucide-react";
import { toast } from "sonner";
import { listReports, updateReportStatus } from "@/lib/social";

export default function ReportsAdminPanel({ scope = "admin" }: { scope?: "admin" | "owner" }) {
  const [reports, setReports] = useState<any[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => setReports(await listReports(scope));
  useEffect(() => { void load(); }, []);

  const act = async (id: string, status: "resolved" | "dismissed") => {
    setBusy(id);
    try { await updateReportStatus(id, status); toast.success("Updated"); await load(); }
    catch (e: any) { toast.error(e?.message ?? "Failed"); }
    finally { setBusy(null); }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Flag className="h-4 w-4" /> User reports</CardTitle>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reports.</p>
        ) : (
          <ul className="divide-y">
            {reports.map((r) => (
              <li key={r.id} className="py-3 flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">{r.context_type ?? "profile"}</Badge>
                    <Badge variant={r.status === "open" ? "default" : "secondary"}>{r.status}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Reporter <code>{r.reporter_user_id.slice(0, 8)}</code> → reported <code>{r.reported_user_id.slice(0, 8)}</code>
                  </p>
                  <p className="text-sm mt-1">{r.reason}</p>
                </div>
                {scope === "admin" && r.status === "open" && (
                  <div className="flex gap-1.5">
                    <Button size="sm" className="gap-1" disabled={busy === r.id} onClick={() => act(r.id, "resolved")}>
                      <Check className="h-3 w-3" /> Resolve
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1" disabled={busy === r.id} onClick={() => act(r.id, "dismissed")}>
                      <X className="h-3 w-3" /> Dismiss
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
