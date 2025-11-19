import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, Eye, Clock } from "lucide-react";

const Forum = () => {
  const categories = [
    { name: "Brewing Techniques", count: 45, color: "bg-blue-500" },
    { name: "Equipment Reviews", count: 32, color: "bg-green-500" },
    { name: "Bean Recommendations", count: 28, color: "bg-amber-500" },
    { name: "Coffee Shop Visits", count: 56, color: "bg-purple-500" },
  ];

  const latestPosts = [
    {
      id: 1,
      title: "Best grind size for V60 pour over?",
      author: "CoffeeNerd",
      category: "Brewing Techniques",
      replies: 12,
      views: 234,
      likes: 18,
      timeAgo: "2 hours ago",
      excerpt: "I've been experimenting with different grind sizes for my V60 and I'm getting inconsistent results...",
    },
    {
      id: 2,
      title: "Just got a new Comandante grinder - impressed!",
      author: "BaristaLife",
      category: "Equipment Reviews",
      replies: 8,
      views: 156,
      likes: 24,
      timeAgo: "5 hours ago",
      excerpt: "After weeks of research, I finally pulled the trigger on the Comandante C40. First impressions are...",
    },
    {
      id: 3,
      title: "Ethiopian Yirgacheffe recommendations?",
      author: "SingleOrigin",
      category: "Bean Recommendations",
      replies: 15,
      views: 189,
      likes: 21,
      timeAgo: "1 day ago",
      excerpt: "Looking for a fruity, floral Ethiopian Yirgacheffe. Any roasters you'd recommend?",
    },
    {
      id: 4,
      title: "Amazing new coffee shop in Brooklyn",
      author: "NYCCoffeeLover",
      category: "Coffee Shop Visits",
      replies: 6,
      views: 98,
      likes: 14,
      timeAgo: "1 day ago",
      excerpt: "Stumbled upon this gem in Williamsburg. Third wave vibes with incredible espresso...",
    },
    {
      id: 5,
      title: "Cold brew concentrate ratio - what works for you?",
      author: "ColdBrewFan",
      category: "Brewing Techniques",
      replies: 20,
      views: 312,
      likes: 28,
      timeAgo: "2 days ago",
      excerpt: "I've been using a 1:4 ratio but it seems too strong. What ratios do you all use?",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Coffee Forum</h1>
          <p className="text-muted-foreground">
            Connect with coffee enthusiasts, share knowledge, and discuss everything coffee
          </p>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search discussions..."
            className="max-w-xl"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {categories.map((category) => (
            <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`w-3 h-3 rounded-full ${category.color}`} />
                  <Badge variant="secondary">{category.count}</Badge>
                </div>
                <CardTitle className="text-base">{category.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Latest Discussions</h2>
          <Button>New Discussion</Button>
        </div>

        <div className="space-y-4">
          {latestPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{post.category}</Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.timeAgo}
                      </span>
                    </div>
                    <CardTitle className="text-xl mb-2 hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                  </div>
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {post.author.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.replies} replies</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{post.views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{post.likes} likes</span>
                  </div>
                  <div className="ml-auto">
                    <span className="font-medium">by {post.author}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forum;
