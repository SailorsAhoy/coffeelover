import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Shop, SHOP_TYPE_COLOR } from "@/lib/shopsData";
import { isShopOpen } from "@/lib/shopUtils";
import type { Coords } from "@/hooks/useGeolocation";

interface Props {
  shops: (Shop & { distanceKm: number | null; rating: number; reviewCount: number })[];
  center: Coords;
  userLocation: Coords | null;
}

const buildIcon = (color: string, dim: boolean) =>
  L.divIcon({
    className: "shop-marker",
    html: `<div style="background:${color};width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,.3);opacity:${
      dim ? 0.6 : 1
    };"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  });

export const ShopsMapView = ({ shops, center, userLocation }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    mapRef.current = L.map(ref.current).setView([center.lat, center.lng], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 19,
    }).addTo(mapRef.current);
    layerRef.current = L.layerGroup().addTo(mapRef.current);
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!mapRef.current || !layerRef.current) return;
    layerRef.current.clearLayers();

    if (userLocation) {
      L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 7,
        color: "#2563eb",
        fillColor: "#3b82f6",
        fillOpacity: 1,
        weight: 2,
      })
        .addTo(layerRef.current)
        .bindPopup("You are here");
    }

    shops.forEach((s) => {
      const open = isShopOpen(s.opening_hours);
      const m = L.marker([s.lat, s.lng], {
        icon: buildIcon(SHOP_TYPE_COLOR[s.type], !open),
      }).addTo(layerRef.current!);
      m.bindPopup(
        `<div style="min-width:160px"><strong>${s.name}</strong><br/>★ ${s.rating.toFixed(
          1,
        )} (${s.reviewCount}) · ${"$".repeat(s.priceLevel)}<br/><span style="color:${
          open ? "#10b981" : "#ef4444"
        }">${open ? "Open" : "Closed"}</span><br/><a style="color:#3b82f6">Tap marker to view</a></div>`,
      );
      m.on("click", () => navigate(`/shop/${s.id}`));
    });

    const all = shops.map((s) => [s.lat, s.lng] as [number, number]);
    if (userLocation) all.push([userLocation.lat, userLocation.lng]);
    if (all.length > 1) {
      mapRef.current.fitBounds(L.latLngBounds(all), { padding: [30, 30] });
    } else if (all.length === 1) {
      mapRef.current.setView(all[0], 14);
    }
  }, [shops, userLocation, navigate]);

  return (
    <div
      ref={ref}
      className="h-[60vh] w-full overflow-hidden rounded-xl border md:h-[70vh]"
    />
  );
};

export default ShopsMapView;
