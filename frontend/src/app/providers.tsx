"use client";

import { AuthProvider } from "@/context/AuthContext";
import {
  ChakraProvider,
  cookieStorageManagerSSR,
  localStorageManager,
} from "@chakra-ui/react";
import { Suspense } from "react";

export function Providers({
  children,
  cookies,
}: {
  children: React.ReactNode;
  cookies?: string;
}) {
  const colorModeManager =
    typeof cookies === "string"
      ? cookieStorageManagerSSR(cookies)
      : localStorageManager;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChakraProvider colorModeManager={colorModeManager}>
        <AuthProvider>{children}</AuthProvider>
      </ChakraProvider>
    </Suspense>
  );
}