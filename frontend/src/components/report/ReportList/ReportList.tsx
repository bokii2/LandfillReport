"use client";

import { fetcher } from "@/fetchers/fetcher";
import { swrKeys } from "@/fetchers/swrKeys";
import { IReport } from "@/typings/Report.type";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Container,
  Divider,
  Heading,
  HStack,
  Icon,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import useSWR from "swr";
import { ReportItem } from "../ReportItem/ReportItem";
import EnhancedLocationMap from "@/components/map/EnhancedLocationMap";
import { FiArrowLeft, FiFileText, FiRefreshCw } from "react-icons/fi";
import NextLink from "next/link";
import { useState } from "react";

export const ReportList = () => {
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const {
    data: reports,
    error,
    isLoading,
    mutate,
  } = useSWR<IReport[]>(`${swrKeys.reports}?status=${selectedStatus}`, fetcher);
  const [isGenerating, setIsGenerating] = useState(false);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");

  if (typeof window === "undefined") return null;

  // Inside the ReportList component:
  const handleGeneratePredictions = async () => {
    setIsGenerating(true);

    try {
      await fetcher(`${swrKeys.predictions}/generate`);
      await mutate();
      window.location.reload();
    } catch (err) {
      console.error("Error generating predictions", err);
      alert("Failed to generate predictions.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <Box minH="50vh" bg={bgColor}>
        <Container maxW="7xl" py={8}>
          <Center h="40vh">
            <VStack spacing={4}>
              <Spinner size="xl" color="green.500" />
              <Text color={textColor}>Loading reports...</Text>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  // Error State
  if (error) {
    return (
      <Box minH="50vh" bg={bgColor}>
        <Container maxW="7xl" py={8}>
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <AlertTitle>Error loading reports!</AlertTitle>
            <AlertDescription>
              Unable to fetch reports. Please try again later.
            </AlertDescription>
            <Button
              ml="auto"
              size="sm"
              leftIcon={<FiRefreshCw />}
              onClick={() => mutate()}
            >
              Retry
            </Button>
          </Alert>
        </Container>
      </Box>
    );
  }

  // Empty State
  if (!reports || reports.length === 0) {
    return (
      <Box minH="50vh" bg={bgColor}>
        <Container maxW="7xl" py={8}>
          <Center h="40vh">
            <VStack spacing={6} textAlign="center">
              <Icon as={FiFileText} boxSize={16} color="gray.400" />
              <VStack spacing={2}>
                <Heading size="lg" color={headingColor}>
                  No Reports Available
                </Heading>
                <Text color={textColor} maxW="md">
                  There are currently no reports to display. Create your first
                  report to get started.
                </Text>
              </VStack>
              <Button colorScheme="green" leftIcon={<FiFileText />} as={NextLink} href={`/home`}>
                Home
              </Button>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Map Section */}
          <Card bg={cardBgColor} borderColor={borderColor}>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Heading size="lg" color={headingColor}>
                      Landfill Locations
                    </Heading>
                    <Text color={textColor} fontSize="sm">
                      Interactive map showing all active landfill sites and
                      recent reports
                    </Text>
                  </VStack>
                  <Button
                    size="sm"
                    variant="outline"
                    as={NextLink}
                    href={`/home`}
                    leftIcon={<FiArrowLeft />}
                  >
                    Home
                  </Button>
                </HStack>

                <EnhancedLocationMap height={400} showReports={true} />
              </VStack>
            </CardBody>
          </Card>

          <Divider />

          {/* Reports Section */}
          <VStack spacing={6} align="stretch">
            <HStack justify="space-between">
              <VStack align="start" spacing={1}>
                <Heading size="lg" color={headingColor}>
                  Recent Reports
                </Heading>
                <Text color={textColor} fontSize="sm">
                  {reports.length} report{reports.length !== 1 ? "s" : ""} found
                </Text>
              </VStack>
              <HStack spacing={3}>
                <Select
                  size="sm"
                  width="200px"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="ALL">All</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </Select>
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<FiRefreshCw />}
                  onClick={() => mutate()}
                >
                  Refresh
                </Button>
                <Button size="sm" colorScheme="green" leftIcon={<FiFileText />} onClick={handleGeneratePredictions} isLoading={isGenerating}>
                  Generate New Predictions
                </Button>
              </HStack>
            </HStack>

            {/* Reports Grid */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              {reports.map((report) => (
                <ReportItem key={report.id} report={report} />
              ))}
            </SimpleGrid>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};
