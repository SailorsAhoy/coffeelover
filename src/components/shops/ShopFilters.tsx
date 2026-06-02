import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal } from "lucide-react";
import { SHOP_TYPE_LABEL, SHOP_TYPE_COLOR, ShopType } from "@/lib/shopsData";
import { AMENITIES, type AmenityKey } from "@/lib/shopAmenities";

export interface ShopFilterValues {
  types: Record<ShopType, boolean>;
  maxDistanceKm: number;
  maxPriceLevel: number;
  minRating: number;
  minReviews: number;
  amenities: Partial<Record<AmenityKey, boolean>>;
}

export const DEFAULT_FILTERS: ShopFilterValues = {
  types: { veggie: true, bakery: true, coffee_shop: true, roaster_shop: true },
  maxDistanceKm: 20,
  maxPriceLevel: 4,
  minRating: 0,
  minReviews: 0,
  amenities: {},
};

interface Props {
  value: ShopFilterValues;
  onChange: (v: ShopFilterValues) => void;
  activeCount: number;
}

export const ShopFilters = ({ value, onChange, activeCount }: Props) => {
  const update = (patch: Partial<ShopFilterValues>) =>
    onChange({ ...value, ...patch });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 rounded-full bg-primary px-2 text-xs font-medium text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
        <SheetHeader className="text-left">
          <SheetTitle>Filter shops</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-4">
          <section className="space-y-2">
            <Label className="text-sm font-semibold">Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(value.types) as ShopType[]).map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-2 rounded-lg border p-2 text-sm"
                >
                  <Checkbox
                    checked={value.types[t]}
                    onCheckedChange={(c) =>
                      update({ types: { ...value.types, [t]: !!c } })
                    }
                  />
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: SHOP_TYPE_COLOR[t] }}
                  />
                  <span>{SHOP_TYPE_LABEL[t]}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <Label className="text-sm font-semibold">Required amenities</Label>
            <div className="grid grid-cols-2 gap-2">
              {AMENITIES.map((a) => {
                const Icon = a.icon;
                const checked = !!value.amenities[a.key];
                return (
                  <label
                    key={a.key}
                    className="flex items-center gap-2 rounded-lg border p-2 text-sm"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(c) =>
                        update({
                          amenities: {
                            ...value.amenities,
                            [a.key]: !!c || undefined,
                          },
                        })
                      }
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
              <span className="text-sm text-muted-foreground">
                {value.maxDistanceKm} km
              </span>
            </div>
            <Slider
              value={[value.maxDistanceKm]}
              min={1}
              max={50}
              step={1}
              onValueChange={([v]) => update({ maxDistanceKm: v })}
            />
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Max price</Label>
              <span className="text-sm text-muted-foreground">
                {"$".repeat(value.maxPriceLevel)}
              </span>
            </div>
            <Slider
              value={[value.maxPriceLevel]}
              min={1}
              max={4}
              step={1}
              onValueChange={([v]) => update({ maxPriceLevel: v })}
            />
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Min rating</Label>
              <span className="text-sm text-muted-foreground">
                {value.minRating.toFixed(1)} ★
              </span>
            </div>
            <Slider
              value={[value.minRating]}
              min={0}
              max={5}
              step={0.5}
              onValueChange={([v]) => update({ minRating: v })}
            />
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Min reviews</Label>
              <span className="text-sm text-muted-foreground">
                {value.minReviews}+
              </span>
            </div>
            <Slider
              value={[value.minReviews]}
              min={0}
              max={300}
              step={10}
              onValueChange={([v]) => update({ minReviews: v })}
            />
          </section>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => onChange(DEFAULT_FILTERS)}
          >
            Reset filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShopFilters;
