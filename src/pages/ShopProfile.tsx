import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, ChevronLeft, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getShopWithOverrides,
  subscribeShopOverrides,
  type Shop,
} from "@/lib/shopsData";
import { AMENITIES } from "@/lib/shopAmenities";
import ShopReviews from "@/components/shops/ShopReviews";
import ShopEditSheet from "@/components/shops/ShopEditSheet";
import ShopBanner from "@/components/shops/ShopBanner";
import ShopGallery from "@/components/shops/ShopGallery";
import ShopStaff from "@/components/shops/ShopStaff";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const ShopProfile = () => {
  const { id } = useParams();
  const { can } = useCurrentUser();
  const [shop, setShop] = useState<Shop | undefined>(() =>
    getShopWithOverrides(id ?? "1"),
  );

  useEffect(() => {
    setShop(getShopWithOverrides(id ?? "1"));
    return subscribeShopOverrides(() => setShop(getShopWithOverrides(id ?? "1")));
  }, [id]);

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
      <div className="sticky top-0 z-20 flex items-center justify-between border-b bg-background/95 px-3 py-2 backdrop-blur">
        <Link to="/shops">
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" /> Shops
          </Button>
        </Link>
        {can("list_shop") && <ShopEditSheet shop={shop} />}
      </div>

      <ShopBanner shop={shop} />

      <div className="mx-auto max-w-3xl space-y-4 px-4 py-4 md:px-6">
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
            <ShopStaff staff={shop.staff ?? []} />
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
