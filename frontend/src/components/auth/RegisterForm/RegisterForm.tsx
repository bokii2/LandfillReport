"use client";

import { EmailInput } from "@/components/shared/EmailInput/EmailInput";
import { PasswordInput } from "@/components/shared/PasswordInput/PasswordInput";
import { UsernameInput } from "@/components/shared/UsernameInput/UsernameInput";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Container,
  Divider,
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
import { FiArrowLeft, FiUser, FiUserPlus } from "react-icons/fi";

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

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");

  const [values, setValues] = useState<IRegisterForm>({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<IRegisterForm>>({});

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

    if (errors[name as keyof IRegisterForm]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<IRegisterForm> = {};

    if (!values.name.trim()) {
      newErrors.name = "First name is required";
    } else if (values.name.length < 2) {
      newErrors.name = "First name must be at least 2 characters";
    }

    if (!values.surname.trim()) {
      newErrors.surname = "Last name is required";
    } else if (values.surname.length < 2) {
      newErrors.surname = "Last name must be at least 2 characters";
    }

    if (!values.username.trim()) {
      newErrors.username = "Username is required";
    } else if (values.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!values.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!values.password) {
      newErrors.password = "Password is required";
    } else if (values.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!values.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !isMounted) return;

    setIsLoading(true);

    try {
      const registerRequest = {
        name: values.name,
        surname: values.surname,
        username: values.username,
        email: values.email,
        password: values.password,
      };

      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(registerRequest),
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
          invalidError: data.message || "Registration failed",
        });
        throw new Error(data.message || "Registration failed");
      }

      if (isMounted) {
        toast({
          title: "Registration successful",
          description: `Welcome to LandFill Pro, ${values.username}! Please log in to continue.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      if (!errors.invalidError) {
        setErrors({
          invalidError:
            "Registration failed. Please check your information and try again.",
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
                    <Icon as={FiUserPlus} boxSize={8} color="white" />
                  </Box>

                  <VStack spacing={2}>
                    <Heading size="xl" color={headingColor} fontWeight="bold">
                      Create Account
                    </Heading>
                    <Text color={textColor} fontSize="md">
                      Join LandFill Pro to start reporting and managing waste
                      sites
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
                    <HStack spacing={4} w="full">
                      <FormControl isInvalid={!!errors.name}>
                        <FormLabel
                          htmlFor="name"
                          color={headingColor}
                          fontWeight="medium"
                          mb={2}
                        >
                          First Name
                        </FormLabel>
                        <InputGroup size="lg">
                          <InputLeftElement h="12" w="12">
                            <Icon
                              as={FiUser}
                              color={useColorModeValue("gray.400", "gray.500")}
                              boxSize={5}
                            />
                          </InputLeftElement>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            value={values.name}
                            onChange={handleChange}
                            placeholder="First name"
                            isDisabled={isLoading}
                            isInvalid={!!errors.name}
                            bg={cardBgColor}
                            borderColor={errors.name ? "red.300" : borderColor}
                            color={textColor}
                            pl="12"
                            _hover={{
                              borderColor: isLoading
                                ? borderColor
                                : errors.name
                                ? "red.300"
                                : "green.300",
                            }}
                            _focus={{
                              borderColor: errors.name
                                ? "red.500"
                                : "green.500",
                              boxShadow: errors.name
                                ? "0 0 0 1px var(--chakra-colors-red-500)"
                                : "0 0 0 1px var(--chakra-colors-green-500)",
                              bg: cardBgColor,
                            }}
                            transition="all 0.2s"
                            borderRadius="lg"
                          />
                        </InputGroup>
                        <FormErrorMessage fontSize="sm">
                          {errors.name}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.surname}>
                        <FormLabel
                          htmlFor="surname"
                          color={headingColor}
                          fontWeight="medium"
                          mb={2}
                        >
                          Last Name
                        </FormLabel>
                        <InputGroup size="lg">
                          <InputLeftElement h="12" w="12">
                            <Icon
                              as={FiUser}
                              color={useColorModeValue("gray.400", "gray.500")}
                              boxSize={5}
                            />
                          </InputLeftElement>
                          <Input
                            id="surname"
                            name="surname"
                            type="text"
                            value={values.surname}
                            onChange={handleChange}
                            placeholder="Last name"
                            isDisabled={isLoading}
                            isInvalid={!!errors.surname}
                            bg={cardBgColor}
                            borderColor={
                              errors.surname ? "red.300" : borderColor
                            }
                            color={textColor}
                            pl="12"
                            _hover={{
                              borderColor: isLoading
                                ? borderColor
                                : errors.surname
                                ? "red.300"
                                : "green.300",
                            }}
                            _focus={{
                              borderColor: errors.surname
                                ? "red.500"
                                : "green.500",
                              boxShadow: errors.surname
                                ? "0 0 0 1px var(--chakra-colors-red-500)"
                                : "0 0 0 1px var(--chakra-colors-green-500)",
                              bg: cardBgColor,
                            }}
                            transition="all 0.2s"
                            borderRadius="lg"
                          />
                        </InputGroup>
                        <FormErrorMessage fontSize="sm">
                          {errors.surname}
                        </FormErrorMessage>
                      </FormControl>
                    </HStack>

                    <FormControl isInvalid={!!errors.username}>
                      <FormLabel
                        htmlFor="username"
                        color={headingColor}
                        fontWeight="medium"
                        mb={2}
                      >
                        Username
                      </FormLabel>
                      <UsernameInput
                        id="username"
                        name="username"
                        isSub={isLoading}
                        value={values.username}
                        onChange={handleChange}
                        isInvalid={!!errors.username}
                        placeholder="Enter your username"
                        size="lg"
                      />
                      <FormErrorMessage fontSize="sm">
                        {errors.username}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.email}>
                      <FormLabel
                        htmlFor="email"
                        color={headingColor}
                        fontWeight="medium"
                        mb={2}
                      >
                        Email Address
                      </FormLabel>
                      <EmailInput
                        id="email"
                        name="email"
                        isSub={isLoading}
                        value={values.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        isInvalid={!!errors.email}
                        size="lg"
                      />
                      <FormErrorMessage fontSize="sm">
                        {errors.email}
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
                        placeholder="Create a password"
                        isInvalid={!!errors.password}
                        size="lg"
                      />
                      <FormErrorMessage fontSize="sm">
                        {errors.password}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.confirmPassword}>
                      <FormLabel
                        htmlFor="confirmPassword"
                        color={headingColor}
                        fontWeight="medium"
                        mb={2}
                      >
                        Confirm Password
                      </FormLabel>
                      <PasswordInput
                        id="confirmPassword"
                        name="confirmPassword"
                        isSub={isLoading}
                        value={values.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        isInvalid={!!errors.confirmPassword}
                        size="lg"
                      />
                      <FormErrorMessage fontSize="sm">
                        {errors.confirmPassword}
                      </FormErrorMessage>
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="green"
                      size="lg"
                      width="full"
                      leftIcon={<FiUserPlus />}
                      isLoading={isLoading}
                      loadingText="Creating Account..."
                      borderRadius="lg"
                      fontWeight="medium"
                      _hover={{ transform: "translateY(-1px)" }}
                      transition="all 0.2s"
                    >
                      Create Account
                    </Button>
                  </VStack>
                </Box>

                <HStack>
                  <Divider />
                  <Text fontSize="sm" color={textColor} whiteSpace="nowrap">
                    Already have an account?
                  </Text>
                  <Divider />
                </HStack>

                <VStack spacing={3}>
                  <Text fontSize="sm" color={textColor} textAlign="center">
                    Ready to sign in?
                  </Text>

                  <Button
                    as="a"
                    href="/login"
                    variant="outline"
                    colorScheme="green"
                    size="md"
                    leftIcon={<FiArrowLeft />}
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
                    Back to Login
                  </Button>
                </VStack>

                <Text fontSize="xs" color={textColor} textAlign="center">
                  By creating an account, you agree to our Terms of Service and
                  Privacy Policy
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </Center>
      </Container>
    </Box>
  );
};

export default RegisterForm;
