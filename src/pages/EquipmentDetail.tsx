import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams, Navigate } from "react-router-dom";
import { Star, ExternalLink, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  findBrand, findMachine, findAccessory, machinesByBrand,
  recipesForMachineType, recipesForAccessoryCategory,
  relatedMachines, relatedAccessoriesForMachine, relatedMachinesForAccessory,
  ratingDistribution,
  type Review, type Guide, type RecipeRef, type Machine, type Accessory,
} from "@/lib/equipmentData";

const StarRow = ({ value }: { value: number }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.floor(value) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
    ))}
  </div>
);

const ReviewSummary = ({ reviews }: { reviews: Review[] }) => {
  const count = reviews.length;
  const avg = count === 0 ? 0 : reviews.reduce((s, r) => s + r.rating, 0) / count;
  const dist = ratingDistribution(reviews);
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Rating Summary</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col items-center justify-center text-center space-y-2">
            <div className="text-5xl font-bold">{avg.toFixed(1)}</div>
            <StarRow value={avg} />
            <div className="text-sm text-muted-foreground">{count} review{count === 1 ? "" : "s"}</div>
          </div>
          <div className="md:col-span-2 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const c = dist[stars - 1];
              const pct = count === 0 ? 0 : Math.round((c / count) * 100);
              return (
                <div key={stars} className="flex items-center gap-3 text-sm">
                  <span className="w-8 tabular-nums text-muted-foreground">{stars}★</span>
                  <div className="flex-1 h-2 rounded bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-10 tabular-nums text-right text-muted-foreground">{c}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ReviewsBlock = ({ reviews }: { reviews: Review[] }) => {
  const [sort, setSort] = useState<"recent" | "high" | "low">("recent");
  const sorted = useMemo(() => {
    const rows = [...reviews];
    if (sort === "high") return rows.sort((a, b) => b.rating - a.rating);
    if (sort === "low") return rows.sort((a, b) => a.rating - b.rating);
    return rows.sort((a, b) => b.date.localeCompare(a.date));
  }, [reviews, sort]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-lg">Reviews</CardTitle>
        <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most recent</SelectItem>
            <SelectItem value="high">Highest rated</SelectItem>
            <SelectItem value="low">Lowest rated</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-4">
        {sorted.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet.</p>}
        {sorted.map((r) => (
          <div key={r.id} className="space-y-1 pb-4 border-b last:border-0 last:pb-0">
            <div className="flex items-center gap-2">
              <span className="font-medium">{r.user}</span>
              <Badge variant="secondary"><Star className="w-3 h-3 mr-1 fill-current" />{r.rating}</Badge>
              <span className="text-xs text-muted-foreground">{r.date}</span>
            </div>
            <p className="text-sm text-muted-foreground">{r.body}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const GuidesAndRecipes = ({ guides, recipes }: { guides: Guide[]; recipes: RecipeRef[] }) => (
  <Card>
    <CardHeader><CardTitle className="text-lg">Related Guides & Recipes</CardTitle></CardHeader>
    <CardContent className="space-y-3">
      {guides.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Brewing guides</p>
          <div className="flex flex-wrap gap-2">
            {guides.map((g) => (
              <Link key={g.id} to={g.url}>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">{g.title}</Badge>
              </Link>
            ))}
          </div>
        </div>
      )}
      {recipes.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Recipes</p>
          <div className="flex flex-wrap gap-2">
            {recipes.map((r) => (
              <Link key={r.id} to={r.url}>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">{r.title}</Badge>
              </Link>
            ))}
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

const SpecsBlock = ({ specs }: { specs: Record<string, string> }) => (
  <Card>
    <CardHeader><CardTitle className="text-lg">Specifications</CardTitle></CardHeader>
    <CardContent>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {Object.entries(specs).map(([k, v]) => (
          <div key={k} className="flex justify-between border-b border-border/50 py-1">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="font-medium text-right">{v}</dd>
          </div>
        ))}
      </dl>
    </CardContent>
  </Card>
);

const RelatedMachinesGrid = ({ items }: { items: Machine[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    {items.map((m) => (
      <Link key={m.slug} to={`/equipment/machine/${m.slug}`}>
        <Card className="hover:shadow-md transition-shadow h-full">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-base">{m.name}</CardTitle>
              <Badge variant="secondary"><Star className="w-3 h-3 mr-1 fill-current" />{m.rating}</Badge>
            </div>
            <CardDescription>{m.type}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-lg font-bold">${m.price}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    ))}
  </div>
);

const RelatedAccessoriesGrid = ({ items }: { items: Accessory[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    {items.map((a) => (
      <Link key={a.slug} to={`/equipment/accessory/${a.slug}`}>
        <Card className="hover:shadow-md transition-shadow h-full">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-base">{a.name}</CardTitle>
              <Badge variant="secondary"><Star className="w-3 h-3 mr-1 fill-current" />{a.rating}</Badge>
            </div>
            <CardDescription>{a.category}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-lg font-bold">${a.price}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    ))}
  </div>
);

const Header = ({ title, subtitle, rating, price }: { title: string; subtitle?: string; rating?: number; price?: number }) => (
  <div className="space-y-2">
    <Link to="/equipment" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft className="w-4 h-4 mr-1" /> Back to Equipment
    </Link>
    <div className="flex items-start justify-between flex-wrap gap-3">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {rating !== undefined && <Badge variant="secondary"><Star className="w-3 h-3 mr-1 fill-current" />{rating}</Badge>}
        {price !== undefined && <span className="text-2xl font-bold">${price}</span>}
      </div>
    </div>
  </div>
);

const EquipmentDetail = ({ kind }: { kind: "brand" | "machine" | "accessory" }) => {
  const { slug = "" } = useParams();

  if (kind === "brand") {
    const brand = findBrand(slug);
    if (!brand) return <Navigate to="/equipment" replace />;
    const items = machinesByBrand(brand.slug);
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
        <div className="max-w-5xl mx-auto space-y-6">
          <Header title={brand.name} subtitle={`${brand.country} · founded ${brand.founded}`} rating={brand.rating} />
          <Card>
            <CardContent className="pt-6 space-y-3">
              <p className="text-muted-foreground">{brand.description}</p>
              <Button asChild variant="outline" size="sm">
                <a href={brand.website} target="_blank" rel="noreferrer">
                  Visit website <ExternalLink className="w-3 h-3 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
          <Separator />
          <h2 className="text-xl font-semibold">Machines by {brand.name}</h2>
          {items.length === 0 ? (
            <p className="text-muted-foreground">No machines listed for this brand yet.</p>
          ) : (
            <RelatedMachinesGrid items={items} />
          )}
        </div>
      </div>
    );
  }

  if (kind === "machine") {
    const m = findMachine(slug);
    if (!m) return <Navigate to="/equipment" replace />;
    const brand = findBrand(m.brandSlug);
    const recipes = recipesForMachineType(m.type);
    const relMachines = relatedMachines(m);
    const relAccessories = relatedAccessoriesForMachine(m);
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
        <Helmet>
          <title>{m.name} | CoffeeMart</title>
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: m.name,
            description: m.description,
            category: m.type,
            brand: brand ? { "@type": "Brand", name: brand.name } : undefined,
            offers: { "@type": "Offer", price: m.price, priceCurrency: "USD" },
            aggregateRating: m.reviews.length > 0 ? {
              "@type": "AggregateRating", ratingValue: m.rating, reviewCount: m.reviews.length,
            } : undefined,
          })}</script>
        </Helmet>
        <div className="max-w-5xl mx-auto space-y-6">
          <Header title={m.name} subtitle={m.type} rating={m.rating} price={m.price} />
          <Card>
            <CardContent className="pt-6 space-y-3">
              <p className="text-muted-foreground">{m.description}</p>
              {brand && (
                <Link to={`/equipment/brand/${brand.slug}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent">By {brand.name}</Badge>
                </Link>
              )}
            </CardContent>
          </Card>
          <SpecsBlock specs={m.specs} />
          <GuidesAndRecipes guides={m.guides} recipes={recipes} />
          <ReviewSummary reviews={m.reviews} />
          <ReviewsBlock reviews={m.reviews} />
          {relMachines.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Related machines</h2>
              <RelatedMachinesGrid items={relMachines} />
            </div>
          )}
          {relAccessories.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Pairs well with</h2>
              <RelatedAccessoriesGrid items={relAccessories} />
            </div>
          )}
        </div>
      </div>
    );
  }

  const a = findAccessory(slug);
  if (!a) return <Navigate to="/equipment" replace />;
  const recipes = recipesForAccessoryCategory(a.category);
  const relMachines = relatedMachinesForAccessory(a);
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <Helmet>
        <title>{a.name} | CoffeeMart</title>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: a.name,
          description: a.description,
          category: a.category,
          offers: { "@type": "Offer", price: a.price, priceCurrency: "USD" },
          aggregateRating: a.reviews.length > 0 ? {
            "@type": "AggregateRating", ratingValue: a.rating, reviewCount: a.reviews.length,
          } : undefined,
        })}</script>
      </Helmet>
      <div className="max-w-5xl mx-auto space-y-6">
        <Header title={a.name} subtitle={a.category} rating={a.rating} price={a.price} />
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">{a.description}</p>
          </CardContent>
        </Card>
        <SpecsBlock specs={a.specs} />
        <GuidesAndRecipes guides={a.guides} recipes={recipes} />
        <ReviewSummary reviews={a.reviews} />
        <ReviewsBlock reviews={a.reviews} />
        {relMachines.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Use with these machines</h2>
            <RelatedMachinesGrid items={relMachines} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentDetail;
