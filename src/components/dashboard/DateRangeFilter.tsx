import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export type RangeKey = "7d" | "30d" | "90d" | "ytd" | "all";

export const rangeStart = (key: RangeKey): string | null => {
  const now = new Date();
  if (key === "all") return null;
  if (key === "ytd") return new Date(now.getFullYear(), 0, 1).toISOString();
  const days = key === "7d" ? 7 : key === "30d" ? 30 : 90;
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
};

const OPTIONS: { key: RangeKey; label: string }[] = [
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
  { key: "90d", label: "90d" },
  { key: "ytd", label: "YTD" },
  { key: "all", label: "All" },
];

interface Props {
  value: RangeKey;
  onChange: (key: RangeKey) => void;
}

export const DateRangeFilter = ({ value, onChange }: Props) => (
  <div className="flex items-center gap-2 flex-wrap">
    <Calendar className="w-4 h-4 text-muted-foreground" />
    {OPTIONS.map((o) => (
      <Button
        key={o.key}
        size="sm"
        variant={value === o.key ? "default" : "outline"}
        onClick={() => onChange(o.key)}
      >
        {o.label}
      </Button>
    ))}
  </div>
);
