// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   FormControl,
//   FormLabel,
//   VStack,
//   HStack,
//   Heading,
//   Text,
//   useToast,
//   FormErrorMessage,
//   Alert,
//   AlertIcon,
//   Card,
//   CardBody,
//   Container,
//   useColorModeValue,
//   Icon,
//   Divider,
//   Center,
// } from "@chakra-ui/react";
// import { FiUser, FiLogIn, FiUserPlus } from "react-icons/fi";
// import { EmailInput } from "@/components/shared/EmailInput/EmailInput";
// import { PasswordInput } from "@/components/shared/PasswordInput/PasswordInput";

// interface ILoginForm {
//   username: string;
//   password: string;
//   invalidError?: string;
// }

// const LoginForm: React.FC = () => {
//   const toast = useToast();
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isMounted, setIsMounted] = useState<boolean>(false);

//   const bgColor = useColorModeValue("gray.50", "gray.900");
//   const cardBgColor = useColorModeValue("white", "gray.800");
//   const borderColor = useColorModeValue("gray.200", "gray.700");
//   const textColor = useColorModeValue("gray.600", "gray.300");
//   const headingColor = useColorModeValue("gray.800", "white");

//   const [values, setValues] = useState<ILoginForm>({
//     username: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState<Partial<ILoginForm>>({});

