// "use client";

// import { fetcher } from "@/fetchers/fetcher";
// import { swrKeys } from "@/fetchers/swrKeys";
// import { IReport } from "@/typings/Report.type";
// import {
//   Alert,
//   AlertDescription,
//   AlertIcon,
//   AlertTitle,
//   Box,
//   Button,
//   Card,
//   CardBody,
//   Center,
//   Container,
//   Divider,
//   Heading,
//   HStack,
//   Icon,
//   Select,
//   SimpleGrid,
//   Spinner,
//   Text,
//   useColorModeValue,
//   VStack,
// } from "@chakra-ui/react";
// import useSWR from "swr";
// import { ReportItem } from "../ReportItem/ReportItem";
// import EnhancedLocationMap from "@/components/map/EnhancedLocationMap";
// import { FiArrowLeft, FiFileText, FiRefreshCw } from "react-icons/fi";
// import NextLink from "next/link";
// import { useState } from "react";

// export const ReportList = () => {
//   const [selectedStatus, setSelectedStatus] = useState("ALL");

//   const {
//     data: reports,
//     error,
//     isLoading,
//     mutate,
//   } = useSWR<IReport[]>(`${swrKeys.reports}?status=${selectedStatus}`, fetcher);
//   const [isGenerating, setIsGenerating] = useState(false);

//   const bgColor = useColorModeValue("gray.50", "gray.900");
//   const cardBgColor = useColorModeValue("white", "gray.800");
//   const borderColor = useColorModeValue("gray.200", "gray.700");
//   const textColor = useColorModeValue("gray.600", "gray.300");
//   const headingColor = useColorModeValue("gray.800", "white");

//   if (typeof window === "undefined") return null;

//   // Inside the ReportList component:
//   const handleGeneratePredictions = async () => {
//     setIsGenerating(true);

//     try {
//       await fetcher(`${swrKeys.predictions}/generate`);
//       await mutate();
//       window.location.reload();
//     } catch (err) {
//       console.error("Error generating predictions", err);
//       alert("Failed to generate predictions.");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // Loading State
//   if (isLoading) {
//     return (
//       <Box minH="50vh" bg={bgColor}>
//         <Container maxW="7xl" py={8}>
//           <Center h="40vh">
//             <VStack spacing={4}>
//               <Spinner size="xl" color="green.500" />
//               <Text color={textColor}>Loading reports...</Text>
//             </VStack>
//           </Center>
//         </Container>
//       </Box>
//     );
//   }

//   // Error State
//   if (error) {
//     return (
//       <Box minH="50vh" bg={bgColor}>
//         <Container maxW="7xl" py={8}>
//           <Alert status="error" borderRadius="lg">
//             <AlertIcon />
//             <AlertTitle>Error loading reports!</AlertTitle>
//             <AlertDescription>
//               Unable to fetch reports. Please try again later.
//             </AlertDescription>
//             <Button
//               ml="auto"
//               size="sm"
//               leftIcon={<FiRefreshCw />}
//               onClick={() => mutate()}
//             >
//               Retry
//             </Button>
//           </Alert>
//         </Container>
//       </Box>
//     );
//   }

//   // Empty State
//   if (!reports || reports.length === 0) {
//     return (
//       <Box minH="50vh" bg={bgColor}>
//         <Container maxW="7xl" py={8}>
//           <Center h="40vh">
//             <VStack spacing={6} textAlign="center">
//               <Icon as={FiFileText} boxSize={16} color="gray.400" />
//               <VStack spacing={2}>
//                 <Heading size="lg" color={headingColor}>
//                   No Reports Available
//                 </Heading>
//                 <Text color={textColor} maxW="md">
//                   There are currently no reports to display. Create your first
//                   report to get started.
//                 </Text>
//               </VStack>
//               <Button
//                 colorScheme="green"
//                 leftIcon={<FiFileText />}
//                 as={NextLink}
//                 href={`/home`}
//               >
//                 Home
//               </Button>
//             </VStack>
//           </Center>
//         </Container>
//       </Box>
//     );
//   }

//   return (
//     <Box minH="100vh" bg={bgColor}>
//       <Container maxW="7xl" py={8}>
//         <VStack spacing={8} align="stretch">
//           {/* Map Section */}
//           <Card bg={cardBgColor} borderColor={borderColor}>
//             <CardBody>
//               <VStack spacing={6} align="stretch">
//                 <HStack justify="space-between">
//                   <VStack align="start" spacing={1}>
//                     <Heading size="lg" color={headingColor}>
//                       Landfill Locations
//                     </Heading>
//                     <Text color={textColor} fontSize="sm">
//                       Interactive map showing all active landfill sites and
//                       recent reports
//                     </Text>
//                   </VStack>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     as={NextLink}
//                     href={`/home`}
//                     leftIcon={<FiArrowLeft />}
//                   >
//                     Home
//                   </Button>
//                 </HStack>

//                 <EnhancedLocationMap height={400} showReports={true} />
//               </VStack>
//             </CardBody>
//           </Card>

//           <Divider />

//           {/* Reports Section */}
//           <VStack spacing={6} align="stretch">
//             <HStack justify="space-between">
//               <VStack align="start" spacing={1}>
//                 <Heading size="lg" color={headingColor}>
//                   Recent Reports
//                 </Heading>
//                 <Text color={textColor} fontSize="sm">
//                   {reports.length} report{reports.length !== 1 ? "s" : ""} found
//                 </Text>
//               </VStack>
//               <HStack spacing={3}>
//                 <Select
//                   size="sm"
//                   width="200px"
//                   value={selectedStatus}
//                   onChange={(e) => setSelectedStatus(e.target.value)}
//                 >
//                   <option value="ALL">All</option>
//                   <option value="PENDING">Pending</option>
//                   <option value="APPROVED">Approved</option>
//                   <option value="REJECTED">Rejected</option>
//                 </Select>
//                 <Button
//                   size="sm"
//                   variant="ghost"
//                   leftIcon={<FiRefreshCw />}
//                   onClick={() => mutate()}
//                 >
//                   Refresh
//                 </Button>
//                 <Button
//                   size="sm"
//                   colorScheme="green"
//                   leftIcon={<FiFileText />}
//                   onClick={handleGeneratePredictions}
//                   isLoading={isGenerating}
//                 >
//                   Generate New Predictions
//                 </Button>
//               </HStack>
//             </HStack>

//             <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
//               {reports.map((report) => (
//                 <ReportItem key={report.id} report={report} />
//               ))}
//             </SimpleGrid>
//           </VStack>
//         </VStack>
//       </Container>
//     </Box>
//   );
// };

//===========================================================

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
  FiZap,
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
  const [isGenerating, setIsGenerating] = useState(false);

  // ─── All hooks at top ─────────────────────────────────────────────────────
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
  const btnHoverBg      = useColorModeValue("#15803D", "#4ADE80");
  const emptyIconBg     = useColorModeValue("gray.100", "rgba(255,255,255,0.05)");
  const focusShadow     = useColorModeValue(
    "0 0 0 3px rgba(22,163,74,0.15)",
    "0 0 0 3px rgba(34,197,94,0.15)"
  );
  // ──────────────────────────────────────────────────────────────────────────

  const cardStyle = {
    bg: cardBg,
    border: "1px solid",
    borderColor: cardBorder,
    borderRadius: "16px",
    boxShadow: cardShadow,
    overflow: "hidden" as const,
  };

  if (typeof window === "undefined") return null;

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

  // ─── Loading ──────────────────────────────────────────────────────────────
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

  // ─── Error ────────────────────────────────────────────────────────────────
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

  // ─── Empty ────────────────────────────────────────────────────────────────
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

  // ─── Main ─────────────────────────────────────────────────────────────────
  return (
    <Box minH="100vh" bg={pageBg}>
      {/* Top accent stripe */}
      <Box h="3px" bgGradient="linear(to-r, green.400, teal.400)" />

      <Container maxW="6xl" py={10}>
        <VStack spacing={6} align="stretch">

          {/* ── Page header card ─────────────────────────────────────────── */}
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

          {/* ── Map card ─────────────────────────────────────────────────── */}
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

          {/* ── Reports section ───────────────────────────────────────────── */}
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

                {/* Controls */}
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

                  <Button
                    size="sm"
                    leftIcon={<FiZap size={13} />}
                    onClick={handleGeneratePredictions}
                    isLoading={isGenerating}
                    loadingText="Generating…"
                    bg={accentGreen} color="white"
                    borderRadius="8px" fontWeight="600"
                    _hover={{
                      bg: btnHoverBg,
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
                    }}
                    _active={{ transform: "translateY(0)" }}
                    transition="all 0.18s"
                  >
                    Generate Predictions
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