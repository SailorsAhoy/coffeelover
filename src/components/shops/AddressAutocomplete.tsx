import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin } from "lucide-react";

export interface AddressSuggestion {
  display: string;
  lat: number;
  lng: number;
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSelect: (s: AddressSuggestion) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Lightweight address autocomplete backed by OpenStreetMap Nominatim.
 * No API key required. Debounced + abortable.
 */
export const AddressAutocomplete = ({
  value,
  onChange,
  onSelect,
  placeholder = "Start typing an address…",
  className,
}: Props) => {
  const [items, setItems] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = value.trim();
    if (q.length < 3) {
      setItems([]);
      setLoading(false);
      return;
    }
    const t = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&q=${encodeURIComponent(q)}`,
          { signal: ctrl.signal, headers: { Accept: "application/json" } },
        );
        const data = await res.json();
        setItems(
          (data as any[]).map((d) => ({
            display: d.display_name as string,
            lat: parseFloat(d.lat),
            lng: parseFloat(d.lon),
          })),
        );
        setOpen(true);
      } catch (e) {
        if ((e as Error).name !== "AbortError") setItems([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [value]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={wrapRef} className={`relative ${className ?? ""}`}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          maxLength={250}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => items.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="pl-9"
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>
      {open && items.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-md border bg-popover p-1 text-sm shadow-md">
          {items.map((s, i) => (
            <li key={`${s.lat}-${s.lng}-${i}`}>
              <button
                type="button"
                className="w-full rounded px-2 py-2 text-left hover:bg-accent"
                onClick={() => {
                  onChange(s.display);
                  onSelect(s);
                  setOpen(false);
                }}
              >
                {s.display}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete;
