import { Coffee, Clock, Thermometer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Guides = () => {
  const mockGuides = [
    {
      id: 1,
      title: "Perfect Espresso Shot",
      machine: "Espresso Machine",
      type: "Arabica",
      grind: "Fine",
      temp: 92,
      time: 25,
      ratio: "1:2",
    },
    {
      id: 2,
      title: "French Press Brewing",
      machine: "French Press",
      type: "Any",
      grind: "Coarse",
      temp: 94,
      time: 240,
      ratio: "1:15",
    },
    {
      id: 3,
      title: "Pour Over Technique",
      machine: "Pour Over",
      type: "Arabica",
      grind: "Medium",
      temp: 93,
      time: 180,
      ratio: "1:16",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Brewing Guides</h1>
          <p className="text-muted-foreground">
            Master the art of coffee preparation
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="espresso">Espresso</TabsTrigger>
            <TabsTrigger value="drip">Drip</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockGuides.map((guide) => (
                <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{guide.title}</CardTitle>
                    <CardDescription>
                      <Badge variant="outline">{guide.machine}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center">
                          <Coffee className="w-4 h-4 mr-2" />
                          Grind Size:
                        </span>
                        <span className="font-medium">{guide.grind}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center">
                          <Thermometer className="w-4 h-4 mr-2" />
                          Water Temp:
                        </span>
                        <span className="font-medium">{guide.temp}°C</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Brew Time:
                        </span>
                        <span className="font-medium">{guide.time}s</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Ratio:</span>
                        <span className="font-medium">{guide.ratio}</span>
                      </div>
                    </div>
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

export default Guides;
