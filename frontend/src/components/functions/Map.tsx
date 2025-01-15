import { useEffect, useRef } from "react";
import { OlaMaps } from "../OlaMapsWebSDKNew";
import "maplibre-gl/dist/maplibre-gl.css";

interface Marker {
  longitude: number;
  latitude: number;
  color?: string;
}

interface MapComponentProps {
  setCoordinate: (coordinate: [number, number]) => void;
  defaultCenter?: [number, number];
}

const MapComponent = ({
  setCoordinate,
  defaultCenter = [77.61648476788898, 12.931423492103944],
}: MapComponentProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  // Example marker location
  const marker: Marker = {
    longitude: 77.61648476788898,
    latitude: 12.931423492103944,
    color: "red",
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const olaMaps = new OlaMaps({
      apiKey: `${import.meta.env.VITE_PUBLIC_API_KEY}`,
    });

    mapInstance.current = olaMaps.init({
      container: mapContainerRef.current,
      style:
        "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
      center: defaultCenter,
      zoom: 15,
      transformRequest: (url: string) => {
        if (url.includes("?")) {
          url += `&api_key=${import.meta.env.VITE_PUBLIC_API_KEY}`;
        } else {
          url += `?api_key=${import.meta.env.VITE_PUBLIC_API_KEY}`;
        }
        return { url };
      },
    });

    const geolocate = olaMaps.addGeolocateControls({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });

    const navigationControls = olaMaps.addNavigationControls({
      showCompass: true,
      showZoom: false,
      visualizePitch: false,
    });

    mapInstance.current.on("click", (e: any) => {
      const { lng, lat } = e.lngLat;
      console.log(`Longitude: ${lng}, Latitude: ${lat}`);

      // Remove existing marker if any
      if (mapInstance.current.marker) {
        mapInstance.current.marker.remove();
      }

      // Add new marker
      mapInstance.current.marker = olaMaps
        .addMarker({
          offset: [0, 0], // [x, y] offset from the marker's anchor point
          anchor: "bottom", // can be 'center', 'top', 'bottom', 'left', 'right'
          color: marker.color,
        })
        .setLngLat([lng, lat])
        .addTo(mapInstance.current);

      setCoordinate([lng, lat]);
    });

    mapInstance.current.addControl(navigationControls, "top-left");
    mapInstance.current.addControl(geolocate, "top-left");

    mapInstance.current.on("load", () => {
      geolocate.trigger();
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "200px" }} />
  );
};

export default MapComponent;
