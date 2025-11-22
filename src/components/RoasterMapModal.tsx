import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Coffee, Star, Truck, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Roaster {
  id: number;
  name: string;
  lat: number;
  lng: number;
  rating: number;
  specialty: "single_origin" | "blends" | "specialty_grade" | "direct_trade";
  freeShipping?: boolean;
  hasDiscounts?: boolean;
}

interface RoasterMapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RoasterMapModal = ({ open, onOpenChange }: RoasterMapModalProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const navigate = useNavigate();
  const markersRef = useRef<L.Marker[]>([]);
  
  const [filters, setFilters] = useState({
    single_origin: true,
    blends: true,
    specialty_grade: true,
    direct_trade: true,
  });

  // Real NYC locations with different roaster types
  const roasters: Roaster[] = [
    { id: 1, name: "Heritage Roasters", lat: 40.7589, lng: -73.9851, rating: 4.9, specialty: "single_origin", freeShipping: true, hasDiscounts: true },
    { id: 2, name: "Urban Bean Co.", lat: 40.7614, lng: -73.9776, rating: 4.8, specialty: "single_origin", freeShipping: false, hasDiscounts: true },
    { id: 3, name: "Modern Bean Co.", lat: 40.7489, lng: -73.9680, rating: 4.7, specialty: "blends", freeShipping: false, hasDiscounts: true },
    { id: 4, name: "Blend Masters", lat: 40.7400, lng: -73.9900, rating: 4.6, specialty: "blends", freeShipping: true, hasDiscounts: false },
    { id: 5, name: "Altitude Coffee", lat: 40.7505, lng: -73.9934, rating: 4.8, specialty: "specialty_grade", freeShipping: true, hasDiscounts: false },
    { id: 6, name: "Peak Roasters", lat: 40.7520, lng: -73.9750, rating: 4.9, specialty: "specialty_grade", freeShipping: true, hasDiscounts: true },
    { id: 7, name: "Direct Origin Co.", lat: 40.7650, lng: -73.9700, rating: 4.7, specialty: "direct_trade", freeShipping: false, hasDiscounts: true },
    { id: 8, name: "Farm to Cup Roasters", lat: 40.7549, lng: -73.9840, rating: 4.8, specialty: "direct_trade", freeShipping: true, hasDiscounts: false },
  ];

  // Create custom coffee icons with different colors
  const getRoasterIcon = (specialty: Roaster["specialty"]) => {
    const colors = {
      single_origin: "#8B4513",
      blends: "#D2691E",
      specialty_grade: "#CD853F",
      direct_trade: "#A0522D",
    };

    return L.divIcon({
      className: "custom-coffee-marker",
      html: `
        <div style="
          background-color: ${colors[specialty]};
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

    // Add markers for each roaster with colored icons
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

    // Filter roasters based on selected filters
    const filteredRoasters = roasters.filter((roaster) => filters[roaster.specialty]);

    // Add markers for filtered roasters
    filteredRoasters.forEach((roaster) => {
      const marker = L.marker([roaster.lat, roaster.lng], { icon: getRoasterIcon(roaster.specialty) }).addTo(map.current!);
      markersRef.current.push(marker);

      // Add popup with clickable content
      const popupContent = `
        <div style="padding: 8px; cursor: pointer;" class="roaster-popup" data-roaster-id="${roaster.id}">
          <h3 style="font-weight: bold; margin-bottom: 4px;">${roaster.name}</h3>
          <p style="font-size: 14px; color: #666;">⭐ ${roaster.rating}</p>
          <p style="font-size: 12px; color: #3b82f6; margin-top: 4px;">Click to view profile →</p>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      
      // Handle marker click
      marker.on('click', () => {
        onOpenChange(false);
        navigate(`/roaster/${roaster.id}`);
      });
      
      // Handle popup click
      marker.on('popupopen', () => {
        const popupElement = document.querySelector(`[data-roaster-id="${roaster.id}"]`);
        if (popupElement) {
          popupElement.addEventListener('click', () => {
            onOpenChange(false);
            navigate(`/roaster/${roaster.id}`);
          });
        }
      });
    });
  };

  const handleFilterChange = (type: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const filteredRoasters = roasters.filter((roaster) => filters[roaster.specialty]);

  const getSpecialtyLabel = (specialty: Roaster["specialty"]) => {
    const labels = {
      single_origin: "Single Origin",
      blends: "Blends",
      specialty_grade: "Specialty Grade",
      direct_trade: "Direct Trade",
    };
    return labels[specialty];
  };

  const getSpecialtyColor = (specialty: Roaster["specialty"]) => {
    const colors = {
      single_origin: "text-[#8B4513]",
      blends: "text-[#D2691E]",
      specialty_grade: "text-[#CD853F]",
      direct_trade: "text-[#A0522D]",
    };
    return colors[specialty];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95vw] max-w-full h-[95vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Coffee className="w-5 h-5" />
            Coffee Roasters Map
          </DialogTitle>
        </DialogHeader>
        
        {/* Filters */}
        <div className="px-6 pb-4 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="single_origin"
              checked={filters.single_origin}
              onCheckedChange={() => handleFilterChange("single_origin")}
            />
            <Label htmlFor="single_origin" className="text-sm font-medium cursor-pointer flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#8B4513" }} />
              Single Origin
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="blends"
              checked={filters.blends}
              onCheckedChange={() => handleFilterChange("blends")}
            />
            <Label htmlFor="blends" className="text-sm font-medium cursor-pointer flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#D2691E" }} />
              Blends
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="specialty_grade"
              checked={filters.specialty_grade}
              onCheckedChange={() => handleFilterChange("specialty_grade")}
            />
            <Label htmlFor="specialty_grade" className="text-sm font-medium cursor-pointer flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#CD853F" }} />
              Specialty Grade
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="direct_trade"
              checked={filters.direct_trade}
              onCheckedChange={() => handleFilterChange("direct_trade")}
            />
            <Label htmlFor="direct_trade" className="text-sm font-medium cursor-pointer flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#A0522D" }} />
              Direct Trade
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
              <DrawerTitle>Coffee Roasters ({filteredRoasters.length})</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRoasters.map((roaster) => (
                  <Card
                    key={roaster.id}
                    className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      onOpenChange(false);
                      navigate(`/roaster/${roaster.id}`);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getSpecialtyColor(roaster.specialty)} bg-opacity-10`}>
                        <Coffee className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{roaster.name}</h3>
                        <p className={`text-xs ${getSpecialtyColor(roaster.specialty)} font-medium`}>
                          {getSpecialtyLabel(roaster.specialty)}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 fill-current text-yellow-500" />
                          <span className="text-sm font-medium">{roaster.rating}</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {roaster.freeShipping && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Truck className="w-3 h-3" />
                            </div>
                          )}
                          {roaster.hasDiscounts && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Tag className="w-3 h-3" />
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

export default RoasterMapModal;
