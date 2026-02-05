import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Container,
  Heading,
  HStack,
  Icon,
  //   Select,
  SimpleGrid,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { ReportItem } from "../ReportItem/ReportItem";
import { FiArrowLeft, FiFileText, FiRefreshCw } from "react-icons/fi";
import { swrKeys } from "@/fetchers/swrKeys";
import { IReport } from "@/typings/Report.type";
import useSWR from "swr";
import { fetcher } from "@/fetchers/fetcher";
import NextLink from "next/link";

export const MyReportsList = () => {
  const {
    data: reports,
    error,
    isLoading,
    mutate,
  } = useSWR<IReport[]>(`${swrKeys.reportsByMe}`, fetcher);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");

  // if (typeof window === "undefined") return null;

  // Loading State
  if (isLoading) {
    return (
      <Box minH="50vh" bg={bgColor}>
        <Container maxW="7xl" py={8}>
          <Center h="40vh">
            <VStack spacing={4}>
              <Spinner size="xl" color="green.500" />
              <Text color={textColor}>Loading reports...</Text>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  // Error State
  if (error) {
    return (
      <Box minH="50vh" bg={bgColor}>
        <Container maxW="7xl" py={8}>
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <AlertTitle>Error loading reports!</AlertTitle>
            <AlertDescription>
              Unable to fetch reports. Please try again later.
            </AlertDescription>
            <Button
              ml="auto"
              size="sm"
              leftIcon={<FiRefreshCw />}
              onClick={() => mutate()}
            >
              Retry
            </Button>
          </Alert>
        </Container>
      </Box>
    );
  }

  // Empty State
  if (!reports || reports.length === 0) {
    return (
      <Box minH="50vh" bg={bgColor}>
        <Container maxW="7xl" py={8}>
          <Center h="40vh">
            <VStack spacing={6} textAlign="center">
              <Icon as={FiFileText} boxSize={16} color="gray.400" />
              <VStack spacing={2}>
                <Heading size="lg" color={headingColor}>
                  No Reports Available
                </Heading>
                <Text color={textColor} maxW="md">
                  There are currently no reports to display. Create your first
                  report to get started.
                </Text>
              </VStack>
              <Button
                colorScheme="green"
                leftIcon={<FiFileText />}
                as={NextLink}
                href={`/home`}
              >
                Home
              </Button>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="6xl" py={8}>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Button
                variant="outline"
                size="sm"
                as={NextLink}
                href={`/home`}
                leftIcon={<FiArrowLeft />}
              >
                Home
              </Button>
              <Heading size="lg" color={headingColor}>
                Recent Reports
              </Heading>
              <Text color={textColor} fontSize="sm">
                {reports.length} report{reports.length !== 1 ? "s" : ""} found
              </Text>
            </VStack>
            {/* <HStack spacing={3}>
          <Select
            size="sm"
            width="200px"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </Select>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<FiRefreshCw />}
            onClick={() => mutate()}
          >
            Refresh
          </Button>
        </HStack> */}
          </HStack>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            {reports.map((report) => (
              <ReportItem key={report.id} report={report} />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};
