import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import AddressAutocomplete from "@/components/shops/AddressAutocomplete";
import { AMENITIES, type AmenityKey } from "@/lib/shopAmenities";
import {
  addShop,
  SHOP_TYPE_LABEL,
  type Amenities,
  type ShopType,
} from "@/lib/shopsData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { OpeningHours } from "@/lib/shopUtils";

interface Props {
  trigger?: React.ReactNode;
}

const schema = z.object({
  name: z.string().trim().min(2, "Name required").max(80),
  description: z.string().trim().min(5, "Tell us a bit about the shop").max(280),
  address: z.string().trim().min(5, "Address required").max(250),
});

const defaultHours: OpeningHours = {
  monday: { open: "08:00", close: "18:00" },
  tuesday: { open: "08:00", close: "18:00" },
  wednesday: { open: "08:00", close: "18:00" },
  thursday: { open: "08:00", close: "18:00" },
  friday: { open: "08:00", close: "18:00" },
  saturday: { open: "09:00", close: "18:00" },
  sunday: { open: "09:00", close: "16:00" },
};

export const ShopCreateSheet = ({ trigger }: Props) => {
  const { user, can, isAuthenticated } = useCurrentUser();
  const isOwner = can("list_shop");

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ShopType>("coffee_shop");
  const [priceLevel, setPriceLevel] = useState<1 | 2 | 3 | 4>(2);
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState({ lat: 40.7589, lng: -73.9851 });
  const [amenities, setAmenities] = useState<Amenities>({});

  // owner-only
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");

  const reset = () => {
    setName("");
    setDescription("");
    setType("coffee_shop");
    setPriceLevel(2);
    setAddress("");
    setAmenities({});
    setPhone("");
    setEmail("");
    setWebsite("");
    setInstagram("");
  };

  const toggle = (k: AmenityKey, v: boolean) =>
    setAmenities((a) => ({ ...a, [k]: v }));

  const submit = () => {
    const parsed = schema.safeParse({ name, description, address });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    addShop({
      name: parsed.data.name,
      description: parsed.data.description,
      type,
      lat: coords.lat,
      lng: coords.lng,
      address: parsed.data.address,
      priceLevel,
      baseRating: 0,
      baseReviewCount: 0,
      amenities,
      opening_hours: defaultHours,
      pendingReview: true,
      createdBy: user?.id,
      ...(isOwner
        ? {
            phone: phone.trim() || undefined,
            email: email.trim() || undefined,
            website: website.trim() || undefined,
            instagram: instagram.trim() || undefined,
          }
        : {}),
    });
    toast.success("Shop submitted! It will appear once an admin verifies it.");
    reset();
    setOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <Button
        size="sm"
        className="gap-1"
        onClick={() => toast.error("Sign in to add a shop")}
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Add shop</span>
      </Button>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isOwner ? "Add shop" : "Suggest shop"}
            </span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="max-h-[92vh] overflow-y-auto rounded-t-2xl"
      >
        <SheetHeader className="text-left">
          <SheetTitle>
            {isOwner ? "Add a new shop" : "Suggest a shop"}
          </SheetTitle>
          <p className="text-xs text-muted-foreground">
            Submissions are reviewed by our team before going live.
          </p>
        </SheetHeader>

        <div className="space-y-5 py-4">
          <section className="space-y-2">
            <Label>Shop name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              placeholder="e.g. Maya's Slow Bar"
            />
          </section>

          <section className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Type *</Label>
              <Select value={type} onValueChange={(v) => setType(v as ShopType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(SHOP_TYPE_LABEL) as ShopType[]).map((k) => (
                    <SelectItem key={k} value={k}>
                      {SHOP_TYPE_LABEL[k]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Price level</Label>
              <Select
                value={String(priceLevel)}
                onValueChange={(v) =>
                  setPriceLevel(Number(v) as 1 | 2 | 3 | 4)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {"$".repeat(n)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          <section className="space-y-2">
            <Label>Short description *</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={280}
              rows={3}
              placeholder="A one-liner about the vibe, beans or specialty…"
            />
          </section>

          <section className="space-y-2">
            <Label>Address *</Label>
            <AddressAutocomplete
              value={address}
              onChange={setAddress}
              onSelect={(s) => {
                setAddress(s.display);
                setCoords({ lat: s.lat, lng: s.lng });
              }}
            />
          </section>

          {isOwner && (
            <>
              <section className="space-y-3">
                <Label className="text-sm font-semibold">Contact</Label>
                <Input
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                />
                <Input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  inputMode="email"
                />
                <Input
                  placeholder="Website https://…"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  inputMode="url"
                />
                <Input
                  placeholder="Instagram URL"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  inputMode="url"
                />
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
            </>
          )}
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Submit for review</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ShopCreateSheet;
