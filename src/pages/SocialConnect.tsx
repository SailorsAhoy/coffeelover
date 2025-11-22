import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Search, 
  SlidersHorizontal, 
  MapIcon, 
  List 
} from "lucide-react";

interface User {
  id: number;
  name: string;
  avatar: string;
  lat: number;
  lng: number;
  age: number;
  gender: string;
  language: string;
  coffeePreferences: string[];
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

const SocialConnect = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [proximityRange, setProximityRange] = useState([50]);
  
  const [filters, setFilters] = useState({
    languages: [] as string[],
    ageRange: [18, 65] as number[],
    genders: [] as string[],
    coffeePreferences: [] as string[],
  });

  const users: User[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "",
      lat: 40.7589,
      lng: -73.9851,
      age: 28,
      gender: "Female",
      language: "English",
      coffeePreferences: ["Espresso", "Cappuccino"],
      socialLinks: { facebook: "#", instagram: "#", twitter: "#" },
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "",
      lat: 40.7614,
      lng: -73.9776,
      age: 35,
      gender: "Male",
      language: "English",
      coffeePreferences: ["Pour Over", "Cold Brew"],
      socialLinks: { instagram: "#", linkedin: "#" },
    },
    {
      id: 3,
      name: "Emma Wilson",
      avatar: "",
      lat: 40.7489,
      lng: -73.9680,
      age: 24,
      gender: "Female",
      language: "Spanish",
      coffeePreferences: ["Latte", "Mocha"],
      socialLinks: { facebook: "#", twitter: "#", linkedin: "#" },
    },
    {
      id: 4,
      name: "James Rodriguez",
      avatar: "",
      lat: 40.7549,
      lng: -73.9840,
      age: 42,
      gender: "Male",
      language: "Spanish",
      coffeePreferences: ["Americano", "Espresso"],
      socialLinks: { instagram: "#", twitter: "#" },
    },
  ];

  const initializeMap = () => {
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current).setView([40.7589, -73.9851], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map.current);

    const userIcon = L.divIcon({
      className: "custom-user-marker",
      html: `
        <div style="
          background-color: #8B4513;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

    filteredUsers.forEach((user) => {
      const marker = L.marker([user.lat, user.lng], { icon: userIcon }).addTo(map.current!);
      marker.bindPopup(`
        <div style="padding: 8px; text-align: center;">
          <h3 style="font-weight: bold; margin-bottom: 4px;">${user.name}</h3>
          <p style="font-size: 12px; color: #666;">Age: ${user.age} • ${user.language}</p>
          <p style="font-size: 12px; color: #3b82f6;">Click to view profile →</p>
        </div>
      `);
    });
  };

  useEffect(() => {
    if (showMap) {
      // Delay initialization to ensure DOM is ready
      setTimeout(initializeMap, 100);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [showMap]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = filters.languages.length === 0 || filters.languages.includes(user.language);
    const matchesAge = user.age >= filters.ageRange[0] && user.age <= filters.ageRange[1];
    const matchesGender = filters.genders.length === 0 || filters.genders.includes(user.gender);
    const matchesCoffee = 
      filters.coffeePreferences.length === 0 || 
      user.coffeePreferences.some(pref => filters.coffeePreferences.includes(pref));

    return matchesSearch && matchesLanguage && matchesAge && matchesGender && matchesCoffee;
  });

  const handleLanguageToggle = (language: string) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleGenderToggle = (gender: string) => {
    setFilters(prev => ({
      ...prev,
      genders: prev.genders.includes(gender)
        ? prev.genders.filter(g => g !== gender)
        : [...prev.genders, gender]
    }));
  };

  const handleCoffeeToggle = (preference: string) => {
    setFilters(prev => ({
      ...prev,
      coffeePreferences: prev.coffeePreferences.includes(preference)
        ? prev.coffeePreferences.filter(p => p !== preference)
        : [...prev.coffeePreferences, preference]
    }));
  };

  const UserCard = ({ user }: { user: User }) => (
    <Link key={user.id} to={`/profile/${user.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-xs text-muted-foreground">{user.age} • {user.language}</p>
              <p className="text-xs text-muted-foreground">{user.coffeePreferences.join(", ")}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {user.socialLinks.facebook && (
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Facebook className="h-4 w-4" />
              </Button>
            )}
            {user.socialLinks.instagram && (
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Instagram className="h-4 w-4" />
              </Button>
            )}
            {user.socialLinks.twitter && (
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
            )}
            {user.socialLinks.linkedin && (
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Linkedin className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Social Connect</h1>
          <p className="text-muted-foreground">Connect with coffee lovers near you</p>
        </div>

        {/* Search and Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Proximity Range */}
          <div className="flex items-center gap-3 sm:w-64">
            <Label className="text-sm whitespace-nowrap">Range: {proximityRange[0]}km</Label>
            <Slider
              value={proximityRange}
              onValueChange={setProximityRange}
              max={100}
              step={5}
              className="flex-1"
            />
          </div>

          {/* Filters Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Customize your search criteria
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                {/* Language Filter */}
                <div>
                  <Label className="mb-3 block">Language</Label>
                  <div className="space-y-2">
                    {["English", "Spanish", "French", "German"].map((lang) => (
                      <div key={lang} className="flex items-center space-x-2">
                        <Checkbox
                          id={lang}
                          checked={filters.languages.includes(lang)}
                          onCheckedChange={() => handleLanguageToggle(lang)}
                        />
                        <Label htmlFor={lang} className="cursor-pointer">{lang}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Age Range */}
                <div>
                  <Label className="mb-3 block">
                    Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
                  </Label>
                  <Slider
                    value={filters.ageRange}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, ageRange: value }))}
                    max={80}
                    min={18}
                    step={1}
                    className="mt-2"
                  />
                </div>

                {/* Gender Filter */}
                <div>
                  <Label className="mb-3 block">Gender</Label>
                  <div className="space-y-2">
                    {["Male", "Female", "Non-binary", "Other"].map((gender) => (
                      <div key={gender} className="flex items-center space-x-2">
                        <Checkbox
                          id={gender}
                          checked={filters.genders.includes(gender)}
                          onCheckedChange={() => handleGenderToggle(gender)}
                        />
                        <Label htmlFor={gender} className="cursor-pointer">{gender}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coffee Preferences */}
                <div>
                  <Label className="mb-3 block">Coffee Preferences</Label>
                  <div className="space-y-2">
                    {["Espresso", "Cappuccino", "Latte", "Americano", "Pour Over", "Cold Brew", "Mocha"].map((pref) => (
                      <div key={pref} className="flex items-center space-x-2">
                        <Checkbox
                          id={pref}
                          checked={filters.coffeePreferences.includes(pref)}
                          onCheckedChange={() => handleCoffeeToggle(pref)}
                        />
                        <Label htmlFor={pref} className="cursor-pointer">{pref}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* View Toggle */}
          <Button
            variant={showMap ? "default" : "outline"}
            onClick={() => setShowMap(!showMap)}
          >
            {showMap ? (
              <>
                <List className="h-4 w-4 mr-2" />
                List View
              </>
            ) : (
              <>
                <MapIcon className="h-4 w-4 mr-2" />
                Map View
              </>
            )}
          </Button>
        </div>

        {/* Map or List View */}
        {showMap ? (
          <div className="relative h-[75vh]">
            <Card className="h-full overflow-hidden">
              <div ref={mapContainer} className="h-full w-full" />
            </Card>
            
            {/* Pull-up Drawer with User List */}
            <Drawer open={true}>
              <DrawerContent className="h-[25vh]">
                <div className="overflow-y-auto px-4 py-2">
                  <h3 className="text-lg font-semibold mb-3">
                    Nearby Users ({filteredUsers.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredUsers.map((user) => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">
              Nearby Users ({filteredUsers.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialConnect;
