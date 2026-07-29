import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const EmailPreferencesCard = () => {
  const { toast } = useToast();
  const [optOut, setOptOut] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      const { data } = await (supabase as any)
        .from("profiles")
        .select("marketing_opt_out")
        .eq("id", auth.user.id)
        .maybeSingle();
      if (data) setOptOut(!!data.marketing_opt_out);
    })();
  }, []);

  const update = async (value: boolean) => {
    const previous = optOut;
    setOptOut(value);
    setSaving(true);
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    const { error } = await (supabase as any)
      .from("profiles")
      .update({ marketing_opt_out: value })
      .eq("id", auth.user.id);
    setSaving(false);
    if (error) {
      setOptOut(previous);
      toast({ title: "Could not save preference", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email preferences updated" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email preferences</CardTitle>
        <CardDescription>Choose what we're allowed to send you</CardDescription>
      </CardHeader>
      <CardContent>
        <Label
          htmlFor="marketing-opt-out"
          className="flex items-start gap-3 border border-input rounded-md p-3 cursor-pointer hover:bg-accent"
        >
          <Checkbox
            id="marketing-opt-out"
            checked={optOut}
            disabled={saving}
            onCheckedChange={(v) => update(v === true)}
            className="mt-0.5"
          />
          <span className="text-sm font-normal leading-snug">
            I do not want to receive promotional emails of any kind
          </span>
        </Label>
      </CardContent>
    </Card>
  );
};

export default EmailPreferencesCard;
