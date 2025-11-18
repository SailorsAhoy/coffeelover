import { BookOpen, Coffee, Leaf, Droplets, Thermometer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Wiki = () => {
  const coffeeTypes = [
    {
      name: "Arabica",
      description: "The most popular coffee species, known for its smooth, complex flavor profiles with hints of fruit and sugar.",
      origin: "Ethiopia",
      characteristics: ["Sweet", "Fruity", "Acidic"],
    },
    {
      name: "Robusta",
      description: "A hardy species with a stronger, more bitter taste and higher caffeine content than Arabica.",
      origin: "Central and Western Africa",
      characteristics: ["Strong", "Bitter", "Earthy"],
    },
    {
      name: "Liberica",
      description: "A rare species with a unique woody and smoky flavor profile, larger beans than Arabica or Robusta.",
      origin: "West Africa",
      characteristics: ["Woody", "Smoky", "Unique"],
    },
  ];

  const brewingMethods = [
    {
      name: "Espresso",
      description: "A concentrated coffee brewed by forcing hot water through finely-ground coffee under high pressure.",
      time: "25-30 seconds",
      difficulty: "Advanced",
    },
    {
      name: "Pour Over",
      description: "Manual brewing method where hot water is poured over coffee grounds in a filter, extracting flavors slowly.",
      time: "3-4 minutes",
      difficulty: "Intermediate",
    },
    {
      name: "French Press",
      description: "Immersion brewing method where coarse grounds steep in hot water before being pressed with a metal filter.",
      time: "4-5 minutes",
      difficulty: "Beginner",
    },
    {
      name: "Cold Brew",
      description: "Coffee grounds steeped in cold water for an extended period, producing a smooth, less acidic concentrate.",
      time: "12-24 hours",
      difficulty: "Beginner",
    },
  ];

  const processingMethods = [
    {
      name: "Washed (Wet)",
      description: "Coffee cherries are pulped and fermented to remove fruit before drying, resulting in clean, bright flavors.",
      flavor: "Clean, bright, acidic",
    },
    {
      name: "Natural (Dry)",
      description: "Whole coffee cherries are dried in the sun, creating fruity, wine-like flavors.",
      flavor: "Fruity, sweet, full-bodied",
    },
    {
      name: "Honey",
      description: "A hybrid process where some fruit mucilage remains on the bean during drying.",
      flavor: "Sweet, fruity, balanced",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Coffee Wiki</h1>
          <p className="text-muted-foreground">Everything you need to know about coffee</p>
        </div>

        <Input placeholder="Search the wiki..." className="max-w-xl" />

        <Tabs defaultValue="types" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="types">Coffee Types</TabsTrigger>
            <TabsTrigger value="brewing">Brewing Methods</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
          </TabsList>

          <TabsContent value="types" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coffeeTypes.map((type) => (
                <Card key={type.name}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Coffee className="w-5 h-5 text-primary" />
                      <CardTitle>{type.name}</CardTitle>
                    </div>
                    <CardDescription>Origin: {type.origin}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {type.characteristics.map((char) => (
                        <span
                          key={char}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="brewing" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {brewingMethods.map((method) => (
                <Card key={method.name}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="w-5 h-5 text-primary" />
                      <CardTitle>{method.name}</CardTitle>
                    </div>
                    <CardDescription>
                      {method.time} • {method.difficulty}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="processing" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {processingMethods.map((method) => (
                <Card key={method.name}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf className="w-5 h-5 text-primary" />
                      <CardTitle>{method.name}</CardTitle>
                    </div>
                    <CardDescription>Flavor: {method.flavor}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Wiki;
