import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [tokenSet, setTokenSet] = useState(false);

  // Mock shop locations
  const shops: Shop[] = [
    { id: 1, name: "Artisan Coffee House", lat: 40.7589, lng: -73.9851, rating: 4.8 },
    { id: 2, name: "The Bean Scene", lat: 40.7614, lng: -73.9776, rating: 4.6 },
    { id: 3, name: "Roast & Toast", lat: 40.7489, lng: -73.9680, rating: 4.9 },
    { id: 4, name: "Urban Brew", lat: 40.7549, lng: -73.9840, rating: 4.7 },
    { id: 5, name: "Espresso Bar", lat: 40.7505, lng: -73.9934, rating: 4.5 },
  ];

  useEffect(() => {
    if (!open || !mapContainer.current || !tokenSet || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-73.9851, 40.7589], // NYC coordinates
      zoom: 13,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add markers for each shop
    shops.forEach((shop) => {
      // Create custom marker element
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.width = "32px";
      el.style.height = "32px";
      el.style.cursor = "pointer";
      
      // Create coffee icon
      const icon = document.createElement("div");
      icon.style.backgroundColor = "#8B4513";
      icon.style.borderRadius = "50%";
      icon.style.width = "100%";
      icon.style.height = "100%";
      icon.style.display = "flex";
      icon.style.alignItems = "center";
      icon.style.justifyContent = "center";
      icon.style.border = "2px solid white";
      icon.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" x2="6" y1="1" y2="4"></line><line x1="10" x2="10" y1="1" y2="4"></line><line x1="14" x2="14" y1="1" y2="4"></line></svg>`;
      el.appendChild(icon);

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<div style="padding: 8px;">
          <h3 style="font-weight: bold; margin-bottom: 4px;">${shop.name}</h3>
          <p style="font-size: 14px; color: #666;">⭐ ${shop.rating}</p>
        </div>`
      );

      // Add marker to map
      new mapboxgl.Marker(el)
        .setLngLat([shop.lng, shop.lat])
        .setPopup(popup)
        .addTo(map.current!);
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [open, tokenSet, mapboxToken]);

  if (!tokenSet) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Mapbox Token</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To display the map, please enter your Mapbox public token. You can get one at{" "}
              <a
                href="https://mapbox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                mapbox.com
              </a>
            </p>
            <Input
              placeholder="pk.eyJ1Ijoi..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <button
              onClick={() => {
                if (mapboxToken.trim()) {
                  setTokenSet(true);
                }
              }}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Continue
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Coffee Shops Map</DialogTitle>
        </DialogHeader>
        <div className="flex-1 relative rounded-lg overflow-hidden">
          <div ref={mapContainer} className="absolute inset-0" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopMapModal;
