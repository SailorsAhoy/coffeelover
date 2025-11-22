import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, Star, Truck, Tag, Navigation, 
  Phone, MessageCircle, Globe, Mail, Share2,
  Facebook, Instagram, Twitter
} from "lucide-react";
import { isShopOpen, getTodaySchedule, formatPhoneForWhatsApp } from "@/lib/shopUtils";

interface RoasterCardProps {
  id: number;
  name: string;
  description: string;
  rating: number;
  freeShipping?: boolean;
  hasDiscounts?: boolean;
  specialty: string;
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

const RoasterCard = ({ roaster }: { roaster: RoasterCardProps }) => {
  const isOpen = isShopOpen(roaster.openingHours);
  const todaySchedule = getTodaySchedule(roaster.openingHours);

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
        if (roaster.latitude && roaster.longitude) {
          window.open(`https://www.google.com/maps/search/?api=1&query=${roaster.latitude},${roaster.longitude}`, '_blank');
        }
        break;
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: roaster.name,
            text: roaster.description,
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
              <span>{roaster.name}</span>
              <Badge variant="secondary">
                <Star className="w-3 h-3 mr-1 fill-current" />
                {roaster.rating}
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
        <p className="text-sm text-muted-foreground">{roaster.description}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Package className="w-4 h-4 mr-2" />
            {roaster.specialty}
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
          {roaster.phone && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                handleContact('phone', roaster.phone);
              }}
              className="h-8 px-2"
            >
              <Phone className="w-4 h-4" />
            </Button>
          )}
          {roaster.whatsapp && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                handleContact('whatsapp', roaster.whatsapp);
              }}
              className="h-8 px-2"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          )}
          {roaster.website && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                handleContact('website', roaster.website);
              }}
              className="h-8 px-2"
            >
              <Globe className="w-4 h-4" />
            </Button>
          )}
          {roaster.email && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                handleContact('email', roaster.email);
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
        {(roaster.facebook || roaster.instagram || roaster.twitter) && (
          <div className="flex items-center gap-1">
            {roaster.facebook && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  handleSocial('facebook', roaster.facebook);
                }}
                className="h-8 px-2"
              >
                <Facebook className="w-4 h-4" />
              </Button>
            )}
            {roaster.instagram && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  handleSocial('instagram', roaster.instagram);
                }}
                className="h-8 px-2"
              >
                <Instagram className="w-4 h-4" />
              </Button>
            )}
            {roaster.twitter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  handleSocial('twitter', roaster.twitter);
                }}
                className="h-8 px-2"
              >
                <Twitter className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}

        {/* Service Badges */}
        <div className="flex flex-wrap gap-2">
          {roaster.freeShipping && (
            <Badge variant="outline">
              <Truck className="w-3 h-3 mr-1" />
              Free Shipping
            </Badge>
          )}
          {roaster.hasDiscounts && (
            <Badge variant="outline">
              <Tag className="w-3 h-3 mr-1" />
              Discounts
            </Badge>
          )}
        </div>

        <Link to={`/roaster/${roaster.id}`}>
          <Button className="w-full">View Products</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default RoasterCard;
