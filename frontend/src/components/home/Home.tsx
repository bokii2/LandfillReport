// "use client";

// import React from "react";
// import {
//   Box,
//   Flex,
//   Text,
//   Button,
//   Container,
//   Heading,
//   VStack,
//   HStack,
//   IconButton,
//   useColorMode,
//   useColorModeValue,
//   SimpleGrid,
//   Card,
//   CardBody,
//   Icon,
//   Badge,
//   Spacer,
//   Link,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   useDisclosure,
//   Drawer,
//   DrawerBody,
//   DrawerHeader,
//   DrawerOverlay,
//   DrawerContent,
//   DrawerCloseButton,
// } from "@chakra-ui/react";
// import {
//   FiSun,
//   FiMoon,
//   FiMenu,
//   FiBarChart,
//   FiFileText,
//   FiMapPin,
//   FiUsers,
//   FiSettings,
//   FiChevronDown,
//   FiClock,
//   FiArrowRight,
//   FiExternalLink,
// } from "react-icons/fi";
// import { IUserProfile } from "@/typings/UserProfile.type";
// import useSWR, { mutate } from "swr";
// import { swrKeys } from "@/fetchers/swrKeys";
// import { fetcher } from "@/fetchers/fetcher";
// import { INewsArticle } from "@/typings/NewsArticle.type";

// export default function LandfillHomepage() {
//   const { colorMode, toggleColorMode } = useColorMode();
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   const bgColor = useColorModeValue("white", "gray.800");
//   const borderColor = useColorModeValue("gray.200", "gray.700");
//   const textColor = useColorModeValue("gray.600", "gray.300");
//   const headingColor = useColorModeValue("gray.800", "white");

//   const { data: user } = useSWR<IUserProfile>(swrKeys.me, fetcher);
//   const isAdmin = user?.role === "ADMIN";

//   const navItems = [
//     { name: "Chatbot", href: "/chatbot" },
//     ...(isAdmin
//       ? [{ name: "Reports", href: "/reports" }]
//       : [{ name: "Send Report", href: "/send-report" }]),
//     ...(!isAdmin ? [{ name: "My Reports", href: "/my-reports" }] : []),
//   ];

//   const stats = [
//     { label: "Active Sites", value: "24", color: "green" },
//     { label: "Monthly Reports", value: "156", color: "blue" },
//     { label: "Compliance Rate", value: "98.5%", color: "purple" },
//     { label: "Data Points", value: "2.1M", color: "orange" },
//   ];

//   const {
//     data: news,
//     error,
//     isLoading,
//   } = useSWR<INewsArticle[]>(`${swrKeys.news}`, fetcher);

//   const formatDate = (dateString: string | number | Date) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const navLinkHoverBg = useColorModeValue("gray.100", "gray.700");
//   const drawerItemHoverBg = useColorModeValue("gray.100", "gray.700");

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("currentUser");

//     mutate(swrKeys.me, null, { revalidate: false });
//     window.location.href = "/";
//   };

//   const NavBar = () => (
//     <Box
//       bg={bgColor}
//       borderBottom="1px"
//       borderColor={borderColor}
//       position="sticky"
//       top={0}
//       zIndex={1000}
//       backdropFilter="blur(10px)"
//     >
//       <Container maxW="7xl">
//         <Flex h="16" alignItems="center" justifyContent="space-between">
//           <HStack spacing={8} alignItems="center">
//             <Box>
//               <Heading size="md" color="green.500" fontWeight="bold">
//                 LandFill Pro
//               </Heading>
//             </Box>
//             <HStack as="nav" spacing={6} display={{ base: "none", md: "flex" }}>
//               {navItems.map((item) => (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   px={3}
//                   py={2}
//                   rounded="md"
//                   _hover={{
//                     textDecoration: "none",
//                     bg: navLinkHoverBg,
//                   }}
//                   color={textColor}
//                   fontWeight="medium"
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//             </HStack>
//           </HStack>

//           <Spacer />

//           <HStack spacing={4}>
//             <IconButton
//               size="sm"
//               variant="ghost"
//               aria-label="Toggle color mode"
//               icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
//               onClick={toggleColorMode}
//             />

