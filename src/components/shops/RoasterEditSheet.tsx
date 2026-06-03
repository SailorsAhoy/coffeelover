import { useEffect, useRef, useState } from "react";
import {
  Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Pencil, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import AddressAutocomplete from "@/components/shops/AddressAutocomplete";
import OpeningHoursEditor from "@/components/shops/OpeningHoursEditor";
import AffiliateLinksEditor from "@/components/shops/AffiliateLinksEditor";
import MapPreview from "@/components/shops/MapPreview";
import { AMENITIES, type AmenityKey } from "@/lib/shopAmenities";
import { updateRoaster, type AffiliateLink, type Roaster } from "@/lib/roastersData";
import type { OpeningHours } from "@/lib/shopUtils";
import {
  affiliateLinkSchema as linkSchema,
  validateImageFile,
} from "@/lib/shopValidation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useFieldPermissions } from "@/hooks/useFieldPermissions";

const optionalUrl = z
  .string().trim().max(500)
  .refine((v) => v === "" || /^https?:\/\/\S+\.\S+/i.test(v), "Must be a valid http(s):// URL")
  .optional().or(z.literal(""));

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 chars").max(80),
  description: z.string().trim().min(10, "Description min 10 chars").max(280),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  address: z.string().trim().min(5).max(250),
  phone: z.string().trim().max(30).refine((v) => v === "" || /^[+\d\s()-]{6,}$/.test(v), "Invalid phone").optional().or(z.literal("")),
  whatsapp: z.string().trim().max(30).optional().or(z.literal("")),
  email: z.string().trim().max(120).refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Invalid email").optional().or(z.literal("")),
  website: optionalUrl,
  instagram: optionalUrl,
  facebook: optionalUrl,
  twitter: optionalUrl,
});

