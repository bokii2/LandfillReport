"use client";

import { EmailInput } from "@/components/shared/EmailInput/EmailInput";
import { PasswordInput } from "@/components/shared/PasswordInput/PasswordInput";
import { UsernameInput } from "@/components/shared/UsernameInput/UsernameInput";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiUser, FiUserPlus, FiMapPin } from "react-icons/fi";

interface IRegisterForm {
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  invalidError?: string;
}

const RegisterForm: React.FC = () => {
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
  const inputBg         = useColorModeValue("#F9FAFB", "#1E2330");
  const inputBorder     = useColorModeValue("rgba(0,0,0,0.08)", "rgba(255,255,255,0.08)");
  const iconColor       = useColorModeValue("#9CA3AF", "#6B7280");
  const btnHoverBg      = useColorModeValue("#15803D", "#4ADE80");
  const hoverBg         = useColorModeValue("gray.50", "rgba(255,255,255,0.03)");
  const focusShadow     = useColorModeValue(
    "0 0 0 3px rgba(22,163,74,0.15)",
    "0 0 0 3px rgba(34,197,94,0.15)"
  );
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

  const [values, setValues] = useState<IRegisterForm>({
    name: "", surname: "", username: "", email: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<IRegisterForm>>({});

  useEffect(() => {
    setIsMounted(true);
    return () => { setIsMounted(false); };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    if (errors[name as keyof IRegisterForm]) setErrors({ ...errors, [name]: "" });
  };

  const validate = (): boolean => {
    const newErrors: Partial<IRegisterForm> = {};
    if (!values.name.trim()) newErrors.name = "First name is required";
    else if (values.name.length < 2) newErrors.name = "First name must be at least 2 characters";
    if (!values.surname.trim()) newErrors.surname = "Last name is required";
    else if (values.surname.length < 2) newErrors.surname = "Last name must be at least 2 characters";
    if (!values.username.trim()) newErrors.username = "Username is required";
    else if (values.username.length < 3) newErrors.username = "Username must be at least 3 characters";
    if (!values.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(values.email)) newErrors.email = "Please enter a valid email address";
    if (!values.password) newErrors.password = "Password is required";
    else if (values.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!values.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (values.password !== values.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !isMounted) return;
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: values.name, surname: values.surname,
          username: values.username, email: values.email, password: values.password,
        }),
      });
      const contentType = response.headers.get("content-type");
      let data;
      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error("Received non-JSON response from server");
      }
      if (!response.ok) {
        setErrors({ invalidError: data.message || "Registration failed" });
        throw new Error(data.message || "Registration failed");
      }
      if (isMounted) {
        toast({
          title: "Registration successful",
          description: `Welcome to LandFill Pro, ${values.username}! Please log in to continue.`,
          status: "success", duration: 5000, isClosable: true, position: "top-right",
        });
        setTimeout(() => { window.location.href = "/login"; }, 2000);
      }
    } catch (error) {
      // console.error("Registration failed:", error);
      // if (!errors.invalidError) {
      //   setErrors({ invalidError: error.message });
      // }
      let message = "Registration failed";

      if (error instanceof Error) {
        message = error.message;
      }

      setErrors(prev => ({
        ...prev,
        invalidError: message,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Shared name input style
  const nameInputStyle = (hasError: boolean) => ({
    bg: inputBg,
    borderColor: hasError ? "red.300" : inputBorder,
    color: strongText,
    pl: "12",
    borderRadius: "10px",
    _placeholder: { color: subtleText },
    _hover: { borderColor: hasError ? "red.300" : accentGreen },
    _focus: {
      borderColor: hasError ? "red.500" : accentGreen,
      boxShadow: hasError ? "0 0 0 3px rgba(239,68,68,0.15)" : focusShadow,
      bg: cardBg,
    },
    transition: "all 0.15s",
  });

  return (
    <Box minH="100vh" bg={pageBg}>
      <Box h="3px" bgGradient="linear(to-r, green.400, teal.400)" />

      <Container maxW="lg" py={12}>
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
              Create Account
            </Heading>
            <Text color={subtleText} fontSize="sm">
              Join LandFill<Text as="span" color={accentGreen} fontWeight="600">Pro</Text> to start reporting waste sites
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

                  {/* Name row */}
                  <HStack spacing={3} w="full">
                    <FormControl isInvalid={!!errors.name}>
                      <FormLabel {...sectionLabelStyle} mb={2}>First Name</FormLabel>
                      <InputGroup size="lg">
                        <InputLeftElement h="12" w="12">
                          <Icon as={FiUser} color={iconColor} boxSize={4} />
                        </InputLeftElement>
                        <Input
                          id="name" name="name" type="text"
                          value={values.name} onChange={handleChange}
                          placeholder="First name" isDisabled={isLoading}
                          isInvalid={!!errors.name}
                          {...nameInputStyle(!!errors.name)}
                        />
                      </InputGroup>
                      <FormErrorMessage fontSize="xs">{errors.name}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.surname}>
                      <FormLabel {...sectionLabelStyle} mb={2}>Last Name</FormLabel>
                      <InputGroup size="lg">
                        <InputLeftElement h="12" w="12">
                          <Icon as={FiUser} color={iconColor} boxSize={4} />
                        </InputLeftElement>
                        <Input
                          id="surname" name="surname" type="text"
                          value={values.surname} onChange={handleChange}
                          placeholder="Last name" isDisabled={isLoading}
                          isInvalid={!!errors.surname}
                          {...nameInputStyle(!!errors.surname)}
                        />
                      </InputGroup>
                      <FormErrorMessage fontSize="xs">{errors.surname}</FormErrorMessage>
                    </FormControl>
                  </HStack>

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

                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel {...sectionLabelStyle} mb={2}>Email Address</FormLabel>
                    <EmailInput
                      id="email" name="email"
                      isSub={isLoading} value={values.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      isInvalid={!!errors.email} size="lg"
                    />
                    <FormErrorMessage fontSize="xs">{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel {...sectionLabelStyle} mb={2}>Password</FormLabel>
                    <PasswordInput
                      id="password" name="password"
                      isSub={isLoading} value={values.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      isInvalid={!!errors.password} size="lg"
                    />
                    <FormErrorMessage fontSize="xs">{errors.password}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.confirmPassword}>
                    <FormLabel {...sectionLabelStyle} mb={2}>Confirm Password</FormLabel>
                    <PasswordInput
                      id="confirmPassword" name="confirmPassword"
                      isSub={isLoading} value={values.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      isInvalid={!!errors.confirmPassword} size="lg"
                    />
                    <FormErrorMessage fontSize="xs">{errors.confirmPassword}</FormErrorMessage>
                  </FormControl>

                  <Button
                    type="submit"
                    isLoading={isLoading} loadingText="Creating Account…"
                    leftIcon={<FiUserPlus size={15} />}
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
                    Create Account
                  </Button>
                </VStack>
              </Box>

              {/* Divider */}
              <HStack spacing={3} py={1}>
                <Box flex="1" h="1px" bg={dividerColor} />
                <Text {...sectionLabelStyle}>Already have an account?</Text>
                <Box flex="1" h="1px" bg={dividerColor} />
              </HStack>

              <Button
                as="a" href="/login"
                variant="ghost"
                leftIcon={<FiArrowLeft size={14} />}
                w="full" size="md"
                borderRadius="10px" fontWeight="600"
                color={subtleText}
                border="1px solid" borderColor={cardBorder}
                _hover={{ color: strongText, bg: hoverBg }}
                transition="all 0.15s"
              >
                Back to Login
              </Button>

              <Text fontSize="xs" color={subtleText} textAlign="center" pt={1}>
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </Text>

            </VStack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterForm;