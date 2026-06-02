import { useEffect, useMemo, useState } from "react";
import { Clock, Users, ChefHat, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type Recipe = {
  id: string;
  title: string;
  description: string | null;
  prep_time_minutes: number | null;
  servings: number | null;
  image_url: string | null;
  ingredients: any;
};

const Recipes = () => {
  const [rows, setRows] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("recipes")
        .select("id,title,description,prep_time_minutes,servings,image_url,ingredients")
        .order("title");
      setRows((data as Recipe[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => r.title.toLowerCase().includes(s) || (r.description ?? "").toLowerCase().includes(s));
  }, [rows, q]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Coffee Recipes</h1>
          <p className="text-muted-foreground">Discover delicious coffee drinks to make at home</p>
        </div>

        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search recipes..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading recipes…</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{filtered.length} recipe{filtered.length === 1 ? "" : "s"}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((recipe) => {
                const ingCount = Array.isArray(recipe.ingredients) ? recipe.ingredients.length : 0;
                const difficulty = ingCount <= 3 ? "Easy" : ingCount <= 5 ? "Medium" : "Advanced";
                return (
                  <Card key={recipe.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    {recipe.image_url && <img src={recipe.image_url} alt={recipe.title} className="w-full h-40 object-cover" loading="lazy" />}
                    <CardHeader>
                      <CardTitle>{recipe.title}</CardTitle>
                      {recipe.description && <CardDescription>{recipe.description}</CardDescription>}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />{recipe.prep_time_minutes ?? "?"} min</Badge>
                        <Badge variant="outline"><Users className="w-3 h-3 mr-1" />{recipe.servings ?? 1} serving{(recipe.servings ?? 1) > 1 ? "s" : ""}</Badge>
                        <Badge variant="outline"><ChefHat className="w-3 h-3 mr-1" />{difficulty}</Badge>
                      </div>
                      <Button className="w-full" variant="secondary">View Recipe</Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Recipes;
