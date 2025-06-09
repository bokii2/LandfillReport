"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Text,
  Image,
  Heading,
  useToast,
  useColorModeValue,
  Container,
  Center,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Icon,
  HStack,
  Badge,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  ButtonGroup,
  Divider,
} from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";
import useSWR, { mutate } from "swr";
import { IReport } from "@/typings/Report.type";
import { swrKeys } from "@/fetchers/swrKeys";
import { fetcher } from "@/fetchers/fetcher";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/fetchers/report";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCalendar,
  FiEdit3,
  FiFileText,
  FiImage,
  FiMapPin,
  FiSave,
  FiUser,
} from "react-icons/fi";
import EnhancedLocationsDisplayMap from "@/components/map/EnhancedLocationsDisplayMap";

export const ReportDetails = () => {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();

  const reportId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : null;

  const reportUrl = reportId ? `${swrKeys.reports}/${reportId}` : null;
  const {
    data: report,
    error,
    isLoading,
  } = useSWR<IReport>(reportUrl, fetcher);

  const [status, setStatus] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");

  useEffect(() => {
    if (report) {
      setStatus(report.status);
      if (report.image?.imageData) {
        setImageSrc(
          `data:${report.image.type};base64,${report.image.imageData}`
        );
      }
    }
  }, [report]);

  if (typeof window === "undefined") return null;

  // Loading State
  if (isLoading) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Container maxW="6xl" py={8}>
          <Center h="60vh">
            <VStack spacing={4}>
              <Spinner size="xl" color="green.500" />
              <Text color={textColor}>Loading report details...</Text>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  // Error State
  if (error) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Container maxW="6xl" py={8}>
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <AlertTitle>Error loading report!</AlertTitle>
            <AlertDescription>
              Unable to fetch report details. Please try again later.
            </AlertDescription>
          </Alert>
        </Container>
      </Box>
    );
  }

  // Not Found State
  if (!report) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Container maxW="6xl" py={8}>
          <Center h="60vh">
            <VStack spacing={6} textAlign="center">
              <Icon as={FiFileText} boxSize={16} color="gray.400" />
              <VStack spacing={2}>
                <Heading size="lg" color={headingColor}>
                  Report Not Found
                </Heading>
                <Text color={textColor}>
                  The requested report could not be found.
                </Text>
              </VStack>
              <Button
                colorScheme="green"
                leftIcon={<FiArrowLeft />}
                onClick={() => router.back()}
              >
                Go Back
              </Button>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  };

  //   const handleUpdateStatus = async () => {
  //     if (!reportId) return;

  //     setIsUpdating(true);
  //     try {
  //       await api.updateReportStatus(
  //         reportId,
  //         status as "APPROVED" | "REJECTED" | "PENDING"
  //       );
  //       await mutate(reportUrl);
  //       toast({
  //         title: "Status Updated",
  //         description: "Report status has been successfully updated.",
  //         status: "success",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //     } catch (error) {
  //       console.error("Failed to update status:", error);
  //       toast({
  //         title: "Update Failed",
  //         description: "Failed to update status. Please try again.",
  //         status: "error",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //     } finally {
  //       setIsUpdating(false);
  //     }
  //   };

  const handleUpdateStatus = async () => {
    if (!reportId) {
      console.error("No reportId available");
      return;
    }

    console.log("Updating status:", { reportId, status }); // Debug log

    setIsUpdating(true);
    try {
      await api.updateReportStatus(reportId, status);
      await mutate(reportUrl);
      toast({
        title: "Status Updated",
        description: "Report status has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to update status:", error);

      // More detailed error message
      let errorMessage = "Failed to update status. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Update Failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "green";
      case "PENDING":
        return "yellow";
      case "REJECTED":
        return "red";
      default:
        return "gray";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="6xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={2}>
              <Button
                leftIcon={<FiArrowLeft />}
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
              >
                Back to Reports
              </Button>
              {/* <Heading size="xl" color={headingColor}>
                {report.title || 'Report Details'}
              </Heading> */}
              <HStack spacing={3}>
                <Badge
                  colorScheme={getStatusColor(report.status)}
                  variant="subtle"
                  //   leftIcon={<Icon as={getStatusIcon(report.status)} />}
                  px={3}
                  py={1}
                >
                  {report.status}
                </Badge>
                {/* {report.priority && (
                  <Badge colorScheme="purple" variant="outline">
                    {report.priority.toUpperCase()} PRIORITY
                  </Badge>
                )}
                {report.category && (
                  <Badge colorScheme="blue" variant="subtle">
                    {report.category}
                  </Badge>
                )} */}
              </HStack>
            </VStack>
          </HStack>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {/* Left Column - Map and Image */}
            <VStack spacing={6} align="stretch">
              {/* Map Section */}
              <Card bg={cardBgColor} borderColor={borderColor}>
                <CardHeader>
                  <HStack>
                    <Icon as={FiMapPin} color="green.500" />
                    <Heading size="md" color={headingColor}>
                      Location
                    </Heading>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <EnhancedLocationsDisplayMap locations={report.location} />
                  {/* <EnhancedMapView
                    location={report.location}
                    title={report.title}
                  /> */}
                  {/* {report.location.address && (
                    <Text mt={3} fontSize="sm" color={textColor}>
                      <strong>Address:</strong> {report.location.address}
                    </Text>
                  )} */}
                </CardBody>
              </Card>

              {/* Image Section */}
              {imageSrc && (
                <Card bg={cardBgColor} borderColor={borderColor}>
                  <CardHeader>
                    <HStack>
                      <Icon as={FiImage} color="blue.500" />
                      <Heading size="md" color={headingColor}>
                        Attached Image
                      </Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody pt={0}>
                    <Image
                      src={imageSrc}
                      alt="Report attachment"
                      maxW="100%"
                      borderRadius="md"
                      border="1px solid"
                      borderColor={borderColor}
                    />
                    {/* {report.image?.filename && (
                      <Text mt={2} fontSize="sm" color={textColor}>
                        {report.image.filename}
                      </Text>
                    )} */}
                  </CardBody>
                </Card>
              )}
            </VStack>

            {/* Right Column - Details and Actions */}
            <VStack spacing={6} align="stretch">
              {/* Report Details */}
              <Card bg={cardBgColor} borderColor={borderColor}>
                <CardHeader>
                  <HStack>
                    <Icon as={FiFileText} color="green.500" />
                    <Heading size="md" color={headingColor}>
                      Report Information
                    </Heading>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <Text fontWeight="semibold" color={headingColor} mb={2}>
                        Description
                      </Text>
                      <Text color={textColor} lineHeight="tall">
                        {report.description}
                      </Text>
                    </Box>

                    <Divider />

                    <SimpleGrid columns={1} spacing={4}>
                      <HStack justify="space-between">
                        <HStack>
                          <Icon as={FiUser} color={textColor} />
                          <Text fontWeight="semibold" color={headingColor}>
                            Created By:
                          </Text>
                        </HStack>
                        <Text color={textColor}>{report.createdBy}</Text>
                      </HStack>

                      <HStack justify="space-between">
                        <HStack>
                          <Icon as={FiCalendar} color={textColor} />
                          <Text fontWeight="semibold" color={headingColor}>
                            Created At:
                          </Text>
                        </HStack>
                        <Text color={textColor} fontSize="sm">
                          {report.createdAt
                            ? formatDate(report.createdAt.toString())
                            : "No date"}
                        </Text>
                      </HStack>
                    </SimpleGrid>
                  </VStack>
                </CardBody>
              </Card>

              {/* Status Management */}
              <Card bg={cardBgColor} borderColor={borderColor}>
                <CardHeader>
                  <HStack>
                    <Icon as={FiEdit3} color="orange.500" />
                    <Heading size="md" color={headingColor}>
                      Status Management
                    </Heading>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel color={headingColor}>Update Status</FormLabel>
                      <Select
                        value={status}
                        onChange={handleStatusChange}
                        bg={cardBgColor}
                      >
                        <option value="PENDING">Pending Review</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </Select>
                    </FormControl>

                    <ButtonGroup spacing={3} w="full">
                      <Button
                        colorScheme="green"
                        leftIcon={<FiSave />}
                        onClick={handleUpdateStatus}
                        isLoading={isUpdating}
                        loadingText="Updating..."
                        flex={1}
                      >
                        Update Status
                      </Button>
                      <Button
                        variant="outline"
                        leftIcon={<FiArrowLeft />}
                        onClick={() => router.push("/reports")}
                        flex={1}
                      >
                        Back to Reports
                      </Button>
                    </ButtonGroup>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};
