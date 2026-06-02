import { useRef, useState } from "react";
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
import { Plus, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import AddressAutocomplete from "@/components/shops/AddressAutocomplete";
import OpeningHoursEditor from "@/components/shops/OpeningHoursEditor";
import AffiliateLinksEditor from "@/components/shops/AffiliateLinksEditor";
import { AMENITIES, type AmenityKey } from "@/lib/shopAmenities";
import {
  addShop,
  SHOP_TYPE_LABEL,
  type AffiliateLink,
  type Amenities,
  type ShopType,
} from "@/lib/shopsData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { OpeningHours } from "@/lib/shopUtils";

interface Props {
  trigger?: React.ReactNode;
}

const optionalUrl = z
  .string()
  .trim()
  .max(500, "Max 500 characters")
  .refine((v) => v === "" || /^https?:\/\/\S+/i.test(v), "Must start with http(s)://")
  .optional()
  .or(z.literal(""));

const baseSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 chars").max(80, "Max 80 chars"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 chars")
    .max(280, "Max 280 chars"),
  bio: z.string().trim().max(2000, "Max 2000 chars").optional().or(z.literal("")),
  address: z.string().trim().min(5, "Address required").max(250, "Max 250 chars"),
});

const ownerSchema = baseSchema.extend({
  phone: z
    .string()
    .trim()
    .max(30)
    .refine((v) => v === "" || /^[+\d\s()-]{6,}$/.test(v), "Invalid phone")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .trim()
    .max(120)
    .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Invalid email")
    .optional()
    .or(z.literal("")),
  website: optionalUrl,
  instagram: optionalUrl,
  facebook: optionalUrl,
  twitter: optionalUrl,
  whatsapp: z.string().trim().max(30).optional().or(z.literal("")),
});

const MAX_IMG = 5 * 1024 * 1024;

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
  const { user, profile, can, isAuthenticated } = useCurrentUser();
  const isOwner = can("list_shop");

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [bio, setBio] = useState("");
  const [type, setType] = useState<ShopType>("coffee_shop");
  const [priceLevel, setPriceLevel] = useState<1 | 2 | 3 | 4>(2);
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState({ lat: 40.7589, lng: -73.9851 });
  const [amenities, setAmenities] = useState<Amenities>({});
  const [banner, setBanner] = useState<string | undefined>();
  const [avatar, setAvatar] = useState<string | undefined>();
  const bannerInput = useRef<HTMLInputElement>(null);
  const avatarInput = useRef<HTMLInputElement>(null);

  // owner-only
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");

  const reset = () => {
    setName("");
    setDescription("");
    setBio("");
    setType("coffee_shop");
    setPriceLevel(2);
    setAddress("");
    setAmenities({});
    setBanner(undefined);
    setAvatar(undefined);
    setPhone("");
    setWhatsapp("");
    setEmail("");
    setWebsite("");
    setInstagram("");
    setFacebook("");
    setTwitter("");
  };

  const toggle = (k: AmenityKey, v: boolean) =>
    setAmenities((a) => ({ ...a, [k]: v }));

  const onPickImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    set: (s: string | undefined) => void,
    label: string,
  ) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error(`${label}: must be an image`);
      return;
    }
    if (f.size > MAX_IMG) {
      toast.error(`${label}: max file size is 5MB`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set(String(reader.result));
    reader.onerror = () => toast.error(`${label}: failed to read file`);
    reader.readAsDataURL(f);
  };

  const submit = () => {
    const schema = isOwner ? ownerSchema : baseSchema;
    const parsed = schema.safeParse(
      isOwner
        ? {
            name,
            description,
            bio,
            address,
            phone,
            whatsapp,
            email,
            website,
            instagram,
            facebook,
            twitter,
          }
        : { name, description, bio, address },
    );
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (!coords || coords.lat === 0) {
      toast.error("Pick a valid address from the list");
      return;
    }
    addShop({
      name: parsed.data.name,
      description: parsed.data.description,
      bio: parsed.data.bio || undefined,
      type,
      lat: coords.lat,
      lng: coords.lng,
      address: parsed.data.address,
      priceLevel,
      baseRating: 0,
      baseReviewCount: 0,
      amenities,
      opening_hours: defaultHours,
      status: "pending",
      pendingReview: true,
      createdBy: user?.id,
      createdByName: profile?.name ?? user?.email ?? undefined,
      banner,
      avatar,
      ...(isOwner
        ? {
            phone: phone.trim() || undefined,
            whatsapp: whatsapp.trim() || undefined,
            email: email.trim() || undefined,
            website: website.trim() || undefined,
            instagram: instagram.trim() || undefined,
            facebook: facebook.trim() || undefined,
            twitter: twitter.trim() || undefined,
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
            <p className="text-[11px] text-muted-foreground">{name.length}/80</p>
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
            <p className="text-[11px] text-muted-foreground">
              {description.length}/280
            </p>
          </section>

          <section className="space-y-2">
            <Label>Bio (long-form)</Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={2000}
              rows={4}
              placeholder="Tell the story of the shop, beans sourcing, vibe…"
            />
            <p className="text-[11px] text-muted-foreground">
              {bio.length}/2000
            </p>
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

          <section className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Banner</Label>
              <input
                ref={bannerInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPickImage(e, setBanner, "Banner")}
              />
              {banner ? (
                <div className="relative h-20 w-full overflow-hidden rounded-md border">
                  <img src={banner} alt="banner" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setBanner(undefined)}
                    className="absolute right-1 top-1 rounded-full bg-background/90 p-0.5"
                    aria-label="Remove banner"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full gap-1"
                  onClick={() => bannerInput.current?.click()}
                >
                  <Upload className="h-3.5 w-3.5" /> Upload
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Avatar</Label>
              <input
                ref={avatarInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPickImage(e, setAvatar, "Avatar")}
              />
              {avatar ? (
                <div className="relative h-20 w-20 overflow-hidden rounded-full border">
                  <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setAvatar(undefined)}
                    className="absolute right-0 top-0 rounded-full bg-background/90 p-0.5"
                    aria-label="Remove avatar"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full gap-1"
                  onClick={() => avatarInput.current?.click()}
                >
                  <Upload className="h-3.5 w-3.5" /> Upload
                </Button>
              )}
            </div>
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
                  maxLength={30}
                />
                <Input
                  placeholder="WhatsApp number"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  inputMode="tel"
                  maxLength={30}
                />
                <Input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  inputMode="email"
                  maxLength={120}
                />
                <Input
                  placeholder="Website https://…"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  inputMode="url"
                  maxLength={500}
                />
                <Input
                  placeholder="Instagram URL"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  inputMode="url"
                  maxLength={500}
                />
                <Input
                  placeholder="Facebook URL"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  inputMode="url"
                  maxLength={500}
                />
                <Input
                  placeholder="Twitter/X URL"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  inputMode="url"
                  maxLength={500}
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

              <p className="rounded-md border bg-muted/40 p-2 text-[11px] text-muted-foreground">
                Submitting as{" "}
                <span className="font-medium text-foreground">
                  {profile?.name ?? user?.email}
                </span>
                . You'll be credited as the author on the shop profile.
              </p>
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
