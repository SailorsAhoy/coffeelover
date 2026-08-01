import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { MapPin, ExternalLink, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getShopWithOverrides,
  setShopStatus,
  subscribeShopOverrides,
  type Shop,
} from "@/lib/shopsData";
import { AMENITIES } from "@/lib/shopAmenities";
import ShopReviews from "@/components/shops/ShopReviews";
import ShopBanner from "@/components/shops/ShopBanner";
import ShopGallery from "@/components/shops/ShopGallery";
import ShopStaff from "@/components/shops/ShopStaff";
import ClaimButton from "@/components/listings/ClaimButton";
import LinkedListingButton from "@/components/listings/LinkedListingButton";
import CloneAcrossTypeButton from "@/components/listings/CloneAcrossTypeButton";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
import { getMyClaim, type ListingClaim } from "@/lib/claims";


const ShopProfile = () => {
  const { id } = useParams();
  const { hasRole } = useCurrentUser();
  const isAdmin = hasRole("admin");
  const [shop, setShop] = useState<Shop | undefined>(() =>
    getShopWithOverrides(id ?? "1"),
  );
  const [meta, setMeta] = useState<{ id: string; owner_user_id: string | null; linked_roaster_id: string | null } | null>(null);
  const [myClaim, setMyClaim] = useState<ListingClaim | null>(null);

  useEffect(() => {
    setShop(getShopWithOverrides(id ?? "1"));
    return subscribeShopOverrides(() => setShop(getShopWithOverrides(id ?? "1")));
  }, [id]);

  useEffect(() => {
    if (!shop?.reviewableId) return;
    (async () => {
      const { data } = await supabase
        .from("shops_public" as any)
        .select("id, owner_user_id, linked_roaster_id")
        .eq("id", shop.reviewableId)
        .maybeSingle();
      setMeta((data as any) ?? null);
      setMyClaim(await getMyClaim("shop", shop.reviewableId));
    })();
  }, [shop?.reviewableId]);



  if (!shop) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Shop not found.</p>
        <Link to="/shops" className="text-primary underline">
          Back to shops
        </Link>
      </div>
    );
  }

  const activeAmenities = AMENITIES.filter((a) => shop.amenities[a.key]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Helmet>
        <title>{shop.name} | CoffeePlanets</title>
        <meta property="og:title" content={`${shop.name} | CoffeePlanets`} />
        <meta property="og:description" content={shop.description} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: shop.name,
          description: shop.description,
          address: shop.address ? { "@type": "PostalAddress", streetAddress: shop.address } : undefined,
          geo: shop.lat && shop.lng ? { "@type": "GeoCoordinates", latitude: shop.lat, longitude: shop.lng } : undefined,
          image: (shop as any).image || (shop as any).bannerUrl || undefined,
          url: typeof window !== "undefined" ? window.location.href : undefined,
        })}</script>
      </Helmet>
      <ShopBanner shop={shop} />

      <div className="mx-auto max-w-3xl space-y-4 px-4 py-4 md:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <ClaimButton type="shop" listingId={shop.reviewableId} />
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
          {meta?.linked_roaster_id && <LinkedListingButton kind="roaster" id={meta.linked_roaster_id} />}
          {meta && (
            <CloneAcrossTypeButton source="shop" sourceId={meta.id} ownerUserId={meta.owner_user_id} alreadyLinkedId={meta.linked_roaster_id} />
          )}
        </div>

        {(shop.status === "pending" || shop.pendingReview) && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-amber-500/50 bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  Under review
                </Badge>
                <span className="text-xs text-muted-foreground">
                  This shop is awaiting admin verification.
                </span>
              </div>
              {isAdmin && (
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={() => {
                      setShopStatus(shop.id, "approved");
                      toast.success("Shop approved");
                    }}
                  >
                    <Check className="h-3 w-3" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-xs"
                    onClick={() => {
                      setShopStatus(shop.id, "rejected");
                      toast.error("Shop rejected");
                    }}
                  >
                    <X className="h-3 w-3" /> Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {shop.status === "rejected" && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
            <Badge variant="destructive">Rejected</Badge>
            {isAdmin && (
              <Button
                size="sm"
                variant="outline"
                className="ml-2 h-7 text-xs"
                onClick={() => setShopStatus(shop.id, "pending")}
              >
                Re-open for review
              </Button>
            )}
          </div>
        )}


        <Card>
          <CardContent className="space-y-2 pt-4">
            <p className="text-sm text-muted-foreground">{shop.description}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{shop.address}</span>
            </div>
            {activeAmenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeAmenities.map((a) => {
                  const Icon = a.icon;
                  return (
                    <Badge key={a.key} variant="outline" className="gap-1">
                      <Icon className="h-3 w-3" /> {a.short}
                    </Badge>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <ShopGallery shopId={shop.id} />
          </CardContent>
        </Card>

        {shop.affiliateLinks && shop.affiliateLinks.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Order & shop online</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {shop.affiliateLinks.map((l) => (
                  <li key={l.id}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="flex items-center justify-between rounded-lg border bg-muted/30 p-3 text-sm transition-colors hover:bg-accent"
                    >
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
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="hours">Hours</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="bio" className="mt-3">
            <Card>
              <CardContent className="space-y-3 pt-4 text-sm leading-relaxed">
                <p>{shop.bio ?? shop.description}</p>
                {activeAmenities.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Amenities</h4>
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {AMENITIES.map((a) => {
                        const Icon = a.icon;
                        const on = !!shop.amenities[a.key];
                        return (
                          <li
                            key={a.key}
                            className={`flex items-center gap-2 rounded-md border p-2 text-sm ${
                              on ? "" : "opacity-40"
                            }`}
                          >
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span>{a.label}</span>
                            {on && (
                              <Badge
                                variant="secondary"
                                className="ml-auto h-5 px-1.5 text-[10px]"
                              >
                                Yes
                              </Badge>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="mt-3">
            <ShopStaff shopId={shop.id} />
          </TabsContent>


          <TabsContent value="hours" className="mt-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Opening hours</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {Object.entries(shop.opening_hours).map(([day, h]) => (
                    <li
                      key={day}
                      className="flex justify-between border-b border-dashed py-1 last:border-0"
                    >
                      <span className="capitalize text-muted-foreground">
                        {day}
                      </span>
                      <span>{h.closed ? "Closed" : `${h.open} – ${h.close}`}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-3">
            <ShopReviews
              reviewableId={shop.reviewableId}
              shopId={shop.id}
              fallbackRating={shop.baseRating}
              fallbackCount={shop.baseReviewCount}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ShopProfile;
