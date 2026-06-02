import { Link } from "react-router-dom";
import { Star, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { brands, machines, accessories, findBrand } from "@/lib/equipmentData";

const Equipment = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Machines & Accessories</h1>
          <p className="text-muted-foreground">Professional equipment for the perfect brew</p>
        </div>

        <Tabs defaultValue="machines" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="brands">Brands</TabsTrigger>
            <TabsTrigger value="machines">Machines</TabsTrigger>
            <TabsTrigger value="accessories">Accessories</TabsTrigger>
          </TabsList>

          <TabsContent value="brands" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brands.map((b) => (
                <Link key={b.slug} to={`/equipment/brand/${b.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{b.name}</CardTitle>
                        <Badge variant="secondary"><Star className="w-3 h-3 mr-1 fill-current" />{b.rating}</Badge>
                      </div>
                      <CardDescription>{b.country} · est. {b.founded}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{b.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="machines" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {machines.map((m) => {
                const brand = findBrand(m.brandSlug);
                return (
                  <Card key={m.slug} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{m.name}</CardTitle>
                        <Badge variant="secondary"><Star className="w-3 h-3 mr-1 fill-current" />{m.rating}</Badge>
                      </div>
                      <CardDescription>
                        {brand ? (
                          <Link to={`/equipment/brand/${brand.slug}`} className="hover:underline">{brand.name}</Link>
                        ) : m.brandSlug}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Badge variant="outline">{m.type}</Badge>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-2xl font-bold">${m.price}</span>
                        <Button size="sm" asChild>
                          <Link to={`/equipment/machine/${m.slug}`}>
                            <ShoppingBag className="w-4 h-4 mr-2" /> View
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="accessories" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accessories.map((a) => (
                <Card key={a.slug} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{a.name}</CardTitle>
                      <Badge variant="secondary"><Star className="w-3 h-3 mr-1 fill-current" />{a.rating}</Badge>
                    </div>
                    <CardDescription>{a.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-2xl font-bold">${a.price}</span>
                      <Button size="sm" asChild>
                        <Link to={`/equipment/accessory/${a.slug}`}>
                          <ShoppingBag className="w-4 h-4 mr-2" /> View
                        </Link>
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
