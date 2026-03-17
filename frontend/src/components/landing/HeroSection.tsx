"use client";

import { Box, Heading, Text, VStack, useColorModeValue, Badge } from "@chakra-ui/react";

export default function HeroSection() {
  const strongText      = useColorModeValue("#111827", "#F0F2F7");
  const subtleText      = useColorModeValue("#6B7280", "#8B92A5");
  const accentGreen     = useColorModeValue("#16A34A", "#22C55E");
  const accentGreenSoft = useColorModeValue("rgba(22,163,74,0.08)", "rgba(34,197,94,0.08)");
  const dividerColor    = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.06)");
  const heroBg          = useColorModeValue(
    "linear(to-br, white, green.50)",
    "linear(to-br, #171B26, #0F1A12)"
  );

  return (
    <Box
      minH="60vh"
      bgGradient={heroBg}
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
      px={6}
    >
      {/* Decorative background circles */}
      <Box
        position="absolute" top="-80px" right="-80px"
        w="360px" h="360px" borderRadius="full"
        bg={accentGreenSoft} filter="blur(60px)"
        pointerEvents="none"
      />
      <Box
        position="absolute" bottom="-60px" left="-60px"
        w="280px" h="280px" borderRadius="full"
        bg={accentGreenSoft} filter="blur(50px)"
        pointerEvents="none"
      />

      <VStack spacing={7} textAlign="center" maxW="3xl" position="relative" zIndex={1}>
        <Badge
          px={3} py={1} borderRadius="full"
          bg={accentGreenSoft}
          color={accentGreen}
          fontSize="11px" fontWeight="600"
          letterSpacing="0.08em" textTransform="uppercase"
          border="1px solid" borderColor={dividerColor}
        >
          Environmental Protection Platform
        </Badge>

        <VStack spacing={4}>
          <Heading
            fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
            color={strongText}
            fontWeight="800"
            letterSpacing="-0.03em"
            lineHeight="1.1"
          >
            Report Illegal{" "}
            <Text as="span" color={accentGreen}>Landfills</Text>
          </Heading>

          <Text
            fontSize={{ base: "md", md: "lg" }}
            color={subtleText}
            maxW="xl"
            lineHeight="1.75"
          >
            Help protect the environment by reporting illegal waste disposal sites.
            Together we can keep our communities clean and safe.
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
}