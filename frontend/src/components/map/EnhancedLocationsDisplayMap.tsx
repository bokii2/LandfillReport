"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Box, Text, Badge, Flex, Link } from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";
import { ILocation } from "@/typings/Location.type";
import { IReport } from "@/typings/Report.type";
import NextLink from "next/link";

const createMarkerIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `/images/marker-icon-${color}.png`,
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
  showPopups?: boolean;
}

const EnhancedLocationsDisplayMap: React.FC<EnhancedLocationsDisplayMapProps> = ({
  locations,
  reports = [],
  height = 400,
  showPopups = true,
}) => {
  const [center, setCenter] = useState<[number, number]>([41.9981, 21.4254]);
  const [icons, setIcons] = useState<Record<string, L.Icon>>({});

  const normalizedLocations = Array.isArray(locations)
    ? locations
    : locations
    ? [locations]
    : [];

  useEffect(() => {
    setIcons({
      blue: createMarkerIcon("blue"),
      red:  createMarkerIcon("red"),
    });

    if (normalizedLocations.length > 0) {
      setCenter([normalizedLocations[0].latitude, normalizedLocations[0].longitude]);
    }
  }, [locations]);

  const getReportForLocation = (locationId: number) => {
    return reports.find(
      (report) => report.location && report.location.id === locationId
    );
  };

  // Red for pending, blue for everything else, skip predictions
  const getMarkerColor = (location: ColoredLocation): string => {
    if (location.source === "prediction") return "skip";
    const report = getReportForLocation(location.id);
    return report?.status === "PENDING" ? "red" : "blue";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":     return "yellow";
      case "APPROVED":    return "green";
      case "REJECTED":    return "red";
      case "IN_PROGRESS": return "blue";
      default:            return "gray";
    }
  };

  return (
    <Box
      height={`${height}px`}
      width="100%"
      position="relative"
      sx={{
        ".leaflet-popup-content-wrapper": {
          borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.06)",
          padding: 0,
          overflow: "hidden",
        },
        ".leaflet-popup-content": {
          margin: 0,
          width: "220px !important",
        },
        ".leaflet-popup-tip": {
          boxShadow: "none",
        },
        ".leaflet-tile": {
          filter: "saturate(0.85) brightness(1.02)",
        },
      }}
    >
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: "100%", width: "100%", borderRadius: "inherit" }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {normalizedLocations.map((location) => {
          const report = getReportForLocation(location.id);
          const color = getMarkerColor(location);
          if (color === "skip") return null;
          const icon = icons[color];
          if (!icon) return null;

          return (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={icon}
            >
              {showPopups && (
                <Popup maxWidth={220}>
                  <Box>
                    {report ? (
                      <Box>
                        <Box
                          px={4} py={3}
                          bg="gray.50"
                          borderBottom="1px solid"
                          borderColor="gray.100"
                        >
                          <Flex justifyContent="space-between" alignItems="center">
                            <Text
                              fontWeight="700" fontSize="13px"
                              color="gray.800" letterSpacing="-0.01em"
                            >
                              Report #{report.id}
                            </Text>
                            <Badge
                              colorScheme={getStatusColor(report.status)}
                              variant="subtle" borderRadius="full"
                              px={2} py={0.5}
                              fontSize="10px" fontWeight="600"
                              letterSpacing="0.04em" textTransform="uppercase"
                            >
                              {report.status}
                            </Badge>
                          </Flex>
                        </Box>

                        <Box px={4} py={3}>
                          <Text
                            mb={2} fontSize="12px" color="gray.600"
                            lineHeight="1.6" noOfLines={2}
                          >
                            {report.description}
                          </Text>
                          <Text fontSize="11px" color="gray.400" mb={3}>
                            {report.createdAt}
                          </Text>
                          <Link
                            as={NextLink}
                            href={`/report/${report.id}`}
                            fontSize="12px" fontWeight="600" color="green.600"
                            _hover={{ color: "green.700", textDecoration: "none" }}
                            display="inline-flex" alignItems="center" gap={1}
                          >
                            View details →
                          </Link>
                        </Box>
                      </Box>
                    ) : (
                      <Box px={4} py={3}>
                        <Text fontWeight="700" fontSize="13px" color="gray.800" mb={1}>
                          Location #{location.id}
                        </Text>
                        <Text fontSize="12px" color="gray.500" mb={1}>
                          {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                        </Text>
                        <Badge
                          colorScheme="purple" variant="subtle"
                          borderRadius="full" px={2} py={0.5}
                          fontSize="10px" fontWeight="600"
                          textTransform="uppercase" letterSpacing="0.04em"
                        >
                          Prediction
                        </Badge>
                      </Box>
                    )}
                  </Box>
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </Box>
  );
};

export default EnhancedLocationsDisplayMap;