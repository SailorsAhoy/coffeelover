import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/contexts/I18nContext";
import { BASE_STRINGS } from "@/lib/i18n/strings";
import { WELCOME_STRINGS } from "@/lib/i18n/welcomeStrings";
import { Languages, Plus, RefreshCw, Sparkles, Trash2, Download, Upload } from "lucide-react";
import {
  exportUiCsv, importUiCsv, exportContentCsv, importContentCsv, downloadCsv,
} from "@/lib/i18n/translationIO";

interface LangRow {
  code: string;
  name: string;
  native_name: string;
  flag_emoji: string | null;
  enabled: boolean;
  is_default: boolean;
  sort_order: number;
}

interface StringRow {
  key: string;
  namespace: string;
  en_value: string;
}

const CONTENT_SOURCES = [
  { table: "blog_posts", label: "News posts", columns: ["title", "excerpt", "content"], idCol: "id" },
  { table: "blog_categories", label: "News categories", columns: ["name", "description"], idCol: "id" },
  { table: "recipes", label: "Recipes", columns: ["title", "description"], idCol: "id" },
  { table: "shops", label: "Coffee shops", columns: ["description", "bio"], idCol: "id" },
  { table: "roasters", label: "Roasters", columns: ["description", "bio"], idCol: "id" },
  { table: "coffee_brands", label: "Coffee products", columns: ["description"], idCol: "id" },
  { table: "preparation_guides", label: "Brewing guides", columns: ["title", "description"], idCol: "id" },
  { table: "courses", label: "Academy courses", columns: ["title", "description"], idCol: "id" },
];

