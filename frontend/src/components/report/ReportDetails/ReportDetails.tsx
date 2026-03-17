// "use client";

// import {
//   Box,
//   Button,
//   FormControl,
//   FormLabel,
//   Select,
//   Text,
//   Image,
//   Heading,
//   useToast,
//   useColorModeValue,
//   Container,
//   Center,
//   VStack,
//   Spinner,
//   Alert,
//   AlertIcon,
//   AlertTitle,
//   AlertDescription,
//   Icon,
//   HStack,
//   Badge,
//   SimpleGrid,
// } from "@chakra-ui/react";
// import "leaflet/dist/leaflet.css";
// import useSWR, { mutate } from "swr";
// import { IReport } from "@/typings/Report.type";
// import { swrKeys } from "@/fetchers/swrKeys";
// import { fetcher } from "@/fetchers/fetcher";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { api } from "@/fetchers/report";
// import { useRouter } from "next/navigation";
// import {
//   FiArrowLeft,
//   FiCalendar,
//   FiEdit3,
//   FiFileText,
//   FiImage,
//   FiMapPin,
//   FiSave,
//   FiUser,
//   FiCheckCircle,
//   FiClock,
//   FiXCircle,
//   FiHash,
//   FiNavigation,
// } from "react-icons/fi";
// import EnhancedLocationsDisplayMap from "@/components/map/EnhancedLocationsDisplayMap";
// import { IconType } from "react-icons/lib";

// export const ReportDetails = () => {
//   const params = useParams();
//   const router = useRouter();
//   const toast = useToast();

//   const reportId =
//     typeof params?.id === "string"
//       ? params.id
//       : Array.isArray(params?.id)
//         ? params.id[0]
//         : null;

//   const reportUrl = reportId ? `${swrKeys.reports}/${reportId}` : null;
//   const { data: report, error, isLoading } = useSWR<IReport>(reportUrl, fetcher);

//   const [status, setStatus] = useState<string>("");
//   const [isUpdating, setIsUpdating] = useState(false);

//   const pageBg          = useColorModeValue("#F7F8FA", "#0F1117");
//   const cardBg          = useColorModeValue("#FFFFFF", "#171B26");
//   const cardBorder      = useColorModeValue("rgba(0,0,0,0.07)", "rgba(255,255,255,0.06)");
//   const subtleText      = useColorModeValue("#6B7280", "#8B92A5");
//   const strongText      = useColorModeValue("#111827", "#F0F2F7");
//   const accentGreen     = useColorModeValue("#16A34A", "#22C55E");
//   const accentGreenSoft = useColorModeValue("green.50", "rgba(34,197,94,0.08)");
//   const dividerColor    = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.06)");
//   const selectBg        = useColorModeValue("#F9FAFB", "#1E2330");
//   const hoverBg         = useColorModeValue("gray.50", "rgba(255,255,255,0.03)");
//   const cardShadow      = useColorModeValue(
//     "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
//     "0 1px 3px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.3)"
//   );
//   const notFoundBoxBg   = useColorModeValue("gray.100", "rgba(255,255,255,0.05)");
//   const blueBg          = useColorModeValue("blue.50", "rgba(59,130,246,0.1)");
//   const blueIcon        = useColorModeValue("blue.500", "blue.300");
//   const orangeBg        = useColorModeValue("orange.50", "rgba(249,115,22,0.1)");
//   const orangeIcon      = useColorModeValue("orange.500", "orange.300");
//   const btnHoverBg      = useColorModeValue("#15803D", "#4ADE80");
//   const focusShadow     = useColorModeValue(
//     "0 0 0 3px rgba(22,163,74,0.15)",
//     "0 0 0 3px rgba(34,197,94,0.15)"
//   );

//   const cardStyle = {
//     bg: cardBg,
//     border: "1px solid",
//     borderColor: cardBorder,
//     borderRadius: "16px",
//     boxShadow: cardShadow,
//     overflow: "hidden" as const,
//   };

//   const sectionLabelStyle = {
//     fontSize: "12px",
//     fontWeight: "600",
//     letterSpacing: "0.08em",
//     textTransform: "uppercase" as const,
//     color: subtleText,
//     mb: 1,
//   };

//   useEffect(() => {
//     if (report) {
//       setStatus(report.status);
//       console.log("imageBase64 preview:", report.imageBase64?.substring(0, 50));
//       console.log("imageType:", report.imageType);
//       console.log("full report:", report);
//     }
//   }, [report]);

