'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Container, Flex, Heading, Button, Icon } from '@chakra-ui/react';
import ReportForm from '@/components/report/ReportForm/ReportForm';

export const dynamic = 'force-dynamic';


const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

export default function SendReport() {
  return (
    <Container maxW="container.xl" py={8} px={4}>
      <Flex mb={6} justifyContent="space-between" alignItems="center">
        <Heading as="h1" size="xl">New Landfill Report</Heading>
        <Link href="/reports" passHref>
          <Button 
            as="a"
            leftIcon={<Icon as={ArrowLeftIcon} />}
            colorScheme="gray" 
            variant="outline"
          >
            Back to Reports
          </Button>
        </Link>
      </Flex>
      
      <Box bg="white" borderRadius="lg" shadow="md" overflow="hidden">
        <ReportForm />
      </Box>
    </Container>
  );
}