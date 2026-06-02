import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  Star,
  Phone,
  Globe,
  Navigation,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getShopWithOverrides,
  subscribeShopOverrides,
  SHOP_TYPE_LABEL,
  SHOP_TYPE_COLOR,
  type Shop,
} from "@/lib/shopsData";
import { AMENITIES } from "@/lib/shopAmenities";
import { isShopOpen, getTodaySchedule } from "@/lib/shopUtils";
import ShopReviews from "@/components/shops/ShopReviews";
import ShopEditSheet from "@/components/shops/ShopEditSheet";
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

  const open = isShopOpen(shop.opening_hours);
  const schedule = getTodaySchedule(shop.opening_hours);
  const activeAmenities = AMENITIES.filter((a) => shop.amenities[a.key]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-3 py-2 backdrop-blur">
        <Link to="/shops">
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" /> Shops
          </Button>
        </Link>
        {can("list_shop") && <ShopEditSheet shop={shop} />}
      </div>

      <div className="mx-auto max-w-3xl space-y-4 px-4 py-4 md:px-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: SHOP_TYPE_COLOR[shop.type] }}
                  />
                  <span className="text-xs font-medium text-muted-foreground">
                    {SHOP_TYPE_LABEL[shop.type]} · {"$".repeat(shop.priceLevel)}
                  </span>
                </div>
                <h1 className="mt-1 text-2xl font-bold">{shop.name}</h1>
              </div>
              <Badge variant="secondary" className="shrink-0 gap-1">
                <Star className="h-3 w-3 fill-current" />
                {shop.baseRating}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{shop.description}</p>

            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{shop.address}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                <Badge variant={open ? "default" : "secondary"} className="h-5 px-1.5">
                  {open ? "Open" : "Closed"}
                </Badge>
                <span>{schedule}</span>
              </div>
            </div>

            {activeAmenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
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

            <div className="grid grid-cols-3 gap-2 pt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${shop.lat},${shop.lng}`,
                    "_blank",
                  )
                }
                className="gap-1"
              >
                <Navigation className="h-4 w-4" />
                Route
              </Button>
              {shop.phone && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(`tel:${shop.phone}`)}
                  className="gap-1"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
              )}
              {shop.website && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(shop.website, "_blank")}
                  className="gap-1"
                >
                  <Globe className="h-4 w-4" />
                  Site
                </Button>
              )}
            </div>
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

        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="mt-3">
            <ShopReviews
              reviewableId={shop.reviewableId}
              fallbackRating={shop.baseRating}
              fallbackCount={shop.baseReviewCount}
            />
          </TabsContent>

          <TabsContent value="details" className="mt-3 space-y-3">
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
                      <span className="capitalize text-muted-foreground">{day}</span>
                      <span>
                        {h.closed ? "Closed" : `${h.open} – ${h.close}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Amenities</CardTitle>
              </CardHeader>
              <CardContent>
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
                          <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-[10px]">
                            Yes
                          </Badge>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ShopProfile;
