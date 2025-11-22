import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Coffee, MapPin, Wifi, Croissant, UtensilsCrossed } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Shop {
  id: number;
  name: string;
  lat: number;
  lng: number;
  rating: number;
  type: "veggie" | "bakery" | "coffee_shop" | "roaster_shop";
  hasWifi?: boolean;
  hasBakery?: boolean;
  hasOutdoor?: boolean;
}

interface ShopMapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShopMapModal = ({ open, onOpenChange }: ShopMapModalProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const navigate = useNavigate();
  const markersRef = useRef<L.Marker[]>([]);
  
  const [filters, setFilters] = useState({
    veggie: true,
    bakery: true,
    coffee_shop: true,
    roaster_shop: true,
  });

  // Real NYC locations with different shop types
  const shops: Shop[] = [
    { id: 1, name: "Artisan Coffee House", lat: 40.7589, lng: -73.9851, rating: 4.8, type: "coffee_shop", hasWifi: true },
    { id: 2, name: "The Bean Scene", lat: 40.7614, lng: -73.9776, rating: 4.6, type: "coffee_shop", hasOutdoor: true },
    { id: 3, name: "Roast & Toast", lat: 40.7489, lng: -73.9680, rating: 4.9, type: "roaster_shop", hasBakery: true },
    { id: 4, name: "Urban Brew", lat: 40.7549, lng: -73.9840, rating: 4.7, type: "coffee_shop", hasWifi: true },
    { id: 5, name: "Green Leaf Café", lat: 40.7505, lng: -73.9934, rating: 4.5, type: "veggie", hasWifi: true, hasOutdoor: true },
    { id: 6, name: "Brooklyn Roastery", lat: 40.7400, lng: -73.9900, rating: 4.9, type: "roaster_shop" },
    { id: 7, name: "Pastry & Pour", lat: 40.7650, lng: -73.9700, rating: 4.7, type: "bakery", hasBakery: true },
    { id: 8, name: "Vegan Vibes Coffee", lat: 40.7520, lng: -73.9750, rating: 4.6, type: "veggie", hasWifi: true },
  ];

  // Create custom coffee icons with different colors
  const getShopIcon = (type: Shop["type"]) => {
    const colors = {
      veggie: "#10b981",
      bakery: "#f59e0b",
      coffee_shop: "#8B4513",
      roaster_shop: "#ef4444",
    };

    return L.divIcon({
      className: "custom-coffee-marker",
      html: `
        <div style="
          background-color: ${colors[type]};
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <line x1="6" x2="6" y1="1" y2="4"></line>
            <line x1="10" x2="10" y1="1" y2="4"></line>
            <line x1="14" x2="14" y1="1" y2="4"></line>
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  useEffect(() => {
    if (!open || !mapContainer.current || map.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current).setView([40.7589, -73.9851], 13);

    // Add tile layer (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Add markers for each shop with colored icons
    updateMarkers();

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [open]);

  // Update markers when filters change
  useEffect(() => {
    if (map.current) {
      updateMarkers();
    }
  }, [filters]);

  const updateMarkers = () => {
    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Filter shops based on selected filters
    const filteredShops = shops.filter((shop) => filters[shop.type]);

    // Add markers for filtered shops
    filteredShops.forEach((shop) => {
      const marker = L.marker([shop.lat, shop.lng], { icon: getShopIcon(shop.type) }).addTo(map.current!);
      markersRef.current.push(marker);

      // Add popup with clickable content
      const popupContent = `
        <div style="padding: 8px; cursor: pointer;" class="shop-popup" data-shop-id="${shop.id}">
          <h3 style="font-weight: bold; margin-bottom: 4px;">${shop.name}</h3>
          <p style="font-size: 14px; color: #666;">⭐ ${shop.rating}</p>
          <p style="font-size: 12px; color: #3b82f6; margin-top: 4px;">Click to view profile →</p>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      
      // Handle marker click
      marker.on('click', () => {
        onOpenChange(false);
        navigate(`/shop/${shop.id}`);
      });
      
      // Handle popup click
      marker.on('popupopen', () => {
        const popupElement = document.querySelector(`[data-shop-id="${shop.id}"]`);
        if (popupElement) {
          popupElement.addEventListener('click', () => {
            onOpenChange(false);
            navigate(`/shop/${shop.id}`);
          });
        }
      });
    });
  };

  const handleFilterChange = (type: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const filteredShops = shops.filter((shop) => filters[shop.type]);

  const getShopTypeLabel = (type: Shop["type"]) => {
    const labels = {
      veggie: "Vegan Café",
      bakery: "Bakery",
      coffee_shop: "Coffee Shop",
      roaster_shop: "Roastery",
    };
    return labels[type];
  };

  const getShopTypeColor = (type: Shop["type"]) => {
    const colors = {
      veggie: "text-green-600",
      bakery: "text-amber-600",
      coffee_shop: "text-[#8B4513]",
      roaster_shop: "text-red-600",
    };
    return colors[type];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95vw] max-w-full h-[95vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Coffee className="w-5 h-5" />
            Coffee Shops Map
          </DialogTitle>
        </DialogHeader>
        
        {/* Filters */}
        <div className="px-6 pb-4 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="veggie"
              checked={filters.veggie}
              onCheckedChange={() => handleFilterChange("veggie")}
            />
            <Label htmlFor="veggie" className="text-sm font-medium cursor-pointer flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-600" />
              Vegan Cafés
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="bakery"
              checked={filters.bakery}
              onCheckedChange={() => handleFilterChange("bakery")}
            />
            <Label htmlFor="bakery" className="text-sm font-medium cursor-pointer flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-amber-600" />
              Bakeries
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="coffee_shop"
              checked={filters.coffee_shop}
              onCheckedChange={() => handleFilterChange("coffee_shop")}
            />
            <Label htmlFor="coffee_shop" className="text-sm font-medium cursor-pointer flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#8B4513" }} />
              Coffee Shops
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="roaster_shop"
              checked={filters.roaster_shop}
              onCheckedChange={() => handleFilterChange("roaster_shop")}
            />
            <Label htmlFor="roaster_shop" className="text-sm font-medium cursor-pointer flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-600" />
              Roasteries
            </Label>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <div ref={mapContainer} className="absolute inset-0" />
        </div>

        {/* Bottom Drawer */}
        <Drawer open={true}>
          <DrawerContent className="h-[40vh]">
            <DrawerHeader>
              <DrawerTitle>Coffee Shops ({filteredShops.length})</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredShops.map((shop) => (
                  <Card
                    key={shop.id}
                    className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      onOpenChange(false);
                      navigate(`/shop/${shop.id}`);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getShopTypeColor(shop.type)} bg-opacity-10`}>
                        <Coffee className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{shop.name}</h3>
                        <p className={`text-xs ${getShopTypeColor(shop.type)} font-medium`}>
                          {getShopTypeLabel(shop.type)}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-sm">⭐</span>
                          <span className="text-sm font-medium">{shop.rating}</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {shop.hasWifi && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Wifi className="w-3 h-3" />
                            </div>
                          )}
                          {shop.hasBakery && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Croissant className="w-3 h-3" />
                            </div>
                          )}
                          {shop.hasOutdoor && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <UtensilsCrossed className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </DialogContent>
    </Dialog>
  );
};

export default ShopMapModal;
