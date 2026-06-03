import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  List, Map as MapIcon, Star, MapPin, Navigation, Search, LocateFixed,
  Check, X, User as UserIcon, Truck, Tag,
} from "lucide-react";
import {
  ROASTERS, loadRoastersFromDb, subscribeRoasters, setRoasterStatus, type Roaster,
} from "@/lib/roastersData";
import { AMENITIES, type AmenityKey } from "@/lib/shopAmenities";
import { haversineKm } from "@/lib/geo";
import { isShopOpen } from "@/lib/shopUtils";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useReviewAggregates } from "@/hooks/useReviewAggregates";
import RoasterFilters, { DEFAULT_ROASTER_FILTERS, type RoasterFilterValues } from "@/components/RoasterFilters";
import RoastersMapView from "@/components/shops/RoastersMapView";
import RoasterCreateSheet from "@/components/shops/RoasterCreateSheet";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type SortKey = "distance" | "new" | "rating" | "reviews" | "name";
type StatusTab = "approved" | "pending" | "all";

const DEFAULT_CENTER = { lat: 40.7589, lng: -73.9851 };
const ROASTER_COLOR = "#C48B28";

const Roasters = () => {
  const { coords, loading: geoLoading, request } = useGeolocation(false);
  const [locatorActive, setLocatorActive] = useState(false);
  const { hasRole } = useCurrentUser();
  const isAdmin = hasRole("admin");

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<RoasterFilterValues>(DEFAULT_ROASTER_FILTERS);
  const [sort, setSort] = useState<SortKey>("rating");
  const [view, setView] = useState<"list" | "map">("list");
  const [statusTab, setStatusTab] = useState<StatusTab>("approved");
  const [, force] = useState(0);

  useEffect(() => subscribeRoasters(() => force((n) => n + 1)), []);
  useEffect(() => { loadRoastersFromDb(); }, []);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const activeCoords = locatorActive ? coords : null;

  const toggleLocator = () => {
    if (locatorActive) {
      setLocatorActive(false);
      if (sort === "distance") setSort("rating");
    } else {
      setLocatorActive(true);
      request();
      setSort("distance");
    }
  };

  const roasters: Roaster[] = ROASTERS();

  const fallback = useMemo(
    () => Object.fromEntries(roasters.map((r) => [r.id, { rating: r.baseRating, reviewCount: r.baseReviewCount }])),
    [roasters],
  );
  const aggs = useReviewAggregates(roasters.map((r) => r.id), "roaster", fallback);

  const enriched = useMemo(() => {
    return roasters.map((r) => {
      const a = aggs[r.id] ?? fallback[r.id];
      const ref = activeCoords ?? DEFAULT_CENTER;
      const distanceKm = haversineKm(ref, { lat: r.lat, lng: r.lng });
      return { ...r, ...a, distanceKm };
    });
  }, [roasters, aggs, activeCoords, fallback]);

  const requiredAmenities = (Object.keys(filters.amenities) as AmenityKey[]).filter((k) => filters.amenities[k]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enriched
      .filter((r) => {
        const isPending = r.status === "pending" || r.pendingReview;
        if (statusTab === "approved") return !isPending && r.status !== "rejected";
        if (statusTab === "pending") return isPending;
        return r.status !== "rejected";
      })
      .filter((r) => (filters.freeShippingOnly ? !!r.offersFreeShipping : true))
      .filter((r) => (filters.discountsOnly ? !!r.hasDiscountCoupons : true))
      .filter((r) => r.rating >= filters.minRating)
      .filter((r) => r.reviewCount >= filters.minReviews)
      .filter((r) => (!activeCoords || r.distanceKm == null ? true : r.distanceKm <= filters.maxDistanceKm))
      .filter((r) => requiredAmenities.every((k) => r.amenities[k]))
      .filter((r) =>
        !q ||
        r.name.toLowerCase().includes(q) ||
        (r.address ?? "").toLowerCase().includes(q) ||
        (r.country ?? "").toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
      )
      .sort((a, b) => {
        switch (sort) {
          case "rating": return b.rating - a.rating;
          case "reviews": return b.reviewCount - a.reviewCount;
          case "name": return a.name.localeCompare(b.name);
          case "new": return a.id < b.id ? 1 : -1;
          case "distance":
          default:
            if (!activeCoords) return b.rating - a.rating;
            return (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity);
        }
      });
  }, [enriched, filters, search, sort, requiredAmenities, statusTab, activeCoords]);

  const activeFilterCount =
    (filters.maxDistanceKm !== DEFAULT_ROASTER_FILTERS.maxDistanceKm ? 1 : 0) +
    (filters.minRating !== DEFAULT_ROASTER_FILTERS.minRating ? 1 : 0) +
    (filters.minReviews !== DEFAULT_ROASTER_FILTERS.minReviews ? 1 : 0) +
    (filters.freeShippingOnly ? 1 : 0) +
    (filters.discountsOnly ? 1 : 0) +
    requiredAmenities.length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 border-b bg-background/95 px-4 pt-4 pb-3 backdrop-blur md:px-6">
        <div className="mx-auto max-w-5xl space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">Coffee Roasters</h1>
              <p className="text-xs text-muted-foreground md:text-sm">
                {activeCoords
                  ? `${filtered.length} near you`
                  : `${filtered.length} roaster${filtered.length === 1 ? "" : "s"} · enable location to sort by distance`}
              </p>
            </div>
            <RoasterCreateSheet />
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name, country…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <RoasterFilters value={filters} onChange={setFilters} activeCount={activeFilterCount} />
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="h-9 w-[140px] text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="distance" disabled={!activeCoords}>Nearest{!activeCoords ? " (enable locator)" : ""}</SelectItem>
                <SelectItem value="new">Newest</SelectItem>
                <SelectItem value="rating">Top rated</SelectItem>
                <SelectItem value="reviews">Most reviewed</SelectItem>
                <SelectItem value="name">Name A–Z</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={locatorActive ? "default" : "ghost"} size="sm"
              onClick={toggleLocator} disabled={geoLoading} className="gap-1"
              aria-pressed={locatorActive}
              title={locatorActive ? "Locator on — sorting by nearest" : "Use my location"}
            >
              <LocateFixed className="h-4 w-4" />
            </Button>
          </div>

          <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as StatusTab)}>
            <TabsList className="h-8">
              <TabsTrigger value="approved" className="h-7 text-xs">Approved</TabsTrigger>
              <TabsTrigger value="pending" className="h-7 text-xs">Under review</TabsTrigger>
              {isAdmin && <TabsTrigger value="all" className="h-7 text-xs">All</TabsTrigger>}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-4 md:px-6">
        <Tabs value={view} onValueChange={(v) => setView(v as "list" | "map")}>
          <TabsList className="grid w-full grid-cols-2 md:w-64">
            <TabsTrigger value="list" className="gap-2"><List className="h-4 w-4" />List</TabsTrigger>
            <TabsTrigger value="map" className="gap-2"><MapIcon className="h-4 w-4" />Map</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4">
            {filtered.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">No roasters yet. Add one above to get started.</p>
            ) : (
              <ul className="space-y-3">
                {filtered.map((r) => {
                  const open = isShopOpen(r.opening_hours);
                  const activeAmenities = AMENITIES.filter((a) => r.amenities[a.key]);
                  return (
                    <li key={r.id}>
                      <Link to={`/roaster/${r.id}`}>
                        <Card className="transition-shadow hover:shadow-md active:scale-[0.99]">
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ROASTER_COLOR }} />
                                  <h3 className="truncate font-semibold">{r.name}</h3>
                                </div>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  Roaster{r.country ? ` · ${r.country}` : ""}
                                </p>
                                <div className="mt-1 flex items-center gap-2 text-xs">
                                  {r.pendingReview ? (
                                    <Badge variant="outline" className="h-5 border-amber-500/40 bg-amber-500/10 px-1.5 text-amber-700 dark:text-amber-400">Under review</Badge>
                                  ) : (
                                    <Badge variant={open ? "default" : "secondary"} className="h-5 px-1.5">{open ? "Open" : "Closed"}</Badge>
                                  )}
                                  <span className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="h-3 w-3" />{r.distanceKm.toFixed(1)} km
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1 shrink-0">
                                <div className="flex items-center gap-1 text-sm font-semibold">
                                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />{r.rating.toFixed(1)}
                                </div>
                                <span className="text-[11px] text-muted-foreground">{r.reviewCount} reviews</span>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                              {r.offersFreeShipping && (
                                <Badge variant="outline" className="h-5 gap-1 px-1.5 text-[11px]"><Truck className="h-3 w-3" /> Free ship</Badge>
                              )}
                              {r.hasDiscountCoupons && (
                                <Badge variant="outline" className="h-5 gap-1 px-1.5 text-[11px]"><Tag className="h-3 w-3" /> Discounts</Badge>
                              )}
                              {activeAmenities.slice(0, 4).map((a) => {
                                const Icon = a.icon;
                                return (
                                  <Badge key={a.key} variant="outline" className="h-5 gap-1 px-1.5 text-[11px]">
                                    <Icon className="h-3 w-3" /> {a.short}
                                  </Badge>
                                );
                              })}
                              {activeAmenities.length > 4 && (
                                <span className="text-[11px] text-muted-foreground">+{activeAmenities.length - 4}</span>
                              )}
                              <Button size="sm" variant="ghost" className="ml-auto h-6 px-2 text-[11px]"
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.open(`https://www.google.com/maps/search/?api=1&query=${r.lat},${r.lng}`, "_blank");
                                }}>
                                <Navigation className="mr-1 h-3 w-3" />Directions
                              </Button>
                            </div>
                            {isAdmin && (r.status === "pending" || r.pendingReview) && (
                              <div className="mt-2 flex gap-2 border-t pt-2">
                                <Button size="sm" variant="default" className="h-7 flex-1 gap-1 text-xs"
                                  onClick={(e) => { e.preventDefault(); setRoasterStatus(r.id, "approved"); }}>
                                  <Check className="h-3 w-3" /> Approve
                                </Button>
                                <Button size="sm" variant="outline" className="h-7 flex-1 gap-1 text-xs"
                                  onClick={(e) => { e.preventDefault(); setRoasterStatus(r.id, "rejected"); }}>
                                  <X className="h-3 w-3" /> Reject
                                </Button>
                              </div>
                            )}
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
            <RoastersMapView roasters={filtered} center={activeCoords ?? DEFAULT_CENTER} userLocation={activeCoords} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Roasters;
