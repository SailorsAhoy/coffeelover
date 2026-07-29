import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Users, ChefHat, Eye, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ShopReviews from "@/components/shops/ShopReviews";
import {
  BEVERAGE_TYPES,
  BREW_METHODS,
  fetchRecipe,
  formatDate,
  labelOf,
  registerRecipeView,
  type Recipe,
} from "@/lib/recipesData";

const RecipeDetail = () => {
  const { id = "" } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const r = await fetchRecipe(id).catch(() => null);
      if (cancelled) return;
      setRecipe(r);
      setLoading(false);
      if (r) registerRecipeView(r.id);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold">Recipe not found</h1>
          <Button asChild variant="secondary">
            <Link to="/recipes">Back to recipes</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <Helmet>
        <title>{`${recipe.title} Recipe | CoffeeMart`}</title>
        <meta name="description" content={(recipe.description ?? recipe.title).slice(0, 155)} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Recipe",
            name: recipe.title,
            description: recipe.description ?? undefined,
            image: recipe.image_url ?? undefined,
            author: { "@type": "Person", name: recipe.author?.name ?? "CoffeeMart member" },
            datePublished: recipe.created_at,
            recipeCategory: "Coffee",
            totalTime: recipe.prep_time_minutes ? `PT${recipe.prep_time_minutes}M` : undefined,
            recipeYield: recipe.servings ? `${recipe.servings} servings` : undefined,
            recipeIngredient: recipe.ingredients.map((i) => [i.qty, i.name].filter(Boolean).join(" ")),
            recipeInstructions: recipe.instructions,
          })}
        </script>
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/recipes">
            <ArrowLeft className="w-4 h-4 mr-2" />
            All recipes
          </Link>
        </Button>

        {recipe.image_url && (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-56 md:h-72 object-cover rounded-xl"
          />
        )}

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">{recipe.title}</h1>
          {recipe.description && <p className="text-muted-foreground">{recipe.description}</p>}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to={`/social?user=${recipe.created_by ?? ""}`}>
              <Avatar className="w-8 h-8">
                {recipe.author?.avatar_url && (
                  <AvatarImage src={recipe.author.avatar_url} alt={recipe.author?.name ?? "User"} />
                )}
                <AvatarFallback>{(recipe.author?.name ?? "?").charAt(0).toUpperCase()}</AvatarFallback>
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

          <div className="flex flex-wrap gap-2">
            {recipe.prep_time_minutes != null && (
              <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />{recipe.prep_time_minutes} min</Badge>
            )}
            {recipe.servings != null && (
              <Badge variant="outline"><Users className="w-3 h-3 mr-1" />{recipe.servings} servings</Badge>
            )}
            {recipe.difficulty && (
              <Badge variant="outline" className="capitalize"><ChefHat className="w-3 h-3 mr-1" />{recipe.difficulty}</Badge>
            )}
            <Badge variant="outline"><Eye className="w-3 h-3 mr-1" />{recipe.views_count} views</Badge>
            {recipe.brew_method && <Badge variant="secondary">{labelOf(BREW_METHODS, recipe.brew_method)}</Badge>}
            {recipe.beverage_type && <Badge variant="secondary">{labelOf(BEVERAGE_TYPES, recipe.beverage_type)}</Badge>}
            {recipe.temperature && <Badge variant="secondary" className="capitalize">{recipe.temperature}</Badge>}
            {recipe.flavors.map((f) => (
              <Badge key={f} variant="outline" className="capitalize">{f}</Badge>
            ))}
          </div>
        </div>

        {recipe.ingredients.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-lg">Ingredients</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recipe.ingredients.map((i, idx) => (
                  <li key={idx} className="flex justify-between gap-4 text-sm border-b last:border-0 pb-2">
                    <span>{i.name}</span>
                    {i.qty && <span className="text-muted-foreground">{i.qty}</span>}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle className="text-lg">Instructions</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-line leading-relaxed">{recipe.instructions}</p>
          </CardContent>
        </Card>

        <ShopReviews reviewableId={recipe.id} reviewableType="recipe" />
      </div>
    </div>
  );
};

export default RecipeDetail;
