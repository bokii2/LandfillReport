"use client";

import { Box, Button, Link, HStack, useColorModeValue, Text } from "@chakra-ui/react";
import { FiLogIn, FiUserPlus } from "react-icons/fi";

export default function LoginButton() {
  const accentGreen  = useColorModeValue("#16A34A", "#22C55E");
  const btnHoverBg   = useColorModeValue("#15803D", "#4ADE80");
  const subtleText   = useColorModeValue("#6B7280", "#8B92A5");
  const strongText   = useColorModeValue("#111827", "#F0F2F7");
  const cardBg       = useColorModeValue("#FFFFFF", "#171B26");
  const cardBorder   = useColorModeValue("rgba(0,0,0,0.07)", "rgba(255,255,255,0.06)");
  const hoverBg      = useColorModeValue("gray.50", "rgba(255,255,255,0.03)");

  return (
    <Box
      py={10}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={4}
    >
      <Text fontSize="sm" color={subtleText} fontWeight="500">
        Ready to make a difference?
      </Text>

      <HStack spacing={3} flexWrap="wrap" justify="center">
        <Button
          as={Link}
          href="/login"
          leftIcon={<FiLogIn size={15} />}
          bg={accentGreen} color="white"
          borderRadius="10px" fontWeight="600"
          size="lg" px={8}
          _hover={{
            bg: btnHoverBg,
            transform: "translateY(-1px)",
            boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
            textDecoration: "none",
          }}
          _active={{ transform: "translateY(0)" }}
          transition="all 0.18s"
        >
          Sign In
        </Button>

        <Button
          as={Link}
          href="/register"
          leftIcon={<FiUserPlus size={15} />}
          variant="ghost"
          borderRadius="10px" fontWeight="600"
          size="lg" px={8}
          color={subtleText}
          bg={cardBg}
          border="1px solid" borderColor={cardBorder}
          _hover={{ color: strongText, bg: hoverBg, textDecoration: "none" }}
          transition="all 0.15s"
        >
          Create Account
        </Button>
      </HStack>
    </Box>
  );
}