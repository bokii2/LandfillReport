"use client";

import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Container,
  Heading,
  VStack,
  HStack,
  IconButton,
  useColorMode,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  Badge,
  Spacer,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import {
  FiSun,
  FiMoon,
  FiMenu,
  FiBarChart,
  FiFileText,
  FiMapPin,
  FiUsers,
  FiSettings,
  FiChevronDown,
  FiClock,
  FiArrowRight,
  FiExternalLink,
} from "react-icons/fi";
import { IUserProfile } from "@/typings/UserProfile.type";
import useSWR, { mutate } from "swr";
import { swrKeys } from "@/fetchers/swrKeys";
import { fetcher } from "@/fetchers/fetcher";
import { INewsArticle } from "@/typings/NewsArticle.type";

export default function LandfillHomepage() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");

  const { data: user } = useSWR<IUserProfile>(swrKeys.me, fetcher);
  const isAdmin = user?.role === "ADMIN";

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    ...(isAdmin
      ? [{ name: "Reports", href: "/reports" }]
      : [{ name: "Send Report", href: "/send-report" }]),
    ...(!isAdmin ? [{ name: "My Reports", href: "/my-reports" }] : []),
  ];

  const stats = [
    { label: "Active Sites", value: "24", color: "green" },
    { label: "Monthly Reports", value: "156", color: "blue" },
    { label: "Compliance Rate", value: "98.5%", color: "purple" },
    { label: "Data Points", value: "2.1M", color: "orange" },
  ];

  const {
    data: news,
    error,
    isLoading,
  } = useSWR<INewsArticle[]>(`${swrKeys.news}`, fetcher);

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const navLinkHoverBg = useColorModeValue("gray.100", "gray.700");
  const drawerItemHoverBg = useColorModeValue("gray.100", "gray.700");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");

    mutate(swrKeys.me, null, { revalidate: false });
    window.location.href = "/";
  };

  const NavBar = () => (
    <Box
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={1000}
      backdropFilter="blur(10px)"
    >
      <Container maxW="7xl">
        <Flex h="16" alignItems="center" justifyContent="space-between">
          <HStack spacing={8} alignItems="center">
            <Box>
              <Heading size="md" color="green.500" fontWeight="bold">
                LandFill Pro
              </Heading>
            </Box>
            <HStack as="nav" spacing={6} display={{ base: "none", md: "flex" }}>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  px={3}
                  py={2}
                  rounded="md"
                  _hover={{
                    textDecoration: "none",
                    bg: navLinkHoverBg,
                  }}
                  color={textColor}
                  fontWeight="medium"
                >
                  {item.name}
                </Link>
              ))}
            </HStack>
          </HStack>

          <Spacer />

          <HStack spacing={4}>
            <IconButton
              size="sm"
              variant="ghost"
              aria-label="Toggle color mode"
              icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
            />

            <Menu>
              <MenuButton as={Button} size="sm" rightIcon={<FiChevronDown />}>
                {user?.username || "Account"}
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FiUsers />}>Profile</MenuItem>
                <MenuItem icon={<FiSettings />}>Settings</MenuItem>
                <MenuItem icon={<FiSettings />} onClick={handleLogout}>
                  Log out
                </MenuItem>
              </MenuList>
            </Menu>

            <IconButton
              size="sm"
              variant="ghost"
              aria-label="Open menu"
              icon={<FiMenu />}
              onClick={onOpen}
              display={{ base: "flex", md: "none" }}
            />
          </HStack>
        </Flex>
      </Container>
    </Box>
  );

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      <NavBar />

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Navigation</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  p={3}
                  rounded="md"
                  _hover={{ bg: drawerItemHoverBg }}
                  onClick={onClose}
                >
                  {item.name}
                </Link>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Container maxW="7xl" py={12}>
        <VStack spacing={8} textAlign="center" mb={16}>
          <Heading
            size="2xl"
            color={headingColor}
            maxW="4xl"
            lineHeight="shorter"
          >
            Comprehensive Landfill Management & Reporting Platform
          </Heading>
          <Text fontSize="xl" color={textColor} maxW="2xl">
            Monitor, analyze, and report on landfill operations with real-time
            data insights, automated compliance reporting, and predictive
            analytics.
          </Text>
          <HStack spacing={4}>
            <Button colorScheme="green" size="lg" leftIcon={<FiBarChart />}>
              View Dashboard
            </Button>
            <Button variant="outline" size="lg" leftIcon={<FiFileText />}>
              Generate Report
            </Button>
          </HStack>
        </VStack>

        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} mb={16}>
          {stats.map((stat) => (
            <Card key={stat.label} bg={bgColor} borderColor={borderColor}>
              <CardBody textAlign="center">
                <Text
                  fontSize="3xl"
                  fontWeight="bold"
                  color={`${stat.color}.500`}
                >
                  {stat.value}
                </Text>
                <Text color={textColor} fontSize="sm" fontWeight="medium">
                  {stat.label}
                </Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        <VStack spacing={8} mb={16}>
          <HStack justify="space-between" w="full">
            <Heading size="lg" color={headingColor}>
              Latest News & Updates
            </Heading>
            <Button variant="ghost" rightIcon={<FiArrowRight />} size="sm">
              View All
            </Button>
          </HStack>

          {isLoading && <Text>Loading news...</Text>}
          {error && <Text color="red.400">Failed to load news.</Text>}

          {news && news.length > 0 && (
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} w="full">
              {news?.map((article) => (
                <Card
                  key={article.id}
                  bg={bgColor}
                  borderColor={borderColor}
                  transition="all 0.2s"
                  _hover={{
                    transform: "translateY(-2px)",
                    shadow: "lg",
                  }}
                >
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                        {article.source}
                      </Badge>

                      <Heading
                        size="md"
                        color={headingColor}
                        lineHeight="shorter"
                      >
                        {article.title}
                      </Heading>

                      <HStack justify="space-between" w="full" pt={2}>
                        <HStack spacing={1}>
                          <Icon as={FiClock} boxSize={3} color={textColor} />
                          <Text fontSize="xs" color={textColor}>
                            {formatDate(article.scrapedAt)}
                          </Text>
                        </HStack>

                        <Button
                          as="a"
                          href={article.url}
                          target="_blank"
                          size="xs"
                          variant="ghost"
                          rightIcon={<FiExternalLink />}
                        >
                          Open
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </VStack>

        <Card bg={bgColor} borderColor={borderColor}>
          <CardBody>
            <VStack spacing={6}>
              <Heading size="lg" color={headingColor} textAlign="center">
                Quick Actions
              </Heading>
              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 4 }}
                spacing={4}
                w="full"
              >
                <Button leftIcon={<FiFileText />} variant="outline" size="lg">
                  New Report
                </Button>
                <Button leftIcon={<FiBarChart />} variant="outline" size="lg">
                  View Analytics
                </Button>
                <Button leftIcon={<FiMapPin />} variant="outline" size="lg">
                  Manage Sites
                </Button>
                <Button leftIcon={<FiSettings />} variant="outline" size="lg">
                  System Settings
                </Button>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}
