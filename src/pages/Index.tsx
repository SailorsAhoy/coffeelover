import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, Store, Package, BookOpen, ShoppingBag, Star, PenLine, GraduationCap, Briefcase, BookMarked, MessageSquare, Library } from "lucide-react";

import imgShops from "@/assets/cards/shops.jpg";
import imgRoasters from "@/assets/cards/roasters.jpg";
import imgCoffee from "@/assets/cards/coffee.jpg";
import imgGuides from "@/assets/cards/guides.jpg";
import imgRecipes from "@/assets/cards/recipes.jpg";
import imgEquipment from "@/assets/cards/equipment.jpg";
import imgJournal from "@/assets/cards/journal.jpg";
import imgAcademy from "@/assets/cards/academy.jpg";
import imgJobs from "@/assets/cards/jobs.jpg";
import imgWiki from "@/assets/cards/wiki.jpg";
import imgForum from "@/assets/cards/forum.jpg";
import imgLibrary from "@/assets/cards/library.jpg";


const Index = () => {
  const features = [
    {
      icon: Store,
      title: "Coffee Shops",
      description: "Discover specialty coffee shops near you with filters and reviews",
      link: "/shops",
      image: imgShops,
    },
    {
      icon: Package,
      title: "Roasters",
      description: "Explore premium roasters and their unique offerings",
      link: "/roasters",
      image: imgRoasters,
    },
    {
      icon: Coffee,
      title: "Coffee Selection",
      description: "Browse and purchase specialty coffee beans",
      link: "/coffee",
      image: imgCoffee,
    },
    {
      icon: BookOpen,
      title: "Brewing Guides",
      description: "Master different brewing methods",
      link: "/guides",
      image: imgGuides,
    },
    {
      icon: BookOpen,
      title: "Recipes",
      description: "Try delicious coffee drink recipes",
      link: "/recipes",
      image: imgRecipes,
    },
    {
      icon: ShoppingBag,
      title: "Equipment",
      description: "Find the perfect machines and accessories",
      link: "/equipment",
      image: imgEquipment,
    },
    {
      icon: PenLine,
      title: "Brewing Journal",
      description: "Track your coffee products and brewing sessions",
      link: "/journal",
      image: imgJournal,
    },
    {
      icon: GraduationCap,
      title: "Barista Academy",
      description: "Learn from expert courses and master coffee techniques",
      link: "/academy",
      image: imgAcademy,
    },
    {
      icon: Briefcase,
      title: "Coffee Jobs",
      description: "Find career opportunities in the coffee industry",
      link: "/jobs",
      image: imgJobs,
    },
    {
      icon: BookMarked,
      title: "Coffee Wiki",
      description: "Explore coffee types, brewing methods, and processing techniques",
      link: "/wiki",
      image: imgWiki,
    },
    {
      icon: MessageSquare,
      title: "Coffee Forum",
      description: "Connect with enthusiasts and share coffee knowledge",
      link: "/forum",
      image: imgForum,
    },
    {
      icon: Library,
      title: "Coffee Library",
      description: "Discover the best books about coffee and brewing",
      link: "/library",
      image: imgLibrary,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-cream via-background to-coffee-light">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-primary rounded-full mb-6">
            <Coffee className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Welcome to CoffeePlanets
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
              <Card className="relative h-full overflow-hidden border-0 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <img
                  src={feature.image}
                  alt=""
                  loading="lazy"
                  width={768}
                  height={512}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-coffee-dark/60" />
                <div className="relative">
                  <CardHeader>
                    <div className="p-3 bg-coffee-cream/20 backdrop-blur-sm rounded-lg w-fit mb-2">
                      <feature.icon className="w-6 h-6 text-coffee-cream" />
                    </div>
                    <CardTitle className="text-coffee-cream">{feature.title}</CardTitle>
                    <CardDescription className="text-coffee-cream/90">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="inline-flex items-center rounded-md bg-background px-3 py-1.5 text-sm font-medium text-coffee-ochre">
                      Explore →
                    </span>
                  </CardContent>
                </div>
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
