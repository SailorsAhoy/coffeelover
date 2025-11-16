import { Package, Star, Truck, Tag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Roasters = () => {
  const mockRoasters = [
    {
      id: 1,
      name: "Heritage Roasters",
      description: "Traditional roasting methods since 1985",
      rating: 4.9,
      freeShipping: true,
      hasDiscounts: true,
      specialty: "Single Origin",
    },
    {
      id: 2,
      name: "Modern Bean Co.",
      description: "Innovative blends and sustainable sourcing",
      rating: 4.7,
      freeShipping: false,
      hasDiscounts: true,
      specialty: "Blends",
    },
    {
      id: 3,
      name: "Altitude Coffee",
      description: "High-altitude specialty beans",
      rating: 4.8,
      freeShipping: true,
      hasDiscounts: false,
      specialty: "Specialty Grade",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Coffee Roasters</h1>
          <p className="text-muted-foreground">
            Explore premium coffee roasters and their offerings
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Input placeholder="Search roasters..." className="flex-1" />
          <Button variant="outline">Filter</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockRoasters.map((roaster) => (
            <Card key={roaster.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>{roaster.name}</span>
                  <Badge variant="secondary">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {roaster.rating}
                  </Badge>
                </CardTitle>
                <CardDescription>{roaster.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Package className="w-4 h-4 mr-2" />
                  {roaster.specialty}
                </div>
                <div className="flex flex-wrap gap-2">
                  {roaster.freeShipping && (
                    <Badge variant="outline">
                      <Truck className="w-3 h-3 mr-1" />
                      Free Shipping
                    </Badge>
                  )}
                  {roaster.hasDiscounts && (
                    <Badge variant="outline">
                      <Tag className="w-3 h-3 mr-1" />
                      Discounts
                    </Badge>
                  )}
                </div>
                <Button className="w-full">View Products</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roasters;