//   if (typeof window === "undefined") return null;

//   if (isLoading) {
//     return (
//       <Box minH="100vh" bg={pageBg}>
//         <Container maxW="6xl" py={12}>
//           <Center h="60vh">
//             <VStack spacing={5}>
//               <Box
//                 w={14} h={14} borderRadius="full" bg={accentGreenSoft}
//                 display="flex" alignItems="center" justifyContent="center"
//               >
//                 <Spinner size="md" color={accentGreen} thickness="3px" />
//               </Box>
//               <Text color={subtleText} fontSize="md" letterSpacing="0.03em">
//                 Loading report details…
//               </Text>
//             </VStack>
//           </Center>
//         </Container>
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box minH="100vh" bg={pageBg}>
//         <Container maxW="6xl" py={12}>
//           <Alert status="error" borderRadius="xl" border="1px solid" borderColor="red.200" bg="red.50">
//             <AlertIcon />
//             <AlertTitle fontWeight="600">Error loading report</AlertTitle>
//             <AlertDescription>Unable to fetch report details. Please try again later.</AlertDescription>
//           </Alert>
//         </Container>
//       </Box>
//     );
//   }

//   if (!report) {
//     return (
//       <Box minH="100vh" bg={pageBg}>
//         <Container maxW="6xl" py={12}>
//           <Center h="60vh">
//             <VStack spacing={6} textAlign="center">
//               <Box
//                 w={20} h={20} borderRadius="2xl" bg={notFoundBoxBg}
//                 display="flex" alignItems="center" justifyContent="center"
//               >
//                 <Icon as={FiFileText} boxSize={9} color={subtleText} />
//               </Box>
//               <VStack spacing={1}>
//                 <Heading size="lg" color={strongText} fontWeight="700">Report Not Found</Heading>
//                 <Text color={subtleText} fontSize="md">The requested report could not be found.</Text>
//               </VStack>
//               <Button
//                 size="sm" leftIcon={<FiArrowLeft />} variant="ghost"
//                 color={subtleText} _hover={{ color: strongText, bg: hoverBg }}
//                 onClick={() => router.back()}
//               >
//                 Go Back
//               </Button>
//             </VStack>
//           </Center>
//         </Container>
//       </Box>
//     );
//   }

//   const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setStatus(event.target.value);
//   };

