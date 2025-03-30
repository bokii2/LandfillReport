'use client';

import { fetcher } from "@/fetchers/fetcher";
import { swrKeys } from "@/fetchers/swrKeys";
import { IReport } from "@/typings/Report.type";
import { Flex, Text } from "@chakra-ui/react";
import useSWR from "swr";
import { ReportItem } from "../ReportItem/ReportItem";


export const ReportList = () => {
    const { data: reports, error, isLoading } = useSWR<IReport[]>(swrKeys.reports, fetcher);
    
    if (typeof window === "undefined") return null;

    if (isLoading) return <Text>Loading...</Text>;
    if (error) return <Text>Error loading reports</Text>;
    if (!reports || reports.length === 0) return <Text>No reports available</Text>;

    console.log(reports);

    return (
        <Flex direction="column" mt={10} width={{ base: '343px', xl: '870px' }}>
            {reports.map((report) => (
                <ReportItem key={report.id} report={report} />
            ))}
        </Flex>
    )
}