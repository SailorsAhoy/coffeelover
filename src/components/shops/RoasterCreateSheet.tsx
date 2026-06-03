import { useRef, useState } from "react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import AddressAutocomplete from "@/components/shops/AddressAutocomplete";
import OpeningHoursEditor from "@/components/shops/OpeningHoursEditor";
import AffiliateLinksEditor from "@/components/shops/AffiliateLinksEditor";
import MapPreview from "@/components/shops/MapPreview";
import { AMENITIES, type AmenityKey } from "@/lib/shopAmenities";
import { addRoaster, type AffiliateLink, type Amenities } from "@/lib/roastersData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useFieldPermissions } from "@/hooks/useFieldPermissions";
import type { OpeningHours } from "@/lib/shopUtils";
import { affiliateLinkSchema, validateImageFile } from "@/lib/shopValidation";

const optionalUrl = z.string().trim().max(500)
  .refine((v) => v === "" || /^https?:\/\/\S+/i.test(v), "Must start with http(s)://")
  .optional().or(z.literal(""));

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 chars").max(80),
  description: z.string().trim().min(10, "Description must be at least 10 chars").max(280),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  address: z.string().trim().min(5, "Address required").max(250),
  phone: z.string().trim().max(30).refine((v) => v === "" || /^[+\d\s()-]{6,}$/.test(v), "Invalid phone").optional().or(z.literal("")),
  email: z.string().trim().max(120).refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Invalid email").optional().or(z.literal("")),
  website: optionalUrl, instagram: optionalUrl, facebook: optionalUrl, twitter: optionalUrl,
  whatsapp: z.string().trim().max(30).optional().or(z.literal("")),
});

const defaultHours: OpeningHours = {
  monday: { open: "09:00", close: "18:00" }, tuesday: { open: "09:00", close: "18:00" },
  wednesday: { open: "09:00", close: "18:00" }, thursday: { open: "09:00", close: "18:00" },
  friday: { open: "09:00", close: "18:00" }, saturday: { open: "10:00", close: "16:00" },
  sunday: { open: "00:00", close: "00:00", closed: true },
};

