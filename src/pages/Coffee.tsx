import { useMemo, useState } from "react";
import { ShoppingCart, Star, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CoffeeItem {
  id: number;
  name: string;
  roaster: string;
  type: "Arabica" | "Robusta" | "Blend";
  roast: "Light" | "Medium" | "Dark";
  origin: string;
  price: number;
  rating: number;
}

const mockCoffees: CoffeeItem[] = [
  // Heritage Roasters — 4 variants across roasts/origins/price tiers
  { id: 1, name: "Ethiopian Yirgacheffe", roaster: "Heritage Roasters", type: "Arabica", roast: "Light", origin: "Ethiopia", price: 24.99, rating: 4.9 },
  { id: 4, name: "Kenya AA Nyeri", roaster: "Heritage Roasters", type: "Arabica", roast: "Medium", origin: "Kenya", price: 27.5, rating: 4.85 },
  { id: 13, name: "Heritage Dark Roast", roaster: "Heritage Roasters", type: "Blend", roast: "Dark", origin: "Brazil", price: 15.5, rating: 4.4 },
  { id: 14, name: "Yirgacheffe Reserve Micro-lot", roaster: "Heritage Roasters", type: "Arabica", roast: "Light", origin: "Ethiopia", price: 42.0, rating: 4.95 },

  // Modern Bean Co.
  { id: 2, name: "Colombian Supremo", roaster: "Modern Bean Co.", type: "Arabica", roast: "Medium", origin: "Colombia", price: 19.99, rating: 4.7 },
  { id: 15, name: "Modern Breakfast Blend", roaster: "Modern Bean Co.", type: "Blend", roast: "Medium", origin: "Colombia", price: 14.0, rating: 4.3 },
  { id: 16, name: "Huila Dark Reserve", roaster: "Modern Bean Co.", type: "Arabica", roast: "Dark", origin: "Colombia", price: 28.5, rating: 4.6 },
  { id: 17, name: "Narino Light Lot", roaster: "Modern Bean Co.", type: "Arabica", roast: "Light", origin: "Colombia", price: 33.0, rating: 4.8 },

  // Altitude Coffee
  { id: 3, name: "Sumatra Mandheling", roaster: "Altitude Coffee", type: "Arabica", roast: "Dark", origin: "Indonesia", price: 22.99, rating: 4.8 },
  { id: 18, name: "Sulawesi Toraja", roaster: "Altitude Coffee", type: "Arabica", roast: "Medium", origin: "Indonesia", price: 26.0, rating: 4.7 },
  { id: 19, name: "Altitude Espresso Bold", roaster: "Altitude Coffee", type: "Blend", roast: "Dark", origin: "Indonesia", price: 19.5, rating: 4.5 },

  // Brooklyn Roast & Shop
  { id: 5, name: "Guatemala Antigua", roaster: "Brooklyn Roast & Shop", type: "Arabica", roast: "Medium", origin: "Guatemala", price: 21.0, rating: 4.6 },
  { id: 20, name: "Brooklyn House Blend", roaster: "Brooklyn Roast & Shop", type: "Blend", roast: "Medium", origin: "Guatemala", price: 16.0, rating: 4.4 },
  { id: 21, name: "Honduras Cup of Excellence", roaster: "Brooklyn Roast & Shop", type: "Arabica", roast: "Light", origin: "Honduras", price: 38.0, rating: 4.9 },

  // Café del Sol
  { id: 6, name: "Brazilian Santos", roaster: "Café del Sol", type: "Arabica", roast: "Dark", origin: "Brazil", price: 16.5, rating: 4.3 },
  { id: 22, name: "Sol Mediterráneo Blend", roaster: "Café del Sol", type: "Blend", roast: "Medium", origin: "Brazil", price: 13.5, rating: 4.2 },
  { id: 23, name: "Brazil Cerrado Natural", roaster: "Café del Sol", type: "Arabica", roast: "Light", origin: "Brazil", price: 22.0, rating: 4.5 },

  // Andes Origin
  { id: 7, name: "Costa Rica Tarrazú", roaster: "Andes Origin", type: "Arabica", roast: "Light", origin: "Costa Rica", price: 23.0, rating: 4.7 },
  { id: 24, name: "Peru Chanchamayo", roaster: "Andes Origin", type: "Arabica", roast: "Medium", origin: "Peru", price: 21.5, rating: 4.6 },
  { id: 25, name: "Andes Dark Reserve", roaster: "Andes Origin", type: "Arabica", roast: "Dark", origin: "Peru", price: 25.0, rating: 4.5 },
  { id: 26, name: "Geisha Micro-lot", roaster: "Andes Origin", type: "Arabica", roast: "Light", origin: "Panama", price: 65.0, rating: 5.0 },

  // Saigon Roast House
  { id: 8, name: "Vietnamese Robusta", roaster: "Saigon Roast House", type: "Robusta", roast: "Dark", origin: "Vietnam", price: 14.99, rating: 4.2 },
  { id: 27, name: "Saigon Phin Blend", roaster: "Saigon Roast House", type: "Blend", roast: "Dark", origin: "Vietnam", price: 12.5, rating: 4.1 },
  { id: 28, name: "Dalat Arabica Light", roaster: "Saigon Roast House", type: "Arabica", roast: "Light", origin: "Vietnam", price: 19.0, rating: 4.4 },

  // Roma Espresso Lab
  { id: 9, name: "House Espresso Blend", roaster: "Roma Espresso Lab", type: "Blend", roast: "Dark", origin: "Italy", price: 18.0, rating: 4.5 },
  { id: 29, name: "Roma Crema Classico", roaster: "Roma Espresso Lab", type: "Blend", roast: "Medium", origin: "Italy", price: 15.0, rating: 4.3 },
  { id: 30, name: "Espresso Riserva Nera", roaster: "Roma Espresso Lab", type: "Blend", roast: "Dark", origin: "Italy", price: 29.0, rating: 4.7 },

  // Berlin Bean Lab
  { id: 10, name: "Berlin Ferment Lot #4", roaster: "Berlin Bean Lab", type: "Arabica", roast: "Light", origin: "Ethiopia", price: 32.0, rating: 4.9 },
  { id: 31, name: "Anaerobic Natural Colombia", roaster: "Berlin Bean Lab", type: "Arabica", roast: "Light", origin: "Colombia", price: 36.0, rating: 4.85 },
  { id: 32, name: "Lab Espresso Project #2", roaster: "Berlin Bean Lab", type: "Blend", roast: "Medium", origin: "Brazil", price: 24.0, rating: 4.6 },

  // Highland Roasters
  { id: 11, name: "Highland Breakfast", roaster: "Highland Roasters", type: "Blend", roast: "Medium", origin: "Scotland", price: 17.5, rating: 4.4 },
  { id: 33, name: "Highland Single Malt Dark", roaster: "Highland Roasters", type: "Arabica", roast: "Dark", origin: "Kenya", price: 23.0, rating: 4.5 },
  { id: 34, name: "Edinburgh Espresso", roaster: "Highland Roasters", type: "Blend", roast: "Dark", origin: "Brazil", price: 19.0, rating: 4.3 },

  // Sakura Coffee Works
  { id: 12, name: "Sakura Single Origin", roaster: "Sakura Coffee Works", type: "Arabica", roast: "Light", origin: "Japan", price: 34.0, rating: 4.95 },
  { id: 35, name: "Kyoto Cold Brew Blend", roaster: "Sakura Coffee Works", type: "Blend", roast: "Medium", origin: "Japan", price: 28.0, rating: 4.7 },
  { id: 36, name: "Hokkaido Dark Hand-Roast", roaster: "Sakura Coffee Works", type: "Arabica", roast: "Dark", origin: "Japan", price: 41.0, rating: 4.8 },
];

const Coffee = () => {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [roast, setRoast] = useState("all");
  const [price, setPrice] = useState("all");
  const [sort, setSort] = useState("rating");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const within = (p: number) =>
      price === "under20" ? p < 20 : price === "20-30" ? p >= 20 && p <= 30 : price === "over30" ? p > 30 : true;
    const rows = mockCoffees.filter((c) =>
      (type === "all" || c.type.toLowerCase() === type) &&
      (roast === "all" || c.roast.toLowerCase() === roast) &&
      within(c.price) &&
      (!s || c.name.toLowerCase().includes(s) || c.roaster.toLowerCase().includes(s) || c.origin.toLowerCase().includes(s)),
    );
    return [...rows].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return b.rating - a.rating;
    });
  }, [q, type, roast, price, sort]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Coffee Selection</h1>
          <p className="text-muted-foreground">Premium coffee beans from around the world</p>
        </div>

        <Input placeholder="Search by bean, roaster or origin..." value={q} onChange={(e) => setQ(e.target.value)} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue placeholder="Coffee Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="arabica">Arabica</SelectItem>
              <SelectItem value="robusta">Robusta</SelectItem>
              <SelectItem value="blend">Blend</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roast} onValueChange={setRoast}>
            <SelectTrigger><SelectValue placeholder="Roast Level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roasts</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
          <Select value={price} onValueChange={setPrice}>
            <SelectTrigger><SelectValue placeholder="Price Range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any price</SelectItem>
              <SelectItem value="under20">Under $20</SelectItem>
              <SelectItem value="20-30">$20 - $30</SelectItem>
              <SelectItem value="over30">Over $30</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground">{filtered.length} coffee{filtered.length === 1 ? "" : "s"}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((coffee) => (
            <Card key={coffee.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{coffee.name}</CardTitle>
                  <Badge variant="secondary">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {coffee.rating}
                  </Badge>
                </div>
                <CardDescription>{coffee.roaster}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="outline">{coffee.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Roast:</span>
                    <Badge variant="outline">{coffee.roast}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3 mr-1" />
                    {coffee.origin}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-2xl font-bold">${coffee.price}</span>
                  <Button size="sm">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Coffee;
