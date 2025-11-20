import { useEffect, useRef } from "react";
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
}

interface ShopMapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShopMapModal = ({ open, onOpenChange }: ShopMapModalProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  // Mock shop locations
  const shops: Shop[] = [
    { id: 1, name: "Artisan Coffee House", lat: 40.7589, lng: -73.9851, rating: 4.8 },
    { id: 2, name: "The Bean Scene", lat: 40.7614, lng: -73.9776, rating: 4.6 },
    { id: 3, name: "Roast & Toast", lat: 40.7489, lng: -73.9680, rating: 4.9 },
    { id: 4, name: "Urban Brew", lat: 40.7549, lng: -73.9840, rating: 4.7 },
    { id: 5, name: "Espresso Bar", lat: 40.7505, lng: -73.9934, rating: 4.5 },
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

    // Create custom coffee icon
    const coffeeIcon = L.divIcon({
      className: "custom-coffee-marker",
      html: `
        <div style="
          background-color: #8B4513;
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

    // Add markers for each shop
    shops.forEach((shop) => {
      const marker = L.marker([shop.lat, shop.lng], { icon: coffeeIcon }).addTo(map.current!);

      // Add popup
      marker.bindPopup(`
        <div style="padding: 8px;">
          <h3 style="font-weight: bold; margin-bottom: 4px;">${shop.name}</h3>
          <p style="font-size: 14px; color: #666;">⭐ ${shop.rating}</p>
        </div>
      `);
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
