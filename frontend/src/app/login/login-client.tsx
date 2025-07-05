"use client";

import dynamic from "next/dynamic";
import { Center, Spinner } from "@chakra-ui/react";

const LoginForm = dynamic(
  () =>
    import("@/components/auth/LoginForm/LoginForm").then((mod) => ({
      default: mod.LoginForm,
    })),
  {
    ssr: false,
    loading: () => (
      <Center h="300px">
        <Spinner size="xl" />
      </Center>
    ),
  }
);

export default function LoginClientWrapper() {
  return <LoginForm />;
}
