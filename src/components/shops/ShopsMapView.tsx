import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Shop, SHOP_TYPE_COLOR, SHOP_TYPE_LABEL } from "@/lib/shopsData";
import { isShopOpen } from "@/lib/shopUtils";
import type { Coords } from "@/hooks/useGeolocation";

interface Props {
  shops: (Shop & { distanceKm: number | null; rating: number; reviewCount: number })[];
  center: Coords;
  userLocation: Coords | null;
}

const FALLBACK_AVATAR =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' fill='%23EBC176'/><text x='50%' y='55%' font-size='18' text-anchor='middle' fill='white' font-family='sans-serif'>%E2%98%95</text></svg>";

const buildIcon = (color: string, dim: boolean, avatarUrl: string) =>
  L.divIcon({
    className: "shop-marker",
    html: `<div style="position:relative;width:44px;height:54px;opacity:${dim ? 0.65 : 1};">
      <div style="position:absolute;left:50%;top:0;transform:translateX(-50%);width:44px;height:44px;border-radius:50%;background:${color};padding:3px;box-shadow:0 2px 6px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;">
        <img src="${avatarUrl}" onerror="this.src='${FALLBACK_AVATAR}'" style="width:100%;height:100%;border-radius:50%;object-fit:cover;border:2px solid white;display:block;" />
      </div>
      <div style="position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:12px solid ${color};filter:drop-shadow(0 2px 2px rgba(0,0,0,.3));"></div>
    </div>`,
    iconSize: [44, 54],
    iconAnchor: [22, 54],
    popupAnchor: [0, -50],
  });

export const ShopsMapView = ({ shops, center, userLocation }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const openShopRef = useRef<number | null>(null);
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
    openShopRef.current = null;

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
      const color = SHOP_TYPE_COLOR[s.type];
      const avatar = s.avatar || s.banner || s.image || FALLBACK_AVATAR;
      const m = L.marker([s.lat, s.lng], {
        icon: buildIcon(color, !open, avatar),
      }).addTo(layerRef.current!);

      const banner = s.banner || s.image || s.avatar || FALLBACK_AVATAR;
      const typeLabel = SHOP_TYPE_LABEL[s.type];
      const price = "$".repeat(s.priceLevel);
      const popupHtml = `
        <div class="shop-mini-card" data-shop-id="${s.id}" style="width:240px;cursor:pointer;font-family:inherit;">
          <div style="position:relative;width:100%;height:110px;border-radius:8px;overflow:hidden;margin-bottom:8px;">
            <img src="${banner}" onerror="this.src='${FALLBACK_AVATAR}'" style="width:100%;height:100%;object-fit:cover;display:block;" />
            <button type="button" class="shop-mini-close" aria-label="Close" style="position:absolute;top:6px;right:6px;width:24px;height:24px;border-radius:50%;background:rgba(0,0,0,.6);color:white;border:none;font-size:14px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;">×</button>
          </div>
          <div style="font-weight:600;font-size:15px;margin-bottom:2px;color:#1f1f1f;">${s.name}</div>
          <div style="font-size:12px;color:${color};font-weight:600;margin-bottom:4px;">${typeLabel}</div>
          <div style="font-size:13px;color:#555;display:flex;gap:8px;align-items:center;">
            <span>★ ${s.rating.toFixed(1)} <span style="color:#888">(${s.reviewCount})</span></span>
            <span>·</span>
            <span>${price}</span>
          </div>
          <div style="font-size:11px;color:#3b82f6;margin-top:6px;">Tap again to open profile →</div>
        </div>`;

      m.bindPopup(popupHtml, { closeButton: false, offset: [0, -4] });

      m.on("click", () => {
        if (openShopRef.current === s.id && m.isPopupOpen()) {
          navigate(`/shop/${s.id}`);
        } else {
          m.openPopup();
        }
      });

      m.on("popupopen", () => {
        openShopRef.current = s.id;
        const root = document.querySelector(`.shop-mini-card[data-shop-id="${s.id}"]`);
        if (!root) return;
        const closeBtn = root.querySelector(".shop-mini-close");
        closeBtn?.addEventListener("click", (e) => {
          e.stopPropagation();
          m.closePopup();
        });
        root.addEventListener("click", (e) => {
          if ((e.target as HTMLElement).closest(".shop-mini-close")) return;
          navigate(`/shop/${s.id}`);
        });
      });

      m.on("popupclose", () => {
        if (openShopRef.current === s.id) openShopRef.current = null;
      });
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
