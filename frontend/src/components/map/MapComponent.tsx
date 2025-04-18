'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Box } from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';

// Fix for TypeScript and Leaflet icon issues
// We create our own marker icon to avoid the _getIconUrl issue
const createMarkerIcon = () => {
  return new L.Icon({
    iconUrl: '/images/marker-icon.png',
    iconRetinaUrl: '/images/marker-icon-2x.png',
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Map marker when position is selected
interface LocationMarkerProps {
  position: [number, number];
  onPositionChange: (lat: number, lng: number) => void;
  selectable: boolean;
}

function LocationMarker({ position, onPositionChange, selectable }: LocationMarkerProps) {
  const [markerPosition, setMarkerPosition] = useState<[number, number]>(position);
  const [markerIcon, setMarkerIcon] = useState<L.Icon | null>(null);
  
  useEffect(() => {
    setMarkerIcon(createMarkerIcon());
  }, []);
  
  useEffect(() => {
    setMarkerPosition(position);
  }, [position]);
  
  const map = useMapEvents({
    click(e) {
      if (selectable) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        onPositionChange(lat, lng);
      }
    },
  });
  
  useEffect(() => {
    map.setView(markerPosition, map.getZoom());
  }, [map, markerPosition]);

  return markerIcon ? <Marker position={markerPosition} icon={markerIcon} /> : null;
}

export interface MapComponentProps {
  latitude: number;
  longitude: number;
  onPositionChange: (lat: number, lng: number) => void;
  selectable?: boolean;
  height?: number;
}

export const MapComponent: React.FC<MapComponentProps> = ({ 
  latitude, 
  longitude, 
  onPositionChange, 
  selectable = false,
  height = 400
}) => {
  const position: [number, number] = [latitude, longitude];
  
  return (
    <Box height={`${height}px`} width="100%">
      <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker 
          position={position} 
          onPositionChange={onPositionChange}
          selectable={selectable}
        />
      </MapContainer>
    </Box>
  );
};