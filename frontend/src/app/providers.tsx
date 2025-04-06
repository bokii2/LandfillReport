'use client'

import { AuthProvider } from "@/context/AuthContext";
import { ChakraProvider } from "@chakra-ui/react";
import { Suspense } from "react";

export function Providers ({children} : {children: React.ReactNode}) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
        <ChakraProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ChakraProvider>
        </Suspense>
    )
}