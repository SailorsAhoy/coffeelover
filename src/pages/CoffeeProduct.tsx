import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Star, ShoppingCart, Truck, Shield, Coffee, ArrowLeft } from "lucide-react";
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
  const product = findCoffee(id);
  if (!product) return <Navigate to="/coffee" replace />;
  const related = relatedCoffees(product);

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
                <img src="/placeholder.svg" alt={product.name} className="w-full h-96 object-cover rounded-lg" />
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
                    <span className="text-4xl font-bold text-primary">${product.price}</span>
                    <span className="text-sm text-muted-foreground">per 12oz bag</span>
                  </div>
                  <Button size="lg" className="w-full mb-3">
                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                  </Button>
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
