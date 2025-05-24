'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
  AlertTitle,
  AlertDescription,
  useToast,
  Badge
} from '@chakra-ui/react';
import { api } from '@/fetchers/report';
import MapWrapper from '@/components/map/MapWrapper';

const ReportForm = () => {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Form data
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  // Validation states
  const [descriptionError, setDescriptionError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [imageError, setImageError] = useState('');
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get current location
  const getCurrentLocation = () => {
    setError(null);
    setLocationError('');
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
    
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLoading(false);
      },
      (error) => {
        setLocationError(`Unable to retrieve your location: ${error.message}`);
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };
  
  // Handle map position change
  const handlePositionChange = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    setLocationError('');
  };
  
  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image file is too large. Please select an image under 5MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setImageError('Please select an image file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    
    setImage(file);
    setImageError('');
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setError(null);
    setDescriptionError('');
    setLocationError('');
    setImageError('');
    
    // Validate form data
    let isValid = true;
    
    if (!description.trim()) {
      setDescriptionError('Please provide a description');
      isValid = false;
    }
    
    if (latitude === null || longitude === null) {
      setLocationError('Location is required. Please use the "Get Current Location" button or select on the map');
      isValid = false;
    }
    
    if (!image) {
      setImageError('Please upload an image of the landfill');
      isValid = false;
    }
    
    if (!isValid) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Send report to API
      await api.sendReport({
        description,
        latitude: latitude!,
        longitude: longitude!,
        image: image!,
      });
      
      // Reset form on success
      setSuccess(true);
      setDescription('');
      setLatitude(null);
      setLongitude(null);
      setImage(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Show success toast
      toast({
        title: 'Report submitted',
        description: 'Your landfill report has been submitted successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Redirect to reports list after 2 seconds
      setTimeout(() => {
        router.push('/reports');
      }, 2000);
      
    } catch (err) {
      console.error('Error submitting report:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while submitting the report');
      
      // Show error toast
      toast({
        title: 'Submission failed',
        description: err instanceof Error ? err.message : 'An error occurred while submitting the report',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box maxW="4xl" mx="auto" p={6} bg="white" shadow="md" borderRadius="lg">
      <Heading size="lg" mb={6}>Report Illegal Landfill</Heading>
      
      {success ? (
        <Alert status="success" borderRadius="md" mb={4}>
          <AlertIcon />
          <Box>
            <AlertTitle>Report submitted successfully!</AlertTitle>
            <AlertDescription>
              Redirecting to reports list...
            </AlertDescription>
          </Box>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            {/* Error display */}
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Description */}
            <FormControl isInvalid={!!descriptionError} isRequired>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (e.target.value.trim()) setDescriptionError('');
                }}
                placeholder="Describe the landfill and surrounding area..."
                size="md"
              />
              <FormErrorMessage>{descriptionError}</FormErrorMessage>
            </FormControl>
            
            {/* Location */}
            <FormControl isInvalid={!!locationError} isRequired>
              <FormLabel>Location</FormLabel>
              <HStack mb={2}>
                <Button
                  onClick={getCurrentLocation}
                  isLoading={loading}
                  loadingText="Getting Location..."
                  colorScheme="blue"
                  leftIcon={<LocationIcon />}
                >
                  Get Current Location
                </Button>
                {(latitude !== null && longitude !== null) && (
                  <Badge colorScheme="green" p={2} borderRadius="md">
                    Location captured ✓
                  </Badge>
                )}
              </HStack>
              
              {/* Coordinates display */}
              {(latitude !== null && longitude !== null) && (
                <Text fontSize="sm" color="gray.600" mb={2}>
                  Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </Text>
              )}
              
              {/* Map */}
              <Box mt={2} borderWidth={1} borderColor="gray.300" borderRadius="md" overflow="hidden">
                <MapWrapper 
                    latitude={latitude || 41.9981} // Default to Macedonia/Skopje if not set
                    longitude={longitude || 21.4254}
                    onPositionChange={handlePositionChange}
                    selectable={true}
                    height={300}/>
              </Box>
              <Text mt={1} fontSize="sm" color="gray.500">
                You can click on the map to set the location
              </Text>
              
              <FormErrorMessage>{locationError}</FormErrorMessage>
            </FormControl>
            
            {/* Image Upload */}
            <FormControl isInvalid={!!imageError} isRequired>
              <FormLabel htmlFor="image">Upload Image</FormLabel>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                p={1}
              />
              <Text mt={1} fontSize="sm" color="gray.500">
                Upload a clear image of the landfill (max 5MB)
              </Text>
              
              {/* Image Preview */}
              {preview && (
                <Box mt={2}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                    Preview:
                  </Text>
                  <Box position="relative" h="200px" w="full" borderWidth={1} borderColor="gray.300" borderRadius="md" overflow="hidden">
                    <Image 
                      src={preview}
                      alt="Image preview"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </Box>
                </Box>
              )}
              
              <FormErrorMessage>{imageError}</FormErrorMessage>
            </FormControl>
            
            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={loading}
              loadingText="Submitting..."
              colorScheme="green"
              size="lg"
              width="full"
            >
              Submit Report
            </Button>
          </VStack>
        </form>
      )}
    </Box>
  );
};

// Simple location icon component
const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

export default ReportForm;