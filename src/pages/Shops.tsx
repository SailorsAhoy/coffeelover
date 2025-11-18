import { useState } from "react";
import { MapPin, Star, Wifi, Croissant, TreePine, Map } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ShopMapModal from "@/components/ShopMapModal";

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
            <Card key={shop.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>{shop.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {shop.rating}
                  </Badge>
                </CardTitle>
                <CardDescription>{shop.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  {shop.distance} away
                </div>
                <div className="flex flex-wrap gap-2">
                  {shop.hasWifi && (
                    <Badge variant="outline">
                      <Wifi className="w-3 h-3 mr-1" />
                      WiFi
                    </Badge>
                  )}
                  {shop.hasBakery && (
                    <Badge variant="outline">
                      <Croissant className="w-3 h-3 mr-1" />
                      Bakery
                    </Badge>
                  )}
                  {shop.hasOutdoor && (
                    <Badge variant="outline">
                      <TreePine className="w-3 h-3 mr-1" />
                      Outdoor
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <ShopMapModal open={mapOpen} onOpenChange={setMapOpen} />
    </div>
  );
};

export default Shops;
