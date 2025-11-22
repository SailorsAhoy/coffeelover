import { useState } from "react";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RoasterMapModal from "@/components/RoasterMapModal";
import RoasterCard from "@/components/RoasterCard";

const Roasters = () => {
  const [mapOpen, setMapOpen] = useState(false);
  
  const mockRoasters = [
    {
      id: 1,
      name: "Heritage Roasters",
      description: "Traditional roasting methods since 1985",
      rating: 4.9,
      freeShipping: true,
      hasDiscounts: true,
      specialty: "Single Origin",
      phone: "+1234567890",
      whatsapp: "+1234567890",
      website: "https://example.com",
      email: "info@heritage.com",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      latitude: 40.7589,
      longitude: -73.9851,
      openingHours: {
        monday: { open: "08:00", close: "18:00" },
        tuesday: { open: "08:00", close: "18:00" },
        wednesday: { open: "08:00", close: "18:00" },
        thursday: { open: "08:00", close: "18:00" },
        friday: { open: "08:00", close: "19:00" },
        saturday: { open: "09:00", close: "17:00" },
        sunday: { closed: true },
      },
    },
    {
      id: 2,
      name: "Modern Bean Co.",
      description: "Innovative blends and sustainable sourcing",
      rating: 4.7,
      freeShipping: false,
      hasDiscounts: true,
      specialty: "Blends",
      phone: "+1234567891",
      website: "https://example.com",
      email: "info@modernbean.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      latitude: 40.7614,
      longitude: -73.9776,
      openingHours: {
        monday: { open: "07:00", close: "19:00" },
        tuesday: { open: "07:00", close: "19:00" },
        wednesday: { open: "07:00", close: "19:00" },
        thursday: { open: "07:00", close: "19:00" },
        friday: { open: "07:00", close: "20:00" },
        saturday: { open: "08:00", close: "20:00" },
        sunday: { open: "09:00", close: "17:00" },
      },
    },
    {
      id: 3,
      name: "Altitude Coffee",
      description: "High-altitude specialty beans",
      rating: 4.8,
      freeShipping: true,
      hasDiscounts: false,
      specialty: "Specialty Grade",
      phone: "+1234567892",
      whatsapp: "+1234567892",
      website: "https://example.com",
      email: "info@altitude.com",
      facebook: "https://facebook.com",
      latitude: 40.7489,
      longitude: -73.9680,
      openingHours: {
        monday: { open: "08:00", close: "17:00" },
        tuesday: { open: "08:00", close: "17:00" },
        wednesday: { open: "08:00", close: "17:00" },
        thursday: { open: "08:00", close: "17:00" },
        friday: { open: "08:00", close: "18:00" },
        saturday: { open: "09:00", close: "16:00" },
        sunday: { closed: true },
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Coffee Roasters</h1>
            <p className="text-muted-foreground">
              Explore premium coffee roasters and their offerings
            </p>
          </div>
          <Button onClick={() => setMapOpen(true)} className="gap-2">
            <Map className="w-4 h-4" />
            View Map
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Input placeholder="Search roasters..." className="flex-1" />
          <Button variant="outline">Filter</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockRoasters.map((roaster) => (
            <RoasterCard key={roaster.id} roaster={roaster} />
          ))}
        </div>
      </div>

      <RoasterMapModal open={mapOpen} onOpenChange={setMapOpen} />
    </div>
  );
};

export default Roasters;
