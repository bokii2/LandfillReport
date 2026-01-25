import { Button, Link, Stack } from "@chakra-ui/react";

export default function LoginButton() {
  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      spacing={4}
      justify="center"
      my={10}
    >
      <Button
        colorScheme="green"
        size="lg"
        as={Link}
        href="/login"
      >
        Најави се
      </Button>
    </Stack>
  );
}