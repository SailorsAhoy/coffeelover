import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const CURRENCY_SYMBOLS: Record<string, string> = { EUR: "€", USD: "$", GBP: "£", JPY: "¥" };
const sym = (c?: string | null) => CURRENCY_SYMBOLS[(c || "EUR").toUpperCase()] ?? (c || "");

const stripRoaster = (name: string, roaster: string) => {
  for (const s of [" — ", " - ", " – "]) {
    const p = roaster + s;
    if (name.startsWith(p)) return name.slice(p.length);
  }
  return name;
};

interface Row {
  id: string;
  name: string;
  roaster: string;
  roaster_country: string | null;
  origin: string | null;
  variety: string | null;
  process: string | null;
  roast: string | null;
  type: string | null;
  price: number;
  currency: string;
  serviced_countries: string[] | null;
  is_available: boolean;
}

const Coffee = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [roaster, setRoaster] = useState("all");
  const [origin, setOrigin] = useState("all");
  const [variety, setVariety] = useState("all");
  const [process, setProcess] = useState("all");
  const [roast, setRoast] = useState("all");
  const [price, setPrice] = useState("all");
  const [currency, setCurrency] = useState("all");
  const [myCountry, setMyCountry] = useState("any");
  const [sort, setSort] = useState("name");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("coffee_brands")
        .select("id, name, price_per_kg, currency, origin_country, variety, process, roast_level, coffee_type, serviced_countries, is_available, roaster_id, roasters(name, country)")
        .order("name");
      if (!error && data) {
        setRows(data.map((d: any) => ({
          id: d.id,
          name: stripRoaster(d.name, d.roasters?.name || ""),
          roaster: d.roasters?.name || "—",
          roaster_country: d.roasters?.country ?? null,
          origin: d.origin_country,
          variety: d.variety,
          process: d.process,
          roast: d.roast_level,
          type: d.coffee_type,
          price: Number(d.price_per_kg ?? 0),
          currency: (d.currency || "EUR").toUpperCase(),
          serviced_countries: d.serviced_countries,
          is_available: d.is_available !== false,
        })));
      }
      setLoading(false);
    })();
  }, []);

  const uniq = (vals: (string | null)[]) =>
    Array.from(new Set(vals.filter((v): v is string => !!v))).sort();
  const roasters = useMemo(() => uniq(rows.map((r) => r.roaster)), [rows]);
  const origins = useMemo(() => uniq(rows.map((r) => r.origin)), [rows]);
  const varieties = useMemo(() => uniq(rows.map((r) => r.variety)), [rows]);
  const processes = useMemo(() => uniq(rows.map((r) => r.process)), [rows]);
  const currencies = useMemo(() => uniq(rows.map((r) => r.currency)), [rows]);
  const countries = useMemo(
    () => uniq([...rows.map((r) => r.roaster_country), ...rows.flatMap((r) => r.serviced_countries || [])]),
    [rows],
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const within = (p: number) =>
      price === "under20" ? p < 20 : price === "20-30" ? p >= 20 && p <= 30 : price === "over30" ? p > 30 : true;
    const servicesMe = (r: Row) => {
      if (myCountry === "any") return true;
      if (!r.serviced_countries || r.serviced_countries.length === 0) return true; // ships everywhere
      return r.serviced_countries.map((c) => c.toLowerCase()).includes(myCountry.toLowerCase())
        || (r.roaster_country?.toLowerCase() === myCountry.toLowerCase());
    };
    const out = rows.filter((r) =>
      (roaster === "all" || r.roaster === roaster) &&
      (origin === "all" || r.origin === origin) &&
      (variety === "all" || r.variety === variety) &&
      (process === "all" || r.process === process) &&
      (roast === "all" || (r.roast || "").toLowerCase() === roast) &&
      (currency === "all" || r.currency === currency) &&
      within(r.price) &&
      servicesMe(r) &&
      (!s || r.name.toLowerCase().includes(s) || r.roaster.toLowerCase().includes(s) || (r.origin || "").toLowerCase().includes(s))
    );
    return [...out].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });
  }, [rows, q, roaster, origin, variety, process, roast, price, currency, myCountry, sort]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <Helmet>
        <title>Coffee Selection | CoffeeMart</title>
        <meta property="og:title" content="Coffee Selection | CoffeeMart" />
        <meta property="og:description" content="Browse and filter premium coffee beans from roasters around the world." />
      </Helmet>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Coffee Selection</h1>
          <p className="text-muted-foreground">Premium coffee beans from around the world</p>
        </div>

        <Input placeholder="Search by bean, roaster or origin..." value={q} onChange={(e) => setQ(e.target.value)} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Select value={roaster} onValueChange={setRoaster}>
            <SelectTrigger><SelectValue placeholder="Roaster" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roasters</SelectItem>
              {roasters.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={myCountry} onValueChange={setMyCountry}>
            <SelectTrigger><SelectValue placeholder="Ships to my country" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any region</SelectItem>
              {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={origin} onValueChange={setOrigin}>
            <SelectTrigger><SelectValue placeholder="Origin" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All origins</SelectItem>
              {origins.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={variety} onValueChange={setVariety}>
            <SelectTrigger><SelectValue placeholder="Variety" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All varieties</SelectItem>
              {varieties.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={process} onValueChange={setProcess}>
            <SelectTrigger><SelectValue placeholder="Process" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All processes</SelectItem>
              {processes.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={roast} onValueChange={setRoast}>
            <SelectTrigger><SelectValue placeholder="Roast level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roasts</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
          <Select value={price} onValueChange={setPrice}>
            <SelectTrigger><SelectValue placeholder="Price" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any price</SelectItem>
              <SelectItem value="under20">Under 20</SelectItem>
              <SelectItem value="20-30">20 – 30</SelectItem>
              <SelectItem value="over30">Over 30</SelectItem>
            </SelectContent>
          </Select>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger><SelectValue placeholder="Currency" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All currencies</SelectItem>
              {currencies.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground">
          {loading ? "Loading…" : `${filtered.length} coffee${filtered.length === 1 ? "" : "s"}`}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((coffee) => (
            <Link key={coffee.id} to={`/coffee/${coffee.id}`}>
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{coffee.name}</CardTitle>
                    {!coffee.is_available && <Badge variant="destructive">Out of stock</Badge>}
                  </div>
                  <CardDescription>{coffee.roaster}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {coffee.type && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="outline">{coffee.type}</Badge>
                      </div>
                    )}
                    {coffee.roast && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Roast:</span>
                        <Badge variant="outline">{coffee.roast}</Badge>
                      </div>
                    )}
                    {coffee.origin && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        {coffee.origin}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-2xl font-bold">{sym(coffee.currency)}{coffee.price.toFixed(2)}</span>
                    <Button size="sm" onClick={(e) => e.preventDefault()} disabled={!coffee.is_available}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add
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
