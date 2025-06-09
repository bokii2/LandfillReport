"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Textarea,
  VStack,
  HStack,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
  useToast,
  Badge,
  Container,
  Center,
  Card,
  CardBody,
  Icon,
  SimpleGrid,
  CardHeader,
  useColorModeValue,
  ButtonGroup,
  Progress,
  Image,
} from "@chakra-ui/react";
import { api } from "@/fetchers/report";
import MapWrapper from "@/components/map/MapWrapper";
import {
  FiArrowLeft,
  FiCamera,
  FiCheckCircle,
  FiFileText,
  FiMapPin,
  FiSend,
  FiUpload,
  FiX,
} from "react-icons/fi";

export const ReportForm = () => {
  const toast = useToast();

  // Color mode values - must be at the top before any returns
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");
  const mapBgColor = useColorModeValue("gray.100", "gray.700");
  const hoverBg = useColorModeValue("green.50", "green.900");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);

  // Form data
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Validation states
  const [descriptionError, setDescriptionError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [imageError, setImageError] = useState("");

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current location
  const getCurrentLocation = () => {
    setError(null);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLoading(false);
        toast({
          title: "Location captured",
          description: "Your current location has been set successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      (error) => {
        setLocationError(`Unable to retrieve your location: ${error.message}`);
        setLoading(false);
        toast({
          title: "Location error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
      { enableHighAccuracy: true }
    );
  };

  // Handle map position change
  const handlePositionChange = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    setLocationError("");
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError(
        "Image file is too large. Please select an image under 5MB."
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setImageError("Please select an image file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setImage(file);
    setImageError("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setError(null);
    setDescriptionError("");
    setLocationError("");
    setImageError("");

    // Validate form data
    let isValid = true;

    if (!description.trim()) {
      setDescriptionError("Please provide a description");
      isValid = false;
    }

    if (latitude === null || longitude === null) {
      setLocationError(
        'Location is required. Please use the "Get Current Location" button or select on the map'
      );
      isValid = false;
    }

    if (!image) {
      setImageError("Please upload an image of the landfill");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    setLoading(true);
    setSubmitProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setSubmitProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Send report to API
      await api.sendReport({
        description,
        latitude: latitude!,
        longitude: longitude!,
        image: image!,
      });

      clearInterval(progressInterval);
      setSubmitProgress(100);

      // Reset form on success
      setSuccess(true);
      setDescription("");
      setLatitude(null);
      setLongitude(null);
      setImage(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Show success toast
      toast({
        title: "Report submitted",
        description: "Your landfill report has been submitted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Redirect to reports list after 3 seconds
      setTimeout(() => {
        window.location.href = "/home";
      }, 3000);
    } catch (err) {
      console.error("Error submitting report:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while submitting the report"
      );

      toast({
        title: "Submission failed",
        description:
          err instanceof Error
            ? err.message
            : "An error occurred while submitting the report",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setSubmitProgress(0);
    }
  };

  if (success) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Container maxW="4xl" py={12}>
          <Center h="60vh">
            <Card bg={cardBgColor} borderColor={borderColor} maxW="md" w="full">
              <CardBody textAlign="center">
                <VStack spacing={6}>
                  <Icon as={FiCheckCircle} boxSize={16} color="green.500" />
                  <VStack spacing={2}>
                    <Heading size="lg" color={headingColor}>
                      Report Submitted Successfully!
                    </Heading>
                    <Text color={textColor}>
                      Thank you for reporting the illegal landfill. Your report
                      has been received and will be reviewed by our team.
                    </Text>
                  </VStack>
                  <Text fontSize="sm" color={textColor}>
                    Redirecting to home page...
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </Center>
        </Container>
      </Box>
    );
  }

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
                onClick={() => window.history.back()}
              >
                Back
              </Button>
              <Heading size="xl" color={headingColor}>
                Report Illegal Landfill
              </Heading>
              <Text color={textColor} maxW="2xl">
                Help us protect the environment by reporting illegal waste
                disposal sites. Your report will be reviewed and action will be
                taken accordingly.
              </Text>
            </VStack>
          </HStack>

          <Box as="form" onSubmit={handleSubmit}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
              {/* Left Column - Form Fields */}
              <VStack spacing={6} align="stretch">
                {/* Error display */}
                {error && (
                  <Alert status="error" borderRadius="lg">
                    <AlertIcon />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Description */}
                <Card bg={cardBgColor} borderColor={borderColor}>
                  <CardHeader>
                    <HStack>
                      <Icon as={FiFileText} color="blue.500" />
                      <Heading size="md" color={headingColor}>
                        Description
                      </Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody pt={0}>
                    <FormControl isInvalid={!!descriptionError} isRequired>
                      <FormLabel color={headingColor}>
                        Describe the landfill and surrounding area
                      </FormLabel>
                      <Textarea
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          if (e.target.value.trim()) setDescriptionError("");
                        }}
                        placeholder="Provide detailed information about the illegal landfill, its size, types of waste, environmental impact, and any other relevant details..."
                        size="md"
                        rows={6}
                        bg={cardBgColor}
                      />
                      <FormErrorMessage>{descriptionError}</FormErrorMessage>
                    </FormControl>
                  </CardBody>
                </Card>

                {/* Image Upload */}
                <Card bg={cardBgColor} borderColor={borderColor}>
                  <CardHeader>
                    <HStack>
                      <Icon as={FiCamera} color="purple.500" />
                      <Heading size="md" color={headingColor}>
                        Photo Evidence
                      </Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody pt={0}>
                    <FormControl isInvalid={!!imageError} isRequired>
                      <FormLabel color={headingColor}>
                        Upload a clear image of the landfill
                      </FormLabel>

                      {!preview ? (
                        <Box
                          border="2px dashed"
                          borderColor={borderColor}
                          borderRadius="lg"
                          p={8}
                          textAlign="center"
                          cursor="pointer"
                          transition="all 0.2s"
                          _hover={{
                            borderColor: "green.400",
                            bg: hoverBg,
                          }}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <VStack spacing={3}>
                            <Icon as={FiUpload} boxSize={8} color="gray.400" />
                            <VStack spacing={1}>
                              <Text fontWeight="medium" color={headingColor}>
                                Click to upload image
                              </Text>
                              <Text fontSize="sm" color={textColor}>
                                Supports: JPG, PNG, GIF (max 5MB)
                              </Text>
                            </VStack>
                          </VStack>
                        </Box>
                      ) : (
                        <Box position="relative">
                          <Box
                            borderWidth={1}
                            borderColor={borderColor}
                            borderRadius="lg"
                            overflow="hidden"
                            h="300px"
                          >
                            <Image
                              src={preview}
                              alt="Image preview"
                              objectFit="cover"
                              w="full"
                              h="full"
                            />
                          </Box>
                          <Button
                            position="absolute"
                            top={2}
                            right={2}
                            size="sm"
                            colorScheme="red"
                            variant="solid"
                            leftIcon={<FiX />}
                            onClick={removeImage}
                          >
                            Remove
                          </Button>
                        </Box>
                      )}

                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        display="none"
                      />

                      <FormErrorMessage>{imageError}</FormErrorMessage>
                    </FormControl>
                  </CardBody>
                </Card>
              </VStack>

              {/* Right Column - Location */}
              <VStack spacing={6} align="stretch">
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
                    <FormControl isInvalid={!!locationError} isRequired>
                      <FormLabel color={headingColor}>
                        Set the location of the landfill
                      </FormLabel>

                      <VStack spacing={4} align="stretch">
                        <ButtonGroup size="sm" w="full">
                          <Button
                            onClick={getCurrentLocation}
                            isLoading={loading}
                            loadingText="Getting Location..."
                            colorScheme="green"
                            leftIcon={<FiMapPin />}
                            flex={1}
                          >
                            Use Current Location
                          </Button>
                          {latitude !== null && longitude !== null && (
                            <Badge colorScheme="green" p={2} borderRadius="md">
                              <Icon as={FiCheckCircle} mr={1} />
                              Located
                            </Badge>
                          )}
                        </ButtonGroup>

                        {/* Coordinates display */}
                        {latitude !== null && longitude !== null && (
                          <Box p={3} bg={hoverBg} borderRadius="md">
                            <Text
                              fontSize="sm"
                              color={textColor}
                              textAlign="center"
                            >
                              <Text as="span" fontWeight="bold">
                                Coordinates:
                              </Text>
                              {` ${latitude.toFixed(6)}, ${longitude.toFixed(
                                6
                              )}`}
                            </Text>
                          </Box>
                        )}

                        {/* Map */}
                        <Box borderRadius="lg" overflow="hidden">
                          <MapWrapper
                            latitude={latitude || 41.9981} // Default to Macedonia/Skopje
                            longitude={longitude || 21.4254}
                            onPositionChange={handlePositionChange}
                            selectable={true}
                            height={350}
                          />
                        </Box>

                        <Text
                          fontSize="sm"
                          color={textColor}
                          textAlign="center"
                        >
                          Click on the map to manually set the location
                        </Text>
                      </VStack>

                      <FormErrorMessage>{locationError}</FormErrorMessage>
                    </FormControl>
                  </CardBody>
                </Card>
              </VStack>
            </SimpleGrid>

            {/* Submit Section */}
            <Card bg={cardBgColor} borderColor={borderColor} mt={8}>
              <CardBody>
                <VStack spacing={4}>
                  {loading && (
                    <Box w="full">
                      <Text fontSize="sm" color={textColor} mb={2}>
                        Submitting report... {submitProgress}%
                      </Text>
                      <Progress
                        value={submitProgress}
                        colorScheme="green"
                        borderRadius="md"
                        bg={mapBgColor}
                      />
                    </Box>
                  )}

                  <ButtonGroup spacing={4} w="full">
                    <Button
                      type="submit"
                      isLoading={loading}
                      loadingText="Submitting Report..."
                      colorScheme="green"
                      size="lg"
                      leftIcon={<FiSend />}
                      flex={1}
                    >
                      Submit Report
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => window.history.back()}
                      isDisabled={loading}
                    >
                      Cancel
                    </Button>
                  </ButtonGroup>
                </VStack>
              </CardBody>
            </Card>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};
