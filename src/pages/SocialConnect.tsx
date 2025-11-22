import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

interface User {
  id: number;
  name: string;
  avatar: string;
  lat: number;
  lng: number;
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

  const users: User[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "",
      lat: 40.7589,
      lng: -73.9851,
      socialLinks: { facebook: "#", instagram: "#", twitter: "#" },
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "",
      lat: 40.7614,
      lng: -73.9776,
      socialLinks: { instagram: "#", linkedin: "#" },
    },
    {
      id: 3,
      name: "Emma Wilson",
      avatar: "",
      lat: 40.7489,
      lng: -73.9680,
      socialLinks: { facebook: "#", twitter: "#", linkedin: "#" },
    },
    {
      id: 4,
      name: "James Rodriguez",
      avatar: "",
      lat: 40.7549,
      lng: -73.9840,
      socialLinks: { instagram: "#", twitter: "#" },
    },
  ];

  useEffect(() => {
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

    users.forEach((user) => {
      const marker = L.marker([user.lat, user.lng], { icon: userIcon }).addTo(map.current!);
      marker.bindPopup(`
        <div style="padding: 8px; text-align: center;">
          <h3 style="font-weight: bold; margin-bottom: 4px;">${user.name}</h3>
          <p style="font-size: 12px; color: #3b82f6;">Click to view profile →</p>
        </div>
      `);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Social Connect</h1>
          <p className="text-muted-foreground">Connect with coffee lovers near you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="h-[500px] relative">
                <div ref={mapContainer} className="absolute inset-0" />
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Nearby Users</h2>
            {users.map((user) => (
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
                        <p className="text-sm text-muted-foreground">Coffee Enthusiast</p>
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialConnect;
