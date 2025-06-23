"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Box, Text, Badge, Flex, Link } from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";
import { ILocation } from "@/typings/Location.type";
import { IReport } from "@/typings/Report.type";
import NextLink from "next/link";

// Reuse your existing icon creation function
const createMarkerIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `/images/marker-icon-${color}.png`,
    // iconRetinaUrl: `/images/marker-icon-${color}-2x.png`,
    shadowUrl: "/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

type ColoredLocation = ILocation & { source?: "report" | "prediction" };

export interface EnhancedLocationsDisplayMapProps {
  locations: ColoredLocation[];
  reports?: IReport[];
  height?: number;
}

const EnhancedLocationsDisplayMap: React.FC<
  EnhancedLocationsDisplayMapProps
> = ({ locations, reports = [], height = 400 }) => {
  const [center, setCenter] = useState<[number, number]>([41.9981, 21.4254]); // Default center (Skopje)

  const [reportIcon, setReportIcon] = useState<L.Icon | null>(null);
  const [predictionIcon, setPredictionIcon] = useState<L.Icon | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const normalizedLocations = Array.isArray(locations)
    ? locations
    : locations
    ? [locations]
    : [];
  
  console.log(locations)

  useEffect(() => {
    setReportIcon(createMarkerIcon("blue"));
    setPredictionIcon(createMarkerIcon("red"));

    // If locations are loaded and there's at least one, center the map on the first location
    if (normalizedLocations.length > 0) {
      setCenter([
        normalizedLocations[0].latitude,
        normalizedLocations[0].longitude,
      ]);
    }
  }, [locations]);

  // Get status badge color based on report status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "yellow";
      case "APPROVED":
        return "green";
      case "REJECTED":
        return "red";
      case "IN_PROGRESS":
        return "blue";
      default:
        return "gray";
    }
  };

  // Find reports that match locations for enhanced popups
  const getReportForLocation = (locationId: number) => {
    return reports.find(
      (report) => report.location && report.location.id === locationId
    );
  };

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

        {normalizedLocations.map((location) => {
          const report = getReportForLocation(location.id);

          const icon = location.source === "report" ? reportIcon : predictionIcon;
          if (!icon) return null;

          return (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={icon}
            >
              <Popup maxWidth={300}>
                <Box p={1}>
                  {report ? (
                    <>
                      <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                      >
                        <Text fontWeight="bold" fontSize="md">
                          Report #{report.id}
                        </Text>
                        <Badge colorScheme={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </Flex>

                      <Text mb={2} fontSize="sm" noOfLines={2}>
                        {report.description}
                      </Text>

                      <Text fontSize="xs" color="gray.600" mb={1}>
                        Submitted: {report.createdAt}
                      </Text>

                      <Link
                        as={NextLink}
                        href={`/report/${report.id}`}
                        color="blue.500"
                        fontSize="sm"
                      >
                        View details
                      </Link>
                    </>
                  ) : (
                    <>
                      <Text fontWeight="bold">Location ID: {location.id}</Text>
                      <Text>
                        Coordinates: {location.latitude}, {location.longitude}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Prediction-based location
                      </Text>
                    </>
                  )}
                </Box>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </Box>
  );
};

export default EnhancedLocationsDisplayMap;
