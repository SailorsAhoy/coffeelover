import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { brands, machines, accessories, findBrand } from "@/lib/equipmentData";

const MACHINE_TYPES = ["all", "Espresso Machine", "Drip Coffee Maker", "Pour Over", "Moka Pot", "Cold Brew", "AeroPress", "French Press"];
const PRICE_BUCKETS = [
  { id: "all", label: "Any price", test: (_: number) => true },
  { id: "under50", label: "Under $50", test: (p: number) => p < 50 },
  { id: "50-200", label: "$50 – $200", test: (p: number) => p >= 50 && p <= 200 },
  { id: "200-700", label: "$200 – $700", test: (p: number) => p > 200 && p <= 700 },
  { id: "over700", label: "Over $700", test: (p: number) => p > 700 },
];
const RATINGS = [
  { id: "any", label: "Any rating", min: 0 },
  { id: "4plus", label: "4★ & up", min: 4 },
  { id: "45plus", label: "4.5★ & up", min: 4.5 },
  { id: "48plus", label: "4.8★ & up", min: 4.8 },
];

const sortRows = <T extends { name: string; price: number; rating: number }>(rows: T[], sort: string) =>
  [...rows].sort((a, b) => {
    if (sort === "price-low") return a.price - b.price;
    if (sort === "price-high") return b.price - a.price;
    if (sort === "name") return a.name.localeCompare(b.name);
    return b.rating - a.rating;
  });

const Equipment = () => {
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("all");
  const [type, setType] = useState("all");
  const [priceBucket, setPriceBucket] = useState("all");
  const [ratingBucket, setRatingBucket] = useState("any");
  const [sort, setSort] = useState("rating");

  const priceTest = PRICE_BUCKETS.find((b) => b.id === priceBucket)!.test;
  const minRating = RATINGS.find((r) => r.id === ratingBucket)!.min;
  const s = q.trim().toLowerCase();

  const filteredMachines = useMemo(() => {
    const rows = machines.filter((m) => {
      const b = findBrand(m.brandSlug);
      const brandName = b?.name ?? m.brandSlug;
      if (brand !== "all" && m.brandSlug !== brand) return false;
      if (type !== "all" && m.type !== type) return false;
      if (!priceTest(m.price)) return false;
      if (m.rating < minRating) return false;
      if (s && !m.name.toLowerCase().includes(s) && !brandName.toLowerCase().includes(s)) return false;
      return true;
    });
    return sortRows(rows, sort);
  }, [brand, type, priceTest, minRating, s, sort]);

  const filteredAccessories = useMemo(() => {
    const rows = accessories.filter((a) => {
      if (type !== "all" && a.category !== type) return false;
      if (!priceTest(a.price)) return false;
      if (a.rating < minRating) return false;
      if (s && !a.name.toLowerCase().includes(s) && !a.category.toLowerCase().includes(s)) return false;
      return true;
    });
    return sortRows(rows, sort);
  }, [type, priceTest, minRating, s, sort]);

  const filteredBrands = useMemo(() => {
    const rows = brands.filter((b) => {
      if (b.rating < minRating) return false;
      if (s && !b.name.toLowerCase().includes(s) && !b.country.toLowerCase().includes(s)) return false;
      return true;
    });
    return [...rows].sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : b.rating - a.rating));
  }, [minRating, s, sort]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Machines & Accessories</h1>
          <p className="text-muted-foreground">Professional equipment for the perfect brew</p>
        </div>

        <Input placeholder="Search by name, brand or country..." value={q} onChange={(e) => setQ(e.target.value)} />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger><SelectValue placeholder="Brand" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All brands</SelectItem>
              {brands.map((b) => <SelectItem key={b.slug} value={b.slug}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue placeholder="Type / Category" /></SelectTrigger>
            <SelectContent>
              {MACHINE_TYPES.map((t) => <SelectItem key={t} value={t}>{t === "all" ? "All types" : t}</SelectItem>)}
              <SelectItem value="Grinder">Accessory: Grinder</SelectItem>
              <SelectItem value="Accessories">Accessory: Accessories</SelectItem>
              <SelectItem value="Tools">Accessory: Tools</SelectItem>
              <SelectItem value="Cleaning">Accessory: Cleaning</SelectItem>
              <SelectItem value="Glassware">Accessory: Glassware</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priceBucket} onValueChange={setPriceBucket}>
            <SelectTrigger><SelectValue placeholder="Price" /></SelectTrigger>
            <SelectContent>
              {PRICE_BUCKETS.map((p) => <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={ratingBucket} onValueChange={setRatingBucket}>
            <SelectTrigger><SelectValue placeholder="Rating" /></SelectTrigger>
            <SelectContent>
              {RATINGS.map((r) => <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest rated</SelectItem>
              <SelectItem value="price-low">Price: low to high</SelectItem>
              <SelectItem value="price-high">Price: high to low</SelectItem>
              <SelectItem value="name">Name: A → Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="machines" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="brands">Brands ({filteredBrands.length})</TabsTrigger>
            <TabsTrigger value="machines">Machines ({filteredMachines.length})</TabsTrigger>
            <TabsTrigger value="accessories">Accessories ({filteredAccessories.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="brands" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBrands.map((b) => (
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
              {filteredMachines.map((m) => {
                const b = findBrand(m.brandSlug);
                return (
                  <Card key={m.slug} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{m.name}</CardTitle>
                        <Badge variant="secondary"><Star className="w-3 h-3 mr-1 fill-current" />{m.rating}</Badge>
                      </div>
                      <CardDescription>
                        {b ? <Link to={`/equipment/brand/${b.slug}`} className="hover:underline">{b.name}</Link> : m.brandSlug}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Badge variant="outline">{m.type}</Badge>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-2xl font-bold">${m.price}</span>
                        <Button size="sm" asChild>
                          <Link to={`/equipment/machine/${m.slug}`}><ShoppingBag className="w-4 h-4 mr-2" /> View</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {filteredMachines.length === 0 && <p className="text-muted-foreground">No machines match these filters.</p>}
            </div>
          </TabsContent>

          <TabsContent value="accessories" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAccessories.map((a) => (
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
                        <Link to={`/equipment/accessory/${a.slug}`}><ShoppingBag className="w-4 h-4 mr-2" /> View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredAccessories.length === 0 && <p className="text-muted-foreground">No accessories match these filters.</p>}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Equipment;
