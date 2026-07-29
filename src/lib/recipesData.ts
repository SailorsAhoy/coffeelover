import { supabase } from "@/integrations/supabase/client";

export interface RecipeIngredient {
  name: string;
  qty?: string;
}

export interface RecipeAuthor {
  id: string;
  name: string | null;
  avatar_url: string | null;
}

export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  ingredients: RecipeIngredient[];
  instructions: string;
  prep_time_minutes: number | null;
  servings: number | null;
  image_url: string | null;
  created_by: string | null;
  created_at: string;
  brew_method: string | null;
  beverage_type: string | null;
  temperature: string | null;
  flavors: string[];
  difficulty: string | null;
  views_count: number;
  author?: RecipeAuthor | null;
}

export const BREW_METHODS = [
  { value: "espresso", label: "Espresso" },
  { value: "pour_over", label: "Pour over" },
  { value: "french_press", label: "French press" },
  { value: "aeropress", label: "AeroPress" },
  { value: "cold_brew", label: "Cold brew" },
  { value: "moka_pot", label: "Moka pot" },
  { value: "drip", label: "Drip / filter" },
  { value: "other", label: "Other" },
];

export const BEVERAGE_TYPES = [
  { value: "black", label: "Black coffee" },
  { value: "milk_drink", label: "Milk drink" },
  { value: "iced", label: "Iced / blended" },
  { value: "cocktail", label: "Cocktail" },
  { value: "dessert", label: "Dessert" },
  { value: "specialty", label: "Specialty" },
];

export const TEMPERATURES = [
  { value: "hot", label: "Hot" },
  { value: "cold", label: "Cold" },
];

export const FLAVORS = [
  "fruity",
  "floral",
  "citrus",
  "chocolatey",
  "nutty",
  "milky",
  "creamy",
  "sweet",
  "spiced",
  "bitter",
  "boozy",
  "earthy",
  "bold",
  "smooth",
  "clean",
];

export const DIFFICULTIES = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export const labelOf = (
  list: { value: string; label: string }[],
  value: string | null | undefined,
) => list.find((i) => i.value === value)?.label ?? value ?? "";

const normalizeIngredients = (raw: unknown): RecipeIngredient[] => {
  if (Array.isArray(raw)) {
    return raw
      .map((i) =>
        typeof i === "string"
          ? { name: i }
          : { name: String((i as any)?.name ?? ""), qty: (i as any)?.qty ?? undefined },
      )
      .filter((i) => i.name);
  }
  return [];
};

const mapRow = (row: any): Recipe => ({
  ...row,
  flavors: row.flavors ?? [],
  views_count: row.views_count ?? 0,
  ingredients: normalizeIngredients(row.ingredients),
});

export const fetchRecipes = async (): Promise<Recipe[]> => {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = (data ?? []).map(mapRow);
  await attachAuthors(rows);
  return rows;
};

export const fetchRecipe = async (id: string): Promise<Recipe | null> => {
  const { data, error } = await supabase.from("recipes").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const recipe = mapRow(data);
  await attachAuthors([recipe]);
  return recipe;
};

const attachAuthors = async (recipes: Recipe[]) => {
  const ids = Array.from(new Set(recipes.map((r) => r.created_by).filter(Boolean))) as string[];
  if (!ids.length) return;
  const { data } = await supabase.from("profiles_public" as any).select("id, name, avatar_url").in("id", ids);
  const byId = new Map((data ?? []).map((p: any) => [p.id, p as RecipeAuthor]));
  recipes.forEach((r) => {
    r.author = r.created_by ? byId.get(r.created_by) ?? null : null;
  });
};

export const registerRecipeView = async (id: string) => {
  await (supabase as any).rpc("increment_recipe_views", { _recipe_id: id });
};

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", year: "numeric" });
