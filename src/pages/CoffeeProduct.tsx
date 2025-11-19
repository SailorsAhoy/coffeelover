import { Star, ShoppingCart, Truck, Shield, Coffee } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CoffeeProduct = () => {
  const product = {
    name: "Ethiopian Yirgacheffe",
    roaster: "Heritage Coffee Roasters",
    variety: "Heirloom",
    roastLevel: "Light",
    price: 18.99,
    rating: 4.8,
    reviewCount: 124,
    image: "/placeholder.svg",
    origin: "Yirgacheffe, Ethiopia",
    altitude: "1,700 - 2,200 MASL",
    process: "Washed",
    tastingNotes: ["Floral", "Citrus", "Bergamot", "Jasmine", "Black Tea"],
    description: "This exceptional coffee from the Yirgacheffe region showcases the delicate and complex flavors that Ethiopian coffees are renowned for. Grown at high altitudes and processed using traditional washed methods, this coffee offers a clean, bright cup with pronounced floral aromatics and a tea-like body. Perfect for those who appreciate nuanced, elegant coffees.",
    brewRecommendations: "Ideal for pour-over, Aeropress, or drip brewing. Use water at 200°F and a 1:16 coffee-to-water ratio. Grind medium-fine for best results.",
    reviews: [
      {
        user: "Sarah M.",
        rating: 5,
        date: "2 weeks ago",
        comment: "Absolutely amazing! The floral notes are incredible and it has such a clean finish. Best Ethiopian coffee I've tried.",
      },
      {
        user: "James K.",
        rating: 5,
        date: "1 month ago",
        comment: "Perfect for my morning pour-over. The citrus brightness really wakes me up. Will definitely buy again!",
      },
      {
        user: "Maria L.",
        rating: 4,
        date: "1 month ago",
        comment: "Great coffee with beautiful complexity. Slightly too light roast for my preference, but quality is undeniable.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Product Header */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image */}
              <div>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">by {product.roaster}</p>
                  <h1 className="text-4xl font-bold text-foreground mb-3">{product.name}</h1>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{product.variety}</Badge>
                  <Badge variant="secondary">{product.roastLevel} Roast</Badge>
                  <Badge variant="secondary">{product.origin}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Coffee className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Process: {product.process}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Coffee className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Altitude: {product.altitude}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Tasting Notes:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tastingNotes.map((note, idx) => (
                      <Badge key={idx} variant="outline">
                        {note}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold text-primary">${product.price}</span>
                    <span className="text-sm text-muted-foreground">per 12oz bag</span>
                  </div>
                  <Button size="lg" className="w-full mb-3">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      <span>Free shipping on orders over $50</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>Satisfaction guaranteed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="brewing">Brewing Guide</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>About This Coffee</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brewing" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Brewing Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{product.brewRecommendations}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>{product.reviewCount} verified purchases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {product.reviews.map((review, idx) => (
                  <div key={idx} className="pb-6 border-b last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{review.user}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CoffeeProduct;