const LanguageManagement = () => {
  const { toast } = useToast();
  const { reloadStrings } = useI18n();

  const [langs, setLangs] = useState<LangRow[]>([]);
  const [strings, setStrings] = useState<StringRow[]>([]);
  const [target, setTarget] = useState("es");
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [namespace, setNamespace] = useState("all");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [newLang, setNewLang] = useState({ code: "", name: "", native_name: "", flag_emoji: "" });

  // Content tab state
  const [source, setSource] = useState(CONTENT_SOURCES[0].table);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [contentTr, setContentTr] = useState<Record<string, string>>({});

  const loadLangs = useCallback(async () => {
    const { data } = await supabase.from("languages").select("*").order("sort_order");
    setLangs((data ?? []) as LangRow[]);
  }, []);

  const loadStrings = useCallback(async () => {
    const { data } = await supabase.from("ui_strings").select("key, namespace, en_value").order("key");
    setStrings((data ?? []) as StringRow[]);
  }, []);

  const loadTranslations = useCallback(async (code: string) => {
    const { data } = await supabase.from("ui_translations").select("string_key, value").eq("locale", code);
    const map: Record<string, string> = {};
    (data ?? []).forEach((r: { string_key: string; value: string }) => { map[r.string_key] = r.value; });
    setTranslations(map);
  }, []);

  useEffect(() => { void loadLangs(); void loadStrings(); }, [loadLangs, loadStrings]);
  useEffect(() => { void loadTranslations(target); }, [target, loadTranslations]);

  const syncBaseStrings = async () => {
    setBusy(true);
    const rowsToUpsert = [...BASE_STRINGS, ...WELCOME_STRINGS].map((s) => ({ key: s.key, namespace: s.namespace, en_value: s.en }));
    const existingKeys = new Set(strings.map((s) => s.key));
    const missing = rowsToUpsert.filter((r) => !existingKeys.has(r.key));
    if (missing.length) {
      const { error } = await supabase.from("ui_strings").insert(missing);
      if (error) {
        toast({ title: "Sync failed", description: error.message, variant: "destructive" });
        setBusy(false);
        return;
      }
    }
    await loadStrings();
    setBusy(false);
    toast({ title: `Synced ${missing.length} new text${missing.length === 1 ? "" : "s"}` });
  };

  const saveString = async (key: string, en_value: string) => {
    const { error } = await supabase.from("ui_strings").update({ en_value }).eq("key", key);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else void reloadStrings();
  };

  const saveTranslation = async (key: string, value: string) => {
    if (!value.trim()) {
      await supabase.from("ui_translations").delete().eq("string_key", key).eq("locale", target);
    } else {
      const { error } = await supabase
        .from("ui_translations")
        .upsert({ string_key: key, locale: target, value: value.trim(), is_machine: false }, { onConflict: "string_key,locale" });
      if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); return; }
    }
    void reloadStrings();
  };

  const autoTranslateUi = async () => {
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("translate-content", {
      body: { locale: target, scope: "ui" },
    });
    setBusy(false);
    if (error) { toast({ title: "Auto-translate failed", description: error.message, variant: "destructive" }); return; }
    if ((data as any)?.error) { toast({ title: "Auto-translate failed", description: (data as any).error, variant: "destructive" }); return; }
    toast({ title: `Translated ${(data as any)?.translated ?? 0} texts` });
    await loadTranslations(target);
    void reloadStrings();
  };

  const addLanguage = async () => {
    if (!newLang.code || !newLang.name) {
      toast({ title: "Code and English name are required", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("languages").insert({
      code: newLang.code.toLowerCase().trim(),
      name: newLang.name.trim(),
      native_name: (newLang.native_name || newLang.name).trim(),
      flag_emoji: newLang.flag_emoji || null,
      sort_order: 200,
    });
    if (error) { toast({ title: "Could not add language", description: error.message, variant: "destructive" }); return; }
    setNewLang({ code: "", name: "", native_name: "", flag_emoji: "" });
    await loadLangs();
    toast({ title: "Language added" });
  };

  const toggleLang = async (code: string, enabled: boolean) => {
    await supabase.from("languages").update({ enabled }).eq("code", code);
    await loadLangs();
  };

  const removeLang = async (code: string) => {
    if (code === "en") { toast({ title: "English cannot be removed", variant: "destructive" }); return; }
    const { error } = await supabase.from("languages").delete().eq("code", code);
    if (error) { toast({ title: "Could not remove", description: error.message, variant: "destructive" }); return; }
    await loadLangs();
  };

  // --- Content tab ---
  const cfg = CONTENT_SOURCES.find((c) => c.table === source)!;

  const loadContent = useCallback(async () => {
    const cols = ["id", ...cfg.columns].join(", ");
    const { data } = await (supabase as any).from(cfg.table).select(cols).limit(100);
    setRows((data ?? []) as Record<string, string>[]);
    const { data: tr } = await supabase
      .from("content_translations")
      .select("row_id, column_name, value")
      .eq("locale", target)
      .eq("table_name", cfg.table);
    const map: Record<string, string> = {};
    (tr ?? []).forEach((r: { row_id: string; column_name: string; value: string }) => {
      map[`${r.row_id}:${r.column_name}`] = r.value;
    });
    setContentTr(map);
  }, [cfg, target]);

  useEffect(() => { void loadContent(); }, [loadContent]);

  const saveContent = async (rowId: string, column: string, value: string) => {
    if (!value.trim()) {
      await supabase.from("content_translations").delete()
        .eq("table_name", cfg.table).eq("row_id", rowId).eq("column_name", column).eq("locale", target);
      return;
    }
    const { error } = await supabase.from("content_translations").upsert(
      { table_name: cfg.table, row_id: rowId, column_name: column, locale: target, value: value.trim(), is_machine: false },
      { onConflict: "table_name,row_id,column_name,locale" },
    );
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
  };

  const autoTranslateContent = async () => {
    setBusy(true);
    const items = rows.flatMap((r) =>
      cfg.columns
        .filter((c) => r[c])
        .map((c) => ({ table: cfg.table, row_id: String(r.id), column: c, value: String(r[c]) })),
    );
    const { data, error } = await supabase.functions.invoke("translate-content", {
      body: { locale: target, scope: "content", items },
    });
    setBusy(false);
    if (error) { toast({ title: "Auto-translate failed", description: error.message, variant: "destructive" }); return; }
    if ((data as any)?.error) { toast({ title: "Auto-translate failed", description: (data as any).error, variant: "destructive" }); return; }
    toast({ title: `Translated ${(data as any)?.translated ?? 0} fields` });
    await loadContent();
  };

  // --- Export / import ---
  const uiFileRef = useRef<HTMLInputElement>(null);
  const contentFileRef = useRef<HTMLInputElement>(null);
  const [ioScope, setIoScope] = useState<"target" | "all">("target");

  const exportLocales = () =>
    ioScope === "all" ? langs.filter((l) => l.code !== "en").map((l) => l.code) : [target];

  const doExportUi = async () => {
    setBusy(true);
    try {
      const csv = await exportUiCsv(exportLocales());
      downloadCsv(`coffeeplanets-interface-${ioScope === "all" ? "all" : target}.csv`, csv);
      toast({ title: "Catalog exported" });
    } catch (e) {
      toast({ title: "Export failed", description: (e as Error).message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  const doExportContent = async () => {
    setBusy(true);
    try {
      const csv = await exportContentCsv(CONTENT_SOURCES, exportLocales());
      downloadCsv(`coffeeplanets-content-${ioScope === "all" ? "all" : target}.csv`, csv);
      toast({ title: "Content exported" });
    } catch (e) {
      toast({ title: "Export failed", description: (e as Error).message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  const doImport = async (file: File, kind: "ui" | "content") => {
    setBusy(true);
    try {
      const text = await file.text();
      const res = kind === "ui" ? await importUiCsv(text) : await importContentCsv(text);
      if (res.errors.length) {
        toast({ title: "Import finished with errors", description: res.errors[0], variant: "destructive" });
      } else {
        toast({
          title: `Imported ${res.upserted} translation${res.upserted === 1 ? "" : "s"}`,
          description: `Languages: ${res.locales.join(", ") || "—"}${res.skipped ? ` · ${res.skipped} row(s) skipped` : ""}`,
        });
      }
      if (kind === "ui") { await loadTranslations(target); void reloadStrings(); }
      else await loadContent();
    } catch (e) {
      toast({ title: "Import failed", description: (e as Error).message, variant: "destructive" });
    } finally { setBusy(false); }
  };


  const namespaces = useMemo(
    () => Array.from(new Set(strings.map((s) => s.namespace))).sort(),
    [strings],
  );

  const visibleStrings = useMemo(
    () =>
      strings.filter(
        (s) =>
          (namespace === "all" || s.namespace === namespace) &&
          (!query ||
            s.key.toLowerCase().includes(query.toLowerCase()) ||
            s.en_value.toLowerCase().includes(query.toLowerCase())),
      ),
    [strings, namespace, query],
  );

  const missingCount = strings.filter((s) => !translations[s.key]).length;
  const targetLang = langs.find((l) => l.code === target);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Languages className="w-5 h-5" /> Languages &amp; Translations
            </CardTitle>
            <CardDescription>Manage available languages and edit every translated text.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={syncBaseStrings} disabled={busy}>
            <RefreshCw className="w-4 h-4 mr-2" /> Sync interface texts
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="languages">
          <TabsList className="mb-4">
            <TabsTrigger value="languages">Languages</TabsTrigger>
            <TabsTrigger value="ui">Interface texts</TabsTrigger>
            <TabsTrigger value="content">Database content</TabsTrigger>
          </TabsList>

          {/* Languages */}
          <TabsContent value="languages" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end border border-border rounded-lg p-4">
              <div className="space-y-1">
                <Label>Code</Label>
                <Input placeholder="no" maxLength={8} value={newLang.code}
                  onChange={(e) => setNewLang({ ...newLang, code: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>English name</Label>
                <Input placeholder="Norwegian" value={newLang.name}
                  onChange={(e) => setNewLang({ ...newLang, name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Native name</Label>
                <Input placeholder="Norsk" value={newLang.native_name}
                  onChange={(e) => setNewLang({ ...newLang, native_name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Flag</Label>
                <Input placeholder="🇳🇴" value={newLang.flag_emoji}
                  onChange={(e) => setNewLang({ ...newLang, flag_emoji: e.target.value })} />
              </div>
              <Button onClick={addLanguage}><Plus className="w-4 h-4 mr-2" />Add</Button>
            </div>

            <div className="divide-y divide-border border border-border rounded-lg">
              {langs.map((l) => (
                <div key={l.code} className="flex items-center gap-3 p-3">
                  <span className="text-lg w-7">{l.flag_emoji ?? "🌐"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {l.native_name}
                      <span className="text-muted-foreground font-normal"> · {l.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground uppercase">{l.code}</div>
                  </div>
                  {l.is_default && <Badge variant="secondary">Default</Badge>}
                  <Switch checked={l.enabled} onCheckedChange={(v) => toggleLang(l.code, v)} />
                  <Button variant="ghost" size="icon" onClick={() => removeLang(l.code)} disabled={l.code === "en"}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Interface texts */}
          <TabsContent value="ui" className="space-y-4">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="space-y-1">
                <Label>Language</Label>
                <Select value={target} onValueChange={setTarget}>
                  <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-72 bg-card z-50">
                    {langs.filter((l) => l.code !== "en").map((l) => (
                      <SelectItem key={l.code} value={l.code}>{l.flag_emoji} {l.native_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Group</Label>
                <Select value={namespace} onValueChange={setNamespace}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    <SelectItem value="all">All groups</SelectItem>
                    {namespaces.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 flex-1 min-w-[180px]">
                <Label>Search</Label>
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search key or text" />
              </div>
              <Button onClick={autoTranslateUi} disabled={busy || missingCount === 0}>
                <Sparkles className="w-4 h-4 mr-2" />
                {busy ? "Translating…" : `Auto-translate ${missingCount} missing`}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              {strings.length - missingCount}/{strings.length} translated into {targetLang?.native_name ?? target}
            </div>

            <div className="divide-y divide-border border border-border rounded-lg max-h-[60vh] overflow-y-auto">
              {visibleStrings.map((s) => (
                <div key={s.key} className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground font-mono">{s.key}</div>
                    <Input
                      defaultValue={s.en_value}
                      onBlur={(e) => e.target.value !== s.en_value && saveString(s.key, e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      {targetLang?.native_name ?? target}
                      {!translations[s.key] && <span className="text-destructive"> · missing</span>}
                    </div>
                    <Input
                      key={`${target}-${s.key}-${translations[s.key] ?? ""}`}
                      defaultValue={translations[s.key] ?? ""}
                      placeholder="—"
                      onBlur={(e) => {
                        if (e.target.value !== (translations[s.key] ?? "")) {
                          void saveTranslation(s.key, e.target.value);
                          setTranslations((p) => ({ ...p, [s.key]: e.target.value }));
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
              {visibleStrings.length === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No interface texts yet — use “Sync interface texts”.
                </div>
              )}
            </div>
          </TabsContent>

          {/* Database content */}
          <TabsContent value="content" className="space-y-4">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="space-y-1">
                <Label>Data</Label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    {CONTENT_SOURCES.map((c) => <SelectItem key={c.table} value={c.table}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Language</Label>
                <Select value={target} onValueChange={setTarget}>
                  <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-72 bg-card z-50">
                    {langs.filter((l) => l.code !== "en").map((l) => (
                      <SelectItem key={l.code} value={l.code}>{l.flag_emoji} {l.native_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={autoTranslateContent} disabled={busy || rows.length === 0}>
                <Sparkles className="w-4 h-4 mr-2" />
                {busy ? "Translating…" : "Auto-translate missing"}
              </Button>
            </div>

            <div className="divide-y divide-border border border-border rounded-lg max-h-[60vh] overflow-y-auto">
              {rows.map((r) =>
                cfg.columns
                  .filter((c) => r[c])
                  .map((c) => (
                    <div key={`${r.id}-${c}`} className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground font-mono">{c}</div>
                        <div className="text-sm border border-input rounded-md px-3 py-2 bg-muted/40 line-clamp-3">
                          {String(r[c])}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">{targetLang?.native_name ?? target}</div>
                        <Input
                          key={`${target}-${r.id}-${c}-${contentTr[`${r.id}:${c}`] ?? ""}`}
                          defaultValue={contentTr[`${r.id}:${c}`] ?? ""}
                          placeholder="—"
                          onBlur={(e) => {
                            if (e.target.value !== (contentTr[`${r.id}:${c}`] ?? "")) {
                              void saveContent(String(r.id), c, e.target.value);
                              setContentTr((p) => ({ ...p, [`${r.id}:${c}`]: e.target.value }));
                            }
                          }}
                        />
                      </div>
                    </div>
                  )),
              )}
              {rows.length === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground">No records to translate.</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LanguageManagement;