//             <Menu>
//               <MenuButton as={Button} size="sm" rightIcon={<FiChevronDown />}>
//                 {user?.username || "Account"}
//               </MenuButton>
//               <MenuList>
//                 <MenuItem icon={<FiUsers />}>Profile</MenuItem>
//                 <MenuItem icon={<FiSettings />}>Settings</MenuItem>
//                 <MenuItem icon={<FiSettings />} onClick={handleLogout}>
//                   Log out
//                 </MenuItem>
//               </MenuList>
//             </Menu>

//             <IconButton
//               size="sm"
//               variant="ghost"
//               aria-label="Open menu"
//               icon={<FiMenu />}
//               onClick={onOpen}
//               display={{ base: "flex", md: "none" }}
//             />
//           </HStack>
//         </Flex>
//       </Container>
//     </Box>
//   );

//   return (
//     <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
//       <NavBar />

//       <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
//         <DrawerOverlay />
//         <DrawerContent>
//           <DrawerCloseButton />
//           <DrawerHeader>Navigation</DrawerHeader>
//           <DrawerBody>
//             <VStack spacing={4} align="stretch">
//               {navItems.map((item) => (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   p={3}
//                   rounded="md"
//                   _hover={{ bg: drawerItemHoverBg }}
//                   onClick={onClose}
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//             </VStack>
//           </DrawerBody>
//         </DrawerContent>
//       </Drawer>

//       <Container maxW="7xl" py={12}>
//         <VStack spacing={8} textAlign="center" mb={16}>
//           <Heading
//             size="2xl"
//             color={headingColor}
//             maxW="4xl"
//             lineHeight="shorter"
//           >
//             Comprehensive Landfill Management & Reporting Platform
//           </Heading>
//           <Text fontSize="xl" color={textColor} maxW="2xl">
//             Monitor, analyze, and report on landfill operations with real-time
//             data insights, automated compliance reporting, and predictive
//             analytics.
//           </Text>
//           <HStack spacing={4}>
//             <Button colorScheme="green" size="lg" leftIcon={<FiBarChart />}>
//               View Dashboard
//             </Button>
//             <Button variant="outline" size="lg" leftIcon={<FiFileText />}>
//               Generate Report
//             </Button>
//           </HStack>
//         </VStack>

//         <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} mb={16}>
//           {stats.map((stat) => (
//             <Card key={stat.label} bg={bgColor} borderColor={borderColor}>
//               <CardBody textAlign="center">
//                 <Text
//                   fontSize="3xl"
//                   fontWeight="bold"
//                   color={`${stat.color}.500`}
//                 >
//                   {stat.value}
//                 </Text>
//                 <Text color={textColor} fontSize="sm" fontWeight="medium">
//                   {stat.label}
//                 </Text>
//               </CardBody>
//             </Card>
//           ))}
//         </SimpleGrid>

//         <VStack spacing={8} mb={16}>
//           <HStack justify="space-between" w="full">
//             <Heading size="lg" color={headingColor}>
//               Latest News & Updates
//             </Heading>
//             <Button variant="ghost" rightIcon={<FiArrowRight />} size="sm">
//               View All
//             </Button>
//           </HStack>

//           {isLoading && <Text>Loading news...</Text>}
//           {error && <Text color="red.400">Failed to load news.</Text>}

//           {news && news.length > 0 && (
//             <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} w="full">
//               {news?.map((article) => (
//                 <Card
//                   key={article.id}
//                   bg={bgColor}
//                   borderColor={borderColor}
//                   transition="all 0.2s"
//                   _hover={{
//                     transform: "translateY(-2px)",
//                     shadow: "lg",
//                   }}
//                 >
//                   <CardBody>
//                     <VStack align="start" spacing={3}>
//                       <Badge colorScheme="blue" variant="subtle" fontSize="xs">
//                         {article.source}
//                       </Badge>

//                       <Heading
//                         size="md"
//                         color={headingColor}
//                         lineHeight="shorter"
//                       >
//                         {article.title}
//                       </Heading>

