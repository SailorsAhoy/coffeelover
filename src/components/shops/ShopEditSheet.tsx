import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import AddressAutocomplete from "@/components/shops/AddressAutocomplete";
import { AMENITIES, type AmenityKey } from "@/lib/shopAmenities";
import {
  type AffiliateLink,
  type Shop,
  updateShopOverride,
} from "@/lib/shopsData";

interface Props {
  shop: Shop;
}

const linkSchema = z.object({
  label: z.string().trim().min(1, "Label required").max(60),
  url: z.string().trim().url("Must be a valid URL").max(500),
});

export const ShopEditSheet = ({ shop }: Props) => {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState(shop.address);
  const [coords, setCoords] = useState({ lat: shop.lat, lng: shop.lng });
  const [amenities, setAmenities] = useState({ ...shop.amenities });
  const [links, setLinks] = useState<AffiliateLink[]>(shop.affiliateLinks ?? []);

  useEffect(() => {
    if (open) {
      setAddress(shop.address);
      setCoords({ lat: shop.lat, lng: shop.lng });
      setAmenities({ ...shop.amenities });
      setLinks(shop.affiliateLinks ?? []);
    }
  }, [open, shop]);

  const toggle = (k: AmenityKey, v: boolean) =>
    setAmenities((a) => ({ ...a, [k]: v }));

  const addLink = () =>
    setLinks((l) => [
      ...l,
      { id: crypto.randomUUID(), label: "", url: "" },
    ]);

  const updateLink = (id: string, patch: Partial<AffiliateLink>) =>
    setLinks((l) => l.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const removeLink = (id: string) =>
    setLinks((l) => l.filter((x) => x.id !== id));

  const save = () => {
    const cleaned: AffiliateLink[] = [];
    for (const l of links) {
      const result = linkSchema.safeParse(l);
      if (!result.success) {
        toast.error(`Affiliate link: ${result.error.issues[0].message}`);
        return;
      }
      cleaned.push({ ...l, label: result.data.label, url: result.data.url });
    }
    updateShopOverride(shop.id, {
      address: address.trim().slice(0, 250),
      lat: coords.lat,
      lng: coords.lng,
      amenities,
      affiliateLinks: cleaned,
    });
    toast.success("Shop details updated");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] overflow-y-auto rounded-t-2xl"
      >
        <SheetHeader className="text-left">
          <SheetTitle>Edit shop details</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 py-4">
          <section className="space-y-2">
            <Label className="text-sm font-semibold">Address</Label>
            <AddressAutocomplete
              value={address}
              onChange={setAddress}
              onSelect={(s) => {
                setAddress(s.display);
                setCoords({ lat: s.lat, lng: s.lng });
              }}
            />
            <p className="text-xs text-muted-foreground">
              Lat {coords.lat.toFixed(4)}, Lng {coords.lng.toFixed(4)}
            </p>
          </section>

          <section className="space-y-3">
            <Label className="text-sm font-semibold">Amenities</Label>
            <div className="grid grid-cols-1 gap-2">
              {AMENITIES.map((a) => {
                const Icon = a.icon;
                return (
                  <label
                    key={a.key}
                    className="flex items-center justify-between rounded-lg border p-2.5"
                  >
                    <span className="flex items-center gap-2 text-sm">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {a.label}
                    </span>
                    <Switch
                      checked={!!amenities[a.key]}
                      onCheckedChange={(v) => toggle(a.key, v)}
                    />
                  </label>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Affiliate links</Label>
              <Button size="sm" variant="ghost" className="gap-1" onClick={addLink}>
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>
            {links.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No links yet. Add delivery, online store or partner URLs.
              </p>
            )}
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.id} className="space-y-1 rounded-lg border p-2">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Label (e.g. Uber Eats)"
                      value={l.label}
                      maxLength={60}
                      onChange={(e) => updateLink(l.id, { label: e.target.value })}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeLink(l.id)}
                      aria-label="Remove link"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <Input
                    placeholder="https://…"
                    value={l.url}
                    maxLength={500}
                    onChange={(e) => updateLink(l.id, { url: e.target.value })}
                    inputMode="url"
                  />
                </li>
              ))}
            </ul>
          </section>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ShopEditSheet;
