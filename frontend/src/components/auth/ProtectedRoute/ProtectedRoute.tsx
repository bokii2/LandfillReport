"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Center, Spinner } from "@chakra-ui/react";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({
  children,
  adminOnly = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    console.log("ProtectedRoute check - Auth status:", {
      loading,
      isAuthenticated,
      isAdmin,
      adminOnly,
    });

    if (!loading) {
      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to login");
        router.push("/login");
      } else if (adminOnly && !isAdmin) {
        console.log("Not admin, redirecting to unauthorized");
        router.push("/unauthorized");
      } else {
        console.log("Authentication successful, staying on page");
      }
    }

    return () => {
      setIsMounted(false);
    };
  }, [isAuthenticated, isAdmin, loading, router, adminOnly]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!isAuthenticated || (adminOnly && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
