import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, ExternalLink, Star } from "lucide-react";

const Library = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Books" },
    { id: "brewing", label: "Brewing" },
    { id: "history", label: "History & Culture" },
    { id: "business", label: "Coffee Business" },
    { id: "science", label: "Coffee Science" },
  ];

  const books = [
    {
      id: 1,
      title: "The World Atlas of Coffee",
      author: "James Hoffmann",
      category: "history",
      price: 29.99,
      rating: 4.8,
      reviews: 1247,
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      buyLink: "#",
      description: "From coffee's origins in East Africa to the global industry it is today, explore the history, culture, and agriculture of coffee around the world.",
    },
    {
      id: 2,
      title: "The Coffee Dictionary",
      author: "Maxwell Colonna-Dashwood",
      category: "science",
      price: 24.99,
      rating: 4.6,
      reviews: 892,
      cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      buyLink: "#",
      description: "An A-Z of coffee, from growing and harvesting to roasting and brewing. Understand the science behind the perfect cup.",
    },
    {
      id: 3,
      title: "Espresso Coffee: The Science of Quality",
      author: "Andrea Illy",
      category: "science",
      price: 34.99,
      rating: 4.7,
      reviews: 654,
      cover: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=600&fit=crop",
      buyLink: "#",
      description: "Comprehensive guide to understanding espresso, from bean selection to extraction techniques and equipment.",
    },
    {
      id: 4,
      title: "Craft Coffee: A Manual",
      author: "Jessica Easto",
      category: "brewing",
      price: 19.99,
      rating: 4.5,
      reviews: 1089,
      cover: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=600&fit=crop",
      buyLink: "#",
      description: "Learn how to brew better coffee at home with detailed guides for every brewing method.",
    },
    {
      id: 5,
      title: "The Blue Bottle Craft of Coffee",
      author: "James Freeman",
      category: "brewing",
      price: 27.99,
      rating: 4.4,
      reviews: 743,
      cover: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=600&fit=crop",
      buyLink: "#",
      description: "Growing, roasting, and drinking coffee the Blue Bottle way - with recipes and brewing techniques.",
    },
    {
      id: 6,
      title: "Setting the Table: Coffee Business",
      author: "Colin Harmon",
      category: "business",
      price: 32.99,
      rating: 4.6,
      reviews: 421,
      cover: "https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?w=400&h=600&fit=crop",
      buyLink: "#",
      description: "Learn how to start and run a successful coffee business from industry expert Colin Harmon.",
    },
  ];

  const filteredBooks = selectedCategory === "all" 
    ? books 
    : books.filter(book => book.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Coffee Library</h1>
          <p className="text-muted-foreground">
            Curated collection of the best books about coffee
          </p>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search books..."
            className="max-w-xl"
          />
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            {categories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[2/3] relative overflow-hidden bg-muted">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {book.category.replace("_", " ")}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{book.rating}</span>
                    <span className="text-muted-foreground">({book.reviews})</span>
                  </div>
                </div>
                <CardTitle className="text-xl line-clamp-2">{book.title}</CardTitle>
                <CardDescription className="font-medium">{book.author}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {book.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    ${book.price}
                  </span>
                  <Button size="sm" className="gap-2">
                    Buy Now
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;
