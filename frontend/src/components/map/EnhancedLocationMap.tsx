'use client';

import { fetcher } from "@/fetchers/fetcher";
import { swrKeys } from "@/fetchers/swrKeys";
import useSWR from "swr";
import { Box, Text, Spinner, Center } from "@chakra-ui/react";
import { ILocation } from '@/typings/Location.type';
import { IReport } from '@/typings/Report.type';
import dynamic from 'next/dynamic';

const EnhancedLocationsDisplayMap = dynamic(() => import('./EnhancedLocationsDisplayMap'), {
  ssr: false,
  loading: () => (
    <Center h="400px" bg="gray.100" borderRadius="md">
      <Spinner size="xl" color="blue.500" />
    </Center>
  )
});

export interface EnhancedLocationMapProps {
  showReports?: boolean;
  height?: number;
}

export const EnhancedLocationMap: React.FC<EnhancedLocationMapProps> = ({ 
  showReports = true,
  height = 400
}) => {
  const { data: locations, error: locationsError, isLoading: locationsLoading } = useSWR<ILocation[]>(swrKeys.locations, fetcher);
  
  // Only fetch reports if we need to show them
  const { data: reports, error: reportsError, isLoading: reportsLoading } = useSWR<IReport[]>(swrKeys.reports, fetcher);
  
  const isLoading = locationsLoading || (showReports && reportsLoading);
  const error = locationsError || (showReports && reportsError);
  
  if (isLoading) {
    return (
      <Center h={`${height}px`} bg="gray.100" borderRadius="md">
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Center>
    );
  }
  
  if (error) {
    return (
      <Center h={`${height}px`} bg="gray.100" borderRadius="md">
        <Text color="red.500">Error loading map data</Text>
      </Center>
    );
  }
  
  if (!locations || locations.length === 0) {
    return (
      <Center h={`${height}px`} bg="gray.100" borderRadius="md">
        <Text>No locations available to display</Text>
      </Center>
    );
  }

  return (
    <Box width="100%" height={`${height}px`} borderRadius="md" overflow="hidden" mt={4}>
      <EnhancedLocationsDisplayMap 
        locations={locations} 
        reports={showReports ? reports : []} 
        height={height}
      />
    </Box>
  );
};

export default EnhancedLocationMap;