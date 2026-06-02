import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Check } from "lucide-react";

interface Plan {
  id: string;
  code: string;
  name: string;
  description: string | null;
  modules: string[];
  price_cents: number;
}

const ROLE_BY_PLAN: Record<string, "pro_user" | "company" | "teacher" | null> = {
  pro_user: "pro_user",
  company_basic: "company",
  company_plus: "company",
  teacher: "teacher",
  free: null,
};

export const SubscriptionsCard = () => {
  const { user, subscriptions, refresh } = useCurrentUser();
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    (supabase as any)
      .from("subscription_plans")
      .select("id, code, name, description, modules, price_cents")
      .eq("is_active", true)
      .order("price_cents")
      .then(({ data }: any) => setPlans(data ?? []));
  }, []);

  const activeIds = new Set(subscriptions.map((s) => s.plan_id));

  const activate = async (plan: Plan) => {
    if (!user) return;
    setBusy(plan.id);
    try {
      const { error } = await (supabase as any)
        .from("user_subscriptions")
        .upsert({ user_id: user.id, plan_id: plan.id, status: "active" }, { onConflict: "user_id,plan_id" });
      if (error) throw error;

      const extraRole = ROLE_BY_PLAN[plan.code];
      if (extraRole) {
        await (supabase as any).from("user_roles").insert({ user_id: user.id, role: extraRole });
      }
      toast({ title: `${plan.name} activated`, description: "Simulated subscription — no charge made." });
      await refresh();
    } catch (e: any) {
      toast({ title: "Couldn't activate", description: e.message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const cancel = async (subId: string) => {
    setBusy(subId);
    try {
      const { error } = await (supabase as any)
        .from("user_subscriptions")
        .update({ status: "canceled" })
        .eq("id", subId);
      if (error) throw error;
      await refresh();
      toast({ title: "Subscription canceled" });
    } catch (e: any) {
      toast({ title: "Couldn't cancel", description: e.message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" /> Subscriptions
        </CardTitle>
        <CardDescription>Unlock additional modules (demo — no real billing)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {plans.map((p) => {
          const isActive = activeIds.has(p.id);
          const sub = subscriptions.find((s) => s.plan_id === p.id);
          return (
            <div key={p.id} className="flex items-start justify-between gap-3 p-3 border border-border rounded-lg">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{p.name}</span>
                  {isActive && (
                    <Badge variant="secondary" className="gap-1">
                      <Check className="w-3 h-3" /> Active
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {p.price_cents === 0 ? "Free" : `$${(p.price_cents / 100).toFixed(2)}/mo`}
                  </span>
                </div>
                {p.description && <p className="text-xs text-muted-foreground mt-1">{p.description}</p>}
                {p.modules.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.modules.map((m) => (
                      <Badge key={m} variant="outline" className="text-[10px]">
                        {m}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="mt-3">
                  {isActive && sub ? (
                    <Button size="sm" variant="outline" disabled={busy === sub.id || p.code === "free"} onClick={() => cancel(sub.id)}>
                      Cancel
                    </Button>
                  ) : (
                    <Button size="sm" disabled={busy === p.id} onClick={() => activate(p)}>
                      {busy === p.id ? "Activating…" : "Activate"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
