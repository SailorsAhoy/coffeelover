import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Book, ExternalLink, Star, SlidersHorizontal, X } from "lucide-react";

const Library = () => {
  const [category, setCategory] = useState("all");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [language, setLanguage] = useState("all");
  const [open, setOpen] = useState(false);

  const categories = [
    { id: "all", label: "All categories" },
    { id: "brewing", label: "Brewing" },
    { id: "history", label: "History & Culture" },
    { id: "business", label: "Coffee Business" },
    { id: "science", label: "Coffee Science" },
  ];

  const languages = [
    { id: "all", label: "All languages" },
    { id: "en", label: "English" },
    { id: "es", label: "Spanish" },
    { id: "fr", label: "French" },
    { id: "it", label: "Italian" },
    { id: "de", label: "German" },
  ];

  const books = [
    { id: 1, title: "The World Atlas of Coffee", author: "James Hoffmann", category: "history", language: "en", price: 29.99, rating: 4.8, reviews: 1247, cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop", buyLink: "#", description: "From coffee's origins in East Africa to the global industry it is today, explore the history, culture, and agriculture of coffee around the world." },
    { id: 2, title: "The Coffee Dictionary", author: "Maxwell Colonna-Dashwood", category: "science", language: "en", price: 24.99, rating: 4.6, reviews: 892, cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop", buyLink: "#", description: "An A-Z of coffee, from growing and harvesting to roasting and brewing. Understand the science behind the perfect cup." },
    { id: 3, title: "Espresso Coffee: The Science of Quality", author: "Andrea Illy", category: "science", language: "it", price: 34.99, rating: 4.7, reviews: 654, cover: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=600&fit=crop", buyLink: "#", description: "Comprehensive guide to understanding espresso, from bean selection to extraction techniques and equipment." },
    { id: 4, title: "Craft Coffee: A Manual", author: "Jessica Easto", category: "brewing", language: "en", price: 19.99, rating: 4.5, reviews: 1089, cover: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=600&fit=crop", buyLink: "#", description: "Learn how to brew better coffee at home with detailed guides for every brewing method." },
    { id: 5, title: "The Blue Bottle Craft of Coffee", author: "James Freeman", category: "brewing", language: "en", price: 27.99, rating: 4.4, reviews: 743, cover: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=600&fit=crop", buyLink: "#", description: "Growing, roasting, and drinking coffee the Blue Bottle way - with recipes and brewing techniques." },
    { id: 6, title: "Setting the Table: Coffee Business", author: "Colin Harmon", category: "business", language: "en", price: 32.99, rating: 4.6, reviews: 421, cover: "https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?w=400&h=600&fit=crop", buyLink: "#", description: "Learn how to start and run a successful coffee business from industry expert Colin Harmon." },
  ];

  const filteredBooks = useMemo(() => {
    const t = title.trim().toLowerCase();
    const a = author.trim().toLowerCase();
    return books.filter((b) => {
      if (category !== "all" && b.category !== category) return false;
      if (language !== "all" && b.language !== language) return false;
      if (t && !b.title.toLowerCase().includes(t)) return false;
      if (a && !b.author.toLowerCase().includes(a)) return false;
      return true;
    });
  }, [books, category, language, title, author]);

  const activeCount = [
    category !== "all",
    language !== "all",
    title.trim().length > 0,
    author.trim().length > 0,
  ].filter(Boolean).length;

  const clearAll = () => {
    setCategory("all");
    setLanguage("all");
    setTitle("");
    setAuthor("");
  };

  const activeChips = [
    category !== "all" && { key: "cat", label: categories.find((c) => c.id === category)?.label, onRemove: () => setCategory("all") },
    language !== "all" && { key: "lang", label: languages.find((l) => l.id === language)?.label, onRemove: () => setLanguage("all") },
    title.trim() && { key: "title", label: `Title: ${title.trim()}`, onRemove: () => setTitle("") },
    author.trim() && { key: "author", label: `Author: ${author.trim()}`, onRemove: () => setAuthor("") },
  ].filter(Boolean) as { key: string; label: string; onRemove: () => void }[];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 pb-24">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Coffee Library</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Curated collection of the best books about coffee
          </p>
        </div>

        {/* Filter trigger */}
        <div className="flex items-center gap-2 mb-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {activeCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={8}
              className="w-[calc(100vw-2rem)] max-w-sm p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Find books</h3>
                {activeCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearAll}>
                    Clear all
                  </Button>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="f-category" className="text-xs">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="f-category"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="f-title" className="text-xs">Title</Label>
                <Input id="f-title" placeholder="e.g. World Atlas" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="f-author" className="text-xs">Author</Label>
                <Input id="f-author" placeholder="e.g. James Hoffmann" value={author} onChange={(e) => setAuthor(e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="f-language" className="text-xs">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="f-language"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {languages.map((l) => (
                      <SelectItem key={l.id} value={l.id}>{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={() => setOpen(false)}>
                Show {filteredBooks.length} book{filteredBooks.length === 1 ? "" : "s"}
              </Button>
            </PopoverContent>
          </Popover>

          <span className="text-xs text-muted-foreground ml-auto">
            {filteredBooks.length} result{filteredBooks.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeChips.map((chip) => (
              <Badge key={chip.key} variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                <span className="text-xs">{chip.label}</span>
                <button
                  type="button"
                  onClick={chip.onRemove}
                  className="rounded-full hover:bg-background/60 p-0.5"
                  aria-label={`Remove ${chip.label}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {filteredBooks.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Book className="w-10 h-10 mx-auto mb-3 opacity-60" />
            <p className="text-sm">No books match your filters.</p>
            <Button variant="link" onClick={clearAll} className="mt-1">Clear filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[2/3] relative overflow-hidden bg-muted">
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
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
                    <span className="text-2xl font-bold text-primary">${book.price}</span>
                    <Button size="sm" className="gap-2">
                      Buy Now
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
