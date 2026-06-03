import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { CATEGORIES } from "@/lib/imports/schema";

const Imports = () => (
  <div className="space-y-4">
    <div>
      <h2 className="text-2xl font-bold">Bulk Imports</h2>
      <p className="text-sm text-muted-foreground">
        Import records from CSV. Download a template, fill it in, upload it back. Invalid rows are skipped
        and returned as a downloadable error report.
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {CATEGORIES.map((c) => (
        <Link key={c.key} to={`/settings/imports/${c.key}`}>
          <Card className="p-4 hover:bg-accent transition-colors h-full">
            <div className="flex items-start gap-3">
              <Upload className="w-5 h-5 mt-0.5 text-primary shrink-0" />
              <div>
                <div className="font-semibold">{c.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.description}</div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  </div>
);

export default Imports;
