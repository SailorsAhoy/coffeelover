import { useMemo, useState } from "react";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RoasterMapModal from "@/components/RoasterMapModal";
import RoasterCard from "@/components/RoasterCard";

const hours = (open: string, close: string) => ({
  monday: { open, close }, tuesday: { open, close }, wednesday: { open, close },
  thursday: { open, close }, friday: { open, close }, saturday: { open, close },
  sunday: { closed: true },
});

const mockRoasters = [
  { id: 1, name: "Heritage Roasters", description: "Traditional roasting since 1985", rating: 4.9, freeShipping: true, hasDiscounts: true, specialty: "Single Origin", country: "USA", phone: "+12125550101", whatsapp: "+12125550101", website: "https://example.com", email: "info@heritage.com", facebook: "https://facebook.com", instagram: "https://instagram.com", latitude: 40.7589, longitude: -73.9851, openingHours: hours("08:00", "18:00") },
  { id: 2, name: "Modern Bean Co.", description: "Innovative blends, sustainable sourcing", rating: 4.7, freeShipping: false, hasDiscounts: true, specialty: "Blends", country: "USA", phone: "+12125550102", website: "https://example.com", email: "info@modernbean.com", instagram: "https://instagram.com", twitter: "https://twitter.com", latitude: 40.7614, longitude: -73.9776, openingHours: hours("07:00", "19:00") },
  { id: 3, name: "Altitude Coffee", description: "High-altitude specialty beans", rating: 4.8, freeShipping: true, hasDiscounts: false, specialty: "Specialty Grade", country: "Colombia", phone: "+5712345678", whatsapp: "+5712345678", website: "https://example.com", email: "info@altitude.com", facebook: "https://facebook.com", latitude: 4.7110, longitude: -74.0721, openingHours: hours("08:00", "17:00") },
  { id: 4, name: "Brooklyn Roast & Shop", description: "Brooklyn-roasted small batches", rating: 4.6, freeShipping: false, hasDiscounts: true, specialty: "Single Origin", country: "USA", phone: "+17185550104", website: "https://example.com", email: "hello@brooklynroast.com", instagram: "https://instagram.com", latitude: 40.6782, longitude: -73.9442, openingHours: hours("07:30", "18:30") },
  { id: 5, name: "Andes Origin", description: "Direct trade from Peruvian highlands", rating: 4.5, freeShipping: true, hasDiscounts: false, specialty: "Direct Trade", country: "Peru", phone: "+5114567890", whatsapp: "+5114567890", website: "https://example.com", email: "info@andesorigin.com", latitude: -12.0464, longitude: -77.0428, openingHours: hours("08:00", "17:00") },
  { id: 6, name: "Sakura Coffee Works", description: "Japanese precision, single-origin focus", rating: 4.9, freeShipping: false, hasDiscounts: false, specialty: "Single Origin", country: "Japan", phone: "+81312345678", website: "https://example.com", email: "info@sakura.coffee", instagram: "https://instagram.com", latitude: 35.6762, longitude: 139.6503, openingHours: hours("09:00", "20:00") },
  { id: 7, name: "Café del Sol", description: "Mediterranean blends, family-run", rating: 4.4, freeShipping: true, hasDiscounts: true, specialty: "Blends", country: "Spain", phone: "+34912345678", whatsapp: "+34912345678", website: "https://example.com", email: "hola@cafedelsol.es", facebook: "https://facebook.com", latitude: 40.4168, longitude: -3.7038, openingHours: hours("08:00", "20:00") },
  { id: 8, name: "Highland Roasters", description: "Scottish craft roastery", rating: 4.6, freeShipping: false, hasDiscounts: true, specialty: "Dark Roasts", country: "UK", phone: "+441312345678", website: "https://example.com", email: "info@highland.coffee", latitude: 55.9533, longitude: -3.1883, openingHours: hours("08:00", "18:00") },
  { id: 9, name: "Addis Beans", description: "Ethiopian heritage, washed and natural", rating: 4.8, freeShipping: true, hasDiscounts: false, specialty: "Single Origin", country: "Ethiopia", phone: "+251111234567", whatsapp: "+251111234567", website: "https://example.com", email: "hello@addisbeans.et", instagram: "https://instagram.com", latitude: 9.0320, longitude: 38.7469, openingHours: hours("07:00", "19:00") },
  { id: 10, name: "Berlin Bean Lab", description: "Experimental ferments and micro-lots", rating: 4.7, freeShipping: false, hasDiscounts: true, specialty: "Micro-lots", country: "Germany", phone: "+493012345678", website: "https://example.com", email: "lab@berlinbean.de", twitter: "https://twitter.com", latitude: 52.5200, longitude: 13.4050, openingHours: hours("09:00", "20:00") },
  { id: 11, name: "Roma Espresso Lab", description: "Classic Italian espresso, dark and bold", rating: 4.5, freeShipping: true, hasDiscounts: false, specialty: "Espresso", country: "Italy", phone: "+390612345678", website: "https://example.com", email: "info@romaespresso.it", facebook: "https://facebook.com", latitude: 41.9028, longitude: 12.4964, openingHours: hours("07:00", "21:00") },
  { id: 12, name: "Saigon Roast House", description: "Vietnamese robusta and arabica blends", rating: 4.3, freeShipping: false, hasDiscounts: true, specialty: "Blends", country: "Vietnam", phone: "+842812345678", whatsapp: "+842812345678", website: "https://example.com", email: "hello@saigonroast.vn", instagram: "https://instagram.com", latitude: 10.8231, longitude: 106.6297, openingHours: hours("06:30", "22:00") },
];

const SPECIALTIES = ["all", "Single Origin", "Blends", "Specialty Grade", "Direct Trade", "Dark Roasts", "Espresso", "Micro-lots"];

const Roasters = () => {
  const [mapOpen, setMapOpen] = useState(false);
  const [q, setQ] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [shippingOnly, setShippingOnly] = useState(false);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return mockRoasters.filter((r) => {
      if (specialty !== "all" && r.specialty !== specialty) return false;
      if (shippingOnly && !r.freeShipping) return false;
      if (!s) return true;
      return r.name.toLowerCase().includes(s) || r.description.toLowerCase().includes(s) || r.country.toLowerCase().includes(s);
    });
  }, [q, specialty, shippingOnly]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Coffee Roasters</h1>
            <p className="text-muted-foreground">Explore premium coffee roasters and their offerings</p>
          </div>
          <Button onClick={() => setMapOpen(true)} className="gap-2">
            <Map className="w-4 h-4" /> View Map
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <Input placeholder="Search roasters, country..." value={q} onChange={(e) => setQ(e.target.value)} className="flex-1" />
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger className="md:w-56"><SelectValue placeholder="Specialty" /></SelectTrigger>
            <SelectContent>
              {SPECIALTIES.map((s) => <SelectItem key={s} value={s}>{s === "all" ? "All specialties" : s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant={shippingOnly ? "default" : "outline"} onClick={() => setShippingOnly((v) => !v)}>
            Free shipping
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">{filtered.length} roaster{filtered.length === 1 ? "" : "s"}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((roaster) => <RoasterCard key={roaster.id} roaster={roaster} />)}
        </div>
      </div>

      <RoasterMapModal open={mapOpen} onOpenChange={setMapOpen} />
    </div>
  );
};

export default Roasters;
