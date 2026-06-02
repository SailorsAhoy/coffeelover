import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { AffiliateLink } from "@/lib/shopsData";

interface Props {
  value: AffiliateLink[];
  onChange: (next: AffiliateLink[]) => void;
}

export const AffiliateLinksEditor = ({ value, onChange }: Props) => {
  const add = () =>
    onChange([...value, { id: crypto.randomUUID(), label: "", url: "" }]);
  const update = (id: string, patch: Partial<AffiliateLink>) =>
    onChange(value.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const remove = (id: string) => onChange(value.filter((l) => l.id !== id));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Delivery, online store or partner URLs
        </span>
        <Button size="sm" variant="ghost" className="h-7 gap-1" onClick={add}>
          <Plus className="h-3.5 w-3.5" /> Add
        </Button>
      </div>
      {value.length === 0 && (
        <p className="text-xs text-muted-foreground">No links yet.</p>
      )}
      <ul className="space-y-2">
        {value.map((l) => (
          <li key={l.id} className="space-y-1 rounded-lg border p-2">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Label (e.g. Uber Eats)"
                value={l.label}
                maxLength={60}
                onChange={(e) => update(l.id, { label: e.target.value })}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => remove(l.id)}
                aria-label="Remove link"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <Input
              placeholder="https://…"
              value={l.url}
              maxLength={500}
              onChange={(e) => update(l.id, { url: e.target.value })}
              inputMode="url"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AffiliateLinksEditor;
