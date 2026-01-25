import { Box, Heading, Stack, Text } from "@chakra-ui/react";

export default function HeroSection() {
  return (
    <Box bg="green.600" color="white" py={24} textAlign="center">
      <Stack spacing={4}>
        <Heading size="2xl">
          Пријави нелегална депонија
        </Heading>
        <Text fontSize="xl">
          За почиста и побезбедна животна средина
        </Text>
      </Stack>
    </Box>
  );
}