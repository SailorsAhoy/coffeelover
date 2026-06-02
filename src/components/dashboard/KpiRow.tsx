import { StatCard } from "./StatCard";
import type { LucideIcon } from "lucide-react";

export interface Kpi {
  label: string;
  value: number | string;
  icon: LucideIcon;
  to?: string;
  hint?: string;
}

export const KpiRow = ({ items }: { items: Kpi[] }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {items.map((k) => (
      <StatCard key={k.label} label={k.label} value={k.value} icon={k.icon} to={k.to} hint={k.hint} />
    ))}
  </div>
);
