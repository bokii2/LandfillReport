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
  Card,
  CardBody,
  Container,
  useColorModeValue,
  Icon,
  Divider,
  Center,
} from "@chakra-ui/react";
import { FiUser, FiLogIn, FiUserPlus } from "react-icons/fi";
import { EmailInput } from "@/components/shared/EmailInput/EmailInput";
import { PasswordInput } from "@/components/shared/PasswordInput/PasswordInput";

interface ILoginForm {
  username: string;
  password: string;
  invalidError?: string;
}

const LoginForm: React.FC = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");

  const [values, setValues] = useState<ILoginForm>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<ILoginForm>>({});

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });

    if (errors[name as keyof ILoginForm]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<ILoginForm> = {};

    if (!values.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!values.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !isMounted) return;

    setIsLoading(true);

    try {
      const loginRequest = {
        username: values.username,
        password: values.password,
      };

      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loginRequest),
      });

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Received non-JSON response:", text);
        throw new Error("Received non-JSON response from server");
      }

      if (!response.ok) {
        setErrors({
          invalidError: data.message || "Invalid username or password",
        });
        throw new Error(data.message || "Login failed");
      }

      const authToken = response.headers.get("Authorization") || data.token;
      const userData = data.user || data;

      if (isMounted) {
        localStorage.setItem("currentUser", JSON.stringify(userData));
        if (authToken) {
          const token = authToken.startsWith("Bearer ")
            ? authToken.substring(7)
            : authToken;
          localStorage.setItem("authToken", token);
        }

        toast({
          title: "Login successful",
          description: `Welcome back, ${userData.name || userData.username}!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        window.location.href = "/home";
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (!errors.invalidError) {
        setErrors({
          invalidError:
            "Login failed. Please check your connection and try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="lg" py={12}>
        <Center minH="80vh">
          <Card
            bg={cardBgColor}
            borderColor={borderColor}
            shadow="xl"
            maxW="md"
            w="full"
            borderRadius="xl"
            overflow="hidden"
          >
            <CardBody p={8}>
              <VStack spacing={8} align="stretch">
                <VStack spacing={4} textAlign="center">
                  <Box
                    w={16}
                    h={16}
                    bg="green.500"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mx="auto"
                  >
                    <Icon as={FiUser} boxSize={8} color="white" />
                  </Box>

                  <VStack spacing={2}>
                    <Heading size="xl" color={headingColor} fontWeight="bold">
                      Welcome Back
                    </Heading>
                    <Text color={textColor} fontSize="md">
                      Sign in to your LandFill Pro account
                    </Text>
                  </VStack>
                </VStack>

                {errors.invalidError && (
                  <Alert status="error" borderRadius="lg" variant="left-accent">
                    <AlertIcon />
                    <Text fontSize="sm">{errors.invalidError}</Text>
                  </Alert>
                )}

                <Box as="form" onSubmit={handleSubmit}>
                  <VStack spacing={6}>
                    <FormControl isInvalid={!!errors.username}>
                      <FormLabel
                        htmlFor="username"
                        color={headingColor}
                        fontWeight="medium"
                        mb={2}
                      >
                        Email Address
                      </FormLabel>
                      <EmailInput
                        id="username"
                        name="username"
                        isSub={isLoading}
                        value={values.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        isInvalid={!!errors.username}
                        size="lg"
                      />
                      <FormErrorMessage fontSize="sm">
                        {errors.username}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.password}>
                      <FormLabel
                        htmlFor="password"
                        color={headingColor}
                        fontWeight="medium"
                        mb={2}
                      >
                        Password
                      </FormLabel>
                      <PasswordInput
                        id="password"
                        name="password"
                        isSub={isLoading}
                        value={values.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        isInvalid={!!errors.password}
                        size="lg"
                      />
                      <FormErrorMessage fontSize="sm">
                        {errors.password}
                      </FormErrorMessage>
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="green"
                      size="lg"
                      width="full"
                      leftIcon={<FiLogIn />}
                      isLoading={isLoading}
                      loadingText="Signing in..."
                      borderRadius="lg"
                      fontWeight="medium"
                      _hover={{ transform: "translateY(-1px)" }}
                      transition="all 0.2s"
                    >
                      Sign In
                    </Button>
                  </VStack>
                </Box>

                <HStack>
                  <Divider />
                  <Text fontSize="sm" color={textColor} whiteSpace="nowrap">
                    New to LandFill Pro?
                  </Text>
                  <Divider />
                </HStack>

                <VStack spacing={3}>
                  <Text fontSize="sm" color={textColor} textAlign="center">
                    Don&apos;t have an account yet?
                  </Text>

                  <Button
                    as="a"
                    href="/register"
                    variant="outline"
                    colorScheme="green"
                    size="md"
                    leftIcon={<FiUserPlus />}
                    borderRadius="lg"
                    fontWeight="medium"
                    _hover={{
                      bg: "green.50",
                      transform: "translateY(-1px)",
                      _dark: { bg: "green.900" },
                    }}
                    transition="all 0.2s"
                    w="full"
                  >
                    Create Account
                  </Button>
                </VStack>

                <Text fontSize="xs" color={textColor} textAlign="center">
                  By signing in, you agree to our Terms of Service and Privacy
                  Policy
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </Center>
      </Container>
    </Box>
  );
};

export default LoginForm;

export { LoginForm };
