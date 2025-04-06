// components/auth/LoginForm/LoginForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  FormErrorMessage,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

// Define types locally to avoid potential import issues
interface ILoginForm {
  username: string;
  password: string;
  invalidError?: string;
}

const LoginForm: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  
  // Initialize form state
  const [values, setValues] = useState<ILoginForm>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<ILoginForm>>({});

  // Set mounted state after component mounts
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
        [name]: '',
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<ILoginForm> = {};
    
    if (!values.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!values.password) {
      newErrors.password = 'Password is required';
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
        password: values.password
      };
      
      // Use absolute URL to Spring backend
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(loginRequest),
      });
      
      // Handle potential non-JSON responses
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        throw new Error('Received non-JSON response from server');
      }
      
      if (!response.ok) {
        setErrors({
          invalidError: data.message || 'Invalid username or password'
        });
        throw new Error(data.message || 'Login failed');
      }
      
      // Get token from response
      const authToken = response.headers.get('Authorization') || data.token;
      const userData = data.user || data;

      // Store auth token and user data
      // In your login form
if (isMounted) {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    if (authToken) {
        const token = authToken.startsWith('Bearer ') ? 
            authToken.substring(7) : authToken;
        localStorage.setItem('authToken', token);
    }
    // localStorage.setItem('authToken', authToken);
    
    toast({
      title: 'Login successful',
      description: `Welcome back, ${userData.name || userData.username}!`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    const redirectPath = userData.role === 'ADMIN' ? '/reports' : '/send-report';
      
      console.log('Redirecting to:', redirectPath);
      
      // Use window.location for a hard redirect instead of the router
      window.location.href = redirectPath;
  }
      
    } catch (error) {
      console.error('Login failed:', error);
      if (!errors.invalidError) {
        setErrors({
          invalidError: 'Login failed. Please check your connection and try again.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt="8">
      <VStack spacing="6" align="stretch">
        <Heading textAlign="center">Login</Heading>
        
        {errors.invalidError && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {errors.invalidError}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <VStack spacing="4">
            <FormControl isInvalid={!!errors.username}>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                name="username"
                type="text"
                value={values.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
              <FormErrorMessage>{errors.username}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <InputGroup>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    size="sm"
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              mt="4"
              isLoading={isLoading}
              loadingText="Logging in..."
            >
              Login
            </Button>
          </VStack>
        </form>
        
        <Text textAlign="center">
          Don&apos;t have an account?{' '}
          <Link href="/register">
            <Box as="span" color="blue.500" _hover={{ textDecoration: 'underline' }}>
              Register
            </Box>
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

// Change to default export for dynamic import compatibility
export default LoginForm;

// Also keep named export for backwards compatibility
export { LoginForm };