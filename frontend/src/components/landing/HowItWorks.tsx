"use client";

import {
  Box, Heading, SimpleGrid, Text, VStack,
  useColorModeValue, Icon, Badge,
} from "@chakra-ui/react";
import { FiMapPin, FiSearch, FiCheckCircle } from "react-icons/fi";
import { IconType } from "react-icons/lib";

const steps: { title: string; text: string; icon: IconType; color: string; softColor: string }[] = [
  {
    title: "Report",
    text: "Choose a location on the map and describe the illegal waste disposal site with photos and details.",
    icon: FiMapPin,
    color: "#16A34A",
    softColor: "rgba(22,163,74,0.1)",
  },
  {
    title: "Review",
    text: "Authorities and our team review the submission, verify the report, and assign it for action.",
    icon: FiSearch,
    color: "#2563EB",
    softColor: "rgba(37,99,235,0.1)",
  },
  {
    title: "Resolution",
    text: "The landfill is cleaned up or the report is dismissed with a detailed explanation.",
    icon: FiCheckCircle,
    color: "#7C3AED",
    softColor: "rgba(124,58,237,0.1)",
  },
];

export default function HowItWorks() {
  const pageBg      = useColorModeValue("#F7F8FA", "#0F1117");
  const cardBg      = useColorModeValue("#FFFFFF", "#171B26");
  const cardBorder  = useColorModeValue("rgba(0,0,0,0.07)", "rgba(255,255,255,0.06)");
  const cardShadow  = useColorModeValue(
    "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
    "0 1px 3px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.3)"
  );
  const subtleText  = useColorModeValue("#6B7280", "#8B92A5");
  const strongText  = useColorModeValue("#111827", "#F0F2F7");
  const accentGreen = useColorModeValue("#16A34A", "#22C55E");
  const accentGreenSoft = useColorModeValue("rgba(22,163,74,0.08)", "rgba(34,197,94,0.08)");
  const dividerColor = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.06)");
  const connectorColor = useColorModeValue("rgba(0,0,0,0.08)", "rgba(255,255,255,0.08)");
  const cardHoverShadow = useColorModeValue("0 4px 20px rgba(0,0,0,0.10)", "0 4px 24px rgba(0,0,0,0.5)");

  return (
    <Box bg={pageBg} py={20} px={6}>
      <Box maxW="5xl" mx="auto">

        {/* Section header */}
        <VStack spacing={3} textAlign="center" mb={12}>
          <Badge
            px={3} py={1} borderRadius="full"
            bg={accentGreenSoft} color={accentGreen}
            fontSize="11px" fontWeight="600"
            letterSpacing="0.08em" textTransform="uppercase"
            border="1px solid" borderColor={dividerColor}
          >
            How It Works
          </Badge>
          <Heading
            fontSize={{ base: "2xl", md: "3xl" }}
            color={strongText}
            fontWeight="800"
            letterSpacing="-0.03em"
          >
            Three simple steps
          </Heading>
          <Text color={subtleText} fontSize="md" maxW="md" lineHeight="1.75">
            From spotting an illegal dump to seeing it cleaned — here&apos;s how the process works.
          </Text>
        </VStack>

        {/* Steps grid */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} position="relative">
          {/* Connector line (desktop only) */}
          <Box
            display={{ base: "none", md: "block" }}
            position="absolute"
            top="52px" left="calc(16.66% + 20px)" right="calc(16.66% + 20px)"
            h="1px" bg={connectorColor} zIndex={0}
          />

          {steps.map((step, i) => (
            <Box
              key={step.title}
              bg={cardBg}
              border="1px solid" borderColor={cardBorder}
              borderRadius="16px"
              boxShadow={cardShadow}
              p={7}
              position="relative"
              zIndex={1}
              transition="all 0.2s"
              _hover={{ transform: "translateY(-3px)", boxShadow: cardHoverShadow }}
            >
              {/* Step number */}
              <Box
                position="absolute" top={4} right={4}
                w={6} h={6} borderRadius="full"
                bg={step.softColor}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Text fontSize="11px" fontWeight="700" color={step.color}>{i + 1}</Text>
              </Box>

              {/* Icon */}
              <Box
                w={12} h={12} borderRadius="14px"
                bg={step.softColor}
                display="flex" alignItems="center" justifyContent="center"
                mb={5}
              >
                <Icon as={step.icon} color={step.color} boxSize={5} />
              </Box>

              <VStack align="start" spacing={2}>
                <Text fontWeight="700" fontSize="lg" color={strongText} letterSpacing="-0.02em">
                  {step.title}
                </Text>
                <Text fontSize="sm" color={subtleText} lineHeight="1.75">
                  {step.text}
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>

      </Box>
    </Box>
  );
}