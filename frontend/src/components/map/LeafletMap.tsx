"use client";

import React, { useEffect, useRef } from "react";
import { Box, Spinner } from "@chakra-ui/react";
import type L from "leaflet";

export interface LeafletMapProps {
  latitude: number;
  longitude: number;
  onPositionChange: (lat: number, lng: number) => void;
  selectable?: boolean;
  height?: number;
}

const loadLeafletCSS = (): void => {
  if (typeof window === "undefined") return;

  if (document.querySelector('link[href*="leaflet.css"]')) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
  link.crossOrigin = "";

  document.head.appendChild(link);
};

const LeafletMap: React.FC<LeafletMapProps> = ({
  latitude,
  longitude,
  onPositionChange,
  selectable = true,
  height = 400,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [isLoaded, setIsLoaded] = React.useState(false);

  type LeafletType = typeof import("leaflet");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initializeMap = async () => {
      try {
        loadLeafletCSS();

        const L: LeafletType = await import("leaflet");

        if (mapRef.current && !mapInstanceRef.current) {
          const map = L.map(mapRef.current).setView([latitude, longitude], 13);

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);

          const icon = L.icon({
            iconUrl: "/images/marker-icon-blue.png",
            iconRetinaUrl: "/images/marker-icon-blue-2x.png",
            shadowUrl: "/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });

          const marker = L.marker([latitude, longitude], { icon }).addTo(map);

          if (selectable) {
            map.on("click", (e: L.LeafletMouseEvent) => {
              const { lat, lng } = e.latlng;
              marker.setLatLng([lat, lng]);
              onPositionChange(lat, lng);
            });
          }

          mapInstanceRef.current = map;
          markerRef.current = marker;

          window.setTimeout(() => {
            map.invalidateSize();
          }, 0);

          setIsLoaded(true);
        }
      } catch (error) {
        console.error("Error initializing Leaflet map:", error);
      }
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
      mapInstanceRef.current.setView([latitude, longitude]);
    }
  }, [latitude, longitude]);

  return (
    <Box position="relative" height={`${height}px`} width="100%">
      {!isLoaded && (
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="gray.100"
        >
          <Spinner size="xl" color="blue.500" />
        </Box>
      )}
      <Box
        ref={mapRef}
        id="leaflet-map"
        height="100%"
        width="100%"
        zIndex={1}
      />
    </Box>
  );
};

export default LeafletMap;
