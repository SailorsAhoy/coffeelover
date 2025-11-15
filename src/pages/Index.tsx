import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, Store, Package, BookOpen, ShoppingBag, Star } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Store,
      title: "Coffee Shops",
      description: "Discover specialty coffee shops near you with filters and reviews",
      link: "/shops",
    },
    {
      icon: Package,
      title: "Roasters",
      description: "Explore premium roasters and their unique offerings",
      link: "/roasters",
    },
    {
      icon: Coffee,
      title: "Coffee Selection",
      description: "Browse and purchase specialty coffee beans",
      link: "/coffee",
    },
    {
      icon: BookOpen,
      title: "Brewing Guides",
      description: "Master different brewing methods",
      link: "/guides",
    },
    {
      icon: BookOpen,
      title: "Recipes",
      description: "Try delicious coffee drink recipes",
      link: "/recipes",
    },
    {
      icon: ShoppingBag,
      title: "Equipment",
      description: "Find the perfect machines and accessories",
      link: "/equipment",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-cream via-background to-coffee-light">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-primary rounded-full mb-6">
            <Coffee className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Welcome to CoffeeMart
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Your complete specialty coffee marketplace - discover shops, roasters, 
            premium beans, brewing guides, and equipment all in one place
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link to="/shops">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explore Shops
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link key={feature.title} to={feature.link}>
              <Card className="h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mb-2">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-start p-0">
                    Explore →
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <Store className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl">500+</CardTitle>
              <CardDescription>Coffee Shops</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl">200+</CardTitle>
              <CardDescription>Roasters</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl">10K+</CardTitle>
              <CardDescription>Reviews</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
