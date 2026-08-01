import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { ExternalLink, Check, X, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getRoasterById, loadRoastersFromDb, setRoasterStatus, subscribeRoasters, type Roaster,
} from "@/lib/roastersData";
import { AMENITIES } from "@/lib/shopAmenities";
import RoasterBanner from "@/components/shops/RoasterBanner";
import ShopReviews from "@/components/shops/ShopReviews";
import ClaimButton from "@/components/listings/ClaimButton";
import LinkedListingButton from "@/components/listings/LinkedListingButton";
import CloneAcrossTypeButton from "@/components/listings/CloneAcrossTypeButton";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
import { getMyClaim, type ListingClaim } from "@/lib/claims";

interface Coffee {
  id: string;
  name: string;
  description: string | null;
  origin_country: string | null;
  price_per_kg: number | null;
  currency: string | null;
  image_url: string | null;
  affiliate_link: string | null;
}

const CURRENCY_SYMBOLS: Record<string, string> = { EUR: "€", USD: "$", GBP: "£", JPY: "¥" };
const formatPrice = (price: number, currency: string | null) => {
  const code = (currency || "EUR").toUpperCase();
  const sym = CURRENCY_SYMBOLS[code] ?? code + " ";
  return `${sym}${price.toFixed(2)} / kg`;
};

const stripRoasterPrefix = (name: string, roasterName: string) => {
  const seps = [" — ", " - ", " – "];
  for (const s of seps) {
    const prefix = roasterName + s;
    if (name.startsWith(prefix)) return name.slice(prefix.length);
  }
  return name;
};


