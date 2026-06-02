import { Link, useParams, Navigate } from "react-router-dom";
import { Star, ExternalLink, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  findBrand, findMachine, findAccessory, machinesByBrand,
  type Review, type Guide,
} from "@/lib/equipmentData";

const ReviewsBlock = ({ reviews }: { reviews: Review[] }) => (
  <Card>
    <CardHeader><CardTitle className="text-lg">Reviews</CardTitle></CardHeader>
    <CardContent className="space-y-4">
      {reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet.</p>}
      {reviews.map((r) => (
        <div key={r.id} className="space-y-1">
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

const GuidesBlock = ({ guides }: { guides: Guide[] }) => (
  <Card>
    <CardHeader><CardTitle className="text-lg">Related Guides</CardTitle></CardHeader>
    <CardContent className="flex flex-wrap gap-2">
      {guides.length === 0 && <p className="text-sm text-muted-foreground">No related guides.</p>}
      {guides.map((g) => (
        <Link key={g.id} to={g.url}>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">{g.title}</Badge>
        </Link>
      ))}
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
        {rating !== undefined && (
          <Badge variant="secondary"><Star className="w-3 h-3 mr-1 fill-current" />{rating}</Badge>
        )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((m) => (
              <Link key={m.slug} to={`/equipment/machine/${m.slug}`}>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{m.name}</CardTitle>
                      <Badge variant="secondary"><Star className="w-3 h-3 mr-1 fill-current" />{m.rating}</Badge>
                    </div>
                    <CardDescription>{m.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xl font-bold">${m.price}</span>
                      <Button size="sm" variant="ghost">View</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {items.length === 0 && <p className="text-muted-foreground">No machines listed for this brand yet.</p>}
          </div>
        </div>
      </div>
    );
  }

  if (kind === "machine") {
    const m = findMachine(slug);
    if (!m) return <Navigate to="/equipment" replace />;
    const brand = findBrand(m.brandSlug);
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
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
          <GuidesBlock guides={m.guides} />
          <ReviewsBlock reviews={m.reviews} />
        </div>
      </div>
    );
  }

  const a = findAccessory(slug);
  if (!a) return <Navigate to="/equipment" replace />;
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-5xl mx-auto space-y-6">
        <Header title={a.name} subtitle={a.category} rating={a.rating} price={a.price} />
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">{a.description}</p>
          </CardContent>
        </Card>
        <SpecsBlock specs={a.specs} />
        <GuidesBlock guides={a.guides} />
        <ReviewsBlock reviews={a.reviews} />
      </div>
    </div>
  );
};

export default EquipmentDetail;
