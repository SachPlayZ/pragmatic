import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type MapComponentProps = {
  setCoordinate: (coord: [number, number]) => void;
};

const DEFAULT_COORDINATE: [number, number] = [12.976542, 77.585652];
const DEFAULT_ZOOM = 15;

export default function MapComponent({ setCoordinate }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    // Initialize the map
    leafletMap.current = L.map(mapRef.current).setView(
      DEFAULT_COORDINATE,
      DEFAULT_ZOOM
    );

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(leafletMap.current);

    // Set default marker
    markerRef.current = L.marker(DEFAULT_COORDINATE).addTo(leafletMap.current);
    setCoordinate(DEFAULT_COORDINATE); // Update form with default

    // Handle click to update marker
    leafletMap.current.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setCoordinate([lat, lng]);

      if (markerRef.current) markerRef.current.remove();
      markerRef.current = L.marker([lat, lng]).addTo(leafletMap.current!);
    });
  }, [setCoordinate]);

  return <div ref={mapRef} className="h-64 w-full rounded" />;
}
