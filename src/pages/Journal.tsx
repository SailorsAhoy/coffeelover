import { useState } from "react";
import { Plus, Package, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const Journal = () => {
  const [activeTab, setActiveTab] = useState("products");

  // Mock data - will be replaced with real data from Supabase
  const products = [];
  const brews = [];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Brewing Journal</h1>
          <p className="text-muted-foreground">Track your coffee products and brewing sessions</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="brews">Brews</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            {products.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">You have no Products</h3>
                    <p className="text-muted-foreground mb-4">
                      Product is a package of roasted coffee beans, usually a bag of coffee you 
                      buy at your favorite roastery. Once you add a Product, you will see it here.
                    </p>
                    <Link to="/journal/products/new">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Product cards will go here */}
              </div>
            )}
          </TabsContent>

          <TabsContent value="brews" className="space-y-4">
            {brews.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                    <Coffee className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">No Brewing Sessions</h3>
                    <p className="text-muted-foreground mb-4">
                      Start tracking your brewing sessions to perfect your technique and remember 
                      what works best for each coffee.
                    </p>
                    <Link to="/journal/brews/new">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        New Brew
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Brew session cards will go here */}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Journal;
