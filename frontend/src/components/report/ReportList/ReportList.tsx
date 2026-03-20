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
  Center,
  Container,
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
import {
  FiArrowLeft,
  FiFileText,
  FiRefreshCw,
  FiMap,
  FiList,
} from "react-icons/fi";
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

  const pageBg          = useColorModeValue("#F7F8FA", "#0F1117");
  const cardBg          = useColorModeValue("#FFFFFF", "#171B26");
  const cardBorder      = useColorModeValue("rgba(0,0,0,0.07)", "rgba(255,255,255,0.06)");
  const cardShadow      = useColorModeValue(
    "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
    "0 1px 3px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.3)"
  );
  const subtleText      = useColorModeValue("#6B7280", "#8B92A5");
  const strongText      = useColorModeValue("#111827", "#F0F2F7");
  const accentGreen     = useColorModeValue("#16A34A", "#22C55E");
  const accentGreenSoft = useColorModeValue("green.50", "rgba(34,197,94,0.08)");
  const dividerColor    = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.06)");
  const hoverBg         = useColorModeValue("gray.50", "rgba(255,255,255,0.03)");
  const selectBg        = useColorModeValue("#F9FAFB", "#1E2330");
  const emptyIconBg     = useColorModeValue("gray.100", "rgba(255,255,255,0.05)");
  const focusShadow     = useColorModeValue(
    "0 0 0 3px rgba(22,163,74,0.15)",
    "0 0 0 3px rgba(34,197,94,0.15)"
  );

  const cardStyle = {
    bg: cardBg,
    border: "1px solid",
    borderColor: cardBorder,
    borderRadius: "16px",
    boxShadow: cardShadow,
    overflow: "hidden" as const,
  };

  if (typeof window === "undefined") return null;

  if (isLoading) {
    return (
      <Box minH="50vh" bg={pageBg}>
        <Box h="3px" bgGradient="linear(to-r, green.400, teal.400)" />
        <Container maxW="6xl" py={12}>
          <Center h="40vh">
            <VStack spacing={5}>
              <Box
                w={14} h={14} borderRadius="full" bg={accentGreenSoft}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Spinner size="md" color={accentGreen} thickness="3px" />
              </Box>
              <Text color={subtleText} fontSize="sm" letterSpacing="0.03em">
                Loading reports…
              </Text>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="50vh" bg={pageBg}>
        <Box h="3px" bgGradient="linear(to-r, green.400, teal.400)" />
        <Container maxW="6xl" py={12}>
          <Alert
            status="error" borderRadius="xl"
            border="1px solid" borderColor="red.200" bg="red.50"
          >
            <AlertIcon />
            <AlertTitle fontWeight="600">Error loading reports</AlertTitle>
            <AlertDescription>Unable to fetch reports. Please try again later.</AlertDescription>
            <Button
              ml="auto" size="sm" leftIcon={<FiRefreshCw size={13} />}
              onClick={() => mutate()} variant="ghost" colorScheme="red"
            >
              Retry
            </Button>
          </Alert>
        </Container>
      </Box>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <Box minH="50vh" bg={pageBg}>
        <Box h="3px" bgGradient="linear(to-r, green.400, teal.400)" />
        <Container maxW="6xl" py={12}>
          <Center h="40vh">
            <VStack spacing={6} textAlign="center">
              <Box
                w={20} h={20} borderRadius="2xl" bg={emptyIconBg}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Icon as={FiFileText} boxSize={9} color={subtleText} />
              </Box>
              <VStack spacing={1}>
                <Heading size="lg" color={strongText} fontWeight="700">
                  No Reports Available
                </Heading>
                <Text color={subtleText} fontSize="sm" maxW="sm">
                  There are currently no reports to display. Create your first report to get started.
                </Text>
              </VStack>
              <Button
                size="sm" as={NextLink} href="/home"
                leftIcon={<FiFileText size={13} />}
                bg={accentGreen} color="white"
                borderRadius="10px" fontWeight="600" px={5}
                _hover={{ opacity: 0.9, transform: "translateY(-1px)" }}
                transition="all 0.15s"
              >
                Go to Home
              </Button>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={pageBg}>
      <Box h="3px" bgGradient="linear(to-r, green.400, teal.400)" />

      <Container maxW="6xl" py={10}>
        <VStack spacing={6} align="stretch">

          <Box {...cardStyle} px={6} py={5}>
            <HStack justify="space-between" align="center">
              <HStack spacing={4}>
                <Button
                  as={NextLink} href="/home"
                  leftIcon={<FiArrowLeft size={13} />}
                  variant="ghost" size="sm"
                  color={subtleText} fontWeight="500"
                  _hover={{ color: strongText, bg: hoverBg }}
                >
                  Home
                </Button>
                <Box w="1px" h="20px" bg={dividerColor} />
                <VStack align="start" spacing={0.5}>
                  <Heading size="md" color={strongText} fontWeight="700" letterSpacing="-0.02em">
                    Landfill Reports
                  </Heading>
                  <Text fontSize="xs" color={subtleText} fontWeight="500">
                    Overview of all sites and reports
                  </Text>
                </VStack>
              </HStack>

              <Box
                bg={accentGreenSoft}
                border="1px solid" borderColor={dividerColor}
                borderRadius="10px" px={4} py={2} textAlign="center"
              >
                <Text fontSize="xl" fontWeight="700" color={accentGreen} lineHeight="1">
                  {reports.length}
                </Text>
                <Text fontSize="10px" color={subtleText} fontWeight="600" letterSpacing="0.06em" textTransform="uppercase">
                  Total
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box {...cardStyle}>
            <Box px={6} py={4} borderBottom="1px solid" borderColor={dividerColor}>
              <HStack justify="space-between" align="center">
                <HStack spacing={2}>
                  <Box
                    w={7} h={7} borderRadius="lg" bg={accentGreenSoft}
                    display="flex" alignItems="center" justifyContent="center"
                  >
                    <Icon as={FiMap} color={accentGreen} boxSize={3.5} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="600" fontSize="md" color={strongText}>
                      Landfill Locations
                    </Text>
                    <Text fontSize="xs" color={subtleText}>
                      Interactive map of all active sites and recent reports
                    </Text>
                  </VStack>
                </HStack>
              </HStack>
            </Box>
            <Box p={0} borderRadius="0 0 16px 16px" overflow="hidden">
              <EnhancedLocationMap height={400} showReports={true} />
            </Box>
          </Box>

          <Box {...cardStyle}>
            <Box px={6} py={4} borderBottom="1px solid" borderColor={dividerColor}>
              <HStack justify="space-between" align="center" flexWrap="wrap" gap={3}>
                <HStack spacing={2}>
                  <Box
                    w={7} h={7} borderRadius="lg" bg={accentGreenSoft}
                    display="flex" alignItems="center" justifyContent="center"
                  >
                    <Icon as={FiList} color={accentGreen} boxSize={3.5} />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="600" fontSize="md" color={strongText}>
                      Recent Reports
                    </Text>
                    <Text fontSize="xs" color={subtleText}>
                      {reports.length} report{reports.length !== 1 ? "s" : ""} found
                    </Text>
                  </VStack>
                </HStack>

                <HStack spacing={2} flexWrap="wrap">
                  <Select
                    size="sm"
                    width="160px"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    bg={selectBg}
                    border="1px solid" borderColor={cardBorder}
                    borderRadius="8px"
                    fontSize="sm" fontWeight="500"
                    color={strongText}
                    _hover={{ borderColor: accentGreen }}
                    _focus={{ borderColor: accentGreen, boxShadow: focusShadow }}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </Select>

                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<FiRefreshCw size={13} />}
                    onClick={() => mutate()}
                    color={subtleText}
                    borderRadius="8px"
                    fontWeight="500"
                    _hover={{ color: strongText, bg: hoverBg }}
                  >
                    Refresh
                  </Button>
                </HStack>
              </HStack>
            </Box>

            <Box p={6}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5}>
                {reports.map((report) => (
                  <ReportItem key={report.id} report={report} />
                ))}
              </SimpleGrid>
            </Box>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
};