import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2 } from "lucide-react";

const ShopManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Shop Management</CardTitle>
              <CardDescription>Manage coffee shops, roasteries, bakeries, and vegan cafés</CardDescription>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Shop
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="search">Search Shops</Label>
              <Input id="search" placeholder="Search by name or location..." />
            </div>

            <div className="space-y-2">
              <Label>Filter by Type</Label>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="filter-coffee" />
                  <Label htmlFor="filter-coffee" className="cursor-pointer">Coffee Shops</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="filter-roaster" />
                  <Label htmlFor="filter-roaster" className="cursor-pointer">Roasteries</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="filter-bakery" />
                  <Label htmlFor="filter-bakery" className="cursor-pointer">Bakeries</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="filter-veggie" />
                  <Label htmlFor="filter-veggie" className="cursor-pointer">Vegan Cafés</Label>
                </div>
              </div>
            </div>

            {/* Sample Shop List */}
            <div className="border rounded-lg divide-y">
              {[
                { name: "Artisan Coffee House", type: "Coffee Shop", location: "Manhattan, NY" },
                { name: "Brooklyn Roast & Shop", type: "Roastery", location: "Brooklyn, NY" },
                { name: "Pastry & Pour", type: "Bakery", location: "Manhattan, NY" },
                { name: "Green Leaf Café", type: "Vegan Café", location: "Manhattan, NY" },
              ].map((shop, index) => (
                <div key={index} className="p-4 flex items-center justify-between hover:bg-accent/50">
                  <div>
                    <h4 className="font-semibold">{shop.name}</h4>
                    <p className="text-sm text-muted-foreground">{shop.type} • {shop.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopManagement;