//   const handleUpdateStatus = async () => {
//     if (!reportId) { console.error("No reportId available"); return; }
//     setIsUpdating(true);
//     try {
//       await api.updateReportStatus(reportId, status);
//       await mutate(reportUrl);
//       toast({
//         title: "Status updated",
//         description: "Report status has been successfully updated.",
//         status: "success", duration: 3000, isClosable: true, position: "top-right",
//       });
//     } catch (error) {
//       console.error("Failed to update status:", error);
//       let errorMessage = "Failed to update status. Please try again.";
//       if (error instanceof Error) errorMessage = error.message;
//       toast({
//         title: "Update failed", description: errorMessage,
//         status: "error", duration: 5000, isClosable: true, position: "top-right",
//       });
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const statusMeta: Record<string, { color: string; icon: IconType; label: string; scheme: string }> = {
//     APPROVED: { color: "#16A34A", icon: FiCheckCircle, label: "Approved", scheme: "green" },
//     PENDING:  { color: "#D97706", icon: FiClock,       label: "Pending",  scheme: "yellow" },
//     REJECTED: { color: "#DC2626", icon: FiXCircle,     label: "Rejected", scheme: "red" },
//   };
//   const meta = statusMeta[report.status] ?? { color: "#6B7280", icon: FiFileText, label: report.status, scheme: "gray" };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
//     });
//   };

//   return (
//     <Box minH="100vh" bg={pageBg}>
//       <Box h="3px" bgGradient="linear(to-r, green.400, teal.400)" />

//       <Container maxW="6xl" py={10}>
//         <VStack spacing={8} align="stretch">

//           <HStack justify="space-between" align="center">
//             <HStack spacing={4}>
//               <Button
//                 leftIcon={<FiArrowLeft size={14} />}
//                 variant="ghost" size="sm"
//                 color={subtleText} fontWeight="500"
//                 _hover={{ color: strongText, bg: hoverBg }}
//                 onClick={() => router.back()}
//               >
//                 Back
//               </Button>

//               <Box w="1px" h="20px" bg={dividerColor} />

//               <HStack spacing={2}>
//                 <Box
//                   w={7} h={7} borderRadius="full"
//                   bg={`${meta.color}18`}
//                   display="flex" alignItems="center" justifyContent="center"
//                 >
//                   <Icon as={meta.icon} color={meta.color} boxSize={3.5} />
//                 </Box>
//                 <Badge
//                   colorScheme={meta.scheme} variant="subtle"
//                   px={3} py={1} borderRadius="full"
//                   fontSize="13px" fontWeight="600"
//                   letterSpacing="0.05em" textTransform="uppercase"
//                 >
//                   {meta.label}
//                 </Badge>
//               </HStack>
//             </HStack>

//             <Text color={subtleText} fontSize="sm" letterSpacing="0.03em">
//               Report #{reportId}
//             </Text>
//           </HStack>

//           <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>

//             <VStack spacing={6} align="stretch">

//               <Box {...cardStyle}>
//                 <Box px={6} py={4} borderBottom="1px solid" borderColor={dividerColor}>
//                   <HStack spacing={2}>
//                     <Box w={7} h={7} borderRadius="lg" bg={accentGreenSoft}
//                       display="flex" alignItems="center" justifyContent="center">
//                       <Icon as={FiMapPin} color={accentGreen} boxSize={3.5} />
//                     </Box>
//                     <Text fontWeight="600" fontSize="md" color={strongText}>Location</Text>
//                   </HStack>
//                 </Box>
//                 <Box p={0} borderRadius="0 0 16px 16px" overflow="hidden">
//                   <EnhancedLocationsDisplayMap
//                     locations={[{ ...report.location, source: "report" }]}
//                   />
//                 </Box>
//               </Box>

//               <Box {...cardStyle}>
//                 <Box px={6} py={4} borderBottom="1px solid" borderColor={dividerColor}>
//                   <HStack spacing={2}>
//                     <Box w={7} h={7} borderRadius="lg" bg={blueBg}
//                       display="flex" alignItems="center" justifyContent="center">
//                       <Icon as={FiImage} color={blueIcon} boxSize={3.5} />
//                     </Box>
//                     <Text fontWeight="600" fontSize="md" color={strongText}>Attached Image</Text>
//                   </HStack>
//                 </Box>
//                 <Box p={5}>
//                   <Box borderRadius="12px" overflow="hidden" border="1px solid" borderColor={cardBorder}>
//                     <Image
//                       src={`data:${report.imageType};base64,${report.imageBase64}`}
//                       alt="Report attachment"
//                       w="100%" maxH="360px" objectFit="cover"
//                     />
//                   </Box>
//                 </Box>
//               </Box>
//             </VStack>

//             <VStack spacing={6} align="stretch">

//               <Box {...cardStyle}>
//                 <Box px={6} py={4} borderBottom="1px solid" borderColor={dividerColor}>
//                   <HStack spacing={2}>
//                     <Box w={7} h={7} borderRadius="lg" bg={accentGreenSoft}
//                       display="flex" alignItems="center" justifyContent="center">
//                       <Icon as={FiFileText} color={accentGreen} boxSize={3.5} />
//                     </Box>
//                     <Text fontWeight="600" fontSize="md" color={strongText}>Report Information</Text>
//                   </HStack>
//                 </Box>

//                 <Box p={6}>
//                   <VStack spacing={6} align="stretch">
//                     <Box>
//                       <Text {...sectionLabelStyle}>Description</Text>
//                       <Text color={strongText} fontSize="md" lineHeight="1.75" mt={2}>
//                         {report.description}
//                       </Text>
//                     </Box>

//                     <Box h="1px" bg={dividerColor} />

//                     <VStack spacing={0} align="stretch">
//                       {[
//                         { icon: FiHash,     label: "Report ID",  value: `#${report.id}` },
//                         { icon: FiUser,     label: "Created by", value: report.createdBy },
//                         {
//                           icon: FiCalendar, label: "Created at",
//                           value: report.createdAt ? formatDate(report.createdAt.toString()) : "—",
//                         },
//                         {
//                           icon: FiNavigation, label: "Latitude",
//                           value: report.location?.latitude?.toFixed(5) ?? "—",
//                         },
//                         {
//                           icon: FiMapPin, label: "Longitude",
//                           value: report.location?.longitude?.toFixed(5) ?? "—",
//                         },
//                       ].map(({ icon, label, value }) => (
//                         <HStack
//                           key={label}
//                           justify="space-between" align="center"
//                           px={4} py={3.5} borderRadius="10px"
//                           _hover={{ bg: hoverBg }} transition="background 0.15s"
//                         >
//                           <HStack spacing={2.5}>
//                             <Icon as={icon} color={subtleText} boxSize={3.5} />
//                             <Text fontSize="sm" color={subtleText} fontWeight="500">{label}</Text>
//                           </HStack>
//                           <Text fontSize="md" color={strongText} fontWeight="500">{value}</Text>
//                         </HStack>
//                       ))}
//                     </VStack>
//                   </VStack>
//                 </Box>
//               </Box>

//               <Box {...cardStyle}>
//                 <Box px={6} py={4} borderBottom="1px solid" borderColor={dividerColor}>
//                   <HStack spacing={2}>
//                     <Box w={7} h={7} borderRadius="lg" bg={orangeBg}
//                       display="flex" alignItems="center" justifyContent="center">
//                       <Icon as={FiEdit3} color={orangeIcon} boxSize={3.5} />
//                     </Box>
//                     <Text fontWeight="600" fontSize="md" color={strongText}>Status Management</Text>
//                   </HStack>
//                 </Box>

//                 <Box p={6}>
//                   <VStack spacing={5} align="stretch">
//                     <FormControl>
//                       <FormLabel
//                         fontSize="sm" fontWeight="600"
//                         letterSpacing="0.07em" textTransform="uppercase"
//                         color={subtleText} mb={2}
//                       >
//                         Update status
//                       </FormLabel>
//                       <Select
//                         value={status}
//                         onChange={handleStatusChange}
//                         bg={selectBg}
//                         border="1px solid" borderColor={cardBorder}
//                         borderRadius="10px" fontSize="md" fontWeight="500"
//                         color={strongText} h={10}
//                         _hover={{ borderColor: accentGreen }}
//                         _focus={{ borderColor: accentGreen, boxShadow: focusShadow }}
//                       >
//                         <option value="PENDING">Pending Review</option>
//                         <option value="APPROVED">Approved</option>
//                         <option value="REJECTED">Rejected</option>
//                       </Select>
//                     </FormControl>

//                     <VStack spacing={2.5}>
//                       <Button
//                         w="full" size="md" borderRadius="10px"
//                         leftIcon={<FiSave size={14} />}
//                         onClick={handleUpdateStatus}
//                         isLoading={isUpdating} loadingText="Updating…"
//                         bg={accentGreen} color="white"
//                         fontWeight="600" fontSize="md" h={10}
//                         _hover={{
//                           bg: btnHoverBg,
//                           transform: "translateY(-1px)",
//                           boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
//                         }}
//                         _active={{ transform: "translateY(0)" }}
//                         transition="all 0.18s"
//                       >
//                         Save Changes
//                       </Button>

//                       <Button
//                         w="full" size="md" borderRadius="10px" variant="ghost"
//                         leftIcon={<FiArrowLeft size={14} />}
//                         onClick={() => router.push("/reports")}
//                         fontSize="md" fontWeight="500" color={subtleText} h={10}
//                         _hover={{ color: strongText, bg: hoverBg }}
//                       >
//                         Back to Reports
//                       </Button>
//                     </VStack>
//                   </VStack>
//                 </Box>
//               </Box>

//             </VStack>
//           </SimpleGrid>
//         </VStack>
//       </Container>
//     </Box>
//   );
// };

"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Text,
  Image,
  Heading,
  useToast,
  useColorModeValue,
  Container,
  Center,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Icon,
  HStack,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";
import useSWR, { mutate } from "swr";
import { IReport } from "@/typings/Report.type";
import { swrKeys } from "@/fetchers/swrKeys";
import { fetcher } from "@/fetchers/fetcher";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/fetchers/report";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCalendar,
  FiEdit3,
  FiFileText,
  FiImage,
  FiMapPin,
  FiSave,
  FiUser,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiHash,
  FiNavigation,
} from "react-icons/fi";
import EnhancedLocationsDisplayMap from "@/components/map/EnhancedLocationsDisplayMap";
import { IconType } from "react-icons/lib";

