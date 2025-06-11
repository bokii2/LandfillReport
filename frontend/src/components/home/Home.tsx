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
    { name: "Sites", href: "/sites" },
  ];

  const stats = [
    { label: "Active Sites", value: "24", color: "green" },
    { label: "Monthly Reports", value: "156", color: "blue" },
    { label: "Compliance Rate", value: "98.5%", color: "purple" },
    { label: "Data Points", value: "2.1M", color: "orange" },
  ];

  const newsItems = [
    {
      id: 1,
      title: "New EPA Regulations for Landfill Gas Emissions Take Effect",
      summary:
        "Updated federal guidelines require enhanced monitoring systems for methane capture and reporting.",
      date: "2025-06-05",
      category: "Regulatory",
      categoryColor: "red",
      readTime: "3 min read",
      isExternal: true,
    },
    {
      id: 2,
      title: "Q2 2025 Waste Management Industry Report Released",
      summary:
        "Industry analysis shows 15% increase in recycling rates and improved landfill diversion strategies.",
      date: "2025-06-03",
      category: "Industry",
      categoryColor: "blue",
      readTime: "5 min read",
      isExternal: false,
    },
    {
      id: 3,
      title: "Advanced Sensor Technology Improves Landfill Monitoring",
      summary:
        "IoT-enabled sensors provide real-time data on gas emissions, temperature, and structural integrity.",
      date: "2025-06-01",
      category: "Technology",
      categoryColor: "green",
      readTime: "4 min read",
      isExternal: true,
    },
    {
      id: 4,
      title: "State Funding Available for Landfill Modernization Projects",
      summary:
        "$50M allocated for infrastructure upgrades and environmental compliance improvements.",
      date: "2025-05-28",
      category: "Funding",
      categoryColor: "purple",
      readTime: "2 min read",
      isExternal: false,
    },
  ];

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

      {/* Mobile Navigation Drawer */}
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
        {/* Hero Section */}
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

        {/* Stats Section */}
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

        {/* Features Section
        <VStack spacing={8} mb={16}>
          <Heading size="lg" color={headingColor} textAlign="center">
            Powerful Features for Modern Waste Management
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
            {features.map((feature) => (
              <Card key={feature.title} bg={bgColor} borderColor={borderColor}>
                <CardBody>
                  <HStack spacing={4} mb={4}>
                    <Icon
                      as={feature.icon}
                      boxSize={8}
                      color={`${feature.color}.500`}
                    />
                    <Heading size="md" color={headingColor}>
                      {feature.title}
                    </Heading>
                  </HStack>
                  <Text color={textColor}>
                    {feature.description}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack> */}

        {/* News & Updates Section */}
        <VStack spacing={8} mb={16}>
          <HStack justify="space-between" w="full">
            <Heading size="lg" color={headingColor}>
              Latest News & Updates
            </Heading>
            <Button variant="ghost" rightIcon={<FiArrowRight />} size="sm">
              View All
            </Button>
          </HStack>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} w="full">
            {newsItems.map((news) => (
              <Card
                key={news.id}
                bg={bgColor}
                borderColor={borderColor}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "lg",
                  borderColor: `${news.categoryColor}.200`,
                }}
              >
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <HStack justify="space-between" w="full">
                      <Badge
                        colorScheme={news.categoryColor}
                        variant="subtle"
                        fontSize="xs"
                      >
                        {news.category}
                      </Badge>
                      {news.isExternal && (
                        <Icon
                          as={FiExternalLink}
                          boxSize={3}
                          color={textColor}
                        />
                      )}
                    </HStack>

                    <Heading
                      size="md"
                      color={headingColor}
                      lineHeight="shorter"
                    >
                      {news.title}
                    </Heading>

                    <Text color={textColor} fontSize="sm" lineHeight="tall">
                      {news.summary}
                    </Text>

                    <HStack justify="space-between" w="full" pt={2}>
                      <HStack spacing={4}>
                        <HStack spacing={1}>
                          <Icon as={FiClock} boxSize={3} color={textColor} />
                          <Text fontSize="xs" color={textColor}>
                            {formatDate(news.date)}
                          </Text>
                        </HStack>
                        <Text fontSize="xs" color={textColor}>
                          {news.readTime}
                        </Text>
                      </HStack>
                      <Button
                        size="xs"
                        variant="ghost"
                        rightIcon={<FiArrowRight />}
                      >
                        Read More
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Quick Actions */}
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
