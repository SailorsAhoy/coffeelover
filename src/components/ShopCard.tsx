import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, Star, Wifi, Croissant, TreePine, Navigation, 
  Phone, MessageCircle, Globe, Mail, Share2,
  Facebook, Instagram, Twitter
} from "lucide-react";
import { isShopOpen, getTodaySchedule, formatPhoneForWhatsApp } from "@/lib/shopUtils";

interface ShopCardProps {
  id: number;
  name: string;
  description: string;
  rating: number;
  distance: string;
  hasWifi?: boolean;
  hasBakery?: boolean;
  hasOutdoor?: boolean;
  openingHours?: any;
  phone?: string;
  whatsapp?: string;
  website?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  latitude?: number;
  longitude?: number;
}

const ShopCard = ({ shop }: { shop: ShopCardProps }) => {
  const isOpen = isShopOpen(shop.openingHours);
  const todaySchedule = getTodaySchedule(shop.openingHours);

  const handleContact = (type: string, value?: string) => {
    if (!value) return;
    
    switch (type) {
      case 'phone':
        window.open(`tel:${value}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${formatPhoneForWhatsApp(value)}`, '_blank');
        break;
      case 'website':
        window.open(value, '_blank');
        break;
      case 'email':
        window.open(`mailto:${value}`, '_blank');
        break;
      case 'directions':
        if (shop.latitude && shop.longitude) {
          window.open(`https://www.google.com/maps/search/?api=1&query=${shop.latitude},${shop.longitude}`, '_blank');
        }
        break;
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: shop.name,
            text: shop.description,
            url: window.location.href,
          });
        }
        break;
    }
  };

  const handleSocial = (platform: string, url?: string) => {
    if (url) window.open(url, '_blank');
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span>{shop.name}</span>
              <Badge variant="secondary">
                <Star className="w-3 h-3 mr-1 fill-current" />
                {shop.rating}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant={isOpen ? "default" : "secondary"}>
                {isOpen ? "Open" : "Closed"}
              </Badge>
              <span className="text-muted-foreground">{todaySchedule}</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{shop.description}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            {shop.distance} away
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              handleContact('directions');
            }}
            className="h-8 px-2"
          >
            <Navigation className="w-4 h-4" />
          </Button>
        </div>

        {/* Contact Icons */}
        <div className="flex items-center gap-1">
          {shop.phone && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                handleContact('phone', shop.phone);
              }}
              className="h-8 px-2"
            >
              <Phone className="w-4 h-4" />
            </Button>
          )}
          {shop.whatsapp && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                handleContact('whatsapp', shop.whatsapp);
              }}
              className="h-8 px-2"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          )}
          {shop.website && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                handleContact('website', shop.website);
              }}
              className="h-8 px-2"
            >
              <Globe className="w-4 h-4" />
            </Button>
          )}
          {shop.email && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                handleContact('email', shop.email);
              }}
              className="h-8 px-2"
            >
              <Mail className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              handleContact('share');
            }}
            className="h-8 px-2"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Social Links */}
        {(shop.facebook || shop.instagram || shop.twitter) && (
          <div className="flex items-center gap-1">
            {shop.facebook && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  handleSocial('facebook', shop.facebook);
                }}
                className="h-8 px-2"
              >
                <Facebook className="w-4 h-4" />
              </Button>
            )}
            {shop.instagram && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  handleSocial('instagram', shop.instagram);
                }}
                className="h-8 px-2"
              >
                <Instagram className="w-4 h-4" />
              </Button>
            )}
            {shop.twitter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  handleSocial('twitter', shop.twitter);
                }}
                className="h-8 px-2"
              >
                <Twitter className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}

        {/* Service Icons */}
        <div className="flex flex-wrap gap-2">
          {shop.hasWifi && (
            <Badge variant="outline">
              <Wifi className="w-3 h-3 mr-1" />
              WiFi
            </Badge>
          )}
          {shop.hasBakery && (
            <Badge variant="outline">
              <Croissant className="w-3 h-3 mr-1" />
              Bakery
            </Badge>
          )}
          {shop.hasOutdoor && (
            <Badge variant="outline">
              <TreePine className="w-3 h-3 mr-1" />
              Outdoor
            </Badge>
          )}
        </div>

        <Link to={`/shop/${shop.id}`}>
          <Button className="w-full">View Profile</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ShopCard;
