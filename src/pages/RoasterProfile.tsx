import { MapPin, Globe, Star, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const RoasterProfile = () => {
  const roaster = {
    name: "Heritage Coffee Roasters",
    tagline: "Crafting excellence since 1985",
    rating: 4.9,
    location: "Portland, Oregon",
    website: "https://heritage-roasters.example",
    story: "Founded in 1985, Heritage Coffee Roasters began as a small family operation with a passion for exceptional coffee. Our founders traveled the world to source the finest beans directly from farmers, building relationships that last to this day. We believe in sustainable practices, fair trade, and the art of traditional roasting methods combined with modern precision. Every batch is carefully crafted to bring out the unique characteristics of each origin, ensuring that every cup tells a story of quality and dedication.",
    team: [
      { name: "John Anderson", role: "Master Roaster", bio: "30+ years of roasting experience" },
      { name: "Maria Santos", role: "Head of Sourcing", bio: "Expert in sustainable coffee sourcing" },
      { name: "David Chen", role: "Quality Control", bio: "Former barista champion" },
      { name: "Sarah Williams", role: "Operations Manager", bio: "15 years in specialty coffee" },
    ],
    coffees: [
      {
        id: 1,
        image: "/placeholder.svg",
        name: "Ethiopian Yirgacheffe",
        variety: "Heirloom",
        roastLevel: "Light",
        price: 18.99,
        description: "Floral notes with bright citrus acidity",
      },
      {
        id: 2,
        image: "/placeholder.svg",
        name: "Colombian Supremo",
        variety: "Caturra",
        roastLevel: "Medium",
        price: 16.99,
        description: "Balanced body with caramel sweetness",
      },
      {
        id: 3,
        image: "/placeholder.svg",
        name: "Sumatra Mandheling",
        variety: "Typica",
        roastLevel: "Dark",
        price: 17.99,
        description: "Full-bodied with earthy undertones",
      },
      {
        id: 4,
        image: "/placeholder.svg",
        name: "Guatemala Antigua",
        variety: "Bourbon",
        roastLevel: "Medium",
        price: 17.49,
        description: "Chocolate notes with spicy finish",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">H</span>
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">{roaster.name}</h1>
                    <p className="text-muted-foreground italic">{roaster.tagline}</p>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    {roaster.rating}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {roaster.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <a href={roaster.website} className="hover:text-primary transition-colors">
                      {roaster.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Our Story */}
        <Card>
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{roaster.story}</p>
          </CardContent>
        </Card>

        {/* Meet the Team */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Meet Our Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {roaster.team.map((member, idx) => (
                <div key={idx} className="p-4 rounded-lg border bg-card space-y-2">
                  <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{member.name[0]}</span>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-primary">{member.role}</p>
                    <p className="text-xs text-muted-foreground mt-1">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Our Coffee Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Our Coffee Selection</CardTitle>
            <CardDescription>Premium single-origin and specialty blends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {roaster.coffees.map((coffee) => (
                <Card key={coffee.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={coffee.image}
                    alt={coffee.name}
                    className="w-full h-40 object-cover"
                  />
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{coffee.name}</CardTitle>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Variety: {coffee.variety}</span>
                        <Badge variant="outline" className="text-xs">
                          {coffee.roastLevel}
                        </Badge>
                      </div>
                      <p className="text-xs italic">{coffee.description}</p>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">${coffee.price}</span>
                      <span className="text-xs text-muted-foreground">per 12oz</span>
                    </div>
                    <Link to={`/coffee/${coffee.id}`}>
                      <Button className="w-full">View Product</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoasterProfile;
