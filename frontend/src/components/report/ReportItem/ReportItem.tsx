// import { IReport } from "@/typings/Report.type";
// import {
//   Badge,
//   Button,
//   Card,
//   CardBody,
//   HStack,
//   Icon,
//   Text,
//   useColorModeValue,
//   VStack,
// } from "@chakra-ui/react";
// import { FiCalendar, FiFileText, FiMapPin } from "react-icons/fi";
// import NextLink from "next/link";

// export const ReportItem = ({ report }: { report: IReport }) => {
//   const bgColor = useColorModeValue("white", "gray.800");
//   const borderColor = useColorModeValue("gray.200", "gray.700");
//   const textColor = useColorModeValue("gray.600", "gray.300");

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "approved":
//         return "green";
//       case "pending":
//         return "yellow";
//       case "rejected":
//         return "red";
//       default:
//         return "gray";
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   return (
//     <Card
//       bg={bgColor}
//       borderColor={borderColor}
//       cursor="pointer"
//       transition="all 0.2s"
//       _hover={{
//         transform: "translateY(-2px)",
//         shadow: "lg",
//         borderColor: "green.200",
//       }}
//     >
//       <CardBody>
//         <VStack align="start" spacing={4}>
//           <HStack justify="space-between" w="full">
//             <HStack spacing={2}>
//               <Badge
//                 colorScheme={getStatusColor(report.status)}
//                 variant="subtle"
//               >
//                 {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
//               </Badge>
//             </HStack>
//             <Icon as={FiFileText} color={textColor} />
//           </HStack>

//           <VStack align="start" spacing={2} w="full">
//             <Text color={textColor} fontSize="m" lineHeight="tall">
//               {report.description}
//             </Text>
//           </VStack>

//           <HStack justify="space-between" w="full" pt={2}>
//             <VStack align="start" spacing={1}>
//               <HStack spacing={1}>
//                 <Icon as={FiMapPin} boxSize={3} color={textColor} />
//                 <Text fontSize="xs" color={textColor}>
//                   Lat: {report.location?.latitude ?? "N/A"}, Lng:{" "}
//                   {report.location?.longitude ?? "N/A"}
//                 </Text>
//               </HStack>
//               <HStack spacing={1}>
//                 <Icon as={FiCalendar} boxSize={3} color={textColor} />
//                 <Text fontSize="xs" color={textColor}>
//                   {report.createdAt
//                     ? formatDate(report.createdAt.toString())
//                     : "No date"}
//                 </Text>
//               </HStack>
//             </VStack>
//             <Button
//               size="sm"
//               variant="ghost"
//               colorScheme="green"
//               as={NextLink}
//               href={`/report/${report.id}`}
//             >
//               View Details
//             </Button>
//           </HStack>
//         </VStack>
//       </CardBody>
//     </Card>
//   );
// };


//=========================================

import { IReport } from "@/typings/Report.type";
import {
  Badge,
  Box,
  Button,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiMapPin,
  FiXCircle,
} from "react-icons/fi";
import NextLink from "next/link";
import { IconType } from "react-icons/lib";

export const ReportItem = ({ report }: { report: IReport }) => {
  const cardBg        = useColorModeValue("#FFFFFF", "#171B26");
  const cardBorder    = useColorModeValue("rgba(0,0,0,0.07)", "rgba(255,255,255,0.06)");
  const cardShadow    = useColorModeValue(
    "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
    "0 1px 3px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.3)"
  );
  const hoverShadow   = useColorModeValue(
    "0 4px 20px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
    "0 4px 24px rgba(0,0,0,0.5)"
  );
  const subtleText    = useColorModeValue("#6B7280", "#8B92A5");
  const strongText    = useColorModeValue("#111827", "#F0F2F7");
  const dividerColor  = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.06)");
  const hoverBorder   = useColorModeValue("rgba(22,163,74,0.35)", "rgba(34,197,94,0.25)");
  const metaRowHover  = useColorModeValue("gray.50", "rgba(255,255,255,0.03)");
  const accentGreen   = useColorModeValue("#16A34A", "#22C55E");
  const btnHoverBg    = useColorModeValue("green.50", "rgba(34,197,94,0.1)");

  const statusMeta: Record<string, { color: string; icon: IconType; scheme: string; label: string }> = {
    APPROVED: { color: "#16A34A", icon: FiCheckCircle, scheme: "green",  label: "Approved" },
    PENDING:  { color: "#D97706", icon: FiClock,       scheme: "yellow", label: "Pending"  },
    REJECTED: { color: "#DC2626", icon: FiXCircle,     scheme: "red",    label: "Rejected" },
  };
  const meta = statusMeta[report.status?.toUpperCase()] ?? {
    color: "#6B7280", icon: FiFileText, scheme: "gray",
    label: report.status?.charAt(0).toUpperCase() + report.status?.slice(1),
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="16px"
      boxShadow={cardShadow}
      overflow="hidden"
      cursor="pointer"
      transition="all 0.2s ease"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: hoverShadow,
        borderColor: hoverBorder,
      }}
    >
      {/* Status accent bar */}
      <Box h="3px" bg={meta.color} opacity={0.85} />

      <Box p={5}>
        <VStack align="stretch" spacing={4}>

          {/* Header row */}
          <HStack justify="space-between" align="center">
            <HStack spacing={2}>
              <Box
                w={6} h={6} borderRadius="full"
                bg={`${meta.color}18`}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Icon as={meta.icon} color={meta.color} boxSize={3} />
              </Box>
              <Badge
                colorScheme={meta.scheme}
                variant="subtle"
                px={2.5} py={0.5}
                borderRadius="full"
                fontSize="11px"
                fontWeight="600"
                letterSpacing="0.05em"
                textTransform="uppercase"
              >
                {meta.label}
              </Badge>
            </HStack>

            <Text fontSize="xs" color={subtleText} letterSpacing="0.02em">
              #{report.id}
            </Text>
          </HStack>

          {/* Description */}
          <Text
            color={strongText}
            fontSize="sm"
            lineHeight="1.75"
            noOfLines={3}
          >
            {report.description}
          </Text>

          {/* Divider */}
          <Box h="1px" bg={dividerColor} />

          {/* Footer row */}
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={1.5}>
              <HStack spacing={2} px={2} py={1} borderRadius="8px" _hover={{ bg: metaRowHover }} transition="background 0.15s">
                <Icon as={FiMapPin} boxSize={3} color={subtleText} />
                <Text fontSize="xs" color={subtleText} fontWeight="500">
                  {report.location?.latitude?.toFixed(4) ?? "N/A"},&nbsp;
                  {report.location?.longitude?.toFixed(4) ?? "N/A"}
                </Text>
              </HStack>

              <HStack spacing={2} px={2} py={1} borderRadius="8px" _hover={{ bg: metaRowHover }} transition="background 0.15s">
                <Icon as={FiCalendar} boxSize={3} color={subtleText} />
                <Text fontSize="xs" color={subtleText} fontWeight="500">
                  {report.createdAt ? formatDate(report.createdAt.toString()) : "No date"}
                </Text>
              </HStack>
            </VStack>

            <Button
              size="sm"
              variant="ghost"
              as={NextLink}
              href={`/report/${report.id}`}
              color={accentGreen}
              fontWeight="600"
              fontSize="xs"
              borderRadius="8px"
              px={3}
              _hover={{ bg: btnHoverBg, color: accentGreen }}
              transition="all 0.15s"
            >
              View Details →
            </Button>
          </HStack>

        </VStack>
      </Box>
    </Box>
  );
};