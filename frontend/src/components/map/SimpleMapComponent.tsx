'use client';

import React, { useEffect, useState } from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import type L from 'leaflet';

interface SimpleMapComponentProps {
  latitude: number;
  longitude: number;
  onPositionChange: (lat: number, lng: number) => void;
  selectable?: boolean;
  height?: number;
}

const SimpleMapComponent: React.FC<SimpleMapComponentProps> = ({
  latitude,
  longitude,
  onPositionChange,
  selectable = false,
  height = 400
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [leaflet, setLeaflet] = useState<typeof L | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);

  useEffect(() => {
    // Import Leaflet on client-side only
    const loadLeaflet = async () => {
      try {
        const L = (await import('leaflet')).default;
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('leaflet/dist/leaflet.css');
        setLeaflet(L);
        setMapLoaded(true);
      } catch (error) {
        console.error('Failed to load Leaflet:', error);
      }
    };
    
    loadLeaflet();
    
    // Cleanup
    return () => {
      if (map) map.remove();
    };
  }, []);

  // Initialize map when Leaflet is loaded
  useEffect(() => {
    if (!mapLoaded || !leaflet || !document) return;
    
    // Create map container if it doesn't exist
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;
    
    // Create map
    const newMap = leaflet.map('map-container').setView([latitude, longitude], 13);
    
    // Add tile layer
    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(newMap);
    
    // Create custom icon
    const icon = leaflet.icon({
      iconUrl: '/images/marker-icon.png',
      iconRetinaUrl: '/images/marker-icon-2x.png',
      shadowUrl: '/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    // Add marker
    const newMarker = leaflet.marker([latitude, longitude], { icon }).addTo(newMap);
    
    // Add click handler if selectable
    if (selectable) {
      newMap.on('click', (e) => {
        const { lat, lng } = e.latlng;
        newMarker.setLatLng([lat, lng]);
        onPositionChange(lat, lng);
      });
    }
    
    setMap(newMap);
    setMarker(newMarker);
    
    // Force a resize to ensure map renders correctly
    setTimeout(() => {
      newMap.invalidateSize();
    }, 0);
    
  }, [mapLoaded, leaflet, latitude, longitude, onPositionChange, selectable]);
  
  // Update marker position when props change
  useEffect(() => {
    if (map && marker && (marker.getLatLng().lat !== latitude || marker.getLatLng().lng !== longitude)) {
      marker.setLatLng([latitude, longitude]);
      map.panTo([latitude, longitude]);
    }
  }, [map, marker, latitude, longitude]);

  return (
    <Box position="relative" height={`${height}px`} width="100%">
      {!mapLoaded && (
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
      <Box id="map-container" height="100%" width="100%" />
    </Box>
  );
};

export default SimpleMapComponent;