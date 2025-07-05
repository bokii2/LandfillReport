"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Box, Text } from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";
import { ILocation } from "@/typings/Location.type";

const createMarkerIcon = () => {
  return new L.Icon({
    iconUrl: "/images/marker-icon-blue.png",
    iconRetinaUrl: "/images/marker-icon-blue-2x.png",
    shadowUrl: "/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

export interface LocationsDisplayMapProps {
  locations: ILocation[];
  height?: number;
}

const LocationsDisplayMap: React.FC<LocationsDisplayMapProps> = ({
  locations,
  height = 400,
}) => {
  const [markerIcon, setMarkerIcon] = useState<L.Icon | null>(null);
  const [center, setCenter] = useState<[number, number]>([41.9981, 21.4254]);

  useEffect(() => {
    setMarkerIcon(createMarkerIcon());

    if (locations && locations.length > 0) {
      setCenter([locations[0].latitude, locations[0].longitude]);
    }
  }, [locations]);

  if (!markerIcon) {
    return null;
  }

  return (
    <Box height={`${height}px`} width="100%">
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={markerIcon}
          >
            <Popup>
              <Box p={1}>
                <Text fontWeight="bold">Location ID: {location.id}</Text>
                <Text>
                  Coordinates: {location.latitude}, {location.longitude}
                </Text>
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default LocationsDisplayMap;