export const ReportDetails = () => {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();

  const reportId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : null;

  const reportUrl = reportId ? `${swrKeys.reports}/${reportId}` : null;
  const { data: report, error, isLoading } = useSWR<IReport>(reportUrl, fetcher);

  const [status, setStatus] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // ─── All hooks at top ─────────────────────────────────────────────────────
  const pageBg          = useColorModeValue("#F7F8FA", "#0F1117");
  const cardBg          = useColorModeValue("#FFFFFF", "#171B26");
  const cardBorder      = useColorModeValue("rgba(0,0,0,0.07)", "rgba(255,255,255,0.06)");
  const subtleText      = useColorModeValue("#6B7280", "#8B92A5");
  const strongText      = useColorModeValue("#111827", "#F0F2F7");
  const accentGreen     = useColorModeValue("#16A34A", "#22C55E");
  const accentGreenSoft = useColorModeValue("green.50", "rgba(34,197,94,0.08)");
  const dividerColor    = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.06)");
  const selectBg        = useColorModeValue("#F9FAFB", "#1E2330");
  const hoverBg         = useColorModeValue("gray.50", "rgba(255,255,255,0.03)");
  const cardShadow      = useColorModeValue(
    "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
    "0 1px 3px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.3)"
  );
  const notFoundBoxBg   = useColorModeValue("gray.100", "rgba(255,255,255,0.05)");
  const blueBg          = useColorModeValue("blue.50", "rgba(59,130,246,0.1)");
  const blueIcon        = useColorModeValue("blue.500", "blue.300");
  const orangeBg        = useColorModeValue("orange.50", "rgba(249,115,22,0.1)");
  const orangeIcon      = useColorModeValue("orange.500", "orange.300");
  const btnHoverBg      = useColorModeValue("#15803D", "#4ADE80");
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

  const sectionLabelStyle = {
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: subtleText,
    mb: 1,
  };

  useEffect(() => {
    if (report) {
      setStatus(report.status);
    }
  }, [report]);

  // Read role from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        const user = JSON.parse(stored);
        const role = user?.role ?? user?.roles?.[0] ?? "";
        setIsAdmin(role === "ADMIN");
      }
    } catch {
      setIsAdmin(false);
    }
  }, []);

  if (typeof window === "undefined") return null;

  if (isLoading) {
    return (
      <Box minH="100vh" bg={pageBg}>
        <Container maxW="6xl" py={12}>
          <Center h="60vh">
            <VStack spacing={5}>
              <Box
                w={14} h={14} borderRadius="full" bg={accentGreenSoft}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Spinner size="md" color={accentGreen} thickness="3px" />
              </Box>
              <Text color={subtleText} fontSize="md" letterSpacing="0.03em">
                Loading report details…
              </Text>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg={pageBg}>
        <Container maxW="6xl" py={12}>
          <Alert status="error" borderRadius="xl" border="1px solid" borderColor="red.200" bg="red.50">
            <AlertIcon />
            <AlertTitle fontWeight="600">Error loading report</AlertTitle>
            <AlertDescription>Unable to fetch report details. Please try again later.</AlertDescription>
          </Alert>
        </Container>
      </Box>
    );
  }

  if (!report) {
    return (
      <Box minH="100vh" bg={pageBg}>
        <Container maxW="6xl" py={12}>
          <Center h="60vh">
            <VStack spacing={6} textAlign="center">
              <Box
                w={20} h={20} borderRadius="2xl" bg={notFoundBoxBg}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Icon as={FiFileText} boxSize={9} color={subtleText} />
              </Box>
              <VStack spacing={1}>
                <Heading size="lg" color={strongText} fontWeight="700">Report Not Found</Heading>
                <Text color={subtleText} fontSize="md">The requested report could not be found.</Text>
              </VStack>
              <Button
                size="sm" leftIcon={<FiArrowLeft />} variant="ghost"
                color={subtleText} _hover={{ color: strongText, bg: hoverBg }}
                onClick={() => router.back()}
              >
                Go Back
              </Button>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  };

  const handleUpdateStatus = async () => {
    if (!reportId) { console.error("No reportId available"); return; }
    setIsUpdating(true);
    try {
      await api.updateReportStatus(reportId, status);
      await mutate(reportUrl);
      toast({
        title: "Status updated",
        description: "Report status has been successfully updated.",
        status: "success", duration: 3000, isClosable: true, position: "top-right",
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      let errorMessage = "Failed to update status. Please try again.";
      if (error instanceof Error) errorMessage = error.message;
      toast({
        title: "Update failed", description: errorMessage,
        status: "error", duration: 5000, isClosable: true, position: "top-right",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const statusMeta: Record<string, { color: string; icon: IconType; label: string; scheme: string }> = {
    APPROVED: { color: "#16A34A", icon: FiCheckCircle, label: "Approved", scheme: "green" },
    PENDING:  { color: "#D97706", icon: FiClock,       label: "Pending",  scheme: "yellow" },
    REJECTED: { color: "#DC2626", icon: FiXCircle,     label: "Rejected", scheme: "red" },
  };
  const meta = statusMeta[report.status] ?? { color: "#6B7280", icon: FiFileText, label: report.status, scheme: "gray" };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <Box minH="100vh" bg={pageBg}>
      <Box h="3px" bgGradient="linear(to-r, green.400, teal.400)" />

      <Container maxW="6xl" py={10}>
        <VStack spacing={8} align="stretch">

          {/* Top bar */}
          <HStack justify="space-between" align="center">
            <HStack spacing={4}>
              <Button
                leftIcon={<FiArrowLeft size={14} />}
                variant="ghost" size="sm"
                color={subtleText} fontWeight="500"
                _hover={{ color: strongText, bg: hoverBg }}
                onClick={() => router.back()}
              >
                Back
              </Button>

              <Box w="1px" h="20px" bg={dividerColor} />

              <HStack spacing={2}>
                <Box
                  w={7} h={7} borderRadius="full"
                  bg={`${meta.color}18`}
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <Icon as={meta.icon} color={meta.color} boxSize={3.5} />
                </Box>
                <Badge
                  colorScheme={meta.scheme} variant="subtle"
                  px={3} py={1} borderRadius="full"
                  fontSize="13px" fontWeight="600"
                  letterSpacing="0.05em" textTransform="uppercase"
                >
                  {meta.label}
                </Badge>
              </HStack>
            </HStack>

            <Text color={subtleText} fontSize="sm" letterSpacing="0.03em">
              Report #{reportId}
            </Text>
          </HStack>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>

            {/* Left column */}
            <VStack spacing={6} align="stretch">

              {/* Map card */}
              <Box {...cardStyle}>
                <Box px={6} py={4} borderBottom="1px solid" borderColor={dividerColor}>
                  <HStack spacing={2}>
                    <Box w={7} h={7} borderRadius="lg" bg={accentGreenSoft}
                      display="flex" alignItems="center" justifyContent="center">
                      <Icon as={FiMapPin} color={accentGreen} boxSize={3.5} />
                    </Box>
                    <Text fontWeight="600" fontSize="md" color={strongText}>Location</Text>
                  </HStack>
                </Box>
                <Box p={0} borderRadius="0 0 16px 16px" overflow="hidden">
                  <EnhancedLocationsDisplayMap
                    locations={[{ ...report.location, source: "report" }]}
                  />
                </Box>
              </Box>

              {/* Image card */}
              <Box {...cardStyle}>
                <Box px={6} py={4} borderBottom="1px solid" borderColor={dividerColor}>
                  <HStack spacing={2}>
                    <Box w={7} h={7} borderRadius="lg" bg={blueBg}
                      display="flex" alignItems="center" justifyContent="center">
                      <Icon as={FiImage} color={blueIcon} boxSize={3.5} />
                    </Box>
                    <Text fontWeight="600" fontSize="md" color={strongText}>Attached Image</Text>
                  </HStack>
                </Box>
                <Box p={5}>
                  <Box borderRadius="12px" overflow="hidden" border="1px solid" borderColor={cardBorder}>
                    <Image
                      src={`data:${report.imageType};base64,${report.imageBase64}`}
                      alt="Report attachment"
                      w="100%" maxH="360px" objectFit="cover"
                    />
                  </Box>
                </Box>
              </Box>
            </VStack>

            {/* Right column */}
            <VStack spacing={6} align="stretch">

              {/* Report info card */}
              <Box {...cardStyle}>
                <Box px={6} py={4} borderBottom="1px solid" borderColor={dividerColor}>
                  <HStack spacing={2}>
                    <Box w={7} h={7} borderRadius="lg" bg={accentGreenSoft}
                      display="flex" alignItems="center" justifyContent="center">
                      <Icon as={FiFileText} color={accentGreen} boxSize={3.5} />
                    </Box>
                    <Text fontWeight="600" fontSize="md" color={strongText}>Report Information</Text>
                  </HStack>
                </Box>

                <Box p={6}>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Text {...sectionLabelStyle}>Description</Text>
                      <Text color={strongText} fontSize="md" lineHeight="1.75" mt={2}>
                        {report.description}
                      </Text>
                    </Box>

                    <Box h="1px" bg={dividerColor} />

                    <VStack spacing={0} align="stretch">
                      {[
                        { icon: FiHash,       label: "Report ID",  value: `#${report.id}` },
                        { icon: FiUser,       label: "Created by", value: report.createdBy },
                        {
                          icon: FiCalendar,   label: "Created at",
                          value: report.createdAt ? formatDate(report.createdAt.toString()) : "—",
                        },
                        {
                          icon: FiNavigation, label: "Latitude",
                          value: report.location?.latitude?.toFixed(5) ?? "—",
                        },
                        {
                          icon: FiMapPin,     label: "Longitude",
                          value: report.location?.longitude?.toFixed(5) ?? "—",
                        },
                      ].map(({ icon, label, value }) => (
                        <HStack
                          key={label}
                          justify="space-between" align="center"
                          px={4} py={3.5} borderRadius="10px"
                          _hover={{ bg: hoverBg }} transition="background 0.15s"
                        >
                          <HStack spacing={2.5}>
                            <Icon as={icon} color={subtleText} boxSize={3.5} />
                            <Text fontSize="sm" color={subtleText} fontWeight="500">{label}</Text>
                          </HStack>
                          <Text fontSize="md" color={strongText} fontWeight="500">{value}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  </VStack>
                </Box>
              </Box>

              {/* Status management — ADMIN only */}
              {isAdmin && (
                <Box {...cardStyle}>
                  <Box px={6} py={4} borderBottom="1px solid" borderColor={dividerColor}>
                    <HStack spacing={2}>
                      <Box w={7} h={7} borderRadius="lg" bg={orangeBg}
                        display="flex" alignItems="center" justifyContent="center">
                        <Icon as={FiEdit3} color={orangeIcon} boxSize={3.5} />
                      </Box>
                      <Text fontWeight="600" fontSize="md" color={strongText}>Status Management</Text>
                    </HStack>
                  </Box>

                  <Box p={6}>
                    <VStack spacing={5} align="stretch">
                      <FormControl>
                        <FormLabel
                          fontSize="sm" fontWeight="600"
                          letterSpacing="0.07em" textTransform="uppercase"
                          color={subtleText} mb={2}
                        >
                          Update status
                        </FormLabel>
                        <Select
                          value={status}
                          onChange={handleStatusChange}
                          bg={selectBg}
                          border="1px solid" borderColor={cardBorder}
                          borderRadius="10px" fontSize="md" fontWeight="500"
                          color={strongText} h={10}
                          _hover={{ borderColor: accentGreen }}
                          _focus={{ borderColor: accentGreen, boxShadow: focusShadow }}
                        >
                          <option value="PENDING">Pending Review</option>
                          <option value="APPROVED">Approved</option>
                          <option value="REJECTED">Rejected</option>
                        </Select>
                      </FormControl>

                      <VStack spacing={2.5}>
                        <Button
                          w="full" size="md" borderRadius="10px"
                          leftIcon={<FiSave size={14} />}
                          onClick={handleUpdateStatus}
                          isLoading={isUpdating} loadingText="Updating…"
                          bg={accentGreen} color="white"
                          fontWeight="600" fontSize="md" h={10}
                          _hover={{
                            bg: btnHoverBg,
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
                          }}
                          _active={{ transform: "translateY(0)" }}
                          transition="all 0.18s"
                        >
                          Save Changes
                        </Button>

                        <Button
                          w="full" size="md" borderRadius="10px" variant="ghost"
                          leftIcon={<FiArrowLeft size={14} />}
                          onClick={() => router.push("/reports")}
                          fontSize="md" fontWeight="500" color={subtleText} h={10}
                          _hover={{ color: strongText, bg: hoverBg }}
                        >
                          Back to Reports
                        </Button>
                      </VStack>
                    </VStack>
                  </Box>
                </Box>
              )}

            </VStack>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};