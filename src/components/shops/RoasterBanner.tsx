import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Phone, Globe, Mail, MessageCircle, Navigation,
  Instagram, Facebook, MapPin, Truck, Tag,
} from "lucide-react";
import RoasterEditSheet from "@/components/shops/RoasterEditSheet";
import type { Roaster } from "@/lib/roastersData";
import { isShopOpen, getTodaySchedule } from "@/lib/shopUtils";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const ROASTER_COLOR = "#C48B28";

export const RoasterBanner = ({ roaster }: { roaster: Roaster }) => {
  const { user, hasRole, can } = useCurrentUser();
  const open = isShopOpen(roaster.opening_hours);
  const schedule = getTodaySchedule(roaster.opening_hours);
  const isOwnerOfThis =
    !!user && (roaster.ownerUserId === user.id || roaster.createdBy === user.id);
  const canEdit = hasRole("admin") || isOwnerOfThis || can("list_roaster");

  const fallback = roaster.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const banner = roaster.banner ?? "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&q=70&auto=format";
  const directions = `https://www.google.com/maps/search/?api=1&query=${roaster.lat},${roaster.lng}`;

  return (
    <div className="relative">
      <div className="relative h-[148px] w-full overflow-hidden sm:h-[196px]">
        <img src={banner} alt={`${roaster.name} banner`} className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-black/25" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <Badge className="absolute right-2 top-2 z-20 gap-1 backdrop-blur" variant={open ? "default" : "secondary"}>
          <span className={`h-2 w-2 rounded-full ${open ? "bg-emerald-400" : "bg-muted-foreground"}`} />
          {open ? "Open" : "Closed"} · {schedule}
        </Badge>
        {canEdit && (
          <div className="absolute bottom-2 right-2 z-20">
            <RoasterEditSheet roaster={roaster} />
          </div>
        )}
      </div>

      <div className="relative z-10 mt-1.5 flex items-center gap-3 px-4 sm:px-6">
        <Avatar className="border-4 border-background shadow-md" style={{ backgroundColor: ROASTER_COLOR, height: 60, width: 60 }}>
          <AvatarImage src={roaster.avatar} alt={roaster.name} />
          <AvatarFallback className="text-base font-bold text-white" style={{ backgroundColor: ROASTER_COLOR }}>
            {fallback}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ROASTER_COLOR }} />
            Roaster
            {roaster.country && <span> · {roaster.country}</span>}
          </div>
          <h1 className="truncate text-xl font-bold leading-tight sm:text-2xl">{roaster.name}</h1>
          {roaster.address && (
            <a href={directions} target="_blank" rel="noopener noreferrer"
              className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{roaster.address}</span>
            </a>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 px-4 sm:px-6">
        <Button asChild size="sm" variant="outline" className="gap-1">
          <a href={directions} target="_blank" rel="noopener noreferrer">
            <Navigation className="h-4 w-4" /> Directions
          </a>
        </Button>
        {roaster.phone && (
          <Button asChild size="sm" variant="outline" className="gap-1"><a href={`tel:${roaster.phone}`}><Phone className="h-4 w-4" /> Call</a></Button>
        )}
        {roaster.whatsapp && (
          <Button asChild size="sm" variant="outline" className="gap-1">
            <a href={`https://wa.me/${roaster.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </Button>
        )}
        {roaster.email && (
          <Button asChild size="sm" variant="outline" className="gap-1"><a href={`mailto:${roaster.email}`}><Mail className="h-4 w-4" /> Email</a></Button>
        )}
        {roaster.website && (
          <Button asChild size="sm" variant="outline" className="gap-1"><a href={roaster.website} target="_blank" rel="noopener noreferrer"><Globe className="h-4 w-4" /> Site</a></Button>
        )}
        {roaster.instagram && (
          <Button asChild size="icon" variant="outline" aria-label="Instagram"><a href={roaster.instagram} target="_blank" rel="noopener noreferrer"><Instagram className="h-4 w-4" /></a></Button>
        )}
        {roaster.facebook && (
          <Button asChild size="icon" variant="outline" aria-label="Facebook"><a href={roaster.facebook} target="_blank" rel="noopener noreferrer"><Facebook className="h-4 w-4" /></a></Button>
        )}
        {roaster.offersFreeShipping && (
          <Badge variant="outline" className="gap-1"><Truck className="h-3 w-3" /> Free shipping</Badge>
        )}
        {roaster.hasDiscountCoupons && (
          <Badge variant="outline" className="gap-1"><Tag className="h-3 w-3" /> Discounts</Badge>
        )}
      </div>
    </div>
  );
};

export default RoasterBanner;
