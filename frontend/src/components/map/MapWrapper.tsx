"use client";

import React from "react";
import { Box, Spinner } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { IReport } from "@/typings/Report.type";

export interface MapWrapperProps {
  latitude: number;
  longitude: number;
  onPositionChange: (lat: number, lng: number) => void;
  selectable?: boolean;
  height?: number;
  reports?: IReport[];
}

const DynamicMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <Box
      height="300px"
      bg="gray.100"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Spinner size="xl" color="blue.500" />
    </Box>
  ),
});

const MapWrapper: React.FC<MapWrapperProps> = (props) => {
  return <DynamicMap {...props} />;
};

export default MapWrapper;
