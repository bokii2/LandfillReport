// import {
//   Alert,
//   AlertDescription,
//   AlertIcon,
//   AlertTitle,
//   Box,
//   Button,
//   Center,
//   Container,
//   Heading,
//   HStack,
//   Icon,
//   //   Select,
//   SimpleGrid,
//   Spinner,
//   Text,
//   useColorModeValue,
//   VStack,
// } from "@chakra-ui/react";
// import { ReportItem } from "../ReportItem/ReportItem";
// import { FiArrowLeft, FiFileText, FiRefreshCw } from "react-icons/fi";
// import { swrKeys } from "@/fetchers/swrKeys";
// import { IReport } from "@/typings/Report.type";
// import useSWR from "swr";
// import { fetcher } from "@/fetchers/fetcher";
// import NextLink from "next/link";

// export const MyReportsList = () => {
//   const {
//     data: reports,
//     error,
//     isLoading,
//     mutate,
//   } = useSWR<IReport[]>(`${swrKeys.reportsByMe}`, fetcher);

//   const bgColor = useColorModeValue("gray.50", "gray.900");
//   const textColor = useColorModeValue("gray.600", "gray.300");
//   const headingColor = useColorModeValue("gray.800", "white");

//   // if (typeof window === "undefined") return null;

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
//       <Container maxW="6xl" py={8}>
//         <VStack spacing={6} align="stretch">
//           <HStack justify="space-between">
//             <VStack align="start" spacing={1}>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 as={NextLink}
//                 href={`/home`}
//                 leftIcon={<FiArrowLeft />}
//               >
//                 Home
//               </Button>
//               <Heading size="lg" color={headingColor}>
//                 Recent Reports
//               </Heading>
//               <Text color={textColor} fontSize="sm">
//                 {reports.length} report{reports.length !== 1 ? "s" : ""} found
//               </Text>
//             </VStack>
//             {/* <HStack spacing={3}>
//           <Select
//             size="sm"
//             width="200px"
//             value={selectedStatus}
//             onChange={(e) => setSelectedStatus(e.target.value)}
//           >
//             <option value="ALL">All</option>
//             <option value="PENDING">Pending</option>
//             <option value="APPROVED">Approved</option>
//             <option value="REJECTED">Rejected</option>
//           </Select>
//           <Button
//             size="sm"
//             variant="ghost"
//             leftIcon={<FiRefreshCw />}
//             onClick={() => mutate()}
//           >
//             Refresh
//           </Button>
//         </HStack> */}
//           </HStack>

//           <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
//             {reports.map((report) => (
//               <ReportItem key={report.id} report={report} />
//             ))}
//           </SimpleGrid>
//         </VStack>
//       </Container>
//     </Box>
//   );
// };


//==============================================================================

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
  SimpleGrid,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { ReportItem } from "../ReportItem/ReportItem";
import { FiArrowLeft, FiFileText, FiRefreshCw } from "react-icons/fi";
import { swrKeys } from "@/fetchers/swrKeys";
import { IReport } from "@/typings/Report.type";
import useSWR from "swr";
import { fetcher } from "@/fetchers/fetcher";
import NextLink from "next/link";

export const MyReportsList = () => {
  const {
    data: reports,
    error,
    isLoading,
    mutate,
  } = useSWR<IReport[]>(`${swrKeys.reportsByMe}`, fetcher);

  // All hooks at top — no conditional hook calls
  const pageBg          = useColorModeValue("#F7F8FA", "#0F1117");
  const cardBg          = useColorModeValue("#FFFFFF", "#171B26");
  const cardBorder      = useColorModeValue("rgba(0,0,0,0.07)", "rgba(255,255,255,0.06)");
  const subtleText      = useColorModeValue("#6B7280", "#8B92A5");
  const strongText      = useColorModeValue("#111827", "#F0F2F7");
  const accentGreen     = useColorModeValue("#16A34A", "#22C55E");
  const accentGreenSoft = useColorModeValue("green.50", "rgba(34,197,94,0.08)");
  const dividerColor    = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.06)");
  const hoverBg         = useColorModeValue("gray.50", "rgba(255,255,255,0.03)");
  const cardShadow      = useColorModeValue(
    "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
    "0 1px 3px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.3)"
  );
  const emptyIconBg     = useColorModeValue("gray.100", "rgba(255,255,255,0.05)");

  // ─── Loading ────────────────────────────────────────────────────────────
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

  // ─── Error ──────────────────────────────────────────────────────────────
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
              onClick={() => mutate()}
              variant="ghost" colorScheme="red"
            >
              Retry
            </Button>
          </Alert>
        </Container>
      </Box>
    );
  }

  // ─── Empty ──────────────────────────────────────────────────────────────
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
                  No Reports Yet
                </Heading>
                <Text color={subtleText} fontSize="sm" maxW="sm">
                  There are currently no reports to display. Create your first report to get started.
                </Text>
              </VStack>
              <Button
                size="sm"
                as={NextLink}
                href="/home"
                leftIcon={<FiFileText size={13} />}
                bg={accentGreen}
                color="white"
                borderRadius="10px"
                fontWeight="600"
                px={5}
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

  // ─── Main list ──────────────────────────────────────────────────────────
  return (
    <Box minH="100vh" bg={pageBg}>
      {/* Top accent stripe */}
      <Box h="3px" bgGradient="linear(to-r, green.400, teal.400)" />

      <Container maxW="6xl" py={10}>
        <VStack spacing={8} align="stretch">

          {/* Header card */}
          <Box
            bg={cardBg}
            border="1px solid"
            borderColor={cardBorder}
            borderRadius="16px"
            boxShadow={cardShadow}
            px={6} py={5}
          >
            <HStack justify="space-between" align="center">
              <HStack spacing={4}>
                <Button
                  as={NextLink}
                  href="/home"
                  leftIcon={<FiArrowLeft size={13} />}
                  variant="ghost"
                  size="sm"
                  color={subtleText}
                  fontWeight="500"
                  _hover={{ color: strongText, bg: hoverBg }}
                >
                  Home
                </Button>

                <Box w="1px" h="20px" bg={dividerColor} />

                <VStack align="start" spacing={0.5}>
                  <Heading size="md" color={strongText} fontWeight="700" letterSpacing="-0.02em">
                    Recent Reports
                  </Heading>
                  <Text fontSize="xs" color={subtleText} fontWeight="500">
                    {reports.length} report{reports.length !== 1 ? "s" : ""} found
                  </Text>
                </VStack>
              </HStack>

              {/* Count badge */}
              <Box
                bg={accentGreenSoft}
                border="1px solid"
                borderColor={dividerColor}
                borderRadius="10px"
                px={4} py={2}
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

          {/* Grid */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5}>
            {reports.map((report) => (
              <ReportItem key={report.id} report={report} />
            ))}
          </SimpleGrid>

        </VStack>
      </Container>
    </Box>
  );
};