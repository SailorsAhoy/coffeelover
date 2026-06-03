import { Helmet } from "react-helmet-async";
import { Clock, Users, ChefHat } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Recipes = () => {
  const mockRecipes = [
    {
      id: 1,
      title: "Pumpkin Spice Latte",
      description: "Classic fall favorite with real pumpkin",
      prepTime: 10,
      servings: 2,
      difficulty: "Easy",
      brand: "Any",
    },
    {
      id: 2,
      title: "Iced Vanilla Cold Brew",
      description: "Smooth and refreshing summer drink",
      prepTime: 15,
      servings: 1,
      difficulty: "Easy",
      brand: "Any",
    },
    {
      id: 3,
      title: "Caramel Macchiato",
      description: "Sweet espresso-based beverage",
      prepTime: 8,
      servings: 1,
      difficulty: "Medium",
      brand: "Any Espresso Blend",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Coffee Recipes</h1>
          <p className="text-muted-foreground">
            Discover delicious coffee drinks to make at home
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockRecipes.map((recipe) => (
            <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{recipe.title}</CardTitle>
                <CardDescription>{recipe.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {recipe.prepTime} min
                  </Badge>
                  <Badge variant="outline">
                    <Users className="w-3 h-3 mr-1" />
                    {recipe.servings} serving{recipe.servings > 1 ? "s" : ""}
                  </Badge>
                  <Badge variant="outline">
                    <ChefHat className="w-3 h-3 mr-1" />
                    {recipe.difficulty}
                  </Badge>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    Best with: {recipe.brand}
                  </p>
                  <Button className="w-full" variant="secondary">
                    View Recipe
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recipes;