//                       <HStack justify="space-between" w="full" pt={2}>
//                         <HStack spacing={1}>
//                           <Icon as={FiClock} boxSize={3} color={textColor} />
//                           <Text fontSize="xs" color={textColor}>
//                             {formatDate(article.scrapedAt)}
//                           </Text>
//                         </HStack>

//                         <Button
//                           as="a"
//                           href={article.url}
//                           target="_blank"
//                           size="xs"
//                           variant="ghost"
//                           rightIcon={<FiExternalLink />}
//                         >
//                           Open
//                         </Button>
//                       </HStack>
//                     </VStack>
//                   </CardBody>
//                 </Card>
//               ))}
//             </SimpleGrid>
//           )}
//         </VStack>

//         <Card bg={bgColor} borderColor={borderColor}>
//           <CardBody>
//             <VStack spacing={6}>
//               <Heading size="lg" color={headingColor} textAlign="center">
//                 Quick Actions
//               </Heading>
//               <SimpleGrid
//                 columns={{ base: 1, sm: 2, md: 4 }}
//                 spacing={4}
//                 w="full"
//               >
//                 <Button leftIcon={<FiFileText />} variant="outline" size="lg">
//                   New Report
//                 </Button>
//                 <Button leftIcon={<FiBarChart />} variant="outline" size="lg">
//                   View Analytics
//                 </Button>
//                 <Button leftIcon={<FiMapPin />} variant="outline" size="lg">
//                   Manage Sites
//                 </Button>
//                 <Button leftIcon={<FiSettings />} variant="outline" size="lg">
//                   System Settings
//                 </Button>
//               </SimpleGrid>
//             </VStack>
//           </CardBody>
//         </Card>
//       </Container>
//     </Box>
//   );
// }