export const RoasterCreateSheet = ({ trigger }: { trigger?: React.ReactNode }) => {
  const { user, profile, can, isAuthenticated, hasRole } = useCurrentUser();
  const isOwner = can("list_roaster");
  const { canField } = useFieldPermissions("roaster");

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState<string | undefined>();
  const [coords, setCoords] = useState({ lat: 40.7589, lng: -73.9851 });
  const [addressPicked, setAddressPicked] = useState(false);
  const [amenities, setAmenities] = useState<Amenities>({});
  const [banner, setBanner] = useState<string | undefined>();
  const [avatar, setAvatar] = useState<string | undefined>();
  const bannerInput = useRef<HTMLInputElement>(null);
  const avatarInput = useRef<HTMLInputElement>(null);

  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [hours, setHours] = useState<OpeningHours>(defaultHours);
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [freeShipping, setFreeShipping] = useState(false);
  const [discounts, setDiscounts] = useState(false);

  const reset = () => {
    setName(""); setDescription(""); setBio(""); setAddress("");
    setCountry(undefined); setAddressPicked(false); setAmenities({});
    setBanner(undefined); setAvatar(undefined);
    setPhone(""); setWhatsapp(""); setEmail(""); setWebsite("");
    setInstagram(""); setFacebook(""); setTwitter("");
    setHours(defaultHours); setLinks([]); setFreeShipping(false); setDiscounts(false);
  };

  const toggle = (k: AmenityKey, v: boolean) => setAmenities((a) => ({ ...a, [k]: v }));

  const onPickImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    set: (s: string | undefined) => void,
    label: string,
  ) => {
    const f = e.target.files?.[0]; e.target.value = "";
    if (!f) return;
    const err = validateImageFile(f, label);
    if (err) return toast.error(err);
    const reader = new FileReader();
    reader.onload = () => set(String(reader.result));
    reader.readAsDataURL(f);
  };

  const submit = async () => {
    const parsed = schema.safeParse({ name, description, bio, address, phone, whatsapp, email, website, instagram, facebook, twitter });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    if (!addressPicked) return toast.error("Pick an address from the suggestions list");
    if (!country || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lng))
      return toast.error("Address is missing country or coordinates — re-pick a suggestion");

    const cleanLinks: AffiliateLink[] = [];
    for (const l of links) {
      if (!l.label && !l.url) continue;
      const r = affiliateLinkSchema.safeParse(l);
      if (!r.success) return toast.error(r.error.issues[0].message);
      cleanLinks.push({ ...l, label: r.data.label, url: r.data.url });
    }

    try {
      await addRoaster({
        name: parsed.data.name,
        description: parsed.data.description,
        bio: parsed.data.bio || undefined,
        lat: coords.lat, lng: coords.lng,
        address: parsed.data.address, country,
        amenities, opening_hours: hours, affiliateLinks: cleanLinks,
        status: "pending",
        createdBy: user?.id,
        createdByName: profile?.name ?? user?.email ?? undefined,
        createdByRole: hasRole("admin") ? "admin" : isOwner ? "owner" : "user",
        ownerUserId: isOwner ? user?.id : undefined,
        banner: canField("logo") || canField("banner") ? banner : undefined,
        avatar: canField("logo") || canField("avatar") ? avatar : undefined,
        phone: canField("phone") ? phone.trim() || undefined : undefined,
        whatsapp: canField("whatsapp") ? whatsapp.trim() || undefined : undefined,
        email: canField("email") ? email.trim() || undefined : undefined,
        website: canField("website") ? website.trim() || undefined : undefined,
        instagram: canField("instagram") ? instagram.trim() || undefined : undefined,
        facebook: canField("facebook") ? facebook.trim() || undefined : undefined,
        twitter: canField("twitter") ? twitter.trim() || undefined : undefined,
        offersFreeShipping: freeShipping,
        hasDiscountCoupons: discounts,
      });
    } catch (err) {
      return toast.error((err as Error).message || "Could not save roaster");
    }
    toast.success("Roaster submitted! It will appear once an admin verifies it.");
    reset(); setOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <Button size="sm" className="gap-1" onClick={() => toast.error("Sign in to add a roaster")}>
        <Plus className="h-4 w-4" /><span className="hidden sm:inline">Add roaster</span>
      </Button>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{isOwner ? "Add roaster" : "Suggest roaster"}</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-2xl">
        <SheetHeader className="text-left">
          <SheetTitle>{isOwner ? "Add a new roaster" : "Suggest a roaster"}</SheetTitle>
          <p className="text-xs text-muted-foreground">Submissions are reviewed before going live.</p>
        </SheetHeader>

        <div className="space-y-5 py-4">
          <section className="space-y-2">
            <Label>Roaster name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="e.g. Heritage Roasters" />
            <p className="text-[11px] text-muted-foreground">{name.length}/80</p>
          </section>

          <section className="space-y-2">
            <Label>Short description *</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={280} rows={3} placeholder="Single-origin specialists, direct trade, micro-lots…" />
            <p className="text-[11px] text-muted-foreground">{description.length}/280</p>
          </section>

          <section className="space-y-2">
            <Label>Bio (long-form)</Label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={2000} rows={4} placeholder="Tell the story of the roastery, sourcing, philosophy…" />
            <p className="text-[11px] text-muted-foreground">{bio.length}/2000</p>
          </section>

          <section className="space-y-2">
            <Label>Address *</Label>
            <AddressAutocomplete
              value={address}
              onChange={(v) => { setAddress(v); setAddressPicked(false); }}
              onSelect={(s) => { setAddress(s.display); setCoords({ lat: s.lat, lng: s.lng }); setCountry(s.country); setAddressPicked(true); }}
            />
            {addressPicked && (
              <p className="text-[11px] text-muted-foreground">
                {country ? `${country} · ` : ""}{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              </p>
            )}
            {!addressPicked && address.length >= 3 && (
              <p className="text-[11px] text-amber-600">Pick a suggestion to lock country & coordinates.</p>
            )}
            {addressPicked && country && <MapPreview lat={coords.lat} lng={coords.lng} />}
          </section>

          <section className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Banner</Label>
              <input ref={bannerInput} type="file" accept="image/*" className="hidden" onChange={(e) => onPickImage(e, setBanner, "Banner")} />
              {banner ? (
                <div className="relative h-20 w-full overflow-hidden rounded-md border">
                  <img src={banner} alt="banner" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => setBanner(undefined)} className="absolute right-1 top-1 rounded-full bg-background/90 p-0.5" aria-label="Remove banner"><X className="h-3 w-3" /></button>
                </div>
              ) : (
                <Button type="button" variant="outline" size="sm" className="w-full gap-1" onClick={() => bannerInput.current?.click()}>
                  <Upload className="h-3.5 w-3.5" /> Upload
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Logo</Label>
              <input ref={avatarInput} type="file" accept="image/*" className="hidden" onChange={(e) => onPickImage(e, setAvatar, "Logo")} />
              {avatar ? (
                <div className="relative h-20 w-20 overflow-hidden rounded-full border">
                  <img src={avatar} alt="logo" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => setAvatar(undefined)} className="absolute right-0 top-0 rounded-full bg-background/90 p-0.5" aria-label="Remove logo"><X className="h-3 w-3" /></button>
                </div>
              ) : (
                <Button type="button" variant="outline" size="sm" className="w-full gap-1" onClick={() => avatarInput.current?.click()}>
                  <Upload className="h-3.5 w-3.5" /> Upload
                </Button>
              )}
            </div>
          </section>

          <section className="space-y-3">
            <Label className="text-sm font-semibold">Contact</Label>
            <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" maxLength={30} />
            <Input placeholder="WhatsApp number" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} inputMode="tel" maxLength={30} />
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" maxLength={120} />
            <Input placeholder="Website https://…" value={website} onChange={(e) => setWebsite(e.target.value)} inputMode="url" maxLength={500} />
            <Input placeholder="Instagram URL" value={instagram} onChange={(e) => setInstagram(e.target.value)} inputMode="url" maxLength={500} />
            <Input placeholder="Facebook URL" value={facebook} onChange={(e) => setFacebook(e.target.value)} inputMode="url" maxLength={500} />
            <Input placeholder="Twitter/X URL" value={twitter} onChange={(e) => setTwitter(e.target.value)} inputMode="url" maxLength={500} />
          </section>

          <section className="space-y-3">
            <Label className="text-sm font-semibold">Commerce</Label>
            <label className="flex items-center justify-between rounded-lg border p-2.5">
              <span className="text-sm">Offers free shipping</span>
              <Switch checked={freeShipping} onCheckedChange={setFreeShipping} />
            </label>
            <label className="flex items-center justify-between rounded-lg border p-2.5">
              <span className="text-sm">Discount coupons</span>
              <Switch checked={discounts} onCheckedChange={setDiscounts} />
            </label>
          </section>

          <section className="space-y-3">
            <Label className="text-sm font-semibold">Amenities</Label>
            <div className="grid grid-cols-1 gap-2">
              {AMENITIES.map((a) => {
                const Icon = a.icon;
                return (
                  <label key={a.key} className="flex items-center justify-between rounded-lg border p-2.5">
                    <span className="flex items-center gap-2 text-sm"><Icon className="h-4 w-4 text-muted-foreground" />{a.label}</span>
                    <Switch checked={!!amenities[a.key]} onCheckedChange={(v) => toggle(a.key, v)} />
                  </label>
                );
              })}
            </div>
          </section>

          <section className="space-y-2">
            <Label className="text-sm font-semibold">Opening hours</Label>
            <OpeningHoursEditor value={hours} onChange={setHours} />
          </section>

          <section className="space-y-2">
            <Label className="text-sm font-semibold">Affiliate links</Label>
            <AffiliateLinksEditor value={links} onChange={setLinks} />
          </section>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit}>Submit</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RoasterCreateSheet;
