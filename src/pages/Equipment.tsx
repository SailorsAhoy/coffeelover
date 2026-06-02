import { useEffect, useMemo, useState } from "react";
import { ShoppingBag, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

type Machine = {
  id: string;
  name: string;
  machine_type: string;
  price: number | null;
  image_url: string | null;
  description: string | null;
  seller_url: string | null;
  brand?: { name: string } | null;
};

type Accessory = {
  id: string;
  name: string;
  category: string | null;
  price: number | null;
  image_url: string | null;
  description: string | null;
  seller_url: string | null;
};

const Equipment = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const [{ data: m }, { data: a }] = await Promise.all([
        supabase
          .from("machines")
          .select("id,name,machine_type,price,image_url,description,seller_url,brand:machine_brands(name)")
          .order("name"),
        supabase
          .from("accessories")
          .select("id,name,category,price,image_url,description,seller_url")
          .order("name"),
      ]);
      setMachines((m as Machine[]) ?? []);
      setAccessories((a as Accessory[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const filteredMachines = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return machines;
    return machines.filter(
      (x) => x.name.toLowerCase().includes(s) || (x.brand?.name ?? "").toLowerCase().includes(s) || x.machine_type.includes(s),
    );
  }, [machines, q]);

  const filteredAcc = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return accessories;
    return accessories.filter((x) => x.name.toLowerCase().includes(s) || (x.category ?? "").toLowerCase().includes(s));
  }, [accessories, q]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Machines &amp; Accessories</h1>
          <p className="text-muted-foreground">Professional equipment for the perfect brew</p>
        </div>

        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search equipment..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <Tabs defaultValue="machines" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="machines">Machines ({filteredMachines.length})</TabsTrigger>
            <TabsTrigger value="accessories">Accessories ({filteredAcc.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="machines" className="space-y-4 mt-6">
            {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMachines.map((machine) => (
                  <Card key={machine.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    {machine.image_url && <img src={machine.image_url} alt={machine.name} className="w-full h-40 object-cover" loading="lazy" />}
                    <CardHeader>
                      <CardTitle className="text-lg">{machine.name}</CardTitle>
                      <CardDescription>{machine.brand?.name ?? "—"}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Badge variant="outline">{machine.machine_type.replace("_", " ")}</Badge>
                      {machine.description && <p className="text-sm text-muted-foreground line-clamp-2">{machine.description}</p>}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-2xl font-bold">{machine.price != null ? `$${machine.price}` : "—"}</span>
                        <Button asChild size="sm">
                          <a href={machine.seller_url ?? "#"} target="_blank" rel="noreferrer noopener">
                            <ShoppingBag className="w-4 h-4 mr-2" />View
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="accessories" className="space-y-4 mt-6">
            {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAcc.map((a) => (
                  <Card key={a.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    {a.image_url && <img src={a.image_url} alt={a.name} className="w-full h-40 object-cover" loading="lazy" />}
                    <CardHeader>
                      <CardTitle className="text-lg">{a.name}</CardTitle>
                      <CardDescription>{a.category ?? "Accessory"}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {a.description && <p className="text-sm text-muted-foreground line-clamp-2">{a.description}</p>}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-2xl font-bold">{a.price != null ? `$${a.price}` : "—"}</span>
                        <Button asChild size="sm">
                          <a href={a.seller_url ?? "#"} target="_blank" rel="noreferrer noopener">
                            <ShoppingBag className="w-4 h-4 mr-2" />View
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Equipment;
