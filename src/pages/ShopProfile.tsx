import { MapPin, Clock, Wifi, Croissant, TreePine, Star, Coffee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ShopProfile = () => {
  const shop = {
    name: "Artisan Coffee House",
    description: "A cozy neighborhood coffee shop specializing in single-origin pour-overs and artisanal espresso drinks.",
    rating: 4.8,
    address: "123 Main Street, Downtown",
    hours: "Mon-Fri: 7am-7pm, Sat-Sun: 8am-6pm",
    hasWifi: true,
    hasBakery: true,
    hasOutdoor: true,
    brandsBrewved: ["Blue Bottle", "Intelligentsia", "Counter Culture", "Heart Roasters"],
    preparationMethods: ["Espresso", "Pour Over", "French Press", "Cold Brew", "Aeropress"],
    services: ["Takeaway", "Dine-in", "Free WiFi", "Outdoor Seating", "Fresh Pastries", "Vegan Options"],
    images: ["/placeholder.svg"],
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={shop.images[0]}
                alt={shop.name}
                className="w-full md:w-48 h-48 object-cover rounded-lg"
              />
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <h1 className="text-3xl font-bold text-foreground">{shop.name}</h1>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    {shop.rating}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{shop.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {shop.address}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {shop.hours}
                  </div>
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
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Details Tabs */}
        <Tabs defaultValue="brands" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="brands">Brands Brewed</TabsTrigger>
            <TabsTrigger value="preparation">Preparation</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="brands" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Coffee Brands We Brew</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {shop.brandsBrewved.map((brand, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                    >
                      <Coffee className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{brand}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preparation" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Preparation Methods Available</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {shop.preparationMethods.map((method, idx) => (
                    <Badge key={idx} variant="secondary" className="justify-center py-2">
                      {method}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {shop.services.map((service, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 rounded-lg border bg-card"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ShopProfile;
