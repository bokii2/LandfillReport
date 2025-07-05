"use client";

import React, { useEffect, useRef } from "react";
import { Box, Spinner } from "@chakra-ui/react";
// Import the Leaflet types but don't load the actual module on the server
import type L from "leaflet";
// Import our CSS loader helper

// Define the props for our map component
export interface LeafletMapProps {
  latitude: number;
  longitude: number;
  onPositionChange: (lat: number, lng: number) => void;
  selectable?: boolean;
  height?: number;
}

const loadLeafletCSS = (): void => {
  // Only run in browser
  if (typeof window === "undefined") return;

  // Check if Leaflet CSS is already loaded
  if (document.querySelector('link[href*="leaflet.css"]')) return;

  // Create link element
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
  link.crossOrigin = "";

  // Append to head
  document.head.appendChild(link);
};

/**
 * A client-side only Leaflet map component that directly handles Leaflet setup
 * without using react-leaflet to avoid TypeScript issues.
 */
const LeafletMap: React.FC<LeafletMapProps> = ({
  latitude,
  longitude,
  onPositionChange,
  selectable = true,
  height = 400,
}) => {
  // Use refs to store Leaflet objects
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Track if the map is loaded
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Helper type for Leaflet
  type LeafletType = typeof import("leaflet");

  // Initialize the map when the component mounts
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Dynamically import Leaflet on the client side only
    const initializeMap = async () => {
      try {
        // Load Leaflet CSS
        loadLeafletCSS();

        // Dynamic import of Leaflet
        const L: LeafletType = await import("leaflet");

        // Only initialize if the map container exists and map isn't already initialized
        if (mapRef.current && !mapInstanceRef.current) {
          // Create the map
          const map = L.map(mapRef.current).setView([latitude, longitude], 13);

          // Add tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);

          // Create a custom icon
          const icon = L.icon({
            iconUrl: "/images/marker-icon-blue.png",
            iconRetinaUrl: "/images/marker-icon-blue-2x.png",
            shadowUrl: "/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });

          // Add a marker
          const marker = L.marker([latitude, longitude], { icon }).addTo(map);

          // Set up click handler for selecting locations
          if (selectable) {
            map.on("click", (e: L.LeafletMouseEvent) => {
              const { lat, lng } = e.latlng;
              marker.setLatLng([lat, lng]);
              onPositionChange(lat, lng);
            });
          }

          // Store references to map and marker
          mapInstanceRef.current = map;
          markerRef.current = marker;

          // Trigger a resize to ensure map renders correctly
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

    // Clean up on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Update marker position when coordinates change
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
