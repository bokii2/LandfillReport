import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";

const steps = [
  { title: "1. Пријави", text: "Избери локација и опиши проблем" },
  { title: "2. Проверка", text: "Институциите ја разгледуваат пријавата" },
  { title: "3. Решение", text: "Депонијата се чисти или се одбива" },
];

export default function HowItWorks() {
  return (
    <Box py={16} textAlign="center">
      <Heading mb={8}>Како функционира?</Heading>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
        {steps.map((step) => (
          <Box key={step.title}>
            <Heading size="md">{step.title}</Heading>
            <Text mt={2}>{step.text}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}