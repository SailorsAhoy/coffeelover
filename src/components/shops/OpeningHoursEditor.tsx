import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { OpeningHours } from "@/lib/shopUtils";

const DAYS: { key: keyof OpeningHours; label: string }[] = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
];

interface Props {
  value: OpeningHours;
  onChange: (next: OpeningHours) => void;
}

export const OpeningHoursEditor = ({ value, onChange }: Props) => {
  const setDay = (day: string, patch: Partial<OpeningHours[string]>) => {
    onChange({
      ...value,
      [day]: { ...value[day], ...patch },
    });
  };

  return (
    <div className="space-y-1.5">
      {DAYS.map(({ key, label }) => {
        const h = value[key as string] ?? { open: "09:00", close: "18:00" };
        return (
          <div
            key={key}
            className="flex items-center gap-2 rounded-lg border p-2"
          >
            <span className="w-10 text-xs font-medium uppercase text-muted-foreground">
              {label}
            </span>
            {h.closed ? (
              <span className="flex-1 text-xs text-muted-foreground">Closed</span>
            ) : (
              <>
                <Input
                  type="time"
                  value={h.open}
                  onChange={(e) => setDay(key as string, { open: e.target.value })}
                  className="h-8 flex-1 text-xs"
                />
                <span className="text-xs text-muted-foreground">–</span>
                <Input
                  type="time"
                  value={h.close}
                  onChange={(e) => setDay(key as string, { close: e.target.value })}
                  className="h-8 flex-1 text-xs"
                />
              </>
            )}
            <div className="flex items-center gap-1.5">
              <Label className="text-[10px] text-muted-foreground">Closed</Label>
              <Switch
                checked={!!h.closed}
                onCheckedChange={(v) => setDay(key as string, { closed: v })}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OpeningHoursEditor;
