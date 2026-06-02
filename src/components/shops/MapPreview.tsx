import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  lat: number;
  lng: number;
  className?: string;
}

/** Small read-only map preview with a pin at lat/lng. */
export const MapPreview = ({ lat, lng, className }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = L.map(ref.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
    }).setView([lat, lng], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);
    markerRef.current = L.marker([lat, lng]).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    mapRef.current.setView([lat, lng], 15);
    markerRef.current.setLatLng([lat, lng]);
  }, [lat, lng]);

  return (
    <div
      ref={ref}
      className={`h-32 w-full overflow-hidden rounded-md border ${className ?? ""}`}
      aria-label="Map preview"
    />
  );
};

export default MapPreview;
