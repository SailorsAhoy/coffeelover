import { Star, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Equipment = () => {
  const mockMachines = [
    {
      id: 1,
      name: "Breville Barista Express",
      brand: "Breville",
      type: "Espresso Machine",
      price: 699.95,
      rating: 4.8,
    },
    {
      id: 2,
      name: "Technivorm Moccamaster",
      brand: "Technivorm",
      type: "Drip Coffee Maker",
      price: 349.0,
      rating: 4.9,
    },
    {
      id: 3,
      name: "Hario V60 Ceramic",
      brand: "Hario",
      type: "Pour Over",
      price: 29.99,
      rating: 4.7,
    },
  ];

  const mockAccessories = [
    {
      id: 1,
      name: "Burr Coffee Grinder",
      category: "Grinder",
      price: 129.99,
      rating: 4.6,
    },
    {
      id: 2,
      name: "Milk Frother",
      category: "Accessories",
      price: 39.99,
      rating: 4.5,
    },
    {
      id: 3,
      name: "Digital Scale",
      category: "Tools",
      price: 24.99,
      rating: 4.7,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Machines & Accessories
          </h1>
          <p className="text-muted-foreground">
            Professional equipment for the perfect brew
          </p>
        </div>

        <Tabs defaultValue="machines" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="machines">Machines</TabsTrigger>
            <TabsTrigger value="accessories">Accessories</TabsTrigger>
          </TabsList>

          <TabsContent value="machines" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockMachines.map((machine) => (
                <Card key={machine.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{machine.name}</CardTitle>
                      <Badge variant="secondary">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {machine.rating}
                      </Badge>
                    </div>
                    <CardDescription>{machine.brand}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Badge variant="outline">{machine.type}</Badge>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-2xl font-bold">${machine.price}</span>
                      <Button size="sm">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="accessories" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockAccessories.map((accessory) => (
                <Card key={accessory.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{accessory.name}</CardTitle>
                      <Badge variant="secondary">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {accessory.rating}
                      </Badge>
                    </div>
                    <CardDescription>{accessory.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-2xl font-bold">${accessory.price}</span>
                      <Button size="sm">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Equipment;
