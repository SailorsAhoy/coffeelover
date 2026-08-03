import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/contexts/I18nContext";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const LanguagePreferenceCard = () => {
  const { toast } = useToast();
  const { languages, locale, setLocale, t } = useI18n();
  const [value, setValue] = useState(locale);

  useEffect(() => setValue(locale), [locale]);

  const update = async (code: string) => {
    setValue(code);
    setLocale(code);
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ preferred_language: code })
      .eq("id", auth.user.id);
    if (error) {
      toast({ title: "Could not save language", description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("common.saved", "Saved") });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profile.preferred_language")}</CardTitle>
        <CardDescription>{t("profile.preferred_language_help")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-w-sm">
          <Label htmlFor="preferred-language">{t("common.language")}</Label>
          <Select value={value} onValueChange={update}>
            <SelectTrigger id="preferred-language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-72 bg-card z-50">
              {languages.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  {l.flag_emoji} {l.native_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguagePreferenceCard;