//   useEffect(() => {
//     setIsMounted(true);
//     return () => {
//       setIsMounted(false);
//     };
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setValues({
//       ...values,
//       [name]: value,
//     });

//     if (errors[name as keyof ILoginForm]) {
//       setErrors({
//         ...errors,
//         [name]: "",
//       });
//     }
//   };

//   const validate = (): boolean => {
//     const newErrors: Partial<ILoginForm> = {};

//     if (!values.username.trim()) {
//       newErrors.username = "Username is required";
//     }

//     if (!values.password) {
//       newErrors.password = "Password is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validate() || !isMounted) return;

//     setIsLoading(true);

//     try {
//       const loginRequest = {
//         username: values.username,
//         password: values.password,
//       };

//       const response = await fetch("http://localhost:8080/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(loginRequest),
//       });

//       const contentType = response.headers.get("content-type");
//       let data;

//       if (contentType && contentType.includes("application/json")) {
//         data = await response.json();
//       } else {
//         const text = await response.text();
//         console.error("Received non-JSON response:", text);
//         throw new Error("Received non-JSON response from server");
//       }

//       if (!response.ok) {
//         setErrors({
//           invalidError: data.message || "Invalid username or password",
//         });
//         throw new Error(data.message || "Login failed");
//       }

//       const authToken = response.headers.get("Authorization") || data.token;
//       const userData = data.user || data;

//       if (isMounted) {
//         localStorage.setItem("currentUser", JSON.stringify(userData));
//         if (authToken) {
//           const token = authToken.startsWith("Bearer ")
//             ? authToken.substring(7)
//             : authToken;
//           localStorage.setItem("authToken", token);
//         }

//         toast({
//           title: "Login successful",
//           description: `Welcome back, ${userData.name || userData.username}!`,
//           status: "success",
//           duration: 3000,
//           isClosable: true,
//         });

//         window.location.href = "/home";
//       }
//     } catch (error) {
//       console.error("Login failed:", error);
//       if (!errors.invalidError) {
//         setErrors({
//           invalidError:
//             "Login failed. Please check your connection and try again.",
//         });
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Box minH="100vh" bg={bgColor}>
//       <Container maxW="lg" py={12}>
//         <Center minH="80vh">
//           <Card
//             bg={cardBgColor}
//             borderColor={borderColor}
//             shadow="xl"
//             maxW="md"
//             w="full"
//             borderRadius="xl"
//             overflow="hidden"
//           >
//             <CardBody p={8}>
//               <VStack spacing={8} align="stretch">
//                 <VStack spacing={4} textAlign="center">
//                   <Box
//                     w={16}
//                     h={16}
//                     bg="green.500"
//                     borderRadius="full"
//                     display="flex"
//                     alignItems="center"
//                     justifyContent="center"
//                     mx="auto"
//                   >
//                     <Icon as={FiUser} boxSize={8} color="white" />
//                   </Box>

//                   <VStack spacing={2}>
//                     <Heading size="xl" color={headingColor} fontWeight="bold">
//                       Welcome Back
//                     </Heading>
//                     <Text color={textColor} fontSize="md">
//                       Sign in to your LandFill Pro account
//                     </Text>
//                   </VStack>
//                 </VStack>

//                 {errors.invalidError && (
//                   <Alert status="error" borderRadius="lg" variant="left-accent">
//                     <AlertIcon />
//                     <Text fontSize="sm">{errors.invalidError}</Text>
//                   </Alert>
//                 )}

//                 <Box as="form" onSubmit={handleSubmit}>
//                   <VStack spacing={6}>
//                     <FormControl isInvalid={!!errors.username}>
//                       <FormLabel
//                         htmlFor="username"
//                         color={headingColor}
//                         fontWeight="medium"
//                         mb={2}
//                       >
//                         Email Address
//                       </FormLabel>
//                       <EmailInput
//                         id="username"
//                         name="username"
//                         isSub={isLoading}
//                         value={values.username}
//                         onChange={handleChange}
//                         placeholder="Enter your username"
//                         isInvalid={!!errors.username}
//                         size="lg"
//                       />
//                       <FormErrorMessage fontSize="sm">
//                         {errors.username}
//                       </FormErrorMessage>
//                     </FormControl>

//                     <FormControl isInvalid={!!errors.password}>
//                       <FormLabel
//                         htmlFor="password"
//                         color={headingColor}
//                         fontWeight="medium"
//                         mb={2}
//                       >
//                         Password
//                       </FormLabel>
//                       <PasswordInput
//                         id="password"
//                         name="password"
//                         isSub={isLoading}
//                         value={values.password}
//                         onChange={handleChange}
//                         placeholder="Enter your password"
//                         isInvalid={!!errors.password}
//                         size="lg"
//                       />
//                       <FormErrorMessage fontSize="sm">
//                         {errors.password}
//                       </FormErrorMessage>
//                     </FormControl>

//                     <Button
//                       type="submit"
//                       colorScheme="green"
//                       size="lg"
//                       width="full"
//                       leftIcon={<FiLogIn />}
//                       isLoading={isLoading}
//                       loadingText="Signing in..."
//                       borderRadius="lg"
//                       fontWeight="medium"
//                       _hover={{ transform: "translateY(-1px)" }}
//                       transition="all 0.2s"
//                     >
//                       Sign In
//                     </Button>
//                   </VStack>
//                 </Box>

//                 <HStack>
//                   <Divider />
//                   <Text fontSize="sm" color={textColor} whiteSpace="nowrap">
//                     New to LandFill Pro?
//                   </Text>
//                   <Divider />
//                 </HStack>

//                 <VStack spacing={3}>
//                   <Text fontSize="sm" color={textColor} textAlign="center">
//                     Don&apos;t have an account yet?
//                   </Text>

//                   <Button
//                     as="a"
//                     href="/register"
//                     variant="outline"
//                     colorScheme="green"
//                     size="md"
//                     leftIcon={<FiUserPlus />}
//                     borderRadius="lg"
//                     fontWeight="medium"
//                     _hover={{
//                       bg: "green.50",
//                       transform: "translateY(-1px)",
//                       _dark: { bg: "green.900" },
//                     }}
//                     transition="all 0.2s"
//                     w="full"
//                   >
//                     Create Account
//                   </Button>
//                 </VStack>

//                 <Text fontSize="xs" color={textColor} textAlign="center">
//                   By signing in, you agree to our Terms of Service and Privacy
//                   Policy
//                 </Text>
//               </VStack>
//             </CardBody>
//           </Card>
//         </Center>
//       </Container>
//     </Box>
//   );
// };

// export default LoginForm;

// export { LoginForm };

"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Heading,
  Text,
  useToast,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Container,
  useColorModeValue,
  Icon,
  Center,
} from "@chakra-ui/react";
import { FiLogIn, FiUserPlus, FiMapPin } from "react-icons/fi";
import { PasswordInput } from "@/components/shared/PasswordInput/PasswordInput";
import { UsernameInput } from "@/components/shared/UsernameInput/UsernameInput";

interface ILoginForm {
  username: string;
  password: string;
  invalidError?: string;
}

const LoginForm: React.FC = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

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
  const btnHoverBg      = useColorModeValue("#15803D", "#4ADE80");
  const hoverBg         = useColorModeValue("gray.50", "rgba(255,255,255,0.03)");
  const heroBg          = useColorModeValue(
    "linear(to-br, white, green.50)",
    "linear(to-br, #171B26, #0F1A12)"
  );
  const sectionLabelStyle = {
    fontSize: "11px" as const,
    fontWeight: "600" as const,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: subtleText,
  };
  // ──────────────────────────────────────────────────────────────────────────

  const [values, setValues] = useState<ILoginForm>({ username: "", password: "" });
  const [errors, setErrors] = useState<Partial<ILoginForm>>({});

  useEffect(() => {
    setIsMounted(true);
    return () => { setIsMounted(false); };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    if (errors[name as keyof ILoginForm]) setErrors({ ...errors, [name]: "" });
  };

  const validate = (): boolean => {
    const newErrors: Partial<ILoginForm> = {};
    if (!values.username.trim()) newErrors.username = "Username is required";
    if (!values.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !isMounted) return;
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: values.username, password: values.password }),
      });
      const contentType = response.headers.get("content-type");
      let data;
      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error("Received non-JSON response from server");
      }
      if (!response.ok) {
        setErrors({ invalidError: data.message || "Invalid username or password" });
        throw new Error(data.message || "Login failed");
      }
      const authToken = response.headers.get("Authorization") || data.token;
      const userData = data.user || data;
      if (isMounted) {
        localStorage.setItem("currentUser", JSON.stringify(userData));
        if (authToken) {
          const token = authToken.startsWith("Bearer ") ? authToken.substring(7) : authToken;
          localStorage.setItem("authToken", token);
        }
        toast({
          title: "Login successful",
          description: `Welcome back, ${userData.name || userData.username}!`,
          status: "success", duration: 3000, isClosable: true, position: "top-right",
        });
        window.location.href = "/home";
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (!errors.invalidError) {
        setErrors({ invalidError: "Login failed. Please check your connection and try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg={pageBg}>
      <Box h="3px" bgGradient="linear(to-r, green.400, teal.400)" />

      <Container maxW="md" py={16}>
        <Center minH="85vh">
          <Box
            w="full"
            bg={cardBg}
            border="1px solid"
            borderColor={cardBorder}
            borderRadius="20px"
            boxShadow={cardShadow}
            overflow="hidden"
          >
            {/* Card hero header */}
            <Box px={8} pt={10} pb={8} bgGradient={heroBg} textAlign="center">
              <Box
                w={16} h={16} borderRadius="full"
                bg={accentGreenSoft}
                border="1px solid" borderColor={dividerColor}
                display="flex" alignItems="center" justifyContent="center"
                mx="auto" mb={5}
              >
                <Icon as={FiMapPin} boxSize={7} color={accentGreen} />
              </Box>
              <Heading
                size="lg" color={strongText}
                fontWeight="800" letterSpacing="-0.03em" mb={1}
              >
                Welcome Back
              </Heading>
              <Text color={subtleText} fontSize="sm">
                Sign in to your LandFill<Text as="span" color={accentGreen} fontWeight="600">Pro</Text> account
              </Text>
            </Box>

            {/* Form body */}
            <Box px={8} pb={8} pt={6}>
              <VStack spacing={5} align="stretch">

                {errors.invalidError && (
                  <Alert status="error" borderRadius="xl" border="1px solid" borderColor="red.200" bg="red.50" py={3}>
                    <AlertIcon />
                    <Text fontSize="sm" fontWeight="500">{errors.invalidError}</Text>
                  </Alert>
                )}

                <Box as="form" onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <FormControl isInvalid={!!errors.username}>
                      <FormLabel {...sectionLabelStyle} mb={2}>Username</FormLabel>
                      <UsernameInput
                        id="username" name="username"
                        isSub={isLoading} value={values.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        isInvalid={!!errors.username} size="lg"
                      />
                      <FormErrorMessage fontSize="xs">{errors.username}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.password}>
                      <FormLabel {...sectionLabelStyle} mb={2}>Password</FormLabel>
                      <PasswordInput
                        id="password" name="password"
                        isSub={isLoading} value={values.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        isInvalid={!!errors.password} size="lg"
                      />
                      <FormErrorMessage fontSize="xs">{errors.password}</FormErrorMessage>
                    </FormControl>

                    <Button
                      type="submit"
                      isLoading={isLoading} loadingText="Signing in…"
                      leftIcon={<FiLogIn size={15} />}
                      w="full" size="lg" mt={2}
                      bg={accentGreen} color="white"
                      borderRadius="10px" fontWeight="600"
                      _hover={{
                        bg: btnHoverBg,
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
                      }}
                      _active={{ transform: "translateY(0)" }}
                      transition="all 0.18s"
                    >
                      Sign In
                    </Button>
                  </VStack>
                </Box>

                {/* Divider */}
                <HStack spacing={3} py={1}>
                  <Box flex="1" h="1px" bg={dividerColor} />
                  <Text {...sectionLabelStyle}>New to LandFill Pro?</Text>
                  <Box flex="1" h="1px" bg={dividerColor} />
                </HStack>

                <Button
                  as="a" href="/register"
                  variant="ghost"
                  leftIcon={<FiUserPlus size={14} />}
                  w="full" size="md"
                  borderRadius="10px" fontWeight="600"
                  color={subtleText}
                  border="1px solid" borderColor={cardBorder}
                  _hover={{ color: strongText, bg: hoverBg }}
                  transition="all 0.15s"
                >
                  Create Account
                </Button>

                <Text fontSize="xs" color={subtleText} textAlign="center" pt={1}>
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </Text>

              </VStack>
            </Box>
          </Box>
        </Center>
      </Container>
    </Box>
  );
};

export default LoginForm;
export { LoginForm };