export const RoasterEditSheet = ({ roaster }: { roaster: Roaster }) => {
  const { can, hasRole, user } = useCurrentUser();
  const isAdmin = hasRole("admin");
  const isCreator = !!user && !!roaster.createdBy && roaster.createdBy === user.id;
  const isOwner = !!user && !!roaster.ownerUserId && roaster.ownerUserId === user.id;
  const canEdit = isAdmin || isOwner || isCreator || can("list_roaster");
  const { canField } = useFieldPermissions("roaster");
  const [open, setOpen] = useState(false);

  const [name, setName] = useState(roaster.name);
  const [description, setDescription] = useState(roaster.description);
  const [bio, setBio] = useState(roaster.bio ?? "");
  const [address, setAddress] = useState(roaster.address);
  const [country, setCountry] = useState<string | undefined>(roaster.country);
  const [coords, setCoords] = useState({ lat: roaster.lat, lng: roaster.lng });
  const [addressPicked, setAddressPicked] = useState(true);
  const [amenities, setAmenities] = useState({ ...roaster.amenities });
  const [hours, setHours] = useState<OpeningHours>(roaster.opening_hours);
  const [links, setLinks] = useState<AffiliateLink[]>(roaster.affiliateLinks ?? []);
  const [phone, setPhone] = useState(roaster.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(roaster.whatsapp ?? "");
  const [email, setEmail] = useState(roaster.email ?? "");
  const [website, setWebsite] = useState(roaster.website ?? "");
  const [instagram, setInstagram] = useState(roaster.instagram ?? "");
  const [facebook, setFacebook] = useState(roaster.facebook ?? "");
  const [twitter, setTwitter] = useState(roaster.twitter ?? "");
  const [banner, setBanner] = useState<string | undefined>(roaster.banner);
  const [avatar, setAvatar] = useState<string | undefined>(roaster.avatar);
  const [freeShipping, setFreeShipping] = useState(!!roaster.offersFreeShipping);
  const [discounts, setDiscounts] = useState(!!roaster.hasDiscountCoupons);
  const bannerInput = useRef<HTMLInputElement>(null);
  const avatarInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setName(roaster.name); setDescription(roaster.description); setBio(roaster.bio ?? "");
    setAddress(roaster.address); setCountry(roaster.country);
    setCoords({ lat: roaster.lat, lng: roaster.lng }); setAddressPicked(true);
    setAmenities({ ...roaster.amenities }); setHours(roaster.opening_hours);
    setLinks(roaster.affiliateLinks ?? []);
    setPhone(roaster.phone ?? ""); setWhatsapp(roaster.whatsapp ?? "");
    setEmail(roaster.email ?? ""); setWebsite(roaster.website ?? "");
    setInstagram(roaster.instagram ?? ""); setFacebook(roaster.facebook ?? "");
    setTwitter(roaster.twitter ?? "");
    setBanner(roaster.banner); setAvatar(roaster.avatar);
    setFreeShipping(!!roaster.offersFreeShipping); setDiscounts(!!roaster.hasDiscountCoupons);
  }, [open, roaster]);

  const toggle = (k: AmenityKey, v: boolean) =>
    setAmenities((a) => ({ ...a, [k]: v }));

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

  const save = async () => {
    if (!canEdit) return toast.error("You don't have permission to edit this roaster");
    const parsed = schema.safeParse({ name, description, bio, address, phone, whatsapp, email, website, instagram, facebook, twitter });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    if (!addressPicked) return toast.error("Address changed — pick a suggestion to refresh country & coordinates");
    if (!country || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lng))
      return toast.error("Address is missing country or coordinates");

    const cleaned: AffiliateLink[] = [];
    for (const l of links) {
      if (!l.label && !l.url) continue;
      const r = linkSchema.safeParse(l);
      if (!r.success) return toast.error(`Affiliate link: ${r.error.issues[0].message}`);
      cleaned.push({ ...l, label: r.data.label, url: r.data.url });
    }

    try {
      await updateRoaster(roaster.id, {
        name: parsed.data.name,
        description: parsed.data.description,
        bio: parsed.data.bio || undefined,
        address: parsed.data.address,
        country, lat: coords.lat, lng: coords.lng,
        amenities, opening_hours: hours, affiliateLinks: cleaned,
        phone: phone.trim() || undefined,
        whatsapp: whatsapp.trim() || undefined,
        email: email.trim() || undefined,
        website: website.trim() || undefined,
        instagram: instagram.trim() || undefined,
        facebook: facebook.trim() || undefined,
        twitter: twitter.trim() || undefined,
        banner, avatar,
        offersFreeShipping: freeShipping,
        hasDiscountCoupons: discounts,
      });
    } catch (err) {
      return toast.error((err as Error).message || "Could not save roaster");
    }
    toast.success("Roaster updated");
    setOpen(false);
  };

  if (!canEdit) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-2xl">
        <SheetHeader className="text-left"><SheetTitle>Edit roaster details</SheetTitle></SheetHeader>

        <div className="space-y-5 py-4">
          <section className="space-y-2">
            <Label>Roaster name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
          </section>

          <section className="space-y-2">
            <Label>Short description *</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={280} rows={3} />
            <p className="text-[11px] text-muted-foreground">{description.length}/280</p>
          </section>

          <section className="space-y-2">
            <Label>Bio</Label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={2000} rows={4} />
            <p className="text-[11px] text-muted-foreground">{bio.length}/2000</p>
          </section>

          <section className="space-y-2">
            <Label>Address *</Label>
            <AddressAutocomplete
              value={address}
              onChange={(v) => { setAddress(v); setAddressPicked(false); }}
              onSelect={(s) => { setAddress(s.display); setCoords({ lat: s.lat, lng: s.lng }); setCountry(s.country); setAddressPicked(true); }}
            />
            <p className="text-xs text-muted-foreground">
              {country ? `${country} · ` : ""}Lat {coords.lat.toFixed(4)}, Lng {coords.lng.toFixed(4)}
            </p>
            {!addressPicked && (<p className="text-[11px] text-amber-600">Pick a suggestion to lock country & coordinates.</p>)}
            {addressPicked && country && Number.isFinite(coords.lat) && (<MapPreview lat={coords.lat} lng={coords.lng} />)}
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
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save}>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default RoasterEditSheet;
