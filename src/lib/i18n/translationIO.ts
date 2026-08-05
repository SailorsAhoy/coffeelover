import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";

export interface ImportSummary {
  locales: string[];
  upserted: number;
  skipped: number;
  errors: string[];
}

const CHUNK = 200;

export const downloadCsv = (filename: string, csv: string) => {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const parse = (csv: string): Record<string, string>[] => {
  const out = Papa.parse<Record<string, string>>(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });
  return out.data.filter((r) => Object.values(r).some((v) => (v ?? "").toString().trim() !== ""));
};

const fixedUi = new Set(["key", "namespace", "en"]);
const fixedContent = new Set(["table", "row_id", "column", "en"]);

/* ---------------- Interface texts ---------------- */

/** Export UI strings with one column per requested locale (empty when missing). */
export const exportUiCsv = async (locales: string[]): Promise<string> => {
  const { data: strings, error } = await supabase
    .from("ui_strings")
    .select("key, namespace, en_value")
    .order("key");
  if (error) throw error;

  const { data: trs, error: e2 } = await supabase
    .from("ui_translations")
    .select("string_key, locale, value")
    .in("locale", locales);
  if (e2) throw e2;

  const map: Record<string, string> = {};
  (trs ?? []).forEach((r: { string_key: string; locale: string; value: string }) => {
    map[`${r.string_key}|${r.locale}`] = r.value;
  });

  const rows = (strings ?? []).map((s: { key: string; namespace: string; en_value: string }) => {
    const row: Record<string, string> = { key: s.key, namespace: s.namespace, en: s.en_value };
    locales.forEach((l) => { row[l] = map[`${s.key}|${l}`] ?? ""; });
    return row;
  });

  return Papa.unparse(rows, { columns: ["key", "namespace", "en", ...locales] });
};

/** Import a UI translation CSV. Any column that is not key/namespace/en is treated as a locale. */
export const importUiCsv = async (csv: string): Promise<ImportSummary> => {
  const rows = parse(csv);
  const summary: ImportSummary = { locales: [], upserted: 0, skipped: 0, errors: [] };
  if (!rows.length) { summary.errors.push("File is empty."); return summary; }
  if (!("key" in rows[0])) { summary.errors.push('Missing required "key" column.'); return summary; }

  const locales = Object.keys(rows[0]).filter((c) => c && !fixedUi.has(c));
  summary.locales = locales;
  if (!locales.length) { summary.errors.push("No locale columns found."); return summary; }

  const { data: known } = await supabase.from("ui_strings").select("key");
  const knownKeys = new Set((known ?? []).map((k: { key: string }) => k.key));

  const payload: { string_key: string; locale: string; value: string; is_machine: boolean }[] = [];
  for (const r of rows) {
    const key = (r.key ?? "").trim();
    if (!key) { summary.skipped++; continue; }
    if (!knownKeys.has(key)) { summary.skipped++; continue; }
    for (const l of locales) {
      const v = (r[l] ?? "").trim();
      if (!v) continue;
      payload.push({ string_key: key, locale: l, value: v, is_machine: false });
    }
  }

  for (let i = 0; i < payload.length; i += CHUNK) {
    const chunk = payload.slice(i, i + CHUNK);
    const { error } = await supabase
      .from("ui_translations")
      .upsert(chunk, { onConflict: "string_key,locale" });
    if (error) summary.errors.push(error.message);
    else summary.upserted += chunk.length;
  }
  return summary;
};

/* ---------------- Database content ---------------- */

export interface ContentSourceCfg { table: string; columns: string[] }

export const exportContentCsv = async (
  sources: ContentSourceCfg[],
  locales: string[],
): Promise<string> => {
  const rows: Record<string, string>[] = [];

  for (const cfg of sources) {
    const { data } = await (supabase as any)
      .from(cfg.table)
      .select(["id", ...cfg.columns].join(", "))
      .limit(1000);
    const records = (data ?? []) as Record<string, unknown>[];
    if (!records.length) continue;

    const { data: trs } = await supabase
      .from("content_translations")
      .select("row_id, column_name, locale, value")
      .eq("table_name", cfg.table)
      .in("locale", locales);
    const map: Record<string, string> = {};
    (trs ?? []).forEach((r: { row_id: string; column_name: string; locale: string; value: string }) => {
      map[`${r.row_id}|${r.column_name}|${r.locale}`] = r.value;
    });

    for (const rec of records) {
      for (const col of cfg.columns) {
        const en = rec[col];
        if (en == null || String(en).trim() === "") continue;
        const row: Record<string, string> = {
          table: cfg.table,
          row_id: String(rec.id),
          column: col,
          en: String(en),
        };
        locales.forEach((l) => { row[l] = map[`${rec.id}|${col}|${l}`] ?? ""; });
        rows.push(row);
      }
    }
  }

  return Papa.unparse(rows, { columns: ["table", "row_id", "column", "en", ...locales] });
};

export const importContentCsv = async (csv: string): Promise<ImportSummary> => {
  const rows = parse(csv);
  const summary: ImportSummary = { locales: [], upserted: 0, skipped: 0, errors: [] };
  if (!rows.length) { summary.errors.push("File is empty."); return summary; }
  const head = Object.keys(rows[0]);
  if (!["table", "row_id", "column"].every((c) => head.includes(c))) {
    summary.errors.push('Missing required columns: table, row_id, column.');
    return summary;
  }
  const locales = head.filter((c) => c && !fixedContent.has(c));
  summary.locales = locales;
  if (!locales.length) { summary.errors.push("No locale columns found."); return summary; }

  const payload: {
    table_name: string; row_id: string; column_name: string;
    locale: string; value: string; is_machine: boolean;
  }[] = [];

  for (const r of rows) {
    const table = (r.table ?? "").trim();
    const rowId = (r.row_id ?? "").trim();
    const column = (r.column ?? "").trim();
    if (!table || !rowId || !column) { summary.skipped++; continue; }
    for (const l of locales) {
      const v = (r[l] ?? "").trim();
      if (!v) continue;
      payload.push({
        table_name: table, row_id: rowId, column_name: column,
        locale: l, value: v, is_machine: false,
      });
    }
  }

  for (let i = 0; i < payload.length; i += CHUNK) {
    const chunk = payload.slice(i, i + CHUNK);
    const { error } = await supabase
      .from("content_translations")
      .upsert(chunk, { onConflict: "table_name,row_id,column_name,locale" });
    if (error) summary.errors.push(error.message);
    else summary.upserted += chunk.length;
  }
  return summary;
};
