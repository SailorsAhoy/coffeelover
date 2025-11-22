import { useState } from "react";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ShopMapModal from "@/components/ShopMapModal";
import ShopCard from "@/components/ShopCard";

const Shops = () => {
  const [mapOpen, setMapOpen] = useState(false);
  
  const mockShops = [
    {
      id: 1,
      name: "Artisan Coffee House",
      description: "Cozy spot with artisanal brews",
      rating: 4.8,
      distance: "0.5 km",
      hasWifi: true,
      hasBakery: true,
      hasOutdoor: false,
      phone: "+1234567890",
      whatsapp: "+1234567890",
      website: "https://example.com",
      email: "info@artisan.com",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      latitude: 40.7589,
      longitude: -73.9851,
      openingHours: {
        monday: { open: "07:00", close: "20:00" },
        tuesday: { open: "07:00", close: "20:00" },
        wednesday: { open: "07:00", close: "20:00" },
        thursday: { open: "07:00", close: "20:00" },
        friday: { open: "07:00", close: "22:00" },
        saturday: { open: "08:00", close: "22:00" },
        sunday: { open: "08:00", close: "18:00" },
      },
    },
    {
      id: 2,
      name: "The Bean Scene",
      description: "Modern cafe with outdoor seating",
      rating: 4.6,
      distance: "1.2 km",
      hasWifi: true,
      hasBakery: false,
      hasOutdoor: true,
      phone: "+1234567891",
      website: "https://example.com",
      email: "info@beanscene.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      latitude: 40.7614,
      longitude: -73.9776,
      openingHours: {
        monday: { open: "06:00", close: "19:00" },
        tuesday: { open: "06:00", close: "19:00" },
        wednesday: { open: "06:00", close: "19:00" },
        thursday: { open: "06:00", close: "19:00" },
        friday: { open: "06:00", close: "21:00" },
        saturday: { open: "07:00", close: "21:00" },
        sunday: { closed: true },
      },
    },
    {
      id: 3,
      name: "Roast & Toast",
      description: "Family-friendly coffee shop",
      rating: 4.9,
      distance: "2.1 km",
      hasWifi: true,
      hasBakery: true,
      hasOutdoor: true,
      phone: "+1234567892",
      whatsapp: "+1234567892",
      website: "https://example.com",
      email: "info@roasttoast.com",
      facebook: "https://facebook.com",
      latitude: 40.7489,
      longitude: -73.9680,
      openingHours: {
        monday: { open: "07:00", close: "21:00" },
        tuesday: { open: "07:00", close: "21:00" },
        wednesday: { open: "07:00", close: "21:00" },
        thursday: { open: "07:00", close: "21:00" },
        friday: { open: "07:00", close: "23:00" },
        saturday: { open: "08:00", close: "23:00" },
        sunday: { open: "08:00", close: "20:00" },
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Coffee Shops</h1>
            <p className="text-muted-foreground">Discover specialty coffee shops near you</p>
          </div>
          <Button onClick={() => setMapOpen(true)} className="gap-2">
            <Map className="w-4 h-4" />
            View Map
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Search shops..." className="md:col-span-2" />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">Nearest</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </div>

      <ShopMapModal open={mapOpen} onOpenChange={setMapOpen} />
    </div>
  );
};

export default Shops;
