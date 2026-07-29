import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  BREW_METHODS,
  BEVERAGE_TYPES,
  TEMPERATURES,
  FLAVORS,
  DIFFICULTIES,
} from "@/lib/recipesData";

interface Props {
  onCreated: () => void;
}

const empty = {
  title: "",
  description: "",
  instructions: "",
  ingredients: "",
  prep: "",
  servings: "1",
  imageUrl: "",
  brewMethod: "espresso",
  beverageType: "black",
  temperature: "hot",
  difficulty: "easy",
};

export const RecipeCreateDialog = ({ onCreated }: Props) => {
  const { user } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(empty);
  const [flavors, setFlavors] = useState<string[]>([]);

  const set = (k: keyof typeof empty, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const toggleFlavor = (f: string) =>
    setFlavors((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]));

  if (!user) return null;

  const submit = async () => {
    const title = form.title.trim();
    const instructions = form.instructions.trim();
    if (title.length < 3 || title.length > 120) {
      toast.error("Title must be between 3 and 120 characters");
      return;
    }
    if (instructions.length < 10 || instructions.length > 4000) {
      toast.error("Instructions must be between 10 and 4,000 characters");
      return;
    }
    const ingredients = form.ingredients
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 30)
      .map((line) => {
        const [name, qty] = line.split("|").map((p) => p.trim());
        return qty ? { name, qty } : { name };
      });

    setSaving(true);
    const { error } = await supabase.from("recipes").insert({
      title,
      description: form.description.trim().slice(0, 300) || null,
      instructions,
      ingredients,
      prep_time_minutes: form.prep ? Math.min(Number(form.prep) || 0, 1440) : null,
      servings: form.servings ? Math.min(Number(form.servings) || 1, 50) : 1,
      image_url: form.imageUrl.trim() || null,
      created_by: user.id,
      brew_method: form.brewMethod,
      beverage_type: form.beverageType,
      temperature: form.temperature,
      difficulty: form.difficulty,
      flavors,
    } as any);
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Recipe published");
    setForm(empty);
    setFlavors([]);
    setOpen(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add recipe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share your recipe</DialogTitle>
          <DialogDescription>It will be credited to your profile.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} maxLength={120} />
          </div>
          <div className="space-y-1.5">
            <Label>Short description</Label>
            <Input
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              maxLength={300}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Preparation</Label>
              <Select value={form.brewMethod} onValueChange={(v) => set("brewMethod", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BREW_METHODS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Beverage</Label>
              <Select value={form.beverageType} onValueChange={(v) => set("beverageType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BEVERAGE_TYPES.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Temperature</Label>
              <Select value={form.temperature} onValueChange={(v) => set("temperature", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TEMPERATURES.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Difficulty</Label>
              <Select value={form.difficulty} onValueChange={(v) => set("difficulty", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Prep time (min)</Label>
              <Input
                type="number"
                min={0}
                value={form.prep}
                onChange={(e) => set("prep", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Servings</Label>
              <Input
                type="number"
                min={1}
                value={form.servings}
                onChange={(e) => set("servings", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Flavours</Label>
            <div className="flex flex-wrap gap-1.5">
              {FLAVORS.map((f) => (
                <Badge
                  key={f}
                  variant={flavors.includes(f) ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => toggleFlavor(f)}
                >
                  {f}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Ingredients (one per line, use “name | quantity”)</Label>
            <Textarea
              rows={4}
              value={form.ingredients}
              onChange={(e) => set("ingredients", e.target.value)}
              placeholder={"Espresso | 2 shots\nSteamed milk | 150 ml"}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Instructions</Label>
            <Textarea
              rows={4}
              maxLength={4000}
              value={form.instructions}
              onChange={(e) => set("instructions", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Image URL (optional)</Label>
            <Input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={submit} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Publish recipe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeCreateDialog;
