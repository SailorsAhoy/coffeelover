import { useEffect, useState } from "react";

export interface Coords {
  lat: number;
  lng: number;
}

export interface GeolocationState {
  coords: Coords | null;
  error: string | null;
  loading: boolean;
  request: () => void;
}

// Manhattan fallback so distance UI still works without permission.
const FALLBACK: Coords = { lat: 40.7589, lng: -73.9851 };

export const useGeolocation = (autoRequest = true): GeolocationState => {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const request = () => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation not supported");
      setCoords(FALLBACK);
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setCoords(FALLBACK);
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
    );
  };

  useEffect(() => {
    if (autoRequest) request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { coords, error, loading, request };
};
