import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { productSchema } from "@/lib/validations";
import { z } from "zod";

const JournalProductNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading } = useAuthGuard();
  const [activeTab, setActiveTab] = useState("roastery");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    // Roastery & Product
    roasterName: "",
    productName: "",
    flavorProfile: "",
    roastLevel: "",
    roastDate: "",
    weightGrams: "",
    price: "",
    cuppingScore: "",
    lotNumber: "",
    productUrl: "",
    
    // Coffee & Source
    countryOfOrigin: "",
    region: "",
    altitudeMeters: "",
    varietals: "",
    processingMethod: "",
    harvestDate: "",
    isDecaf: false,
    farmName: "",
    washStation: "",
    producerName: "",
    
    // Notes
    notes: "",
  });

  const handleSubmit = async () => {
    try {
      // Validate form data
      const validatedData = productSchema.parse({
        ...formData,
        priceAmount: formData.price,
        roasterCountry: "",
      });
      setErrors({});
      
      // TODO: Implement Supabase integration
      toast({
        title: "Product Added",
        description: "Your coffee product has been saved to your journal.",
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
        <h1 className="text-xl font-semibold">New Product</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSubmit}
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          <Check className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="roastery">Roastery and Product</TabsTrigger>
            <TabsTrigger value="coffee">Coffee and Source</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="roastery" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Roastery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={formData.roasterName}
                    onChange={(e) => setFormData({ ...formData, roasterName: e.target.value })}
                    placeholder="Roastery name"
                    className={errors.roasterName ? "border-destructive" : ""}
                  />
                  {errors.roasterName && <p className="text-sm text-destructive mt-1">{errors.roasterName}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Flavor profile</Label>
                  <Input
                    value={formData.flavorProfile}
                    onChange={(e) => setFormData({ ...formData, flavorProfile: e.target.value })}
                    placeholder="e.g., Flowers, Chocolate, Citrus"
                  />
                </div>
                <div>
                  <Label>Roast level</Label>
                  <Input
                    value={formData.roastLevel}
                    onChange={(e) => setFormData({ ...formData, roastLevel: e.target.value })}
                    placeholder="Light, Medium, Dark"
                  />
                </div>
                <div>
                  <Label>Roast date</Label>
                  <Input
                    type="date"
                    value={formData.roastDate}
                    onChange={(e) => setFormData({ ...formData, roastDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Weight (grams)</Label>
                  <Input
                    type="number"
                    value={formData.weightGrams}
                    onChange={(e) => setFormData({ ...formData, weightGrams: e.target.value })}
                    placeholder="250"
                  />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="26.00"
                  />
                </div>
                <div>
                  <Label>Cupping score</Label>
                  <Input
                    type="number"
                    value={formData.cuppingScore}
                    onChange={(e) => setFormData({ ...formData, cuppingScore: e.target.value })}
                    placeholder="83"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Lot #</Label>
                  <Input
                    value={formData.lotNumber}
                    onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                    placeholder="245"
                  />
                </div>
                <div>
                  <Label>Name</Label>
                  <Input
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="Product name"
                    className={errors.productName ? "border-destructive" : ""}
                  />
                  {errors.productName && <p className="text-sm text-destructive mt-1">{errors.productName}</p>}
                </div>
                <div>
                  <Label>Product URL</Label>
                  <Input
                    type="url"
                    value={formData.productUrl}
                    onChange={(e) => setFormData({ ...formData, productUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coffee" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Coffee</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Country of origin</Label>
                  <Input
                    value={formData.countryOfOrigin}
                    onChange={(e) => setFormData({ ...formData, countryOfOrigin: e.target.value })}
                    placeholder="Ethiopia"
                  />
                </div>
                <div>
                  <Label>Region, area</Label>
                  <Input
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="Adis Adeba"
                  />
                </div>
                <div>
                  <Label>Altitude (meters)</Label>
                  <Input
                    type="number"
                    value={formData.altitudeMeters}
                    onChange={(e) => setFormData({ ...formData, altitudeMeters: e.target.value })}
                    placeholder="1850"
                  />
                </div>
                <div>
                  <Label>Varietals</Label>
                  <Input
                    value={formData.varietals}
                    onChange={(e) => setFormData({ ...formData, varietals: e.target.value })}
                    placeholder="Albaricoque, bergamota, jazmín"
                  />
                </div>
                <div>
                  <Label>Processings</Label>
                  <Input
                    value={formData.processingMethod}
                    onChange={(e) => setFormData({ ...formData, processingMethod: e.target.value })}
                    placeholder="Washed"
                  />
                </div>
                <div>
                  <Label>Harvest date</Label>
                  <Input
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Decaf</Label>
                  <Switch
                    checked={formData.isDecaf}
                    onCheckedChange={(checked) => setFormData({ ...formData, isDecaf: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Source</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Farm</Label>
                  <Input
                    value={formData.farmName}
                    onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                    placeholder="Farm name"
                  />
                </div>
                <div>
                  <Label>Wash station</Label>
                  <Input
                    value={formData.washStation}
                    onChange={(e) => setFormData({ ...formData, washStation: e.target.value })}
                    placeholder="Wash station"
                  />
                </div>
                <div>
                  <Label>Producer</Label>
                  <Input
                    value={formData.producerName}
                    onChange={(e) => setFormData({ ...formData, producerName: e.target.value })}
                    placeholder="Producer name"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any additional notes about this coffee..."
                  rows={6}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JournalProductNew;
