import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { coffees } from "@/lib/coffeeData";

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
    const rows = coffees.filter((c) =>
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
            <Link key={coffee.id} to={`/coffee/${coffee.slug}`}>
              <Card className="hover:shadow-lg transition-shadow h-full">
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
                    <Button size="sm" onClick={(e) => e.preventDefault()}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Coffee;
