'use client';

import { fetcher } from "@/fetchers/fetcher";
import { swrKeys } from "@/fetchers/swrKeys";
import useSWR from "swr";
import { Box, Text } from "@chakra-ui/react";
import { ILocation } from '@/typings/Location.type';
import dynamic from 'next/dynamic';

const LocationsDisplayMap = dynamic(() => import('./LocationsDisplayMap'), {
  ssr: false,
  loading: () => <Text>Loading map...</Text>
});

export const LocationMap = () => {
  const { data: locations, error, isLoading } = useSWR<ILocation[]>(swrKeys.locations, fetcher);
  
  if (isLoading) return <Text>Loading map data...</Text>;
  if (error) return <Text>Error loading map data</Text>;
  if (!locations || locations.length === 0) return <Text>No locations available to display on map</Text>;

  return (
    <Box width="100%" height="400px" borderRadius="md" overflow="hidden" mt={4}>
      <LocationsDisplayMap locations={locations} />
    </Box>
  );
};

export default LocationMap;