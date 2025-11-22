import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2 } from "lucide-react";

const ContentManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <CardDescription>Manage articles, guides, recipes, and courses</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="guides">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="recipes">Recipes</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="wiki">Wiki</TabsTrigger>
            </TabsList>

            <TabsContent value="guides" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Preparation Guides</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Guide
                </Button>
              </div>
              <div className="border rounded-lg divide-y">
                {["Espresso Basics", "Pour Over Technique", "French Press Guide"].map((guide, index) => (
                  <div key={index} className="p-4 flex items-center justify-between hover:bg-accent/50">
                    <span className="font-medium">{guide}</span>
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
            </TabsContent>

            <TabsContent value="recipes" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Coffee Recipes</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Recipe
                </Button>
              </div>
              <div className="border rounded-lg divide-y">
                {["Classic Latte", "Cold Brew", "Cappuccino"].map((recipe, index) => (
                  <div key={index} className="p-4 flex items-center justify-between hover:bg-accent/50">
                    <span className="font-medium">{recipe}</span>
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
            </TabsContent>

            <TabsContent value="courses" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Academy Courses</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
              </div>
              <div className="border rounded-lg divide-y">
                {["Barista Fundamentals", "Coffee Roasting 101", "Latte Art Mastery"].map((course, index) => (
                  <div key={index} className="p-4 flex items-center justify-between hover:bg-accent/50">
                    <span className="font-medium">{course}</span>
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
            </TabsContent>

            <TabsContent value="wiki" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Wiki Articles</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Article
                </Button>
              </div>
              <div className="border rounded-lg divide-y">
                {["Coffee Origins", "Brewing Methods", "Coffee Bean Types"].map((article, index) => (
                  <div key={index} className="p-4 flex items-center justify-between hover:bg-accent/50">
                    <span className="font-medium">{article}</span>
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManagement;
