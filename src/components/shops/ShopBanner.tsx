import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Globe,
  Mail,
  MessageCircle,
  Navigation,
  Instagram,
  Facebook,
  MapPin,
  ChevronLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import ShopEditSheet from "@/components/shops/ShopEditSheet";
import { SHOP_TYPE_COLOR, SHOP_TYPE_LABEL, type Shop } from "@/lib/shopsData";
import { isShopOpen, getTodaySchedule } from "@/lib/shopUtils";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface Props {
  shop: Shop;
}

export const ShopBanner = ({ shop }: Props) => {
  const { can } = useCurrentUser();
  const open = isShopOpen(shop.opening_hours);
  const schedule = getTodaySchedule(shop.opening_hours);
  const color = SHOP_TYPE_COLOR[shop.type];

  const fallback = shop.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const banner =
    shop.banner ??
    `https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1200&q=70&auto=format`;

  const directions = `https://www.google.com/maps/search/?api=1&query=${shop.lat},${shop.lng}`;

  return (
    <div className="relative">
      <div className="relative h-32 w-full overflow-hidden sm:h-44">
        <img
          src={banner}
          alt={`${shop.name} banner`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-black/20" />

        <Link
          to="/shops"
          className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium backdrop-blur"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Shops
        </Link>

        <Badge
          className="absolute right-2 top-2 gap-1 backdrop-blur"
          variant={open ? "default" : "secondary"}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              open ? "bg-emerald-400" : "bg-muted-foreground"
            }`}
          />
          {open ? "Open" : "Closed"} · {schedule}
        </Badge>

        {can("list_shop") && (
          <div className="absolute bottom-2 right-2">
            <ShopEditSheet shop={shop} />
          </div>
        )}
      </div>

      <div className="-mt-10 flex items-end gap-3 px-4 sm:px-6">
        <Avatar
          className="h-20 w-20 border-4 border-background shadow-md"
          style={{ backgroundColor: color }}
        >
          <AvatarImage src={shop.avatar ?? shop.image} alt={shop.name} />
          <AvatarFallback
            className="text-lg font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {fallback}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 pb-2">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            {SHOP_TYPE_LABEL[shop.type]} · {"$".repeat(shop.priceLevel)}
          </div>
          <h1 className="truncate text-xl font-bold leading-tight sm:text-2xl">
            {shop.name}
          </h1>
          {shop.address && (
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
            >
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{shop.address}</span>
            </a>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 px-4 sm:px-6">
        <Button
          asChild
          size="sm"
          variant="outline"
          className="gap-1"
        >
          <a href={directions} target="_blank" rel="noopener noreferrer">
            <Navigation className="h-4 w-4" /> Directions
          </a>
        </Button>
        {shop.phone && (
          <Button asChild size="sm" variant="outline" className="gap-1">
            <a href={`tel:${shop.phone}`}>
              <Phone className="h-4 w-4" /> Call
            </a>
          </Button>
        )}
        {shop.whatsapp && (
          <Button asChild size="sm" variant="outline" className="gap-1">
            <a
              href={`https://wa.me/${shop.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </Button>
        )}
        {shop.email && (
          <Button asChild size="sm" variant="outline" className="gap-1">
            <a href={`mailto:${shop.email}`}>
              <Mail className="h-4 w-4" /> Email
            </a>
          </Button>
        )}
        {shop.website && (
          <Button asChild size="sm" variant="outline" className="gap-1">
            <a href={shop.website} target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4" /> Site
            </a>
          </Button>
        )}
        {shop.instagram && (
          <Button asChild size="icon" variant="outline" aria-label="Instagram">
            <a href={shop.instagram} target="_blank" rel="noopener noreferrer">
              <Instagram className="h-4 w-4" />
            </a>
          </Button>
        )}
        {shop.facebook && (
          <Button asChild size="icon" variant="outline" aria-label="Facebook">
            <a href={shop.facebook} target="_blank" rel="noopener noreferrer">
              <Facebook className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ShopBanner;
