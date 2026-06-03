import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal } from "lucide-react";
import { AMENITIES, type AmenityKey } from "@/lib/shopAmenities";

export interface RoasterFilterValues {
  maxDistanceKm: number;
  minRating: number;
  minReviews: number;
  freeShippingOnly: boolean;
  discountsOnly: boolean;
  amenities: Partial<Record<AmenityKey, boolean>>;
}

export const DEFAULT_ROASTER_FILTERS: RoasterFilterValues = {
  maxDistanceKm: 12000,
  minRating: 0,
  minReviews: 0,
  freeShippingOnly: false,
  discountsOnly: false,
  amenities: {},
};

interface Props {
  value: RoasterFilterValues;
  onChange: (v: RoasterFilterValues) => void;
  activeCount: number;
}

export const RoasterFilters = ({ value, onChange, activeCount }: Props) => {
  const update = (patch: Partial<RoasterFilterValues>) => onChange({ ...value, ...patch });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 rounded-full bg-primary px-2 text-xs font-medium text-primary-foreground">{activeCount}</span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
        <SheetHeader className="text-left"><SheetTitle>Filter roasters</SheetTitle></SheetHeader>

        <div className="space-y-6 py-4">
          <section className="space-y-2">
            <Label className="text-sm font-semibold">Commerce</Label>
            <label className="flex items-center gap-2 rounded-lg border p-2 text-sm">
              <Checkbox checked={value.freeShippingOnly} onCheckedChange={(c) => update({ freeShippingOnly: !!c })} />
              Free shipping only
            </label>
            <label className="flex items-center gap-2 rounded-lg border p-2 text-sm">
              <Checkbox checked={value.discountsOnly} onCheckedChange={(c) => update({ discountsOnly: !!c })} />
              Has discount coupons
            </label>
          </section>

          <section className="space-y-2">
            <Label className="text-sm font-semibold">Amenities</Label>
            <div className="grid grid-cols-2 gap-2">
              {AMENITIES.map((a) => {
                const Icon = a.icon;
                const checked = !!value.amenities[a.key];
                return (
                  <label key={a.key} className="flex items-center gap-2 rounded-lg border p-2 text-sm">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(c) => update({ amenities: { ...value.amenities, [a.key]: !!c || undefined } })}
                    />
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{a.short}</span>
                  </label>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Max distance</Label>
              <span className="text-sm text-muted-foreground">{value.maxDistanceKm} km</span>
            </div>
            <Slider value={[value.maxDistanceKm]} min={1} max={12000} step={100} onValueChange={([v]) => update({ maxDistanceKm: v })} />
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Min rating</Label>
              <span className="text-sm text-muted-foreground">{value.minRating.toFixed(1)} ★</span>
            </div>
            <Slider value={[value.minRating]} min={0} max={5} step={0.5} onValueChange={([v]) => update({ minRating: v })} />
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Min reviews</Label>
              <span className="text-sm text-muted-foreground">{value.minReviews}+</span>
            </div>
            <Slider value={[value.minReviews]} min={0} max={300} step={10} onValueChange={([v]) => update({ minReviews: v })} />
          </section>

          <Button variant="outline" className="w-full" onClick={() => onChange(DEFAULT_ROASTER_FILTERS)}>
            Reset filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RoasterFilters;
