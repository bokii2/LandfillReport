"use client";

import { Box, Button, FormControl, FormLabel, Select, Text, Image, Heading } from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import useSWR from "swr";
import { IReport } from "@/typings/Report.type";
import { swrKeys } from "@/fetchers/swrKeys";
import { fetcher } from "@/fetchers/fetcher";
import { useEffect, useState } from "react";
import { api } from "@/fetchers/report";
import { useParams } from "next/navigation";

export const ReportDetails = () => {
    const params = useParams();
    const reportId = params.id;
    
    const reportUrl = reportId ? `${swrKeys.reports}/${reportId}` : null;

    const { data: report, error, isLoading } = useSWR<IReport>(reportUrl, fetcher);

    const [status, setStatus] = useState<string>("");

    useEffect(() => {
        if (report) {
          setStatus(report.status);
        }
    }, [report]);

    if (typeof window === "undefined") return null;
    if (isLoading) return <Text>Loading...</Text>;
    if (error) return <Text>Error loading reports</Text>;
    if (!report) return <Text>Report not found</Text>;

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(event.target.value);
    };

    const mapCenter: LatLngExpression = [51.505, -0.09];
    const imageUrl = report.image ? api.getImageUrl(report.image.id) : undefined;

    return (
    <Box maxW="800px" mx="auto" p={5}>
        <Heading size="lg" mb={4}>Report Location</Heading>
        
        {/* Map */}
        <Box h="400px" mb={4}>
        <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[report.location.latitude, report.location.longitude]}>
            <Popup>Report Location</Popup>
            </Marker>
        </MapContainer>
        </Box>

        {/* Report Info */}
        <Text><strong>Description:</strong>{report?.description}</Text>
        <Text><strong>Created By:</strong>{report?.user.username}</Text>
        <Text><strong>Created At:</strong>{report?.createdAt}</Text>
        <Text><strong>Status:</strong>{report?.status}</Text>

        {/* Image */}
        <Box my={4}>
            <Image src={imageUrl} alt="Report" maxW="300px" />
        </Box>

        {/* Status Dropdown */}
        <FormControl mb={4}>
            <FormLabel>Change Status:</FormLabel>
            <Select value={status} onChange={handleStatusChange}>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
            </Select>
        </FormControl>

        {/* Buttons */}
        <Button colorScheme="blue" mr={2}>Update Status</Button>
        <Button colorScheme="gray">Back to Reports</Button>
    </Box>
    );
};
