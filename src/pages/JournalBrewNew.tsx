import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { brewSchema } from "@/lib/validations";
import { z } from "zod";

const JournalBrewNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading } = useAuthGuard();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    brewMethod: "espresso",
    equipment: [] as string[],
    grindSetting: "",
    coffeeDoseGrams: "",
    waterAmountGrams: "",
    waterTempCelsius: "",
    brewWeightGrams: "",
    tdsPercentage: "",
    extractionTimeSeconds: "",
    extractionYieldPercentage: "",
    coffeeToWaterRatio: "",
    coffeeToBrewRatio: "",
    aromaScore: 5,
    sweetnessScore: 5,
    acidityScore: 5,
    bitternessScore: 5,
    bodyScore: 5,
    flavorProfileAccuracy: "",
    overallRating: 5,
    notes: "",
  });

  const handleSubmit = async () => {
    try {
      // Validate form data
      const validatedData = brewSchema.parse(formData);
      setErrors({});
      
      // TODO: Implement Supabase integration
      toast({
        title: "Brew Session Saved",
        description: "Your brewing session has been recorded.",
      });
      navigate("/journal");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: "Validation Error",
          description: "Please check the form for errors.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/journal")}
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold">New Brew</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSubmit}
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          <Check className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">☕</span>
                </div>
                <p className="text-sm font-medium">Espresso</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Equipment</CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Add your brewing equipment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grind setting</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={formData.grindSetting}
              onChange={(e) => setFormData({ ...formData, grindSetting: e.target.value })}
              placeholder="12"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Coffee amount</Label>
                <Input
                  type="number"
                  value={formData.coffeeDoseGrams}
                  onChange={(e) => setFormData({ ...formData, coffeeDoseGrams: e.target.value })}
                  placeholder="12 g"
                />
              </div>
              <div>
                <Label>Water amount</Label>
                <Input
                  type="number"
                  value={formData.waterAmountGrams}
                  onChange={(e) => setFormData({ ...formData, waterAmountGrams: e.target.value })}
                  placeholder="36 g"
                />
              </div>
              <div>
                <Label>Temperature</Label>
                <Input
                  type="number"
                  value={formData.waterTempCelsius}
                  onChange={(e) => setFormData({ ...formData, waterTempCelsius: e.target.value })}
                  placeholder="118 °C"
                />
              </div>
              <div>
                <Label>Brew weight</Label>
                <Input
                  type="number"
                  value={formData.brewWeightGrams}
                  onChange={(e) => setFormData({ ...formData, brewWeightGrams: e.target.value })}
                  placeholder="18 g"
                />
              </div>
              <div>
                <Label>TDS</Label>
                <Input
                  type="number"
                  value={formData.tdsPercentage}
                  onChange={(e) => setFormData({ ...formData, tdsPercentage: e.target.value })}
                  placeholder="80 %"
                />
              </div>
              <div>
                <Label>Extraction time</Label>
                <Input
                  type="number"
                  value={formData.extractionTimeSeconds}
                  onChange={(e) => setFormData({ ...formData, extractionTimeSeconds: e.target.value })}
                  placeholder="seconds"
                />
              </div>
              <div>
                <Label>Coffee / Brew ratio</Label>
                <Input
                  value={formData.coffeeToBrewRatio}
                  onChange={(e) => setFormData({ ...formData, coffeeToBrewRatio: e.target.value })}
                  placeholder="1:1.5"
                />
              </div>
              <div>
                <Label>Coffee / Water ratio</Label>
                <Input
                  value={formData.coffeeToWaterRatio}
                  onChange={(e) => setFormData({ ...formData, coffeeToWaterRatio: e.target.value })}
                  placeholder="1:3"
                />
              </div>
              <div>
                <Label>Extraction yield</Label>
                <Input
                  type="number"
                  value={formData.extractionYieldPercentage}
                  onChange={(e) => setFormData({ ...formData, extractionYieldPercentage: e.target.value })}
                  placeholder="120 %"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <Label>Aroma</Label>
                <span className="text-sm text-muted-foreground">{formData.aromaScore}</span>
              </div>
              <Slider
                value={[formData.aromaScore]}
                onValueChange={([value]) => setFormData({ ...formData, aromaScore: value })}
                max={10}
                step={1}
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <Label>Sweetness</Label>
                <span className="text-sm text-muted-foreground">{formData.sweetnessScore}</span>
              </div>
              <Slider
                value={[formData.sweetnessScore]}
                onValueChange={([value]) => setFormData({ ...formData, sweetnessScore: value })}
                max={10}
                step={1}
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <Label>Acidity</Label>
                <span className="text-sm text-muted-foreground">{formData.acidityScore}</span>
              </div>
              <Slider
                value={[formData.acidityScore]}
                onValueChange={([value]) => setFormData({ ...formData, acidityScore: value })}
                max={10}
                step={1}
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <Label>Bitterness</Label>
                <span className="text-sm text-muted-foreground">{formData.bitternessScore}</span>
              </div>
              <Slider
                value={[formData.bitternessScore]}
                onValueChange={([value]) => setFormData({ ...formData, bitternessScore: value })}
                max={10}
                step={1}
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <Label>Body</Label>
                <span className="text-sm text-muted-foreground">{formData.bodyScore}</span>
              </div>
              <Slider
                value={[formData.bodyScore]}
                onValueChange={([value]) => setFormData({ ...formData, bodyScore: value })}
                max={10}
                step={1}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product's flavor profile accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={formData.flavorProfileAccuracy}
              onChange={(e) => setFormData({ ...formData, flavorProfileAccuracy: e.target.value })}
              placeholder="Flowers"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold">{formData.overallRating}/10</span>
              <span className="text-yellow-500">★</span>
            </div>
            <Slider
              value={[formData.overallRating]}
              onValueChange={([value]) => setFormData({ ...formData, overallRating: value })}
              max={10}
              step={0.5}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Extraction too fast, grind finer next time. Weak body, etc."
              rows={4}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JournalBrewNew;
