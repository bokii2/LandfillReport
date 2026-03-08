// "use client";

// import React, { useState, useRef } from "react";
// import {
//   Box,
//   Button,
//   FormControl,
//   FormLabel,
//   FormErrorMessage,
//   Heading,
//   Input,
//   Textarea,
//   VStack,
//   HStack,
//   Text,
//   Alert,
//   AlertIcon,
//   AlertDescription,
//   useToast,
//   Badge,
//   Container,
//   Center,
//   Card,
//   CardBody,
//   Icon,
//   SimpleGrid,
//   CardHeader,
//   useColorModeValue,
//   ButtonGroup,
//   Progress,
//   Image,
// } from "@chakra-ui/react";
// import { api } from "@/fetchers/report";
// import MapWrapper from "@/components/map/MapWrapper";
// import {
//   FiArrowLeft,
//   FiCamera,
//   FiCheckCircle,
//   FiFileText,
//   FiMapPin,
//   FiSend,
//   FiUpload,
//   FiX,
// } from "react-icons/fi";

// export const ReportForm = () => {
//   const toast = useToast();

//   const bgColor = useColorModeValue("gray.50", "gray.900");
//   const cardBgColor = useColorModeValue("white", "gray.800");
//   const borderColor = useColorModeValue("gray.200", "gray.700");
//   const textColor = useColorModeValue("gray.600", "gray.300");
//   const headingColor = useColorModeValue("gray.800", "white");
//   const mapBgColor = useColorModeValue("gray.100", "gray.700");
//   const hoverBg = useColorModeValue("green.50", "green.900");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);
//   const [submitProgress, setSubmitProgress] = useState(0);

//   const [description, setDescription] = useState("");
//   const [latitude, setLatitude] = useState<number | null>(null);
//   const [longitude, setLongitude] = useState<number | null>(null);
//   const [image, setImage] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);

