import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Star, ShoppingCart, Truck, Shield, Coffee, ArrowLeft, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { findCoffee, relatedCoffees, type CoffeeItem } from "@/lib/coffeeData";
import { supabase } from "@/integrations/supabase/client";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CURRENCY_SYMBOLS: Record<string, string> = { EUR: "€", USD: "$", GBP: "£", JPY: "¥" };
const currencySymbol = (code: string | null) => {
  const c = (code || "EUR").toUpperCase();
  return CURRENCY_SYMBOLS[c] ?? c + " ";
};
const stripRoasterPrefix = (name: string, roasterName: string) => {
  for (const s of [" — ", " - ", " – "]) {
    const p = roasterName + s;
    if (name.startsWith(p)) return name.slice(p.length);
  }
  return name;
};


const StarRow = ({ value, size = 4 }: { value: number; size?: number }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-${size} h-${size} ${i < Math.floor(value) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
      />
    ))}
  </div>
);

const CoffeeProduct = () => {
  const { id = "" } = useParams();
  const isUuid = UUID_RE.test(id);
  const mockProduct = !isUuid ? findCoffee(id) : null;

  const [dbProduct, setDbProduct] = useState<CoffeeItem | null>(null);
  const [currencyCode, setCurrencyCode] = useState<string>("EUR");
  const [imageUrl, setImageUrl] = useState<string>("/placeholder.svg");
  const [affiliate, setAffiliate] = useState<string | null>(null);
  const [productUrl, setProductUrl] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [servicedCountries, setServicedCountries] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(isUuid);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isUuid) return;
    (async () => {
      const { data, error } = await supabase
        .from("coffee_brands")
        .select("id, name, description, origin_country, price_per_kg, currency, image_url, affiliate_link, product_url, is_available, variety, process, serviced_countries, coffee_type, roast_level, roaster_id, roasters(name)")
        .eq("id", id)
        .maybeSingle();
      if (error || !data) { setNotFound(true); setLoading(false); return; }
      const roasterName = (data as any).roasters?.name ?? "";
      const displayName = stripRoasterPrefix(data.name, roasterName);
      const roastMap: Record<string, CoffeeItem["roast"]> = { light: "Light", medium: "Medium", dark: "Dark", "medium-dark": "Dark", "medium-light": "Medium" };
      const typeMap: Record<string, CoffeeItem["type"]> = { arabica: "Arabica", robusta: "Robusta", blend: "Blend" };
      const roast = roastMap[(data.roast_level as string)?.toLowerCase?.()] ?? "Medium";
      const type = typeMap[(data.coffee_type as string)?.toLowerCase?.()] ?? "Arabica";
      setCurrencyCode(((data as any).currency || "EUR").toUpperCase());
      setImageUrl(data.image_url || "/placeholder.svg");
      setAffiliate(data.affiliate_link);
      setProductUrl((data as any).product_url ?? null);
      setIsAvailable(data.is_available !== false);
      setServicedCountries(((data as any).serviced_countries as string[] | null) ?? null);
      setDbProduct({
        id: 0,
        slug: data.id,
        name: displayName,
        roaster: roasterName,
        type,
        roast,
        origin: data.origin_country || "—",
        process: ((data as any).process as any) ?? undefined,
        variety: ((data as any).variety as any) ?? undefined,
        price: Number(data.price_per_kg ?? 0),
        rating: 0,
        tastingNotes: [],
        description: data.description || `${displayName} from ${roasterName}.`,
        brewRecommendation:
          roast === "Light"
            ? "Best as pour-over or AeroPress. Use 200°F water, 1:16 ratio, medium-fine grind."
            : roast === "Medium"
              ? "Versatile for drip and pour-over. 196°F water, 1:16 ratio, medium grind."
              : "Excellent for espresso and moka pot. 9 bar, 1:2 ratio, fine grind.",
        guides: [],
        reviews: [],
      });
      setLoading(false);
    })();
  }, [id, isUuid]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading…</div>;
  if (isUuid && notFound) return <Navigate to="/coffee" replace />;
  if (!isUuid && !mockProduct) return <Navigate to="/coffee" replace />;
  const product = (mockProduct ?? dbProduct)!;
  const related = mockProduct ? relatedCoffees(mockProduct) : [];
  const priceUnit = isUuid ? "per kg" : "per 12oz bag";
  const sym = currencySymbol(currencyCode);


  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <Link to="/coffee" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Coffee
        </Link>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <img src={isUuid ? imageUrl : "/placeholder.svg"} alt={product.name} className="w-full h-96 object-cover rounded-lg" />
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">by {product.roaster}</p>
                  <h1 className="text-4xl font-bold text-foreground mb-3">{product.name}</h1>
                  <div className="flex items-center gap-2 mb-4">
                    <StarRow value={product.rating} />
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews.length} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{product.type}</Badge>
                  <Badge variant="secondary">{product.roast} Roast</Badge>
                  <Badge variant="secondary">{product.region ? `${product.region}, ${product.origin}` : product.origin}</Badge>
                  {product.variety && <Badge variant="secondary">{product.variety}</Badge>}
                </div>

                <div className="space-y-2">
                  {product.process && (
                    <div className="flex items-center gap-2 text-sm">
                      <Coffee className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Process: {product.process}</span>
                    </div>
                  )}
                  {product.altitude && (
                    <div className="flex items-center gap-2 text-sm">
                      <Coffee className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Altitude: {product.altitude}</span>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Tasting Notes:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tastingNotes.map((n) => <Badge key={n} variant="outline">{n}</Badge>)}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold text-primary">{sym}{product.price.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground">{priceUnit}</span>
                  </div>
                  <div className="mb-3">
                    {isAvailable ? (
                      <Badge className="bg-green-600 hover:bg-green-600 text-white"><CheckCircle2 className="w-3 h-3 mr-1" />In stock</Badge>
                    ) : (
                      <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Out of stock</Badge>
                    )}
                    {isUuid && servicedCountries && servicedCountries.length > 0 && (
                      <span className="ml-2 text-xs text-muted-foreground">Ships to: {servicedCountries.join(", ")}</span>
                    )}
                  </div>
                  {affiliate ? (
                    <a href={affiliate} target="_blank" rel="noopener noreferrer sponsored">
                      <Button size="lg" className="w-full mb-2" disabled={!isAvailable}>
                        <ShoppingCart className="w-4 h-4 mr-2" /> Buy from roaster
                      </Button>
                    </a>
                  ) : (
                    <Button size="lg" className="w-full mb-2" disabled={!isAvailable}>
                      <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                    </Button>
                  )}
                  {productUrl && (
                    <a href={productUrl} target="_blank" rel="noopener noreferrer" className="block mb-3">
                      <Button size="sm" variant="outline" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" /> View product page
                      </Button>
                    </a>
                  )}

                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Truck className="w-4 h-4" /> Free shipping on orders over $50</div>
                    <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> Satisfaction guaranteed</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="brewing">Brewing</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardHeader><CardTitle>About This Coffee</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground leading-relaxed">{product.description}</p></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brewing" className="mt-6 space-y-4">
            <Card>
              <CardHeader><CardTitle>Brewing Recommendations</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground leading-relaxed">{product.brewRecommendation}</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Related Guides</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {product.guides.map((g) => (
                  <Link key={g.id} to={g.url}>
                    <Badge variant="outline" className="cursor-pointer hover:bg-accent">{g.title}</Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>{product.reviews.length} verified purchases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {product.reviews.map((r) => (
                  <div key={r.id} className="pb-6 border-b last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{r.user}</p>
                        <p className="text-xs text-muted-foreground">{r.date}</p>
                      </div>
                      <StarRow value={r.rating} size={3} />
                    </div>
                    <p className="text-sm text-muted-foreground">{r.body}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {related.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">You may also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.id} to={`/coffee/${r.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{r.name}</CardTitle>
                        <Badge variant="secondary"><Star className="w-3 h-3 mr-1 fill-current" />{r.rating}</Badge>
                      </div>
                      <CardDescription>{r.roaster}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-lg font-bold">${r.price}</span>
                        <Badge variant="outline">{r.roast}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoffeeProduct;
