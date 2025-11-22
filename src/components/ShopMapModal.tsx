import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Coffee } from "lucide-react";

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

  useEffect(() => {
    if (!open || !mapContainer.current || map.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current).setView([40.7589, -73.9851], 13);

    // Add tile layer (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map.current);

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

    // Add markers for each shop with colored icons
    shops.forEach((shop) => {
      const marker = L.marker([shop.lat, shop.lng], { icon: getShopIcon(shop.type) }).addTo(map.current!);

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

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coffee className="w-5 h-5" />
            Coffee Shops Map
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 relative rounded-lg overflow-hidden">
          <div ref={mapContainer} className="absolute inset-0" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopMapModal;
