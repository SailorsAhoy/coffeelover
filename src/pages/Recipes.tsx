import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Clock, Users, ChefHat, Eye, Star, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReviewAggregates } from "@/hooks/useReviewAggregates";
import RecipeCreateDialog from "@/components/recipes/RecipeCreateDialog";
import {
  BEVERAGE_TYPES,
  BREW_METHODS,
  DIFFICULTIES,
  FLAVORS,
  TEMPERATURES,
  fetchRecipes,
  formatDate,
  labelOf,
  type Recipe,
} from "@/lib/recipesData";

type SortKey = "newest" | "most_viewed" | "best_rated" | "quickest";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "most_viewed", label: "Most viewed" },
  { key: "best_rated", label: "Best rated" },
  { key: "quickest", label: "Quickest" },
];

const ANY = "any";

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>("newest");
  const [search, setSearch] = useState("");
  const [brew, setBrew] = useState(ANY);
  const [beverage, setBeverage] = useState(ANY);
  const [temp, setTemp] = useState(ANY);
  const [flavor, setFlavor] = useState(ANY);

  const load = async () => {
    setLoading(true);
    try {
      setRecipes(await fetchRecipes());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const ids = useMemo(() => recipes.map((r) => r.id), [recipes]);
  const aggs = useReviewAggregates(ids, "recipe", {});

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = recipes.filter(
      (r) =>
        (!q || r.title.toLowerCase().includes(q) || (r.description ?? "").toLowerCase().includes(q)) &&
        (brew === ANY || r.brew_method === brew) &&
        (beverage === ANY || r.beverage_type === beverage) &&
        (temp === ANY || r.temperature === temp) &&
        (flavor === ANY || r.flavors.includes(flavor)),
    );
    const rating = (r: Recipe) => aggs[r.id]?.rating ?? 0;
    return [...list].sort((a, b) => {
      if (sort === "most_viewed") return b.views_count - a.views_count;
      if (sort === "best_rated") return rating(b) - rating(a) || b.views_count - a.views_count;
      if (sort === "quickest") return (a.prep_time_minutes ?? 999) - (b.prep_time_minutes ?? 999);
      return +new Date(b.created_at) - +new Date(a.created_at);
    });
  }, [recipes, search, brew, beverage, temp, flavor, sort, aggs]);

  const activeChips = [
    brew !== ANY && { label: labelOf(BREW_METHODS, brew), clear: () => setBrew(ANY) },
    beverage !== ANY && { label: labelOf(BEVERAGE_TYPES, beverage), clear: () => setBeverage(ANY) },
    temp !== ANY && { label: labelOf(TEMPERATURES, temp), clear: () => setTemp(ANY) },
    flavor !== ANY && { label: flavor, clear: () => setFlavor(ANY) },
    !!search.trim() && { label: `“${search.trim()}”`, clear: () => setSearch("") },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <Helmet>
        <title>Coffee Recipes | CoffeePlanets</title>
        <meta
          name="description"
          content="Community coffee recipes: espresso, pour over, cold brew and coffee cocktails, rated and reviewed by fellow coffee lovers."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Coffee Recipes",
            itemListElement: filtered.slice(0, 20).map((r, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Recipe",
                name: r.title,
                description: r.description ?? undefined,
                recipeYield: r.servings ? `${r.servings} serving${r.servings > 1 ? "s" : ""}` : undefined,
                totalTime: r.prep_time_minutes ? `PT${r.prep_time_minutes}M` : undefined,
                recipeCategory: "Coffee",
              },
            })),
          })}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Coffee Recipes</h1>
            <p className="text-muted-foreground">
              Discover delicious coffee drinks to make at home — and share your own.
            </p>
          </div>
          <RecipeCreateDialog onCreated={load} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                sort === s.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground hover:bg-accent"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {s.label}
            </button>
          ))}

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {activeChips.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{activeChips.length}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[min(92vw,320px)] space-y-3">
              <div className="space-y-1.5">
                <Label>Search</Label>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Recipe name"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Preparation</Label>
                <Select value={brew} onValueChange={setBrew}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ANY}>Any method</SelectItem>
                    {BREW_METHODS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Beverage type</Label>
                <Select value={beverage} onValueChange={setBeverage}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ANY}>Any beverage</SelectItem>
                    {BEVERAGE_TYPES.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Temperature</Label>
                <Select value={temp} onValueChange={setTemp}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ANY}>Hot or cold</SelectItem>
                    {TEMPERATURES.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Flavour</Label>
                <Select value={flavor} onValueChange={setFlavor}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ANY}>Any flavour</SelectItem>
                    {FLAVORS.map((f) => (
                      <SelectItem key={f} value={f} className="capitalize">{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => {
                  setSearch("");
                  setBrew(ANY);
                  setBeverage(ANY);
                  setTemp(ANY);
                  setFlavor(ANY);
                }}
              >
                Clear filters
              </Button>
            </PopoverContent>
          </Popover>
        </div>

        {activeChips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeChips.map((c) => (
              <Badge key={c.label} variant="secondary" className="capitalize gap-1">
                {c.label}
                <button onClick={c.clear} aria-label={`Remove ${c.label} filter`}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          {loading ? "Loading recipes…" : `${filtered.length} recipe${filtered.length === 1 ? "" : "s"}`}
        </p>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No recipes match these filters.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((recipe) => {
              const agg = aggs[recipe.id];
              return (
                <Card key={recipe.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  {recipe.image_url && (
                    <Link to={`/recipes/${recipe.id}`}>
                      <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        loading="lazy"
                        className="w-full h-40 object-cover"
                      />
                    </Link>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <Link to={`/recipes/${recipe.id}`} className="hover:underline">
                        {recipe.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {recipe.prep_time_minutes != null && (
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {recipe.prep_time_minutes} min
                        </Badge>
                      )}
                      {recipe.servings != null && (
                        <Badge variant="outline">
                          <Users className="w-3 h-3 mr-1" />
                          {recipe.servings}
                        </Badge>
                      )}
                      {recipe.difficulty && (
                        <Badge variant="outline" className="capitalize">
                          <ChefHat className="w-3 h-3 mr-1" />
                          {recipe.difficulty}
                        </Badge>
                      )}
                      <Badge variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        {recipe.views_count}
                      </Badge>
                      {agg && agg.reviewCount > 0 && (
                        <Badge variant="outline">
                          <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {agg.rating.toFixed(1)} ({agg.reviewCount})
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {recipe.brew_method && (
                        <Badge variant="secondary">{labelOf(BREW_METHODS, recipe.brew_method)}</Badge>
                      )}
                      {recipe.beverage_type && (
                        <Badge variant="secondary">{labelOf(BEVERAGE_TYPES, recipe.beverage_type)}</Badge>
                      )}
                      {recipe.temperature && (
                        <Badge variant="secondary" className="capitalize">{recipe.temperature}</Badge>
                      )}
                    </div>
                    <div className="pt-2 border-t space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link to={`/social?user=${recipe.created_by ?? ""}`} className="shrink-0">
                          <Avatar className="w-6 h-6">
                            {recipe.author?.avatar_url && (
                              <AvatarImage src={recipe.author.avatar_url} alt={recipe.author?.name ?? "User"} />
                            )}
                            <AvatarFallback>
                              {(recipe.author?.name ?? "?").charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <span>
                          Added by{" "}
                          <Link to={`/social?user=${recipe.created_by ?? ""}`} className="font-medium hover:underline">
                            {recipe.author?.name ?? "A coffee lover"}
                          </Link>{" "}
                          on {formatDate(recipe.created_at)}
                        </span>
                      </div>
                      <Button asChild className="w-full" variant="secondary">
                        <Link to={`/recipes/${recipe.id}`}>View Recipe</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;