// ==================================================================

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

  // ─── All hooks at top ─────────────────────────────────────────────────────
  const pageBg          = useColorModeValue("#F7F8FA", "#0F1117");
  const navBg           = useColorModeValue("rgba(255,255,255,0.85)", "rgba(23,27,38,0.85)");
  const cardBg          = useColorModeValue("#FFFFFF", "#171B26");
  const cardBorder      = useColorModeValue("rgba(0,0,0,0.07)", "rgba(255,255,255,0.06)");
  const cardShadow      = useColorModeValue(
    "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
    "0 1px 3px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.3)"
  );
  const hoverShadow     = useColorModeValue(
    "0 4px 20px rgba(0,0,0,0.10)",
    "0 4px 24px rgba(0,0,0,0.5)"
  );
  const subtleText      = useColorModeValue("#6B7280", "#8B92A5");
  const strongText      = useColorModeValue("#111827", "#F0F2F7");
  const accentGreen     = useColorModeValue("#16A34A", "#22C55E");
  const accentGreenSoft = useColorModeValue("green.50", "rgba(34,197,94,0.08)");
  const dividerColor    = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.06)");
  const hoverBg         = useColorModeValue("gray.50", "rgba(255,255,255,0.04)");
  const navBorder       = useColorModeValue("rgba(0,0,0,0.07)", "rgba(255,255,255,0.06)");
  const btnHoverBg      = useColorModeValue("#15803D", "#4ADE80");
  const drawerBg        = useColorModeValue("#FFFFFF", "#171B26");
  const heroBgGradient  = useColorModeValue(
    "linear(to-br, white, green.50)",
    "linear(to-br, #171B26, #0F1A12)"
  );
  const newsCardHoverBorder = useColorModeValue("rgba(22,163,74,0.3)", "rgba(34,197,94,0.2)");
  // ──────────────────────────────────────────────────────────────────────────

  const { data: user } = useSWR<IUserProfile>(swrKeys.me, fetcher);
  const isAdmin = user?.role === "ADMIN";

  const { data: news, error, isLoading } = useSWR<INewsArticle[]>(`${swrKeys.news}`, fetcher);

  const navItems = [
    { name: "Chatbot", href: "/chatbot" },
    ...(isAdmin
      ? [{ name: "Reports", href: "/reports" }]
      : [{ name: "Send Report", href: "/send-report" }]),
    ...(!isAdmin ? [{ name: "My Reports", href: "/my-reports" }] : []),
  ];

  const stats = [
    { label: "Active Sites",    value: "24",    color: "#16A34A", softColor: "rgba(22,163,74,0.1)"   },
    { label: "Monthly Reports", value: "156",   color: "#2563EB", softColor: "rgba(37,99,235,0.1)"   },
    { label: "Compliance Rate", value: "98.5%", color: "#7C3AED", softColor: "rgba(124,58,237,0.1)"  },
    { label: "Data Points",     value: "2.1M",  color: "#D97706", softColor: "rgba(217,119,6,0.1)"   },
  ];

  const quickActions = [
    { icon: FiFileText, label: "New Report"      },
    { icon: FiBarChart, label: "View Analytics"  },
    { icon: FiMapPin,   label: "Manage Sites"    },
    { icon: FiSettings, label: "System Settings" },
  ];

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    mutate(swrKeys.me, null, { revalidate: false });
    window.location.href = "/";
  };

  const cardStyle = {
    bg: cardBg,
    border: "1px solid",
    borderColor: cardBorder,
    borderRadius: "16px",
    boxShadow: cardShadow,
    overflow: "hidden" as const,
  };

  // ─── Navbar ───────────────────────────────────────────────────────────────
  const NavBar = () => (
    <Box
      bg={navBg}
      borderBottom="1px solid"
      borderColor={navBorder}
      position="sticky"
      top={0}
      zIndex={1000}
      backdropFilter="blur(12px)"
    >
      {/* Thin accent line at very top */}
      <Box h="3px" bgGradient="linear(to-r, green.400, teal.400)" />

      <Container maxW="6xl">
        <Flex h="20" alignItems="center" justifyContent="space-between" py={4}>
          <HStack spacing={8} alignItems="center">
            <HStack spacing={2}>
              <Box
                w={8} h={8} borderRadius="lg" bg={accentGreenSoft}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Icon as={FiMapPin} color={accentGreen} boxSize={4} />
              </Box>
              <Heading size="md" color={strongText} fontWeight="700" letterSpacing="-0.02em">
                LandFill<Text as="span" color={accentGreen}>Pro</Text>
              </Heading>
            </HStack>

            <HStack as="nav" spacing={1} display={{ base: "none", md: "flex" }}>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  px={3} py={2}
                  borderRadius="8px"
                  fontSize="md" fontWeight="500"
                  color={subtleText}
                  _hover={{ textDecoration: "none", color: strongText, bg: hoverBg }}
                  transition="all 0.15s"
                >
                  {item.name}
                </Link>
              ))}
            </HStack>
          </HStack>

          <Spacer />

          <HStack spacing={2}>
            <IconButton
              size="md" variant="ghost"
              aria-label="Toggle color mode"
              icon={colorMode === "light" ? <FiMoon size={17} /> : <FiSun size={17} />}
              onClick={toggleColorMode}
              color={subtleText}
              borderRadius="8px"
              _hover={{ color: strongText, bg: hoverBg }}
            />

            <Menu>
              <MenuButton
                as={Button} size="md"
                rightIcon={<FiChevronDown size={15} />}
                variant="ghost"
                color={subtleText}
                fontWeight="500"
                fontSize="md"
                borderRadius="8px"
                _hover={{ color: strongText, bg: hoverBg }}
              >
                {user?.username || "Account"}
              </MenuButton>
              <MenuList
                bg={cardBg} border="1px solid" borderColor={cardBorder}
                borderRadius="12px" boxShadow={hoverShadow} py={1}
              >
                <MenuItem icon={<FiUsers size={13} />} fontSize="md" borderRadius="8px">Profile</MenuItem>
                <MenuItem icon={<FiSettings size={13} />} fontSize="md" borderRadius="8px" onClick={handleLogout}>
                  Log out
                </MenuItem>
              </MenuList>
            </Menu>

            <IconButton
              size="sm" variant="ghost"
              aria-label="Open menu"
              icon={<FiMenu size={17} />}
              onClick={onOpen}
              display={{ base: "flex", md: "none" }}
              color={subtleText} borderRadius="8px"
              _hover={{ color: strongText, bg: hoverBg }}
            />
          </HStack>
        </Flex>
      </Container>
    </Box>
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Box minH="100vh" bg={pageBg}>
      <NavBar />

      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay backdropFilter="blur(4px)" />
        <DrawerContent bg={drawerBg} borderLeft="1px solid" borderColor={cardBorder}>
          <DrawerCloseButton color={subtleText} />
          <DrawerHeader borderBottom="1px solid" borderColor={dividerColor} fontSize="md" fontWeight="600" color={strongText}>
            Navigation
          </DrawerHeader>
          <DrawerBody py={4}>
            <VStack spacing={1} align="stretch">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  px={4} py={3.5}
                  borderRadius="10px"
                  fontSize="md" fontWeight="500"
                  color={subtleText}
                  _hover={{ textDecoration: "none", color: strongText, bg: hoverBg }}
                  onClick={onClose}
                  transition="all 0.15s"
                >
                  {item.name}
                </Link>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Container maxW="6xl" py={10}>
        <VStack spacing={8} align="stretch">

          {/* ── Hero section ───────────────────────────────────────────────── */}
          <Box
            {...cardStyle}
            bgGradient={heroBgGradient}
            px={10} py={14} textAlign="center"
          >
            <VStack spacing={6}>
              <Badge
                px={3} py={1} borderRadius="full"
                bg={accentGreenSoft}
                color={accentGreen}
                fontSize="11px" fontWeight="600"
                letterSpacing="0.08em" textTransform="uppercase"
                border="1px solid" borderColor={dividerColor}
              >
                Landfill Management Platform
              </Badge>

              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                color={strongText}
                fontWeight="800"
                letterSpacing="-0.03em"
                lineHeight="1.15"
                maxW="3xl"
              >
                Comprehensive Landfill{" "}
                <Text as="span" color={accentGreen}>Management</Text>{" "}
                & Reporting
              </Heading>

              <Text fontSize="lg" color={subtleText} maxW="xl" lineHeight="1.75">
                Monitor, analyze, and report on landfill operations with real-time data insights,
                automated compliance reporting, and predictive analytics.
              </Text>

              <HStack spacing={3} pt={2}>
                <Button
                  leftIcon={<FiBarChart size={15} />}
                  bg={accentGreen} color="white"
                  borderRadius="10px" fontWeight="600" px={6}
                  _hover={{
                    bg: btnHoverBg,
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
                  }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.18s"
                >
                  View Dashboard
                </Button>
                <Button
                  leftIcon={<FiFileText size={15} />}
                  variant="ghost"
                  borderRadius="10px" fontWeight="600" px={6}
                  color={subtleText}
                  border="1px solid" borderColor={cardBorder}
                  _hover={{ color: strongText, bg: hoverBg }}
                  transition="all 0.15s"
                >
                  Generate Report
                </Button>
              </HStack>
            </VStack>
          </Box>

          {/* ── Stats ──────────────────────────────────────────────────────── */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            {stats.map((stat) => (
              <Box
                key={stat.label}
                {...cardStyle}
                px={5} py={5}
                textAlign="center"
                transition="all 0.2s"
                _hover={{ transform: "translateY(-2px)", boxShadow: hoverShadow }}
              >
                <Box
                  w={10} h={10} borderRadius="12px" mx="auto" mb={3}
                  bg={stat.softColor}
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <Text fontSize="xl" fontWeight="800" color={stat.color}>
                    {stat.value.charAt(0)}
                  </Text>
                </Box>
                <Text fontSize="2xl" fontWeight="800" color={stat.color} lineHeight="1">
                  {stat.value}
                </Text>
                <Text color={subtleText} fontSize="md" fontWeight="500" mt={1} letterSpacing="0.02em">
                  {stat.label}
                </Text>
              </Box>
            ))}
          </SimpleGrid>

          {/* ── News section ───────────────────────────────────────────────── */}
          <Box {...cardStyle}>
            <Box px={6} py={4} borderBottom="1px solid" borderColor={dividerColor}>
              <HStack justify="space-between" align="center">
                <HStack spacing={2}>
                  <Box
                    w={7} h={7} borderRadius="lg" bg={accentGreenSoft}
                    display="flex" alignItems="center" justifyContent="center"
                  >
                    <Icon as={FiFileText} color={accentGreen} boxSize={3.5} />
                  </Box>
                  <Text fontWeight="600" fontSize="lg" color={strongText}>
                    Latest News & Updates
                  </Text>
                </HStack>
                <Button
                  variant="ghost" size="sm"
                  rightIcon={<FiArrowRight size={13} />}
                  color={subtleText} fontWeight="500" fontSize="md"
                  borderRadius="8px"
                  _hover={{ color: strongText, bg: hoverBg }}
                >
                  View All
                </Button>
              </HStack>
            </Box>

            <Box p={6}>
              {isLoading && (
                <Text color={subtleText} fontSize="md" textAlign="center" py={8}>
                  Loading news…
                </Text>
              )}
              {error && (
                <Text color="red.400" fontSize="md" textAlign="center" py={8}>
                  Failed to load news.
                </Text>
              )}

              {news && news.length > 0 && (
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                  {news.map((article) => (
                    <Box
                      key={article.id}
                      bg={pageBg}
                      border="1px solid" borderColor={cardBorder}
                      borderRadius="12px"
                      p={5}
                      transition="all 0.2s"
                      _hover={{ transform: "translateY(-2px)", boxShadow: hoverShadow, borderColor: newsCardHoverBorder }}
                    >
                      <VStack align="start" spacing={3}>
                        <Badge
                          px={2.5} py={0.5} borderRadius="full"
                          colorScheme="blue" variant="subtle"
                          fontSize="11px" fontWeight="600"
                          letterSpacing="0.04em" textTransform="uppercase"
                        >
                          {article.source}
                        </Badge>

                        <Text
                          fontWeight="600" fontSize="md"
                          color={strongText} lineHeight="1.6"
                          noOfLines={2}
                        >
                          {article.title}
                        </Text>

                        <HStack justify="space-between" w="full">
                          <HStack spacing={1.5}>
                            <Icon as={FiClock} boxSize={3} color={subtleText} />
                            <Text fontSize="md" color={subtleText} fontWeight="500">
                              {formatDate(article.scrapedAt)}
                            </Text>
                          </HStack>

                          <Button
                            as="a"
                            href={article.url}
                            target="_blank"
                            size="xs"
                            variant="ghost"
                            rightIcon={<FiExternalLink size={11} />}
                            color={accentGreen}
                            fontWeight="600"
                            fontSize="xs"
                            borderRadius="6px"
                            _hover={{ bg: accentGreenSoft }}
                          >
                            Open
                          </Button>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </Box>
          </Box>

          {/* ── Quick Actions ──────────────────────────────────────────────── */}
          <Box {...cardStyle}>
            <Box px={6} py={4} borderBottom="1px solid" borderColor={dividerColor}>
              <HStack spacing={2}>
                <Box
                  w={7} h={7} borderRadius="lg" bg={accentGreenSoft}
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <Icon as={FiBarChart} color={accentGreen} boxSize={3.5} />
                </Box>
                <Text fontWeight="600" fontSize="lg" color={strongText}>
                  Quick Actions
                </Text>
              </HStack>
            </Box>

            <Box p={6}>
              <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={3}>
                {quickActions.map(({ icon, label }) => (
                  <Button
                    key={label}
                    leftIcon={<Icon as={icon} boxSize={4} />}
                    variant="ghost"
                    h={14}
                    borderRadius="12px"
                    border="1px solid" borderColor={cardBorder}
                    color={subtleText}
                    fontWeight="500"
                    fontSize="md"
                    _hover={{
                      color: accentGreen,
                      borderColor: accentGreen,
                      bg: accentGreenSoft,
                      transform: "translateY(-1px)",
                    }}
                    transition="all 0.18s"
                  >
                    {label}
                  </Button>
                ))}
              </SimpleGrid>
            </Box>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
}