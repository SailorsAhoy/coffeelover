import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Upload, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { getCategory } from "@/lib/imports/schema";
import {
  parseCsv,
  runImport,
  buildTemplate,
  buildSample,
  buildErrorsCsv,
  downloadCsv,
  exportParents,
  type ImportResult,
} from "@/lib/imports/runImport";

const ImportCategory = () => {
  const { category } = useParams<{ category: string }>();
  const schema = useMemo(() => (category ? getCategory(category) : undefined), [category]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<Record<string, string>[] | null>(null);
  const [fileName, setFileName] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  if (!schema) {
    return (
      <Card className="p-6">
        <p>Unknown category.</p>
        <Link to="/settings/imports" className="text-primary underline text-sm">Back to imports</Link>
      </Card>
    );
  }

  const onFile = async (file: File) => {
    const text = await file.text();
    const parsed = parseCsv(text);
    setRows(parsed);
    setFileName(file.name);
    setResult(null);
  };

  const onImport = async () => {
    if (!rows) return;
    setBusy(true);
    try {
      const res = await runImport(schema, rows, { fileName });
      setResult(res);
      toast.success(`Imported ${res.inserted}, skipped ${res.skipped}`);
      if (res.errors.length) {
        downloadCsv(`${schema.key}-errors.csv`, buildErrorsCsv(res.errors));
      }
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <Link to="/settings/imports" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <Card className="p-5 space-y-3">
        <div>
          <h2 className="text-2xl font-bold">{schema.label}</h2>
          <p className="text-sm text-muted-foreground">{schema.description}</p>
        </div>

        {schema.oneOfParents && (
          <div className="text-xs bg-muted/50 rounded p-3">
            <strong>Requires parent:</strong> at least one of{" "}
            {schema.oneOfParents.map((p) => <Badge key={p} variant="secondary" className="mx-0.5">{p}</Badge>)}
            {" "}must reference an existing record (by UUID, slug, or name).
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => downloadCsv(`${schema.key}-template.csv`, buildTemplate(schema))}
          >
            <Download className="w-4 h-4 mr-2" /> Download template
          </Button>
          <Button
            variant="outline"
            onClick={() => downloadCsv(`${schema.key}-sample.csv`, buildSample(schema))}
          >
            <Download className="w-4 h-4 mr-2" /> Download sample
          </Button>
          {schema.parentExports?.map((p) => (
            <Button
              key={p.table}
              variant="outline"
              onClick={async () => {
                try {
                  const csv = await exportParents(p.table, p.columns);
                  downloadCsv(`${p.table}.csv`, csv);
                } catch (e) {
                  toast.error((e as Error).message);
                }
              }}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" /> Export {p.label}
            </Button>
          ))}
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
              if (fileRef.current) fileRef.current.value = "";
            }}
          />
          <Button onClick={() => fileRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" /> Upload CSV
          </Button>
        </div>
      </Card>

      {rows && (
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Preview — {rows.length} rows</div>
            <Button onClick={onImport} disabled={busy}>
              {busy ? "Importing…" : `Import ${rows.length}`}
            </Button>
          </div>
          <div className="overflow-auto max-h-96 border rounded">
            <table className="text-xs w-full">
              <thead className="bg-muted sticky top-0">
                <tr>
                  {schema.fields.map((f) => (
                    <th key={f.key} className="px-2 py-1 text-left whitespace-nowrap">
                      {f.key}{f.required && <span className="text-destructive">*</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 20).map((r, i) => (
                  <tr key={i} className="border-t">
                    {schema.fields.map((f) => (
                      <td key={f.key} className="px-2 py-1 max-w-[200px] truncate" title={r[f.key]}>
                        {r[f.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > 20 && (
              <div className="px-2 py-1 text-xs text-muted-foreground">
                …{rows.length - 20} more rows hidden from preview
              </div>
            )}
          </div>
        </Card>
      )}

      {result && (
        <Card className="p-5 space-y-2">
          <div className="font-semibold">Import result</div>
          <div className="text-sm">
            ✅ Inserted: <strong>{result.inserted}</strong> &nbsp;·&nbsp;
            ⚠️ Skipped: <strong>{result.skipped}</strong>
          </div>
          {result.errors.length > 0 && (
            <div className="text-xs text-muted-foreground">
              Error report downloaded as <code>{schema.key}-errors.csv</code>.
              First error (row {result.errors[0].row}): {result.errors[0].reason}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default ImportCategory;
