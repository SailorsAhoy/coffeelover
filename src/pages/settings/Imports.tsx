import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileSpreadsheet, ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/imports/schema";
import { buildTemplate, buildSample, downloadCsv } from "@/lib/imports/runImport";

const Imports = () => (
  <div className="space-y-4">
    <div>
      <h2 className="text-2xl font-bold">Bulk Imports</h2>
      <p className="text-sm text-muted-foreground">
        Admin-only. Download a template or sample, fill it in, then upload. Invalid rows are skipped
        with a downloadable error report, and every run is recorded in the import audit log.
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {CATEGORIES.map((c) => (
        <Card key={c.key} className="p-4 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <Upload className="w-5 h-5 mt-0.5 text-primary shrink-0" />
            <div className="min-w-0">
              <div className="font-semibold">{c.label}</div>
              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => downloadCsv(`${c.key}-template.csv`, buildTemplate(c))}
            >
              <Download className="w-3.5 h-3.5 mr-1" /> Template
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => downloadCsv(`${c.key}-sample.csv`, buildSample(c))}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1" /> Sample
            </Button>
            <Button size="sm" asChild>
              <Link to={`/settings/imports/${c.key}`}>
                Open <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default Imports;
