import { useEffect, useState } from "react";
import { Coffee, Clock, Thermometer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

type Guide = {
  id: string;
  title: string;
  description: string | null;
  machine_type: string;
  coffee_type: string | null;
  grind_size: string | null;
  water_temp_celsius: number | null;
  brew_time_seconds: number | null;
  coffee_to_water_ratio: string | null;
  image_url: string | null;
};

const formatTime = (s: number | null) => {
  if (!s) return "—";
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.round(s / 60)} min`;
  return `${(s / 3600).toFixed(1)} h`;
};

const TABS: { key: string; label: string; filter: (g: Guide) => boolean }[] = [
  { key: "all", label: "All", filter: () => true },
  { key: "espresso", label: "Espresso", filter: (g) => g.machine_type === "espresso" || g.machine_type === "moka_pot" },
  { key: "drip", label: "Drip", filter: (g) => g.machine_type === "drip" || g.machine_type === "cold_brew" },
  { key: "manual", label: "Manual", filter: (g) => ["pour_over", "french_press", "aeropress"].includes(g.machine_type) },
];

const Guides = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("preparation_guides")
        .select("id,title,description,machine_type,coffee_type,grind_size,water_temp_celsius,brew_time_seconds,coffee_to_water_ratio,image_url")
        .order("title");
      setGuides((data as Guide[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const renderGrid = (rows: Guide[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rows.map((g) => (
        <Card key={g.id} className="hover:shadow-lg transition-shadow overflow-hidden">
          {g.image_url && <img src={g.image_url} alt={g.title} className="w-full h-40 object-cover" loading="lazy" />}
          <CardHeader>
            <CardTitle>{g.title}</CardTitle>
            <CardDescription className="flex gap-2 flex-wrap">
              <Badge variant="outline">{g.machine_type.replace("_", " ")}</Badge>
              {g.coffee_type && <Badge variant="secondary">{g.coffee_type}</Badge>}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {g.description && <p className="text-sm text-muted-foreground">{g.description}</p>}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center"><Coffee className="w-4 h-4 mr-2" />Grind:</span>
              <span className="font-medium">{g.grind_size ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center"><Thermometer className="w-4 h-4 mr-2" />Water:</span>
              <span className="font-medium">{g.water_temp_celsius ?? "—"}°C</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center"><Clock className="w-4 h-4 mr-2" />Time:</span>
              <span className="font-medium">{formatTime(g.brew_time_seconds)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Ratio:</span>
              <span className="font-medium">{g.coffee_to_water_ratio ?? "—"}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Brewing Guides</h1>
          <p className="text-muted-foreground">Master the art of coffee preparation</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:w-auto">
            {TABS.map((t) => <TabsTrigger key={t.key} value={t.key}>{t.label}</TabsTrigger>)}
          </TabsList>
          {TABS.map((t) => (
            <TabsContent key={t.key} value={t.key} className="space-y-4 mt-6">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading guides…</p>
              ) : (
                renderGrid(guides.filter(t.filter))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Guides;
