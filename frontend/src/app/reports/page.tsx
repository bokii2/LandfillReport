"use client";

import { useEffect, useState } from "react";
import { Container, Heading, Text, Spinner, Center } from "@chakra-ui/react";
import { ReportList } from "@/components/report/ReportList/ReportList";
import ProtectedRoute from "@/components/auth/ProtectedRoute/ProtectedRoute";

export default function Reports() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // app/reports/page.tsx
  useEffect(() => {
    const getReports = async () => {
      const token = localStorage.getItem("authToken");
      console.log("Reports page - token exists:", !!token);

      try {
        const response = await fetch("http://localhost:8080/api/reports", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Reports API response status:", response.status);

        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }

        const data = await response.json();
        setReports(data);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getReports();
  }, []);

  if (loading) {
    return (
      <Center h="500px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md" py={10}>
        <Heading color="red.500">Error</Heading>
        <Text>{error}</Text>
      </Container>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <ReportList />
    </ProtectedRoute>
  );
}
