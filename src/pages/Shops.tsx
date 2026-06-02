import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  List,
  Map as MapIcon,
  Star,
  MapPin,
  Wifi,
  Croissant,
  TreePine,
  Navigation,
  Plus,
  Search,
  LocateFixed,
} from "lucide-react";
import { SHOPS, SHOP_TYPE_LABEL, SHOP_TYPE_COLOR } from "@/lib/shopsData";
import { haversineKm, formatDistance } from "@/lib/geo";
import { isShopOpen } from "@/lib/shopUtils";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useReviewAggregates } from "@/hooks/useReviewAggregates";
import ShopFilters, {
  DEFAULT_FILTERS,
  type ShopFilterValues,
} from "@/components/shops/ShopFilters";
import ShopsMapView from "@/components/shops/ShopsMapView";
import { toast } from "sonner";

type SortKey = "distance" | "rating" | "reviews" | "price_asc" | "name";

const Shops = () => {
  const { can, isAuthenticated } = useCurrentUser();
  const { coords, loading: geoLoading, request } = useGeolocation(true);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ShopFilterValues>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("distance");
  const [view, setView] = useState<"list" | "map">("list");

  const fallback = useMemo(
    () =>
      Object.fromEntries(
        SHOPS.map((s) => [
          s.reviewableId,
          { rating: s.baseRating, reviewCount: s.baseReviewCount },
        ]),
      ),
    [],
  );
  const aggs = useReviewAggregates(
    SHOPS.map((s) => s.reviewableId),
    "coffee_shop",
    fallback,
  );

  const enriched = useMemo(() => {
    return SHOPS.map((s) => {
      const a = aggs[s.reviewableId] ?? fallback[s.reviewableId];
      const distanceKm = coords ? haversineKm(coords, { lat: s.lat, lng: s.lng }) : null;
      return { ...s, ...a, distanceKm };
    });
  }, [aggs, coords, fallback]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enriched
      .filter((s) => filters.types[s.type])
      .filter((s) => s.priceLevel <= filters.maxPriceLevel)
      .filter((s) => s.rating >= filters.minRating)
      .filter((s) => s.reviewCount >= filters.minReviews)
      .filter((s) =>
        s.distanceKm == null ? true : s.distanceKm <= filters.maxDistanceKm,
      )
      .filter(
        (s) =>
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q),
      )
      .sort((a, b) => {
        switch (sort) {
          case "rating":
            return b.rating - a.rating;
          case "reviews":
            return b.reviewCount - a.reviewCount;
          case "price_asc":
            return a.priceLevel - b.priceLevel;
          case "name":
            return a.name.localeCompare(b.name);
          case "distance":
          default:
            return (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity);
        }
      });
  }, [enriched, filters, search, sort]);

  const activeFilterCount =
    (filters.maxDistanceKm !== DEFAULT_FILTERS.maxDistanceKm ? 1 : 0) +
    (filters.maxPriceLevel !== DEFAULT_FILTERS.maxPriceLevel ? 1 : 0) +
    (filters.minRating !== DEFAULT_FILTERS.minRating ? 1 : 0) +
    (filters.minReviews !== DEFAULT_FILTERS.minReviews ? 1 : 0) +
    (Object.values(filters.types).filter((v) => !v).length > 0 ? 1 : 0);

  const handleSuggest = () => {
    if (!isAuthenticated) {
      toast.error("Sign in to suggest a shop");
      return;
    }
    toast.success("Thanks! Your suggestion was sent for review.");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Sticky mobile header */}
      <div className="sticky top-0 z-10 border-b bg-background/95 px-4 pt-4 pb-3 backdrop-blur md:px-6">
        <div className="mx-auto max-w-5xl space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">Coffee Shops</h1>
              <p className="text-xs text-muted-foreground md:text-sm">
                {coords
                  ? `${filtered.length} near you`
                  : "Enable location for distance"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {can("list_shop") && (
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">List shop</span>
                </Button>
              )}
              {can("suggest_shop") && !can("list_shop") && (
                <Button size="sm" variant="outline" className="gap-1" onClick={handleSuggest}>
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Suggest</span>
                </Button>
              )}
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, area…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ShopFilters value={filters} onChange={setFilters} activeCount={activeFilterCount} />
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="h-9 w-[140px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Nearest</SelectItem>
                <SelectItem value="rating">Top rated</SelectItem>
                <SelectItem value="reviews">Most reviewed</SelectItem>
                <SelectItem value="price_asc">Cheapest</SelectItem>
                <SelectItem value="name">Name A–Z</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={request}
              disabled={geoLoading}
              className="gap-1"
              aria-label="Refresh location"
            >
              <LocateFixed className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-4 md:px-6">
        <Tabs value={view} onValueChange={(v) => setView(v as "list" | "map")}>
          <TabsList className="grid w-full grid-cols-2 md:w-64">
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <MapIcon className="h-4 w-4" />
              Map
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4">
            {filtered.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No shops match your filters.
              </p>
            ) : (
              <ul className="space-y-3">
                {filtered.map((s) => {
                  const open = isShopOpen(s.opening_hours);
                  return (
                    <li key={s.id}>
                      <Link to={`/shop/${s.id}`}>
                        <Card className="transition-shadow hover:shadow-md active:scale-[0.99]">
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: SHOP_TYPE_COLOR[s.type] }}
                                  />
                                  <h3 className="truncate font-semibold">{s.name}</h3>
                                </div>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {SHOP_TYPE_LABEL[s.type]} · {"$".repeat(s.priceLevel)}
                                </p>
                                <div className="mt-1 flex items-center gap-2 text-xs">
                                  <Badge
                                    variant={open ? "default" : "secondary"}
                                    className="h-5 px-1.5"
                                  >
                                    {open ? "Open" : "Closed"}
                                  </Badge>
                                  <span className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    {formatDistance(s.distanceKm)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1 shrink-0">
                                <div className="flex items-center gap-1 text-sm font-semibold">
                                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                                  {s.rating.toFixed(1)}
                                </div>
                                <span className="text-[11px] text-muted-foreground">
                                  {s.reviewCount} reviews
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {s.hasWifi && (
                                <Badge variant="outline" className="h-5 gap-1 px-1.5 text-[11px]">
                                  <Wifi className="h-3 w-3" /> WiFi
                                </Badge>
                              )}
                              {s.hasBakery && (
                                <Badge variant="outline" className="h-5 gap-1 px-1.5 text-[11px]">
                                  <Croissant className="h-3 w-3" /> Bakery
                                </Badge>
                              )}
                              {s.hasOutdoor && (
                                <Badge variant="outline" className="h-5 gap-1 px-1.5 text-[11px]">
                                  <TreePine className="h-3 w-3" /> Outdoor
                                </Badge>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="ml-auto h-6 px-2 text-[11px]"
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.open(
                                    `https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`,
                                    "_blank",
                                  );
                                }}
                              >
                                <Navigation className="mr-1 h-3 w-3" />
                                Directions
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="map" className="mt-4">
            <ShopsMapView
              shops={filtered}
              center={coords ?? { lat: 40.7589, lng: -73.9851 }}
              userLocation={coords}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Shops;