const RoasterProfile = () => {
  const { id } = useParams();
  const { hasRole } = useCurrentUser();
  const isAdmin = hasRole("admin");
  const [roaster, setRoaster] = useState<Roaster | undefined>(() => getRoasterById(id));
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [myClaim, setMyClaim] = useState<ListingClaim | null>(null);
  const [loading, setLoading] = useState(!getRoasterById(id));

  useEffect(() => {
    const unsub = subscribeRoasters(() => setRoaster(getRoasterById(id)));
    if (!getRoasterById(id)) {
      loadRoastersFromDb().then(() => {
        setRoaster(getRoasterById(id));
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    return unsub;
  }, [id]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from("coffee_brands")
        .select("id, name, description, origin_country, price_per_kg, currency, image_url, affiliate_link")
        .eq("roaster_id", id);
      setCoffees(((data ?? []) as unknown) as Coffee[]);
      setMyClaim(await getMyClaim("roaster", id));
    })();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading…</div>;
  if (!roaster) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Roaster not found.</p>
        <Link to="/roasters" className="text-primary underline">Back to roasters</Link>
      </div>
    );
  }

  const activeAmenities = AMENITIES.filter((a) => roaster.amenities[a.key]);
  const hours = roaster.opening_hours ?? {};

  return (
    <div className="min-h-screen bg-background pb-24">
      <Helmet>
        <title>{roaster.name} | CoffeePlanets</title>
        <meta property="og:title" content={`${roaster.name} | CoffeePlanets`} />
        <meta property="og:description" content={roaster.description} />
      </Helmet>
      <RoasterBanner roaster={roaster} />

      <div className="mx-auto max-w-3xl space-y-4 px-4 py-4 md:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <ClaimButton type="roaster" listingId={roaster.id} requiredModule="roaster_listing" />
          {myClaim && (
            <Badge
              variant="outline"
              className={
                myClaim.status === "pending"
                  ? "border-amber-500/50 bg-amber-500/15 text-amber-700 dark:text-amber-300"
                  : myClaim.status === "approved"
                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "border-destructive/50 bg-destructive/15 text-destructive"
              }
            >
              Claim {myClaim.status}
            </Badge>
          )}
          {roaster.linkedShopId && <LinkedListingButton kind="shop" id={roaster.linkedShopId} />}
          <CloneAcrossTypeButton
            source="roaster" sourceId={roaster.id}
            ownerUserId={roaster.ownerUserId ?? null}
            alreadyLinkedId={roaster.linkedShopId ?? null}
          />
        </div>

        {(roaster.status === "pending" || roaster.pendingReview) && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-amber-500/50 bg-amber-500/20 text-amber-700 dark:text-amber-300">Under review</Badge>
                <span className="text-xs text-muted-foreground">This roaster is awaiting admin verification.</span>
              </div>
              {isAdmin && (
                <div className="flex gap-1.5">
                  <Button size="sm" className="h-7 gap-1 text-xs"
                    onClick={async () => { await setRoasterStatus(roaster.id, "approved"); toast.success("Roaster approved"); }}>
                    <Check className="h-3 w-3" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 gap-1 text-xs"
                    onClick={async () => { await setRoasterStatus(roaster.id, "rejected"); toast.error("Roaster rejected"); }}>
                    <X className="h-3 w-3" /> Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {roaster.status === "rejected" && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
            <Badge variant="destructive">Rejected</Badge>
            {isAdmin && (
              <Button size="sm" variant="outline" className="ml-2 h-7 text-xs"
                onClick={() => setRoasterStatus(roaster.id, "pending")}>
                Re-open for review
              </Button>
            )}
          </div>
        )}

        <Card>
          <CardContent className="space-y-2 pt-4">
            <p className="text-sm text-muted-foreground">{roaster.description}</p>
            {activeAmenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeAmenities.map((a) => {
                  const Icon = a.icon;
                  return (
                    <Badge key={a.key} variant="outline" className="gap-1"><Icon className="h-3 w-3" /> {a.short}</Badge>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {roaster.affiliateLinks && roaster.affiliateLinks.length > 0 && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Order & shop online</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {roaster.affiliateLinks.map((l, i) => (
                  <li key={l.id ?? i}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer sponsored"
                      className="flex items-center justify-between rounded-lg border bg-muted/30 p-3 text-sm transition-colors hover:bg-accent">
                      <span className="truncate font-medium">{l.label}</span>
                      <ExternalLink className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="bio" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bio">Bio</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="hours">Hours</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="bio" className="mt-3">
            <Card>
              <CardContent className="space-y-3 pt-4 text-sm leading-relaxed">
                <p>{roaster.bio ?? roaster.description ?? "No bio yet."}</p>
                {activeAmenities.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Amenities</h4>
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {AMENITIES.map((a) => {
                        const Icon = a.icon;
                        const on = !!roaster.amenities[a.key];
                        return (
                          <li key={a.key}
                            className={`flex items-center gap-2 rounded-md border p-2 text-sm ${on ? "" : "opacity-40"}`}>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span>{a.label}</span>
                            {on && <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-[10px]">Yes</Badge>}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="mt-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4" /> Coffees</CardTitle>
              </CardHeader>
              <CardContent>
                {coffees.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No coffees listed yet.</p>
                ) : (
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {coffees.map((c) => {
                      const displayName = stripRoasterPrefix(c.name, roaster.name);
                      const inner = (
                        <div className="overflow-hidden rounded-lg border h-full transition-colors hover:bg-accent">
                          {c.image_url && <img src={c.image_url} alt={displayName} className="h-32 w-full object-cover" />}
                          <div className="p-3">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-medium truncate">{displayName}</p>
                              {c.price_per_kg != null && (
                                <Badge variant="outline">{formatPrice(Number(c.price_per_kg), c.currency)}</Badge>
                              )}
                            </div>
                            {c.origin_country && <p className="text-xs text-muted-foreground">{c.origin_country}</p>}
                            {c.description && <p className="text-xs mt-1 line-clamp-2">{c.description}</p>}
                          </div>
                        </div>
                      );
                      return (
                        <li key={c.id}>
                          <Link to={`/coffee/${c.id}`}>{inner}</Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hours" className="mt-3">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Opening hours</CardTitle></CardHeader>
              <CardContent>
                {Object.keys(hours).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Not specified.</p>
                ) : (
                  <ul className="space-y-1 text-sm">
                    {Object.entries(hours).map(([day, h]) => (
                      <li key={day} className="flex justify-between border-b border-dashed py-1 last:border-0">
                        <span className="capitalize text-muted-foreground">{day}</span>
                        <span>{h?.closed ? "Closed" : `${h?.open ?? ""} – ${h?.close ?? ""}`}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-3">
            <ShopReviews
              reviewableId={roaster.id}
              reviewableType="roaster"
              shopId={undefined}
              fallbackRating={roaster.baseRating}
              fallbackCount={roaster.baseReviewCount}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RoasterProfile;
