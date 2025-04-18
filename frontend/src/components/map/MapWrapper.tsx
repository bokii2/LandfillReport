'use client';

import React from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

// Define the props type for our map component
export interface MapWrapperProps {
  latitude: number;
  longitude: number;
  onPositionChange: (lat: number, lng: number) => void;
  selectable?: boolean;
  height?: number;
}

const DynamicMap = dynamic(
    () => import('./LeafletMap'),
    {
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
      )
    }
  );
  

/**
 * Wrapper for the Map component that handles client-side rendering
 */
const MapWrapper: React.FC<MapWrapperProps> = (props) => {
  return <DynamicMap {...props} />;
};

export default MapWrapper;