'use client';

import { fetcher } from "@/fetchers/fetcher";
import { swrKeys } from "@/fetchers/swrKeys";
import { IReport } from "@/typings/Report.type";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import useSWR from "swr";
import { ReportItem } from "../ReportItem/ReportItem";
import EnhancedLocationMap from "@/components/map/EnhancedLocationMap";


export const ReportList = () => {
    const { data: reports, error, isLoading } = useSWR<IReport[]>(swrKeys.reports, fetcher);
    
    if (typeof window === "undefined") return null;

    if (isLoading) return <Text>Loading...</Text>;
    if (error) return <Text>Error loading reports</Text>;
    if (!reports || reports.length === 0) return <Text>No reports available</Text>;

    console.log(reports);

    return (
        <Flex direction="column" mt={10} width={{ base: '343px', xl: '870px' }}>
            <Box mb={6}>
                <Heading as="h2" size="md" mb={3}>Landfill Locations</Heading>
                <EnhancedLocationMap height={450} showReports={true} />
            </Box>
            
            <Heading as="h2" size="md" mb={3}>Reports</Heading>
            {reports.map((report) => (
                <ReportItem key={report.id} report={report} />
            ))}
        </Flex>
    )
}