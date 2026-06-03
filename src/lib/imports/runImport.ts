import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";
import { type CategorySchema, slugify } from "./schema";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const coerce = (raw: string, type: string | undefined) => {
  const v = (raw ?? "").trim();
  if (v === "") return null;
  switch (type) {
    case "number": {
      const n = Number(v);
      if (Number.isNaN(n)) throw new Error(`expected number, got "${v}"`);
      return n;
    }
    case "boolean":
      return /^(true|1|yes|y)$/i.test(v);
    case "json":
      try { return JSON.parse(v); } catch { throw new Error(`invalid JSON: ${v}`); }
    case "csv-array":
      return v.split(",").map((s) => s.trim()).filter(Boolean);
    default:
      return v;
  }
};

export interface ImportResult {
  inserted: number;
  skipped: number;
  errors: { row: number; reason: string; data: Record<string, string> }[];
}

/** Parse a CSV string into rows of header→string. */
export const parseCsv = (csv: string): Record<string, string>[] => {
  const out = Papa.parse<Record<string, string>>(csv, {
    header: true, skipEmptyLines: true, transformHeader: (h) => h.trim(),
  });
  return out.data.filter((r) => Object.values(r).some((v) => (v ?? "").toString().trim() !== ""));
};

/** Resolve a value (uuid or slug/name) to a parent uuid. Returns null if not found. */
const resolveParent = async (
  table: string,
  matchColumns: string[],
  value: string,
): Promise<string | null> => {
  const v = value.trim();
  if (UUID_RE.test(v)) {
    const { data } = await supabase.from(table as any).select("id").eq("id", v).maybeSingle();
    return (data as any)?.id ?? null;
  }
  for (const col of matchColumns) {
    if (col === "id") continue;
    const { data } = await supabase.from(table as any).select("id").ilike(col, v).limit(2);
    if (data && data.length === 1) return (data[0] as any).id;
    if (data && data.length > 1) throw new Error(`ambiguous ${table}.${col}="${v}"`);
  }
  return null;
};

export const runImport = async (
  schema: CategorySchema,
  rows: Record<string, string>[],
  meta?: { fileName?: string },
): Promise<ImportResult> => {
  const result: ImportResult = { inserted: 0, skipped: 0, errors: [] };
  const toInsert: Record<string, unknown>[] = [];
  const rowMap: number[] = [];

  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i];
    try {
      const obj: Record<string, unknown> = {};
      for (const f of schema.fields) {
        const v = raw[f.key];
        if (f.required && (v == null || v.toString().trim() === "")) {
          throw new Error(`missing required field "${f.key}"`);
        }
        if (f.parent && v && v.toString().trim() !== "") {
          const resolved = await resolveParent(f.parent.table, f.parent.matchColumns, v.toString());
          if (!resolved) throw new Error(`${f.parent.label} "${v}" not found`);
          obj[f.key] = resolved;
        } else {
          const coerced = coerce(v ?? "", f.type);
          if (coerced !== null) obj[f.key] = coerced;
        }
      }
      // one-of parents check
      if (schema.oneOfParents && !schema.oneOfParents.some((k) => obj[k])) {
        throw new Error(`one of [${schema.oneOfParents.join(", ")}] is required`);
      }
      // auto-slug
      if (schema.slugFrom && !obj.slug && obj[schema.slugFrom]) {
        obj.slug = slugify(String(obj[schema.slugFrom]));
      }
      toInsert.push(obj);
      rowMap.push(i);
    } catch (e) {
      result.skipped++;
      result.errors.push({ row: i + 2, reason: (e as Error).message, data: raw });
    }
  }

  // chunked inserts, fall back to per-row on chunk failure to isolate bad row.
  for (let start = 0; start < toInsert.length; start += 50) {
    const chunk = toInsert.slice(start, start + 50);
    const { error } = await supabase.from(schema.table as any).insert(chunk);
    if (!error) {
      result.inserted += chunk.length;
      continue;
    }
    // per-row retry
    for (let j = 0; j < chunk.length; j++) {
      const { error: e2 } = await supabase.from(schema.table as any).insert(chunk[j] as any);
      if (e2) {
        result.skipped++;
        result.errors.push({
          row: rowMap[start + j] + 2,
          reason: e2.message,
          data: rows[rowMap[start + j]],
        });
      } else {
        result.inserted++;
      }
    }
  }

  // Audit log
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("import_audit_log" as any).insert({
        actor_user_id: user.id,
        actor_email: user.email ?? null,
        category: schema.key,
        table_name: schema.table,
        file_name: meta?.fileName ?? null,
        total_rows: rows.length,
        inserted_count: result.inserted,
        skipped_count: result.skipped,
        error_preview: result.errors.slice(0, 10),
      });
    }
  } catch {
    // non-fatal
  }

  return result;
};

/** Build a CSV template from schema (headers + one example row). */
export const buildTemplate = (schema: CategorySchema): string => {
  const headers = schema.fields.map((f) => f.key);
  const example = schema.fields.map((f) => f.example ?? "");
  return Papa.unparse([headers, example]);
};

/** Build a small sample CSV (3 example rows) demonstrating valid data. */
export const buildSample = (schema: CategorySchema): string => {
  const headers = schema.fields.map((f) => f.key);
  const rows = [0, 1, 2].map((i) =>
    schema.fields.map((f) => {
      const ex = f.example ?? "";
      if (!ex) return "";
      if (f.required && (f.type === undefined || f.type === "string") && !f.parent) {
        return `${ex} ${i + 1}`;
      }
      return ex;
    }),
  );
  return Papa.unparse([headers, ...rows]);
};

export const buildErrorsCsv = (errors: ImportResult["errors"]): string => {
  const rows = errors.map((e) => ({ row: e.row, reason: e.reason, ...e.data }));
  return Papa.unparse(rows);
};

export const downloadCsv = (filename: string, csv: string) => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

export const exportParents = async (table: string, columns: string[]): Promise<string> => {
  const { data, error } = await supabase.from(table as any).select(columns.join(",")).limit(5000);
  if (error) throw error;
  return Papa.unparse((data as any) ?? []);
};
