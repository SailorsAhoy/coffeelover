import { ShoppingCart, Star, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Coffee = () => {
  const mockCoffees = [
    {
      id: 1,
      name: "Ethiopian Yirgacheffe",
      roaster: "Heritage Roasters",
      type: "Arabica",
      roast: "Light",
      origin: "Ethiopia",
      price: 24.99,
      rating: 4.9,
    },
    {
      id: 2,
      name: "Colombian Supremo",
      roaster: "Modern Bean Co.",
      type: "Arabica",
      roast: "Medium",
      origin: "Colombia",
      price: 19.99,
      rating: 4.7,
    },
    {
      id: 3,
      name: "Sumatra Mandheling",
      roaster: "Altitude Coffee",
      type: "Arabica",
      roast: "Dark",
      origin: "Indonesia",
      price: 22.99,
      rating: 4.8,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Coffee Selection</h1>
          <p className="text-muted-foreground">
            Premium coffee beans from around the world
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Coffee Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="arabica">Arabica</SelectItem>
              <SelectItem value="robusta">Robusta</SelectItem>
              <SelectItem value="blend">Blend</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Roast Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under20">Under $20</SelectItem>
              <SelectItem value="20-30">$20 - $30</SelectItem>
              <SelectItem value="over30">Over $30</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCoffees.map((coffee) => (
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
