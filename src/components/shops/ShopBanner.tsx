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
} from "lucide-react";
import { SHOP_TYPE_COLOR, SHOP_TYPE_LABEL, type Shop } from "@/lib/shopsData";
import { isShopOpen, getTodaySchedule } from "@/lib/shopUtils";

interface Props {
  shop: Shop;
}

export const ShopBanner = ({ shop }: Props) => {
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

  return (
    <div className="relative">
      <div className="relative h-40 w-full overflow-hidden sm:h-56">
        <img
          src={banner}
          alt={`${shop.name} banner`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <Badge
          className="absolute right-3 top-3 gap-1"
          variant={open ? "default" : "secondary"}
        >
          <span
            className={`h-2 w-2 rounded-full ${open ? "bg-emerald-400" : "bg-muted-foreground"}`}
          />
          {open ? "Open now" : "Closed"} · {schedule}
        </Badge>
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
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 px-4 sm:px-6">
        <Button
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={() =>
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${shop.lat},${shop.lng}`,
              "_blank",
            )
          }
        >
          <Navigation className="h-4 w-4" /> Route
        </Button>
        {shop.phone && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={() => window.open(`tel:${shop.phone}`)}
          >
            <Phone className="h-4 w-4" /> Call
          </Button>
        )}
        {shop.whatsapp && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={() =>
              window.open(
                `https://wa.me/${shop.whatsapp!.replace(/\D/g, "")}`,
                "_blank",
              )
            }
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </Button>
        )}
        {shop.website && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={() => window.open(shop.website, "_blank")}
          >
            <Globe className="h-4 w-4" /> Site
          </Button>
        )}
        {shop.email && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={() => window.open(`mailto:${shop.email}`)}
          >
            <Mail className="h-4 w-4" /> Email
          </Button>
        )}
        {shop.instagram && (
          <Button
            size="icon"
            variant="outline"
            onClick={() => window.open(shop.instagram, "_blank")}
            aria-label="Instagram"
          >
            <Instagram className="h-4 w-4" />
          </Button>
        )}
        {shop.facebook && (
          <Button
            size="icon"
            variant="outline"
            onClick={() => window.open(shop.facebook, "_blank")}
            aria-label="Facebook"
          >
            <Facebook className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ShopBanner;
