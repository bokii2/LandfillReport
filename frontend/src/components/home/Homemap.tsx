"use client";

import {
  Box,
  Text,
  Badge,
  HStack,
  Icon,
  useColorModeValue,
  Spinner,
  Center,
  VStack,
} from "@chakra-ui/react";
import { FiMapPin } from "react-icons/fi";
import useSWR from "swr";
import { fetcher } from "@/fetchers/fetcher";
import { swrKeys } from "@/fetchers/swrKeys";
import { IReport } from "@/typings/Report.type";
import dynamic from "next/dynamic";

const EnhancedLocationsDisplayMap = dynamic(
  () => import("@/components/map/EnhancedLocationsDisplayMap"),
  { ssr: false }
);

export default function HomeMap() {
  const cardBg        = useColorModeValue("#FFFFFF", "#171B26");
  const cardBorder    = useColorModeValue("rgba(0,0,0,0.07)", "rgba(255,255,255,0.06)");
  const cardShadow    = useColorModeValue(
    "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
    "0 1px 3px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.3)"
  );
  const subtleText      = useColorModeValue("#6B7280", "#8B92A5");
  const strongText      = useColorModeValue("#111827", "#F0F2F7");
  const accentGreen     = useColorModeValue("#16A34A", "#22C55E");
  const accentGreenSoft = useColorModeValue("green.50", "rgba(34,197,94,0.08)");
  const dividerColor    = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.06)");

  const { data: reports, isLoading } = useSWR<IReport[]>(swrKeys.reports, fetcher);

  const locations = reports
    ?.filter((r) => r.location)
    .map((r) => ({ ...r.location, source: "report" as const })) ?? [];

  return (
    <Box 
      bg={cardBg}
      border="1px solid" borderColor={cardBorder}
      borderRadius="16px"
      boxShadow={cardShadow}
      overflow="hidden"
    >
      {/* Card header */}
      <Box px={6} py={4} borderBottom="1px solid" borderColor={dividerColor}>
        <HStack justify="space-between" align="center">
          <HStack spacing={2}>
            <Box
              w={7} h={7} borderRadius="lg" bg={accentGreenSoft}
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon as={FiMapPin} color={accentGreen} boxSize={3.5} />
            </Box>
            <Text fontWeight="600" fontSize="md" color={strongText}>
              Reports Map
            </Text>
          </HStack>

          {reports && (
            <Badge
              px={3} py={1} borderRadius="full"
              bg={accentGreenSoft} color={accentGreen}
              fontSize="11px" fontWeight="600"
              border="1px solid" borderColor={dividerColor}
            >
              {reports.length} report{reports.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </HStack>
      </Box>

      {/* Map body */}
      <Box position="relative">
        {isLoading && (
          <Center h="420px">
            <VStack spacing={4}>
              <Box
                w={12} h={12} borderRadius="full" bg={accentGreenSoft}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Spinner size="sm" color={accentGreen} thickness="3px" />
              </Box>
              <Text fontSize="sm" color={subtleText}>Loading map…</Text>
            </VStack>
          </Center>
        )}

        {!isLoading && (
          <EnhancedLocationsDisplayMap
            locations={locations}
            reports={reports ?? []}
            height={420}
            showPopups={false}
          />
        )}
      </Box>
    </Box>
  );
}