//   const [descriptionError, setDescriptionError] = useState("");
//   const [locationError, setLocationError] = useState("");
//   const [imageError, setImageError] = useState("");

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const getCurrentLocation = () => {
//     setError(null);
//     setLocationError("");

//     if (!navigator.geolocation) {
//       setLocationError("Geolocation is not supported by your browser");
//       return;
//     }

//     setLoading(true);
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setLatitude(position.coords.latitude);
//         setLongitude(position.coords.longitude);
//         setLoading(false);
//         toast({
//           title: "Location captured",
//           description: "Your current location has been set successfully.",
//           status: "success",
//           duration: 3000,
//           isClosable: true,
//         });
//       },
//       (error) => {
//         setLocationError(`Unable to retrieve your location: ${error.message}`);
//         setLoading(false);
//         toast({
//           title: "Location error",
//           description: error.message,
//           status: "error",
//           duration: 5000,
//           isClosable: true,
//         });
//       },
//       { enableHighAccuracy: true }
//     );
//   };

//   const handlePositionChange = (lat: number, lng: number) => {
//     setLatitude(lat);
//     setLongitude(lng);
//     setLocationError("");
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     if (file.size > 5 * 1024 * 1024) {
//       setImageError(
//         "Image file is too large. Please select an image under 5MB."
//       );
//       if (fileInputRef.current) fileInputRef.current.value = "";
//       return;
//     }

//     if (!file.type.startsWith("image/")) {
//       setImageError("Please select an image file.");
//       if (fileInputRef.current) fileInputRef.current.value = "";
//       return;
//     }

//     setImage(file);
//     setImageError("");

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPreview(reader.result as string);
//     };
//     reader.readAsDataURL(file);
//   };

//   const removeImage = () => {
//     setImage(null);
//     setPreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     setError(null);
//     setDescriptionError("");
//     setLocationError("");
//     setImageError("");

//     let isValid = true;

//     if (!description.trim()) {
//       setDescriptionError("Please provide a description");
//       isValid = false;
//     }

//     if (latitude === null || longitude === null) {
//       setLocationError(
//         'Location is required. Please use the "Get Current Location" button or select on the map'
//       );
//       isValid = false;
//     }

//     if (!image) {
//       setImageError("Please upload an image of the landfill");
//       isValid = false;
//     }

//     if (!isValid) {
//       return;
//     }

//     setLoading(true);
//     setSubmitProgress(0);

//     try {
//       const progressInterval = setInterval(() => {
//         setSubmitProgress((prev) => {
//           if (prev >= 90) {
//             clearInterval(progressInterval);
//             return 90;
//           }
//           return prev + 10;
//         });
//       }, 200);

//       await api.sendReport({
//         description,
//         latitude: latitude!,
//         longitude: longitude!,
//         image: image!,
//       });

//       clearInterval(progressInterval);
//       setSubmitProgress(100);

//       setSuccess(true);
//       setDescription("");
//       setLatitude(null);
//       setLongitude(null);
//       setImage(null);
//       setPreview(null);
//       if (fileInputRef.current) fileInputRef.current.value = "";

//       toast({
//         title: "Report submitted",
//         description: "Your landfill report has been submitted successfully.",
//         status: "success",
//         duration: 5000,
//         isClosable: true,
//       });

//       setTimeout(() => {
//         window.location.href = "/home";
//       }, 3000);
//     } catch (err) {
//       console.error("Error submitting report:", err);
//       setError(
//         err instanceof Error
//           ? err.message
//           : "An error occurred while submitting the report"
//       );

//       toast({
//         title: "Submission failed",
//         description:
//           err instanceof Error
//             ? err.message
//             : "An error occurred while submitting the report",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//       });
//     } finally {
//       setLoading(false);
//       setSubmitProgress(0);
//     }
//   };

//   if (success) {
//     return (
//       <Box minH="100vh" bg={bgColor}>
//         <Container maxW="4xl" py={12}>
//           <Center h="60vh">
//             <Card bg={cardBgColor} borderColor={borderColor} maxW="md" w="full">
//               <CardBody textAlign="center">
//                 <VStack spacing={6}>
//                   <Icon as={FiCheckCircle} boxSize={16} color="green.500" />
//                   <VStack spacing={2}>
//                     <Heading size="lg" color={headingColor}>
//                       Report Submitted Successfully!
//                     </Heading>
//                     <Text color={textColor}>
//                       Thank you for reporting the illegal landfill. Your report
//                       has been received and will be reviewed by our team.
//                     </Text>
//                   </VStack>
//                   <Text fontSize="sm" color={textColor}>
//                     Redirecting to home page...
//                   </Text>
//                 </VStack>
//               </CardBody>
//             </Card>
//           </Center>
//         </Container>
//       </Box>
//     );
//   }

//   return (
//     <Box minH="100vh" bg={bgColor}>
//       <Container maxW="6xl" py={8}>
//         <VStack spacing={8} align="stretch">
//           <HStack justify="space-between" align="start">
//             <VStack align="start" spacing={2}>
//               <Button
//                 leftIcon={<FiArrowLeft />}
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => window.history.back()}
//               >
//                 Back
//               </Button>
//               <Heading size="xl" color={headingColor}>
//                 Report Illegal Landfill
//               </Heading>
//               <Text color={textColor} maxW="2xl">
//                 Help us protect the environment by reporting illegal waste
//                 disposal sites. Your report will be reviewed and action will be
//                 taken accordingly.
//               </Text>
//             </VStack>
//           </HStack>

//           <Box as="form" onSubmit={handleSubmit}>
//             <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
//               <VStack spacing={6} align="stretch">
//                 {error && (
//                   <Alert status="error" borderRadius="lg">
//                     <AlertIcon />
//                     <AlertDescription>{error}</AlertDescription>
//                   </Alert>
//                 )}

//                 <Card bg={cardBgColor} borderColor={borderColor}>
//                   <CardHeader>
//                     <HStack>
//                       <Icon as={FiFileText} color="blue.500" />
//                       <Heading size="md" color={headingColor}>
//                         Description
//                       </Heading>
//                     </HStack>
//                   </CardHeader>
//                   <CardBody pt={0}>
//                     <FormControl isInvalid={!!descriptionError} isRequired>
//                       <FormLabel color={headingColor}>
//                         Describe the landfill and surrounding area
//                       </FormLabel>
//                       <Textarea
//                         value={description}
//                         onChange={(e) => {
//                           setDescription(e.target.value);
//                           if (e.target.value.trim()) setDescriptionError("");
//                         }}
//                         placeholder="Provide detailed information about the illegal landfill, its size, types of waste, environmental impact, and any other relevant details..."
//                         size="md"
//                         rows={6}
//                         bg={cardBgColor}
//                       />
//                       <FormErrorMessage>{descriptionError}</FormErrorMessage>
//                     </FormControl>
//                   </CardBody>
//                 </Card>

//                 <Card bg={cardBgColor} borderColor={borderColor}>
//                   <CardHeader>
//                     <HStack>
//                       <Icon as={FiCamera} color="purple.500" />
//                       <Heading size="md" color={headingColor}>
//                         Photo Evidence
//                       </Heading>
//                     </HStack>
//                   </CardHeader>
//                   <CardBody pt={0}>
//                     <FormControl isInvalid={!!imageError} isRequired>
//                       <FormLabel color={headingColor}>
//                         Upload a clear image of the landfill
//                       </FormLabel>

//                       {!preview ? (
//                         <Box
//                           border="2px dashed"
//                           borderColor={borderColor}
//                           borderRadius="lg"
//                           p={8}
//                           textAlign="center"
//                           cursor="pointer"
//                           transition="all 0.2s"
//                           _hover={{
//                             borderColor: "green.400",
//                             bg: hoverBg,
//                           }}
//                           onClick={() => fileInputRef.current?.click()}
//                         >
//                           <VStack spacing={3}>
//                             <Icon as={FiUpload} boxSize={8} color="gray.400" />
//                             <VStack spacing={1}>
//                               <Text fontWeight="medium" color={headingColor}>
//                                 Click to upload image
//                               </Text>
//                               <Text fontSize="sm" color={textColor}>
//                                 Supports: JPG, PNG, GIF (max 5MB)
//                               </Text>
//                             </VStack>
//                           </VStack>
//                         </Box>
//                       ) : (
//                         <Box position="relative">
//                           <Box
//                             borderWidth={1}
//                             borderColor={borderColor}
//                             borderRadius="lg"
//                             overflow="hidden"
//                             h="300px"
//                           >
//                             <Image
//                               src={preview}
//                               alt="Image preview"
//                               objectFit="cover"
//                               w="full"
//                               h="full"
//                             />
//                           </Box>
//                           <Button
//                             position="absolute"
//                             top={2}
//                             right={2}
//                             size="sm"
//                             colorScheme="red"
//                             variant="solid"
//                             leftIcon={<FiX />}
//                             onClick={removeImage}
//                           >
//                             Remove
//                           </Button>
//                         </Box>
//                       )}

//                       <Input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         ref={fileInputRef}
//                         display="none"
//                       />

//                       <FormErrorMessage>{imageError}</FormErrorMessage>
//                     </FormControl>
//                   </CardBody>
//                 </Card>
//               </VStack>

//               <VStack spacing={6} align="stretch">
//                 <Card bg={cardBgColor} borderColor={borderColor}>
//                   <CardHeader>
//                     <HStack>
//                       <Icon as={FiMapPin} color="green.500" />
//                       <Heading size="md" color={headingColor}>
//                         Location
//                       </Heading>
//                     </HStack>
//                   </CardHeader>
//                   <CardBody pt={0}>
//                     <FormControl isInvalid={!!locationError} isRequired>
//                       <FormLabel color={headingColor}>
//                         Set the location of the landfill
//                       </FormLabel>

//                       <VStack spacing={4} align="stretch">
//                         <ButtonGroup size="sm" w="full">
//                           <Button
//                             onClick={getCurrentLocation}
//                             isLoading={loading}
//                             loadingText="Getting Location..."
//                             colorScheme="green"
//                             leftIcon={<FiMapPin />}
//                             flex={1}
//                           >
//                             Use Current Location
//                           </Button>
//                           {latitude !== null && longitude !== null && (
//                             <Badge colorScheme="green" p={2} borderRadius="md">
//                               <Icon as={FiCheckCircle} mr={1} />
//                               Located
//                             </Badge>
//                           )}
//                         </ButtonGroup>

//                         {latitude !== null && longitude !== null && (
//                           <Box p={3} bg={hoverBg} borderRadius="md">
//                             <Text
//                               fontSize="sm"
//                               color={textColor}
//                               textAlign="center"
//                             >
//                               <Text as="span" fontWeight="bold">
//                                 Coordinates:
//                               </Text>
//                               {` ${latitude.toFixed(6)}, ${longitude.toFixed(
//                                 6
//                               )}`}
//                             </Text>
//                           </Box>
//                         )}

//                         <Box borderRadius="lg" overflow="hidden">
//                           <MapWrapper
//                             latitude={latitude || 41.9981}
//                             longitude={longitude || 21.4254}
//                             onPositionChange={handlePositionChange}
//                             selectable={true}
//                             height={350}
//                           />
//                         </Box>

//                         <Text
//                           fontSize="sm"
//                           color={textColor}
//                           textAlign="center"
//                         >
//                           Click on the map to manually set the location
//                         </Text>
//                       </VStack>
//                       <FormErrorMessage>{locationError}</FormErrorMessage>
//                     </FormControl>
//                   </CardBody>
//                 </Card>
//               </VStack>
//             </SimpleGrid>

//             <Card bg={cardBgColor} borderColor={borderColor} mt={8}>
//               <CardBody>
//                 <VStack spacing={4}>
//                   {loading && (
//                     <Box w="full">
//                       <Text fontSize="sm" color={textColor} mb={2}>
//                         Submitting report... {submitProgress}%
//                       </Text>
//                       <Progress
//                         value={submitProgress}
//                         colorScheme="green"
//                         borderRadius="md"
//                         bg={mapBgColor}
//                       />
//                     </Box>
//                   )}

//                   <ButtonGroup spacing={4} w="full">
//                     <Button
//                       type="submit"
//                       isLoading={loading}
//                       loadingText="Submitting Report..."
//                       colorScheme="green"
//                       size="lg"
//                       leftIcon={<FiSend />}
//                       flex={1}
//                     >
//                       Submit Report
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="lg"
//                       onClick={() => window.history.back()}
//                       isDisabled={loading}
//                     >
//                       Cancel
//                     </Button>
//                   </ButtonGroup>
//                 </VStack>
//               </CardBody>
//             </Card>
//           </Box>
//         </VStack>
//       </Container>
//     </Box>
//   );
// };

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
  Icon,
  SimpleGrid,
  useColorModeValue,
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

  // ─── All hooks at top ─────────────────────────────────────────────────────
  const pageBg          = useColorModeValue("#F7F8FA", "#0F1117");
  const cardBg          = useColorModeValue("#FFFFFF", "#171B26");
  const cardBorder      = useColorModeValue("rgba(0,0,0,0.07)", "rgba(255,255,255,0.06)");
  const cardShadow      = useColorModeValue(
    "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
    "0 1px 3px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.3)"
  );
  const subtleText      = useColorModeValue("#6B7280", "#8B92A5");
  const strongText      = useColorModeValue("#111827", "#F0F2F7");
  const accentGreen     = useColorModeValue("#16A34A", "#22C55E");
  const accentGreenSoft = useColorModeValue("green.50", "rgba(34,197,94,0.08)");
  const dividerColor    = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.06)");
  const inputBg         = useColorModeValue("#F9FAFB", "#1E2330");
  const inputBorder     = useColorModeValue("rgba(0,0,0,0.08)", "rgba(255,255,255,0.08)");
  const hoverBg         = useColorModeValue("gray.50", "rgba(255,255,255,0.03)");
  const uploadBorder    = useColorModeValue("rgba(0,0,0,0.12)", "rgba(255,255,255,0.10)");
  const uploadHoverBg   = useColorModeValue("green.50", "rgba(34,197,94,0.06)");
  const coordsBg        = useColorModeValue("rgba(22,163,74,0.06)", "rgba(34,197,94,0.06)");
  const btnHoverBg      = useColorModeValue("#15803D", "#4ADE80");
  const focusShadow     = useColorModeValue(
    "0 0 0 3px rgba(22,163,74,0.15)",
    "0 0 0 3px rgba(34,197,94,0.15)"
  );
  const blueBg          = useColorModeValue("blue.50", "rgba(59,130,246,0.1)");
  const blueIcon        = useColorModeValue("blue.500", "blue.300");
  const purpleBg        = useColorModeValue("purple.50", "rgba(124,58,237,0.1)");
  const purpleIcon      = useColorModeValue("purple.500", "purple.300");
  const progressTrack   = useColorModeValue("gray.100", "rgba(255,255,255,0.05)");
  const successBg       = useColorModeValue(
    "linear(to-br, white, green.50)",
    "linear(to-br, #171B26, #0F1A12)"
  );
  // ──────────────────────────────────────────────────────────────────────────

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);

  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [descriptionError, setDescriptionError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [imageError, setImageError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const cardStyle = {
    bg: cardBg,
    border: "1px solid",
    borderColor: cardBorder,
    borderRadius: "16px",
    boxShadow: cardShadow,
    overflow: "hidden" as const,
  };

  const inputStyle = {
    bg: inputBg,
    border: "1px solid",
    borderColor: inputBorder,
    borderRadius: "10px",
    color: strongText,
    _placeholder: { color: subtleText },
    _hover: { borderColor: accentGreen },
    _focus: { borderColor: accentGreen, boxShadow: focusShadow, bg: cardBg },
    transition: "all 0.15s",
  };

  const sectionLabelStyle = {
    fontSize: "12px",
    fontWeight: "600" as const,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: subtleText,
  };

  // ─── Handlers ─────────────────────────────────────────────────────────────
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
          status: "success", duration: 3000, isClosable: true, position: "top-right",
        });
      },
      (error) => {
        setLocationError(`Unable to retrieve your location: ${error.message}`);
        setLoading(false);
        toast({
          title: "Location error", description: error.message,
          status: "error", duration: 5000, isClosable: true, position: "top-right",
        });
      },
      { enableHighAccuracy: true }
    );
  };

  const handlePositionChange = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    setLocationError("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image file is too large. Please select an image under 5MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      setImageError("Please select an image file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setImage(file);
    setImageError("");
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDescriptionError("");
    setLocationError("");
    setImageError("");

    let isValid = true;
    if (!description.trim()) { setDescriptionError("Please provide a description"); isValid = false; }
    if (latitude === null || longitude === null) {
      setLocationError('Location is required. Please use "Get Current Location" or select on the map');
      isValid = false;
    }
    if (!image) { setImageError("Please upload an image of the landfill"); isValid = false; }
    if (!isValid) return;

    setLoading(true);
    setSubmitProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setSubmitProgress((prev) => {
          if (prev >= 90) { clearInterval(progressInterval); return 90; }
          return prev + 10;
        });
      }, 200);

      await api.sendReport({
        description,
        latitude: latitude!,
        longitude: longitude!,
        image: image!,
      });

      clearInterval(progressInterval);
      setSubmitProgress(100);
      setSuccess(true);
      setDescription("");
      setLatitude(null);
      setLongitude(null);
      setImage(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      toast({
        title: "Report submitted",
        description: "Your landfill report has been submitted successfully.",
        status: "success", duration: 5000, isClosable: true, position: "top-right",
      });

      setTimeout(() => { window.location.href = "/home"; }, 3000);
    } catch (err) {
      console.error("Error submitting report:", err);
      const msg = err instanceof Error ? err.message : "An error occurred while submitting the report";
      setError(msg);
      toast({ title: "Submission failed", description: msg, status: "error", duration: 5000, isClosable: true, position: "top-right" });
    } finally {
      setLoading(false);
      setSubmitProgress(0);
    }
  };

  // ─── Success state ────────────────────────────────────────────────────────
  if (success) {
    return (
      <Box minH="100vh" bg={pageBg}>
        <Box h="3px" bgGradient="linear(to-r, green.400, teal.400)" />
        <Container maxW="4xl" py={12}>
          <Center h="70vh">
            <Box {...cardStyle} maxW="md" w="full" bgGradient={successBg} p={10} textAlign="center">
              <VStack spacing={6}>
                <Box
                  w={20} h={20} borderRadius="full"
                  bg={accentGreenSoft}
                  border="1px solid" borderColor={dividerColor}
                  display="flex" alignItems="center" justifyContent="center"
                  mx="auto"
                >
                  <Icon as={FiCheckCircle} boxSize={9} color={accentGreen} />
                </Box>
                <VStack spacing={2}>
                  <Heading size="lg" color={strongText} fontWeight="700" letterSpacing="-0.02em">
                    Report Submitted!
                  </Heading>
                  <Text color={subtleText} fontSize="md" lineHeight="1.75" maxW="sm">
                    Thank you for reporting the illegal landfill. Your report has been received
                    and will be reviewed by our team.
                  </Text>
                </VStack>
                <Text {...sectionLabelStyle}>Redirecting to home page…</Text>
              </VStack>
            </Box>
          </Center>
        </Container>
      </Box>
    );
  }

  // ─── Main form ────────────────────────────────────────────────────────────
  return (
    <Box minH="100vh" bg={pageBg}>
      <Box h="3px" bgGradient="linear(to-r, green.400, teal.400)" />

      <Container maxW="6xl" py={10}>
        <VStack spacing={8} align="stretch">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <Box {...cardStyle} px={6} py={5}>
            <HStack justify="space-between" align="center">
              <HStack spacing={4}>
                <Button
                  leftIcon={<FiArrowLeft size={13} />}
                  variant="ghost" size="sm"
                  color={subtleText} fontWeight="500"
                  _hover={{ color: strongText, bg: hoverBg }}
                  onClick={() => window.history.back()}
                >
                  Back
                </Button>
                <Box w="1px" h="20px" bg={dividerColor} />
                <VStack align="start" spacing={0.5}>
                  <Heading size="md" color={strongText} fontWeight="700" letterSpacing="-0.02em">
                    Report Illegal Landfill
                  </Heading>
                  <Text fontSize="xs" color={subtleText} fontWeight="500">
                    Help us protect the environment by reporting illegal waste disposal sites
                  </Text>
                </VStack>
              </HStack>
            </HStack>
          </Box>

          {/* ── Error alert ────────────────────────────────────────────── */}
          {error && (
            <Alert status="error" borderRadius="xl" border="1px solid" borderColor="red.200" bg="red.50">
              <AlertIcon />
              <AlertDescription fontWeight="500">{error}</AlertDescription>
            </Alert>
          )}

          {/* ── Form grid ──────────────────────────────────────────────── */}
          <Box as="form" onSubmit={handleSubmit}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>

              {/* LEFT column */}
              <VStack spacing={6} align="stretch">

                {/* Description card */}
                <Box {...cardStyle}>
                  <Box px={6} py={4} borderBottom="1px solid" borderColor={dividerColor}>
                    <HStack spacing={2}>
                      <Box w={7} h={7} borderRadius="lg" bg={blueBg}
                        display="flex" alignItems="center" justifyContent="center">
                        <Icon as={FiFileText} color={blueIcon} boxSize={3.5} />
                      </Box>
                      <Text fontWeight="600" fontSize="md" color={strongText}>Description</Text>
                    </HStack>
                  </Box>
                  <Box p={6}>
                    <FormControl isInvalid={!!descriptionError} isRequired>
                      <FormLabel {...sectionLabelStyle} mb={2}>
                        Describe the landfill and surrounding area
                      </FormLabel>
                      <Textarea
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          if (e.target.value.trim()) setDescriptionError("");
                        }}
                        placeholder="Provide detailed information about the illegal landfill, its size, types of waste, environmental impact..."
                        rows={7}
                        {...inputStyle}
                        resize="none"
                      />
                      <FormErrorMessage fontSize="xs">{descriptionError}</FormErrorMessage>
                    </FormControl>
                  </Box>
                </Box>

                {/* Photo evidence card */}
                <Box {...cardStyle}>
                  <Box px={6} py={4} borderBottom="1px solid" borderColor={dividerColor}>
                    <HStack spacing={2}>
                      <Box w={7} h={7} borderRadius="lg" bg={purpleBg}
                        display="flex" alignItems="center" justifyContent="center">
                        <Icon as={FiCamera} color={purpleIcon} boxSize={3.5} />
                      </Box>
                      <Text fontWeight="600" fontSize="md" color={strongText}>Photo Evidence</Text>
                    </HStack>
                  </Box>
                  <Box p={6}>
                    <FormControl isInvalid={!!imageError} isRequired>
                      <FormLabel {...sectionLabelStyle} mb={3}>
                        Upload a clear image of the landfill
                      </FormLabel>

                      {!preview ? (
                        <Box
                          border="2px dashed"
                          borderColor={uploadBorder}
                          borderRadius="12px"
                          p={10}
                          textAlign="center"
                          cursor="pointer"
                          transition="all 0.2s"
                          _hover={{ borderColor: accentGreen, bg: uploadHoverBg }}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <VStack spacing={3}>
                            <Box
                              w={12} h={12} borderRadius="full"
                              bg={accentGreenSoft}
                              display="flex" alignItems="center" justifyContent="center"
                              mx="auto"
                            >
                              <Icon as={FiUpload} boxSize={5} color={accentGreen} />
                            </Box>
                            <VStack spacing={1}>
                              <Text fontWeight="600" fontSize="sm" color={strongText}>
                                Click to upload image
                              </Text>
                              <Text fontSize="xs" color={subtleText}>
                                JPG, PNG, GIF — max 5MB
                              </Text>
                            </VStack>
                          </VStack>
                        </Box>
                      ) : (
                        <Box position="relative">
                          <Box borderRadius="12px" overflow="hidden" h="260px" border="1px solid" borderColor={cardBorder}>
                            <Image src={preview} alt="Preview" objectFit="cover" w="full" h="full" />
                          </Box>
                          <Button
                            position="absolute" top={3} right={3}
                            size="sm" colorScheme="red" variant="solid"
                            leftIcon={<FiX size={12} />}
                            borderRadius="8px" fontSize="xs" fontWeight="600"
                            onClick={removeImage}
                          >
                            Remove
                          </Button>
                        </Box>
                      )}

                      <Input
                        type="file" accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        display="none"
                      />
                      <FormErrorMessage fontSize="xs">{imageError}</FormErrorMessage>
                    </FormControl>
                  </Box>
                </Box>
              </VStack>

              {/* RIGHT column */}
              <VStack spacing={6} align="stretch">

                {/* Location card */}
                <Box {...cardStyle}>
                  <Box px={6} py={4} borderBottom="1px solid" borderColor={dividerColor}>
                    <HStack spacing={2}>
                      <Box w={7} h={7} borderRadius="lg" bg={accentGreenSoft}
                        display="flex" alignItems="center" justifyContent="center">
                        <Icon as={FiMapPin} color={accentGreen} boxSize={3.5} />
                      </Box>
                      <Text fontWeight="600" fontSize="md" color={strongText}>Location</Text>
                    </HStack>
                  </Box>
                  <Box p={6}>
                    <FormControl isInvalid={!!locationError} isRequired>
                      <FormLabel {...sectionLabelStyle} mb={3}>
                        Set the location of the landfill
                      </FormLabel>

                      <VStack spacing={4} align="stretch">
                        <HStack>
                          <Button
                            onClick={getCurrentLocation}
                            isLoading={loading}
                            loadingText="Getting location…"
                            leftIcon={<FiMapPin size={13} />}
                            bg={accentGreen} color="white"
                            borderRadius="10px" fontWeight="600"
                            fontSize="sm" flex={1}
                            _hover={{
                              bg: btnHoverBg,
                              transform: "translateY(-1px)",
                              boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
                            }}
                            _active={{ transform: "translateY(0)" }}
                            transition="all 0.18s"
                          >
                            Use Current Location
                          </Button>

                          {latitude !== null && longitude !== null && (
                            <Badge
                              px={3} py={1.5} borderRadius="8px"
                              bg={accentGreenSoft}
                              color={accentGreen}
                              border="1px solid" borderColor={dividerColor}
                              fontSize="11px" fontWeight="600"
                              display="flex" alignItems="center" gap={1}
                            >
                              <Icon as={FiCheckCircle} boxSize={3} />
                              Located
                            </Badge>
                          )}
                        </HStack>

                        {latitude !== null && longitude !== null && (
                          <Box
                            p={3.5} bg={coordsBg}
                            border="1px solid" borderColor={dividerColor}
                            borderRadius="10px"
                          >
                            <HStack justify="center" spacing={2}>
                              <Icon as={FiMapPin} boxSize={3.5} color={accentGreen} />
                              <Text fontSize="sm" color={strongText} fontWeight="500">
                                {latitude.toFixed(6)}, {longitude.toFixed(6)}
                              </Text>
                            </HStack>
                          </Box>
                        )}

                        <Box borderRadius="12px" overflow="hidden" border="1px solid" borderColor={cardBorder}>
                          <MapWrapper
                            latitude={latitude || 41.9981}
                            longitude={longitude || 21.4254}
                            onPositionChange={handlePositionChange}
                            selectable={true}
                            height={350}
                          />
                        </Box>

                        <Text fontSize="xs" color={subtleText} textAlign="center">
                          Or click on the map to manually set the location
                        </Text>
                      </VStack>
                      <FormErrorMessage fontSize="xs">{locationError}</FormErrorMessage>
                    </FormControl>
                  </Box>
                </Box>
              </VStack>
            </SimpleGrid>

            {/* ── Submit card ──────────────────────────────────────────── */}
            <Box {...cardStyle} mt={6}>
              <Box p={6}>
                <VStack spacing={4}>
                  {loading && (
                    <Box w="full">
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="xs" color={subtleText} fontWeight="500">
                          Submitting report…
                        </Text>
                        <Text fontSize="xs" color={accentGreen} fontWeight="600">
                          {submitProgress}%
                        </Text>
                      </HStack>
                      <Progress
                        value={submitProgress}
                        colorScheme="green"
                        borderRadius="full"
                        size="sm"
                        bg={progressTrack}
                      />
                    </Box>
                  )}

                  <HStack w="full" spacing={3}>
                    <Button
                      type="submit"
                      isLoading={loading}
                      loadingText="Submitting…"
                      leftIcon={<FiSend size={14} />}
                      bg={accentGreen} color="white"
                      borderRadius="10px" fontWeight="600"
                      size="lg" flex={1}
                      _hover={{
                        bg: btnHoverBg,
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
                      }}
                      _active={{ transform: "translateY(0)" }}
                      transition="all 0.18s"
                    >
                      Submit Report
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      borderRadius="10px"
                      fontWeight="500"
                      color={subtleText}
                      border="1px solid" borderColor={cardBorder}
                      isDisabled={loading}
                      onClick={() => window.history.back()}
                      _hover={{ color: strongText, bg: hoverBg }}
                    >
                      Cancel
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </Box>

          </Box>
        </VStack>
      </Container>
    </Box>
  );
};