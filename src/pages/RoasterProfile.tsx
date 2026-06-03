import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, ExternalLink, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import ShopReviews from "@/components/shops/ShopReviews";
import ClaimButton from "@/components/listings/ClaimButton";
import LinkedListingButton from "@/components/listings/LinkedListingButton";
import CloneAcrossTypeButton from "@/components/listings/CloneAcrossTypeButton";
import { getMyClaim, type ListingClaim } from "@/lib/claims";

interface Roaster {
  id: string;
  name: string;
  description: string | null;
  bio: string | null;
  address: string | null;
  country: string | null;
  website: string | null;
  banner: string | null;
  banner_url: string | null;
  avatar: string | null;
  logo_url: string | null;
  opening_hours: Record<string, { open?: string; close?: string; closed?: boolean }> | null;
  affiliate_links: { id?: string; label: string; url: string }[] | null;
  amenities: Record<string, boolean> | null;
  base_rating: number | null;
  base_review_count: number | null;
  owner_user_id: string | null;
  linked_shop_id: string | null;
}

interface Coffee {
  id: string;
  name: string;
  description: string | null;
  origin_country: string | null;
  price_per_kg: number | null;
  image_url: string | null;
}

const RoasterProfile = () => {
  const { id } = useParams();
  const [roaster, setRoaster] = useState<Roaster | null>(null);
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState(true);
  const [myClaim, setMyClaim] = useState<ListingClaim | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("roasters").select("*").eq("id", id).maybeSingle();
      setRoaster((data as unknown) as Roaster | null);
      const { data: cs } = await supabase.from("coffee_brands").select("id, name, description, origin_country, price_per_kg, image_url").eq("roaster_id", id);
      setCoffees(((cs ?? []) as unknown) as Coffee[]);
      setMyClaim(await getMyClaim("roaster", id));
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading…</div>;
  if (!roaster) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Roaster not found.</p>
        <Link to="/roasters" className="text-primary underline">Back to roasters</Link>
      </div>
    );
  }

  const banner = roaster.banner ?? roaster.banner_url;
  const hours = roaster.opening_hours ?? {};

  return (
    <div className="min-h-screen bg-background pb-24">
      {banner && (
        <div className="h-40 w-full bg-muted bg-cover bg-center" style={{ backgroundImage: `url(${banner})` }} />
      )}
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-4 md:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold truncate">{roaster.name}</h1>
            {roaster.country && <p className="text-sm text-muted-foreground">{roaster.country}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ClaimButton type="roaster" listingId={roaster.id} requiredModule="roaster_listing" />
            {roaster.linked_shop_id && <LinkedListingButton kind="shop" id={roaster.linked_shop_id} />}
            <CloneAcrossTypeButton source="roaster" sourceId={roaster.id} ownerUserId={roaster.owner_user_id} alreadyLinkedId={roaster.linked_shop_id} />
          </div>
        </div>

        <Card>
          <CardContent className="space-y-2 pt-4">
            {roaster.description && <p className="text-sm text-muted-foreground">{roaster.description}</p>}
            {roaster.address && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{roaster.address}</span>
              </div>
            )}
            {roaster.website && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4 shrink-0" />
                <a href={roaster.website} target="_blank" rel="noreferrer" className="truncate hover:text-primary">{roaster.website}</a>
              </div>
            )}
          </CardContent>
        </Card>

        {roaster.affiliate_links && roaster.affiliate_links.length > 0 && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Order online</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {roaster.affiliate_links.map((l, i) => (
                  <li key={l.id ?? i}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer sponsored"
                       className="flex items-center justify-between rounded-lg border bg-muted/30 p-3 text-sm transition-colors hover:bg-accent">
                      <span className="truncate font-medium">{l.label}</span>
                      <ExternalLink className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="bio" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bio">Bio</TabsTrigger>
            <TabsTrigger value="coffees">Coffees</TabsTrigger>
            <TabsTrigger value="hours">Hours</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="bio" className="mt-3">
            <Card>
              <CardContent className="space-y-3 pt-4 text-sm leading-relaxed">
                <p>{roaster.bio ?? roaster.description ?? "No bio yet."}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coffees" className="mt-3">
            <Card>
              <CardContent className="pt-4">
                {coffees.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No coffees listed yet.</p>
                ) : (
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {coffees.map((c) => (
                      <li key={c.id} className="overflow-hidden rounded-lg border">
                        {c.image_url && <img src={c.image_url} alt={c.name} className="h-32 w-full object-cover" />}
                        <div className="p-3">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium truncate">{c.name}</p>
                            {c.price_per_kg && <Badge variant="outline">{c.price_per_kg}/kg</Badge>}
                          </div>
                          {c.origin_country && <p className="text-xs text-muted-foreground">{c.origin_country}</p>}
                          {c.description && <p className="text-xs mt-1 line-clamp-2">{c.description}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hours" className="mt-3">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Opening hours</CardTitle></CardHeader>
              <CardContent>
                {Object.keys(hours).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Not specified.</p>
                ) : (
                  <ul className="space-y-1 text-sm">
                    {Object.entries(hours).map(([day, h]) => (
                      <li key={day} className="flex justify-between border-b border-dashed py-1 last:border-0">
                        <span className="capitalize text-muted-foreground">{day}</span>
                        <span>{h?.closed ? "Closed" : `${h?.open ?? ""} – ${h?.close ?? ""}`}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-3">
            <ShopReviews
              reviewableId={roaster.id}
              reviewableType="roaster"
              shopId={roaster.id}
              fallbackRating={roaster.base_rating ?? 0}
              fallbackCount={roaster.base_review_count ?? 0}
            />

          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RoasterProfile;
