import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  Wifi,
  Croissant,
  TreePine,
  Star,
  Phone,
  Globe,
  Navigation,
  ChevronLeft,
  Pencil,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getShopById, SHOP_TYPE_LABEL, SHOP_TYPE_COLOR } from "@/lib/shopsData";
import { isShopOpen, getTodaySchedule } from "@/lib/shopUtils";
import ShopReviews from "@/components/shops/ShopReviews";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const ShopProfile = () => {
  const { id } = useParams();
  const shop = getShopById(id ?? "1");
  const { can } = useCurrentUser();

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

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-3 py-2 backdrop-blur">
        <Link to="/shops">
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" /> Shops
          </Button>
        </Link>
        {can("list_shop") && (
          <Button size="sm" variant="outline" className="gap-1">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        )}
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

            <div className="flex flex-wrap gap-2">
              {shop.hasWifi && (
                <Badge variant="outline" className="gap-1">
                  <Wifi className="h-3 w-3" /> WiFi
                </Badge>
              )}
              {shop.hasBakery && (
                <Badge variant="outline" className="gap-1">
                  <Croissant className="h-3 w-3" /> Bakery
                </Badge>
              )}
              {shop.hasOutdoor && (
                <Badge variant="outline" className="gap-1">
                  <TreePine className="h-3 w-3" /> Outdoor
                </Badge>
              )}
            </div>

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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ShopProfile;
